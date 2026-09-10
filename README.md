# AdventureOS — SunKart Park Management System

> Plataforma SaaS comercial para parques de aventura, entretenimiento, go-karts, paintball y actividades turísticas. Tenant piloto: **SunKart Park Punta Cana**.

---

## 🚀 Puesta en Marcha Rápida (Local)

El sistema cuenta con un **Modo Demostración integrado (Demo Mode)** que permite ejecutar y probar todo el flujo operativo de inmediato sin requerir configuración previa de bases de datos externas:

```bash
# 1. Instalar dependencias
npm install

# 2. Generar cliente de Prisma
npx prisma generate

# 3. Iniciar el servidor de desarrollo
npm run dev
```

La aplicación estará disponible en: [http://localhost:3000](http://localhost:3000)

---

## 🔑 Credenciales y Cuentas de Acceso Demo

Para probar los distintos perfiles del sistema, la pantalla de login (`/login`) cuenta con botones de **1-Click Acceso Rápido** o puedes ingresar con las siguientes credenciales:

| Rol | Correo Electrónico | Contraseña | Destino / Acceso |
| :--- | :--- | :--- | :--- |
| **Cajero POS** | `cashier@sunkart.com` | `demo123` | Punto de Venta, búsqueda de órdenes y cobro (`/dashboard/cashier`) |
| **Staff de Pista** | `staff@sunkart.com` | `demo123` | Validación óptica de códigos QR (`/dashboard/scanner`) |
| **Business Admin** | `admin@sunkart.com` | `demo123` | Métricas operativas y catálogo (`/dashboard/admin`) |
| **Super Admin** | `superadmin@adventureos.com` | `demo123` | Administración global de la plataforma SaaS |

---

## 🗺️ Mapa de Rutas de la Aplicación

### Portal del Visitante (Customer Booking Flow)
- **`/[tenantSlug]`** (ej. `/sunkart-pc`): Catálogo interactivo de actividades individuales y paquetes VIP con precios en USD y DOP.
- **`/[tenantSlug]/booking`**: Selección de cantidad de participantes, fecha de visita y datos de contacto.
- **`/[tenantSlug]/waiver`**: Formulario legal con lienzo táctil HTML5 Canvas para firma electrónica y detección automática de menores de edad con consentimiento obligatorio de tutor.
- **`/[tenantSlug]/checkout`**: Desglose con ITBIS (18%) y elección de método: "Pagar Online" o "Pagar en Caja del Parque".
- **`/[tenantSlug]/payment`**: Procesamiento de pagos con simulador de aprobación 3DS o tarjeta declinada.
- **`/[tenantSlug]/success`**: Pantalla de celebración con confeti y emisión del código de orden.
- **`/[tenantSlug]/pass/[token]`**: Pase digital permanente con render de Código QR de alta densidad sin PII.

### Operaciones Internas (Backoffice & POS)
- **`/dashboard/cashier`**: Caja POS con búsqueda de órdenes en < 2 segundos, calculadora de cambio en efectivo, cobro con tarjeta POS e impresión de recibo térmico de 80mm.
- **`/dashboard/scanner`**: Escáner óptico para personal de pista con respuesta visual verde/rojo/ámbar y prevención transaccional de doble canje (*anti double-spending*).
- **`/dashboard/admin`**: Dashboard con KPIs de ventas del día, órdenes pagadas vs pendientes en caja y catálogo.

---

## 💳 Pasarelas de Pago Desacopladas

La plataforma implementa la interfaz desacoplada `IPaymentProvider` (`src/lib/payments/`):
- **`MockPaymentProvider`**: Simulación para pruebas unitarias, demostraciones comerciales y modo offline.
- **`AzulPaymentProvider`**: Integración para República Dominicana con cálculo de firma HMAC-SHA512 `AuthHash`, redirección a pasarela 3DS y validación de respuesta `IsoCode === '00'`.

---

## 📚 Documentación Técnica Detallada

- [docs/DATA_BASE.md](file:///c:/DevIa/SunKartPC/docs/DATA_BASE.md): Diccionario de datos y diagrama ERD en Mermaid.
- [docs/FUNCTIONAL_DOCS.md](file:///c:/DevIa/SunKartPC/docs/FUNCTIONAL_DOCS.md): Especificación funcional, reglas de negocio y flujos.
- [docs/CHANGELOG.md](file:///c:/DevIa/SunKartPC/docs/CHANGELOG.md): Registro histórico de cambios y versiones.
