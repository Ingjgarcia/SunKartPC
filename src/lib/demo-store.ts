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
    logoUrl: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&q=80&w=300",
    primaryColor: "#f97316",
    secondaryColor: "#0f172a",
  };

  public experiences: DemoExperience[] = [
    {
      id: "exp-01",
      tenantId: "tenant-sunkart-01",
      name: "Go-Kart Adult Race (Pro 270cc)",
      slug: "go-kart-adult",
      description: "Siente la verdadera velocidad en nuestra pista asfaltada de competición con karts de 270cc y cronometraje digital.",
      price: 35.00,
      currency: "USD",
      durationMinutes: 15,
      minimumAge: 14,
      minimumHeightCm: 145,
      capacity: 12,
      waiverRequired: true,
      isPackage: false,
      imageUrl: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: "exp-02",
      tenantId: "tenant-sunkart-01",
      name: "Go-Kart Junior Race (160cc)",
      slug: "go-kart-junior",
      description: "Diversión segura y controlada para jóvenes corredores con karts limitados y parachoques perimetrales de seguridad.",
      price: 25.00,
      currency: "USD",
      durationMinutes: 12,
      minimumAge: 8,
      minimumHeightCm: 125,
      capacity: 8,
      waiverRequired: true,
      isPackage: false,
      imageUrl: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: "exp-03",
      tenantId: "tenant-sunkart-01",
      name: "Paintball Jungle Combat",
      slug: "paintball-combat",
      description: "Campo temático táctico al aire libre. Incluye máscara anti-empañamiento, marcador semi-automático y 200 paintballs.",
      price: 40.00,
      currency: "USD",
      durationMinutes: 45,
      minimumAge: 12,
      capacity: 20,
      waiverRequired: true,
      isPackage: false,
      imageUrl: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: "exp-04",
      tenantId: "tenant-sunkart-01",
      name: "Mega Zipline Canopy Flight",
      slug: "zipline-canopy",
      description: "Vuela sobre las copas de los árboles con 5 líneas dobles de alta velocidad y vistas panorámicas de Punta Cana.",
      price: 50.00,
      currency: "USD",
      durationMinutes: 60,
      minimumAge: 6,
      minimumHeightCm: 110,
      capacity: 15,
      waiverRequired: true,
      isPackage: false,
      imageUrl: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: "exp-05",
      tenantId: "tenant-sunkart-01",
      name: "Sky High Ropes & Obstacles",
      slug: "sky-adventure",
      description: "Circuito aéreo de puentes colgantes, redes y plataformas suspendidas a 10 metros de altura.",
      price: 30.00,
      currency: "USD",
      durationMinutes: 30,
      minimumAge: 8,
      minimumHeightCm: 120,
      capacity: 15,
      waiverRequired: true,
      isPackage: false,
      imageUrl: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: "exp-06",
      tenantId: "tenant-sunkart-01",
      name: "Adventure Combo VIP Pass",
      slug: "adventure-combo-vip",
      description: "¡El paquete más vendido! Incluye tanda de Go-Kart Pro Adulto, Paintball Combat (200 bolas) y Circuito Sky Ropes con descuento especial.",
      price: 89.00,
      currency: "USD",
      durationMinutes: 120,
      minimumAge: 14,
      capacity: 25,
      waiverRequired: true,
      isPackage: true,
      imageUrl: "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&q=80&w=800",
      activities: ["Go-Kart Adult Race", "Paintball Combat", "Sky High Ropes"],
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
          experienceId: "exp-01",
          experienceName: "Go-Kart Adult Race (Pro 270cc)",
          quantity: 2,
          unitPrice: 35.00,
          totalPrice: 70.00,
        },
      ],
      participants: [
        { fullName: "Alejandro Gómez", isMinor: false, hasSignature: true },
        { fullName: "Mateo Gómez", isMinor: true, hasSignature: true },
      ],
      subtotal: 70.00,
      tax: 12.60,
      discount: 0,
      total: 82.60,
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
          experienceId: "exp-06",
          experienceName: "Adventure Combo VIP Pass",
          quantity: 1,
          unitPrice: 89.00,
          totalPrice: 89.00,
        },
      ],
      participants: [
        { fullName: "Sarah Jenkins", isMinor: false, hasSignature: true },
      ],
      subtotal: 89.00,
      tax: 16.02,
      discount: 0,
      total: 105.02,
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
