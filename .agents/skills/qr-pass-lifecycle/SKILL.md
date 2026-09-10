---
name: qr-pass-lifecycle
description: >-
  Use this skill when implementing, testing, or auditing QR Digital Passes, ticket tokenization,
  and Staff validation workflows in AdventureOS, including race-condition prevention for double-spending
  and secure non-PII QR generation.
---

# QR Digital Pass & Access Validation Lifecycle

The Digital Pass (`DigitalPass`) is the customer's entitlement token to enter the park, race go-karts, or participate in activities. It is presented via mobile screen or printed receipt and validated by staff scanners.

---

## 1. Security Rules for QR Generation

1. **Zero PII in QR**:
   - The QR code MUST NEVER encode plain customer names, emails, phone numbers, or credit card details.
   - The QR payload contains ONLY a secure, unguessable cryptographic token:
     ```text
     https://sunkart.adventureos.com/verify-pass/[securityToken]
     ```
   - Or raw scanner token format:
     ```json
     {"v": 1, "t": "d9b2e7a1-8f3c-4c6e-b3d9-a72f0e6c5182"}
     ```

2. **State Machine**:
   - **`VALID`**: Pass is paid, waivers signed, ready for admission.
   - **`USED`**: Pass has already been redeemed at the gate/track. Cannot be reused.
   - **`CANCELLED`**: Order was cancelled or refunded.
   - **`REVOKED`**: Suspended by management for safety/disciplinary reasons.

---

## 2. Preventing Double-Redemption (Atomic Transaction)

Because multiple staff members could scan the same pass or a customer could share a screenshot with a friend, pass validation MUST be atomic using Prisma's conditional update:

```typescript
import { prisma } from "@/lib/prisma";

export async function redeemPass(securityToken: string, staffUserId: string) {
  return await prisma.$transaction(async (tx) => {
    // 1. Fetch pass with current status and order details
    const pass = await tx.digitalPass.findUnique({
      where: { securityToken },
      include: {
        order: {
          include: {
            customer: true,
            participants: { include: { signature: true } },
            items: { include: { experience: true } }
          }
        }
      }
    });

    if (!pass) {
      return { status: "NOT_FOUND", message: "Pass does not exist." };
    }

    if (pass.status === "USED") {
      return {
        status: "ALREADY_USED",
        usedAt: pass.usedAt,
        validatedBy: pass.validatedBy,
        passCode: pass.passCode
      };
    }

    if (pass.status !== "VALID") {
      return { status: pass.status, message: `Pass is currently ${pass.status}` };
    }

    // 2. Atomically update status to USED only if it's still VALID (prevents race conditions)
    const updated = await tx.digitalPass.updateMany({
      where: {
        id: pass.id,
        status: "VALID"
      },
      data: {
        status: "USED",
        usedAt: new Date(),
        validatedBy: staffUserId
      }
    });

    if (updated.count === 0) {
      return { status: "ALREADY_USED", message: "Pass was just redeemed in another scan." };
    }

    // 3. Log audit event
    await tx.auditLog.create({
      data: {
        tenantId: pass.order.tenantId,
        userId: staffUserId,
        action: "PASS_REDEEMED",
        entityType: "DigitalPass",
        entityId: pass.id,
        metadata: { passCode: pass.passCode, orderNumber: pass.order.orderNumber }
      }
    });

    return {
      status: "SUCCESS",
      order: pass.order,
      passCode: pass.passCode
    };
  });
}
```

---

## 3. Staff Scanner UX Guidelines

The Staff Validation Screen (`/dashboard/scanner`):
- Supports both hardware 2D barcode USB/Bluetooth scanners (acting as keyboard input) and device cameras via HTML5 QR reader.
- Visual feedback must be instant and high-contrast:
  - **Large Green Screen**: "PASS VALID — ADMIT 2 PARTICIPANTS" with high chime sound.
  - **Large Red Screen with Warning**: "ALREADY USED at 2:14 PM by Carlos" with buzzer sound.
  - **Amber Screen**: "WAIVER INCOMPLETE" or "PAYMENT PENDING".
- Displays participant names and waiver verification checkmarks so staff can verify physical identity.

---

## 4. Verification Checklist

- [ ] Does scanning an invalid/tampered token return a clean "Not Found" error without leaking stack traces?
- [ ] When simulated with 2 concurrent requests, does only 1 request succeed while the other receives `ALREADY_USED`?
- [ ] Is the QR image generated dynamically with high error correction (Level M or Q) so it scans easily off dim phone screens?
