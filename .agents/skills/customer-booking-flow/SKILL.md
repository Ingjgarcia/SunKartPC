---
name: customer-booking-flow
description: >-
  Use this skill when developing, testing, or styling the end-to-end customer booking experience in AdventureOS,
  covering the public catalog, date/participant selection, checkout calculations, bilingual UI (ES/EN),
  and Demo Mode toggle mechanisms.
---

# Customer Booking Flow & Public Funnel Runbook

The Customer Booking Flow is the revenue engine of AdventureOS. It must be mobile-first, friction-free, visually stunning, and bilingual (Spanish & English) to serve international tourists and locals in tourist destinations like Punta Cana.

---

## 1. Funnel Stages & Route Structure

```text
/ (Landing / Experiences)
  ↓
/experience/[slug] (Detail & Requirements)
  ↓
/booking (Participant Counts & Primary Contact)
  ↓
/waiver (Digital Waiver & E-Signatures)
  ↓
/checkout (Order Review & Payment Method Choice)
  ↓
/payment (Online Gateway / 3DS or Cashier Voucher QR)
  ↓
/success (Confirmation)
  ↓
/pass/[token] (Permanent Digital Pass Link)
```

---

## 2. Participant & Pricing Computation Rules

```typescript
export interface CartCalculationInput {
  unitPrice: number;
  quantity: number;
  taxRate: number;       // e.g. 0.18 for 18% ITBIS
  discountAmount?: number;
}

export function calculateOrderTotals(input: CartCalculationInput) {
  const subtotal = Number((input.unitPrice * input.quantity).toFixed(2));
  const discount = Number((input.discountAmount || 0).toFixed(2));
  const taxableAmount = Math.max(0, subtotal - discount);
  const tax = Number((taxableAmount * input.taxRate).toFixed(2));
  const total = Number((taxableAmount + tax).toFixed(2));

  return {
    subtotal,
    discount,
    tax,
    total
  };
}
```

---

## 3. Demo Mode Features

AdventureOS must maintain a reliable **Demo Mode** for sales pitches and investor walk-throughs:
- Clearly visible badge in header: `"DEMO MODE (No real charges)"`.
- At `/payment`:
  - Provide test buttons:
    - `[Simulate Approval (Instant Pass)]`
    - `[Simulate Card Declined]`
    - `[Simulate Pay at Cashier (Generates Voucher QR)]`
- Ensure demo orders do not pollute production analytics (filtered by `tenant_settings.demoMode = true`).

---

## 4. Internationalization (i18n)

Support both **Spanish** (default for Dominican parks) and **English** (for international tourists):
- Language switcher in public navigation (`ES | EN`).
- Store waiver versions with language codes (`"es"`, `"en"`).
- Currency display formatting:
  - USD: `$99.00 USD`
  - DOP: `RD$ 5,800.00 DOP`

---

## 5. Verification Checklist

- [ ] Does the booking funnel retain state if the customer navigates back a step?
- [ ] Is total tax (ITBIS) accurately broken down in the checkout summary?
- [ ] Does Demo Mode allow testing the entire customer-to-cashier cycle end-to-end without real credentials?
- [ ] Is mobile touch responsiveness verified on small viewport widths (375px+)?
