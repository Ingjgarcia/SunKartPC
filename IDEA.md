# PRD — SunKart Park / Adventure Park Management System

**Versión:** 1.0  
**Objetivo:** convertir el demo existente en un producto comercial SaaS para parques de aventura, entretenimiento y actividades turísticas.

---

## 1. Resumen ejecutivo

El producto será una plataforma web que centraliza:

**Venta → Waiver → Pago → QR → Caja → Validación → Dashboard**

El flujo actual del demo demuestra esa idea:

1. Customer
2. Selecciona experiencia
3. Completa waiver
4. Firma electrónicamente
5. Hace checkout
6. Puede pagar online
7. O recibe QR para pagar en caja
8. Cashier busca la orden
9. Dashboard muestra órdenes, pagos y revenue.

La oportunidad comercial está en convertir ese flujo en una plataforma multiempresa.

---

# 2. Producto final

Nombre de trabajo:

### AdventureOS

Alternativa:

### SunKart Manager

Recomendación: usar **AdventureOS** como nombre del producto y que SunKart sea el primer cliente/tenant.

Ejemplo:

> AdventureOS  
> Powered by [tu empresa]

Dentro de la plataforma:

> SunKart Park Punta Cana

Esto permite vender el mismo software a:

- parques de aventura
- go-karts
- paintball
- ATV
- zipline
- parques acuáticos
- tours
- excursiones
- experiencias turísticas
- centros recreativos

---

# 3. Usuarios

## Customer

Puede:

- seleccionar experiencia
- registrar participantes
- completar waiver
- firmar
- comprar
- recibir confirmación
- recibir QR

## Cashier

Puede:

- iniciar sesión
- buscar órdenes
- cobrar
- validar pagos
- generar/consultar pases

## Staff

Puede:

- validar QR
- verificar waiver
- verificar pago
- marcar pase como utilizado

## Business Admin

Puede:

- administrar productos
- administrar precios
- ver ventas
- administrar empleados
- ver clientes
- configurar waiver
- consultar reportes

## Super Admin

Tu equipo puede:

- crear empresas
- administrar tenants
- administrar planes
- administrar suscripciones
- ver métricas globales
- soporte
- control administrativo

---

# 4. Customer Flow

Este es el corazón del producto.

```text
LANDING
   ↓
CHOOSE EXPERIENCE
   ↓
SELECT PARTICIPANTS
   ↓
CUSTOMER INFORMATION
   ↓
WAIVER
   ↓
E-SIGNATURE
   ↓
CHECKOUT
   ↓
PAY ONLINE ─────────┐
                    ↓
              PAYMENT SUCCESS
                    ↓
              CREATE PASS
                    ↓
                    QR
```

Flujo alternativo:

```text
CHECKOUT
   ↓
PAY AT CASHIER
   ↓
CREATE PENDING ORDER
   ↓
GENERATE QR
   ↓
CUSTOMER GOES TO CASHIER
   ↓
CASHIER FINDS ORDER
   ↓
PAYMENT
   ↓
PAID
   ↓
PASS ACTIVE
```

---

# 5. Pantallas

## CUSTOMER

### `/`

Landing / selección de experiencia.

### `/experiences`

Listado de actividades.

### `/experience/:slug`

Detalle de actividad.

Mostrar:

- imagen
- descripción
- precio
- duración
- edad
- altura
- capacidad
- requisitos
- actividades incluidas

### `/booking`

Información de participantes.

### `/waiver`

Formulario de waiver.

Información:

- nombre legal
- fecha de nacimiento
- email
- teléfono
- contacto de emergencia
- aceptación del waiver
- firma electrónica

### `/checkout`

Resumen:

```text
Experience
Participants
Subtotal
Taxes
Discount
Total
```

Métodos:

- Online
- Cashier

### `/payment`

Pago.

### `/success`

Confirmación.

### `/pass/:id`

Pase digital.

---

# 6. Waiver System

Este módulo es uno de los elementos que diferencia el producto de un simple sistema de reservas.

## Información

```text
Customer
DOB
Email
Phone
Emergency contact
Participant
Guardian
Waiver version
Signature
Timestamp
IP
```

## Versionamiento

Nunca sobrescribir un waiver existente.

Ejemplo:

```text
Waiver v1
Waiver v2
Waiver v3
```

Si el parque modifica el documento:

> los nuevos clientes aceptan v3.

Los clientes anteriores conservan:

> v2.

Esto es importante para auditoría.

