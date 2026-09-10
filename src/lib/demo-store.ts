/**
 * In-Memory Demo Store for AdventureOS
 * Allows immediate, zero-friction demonstration without requiring an external PostgreSQL instance running locally.
 */

export interface DemoTenant {
  id: string;
  slug: string;
  name: string;
  currency: string;
  taxRate: number;
  exchangeRate: number;
  demoMode: boolean;
  logoUrl?: string;
  primaryColor: string;
  secondaryColor: string;
}

export interface DemoExperience {
  id: string;
  tenantId: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  currency: string;
  durationMinutes: number;
  participantsCount: number;
  category: string;
  minimumAge?: number;
  minimumHeightCm?: number;
  capacity?: number;
  waiverRequired: boolean;
  isPackage: boolean;
  imageUrl: string;
  activities?: string[];
}


export interface DemoWaiverVersion {
  id: string;
  waiverId: string;
  versionNumber: number;
  legalText: string;
  language: string;
}

export interface DemoOrder {
  id: string;
  orderNumber: string;
  tenantId: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  items: {
    experienceId: string;
    experienceName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];
  participants: {
    fullName: string;
    isMinor: boolean;
    hasSignature: boolean;
  }[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  currency: string;
  orderStatus: "PENDING_PAYMENT" | "PAID" | "CANCELLED" | "COMPLETED";
  paymentStatus: "UNPAID" | "PAID" | "PENDING";
  paymentMethod?: "ONLINE_CARD" | "CASHIER_CASH" | "CASHIER_CARD_POS" | "MOCK_TEST";
  pass?: {
    passCode: string;
    securityToken: string;
    status: "VALID" | "USED" | "CANCELLED";
    usedAt?: string;
    validatedBy?: string;
  };
  createdAt: string;
}

class DemoStore {
  public tenant: DemoTenant = {
    id: "tenant-sunkart-01",
    slug: "sunkart-pc",
    name: "SunKart Park Punta Cana",
    currency: "USD",
    taxRate: 0.18,
    exchangeRate: 60.00,
    demoMode: true,
    logoUrl: "/images/sunkart-logo.png",
    primaryColor: "#f97316",
    secondaryColor: "#0f172a",
  };

