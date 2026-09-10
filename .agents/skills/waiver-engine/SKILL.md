---
name: waiver-engine
description: >-
  Use this skill when implementing, modifying, or testing the Digital Waiver and Electronic Signature module
  in AdventureOS, including immutable versioning, minor/guardian consent verification, canvas signature capture,
  and legal audit logging.
---

# Digital Waiver & Electronic Signature Engine

The Waiver System is a core pillar of AdventureOS. Unlike standard terms-and-conditions checkboxes, recreational and adventure parks (go-karts, ziplines, ATV) require legally binding digital waivers, minor liability consent, and tamper-proof audit trails.

---

## 1. Core Principles & Rules

1. **Immutable Versioning (Never Overwrite)**:
   - When a tenant updates their legal waiver, a new `WaiverVersion` (v2, v3) is created.
   - Never update existing `WaiverVersion.legalText` in-place.
   - Historical signatures MUST always link to the exact `versionId` the customer reviewed and signed.

2. **Full Legal Audit Trail**:
   Every signature record (`WaiverSignature`) must capture:
   - `participantName` & `participantDob`
   - `isMinor` (calculated from DOB vs tenant minimum legal age, usually 18)
   - `signatureData` (Base64 PNG from HTML5 canvas or SVG path data)
   - `acceptedTerms` (Boolean, must be true)
   - `ipAddress` (extracted from request headers `x-forwarded-for` or `cf-connecting-ip`)
   - `userAgent` (browser fingerprint)
   - `signedAt` (UTC timestamp)

3. **Minor / Guardian Consent Rule**:
   - If `participantDob` indicates age < 18:
     - Form MUST require: `guardianName`, `guardianDob`, `guardianRelation`, `guardianEmail`, `guardianPhone`, and guardian's explicit consent and signature.
     - Validation must reject submission if minor details are present without complete guardian certification.

---

## 2. Participant Validation Logic

```typescript
export function validateParticipantAge(dob: string | Date, minLegalAge = 18): {
  isMinor: boolean;
  age: number;
} {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return {
    isMinor: age < minLegalAge,
    age
  };
}
```

---

## 3. Signature Capture Implementation

The signature component should provide:
- HTML5 Canvas with smooth quadratic curves (e.g. `signature_pad` or custom touch/pointer event listener).
- Clear button to reset signature.
- Minimum stroke validation (ensure user drew something substantive, not just an accidental dot or empty canvas).
- Export as optimized Base64 data URL: `image/png;base64,...`.

```typescript
// Minimum stroke length / data validation helper
export function isValidSignature(dataUrl: string, minDataLength = 2000): boolean {
  if (!dataUrl || !dataUrl.startsWith("data:image/png;base64,")) {
    return false;
  }
  return dataUrl.length >= minDataLength;
}
```

---

## 4. Submission Flow & API Contract

**Endpoint:** `POST /api/waivers/[versionId]/sign`

**Request Payload:**
```json
{
  "orderId": "opt_order_id_if_booking",
  "participantName": "Carlos Mendoza",
  "participantDob": "2009-05-14",
  "guardian": {
    "name": "Maria Mendoza",
    "dob": "1978-11-20",
    "relation": "Mother",
    "email": "maria@example.com",
    "phone": "+1-809-555-0123"
  },
  "signatureData": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
  "acceptedTerms": true
}
```

**Verification Steps in Handler:**
1. Fetch the active `WaiverVersion` for the tenant.
2. Verify DOB and check whether guardian block is required.
3. Extract IP address from request headers (`x-forwarded-for` or connection remoteAddress).
4. Save `WaiverSignature` inside a database transaction.
5. If `orderId` is provided, update `Participant.signatureId` to mark the participant as cleared.

---

## 5. Verification Checklist

- [ ] Does changing waiver text create a new version row rather than editing existing?
- [ ] Is minor detection automatic based on date of birth input?
- [ ] Are IP and user-agent properly saved for compliance?
- [ ] Can an admin review the exact version text and signature for any past customer order?