**Nota legal:** el texto legal del demo es demostrativo. El negocio debe proporcionar o aprobar su documento legal definitivo.

---

# 7. Menores

Flujo:

```text
Participant age < minimum
       ↓
Is minor?
       ↓
YES
       ↓
Parent/Guardian
       ↓
Guardian name
Guardian DOB
Guardian relationship
Guardian email
Guardian phone
Guardian signature
       ↓
Consent
```

Debe formar parte del MVP.

---

# 8. Experience Management

Admin:

```text
Experiences
 ├── Go Kart
 ├── Paintball
 ├── ATV
 ├── Zipline
 ├── Sky Adventure
 └── Packages
```

Cada experiencia:

```text
id
tenant_id
name
slug
description
price
currency
duration
minimum_age
maximum_age
minimum_height
maximum_height
capacity
active
image
waiver_required
```

---

# 9. Packages

Ejemplo:

### Adventure Package

Incluye:

- Go Kart
- Paintball
- Sky Adventure

Precio:

**US$99**

En base de datos:

```text
products
product_items
```

Esto permite modificar las actividades incluidas sin crear un producto completamente nuevo.

---

# 10. Order System

Estados:

```text
DRAFT
PENDING_PAYMENT
PAID
PARTIALLY_PAID
CANCELLED
REFUNDED
COMPLETED
```

Una orden:

```text
SK-000123
```

Debe tener:

```text
tenant
customer
participants
products
subtotal
discount
tax
total
payment_status
order_status
payment_method
created_at
```

---

# 11. QR System

Cada orden genera un identificador único.

Ejemplo:

```text
SK-PASS-7F82A91D
```

El QR **no debe contener información personal directamente**.

Debe contener un token seguro.

Ejemplo conceptual:

```text
https://app.com/pass/7F82A91D
```

Al escanear:

```text
VALID
```

o:

```text
ALREADY USED
```

o:

```text
CANCELLED
```

El sistema debe impedir que un pase pueda utilizarse dos veces.

---

# 12. Cashier POS

El demo contempla:

- login
- búsqueda por order code
- órdenes recientes
- pago
- logout

En producción:

## POS Dashboard

```text
Today's Sales
Today's Orders
Pending
Paid
Refunds
```

## Search

```text
Order #
Customer
Phone
Email
QR
```

## Order

```text
Customer
Participants
Experience
Waiver
Amount
Payment
```

Botones:

- Collect Payment
- Print Receipt
- Activate Pass
- Cancel

---

# 13. Dashboard

El dashboard debe convertirse en un verdadero centro de operaciones.

## KPIs

```text
Revenue Today
Orders Today
Participants Today
Average Order
Pending Orders
Refunds
```

## Charts

Ventas:

```text
Mon
Tue
Wed
Thu
Fri
Sat
Sun
```

Revenue por experiencia.

Payment method:

```text
Online
Cash
Card POS
Other
```

---

# 14. Base de datos

Recomendación:

**PostgreSQL + Prisma**

Schema inicial:

```text
tenants
users
roles
customers

experiences
experience_items

bookings
booking_participants

waivers
waiver_versions
waiver_signatures

orders
order_items

payments
payment_transactions

passes

cashier_sessions

notifications
audit_logs

subscriptions
subscription_plans

tenant_settings
```

---

# 15. Relaciones principales

```text
TENANT
 │
 ├── USERS
 │
 ├── CUSTOMERS
 │
 ├── EXPERIENCES
 │
 ├── ORDERS
 │      │
 │      ├── ORDER ITEMS
 │      ├── PARTICIPANTS
 │      ├── PAYMENTS
 │      └── PASS
 │
 └── WAIVERS
```

---

# 16. Multi-Tenant

Esto es fundamental.

No construir primero una aplicación exclusivamente para SunKart.

Construir:

```text
Platform
   │
   ├── SunKart
   │
   ├── Adventure Park B
   │
   ├── Paintball C
   │
   └── ATV D
```

Cada registro importante debe tener:

```text
tenant_id
```

Cada consulta debe filtrar por tenant.

Esto evita que un cliente vea datos de otro.

---

# 17. Arquitectura

Recomendación:

```text
Next.js
TypeScript
Tailwind
PostgreSQL
Prisma
Auth
S3-compatible storage
```

Arquitectura:

```text
                    ┌─────────────┐
                    │   Customer  │
                    └──────┬──────┘
                           │
                           ▼
                    ┌─────────────┐
                    │   Next.js   │
                    └──────┬──────┘
                           │
                           ▼
                    ┌─────────────┐
                    │ API / Server│
                    └──────┬──────┘
                           │
             ┌─────────────┼─────────────┐
             ▼             ▼             ▼
        PostgreSQL       Payments       Storage
                           │
                           ▼
                         AZUL
```

---

# 18. AZUL

AZUL ofrece mecanismos para:

- E-commerce API
- Página de pago
- Link de pagos
- 3DS
- tokenización
- POS
- caja integrada

## Arquitectura correcta

No:

```text
Frontend → AZUL
```

Sí:

```text
Frontend
   ↓
Backend
   ↓
Payment Service
   ↓
AZUL
```

Crear:

```text
PaymentProvider
```

con:

```text
createPayment()
verifyPayment()
refundPayment()
cancelPayment()
```

Implementaciones:

```text
MockProvider
AzulProvider
StripeProvider
```

Esto permite vender el mismo producto en distintos países.

---

# 19. API

Endpoints principales:

```text
POST /api/auth/login

GET /api/experiences
POST /api/experiences
PUT /api/experiences/:id
DELETE /api/experiences/:id

POST /api/bookings
GET /api/bookings/:id

POST /api/waivers
POST /api/waivers/:id/sign

POST /api/orders
GET /api/orders/:id

POST /api/payments
GET /api/payments/:id

POST /api/payments/webhook

GET /api/passes/:id
POST /api/passes/:id/validate
POST /api/passes/:id/use

GET /api/dashboard

GET /api/customers
```

---

# 20. Seguridad

Obligatorio:

- HTTPS
- password hashing
- RBAC
- tenant isolation
- rate limiting
- validation
- audit logs
- backups
- secure cookies/session
- server-side authorization

Nunca guardar:

- CVV
- números de tarjeta completos
- secretos de autenticación de pagos

---

# 21. MVP

No construir todo inicialmente.

## CUSTOMER

- Experiences
- Booking
- Participant
- Waiver
- Signature
- Checkout
- Mock Payment
- QR

## CASHIER

- Login
- Search Order
- Payment
- Order status
- QR

## ADMIN

- Dashboard
- Orders
- Experiences
- Customers

## BACKEND

- PostgreSQL
- Authentication
- Roles
- Tenant
- Audit log

Esto es suficiente para conseguir el primer cliente.

---

# 22. Funciones que NO construir todavía

No gastar dinero inicialmente en:

- aplicación iPhone
- aplicación Android
- loyalty program
- gift cards
- memberships
- marketing automation
- advanced CRM
- inventory
- accounting
- AI
- WhatsApp automation
- marketplace
- múltiples países

Primero:

**hacer dinero con el producto.**

---

# 23. Estimación de desarrollo

Estimación de horas:

| Módulo | Horas |
|---|---:|
| UI/UX | 25–40 |
| Customer flow | 30–45 |
| Waiver | 20–30 |
| Booking | 25–40 |
| Orders | 20–30 |
| QR | 10–15 |
| POS | 25–40 |
| Dashboard | 20–30 |
| Auth/Roles | 15–25 |
| Database | 15–25 |
| Multi-tenant | 25–40 |
| Payment architecture | 15–25 |
| AZUL | 25–50 |
| Testing | 25–40 |
| Deployment | 10–20 |

### Total MVP realista

**300–500 horas**

---

# 24. Costo de construcción

Estimación de desarrollo externo:

### Económico

**US$8,000–12,000**

### Profesional

**US$15,000–25,000**

### Agencia / equipo senior

**US$25,000–40,000+**

Estrategia recomendada:

### Construir MVP por aproximadamente

**US$8,000–15,000**

y no construir todavía el SaaS completo.

Conseguir:

> 1 cliente piloto.

Utilizar ese cliente para financiar las siguientes versiones.

---

# 25. Precio de venta

No vender como:

> “Página web: US$2,000”

Eso reduce demasiado el valor.

Vender como:

> **Software de gestión para parques**

## Setup

**US$2,500–5,000**

Incluye:

- configuración
- branding
- productos
- waiver
- usuarios
- capacitación
- implementación
- deployment

## Mensualidad

**US$199–399/mes**

Dependiendo del tamaño.

---

# 26. Planes SaaS

## STARTER

**US$149/mes**

- 1 location
- booking
- waiver
- POS
- QR
- dashboard
- 3 usuarios

## BUSINESS

**US$299/mes**

- todo Starter
- pagos online
- reportes
- clientes
- 10 usuarios
- branding
- automatizaciones