  public experiences: DemoExperience[] = [
    {
      id: "exp-gk-ind",
      tenantId: "tenant-sunkart-01",
      name: "Go-Kart Individual",
      slug: "go-kart-individual",
      description: "Siente la verdadera velocidad en nuestra pista de competición con karts de 270cc y cronometraje digital.",
      price: 10.00,
      currency: "USD",
      durationMinutes: 15,
      participantsCount: 1,
      category: "Go-Kart",
      minimumAge: 14,
      minimumHeightCm: 145,
      waiverRequired: true,
      isPackage: false,
      imageUrl: "/images/experiences/gokart.jpg",
    },
    {
      id: "exp-gk-5",
      tenantId: "tenant-sunkart-01",
      name: "Go-Kart Crew 5",
      slug: "go-kart-crew-5",
      description: "Tanda de competición para grupo de 5 corredores con cronometraje digital en pista oficial.",
      price: 45.00,
      currency: "USD",
      durationMinutes: 15,
      participantsCount: 5,
      category: "Go-Kart",
      minimumAge: 14,
      minimumHeightCm: 145,
      waiverRequired: true,
      isPackage: true,
      imageUrl: "/images/experiences/gokart.jpg",
    },
    {
      id: "exp-gk-10",
      tenantId: "tenant-sunkart-01",
      name: "Go-Kart Crew 10",
      slug: "go-kart-crew-10",
      description: "Gran Premio en pista exclusiva para 10 pilotos con tanda clasificatoria y carrera final.",
      price: 85.00,
      currency: "USD",
      durationMinutes: 20,
      participantsCount: 10,
      category: "Go-Kart",
      minimumAge: 14,
      minimumHeightCm: 145,
      waiverRequired: true,
      isPackage: true,
      imageUrl: "/images/experiences/gokart.jpg",
    },
    {
      id: "exp-pb-ind",
      tenantId: "tenant-sunkart-01",
      name: "Paintball Individual",
      slug: "paintball-individual",
      description: "Combate táctico individual en escenario temático. Incluye marcadora semi-automática y 100 paintballs.",
      price: 20.00,
      currency: "USD",
      durationMinutes: 45,
      participantsCount: 1,
      category: "Paintball",
      minimumAge: 12,
      waiverRequired: true,
      isPackage: false,
      imageUrl: "/images/experiences/paintball.jpg",
    },
    {
      id: "exp-pb-5",
      tenantId: "tenant-sunkart-01",
      name: "Paintball Squad 5",
      slug: "paintball-squad-5",
      description: "Batalla táctica para escuadrón de 5 jugadores con 200 paintballs por persona y recarga ilimitada de CO2.",
      price: 90.00,
      currency: "USD",
      durationMinutes: 45,
      participantsCount: 5,
      category: "Paintball",
      minimumAge: 12,
      waiverRequired: true,
      isPackage: true,
      imageUrl: "/images/experiences/paintball.jpg",
    },
    {
      id: "exp-pb-10",
      tenantId: "tenant-sunkart-01",
      name: "Paintball Battle 10",
      slug: "paintball-battle-10",
      description: "Torneo 5 vs 5 en campo temático con árbitro oficial, máscaras anti-empañamiento y 250 bolas por jugador.",
      price: 170.00,
      currency: "USD",
      durationMinutes: 45,
      participantsCount: 10,
      category: "Paintball",
      minimumAge: 12,
      waiverRequired: true,
      isPackage: true,
      imageUrl: "/images/experiences/paintball.jpg",
    },
    {
      id: "exp-pb-20",
      tenantId: "tenant-sunkart-01",
      name: "Paintball Battle 20",
      slug: "paintball-battle-20",
      description: "Guerra táctica para eventos grupales y empresas de hasta 20 jugadores con campo completo reservado.",
      price: 300.00,
      currency: "USD",
      durationMinutes: 60,
      participantsCount: 20,
      category: "Paintball",
      minimumAge: 12,
      waiverRequired: true,
      isPackage: true,
      imageUrl: "/images/experiences/paintball.jpg",
    },
    {
      id: "exp-sa-ind",
      tenantId: "tenant-sunkart-01",
      name: "Sky Adventure Individual",
      slug: "sky-adventure-individual",
      description: "Circuito aéreo de puentes colgantes, redes y tirolesa a 10 metros de altura con vistas panorámicas.",
      price: 10.00,
      currency: "USD",
      durationMinutes: 30,
      participantsCount: 1,
      category: "Sky Adventure",
      minimumAge: 8,
      minimumHeightCm: 120,
      waiverRequired: true,
      isPackage: false,
      imageUrl: "/images/experiences/sky-adventure.jpg",
    },
    {
      id: "exp-sa-5",
      tenantId: "tenant-sunkart-01",
      name: "Sky Adventure Group 5",
      slug: "sky-adventure-group-5",
      description: "Desafío aéreo de cuerdas y puentes suspendidos para grupo de 5 personas con equipo de seguridad certificado.",
      price: 45.00,
      currency: "USD",
      durationMinutes: 30,
      participantsCount: 5,
      category: "Sky Adventure",
      minimumAge: 8,
      minimumHeightCm: 120,
      waiverRequired: true,
      isPackage: true,
      imageUrl: "/images/experiences/sky-adventure.jpg",
    },
    {
      id: "exp-sa-10",
      tenantId: "tenant-sunkart-01",
      name: "Sky Adventure Group 10",
      slug: "sky-adventure-group-10",
      description: "Aventura aérea completa para grupos y familias de 10 personas con guía y supervisor exclusivo.",
      price: 85.00,
      currency: "USD",
      durationMinutes: 30,
      participantsCount: 10,
      category: "Sky Adventure",
      minimumAge: 8,
      minimumHeightCm: 120,
      waiverRequired: true,
      isPackage: true,
      imageUrl: "/images/experiences/sky-adventure.jpg",
    },
    {
      id: "exp-triple-pass",
      tenantId: "tenant-sunkart-01",
      name: "SunKart Triple Pass",
      slug: "sunkart-triple-pass",
      description: "Pase todo incluido: tanda de Go-Kart Pro 270cc, partida de Paintball Combat y circuito Sky Adventure.",
      price: 35.00,
      currency: "USD",
      durationMinutes: 90,
      participantsCount: 1,
      category: "Go-Kart + Paintball + Sky",
      minimumAge: 14,
      waiverRequired: true,
      isPackage: true,
      imageUrl: "/images/experiences/triple-pass.jpg",
      activities: ["Go-Kart", "Paintball", "Sky Adventure"],
    },
  ];

