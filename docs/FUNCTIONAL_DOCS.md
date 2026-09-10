# Documentación Funcional — AdventureOS (SunKart Park Management System)

Plataforma SaaS multi-empresa diseñada para la gestión comercial y operativa integral de parques de entretenimiento, centros de go-karts, paintball, tirolesas y atracciones turísticas. Este documento describe las especificaciones funcionales, reglas de negocio y flujos de usuario implementados.

---

## 1. Módulos Core / Características

### Módulo: Catálogo y Reserva de Experiencias (Customer Booking Funnel)
**Descripción**: Portal público para que los visitantes seleccionen actividades individuales o paquetes combinados, elijan fecha y registren participantes.
- **Funcionalidades Clave**:
  - Visualización bilingüe (Español / Inglés) dinámica en tiempo real en todo el embudo (Catálogo, Formulario de Reserva, Waiver Legal v1.0, Checkout, Pasarela de Pagos, Confirmación y Pase QR).
  - Catálogo cerrado y especializado compuesto exactamente por 11 paquetes y experiencias preconfiguradas:
    1. **Go-Kart Individual**: $10.00 USD (1 participante, categoría Go-Kart)
    2. **Go-Kart Crew 5**: $45.00 USD (5 participantes, categoría Go-Kart)
    3. **Go-Kart Crew 10**: $85.00 USD (10 participantes, categoría Go-Kart)
    4. **Paintball Individual**: $20.00 USD (1 participante, categoría Paintball)
    5. **Paintball Squad 5**: $90.00 USD (5 participantes, categoría Paintball)
    6. **Paintball Battle 10**: $170.00 USD (10 participantes, categoría Paintball)
    7. **Paintball Battle 20**: $300.00 USD (20 participantes, categoría Paintball)
    8. **Sky Adventure Individual**: $10.00 USD (1 participante, categoría Sky Adventure)
    9. **Sky Adventure Group 5**: $45.00 USD (5 participantes, categoría Sky Adventure)
    10. **Sky Adventure Group 10**: $85.00 USD (10 participantes, categoría Sky Adventure)
    11. **SunKart Triple Pass**: $35.00 USD (1 participante, combo Go-Kart + Paintball + Sky Adventure)
  - Soporte de precios planos por paquete (Flat Package Pricing): el precio mostrado cubre la totalidad del paquete y genera dinámicamente la cantidad exacta de slots de participantes requeridos en el registro.
  - Precios duales en tiempo real: Dólares Americanos (USD) y Pesos Dominicanos (DOP) calculados según la tasa de cambio del tenant.
  - Registro anticipado de nombres y fechas de nacimiento de cada participante acorde a la capacidad del paquete.
- **Reglas de Negocio**:
  - El usuario puede cambiar de paquete directamente desde el embudo de reservas con un selector interactivo en tarjetas idénticas al catálogo.
  - La cantidad de participantes se deriva estrictamente del paquete seleccionado (1, 5, 10 o 20 participantes).
  - No se permite reservar sin definir todos los participantes requeridos por el paquete con nombre y fecha de nacimiento.
  - La fecha de visita no puede ser anterior al día en curso.
  - El sistema calcula automáticamente si un participante es menor de edad (< 18 años).


---

### Módulo: Motor de Waiver Digital y Firma Electrónica (Waiver Engine)
**Descripción**: Sistema probatorio de consentimiento legal, asunción de riesgos y liberación de responsabilidad civil con firma en pantalla táctil.
- **Funcionalidades Clave**:
  - Visualización del texto legal exacto según la versión activa del tenant (v1, v2, etc.).
  - Detección automática de menores de edad con despliegue obligatorio del bloque de consentimiento del padre, madre o tutor legal.
  - Lienzo (Canvas) interactivo para captura de firma manuscrita digital.
  - Almacenamiento forense con dirección IP, User-Agent del navegador y sello de tiempo UTC.
- **Reglas de Negocio**:
  - Es mandatorio firmar el waiver antes de acceder al checkout y pasarela de pago.
  - Si hay algún menor de 18 años registrado en la orden, es estrictamente obligatorio capturar el nombre completo, parentesco y teléfono del tutor legal.
  - El trazo de la firma no puede estar vacío (validación de datos mínimos de canvas).
  - Los textos de waivers son inmutables: las modificaciones generan una nueva versión sin alterar las firmas históricas.

---

### Módulo: Checkout y Pasarela de Pagos Desacoplada (Payment Gateway)
**Descripción**: Motor financiero que liquida órdenes mediante pago en línea con tarjeta o emisión de comprobante de pago posterior en caja.
- **Funcionalidades Clave**:
  - Los precios publicados en el catálogo **ya incluyen el ITBIS (18%)**.
  - Desglose transparente en checkout y comprobante:
    - **Subtotal (Base Imponible)** = Total / 1.18
    - **ITBIS (18% Incluido)** = Total - Subtotal
    - **Total a Pagar**: Es exactamente el precio publicado multiplicado por la cantidad de participantes (sin cargos sorpresa).
  - Modo Dual de Pago:
    - **Pagar Online**: Procesamiento instantáneo (Modo Demo simulador de aprobación/rechazo o AZUL con redirección 3D-Secure). Emite de inmediato el QR Pass activo.
    - **Pagar en Caja del Parque**: Genera una orden en estado `PENDING_PAYMENT` y un código amigable para cobrar en efectivo o tarjeta física en recepción.