## ENTERPRISE

**US$499+/mes**

- múltiples locations
- usuarios ilimitados
- API
- custom integrations
- priority support
- advanced reports

---

# 27. Economía de un cliente

Ejemplo:

Setup:

**US$3,500**

Mensual:

**US$299**

Primer año:

```text
$3,500 + ($299 × 12)
= US$7,088
```

Con 10 parques:

```text
US$70,880 primer año
```

Posteriormente:

```text
US$2,990 MRR
```

sin contar nuevos setups.

---

# 28. Costos mensuales

Al inicio:

- hosting
- PostgreSQL
- storage
- email
- monitoring
- backups
- dominio
- soporte

El costo importante será:

**soporte + desarrollo + pagos + infraestructura a medida que crezca.**

Los costos de AZUL deben tratarse como costos del comercio/merchant cuando corresponda y no necesariamente absorberlos dentro de tu tarifa de software.

---

# 29. Primer cliente

Utilizar **SunKart Park Punta Cana como caso piloto**.

No vender inicialmente:

> “un SaaS completo”.

Vender:

> **Digital Booking + Waiver + POS System**

Pitch:

> “El cliente reserva desde su teléfono, firma el waiver antes de llegar, paga online o en caja y recibe un QR. El equipo del parque puede encontrar la orden y validar al visitante desde el POS.”

---

# 30. Roadmap

## FASE 1 — Recuperación

**1–2 semanas**

Recrear fielmente:

- Customer
- Waiver
- Checkout
- Payment demo
- Cashier
- Dashboard

---

## FASE 2 — MVP

**4–8 semanas**

Agregar:

- PostgreSQL
- Auth
- Users
- Orders
- Customers
- Waivers
- QR
- POS
- Admin

---

## FASE 3 — Producción

**3–5 semanas**

Agregar:

- AZUL
- email
- backups
- logs
- security
- monitoring
- deployment

---

## FASE 4 — SaaS

**4–8 semanas**

Agregar:

- multi-tenant completo
- subscriptions
- billing
- tenant onboarding
- white-label
- plans
- Super Admin

---

# 31. Recomendación estratégica

No reconstruir solamente “la página”.

Reconstruir:

> **el motor detrás de la página.**

La página es reemplazable.

El verdadero producto es:

```text
                   ADVENTUREOS
                        │
        ┌───────────────┼───────────────┐
        │               │               │
     BOOKING         WAIVER           POS
        │               │               │
        └───────────────┼───────────────┘
                        │
                     ORDERS
                        │
              ┌─────────┴─────────┐
              │                   │
           PAYMENT               QR
              │                   │
              └─────────┬─────────┘
                        │
                    DASHBOARD
```

Ese es el activo que puedes vender 10, 50 o 100 veces.

---

# 32. Valoración del demo

Como demo comercial, la idea está bien enfocada.

El sitio comunica una propuesta funcional concreta y demuestra un flujo completo:

**experiencia → waiver → checkout → pago/QR → cashier → dashboard**

Lo que falta para convertirlo en producto comercial:

- Base de datos
- autenticación real
- multi-tenancy
- persistencia
- seguridad
- pagos reales
- administración
- infraestructura
- testing
- monitoreo

La conclusión es que el demo representa principalmente el **prototipo funcional/UX**, mientras que todavía falta construir la capa empresarial y de producción.

---

# 33. Prompt maestro para reconstruir el sistema

Usar este prompt en Cursor, Claude Code, Lovable, Bolt, Replit u otra herramienta de desarrollo:

```text
Quiero reconstruir y convertir en un producto SaaS/white-label el sistema web actualmente disponible en:

https://batowingllc.com/test/

Analiza primero la aplicación existente y reproduce su funcionalidad, flujo de usuario y diseño visual. NO quiero simplemente copiar el HTML actual; quiero reconstruir el producto de forma profesional, escalable y lista para producción.

## CONCEPTO DEL PRODUCTO

La aplicación es un sistema para parques de entretenimiento y actividades que permite administrar:

- Reservaciones/ventas de experiencias
- Paquetes de actividades
- Registro de participantes
- Waivers digitales
- Firma electrónica
- Consentimiento de padres/tutores para menores
- Checkout
- Pagos online
- Pagos en caja
- QR para órdenes
- POS para cajeros
- Dashboard administrativo
- Clientes
- Órdenes
- Ingresos
- Estado de pagos

El producto debe poder utilizarse posteriormente para distintos negocios, no solamente SunKart Park Punta Cana.

Por lo tanto, separar completamente:

1. Tenant/negocio
2. Usuarios
3. Clientes
4. Productos/experiencias
5. Reservaciones
6. Waivers
7. Órdenes
8. Pagos
9. Caja/POS
10. Reportes
11. Configuración

## ROLES

Crear inicialmente:

### Super Admin
Administra todos los negocios/tenants.

### Business Admin
Administra su negocio.

### Cashier
Puede cobrar órdenes y consultar órdenes.

### Staff
Puede validar participantes, waivers y pases.

### Customer
Puede comprar experiencias, completar waiver y recibir su pase.

## CUSTOMER FLOW

El cliente debe poder:

1. Entrar al sitio.
2. Seleccionar una experiencia/paquete.
3. Ver nombre, descripción, precio, duración, edad mínima, altura mínima, número de participantes y actividades incluidas.
4. Seleccionar cantidad de participantes.
5. Completar información del participante principal.
6. Completar waiver.
7. Aceptar términos.
8. Firmar electrónicamente.
9. Si es menor, solicitar información del padre/madre/tutor.
10. Ir al checkout.
11. Seleccionar:
   - Pago online
   - Pago en caja
12. Si paga online:
   - Crear orden
   - Procesar pago
   - Confirmar pago
13. Si paga en caja:
   - Crear orden pendiente
   - Crear código de orden
   - Crear QR
14. Mostrar confirmación.
15. Generar pase digital.

## WAIVER DIGITAL

Crear un módulo profesional de waivers.

Cada negocio puede crear y modificar su propio waiver.

Guardar:

- versión
- fecha de aceptación
- IP
- timestamp
- nombre legal
- fecha de nacimiento
- email
- teléfono
- firma
- participante
- tutor cuando corresponda
- versión aceptada

El texto legal del demo es solamente un ejemplo. El negocio debe aprobar el documento legal definitivo.

## PRODUCTOS / EXPERIENCIAS

CRUD completo:

- id
- tenant_id
- name
- slug
- description
- price
- currency
- duration
- minimum_age
- maximum_age
- minimum_height
- maximum_height
- capacity
- active
- waiver_required
- image
- activities
- created_at
- updated_at

Permitir paquetes compuestos por múltiples actividades.

## ORDERS

Estados:

- draft
- pending_payment
- paid
- partially_paid
- cancelled
- refunded
- completed

Cada orden debe tener:

- order_number
- customer
- participants
- products
- quantity
- subtotal
- taxes
- discount
- total
- payment_status
- order_status
- payment_method
- cashier
- created_at

## QR PASS

Generar QR único.

El QR debe contener solamente un identificador/token seguro.

Crear pantalla de validación.

Mostrar:

- número de orden
- cliente
- actividades
- participantes
- pago
- waiver status
- pass status

Estados:

- VALID
- USED
- CANCELLED
- REVOKED

Evitar doble uso.

## CASHIER POS

Crear interfaz POS independiente.

Debe permitir:

- login
- ventas del día
- órdenes pendientes
- órdenes pagadas
- ingresos
- búsqueda por order code
- customer name
- phone
- QR
- cobrar
- cambiar método de pago
- marcar pagada
- recibo
- generar QR
- cancelar

Optimizar para tablet y desktop.

## PAYMENT SYSTEM

Crear una arquitectura de pagos desacoplada.

No hardcodear AZUL directamente en el frontend.

Crear:

PaymentProvider

Implementaciones:

- MockPaymentProvider
- AzulPaymentProvider
- posteriormente StripePaymentProvider
- posteriormente CardNETPaymentProvider

Métodos:

- createPayment()
- verifyPayment()
- refundPayment()
- voidPayment()
- getPaymentStatus()

Nunca almacenar CVV ni datos sensibles de tarjeta.

## AZUL

Preparar integración real mediante backend seguro.

Variables:

AZUL_MERCHANT_ID
AZUL_AUTH_KEY
AZUL_ENVIRONMENT
AZUL_API_URL

Nunca colocar credenciales en frontend.

Soportar:

- approved
- declined
- pending
- cancelled
- refunded
- error

Implementar callbacks/webhooks y verificación server-side.

## DASHBOARD

KPIs:

- Sales today
- Revenue today
- Orders today
- Paid orders
- Pending orders
- Participants today
- Waivers completed
- Waivers pending

Charts:

- sales by day
- revenue by activity
- payment methods
- orders by status

Filtros:

- today
- yesterday
- last 7 days
- last 30 days
- custom range

## CUSTOMER DATABASE

Crear CRM básico.

Customer profile:

- name
- DOB
- email
- phone
- emergency contact
- waiver history
- purchase history
- total spent
- visits
- last visit

## MULTI-TENANT

El producto debe ser multi-tenant.

Ejemplo:

Tenant A: SunKart Park
Tenant B: Adventure Punta Cana
Tenant C: Caribbean Paintball

Cada tenant tiene:

- branding
- logo
- colors
- products
- prices
- waiver
- users
- orders
- customers
- settings

Los datos de un tenant nunca deben aparecer en otro.

## ADMIN SETTINGS

- business name
- logo
- address
- phone
- email
- currency
- timezone
- tax
- receipt settings
- waiver
- payment settings
- notification settings
- branding

## NOTIFICATIONS

Preparar:

- email confirmation
- payment confirmation
- pending payment
- waiver reminder
- booking reminder
- cancellation
- refund

SMS no es obligatorio en la primera versión.

## SECURITY

Implementar:

- authentication
- password hashing
- role based access control
- tenant isolation
- server-side validation
- rate limiting
- secure sessions/JWT
- database backups
- audit log
- encrypted sensitive data

## DATABASE

Usar PostgreSQL.

Crear como mínimo:

users
tenants
tenant_settings
customers
products
product_items
bookings
booking_participants
waivers
waiver_versions
waiver_signatures
orders
order_items
payments
passes
cashier_sessions
notifications
audit_logs

Agregar foreign keys, indexes y timestamps.

## TECHNOLOGY

Preferencia:

Frontend:
Next.js + TypeScript

UI:
Tailwind CSS

Backend:
Next.js server/API o backend Node.js/TypeScript

Database:
PostgreSQL

ORM:
Prisma

Authentication:
Auth.js o equivalente seguro

Storage:
S3-compatible storage

Deployment:
Vercel/Cloudflare + managed PostgreSQL o infraestructura equivalente.

## DESIGN

Mantener el concepto visual del demo.

Debe sentirse:

- moderno
- limpio
- rápido
- mobile-first
- orientado a turismo/entretenimiento
- fácil para clientes extranjeros

Soportar:

English
Spanish

Preparar internacionalización.

Customer Flow extremadamente sencillo.

POS optimizado para tablets y computadoras.

## DEMO MODE

Mantener Demo Mode sin pagos reales.

Debe permitir:

- crear orden
- simular pago aprobado
- simular pago rechazado
- generar QR
- firmar waiver
- entrar como cashier
- consultar dashboard

Separar claramente DEMO de PRODUCTION.

## ENTREGABLES

Antes de programar:

1. Analiza la aplicación actual.
2. Enumera todas las pantallas.
3. Enumera componentes.
4. Enumera estados.
5. Enumera flujos.
6. Diseña database schema.
7. Diseña API routes.
8. Diseña roles y permisos.
9. Identifica qué partes son simulación.
10. Identifica qué necesita backend real.

Después:

1. Construir frontend.
2. Construir database.
3. Construir backend.
4. Implementar autenticación.
5. Implementar multi-tenancy.
6. Implementar waivers.
7. Implementar órdenes.
8. Implementar QR.
9. Implementar POS.
10. Implementar dashboard.
11. Implementar Mock Payment.
12. Preparar integración AZUL.
13. Crear tests.
14. Crear seed/demo data.
15. Documentar instalación.
16. Documentar deployment.

NO inventes funcionalidades innecesarias.

Primero conserva la experiencia del demo actual y después agrega las funciones necesarias para convertirlo en un producto SaaS real.

Al finalizar entregar:

- arquitectura
- database schema
- API documentation
- environment variables
- deployment instructions
- admin credentials para demo
- test accounts
- test payment flow
- README
- lista de funcionalidades pendientes para producción
```

---

# 34. Próximo paso recomendado

El siguiente documento técnico debería ser:

1. **Database Schema completo**
2. **ERD / relaciones**
3. **API Specification**
4. **User Stories**
5. **Acceptance Criteria**
6. **Lista exacta de pantallas**
7. **Componentes de UI**
8. **Plan de desarrollo por sprint**
9. **Estimación por tarea**
10. **Checklist para contratar al programador**
11. **Checklist de QA**
12. **Checklist de lanzamiento**
13. **Pricing definitivo**
14. **Propuesta comercial para SunKart**
