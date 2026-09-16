export type Language = "es" | "en";

export const translations = {
  es: {
    // Header & Nav
    demoBanner: "MODO DEMO ACTIVO — SunKart Park Punta Cana (AdventureOS v1.0)",
    navCatalog: "Catálogo",
    navPos: "Caja POS",
    navScanner: "Staff Escáner",
    navDashboard: "Dashboard",
    navStaffLogin: "Acceso Staff",

    // Hero Catalog
    heroBadge: "Parque de Aventura & Go-Karts #1 en Punta Cana",
    heroTitlePrefix: "Siente la",
    heroTitleGradient: "Adrenalina Pura",
    heroTitleSuffix: "en la Pista",
    heroSubtitle: "Elige tu experiencia, firma el waiver digital en tu teléfono y recibe tu código QR al instante. Puedes pagar online o en caja al llegar.",
    heroFeatureWaiver: "Waiver 100% Digital",
    heroFeatureKarts: "Karts de Competición 270cc",
    heroFeatureGroups: "Para Adultos, Niños y Grupos",

    // Catalog Listing
    catalogTitle: "1. Elige tu experiencia",
    catalogSubtitle: "Selecciona un paquete. Los precios mostrados son de demostración y pueden modificarse luego.",
    catalogAvailable: "Paquetes Disponibles",
    vipPackageBadge: "Paquete",
    participantBadge: "participante",
    participantsBadge: "participantes",
    chooseExperienceTitle: "1. Elige tu experiencia",
    chooseExperienceSubtitle: "Selecciona un paquete. Los precios mostrados son de demostración y pueden modificarse luego.",
    minAgeLabel: "Min.",
    yearsLabel: "años",
    minHeightLabel: "Min.",
    waiverRequiredBadge: "Waiver Requerido",
    includesTitle: "Incluye:",
    bookButton: "Seleccionar",
    perPerson: "/ paquete",
    selectedPackageHeader: "Paquete Seleccionado",
    changePackageBtn: "Cambiar paquete",
    hidePackageListBtn: "Ocultar opciones",
    continueToBookingBtn: "Continuar a Registro de Participantes",
    step1SelectInstruction: "Haz clic en una experiencia para marcarla y luego pulsa 'Continuar'",


    // Experience Items in English & Spanish
    expKartAdultDesc: "Siente la verdadera velocidad en nuestra pista asfaltada de competición con karts de 270cc y cronometraje digital.",
    expKartJuniorDesc: "Diversión segura y controlada para jóvenes corredores con karts limitados y parachoques perimetrales de seguridad.",
    expPaintballDesc: "Campo temático táctico al aire libre. Incluye máscara anti-empañamiento, marcador semi-automático y 200 paintballs.",
    expZiplineDesc: "Vuela sobre las copas de los árboles con 5 líneas dobles de alta velocidad y vistas panorámicas de Punta Cana.",
    expSkyDesc: "Circuito aéreo de puentes colgantes, redes y plataformas suspendidas a 10 metros de altura.",
    expComboDesc: "¡El paquete más vendido! Incluye tanda de Go-Kart Pro Adulto, Paintball Combat (200 bolas) y Circuito Sky Ropes con descuento especial.",

    // Stepper Steps
    stepperStep1: "1. Experiencia",
    stepperStep2: "2. Participantes",
    stepperStep3: "3. Waiver Legal",
    stepperStep4: "4. Pago",
    stepperStep5: "5. Pase QR",

    // Email Pass Action
    sendToEmailBtn: "Enviar pase a mi correo",
    sendingEmail: "Enviando pase...",
    emailSentSuccess: "¡Pase enviado a",
    emailSendError: "No se pudo enviar el correo.",

    // Steps
    stepParticipants: "Participantes",
    stepWaiver: "Waiver Digital",
    stepCheckout: "Checkout & Pago",

    // Booking Page
    selectedActivity: "Actividad Seleccionada",
    officialTrack: "Pista Oficial",
    numParticipants: "Número de Participantes",
    visitDate: "Fecha de Visita",
    customerContactTitle: "Datos de Contacto del Comprador",
    firstName: "Nombre",
    lastName: "Apellido",
    email: "Email",
    phone: "Teléfono / WhatsApp",
    participantsRosterTitle: "Registro de Participantes",
    participantsRosterSubtitle: "Todos los corredores deben estar registrados para el waiver de seguridad.",
    fullName: "Nombre Completo",
    birthDate: "Fecha de Nacimiento",
    minorLabel: "Menor de Edad (Requiere Tutor)",
    adultLabel: "Adulto (+18)",
    continueToWaiver: "Continuar al Waiver Digital",
    orderSummary: "Resumen de Orden",
    subtotalTaxBase: "Subtotal (Base Imponible)",
    itbisIncluded: "ITBIS (18% Incluido)",
    totalToPay: "Total a Pagar",
    freeCancel: "Cancelación gratuita hasta 24h antes",
    payOnlineOrCashier: "Pago online seguro o en caja al llegar",

    // Waiver Page
    waiverTitle: "Acuerdo Legal de Exoneración de Responsabilidad",
    legalVersion: "Versión Legal v1.0",
    signingOnBehalfOf: "Firmando en nombre de:",
    guardianTitle: "Consentimiento Obligatorio de Padre / Tutor Legal",
    guardianSubtitle: "Uno o más participantes son menores de 18 años. La ley exige los datos y consentimiento expreso del padre, madre o tutor legal.",
    guardianName: "Nombre del Padre / Tutor",
    guardianRelation: "Parentesco o Relación",
    guardianPhone: "Teléfono del Tutor",
    guardianEmail: "Email del Tutor",
    parentRelationOption: "Padre / Madre",
    legalGuardianOption: "Tutor Legal",
    authorizedRelativeOption: "Familiar Autorizado (+18)",
    electronicSignature: "Firma Electrónica",
    signatureInstructions: "Dibuja tu firma con el dedo o ratón en el área delimitada.",
    clearSignature: "Limpiar Firma",
    signaturePlaceholder: "Firma aquí con el dedo o ratón ✍️",
    acceptTermsLabel: "He leído, comprendo y acepto íntegramente las condiciones de la exoneración de responsabilidad civil y asunción de riesgo de SunKart Park Punta Cana.",
    confirmSignatureAndContinue: "Confirmar Firma y Continuar al Checkout",
    waiverLegalText: `ACUERDO DE ASUNCIÓN DE RIESGOS, EXONERACIÓN DE RESPONSABILIDAD Y LIBERACIÓN LEGAL
SUNKART PARK PUNTA CANA (ADVENTUREOS)

Al firmar este documento electrónico, declaro de manera libre, voluntaria e informada que comprendo la naturaleza y riesgos de las actividades recreativas y de velocidad (Go-Karts, Paintball, Zipline, Puentes Aéreos) en SunKart Park.

1. ASUNCIÓN DE RIESGO: Acepto los riesgos inherentes de choque, aceleración y fricción bajo mi propia cuenta y riesgo.
2. REQUISITOS DE SALUD: Certifico que no padezco de afecciones cardíacas, cervicales, embarazo o limitaciones motoras incompatibles con la actividad.
3. REGLAS Y EQUIPO: Utilizaré siempre casco cerrado y arnés cuando aplique, obedeciendo en todo momento las banderas y al personal del parque.
4. MENORES DE EDAD: Si registro a un menor de 18 años, actúo como su padre, madre o tutor legal con facultad plena para autorizarlo.
5. FIRMA ELECTRÓNICA: Reconozco la plena validez jurídica de mi firma digital en este sistema.`,
    alertFillPrimaryContact: "Por favor completa los datos de contacto principales.",
    alertFillParticipant: "Por favor completa el nombre y fecha de nacimiento del participante #",
    alertDrawSignature: "Por favor dibuja tu firma electrónica en el recuadro indicado.",
    alertAcceptWaiver: "Debes aceptar los términos y condiciones de la exoneración legal.",
    alertGuardianRequired: "Por favor completa los datos obligatorios del padre/madre o tutor legal.",
    declinedReason: "Transacción declinada por el banco emisor (Fondos insuficientes / Código 51). Por favor intenta con otra tarjeta o paga en caja.",
    transactionDeclinedTitle: "Transacción Rechazada",
    retryPaymentBtn: "Reintentar Pago",
    loadingPass: "Cargando Pase Digital...",
    passNotFoundTitle: "Pase No Encontrado",
    passNotFoundSubtitle: "El token de acceso no es válido.",
    backToHomeBtn: "Volver al Inicio",


    // Checkout Page
    checkoutDetailsTitle: "Detalle de tu Experiencia",
    waiverVerifiedBadge: "Waiver Digital Firmado y Verificado",
    registeredRacers: "Corredores Registrados:",
    paymentMethodTitle: "Método de Pago",
    paymentMethodSubtitle: "Selecciona cómo deseas abonar tu reservación en SunKart Park Punta Cana.",
    payOnlineTitle: "Pagar Online Ahora",
    payOnlineDesc: "Tarjeta de crédito/débito nacional o internacional con 3DS. Pase QR activo al instante.",
    recommendedBadge: "Recomendado • Sin Filas",
    payCashierTitle: "Pagar en Caja del Parque",
    payCashierDesc: "Genera tu voucher QR y paga al llegar en efectivo (USD o DOP) o tarjeta en nuestro counter de recepción.",
    cashierBadge: "Efectivo o POS",
    proceedOnlineBtn: "Proceder al Pago Online",
    proceedCashierBtn: "Generar Voucher para Pagar en Caja",
    financialBreakdown: "Desglose Financiero",
    totalFinal: "Total Final",
    fiscalReceiptNote: "Comprobante con Valor Fiscal disponible en caja o descargable tras la confirmación de la orden.",

    // Payment Processing
    paymentGatewayTitle: "Pasarela de Pagos Segura",
    paymentGatewaySubtitle: "Conexión encriptada SSL 256-bit • AZUL República Dominicana",
    totalToCharge: "Total a Cobrar",
    gatewaySimulatorBadge: "Simulador de Gateway (Banco Popular / AZUL 3DS)",
    simulateApprovedBtn: "Simular Pago Aprobado (3DS Éxito)",
    simulateDeclinedBtn: "Simular Tarjeta Declinada (Fondos Insuficientes)",
    backChangePayment: "← Volver y cambiar método de pago",
    pciCertified: "PCI-DSS Certificado",

    // Success Page
    paidSuccessTitle: "¡Pago Confirmado Exitosamente!",
    cashierSuccessTitle: "¡Orden Registrada para Caja!",
    paidSuccessSubtitle: "Tu pase de acceso digital ha sido generado y activado en el sistema. Puedes presentarlo directamente al Staff en la pista.",
    cashierSuccessSubtitle: "Presenta este código en la Caja de SunKart Park Punta Cana para pagar en efectivo o tarjeta física y activar tu pase.",
    orderCodeLabel: "Código de Orden",
    paidActiveStatus: "ESTADO: PAGADO / ACTIVO",
    pendingPaymentStatus: "ESTADO: PENDIENTE DE PAGO",
    viewDigitalPassBtn: "Ver Mi Pase Digital (Código QR)",
    backToCatalogBtn: "Volver al catálogo del parque",

    // Digital Pass
    passTitle: "PASE DE ACCESO DIGITAL",
    passValid: "✅ PASE ACTIVO Y VÁLIDO",
    passUsed: "⛔ PASE YA UTILIZADO",
    passPending: "⚠️ PENDIENTE DE COBRO EN CAJA",
    passInstruction: "Presenta este código al personal de pista o en la caja receptora.",
    orderLabel: "Orden:",
    customerLabel: "Titular:",
    totalLabel: "Total:",
    authorizedParticipants: "Participantes Autorizados",
    printPdfBtn: "Imprimir o Guardar como PDF",
  },
  en: {
    // Header & Nav
    demoBanner: "DEMO MODE ACTIVE — SunKart Park Punta Cana (AdventureOS v1.0)",
    navCatalog: "Catalog",
    navPos: "POS Cashier",
    navScanner: "Staff Scanner",
    navDashboard: "Dashboard",
    navStaffLogin: "Staff Login",

    // Hero Catalog
    heroBadge: "#1 Adventure Park & Go-Karts in Punta Cana",
    heroTitlePrefix: "Feel the",
    heroTitleGradient: "Pure Adrenaline",
    heroTitleSuffix: "on the Track",
    heroSubtitle: "Choose your experience, sign the digital waiver on your phone and get your QR code instantly. Pay online or at the cashier counter upon arrival.",
    heroFeatureWaiver: "100% Digital Waiver",
    heroFeatureKarts: "270cc Pro Racing Karts",
    heroFeatureGroups: "For Adults, Kids & Groups",

    // Catalog Listing
    catalogTitle: "1. Choose your experience",
    catalogSubtitle: "Select a package. Prices below are demo pricing and can be changed later.",
    catalogAvailable: "Packages Available",
    vipPackageBadge: "Package",
    participantBadge: "participant",
    participantsBadge: "participants",
    chooseExperienceTitle: "1. Choose your experience",
    chooseExperienceSubtitle: "Select a package. Prices below are demo pricing and can be changed later.",
    minAgeLabel: "Min.",
    yearsLabel: "years",
    minHeightLabel: "Min.",
    waiverRequiredBadge: "Waiver Required",
    includesTitle: "Includes:",
    bookButton: "Select",
    perPerson: "/ package",
    selectedPackageHeader: "Selected Package",
    changePackageBtn: "Change package",
    hidePackageListBtn: "Hide options",
    continueToBookingBtn: "Continue to Staff & Participants Roster",
    step1SelectInstruction: "Click on any experience to select it, then click 'Continue'",


    // Experience Items
    expKartAdultDesc: "Feel genuine top speed on our competition asphalt track with 270cc karts and digital lap timing.",
    expKartJuniorDesc: "Safe, controlled excitement for young racers with speed-limited karts and 360° perimeter impact bumpers.",
    expPaintballDesc: "Outdoor tactical themed jungle arena. Includes anti-fog mask, semi-auto marker and 200 paintballs.",
    expZiplineDesc: "Fly over the tropical canopy with 5 double high-speed lines and panoramic Punta Cana views.",
    expSkyDesc: "High-ropes obstacle course with suspension bridges, nets and suspended platforms at 10 meters height.",
    expComboDesc: "Our best-seller! Includes 1 heat of Adult Pro Go-Karts, Paintball Jungle Combat (200 balls) and full Sky High Ropes access with combo discount.",

    // Stepper Steps
    stepperStep1: "1. Experience",
    stepperStep2: "2. Participants",
    stepperStep3: "3. Legal Waiver",
    stepperStep4: "4. Payment",
    stepperStep5: "5. Digital Pass",

    // Email Pass Action
    sendToEmailBtn: "Send pass to my email",
    sendingEmail: "Sending pass...",
    emailSentSuccess: "Pass successfully sent to",
    emailSendError: "Could not send email.",

    // Steps
    stepParticipants: "Participants",
    stepWaiver: "Digital Waiver",
    stepCheckout: "Checkout & Payment",

    // Booking Page
    selectedActivity: "Selected Activity",
    officialTrack: "Official Track",
    numParticipants: "Number of Participants",
    visitDate: "Visit Date",
    customerContactTitle: "Primary Buyer Contact Details",
    firstName: "First Name",
    lastName: "Last Name",
    email: "Email Address",
    phone: "Phone / WhatsApp",
    participantsRosterTitle: "Racer / Participant Registration",
    participantsRosterSubtitle: "Every participant must be registered for the electronic safety waiver.",
    fullName: "Full Name",
    birthDate: "Date of Birth",
    minorLabel: "Minor (Requires Guardian Consent)",
    adultLabel: "Adult (+18)",
    continueToWaiver: "Continue to Digital Waiver",
    orderSummary: "Order Summary",
    subtotalTaxBase: "Subtotal (Taxable Base)",
    itbisIncluded: "ITBIS (18% Included)",
    totalToPay: "Total Due",
    freeCancel: "Free cancellation up to 24h prior",
    payOnlineOrCashier: "Secure online payment or pay at cashier desk",

    // Waiver Page
    waiverTitle: "Assumption of Risk, Waiver & Legal Liability Release",
    legalVersion: "Legal Version v1.0",
    signingOnBehalfOf: "Signing on behalf of:",
    guardianTitle: "Mandatory Parent / Legal Guardian Consent",
    guardianSubtitle: "One or more participants are under 18 years old. Applicable law requires express consent and contact info from parent or legal guardian.",
    guardianName: "Parent / Guardian Full Name",
    guardianRelation: "Relationship to Minor",
    guardianPhone: "Guardian Phone Number",
    guardianEmail: "Guardian Email",
    parentRelationOption: "Father / Mother",
    legalGuardianOption: "Legal Guardian",
    authorizedRelativeOption: "Authorized Adult Relative (+18)",
    electronicSignature: "Electronic Signature",
    signatureInstructions: "Draw your signature using your finger or mouse within the boxed area.",
    clearSignature: "Clear Signature",
    signaturePlaceholder: "Sign here with finger or mouse ✍️",
    acceptTermsLabel: "I have read, understood and agree to all terms of the liability release, safety rules and assumption of risk for SunKart Park Punta Cana.",
    confirmSignatureAndContinue: "Confirm Signature & Proceed to Checkout",
    waiverLegalText: `ASSUMPTION OF RISK, LIABILITY WAIVER AND LEGAL RELEASE AGREEMENT
SUNKART PARK PUNTA CANA (ADVENTUREOS)

By electronically signing this document, I freely, voluntarily and knowingly declare that I understand the nature and inherent risks of recreational racing and adventure activities (Go-Karts, Paintball, Zipline, High-Ropes Course) at SunKart Park.

1. ASSUMPTION OF RISK: I voluntarily assume all risks of collision, impact, acceleration, and friction at my own peril.
2. HEALTH CERTIFICATION: I certify that I do not suffer from cardiovascular disorders, neck/back injuries, pregnancy, or physical impairments incompatible with these activities.
3. SAFETY RULES: I agree to wear a closed-face helmet and safety harness when required, strictly obeying all track marshals, safety flags, and staff instructions at all times.
4. MINORS: If registering a minor under 18 years of age, I represent and warrant that I am the legal parent or guardian authorized to execute this release.
5. ELECTRONIC SIGNATURE: I acknowledge that my electronic signature possesses full legal validity and binding enforceability.`,
    alertFillPrimaryContact: "Please fill in all primary buyer contact fields.",
    alertFillParticipant: "Please enter the full name and date of birth for participant #",
    alertDrawSignature: "Please draw your electronic signature in the box provided.",
    alertAcceptWaiver: "You must accept the legal waiver terms and conditions.",
    alertGuardianRequired: "Please fill in the required parent/legal guardian details.",
    declinedReason: "Transaction declined by the card issuing bank (Insufficient funds / Code 51). Please try another card or pay at cashier.",
    transactionDeclinedTitle: "Transaction Declined",
    retryPaymentBtn: "Retry Payment",
    loadingPass: "Loading Digital Pass...",
    passNotFoundTitle: "Pass Not Found",
    passNotFoundSubtitle: "The provided access token is not valid.",
    backToHomeBtn: "Back to Home",


    // Checkout Page
    checkoutDetailsTitle: "Your Experience Summary",
    waiverVerifiedBadge: "Digital Waiver Signed & Cleared",
    registeredRacers: "Registered Racers:",
    paymentMethodTitle: "Payment Method",
    paymentMethodSubtitle: "Choose how you wish to pay for your SunKart Park reservation.",
    payOnlineTitle: "Pay Online Now",
    payOnlineDesc: "National or International Credit/Debit card with 3DS. Digital pass activated immediately.",
    recommendedBadge: "Recommended • Skip Lines",
    payCashierTitle: "Pay at Park Cashier Counter",
    payCashierDesc: "Generate your QR voucher and pay upon arrival in cash (USD or DOP) or credit card at our front desk.",
    cashierBadge: "Cash or Card POS",
    proceedOnlineBtn: "Proceed to Online Payment",
    proceedCashierBtn: "Generate Voucher to Pay at Cashier",
    financialBreakdown: "Financial Breakdown",
    totalFinal: "Final Total",
    fiscalReceiptNote: "Official tax receipt available at cashier or downloadable upon order payment confirmation.",

    // Payment Processing
    paymentGatewayTitle: "Secure Payment Gateway",
    paymentGatewaySubtitle: "256-bit SSL Encrypted • AZUL Dominican Republic",
    totalToCharge: "Total to Charge",
    gatewaySimulatorBadge: "Gateway Simulator (Banco Popular / AZUL 3DS)",
    simulateApprovedBtn: "Simulate Approved Payment (3DS Success)",
    simulateDeclinedBtn: "Simulate Card Declined (Insufficient Funds)",
    backChangePayment: "← Go back & change payment method",
    pciCertified: "PCI-DSS Certified",

    // Success Page
    paidSuccessTitle: "Payment Confirmed Successfully!",
    cashierSuccessTitle: "Order Registered for Cashier Desk!",
    paidSuccessSubtitle: "Your digital access pass has been generated and activated in the system. You may present it directly to track staff.",
    cashierSuccessSubtitle: "Present this order code at the SunKart Park cashier desk to pay in cash or card and activate your pass.",
    orderCodeLabel: "Order Code",
    paidActiveStatus: "STATUS: PAID / ACTIVE",
    pendingPaymentStatus: "STATUS: PENDING PAYMENT AT CASHIER",
    viewDigitalPassBtn: "View My Digital Pass (QR Code)",
    backToCatalogBtn: "Back to Park Catalog",

    // Digital Pass
    passTitle: "DIGITAL ACCESS PASS",
    passValid: "✅ ACTIVE & VALID PASS",
    passUsed: "⛔ PASS ALREADY REDEEMED",
    passPending: "⚠️ PAYMENT PENDING AT CASHIER",
    passInstruction: "Present this QR code to track staff or cashier desk.",
    orderLabel: "Order #:",
    customerLabel: "Primary Guest:",
    totalLabel: "Total:",
    authorizedParticipants: "Authorized Participants",
    printPdfBtn: "Print or Save as PDF",
  },
};