  public waiverVersion: DemoWaiverVersion = {
    id: "wv-01",
    waiverId: "w-01",
    versionNumber: 1,
    language: "es",
    legalText: `ACUERDO DE ASUNCIÓN DE RIESGOS, EXONERACIÓN DE RESPONSABILIDAD Y LIBERACIÓN LEGAL
SUNKART PARK PUNTA CANA (ADVENTUREOS)

Al firmar este documento electrónico, declaro de manera libre, voluntaria e informada que comprendo la naturaleza y riesgos de las actividades recreativas y de velocidad (Go-Karts, Paintball, Zipline, Puentes Aéreos) en SunKart Park.

1. ASUNCIÓN DE RIESGO: Acepto los riesgos inherentes de choque, aceleración y fricción bajo mi propia cuenta y riesgo.
2. REQUISITOS DE SALUD: Certifico que no padezco de afecciones cardíacas, cervicales, embarazo o limitaciones motoras incompatibles con la actividad.
3. REGLAS Y EQUIPO: Utilizaré siempre casco cerrado y arnés cuando aplique, obedeciendo en todo momento las banderas y al personal del parque.
4. MENORES DE EDAD: Si registro a un menor de 18 años, actúo como su padre, madre o tutor legal con facultad plena para autorizarlo.
5. FIRMA ELECTRÓNICA: Reconozco la plena validez jurídica de mi firma digital en este sistema.`,
  };

  public orders: DemoOrder[] = [
    {
      id: "order-demo-01",
      orderNumber: "SK-001001",
      tenantId: "tenant-sunkart-01",
      customer: {
        firstName: "Alejandro",
        lastName: "Gómez",
        email: "alejandro.gomez@example.com",
        phone: "+1 829 555 1234",
      },
      items: [
        {
          experienceId: "exp-gk-ind",
          experienceName: "Go-Kart Individual",
          quantity: 2,
          unitPrice: 10.00,
          totalPrice: 20.00,
        },
      ],
      participants: [
        { fullName: "Alejandro Gómez", isMinor: false, hasSignature: true },
        { fullName: "Mateo Gómez", isMinor: true, hasSignature: true },
      ],
      subtotal: 16.95,
      tax: 3.05,
      discount: 0,
      total: 20.00,
      currency: "USD",
      orderStatus: "PAID",
      paymentStatus: "PAID",
      paymentMethod: "ONLINE_CARD",
      pass: {
        passCode: "SK-PASS-7F82A91D",
        securityToken: "7f82a91d-demo-4c6e-b3d9-a72f0e6c5182",
        status: "VALID",
      },
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: "order-demo-02",
      orderNumber: "SK-001002",
      tenantId: "tenant-sunkart-01",
      customer: {
        firstName: "Sarah",
        lastName: "Jenkins",
        email: "sarah.j@example.com",
        phone: "+1 305 555 7890",
      },
      items: [
        {
          experienceId: "exp-triple-pass",
          experienceName: "SunKart Triple Pass",
          quantity: 1,
          unitPrice: 35.00,
          totalPrice: 35.00,
        },
      ],
      participants: [
        { fullName: "Sarah Jenkins", isMinor: false, hasSignature: true },
      ],
      subtotal: 29.66,
      tax: 5.34,
      discount: 0,
      total: 35.00,
      currency: "USD",
      orderStatus: "PENDING_PAYMENT",

      paymentStatus: "UNPAID",
      paymentMethod: "CASHIER_CASH",
      pass: {
        passCode: "SK-PASS-33B10C99",
        securityToken: "33b10c99-demo-4c6e-b3d9-a72f0e6c5182",
        status: "VALID",
      },
      createdAt: new Date(Date.now() - 1800000).toISOString(),
    },
  ];

