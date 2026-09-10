---
name: pos-cashier-workflow
description: >-
  Use this skill when developing, testing, or refining the Cashier POS (Point of Sale) module in AdventureOS,
  including fast order search, cashier sessions (opening/closing cash drawer), on-site payment collection,
  order status transitions, and thermal receipt generation.
---

# Cashier POS (Point of Sale) & Cash Management Runbook

The Cashier POS (`/dashboard/cashier`) is the central tool for park front-desk staff. It must be optimized for fast-paced physical counter environments, high-touch screen responsiveness (tablets & desktop POS), and rapid order lookup.

---

## 1. Core Cashier Workflow

```text
Customer arrives at Cashier Desk
           │
   ┌───────┴────────────────────────┐
   ▼                                ▼
Customer has QR / Order #       Customer has Name / Phone
(from online booking)           (needs staff lookup)
   │                                │
   └───────┬────────────────────────┘
           ▼
Fast Search Bar (Debounced auto-focus)
           │
           ▼
Order Summary Card:
- Customer Name & Emergency Contact
- Experience / Package breakdown
- Waiver clearance status (All signed? Minor verified?)
- Total due with ITBIS tax breakdown
           │
           ▼
Select Payment Method:
- CASH (Calculate change given)
- CARD_POS (Physical card terminal terminal authorization code)
           │
           ▼
"Collect Payment & Activate Pass"
           │
- Updates Order to PAID
- Issues DigitalPass / Generates QR
- Optional: Print 80mm Thermal Receipt
```

---

## 2. Cashier Session & Cash Control

Every cashier transaction must belong to an open `CashierSession`:
1. **Opening Session**:
   - Cashier enters initial cash float (`openingFloat`, e.g. $100.00 USD / DOP 5,000).
   - Session marked as `OPEN`.
2. **Shift Active**:
   - All cash and card payments record `cashierSessionId`.
   - Real-time KPIs display:
     - Cash collected
     - Card POS collected
     - Number of orders processed
3. **Closing Session (X/Z Report)**:
   - Cashier counts physical cash drawer and enters `closingFloat`.
   - System calculates expected cash vs actual cash difference (overage/shortage).
   - Session marked as `CLOSED`.

---

## 3. Fast Search Requirements

The search input MUST support:
- Exact order number (e.g. `SK-001042`)
- Partial customer full name (case-insensitive)
- Customer phone number or email
- Direct scanner input (when barcode reader scans customer's pending order QR)

**Prisma Search Query Pattern:**
```typescript
export async function searchOrders(tenantId: string, query: string) {
  const cleanQuery = query.trim();
  return await prisma.order.findMany({
    where: {
      tenantId,
      OR: [
        { orderNumber: { contains: cleanQuery, mode: "insensitive" } },
        { customer: { firstName: { contains: cleanQuery, mode: "insensitive" } } },
        { customer: { lastName: { contains: cleanQuery, mode: "insensitive" } } },
        { customer: { phone: { contains: cleanQuery } } },
        { customer: { email: { contains: cleanQuery, mode: "insensitive" } } },
        { pass: { passCode: { contains: cleanQuery, mode: "insensitive" } } }
      ]
    },
    include: {
      customer: true,
      items: { include: { experience: true } },
      participants: { include: { signature: true } },
      pass: true
    },
    orderBy: { createdAt: "desc" },
    take: 20
  });
}
```

---

## 4. 80mm Thermal Receipt Layout

When "Print Receipt" is triggered, format cleanly with CSS `@media print`:
- Width: `80mm` or `58mm`
- Tenant Logo & Business Name
- RNC / Tax ID & Address
- Order # and Date/Time
- Itemized Experiences & Participants
- Subtotal, ITBIS (18%), Total
- Payment Method & Cashier Name
- QR code for access pass validation
- Legal waiver acknowledgement note

---

## 5. Verification Checklist

- [ ] Does cashier login automatically verify if there is an active open session?
- [ ] Can an order be located in under 2 seconds using barcode scanner or 3 digits of order code?
- [ ] Does collecting payment immediately flip the digital pass to `VALID`?
- [ ] Is cash change calculation provided automatically to prevent cashier math errors?
