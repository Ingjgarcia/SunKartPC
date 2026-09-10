# Changelog — AdventureOS

Todas las modificaciones notables y características implementadas en el sistema se documentan en este archivo.

## [1.0.0] - 2026-09-10

### Features
- **Scaffolding y Configuración Base**: Monorepo con Next.js 14+ (App Router), TypeScript, Tailwind CSS, Lucide Icons y utilidades de estilo.
- **Base de Datos y Multi-Tenancy**: Configurado `prisma/schema.prisma` con modelos para Tenants, Configuraciones, Usuarios (RBAC), Clientes, Experiencias y Paquetes VIP, Waivers y Versiones Inmutables, Órdenes, Pagos, Pases QR y Sesiones de Caja.
- **Semilla de Datos (Seed)**: `prisma/seed.ts` con el catálogo oficial de SunKart Park Punta Cana (Go-Karts Pro 270cc, Go-Karts Junior, Paintball Combat, Zipline Canopy, Sky Adventure y Adventure Combo VIP) y usuarios demo para todos los roles.
- **Modo Demostración Inmediato (Demo Mode)**: Implementado `src/lib/demo-store.ts` con persistencia en memoria y fallback inteligente cuando PostgreSQL local no está activo.
- **Funnel de Reserva del Visitante**:
  - Catálogo público con selector bilingüe (`/[tenantSlug]`).
  - Formulario de reserva de fecha y participantes (`/booking`).
  - Motor de Waiver Digital con firma interactiva en Canvas HTML5, auditoría forense y detección automática de menores de edad con consentimiento legal de tutor (`/waiver`).
  - Checkout con cálculo de subtotal, ITBIS 18% y selector de método de pago ("Pagar Online" vs "Pagar en Caja") (`/checkout`).
  - Pantalla de pasarela de pago con simulador de aprobación 3DS o tarjeta declinada (`/payment`).
  - Confirmación con animación de confeti y emisión de voucher (`/success`).
  - Pantalla permanente de Pase Digital con render de Código QR seguro de alta resolución (Zero PII) (`/pass/[token]`).
- **Módulo de Caja POS (`/dashboard/cashier`)**: Búsqueda instantánea de órdenes por código, nombre o QR; calculadora de cambio de efectivo; cobro con tarjeta POS; y visor e impresión de recibo térmico en formato 80mm con media query `@media print`.
- **Módulo de Escáner Staff (`/dashboard/scanner`)**: Interfaz para operarios de pista con prevención atómica de doble canje (*anti double-spending*) y señalización óptica gigante en verde, rojo y ámbar.
- **Panel Administrativo (`/dashboard/admin`)**: Métricas operativas en tiempo real (Ingresos hoy, órdenes procesadas, participantes y waivers firmados) y visualización del catálogo.
- **Pasarelas de Pago Desacopladas**: Abstracción `IPaymentProvider` con `MockPaymentProvider` y `AzulPaymentProvider` implementando el cálculo de firma criptográfica HMAC-SHA512 `AuthHash` para República Dominicana.
- **Documentación Técnica**: Generados `docs/DATA_BASE.md` con modelo entidad-relación en Mermaid y diccionario de datos, y `docs/FUNCTIONAL_DOCS.md` con las reglas de negocio y flujos.

### Fixed
- **Cálculo de ITBIS (18%) Incluido**: Corregido el cálculo en `calculateOrderTotals`, Booking, Checkout, Pasarela de Pago, Caja POS y Recibo Térmico de 80mm para que el impuesto esté **incluido** dentro del precio publicado en el catálogo (`Subtotal = Total / 1.18`, `ITBIS = Total - Subtotal`), evitando que el sistema agregue un 18% extra sobre el valor anunciado al momento de pagar.
- **Internacionalización Dinámica Completa (i18n)**: Resuelto el comportamiento donde cambiar de idioma solo alteraba los títulos de navegación. Se implementó `LanguageProvider`, `LanguageContext` y un diccionario bilingüe (`translations.ts`) conectado a todas las pantallas del funnel (Catálogo, Reserva, Waiver Legal v1.0, Checkout, Pasarela de Pago, Confirmación y Pase QR), permitiendo alternar instantáneamente entre Español e Inglés con persistencia en `localStorage`.
- **Catálogo Exclusivo de 11 Experiencias y Paquetes**: Homologado el catálogo en memoria (`demo-store.ts`), base de datos (`seed.ts`), vista pública (`/[tenantSlug]`) y embudo de reserva (`/booking`) para ofrecer exclusivamente las 11 experiencias y paquetes especificados (Go-Kart Individual, Go-Kart Crew 5, Go-Kart Crew 10, Paintball Individual, Paintball Squad 5, Paintball Battle 10, Paintball Battle 20, Sky Adventure Individual, Sky Adventure Group 5, Sky Adventure Group 10 y SunKart Triple Pass). Incluye diseño de tarjetas en cuadrícula de 3 columnas idéntico a la referencia visual, insignia de participantes, precio de paquete cerrado con ITBIS incluido y selector dinámico en el formulario de reserva que ajusta automáticamente los slots del roster de participantes.