  public cashierSession: {
    isOpen: boolean;
    openedAt: string;
    openingFloat: number;
    cashCollected: number;
    cardPosCollected: number;
    ordersProcessed: number;
  } = {
    isOpen: true,
    openedAt: new Date(Date.now() - 7200000).toISOString(),
    openingFloat: 100.00,
    cashCollected: 0,
    cardPosCollected: 0,
    ordersProcessed: 1,
  };

  createOrder(orderData: Omit<DemoOrder, "id" | "createdAt">): DemoOrder {
    const newOrder: DemoOrder = {
      ...orderData,
      id: `order-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.orders.unshift(newOrder);
    return newOrder;
  }

  findOrderByNumberOrQuery(query: string): DemoOrder[] {
    const q = query.trim().toLowerCase();
    if (!q) return this.orders.slice(0, 10);

    return this.orders.filter((o) => {
      const matchOrderNum = o.orderNumber.toLowerCase().includes(q);
      const matchCustName = `${o.customer.firstName} ${o.customer.lastName}`.toLowerCase().includes(q);
      const matchCustPhone = o.customer.phone.toLowerCase().includes(q);
      const matchCustEmail = o.customer.email.toLowerCase().includes(q);
      const matchPassCode = o.pass?.passCode.toLowerCase().includes(q);
      const matchToken = o.pass?.securityToken.toLowerCase() === q;
      return matchOrderNum || matchCustName || matchCustPhone || matchCustEmail || matchPassCode || matchToken;
    });
  }

  collectPayment(orderId: string, method: "CASHIER_CASH" | "CASHIER_CARD_POS", amount: number): DemoOrder | null {
    const order = this.orders.find((o) => o.id === orderId);
    if (!order) return null;

    order.orderStatus = "PAID";
    order.paymentStatus = "PAID";
    order.paymentMethod = method;

    if (!order.pass) {
      const hex = Math.random().toString(16).substring(2, 10).toUpperCase();
      order.pass = {
        passCode: `SK-PASS-${hex}`,
        securityToken: crypto.randomUUID ? crypto.randomUUID() : `token-${Date.now()}`,
        status: "VALID",
      };
    } else {
      order.pass.status = "VALID";
    }

    if (method === "CASHIER_CASH") {
      this.cashierSession.cashCollected += amount;
    } else {
      this.cashierSession.cardPosCollected += amount;
    }
    this.cashierSession.ordersProcessed += 1;

    return order;
  }

  redeemPass(securityToken: string, staffName = "Staff de Pista"): { status: string; message: string; order?: DemoOrder } {
    const order = this.orders.find((o) => o.pass?.securityToken === securityToken);
    if (!order || !order.pass) {
      return { status: "NOT_FOUND", message: "Código QR no encontrado en el sistema." };
    }

    if (order.paymentStatus !== "PAID") {
      return {
        status: "UNPAID",
        message: `Esta orden está PENDIENTE DE PAGO (${order.orderNumber}). Por favor remitir al cliente a Caja.`,
        order,
      };
    }

    if (order.pass.status === "USED") {
      return {
        status: "ALREADY_USED",
        message: `Pase YA FUE UTILIZADO a las ${new Date(order.pass.usedAt || Date.now()).toLocaleTimeString()} por ${order.pass.validatedBy || "otro operador"}.`,
        order,
      };
    }

    if (order.pass.status !== "VALID") {
      return { status: order.pass.status, message: `Pase en estado: ${order.pass.status}`, order };
    }

    // Atomic redemption
    order.pass.status = "USED";
    order.pass.usedAt = new Date().toISOString();
    order.pass.validatedBy = staffName;

    return {
      status: "SUCCESS",
      message: `Pase validado exitosamente para ${order.participants.length} participante(s).`,
      order,
    };
  }
}

declare global {
  // eslint-disable-next-line no-var
  var demoStore: DemoStore | undefined;
}

export const demoStore = global.demoStore || new DemoStore();
if (process.env.NODE_ENV !== "production") global.demoStore = demoStore;
