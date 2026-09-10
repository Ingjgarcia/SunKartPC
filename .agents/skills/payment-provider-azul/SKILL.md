---
name: payment-provider-azul
description: >-
  Use this skill when developing, testing, or configuring payment gateways in AdventureOS,
  specifically the decoupled PaymentProvider abstraction, Demo Mode Mock provider, and AZUL (Dominican Republic)
  hosted checkout/API integration, webhook verification, and 3DS response processing.
---

# Decoupled Payment Architecture & AZUL Gateway Integration

AdventureOS implements a decoupled payment architecture. The application never directly couples the frontend to a single payment processor, allowing tenants to operate in Demo Mode (simulated payments), AZUL (Dominican Republic), and future gateways (Stripe, CardNET) without touching frontend checkout logic.

---

## 1. Architectural Flow

```text
Customer Checkout
       │
       ▼
Next.js Route Handler: POST /api/payments/create
       │
       ▼
PaymentFactory.getProvider(tenantId)
       │
   ┌───┴───────────────────────────────┐
   ▼                                   ▼
MockPaymentProvider             AzulPaymentProvider
(Demo Mode / Tests)             (Banco Popular / AZUL)
   │                                   │
   │ Returns redirect URL              │ Calculates HMAC AuthHash
   │                                   │ Returns Hosted 3DS Page / Form
   ▼                                   ▼
Customer completes action       Customer approves card with 3DS
   │                                   │
   └───────────────┬───────────────────┘
                   ▼
Server-side Callback: POST /api/payments/callback
                   │
         verifyPayment(payload)
                   │
    [PaymentStatus = PAID]
                   │
    - Update Order: status = PAID
    - Generate DigitalPass (active QR)
    - Trigger Confirmation Email
```

---

## 2. Environment Variables & Credentials

All AZUL credentials MUST be kept strictly on the backend. Never expose them with `NEXT_PUBLIC_`:

```env
# AdventureOS Payment Gateway Configuration
PAYMENT_DEFAULT_PROVIDER=MOCK       # "MOCK" or "AZUL"

# AZUL Dominican Republic Credentials
AZUL_MERCHANT_ID=390XXXXXXXX
AZUL_MERCHANT_NAME="SunKart Park Punta Cana"
AZUL_AUTH_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
AZUL_ENVIRONMENT=TEST               # "TEST" or "PRODUCTION"
AZUL_API_URL=https://pruebas.azul.com.do/PaymentPage/
# Production URL: https://pagos.azul.com.do/PaymentPage/
```

---

## 3. AZUL Security & AuthHash Calculation

AZUL requires an HMAC-SHA512 hash (`AuthHash`) generated with the `AZUL_AUTH_KEY` to ensure payloads cannot be tampered with in transit.

```typescript
import crypto from "crypto";

export function generateAzulAuthHash(params: {
  merchantId: string;
  merchantName: string;
  merchantType: string;
  currencyCode: string;
  orderNumber: string;
  amount: string; // Formatted as "150000" for 1500.00
  itbis: string;
  approvedUrl: string;
  declinedUrl: string;
  cancelUrl: string;
  authKey: string;
}): string {
  const rawString = [
    params.merchantId,
    params.merchantName,
    params.merchantType,
    params.currencyCode,
    params.orderNumber,
    params.amount,
    params.itbis,
    params.approvedUrl,
    params.declinedUrl,
    params.cancelUrl
  ].join("");

  return crypto
    .createHmac("sha512", params.authKey)
    .update(rawString)
    .digest("hex");
}
```

---

## 4. Verification & Callback Handling

When AZUL sends the customer back to the `ApprovedUrl` or hits the server webhook:
1. Verify the incoming response signature/hash using `AZUL_AUTH_KEY`.
2. Ensure the order amount matches the recorded order in the database.
3. Check if `IsoCode === "00"` (Approved in ISO 8583 banking standard).
4. Run status transition within a Prisma transaction (`order.paymentStatus = 'PAID'`).

---

## 5. Security & PCI Compliance Checklist

- [ ] **No Card Data Storage**: Neither the database nor application logs store CVV, expiration date, or full credit card number (PAN). Only store the last 4 digits and authorization code returned by the gateway.
- [ ] **Mock Isolation**: `MockPaymentProvider` is only active when `tenant.settings.demoMode === true` or in development environments.
- [ ] **Idempotent Webhooks**: If AZUL sends repeated callbacks for the same order, the handler must check `order.paymentStatus === 'PAID'` and return `200 OK` without duplicating pass creation.