- **Reglas de Negocio**:
  - En caja POS o pasarela online jamás se agrega el 18% como costo adicional sobre el precio del catálogo; el impuesto se desglosa internamente a partir del precio final.
  - Las credenciales bancarias de AZUL (AuthKey, MerchantId) se procesan estrictamente del lado del servidor; nunca se exponen al navegador.
  - No se almacena CVV ni numeración completa de tarjeta en ninguna base de datos ni logs.

---

### Módulo: Pase Digital Criptográfico (QR Pass Lifecycle)
**Descripción**: Emisión de boletos de acceso digitales representados por códigos QR de alta densidad y lectura óptica instantánea.
- **Funcionalidades Clave**:
  - Generación de código amigable (ej. `SK-PASS-7F82A91D`) y token criptográfico no predecible (UUIDv4).
  - El código QR no contiene datos personales (Zero PII), sino un token seguro de verificación.
  - Estados del pase: `VALID` (Válido), `USED` (Utilizado), `CANCELLED` (Cancelado), `REVOKED` (Revocado).
- **Reglas de Negocio**:
  - Prevención atómica de doble canje (*anti double-spending*): si dos operarios intentan validar el mismo pase al mismo tiempo, el sistema asegura transaccionalmente que solo uno sea admitido y el segundo reciba alerta de "Ya utilizado".

---

### Módulo: Caja POS (Point of Sale) y Control de Arqueo
**Descripción**: Terminal de venta rápida para cajeros en mostrador físico optimizado para computadoras y tablets táctiles.
- **Funcionalidades Clave**:
  - Búsqueda en tiempo real por número de orden (`SK-001001`), nombre del cliente, teléfono o escaneo de QR.
  - Modal de cobro en efectivo con cálculo automático del cambio o devuelta a entregar.
  - Cobro por tarjeta con registro de número de voucher o autorización POS.
  - Impresión de recibo térmico con formato optimizado `@media print` de 80mm con QR impreso.
  - Control de turnos de caja (`CashierSession`) con fondo inicial y arqueo ciego de cierre (reportes X/Z).
- **Reglas de Negocio**:
  - Cobrar una orden en caja activa inmediatamente el pase digital y actualiza el saldo de la sesión del cajero.

---

### Módulo: Escáner Staff de Control de Acceso
**Descripción**: Aplicación para operarios de pista y puertas de embarque para validar visitantes.
- **Funcionalidades Clave**:
  - Entrada mediante cámara de dispositivo o lector de códigos 2D USB/Bluetooth.
  - Pantallas gigantes de señalización óptica:
    - 🟩 **VERDE**: Pase Válido — Muestra nombres de participantes y actividades autorizadas.
    - 🟥 **ROJO**: Pase Ya Utilizado — Muestra hora y operador que lo canjeó previamente.
    - 🟨 **AMARILLO**: Pago Pendiente — Instruye al visitante a acudir a recepción para saldar.

---

## 2. Roles de Usuario y Permisos

| Rol | Ámbito | Permisos / Accesos Clave |
| :--- | :--- | :--- |
| `CUSTOMER` | Público | Explorar catálogo, registrar participantes, firmar waiver, pagar online o en caja, consultar pase digital QR. |
| `CASHIER` | Tenant Único | Buscar órdenes, cobrar en efectivo/tarjeta, abrir y cerrar turnos de caja, emitir e imprimir recibos térmicos de 80mm. |
| `STAFF` | Tenant Único | Escaneo de QR, verificación de waivers firmados, validación y canje de boletos en pista. |
| `BUSINESS_ADMIN` | Tenant Único | Acceso a KPIs operativos, reportes de ventas, configuración de precios, catálogo de experiencias y waivers legales. |
| `SUPER_ADMIN` | Plataforma Global | Gestión de parques (tenants), configuración de pasarelas, monitoreo de métricas SaaS y logs de auditoría global. |

---

## 3. Flujos de Usuario

### Flujo: Compra Online con Pase Digital
1. El cliente accede al catálogo del parque (`/sunkart-pc`).
2. Selecciona la actividad deseada (ej. *Go-Kart Adult Race* o *Adventure Combo VIP*).
3. Selecciona cantidad de participantes, fecha de visita y completa sus datos de contacto.
4. Indica nombres y fechas de nacimiento de los participantes.
5. El sistema detecta si hay menores de edad y solicita los datos de tutor si corresponde.
6. El cliente lee el waiver legal y firma en el lienzo táctil con el dedo o ratón.
7. En el checkout revisa el desglose con ITBIS (18%) y selecciona "Pagar Online".
8. La pasarela simula o procesa la tarjeta con 3DS.
9. Al aprobarse, se muestra la confirmación con confeti y se activa el pase QR con URL permanente (`/sunkart-pc/pass/[token]`).
10. El cliente acude a la pista y el Staff escanea su código QR mostrando pantalla verde de admisión.

---

### Flujo: Reserva con Pago en Caja del Parque
1. El cliente realiza el proceso de selección y firma de waiver en su teléfono.
2. En el checkout selecciona la opción "Pagar en Caja del Parque".
3. El sistema crea una orden con código amigable (ej. `SK-001002`) y emite un voucher QR en estado `PENDING_PAYMENT`.
4. El cliente se presenta en recepción del parque.
5. La cajera busca la orden escaneando el voucher o digitando el código/teléfono en el módulo POS (`/dashboard/cashier`).
6. La cajera verifica los participantes y confirma el pago en efectivo o con tarjeta física en el terminal.
7. El sistema marca la orden como `PAID`, activa el pase y la cajera imprime el recibo térmico de 80mm con el QR activo.
8. El cliente avanza a la actividad y el Staff valida su acceso.
