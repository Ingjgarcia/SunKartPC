---
name: adventureos-architecture
description: >-
  Use this skill when developing, scaffolding, or refactoring AdventureOS (SunKart Park Management System),
  specifically for multi-tenant data isolation, RBAC role enforcement, Next.js App Router structure,
  Prisma modeling, and platform domain conventions.
---

# AdventureOS Multi-Tenant Architecture & Domain Conventions

AdventureOS is a multi-enterprise SaaS platform for adventure parks, go-karts, paintball, and tourist activity centers (first tenant: **SunKart Park Punta Cana**).

This skill guides development to ensure strict multi-tenant isolation, clean architectural layering, and adherence to the PRD specifications.

---

## 1. Multi-Tenancy Principles

1. **Strict Tenant Scoping (`tenantId`)**:
   - Every domain record (`experiences`, `orders`, `customers`, `waivers`, `cashier_sessions`, `digital_passes`) MUST be linked to a `Tenant`.
   - Every database query (except for `SUPER_ADMIN` cross-tenant queries) MUST filter by `tenantId`.
   - Never trust frontend inputs for `tenantId`; resolve it server-side from session or verified host/subdomain.

2. **Resolution Strategies**:
   - **Public Customer Portal**: Subdomain or path-based (e.g. `sunkart.adventureos.com` or header `X-Tenant-Slug`).
   - **Internal Staff / Cashier / Admin**: Resolved from the authenticated user's session (`session.user.tenantId`).
   - **Super Admin**: Platform-level user (`tenantId == null`) allowed to query across all tenants and switch tenant context.

3. **Prisma Reference Schema**:
   - Full schema is located at [schema.prisma](./references/schema.prisma). Always cross-reference entity relationships before adding new migrations.

---

## 2. Directory Structure (Next.js App Router)

```text
src/
├── app/
│   ├── (public)/                 # Customer-facing booking & waiver flow
│   │   ├── [tenantSlug]/
│   │   │   ├── page.tsx          # Landing / Experience selection
│   │   │   ├── experience/[slug]/# Experience detail
│   │   │   ├── booking/          # Participant count & details
│   │   │   ├── waiver/           # Digital waiver & e-signature
│   │   │   ├── checkout/         # Order summary & method choice
│   │   │   ├── payment/          # Payment processing / 3DS
│   │   │   ├── success/          # Confirmation screen
│   │   │   └── pass/[token]/     # Customer digital QR pass
│   ├── (auth)/
│   │   └── login/                # Staff/Admin/Cashier Login
│   ├── (dashboard)/              # Protected backoffice
│   │   ├── cashier/              # Fast POS interface for tablets/desktops
│   │   ├── scanner/              # Staff QR validation interface
│   │   ├── admin/                # Business Admin (experiences, reports, waivers)
│   │   └── super-admin/          # Platform Admin (tenants, subscriptions)
│   └── api/
│       ├── auth/[...nextauth]/
│       ├── experiences/
│       ├── orders/
│       ├── waivers/
│       ├── payments/
│       └── passes/
├── components/
│   ├── customer/                 # Public booking components
│   ├── pos/                      # Cashier touch-optimized UI
│   ├── waiver/                   # Canvas signature & legal versioning
│   └── ui/                       # Shared Tailwind/Radix primitives
├── lib/
│   ├── prisma.ts                 # Prisma client instance with tenant extensions
│   ├── auth.ts                   # Auth.js / NextAuth configuration
│   ├── payments/                 # Decoupled Payment Providers (Mock, Azul)
│   └── qr.ts                     # Secure token generation & verification
└── types/                        # Shared TypeScript interfaces
```

---

## 3. RBAC Roles & Permissions Matrix

| Role | Scope | Permitted Actions |
|---|---|---|
| **SUPER_ADMIN** | Platform | Create/disable tenants, manage billing, view global system metrics, audit logs. |
| **BUSINESS_ADMIN** | Single Tenant | Manage experiences, prices, waivers, view reports, export financial KPIs, manage staff users. |
| **CASHIER** | Single Tenant | Open/close cashier sessions, search orders by code/phone/QR, accept cash & POS payments, print receipts. |
| **STAFF** | Single Tenant | Scan & validate QR digital passes, verify waiver completion, mark passes as used. |
| **CUSTOMER** | Public | Browse catalog, register participants, sign waivers, create orders, view digital pass. |

---

## 4. API Response Standard

All API Route Handlers must return a consistent JSON response:

```typescript
// Success
return NextResponse.json({
  success: true,
  data: result,
  timestamp: new Date().toISOString()
}, { status: 200 });

// Error
return NextResponse.json({
  success: false,
  error: {
    code: "ORDER_ALREADY_PAID",
    message: "This order has already been paid and activated."
  },
  timestamp: new Date().toISOString()
}, { status: 400 });
```

---

## 5. Verification & Checklist

When implementing features under this architecture:
- [ ] Check that `tenantId` is included in where-clauses and insert payloads.
- [ ] Ensure non-sensitive errors are shown to customers while full errors are logged to `audit_logs`.
- [ ] Verify that sensitive card data (CVV, full PAN) is NEVER stored in database tables or logs.
