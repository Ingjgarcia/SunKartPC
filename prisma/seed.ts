import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting AdventureOS Database Seed...");

  // 1. Password hash for demo users (password: "demo123")
  const passwordHash = await bcrypt.hash("demo123", 10);

  // 2. Platform Super Admin (Cross-tenant)
  const superAdmin = await prisma.user.upsert({
    where: { email: "superadmin@adventureos.com" },
    update: {},
    create: {
      email: "superadmin@adventureos.com",
      passwordHash,
      name: "Global Platform Administrator",
      role: Role.SUPER_ADMIN,
      active: true,
    },
  });
  console.log("✅ Super Admin created:", superAdmin.email);

  // 3. Tenant: SunKart Park Punta Cana
  const tenant = await prisma.tenant.upsert({
    where: { slug: "sunkart-pc" },
    update: {},
    create: {
      slug: "sunkart-pc",
      name: "SunKart Park Punta Cana",
      legalName: "SunKart Adventures SRL",
      taxId: "131-99887-1",
      email: "info@sunkartpuntacana.com",
      phone: "+1 (809) 555-KART",
      address: "Boulevard Turístico del Este Km 14, Punta Cana",
      city: "Punta Cana",
      country: "DO",
      currency: "USD",
      timezone: "America/Santo_Domingo",
      active: true,
      settings: {
        create: {
          logoUrl: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&q=80&w=300",
          primaryColor: "#f97316", // SunKart Orange
          secondaryColor: "#0f172a", // Slate Dark
          taxRate: 0.18, // 18% ITBIS
          exchangeRate: 60.00, // 1 USD = 60 DOP
          receiptFooterNote: "¡Gracias por visitar SunKart Park Punta Cana! La velocidad con seguridad es pura adrenalina.",
          allowCashierPayLater: true,
          requireWaiverBeforePay: true,
          demoMode: true,
        },
      },
    },
  });
  console.log("✅ Tenant created:", tenant.name);

  // 4. Tenant Users
  const usersToCreate = [
    {
      email: "admin@sunkart.com",
      name: "Carlos Almonte (Gerente)",
      role: Role.BUSINESS_ADMIN,
    },
    {
      email: "cashier@sunkart.com",
      name: "Valeria Peña (Cajera Principal)",
      role: Role.CASHIER,
    },
    {
      email: "staff@sunkart.com",
      name: "Marcos Santana (Operador de Pista)",
      role: Role.STAFF,
    },
  ];

  for (const u of usersToCreate) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        tenantId: tenant.id,
        email: u.email,
        passwordHash,
        name: u.name,
        role: u.role,
        active: true,
      },
    });
  }
  console.log("✅ Tenant Users seeded: Business Admin, Cashier, Staff.");

  // 5. Experiences / Activities Catalog
  const expKartAdult = await prisma.experience.upsert({
    where: { tenantId_slug: { tenantId: tenant.id, slug: "go-kart-adult" } },
    update: {},
    create: {
      tenantId: tenant.id,
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
      active: true,
      imageUrl: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=800",
    },
  });

  const expKartJunior = await prisma.experience.upsert({
    where: { tenantId_slug: { tenantId: tenant.id, slug: "go-kart-junior" } },
    update: {},
    create: {
      tenantId: tenant.id,
      name: "Go-Kart Junior Race (160cc)",
      slug: "go-kart-junior",
      description: "Diversión segura y controlada para jóvenes corredores con karts limitados y parachoques perimetrales de seguridad.",
      price: 25.00,
      currency: "USD",
      durationMinutes: 12,
      minimumAge: 8,
      maximumAge: 13,
      minimumHeightCm: 125,
      capacity: 8,
      waiverRequired: true,
      active: true,
      imageUrl: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&q=80&w=800",
    },
  });

  const expPaintball = await prisma.experience.upsert({
    where: { tenantId_slug: { tenantId: tenant.id, slug: "paintball-combat" } },
    update: {},
    create: {
      tenantId: tenant.id,
      name: "Paintball Jungle Combat",
      slug: "paintball-combat",
      description: "Campo temático táctico al aire libre. Incluye máscara anti-empañamiento, marcador semi-automático y 200 paintballs.",
      price: 40.00,
      currency: "USD",
      durationMinutes: 45,
      minimumAge: 12,
      capacity: 20,
      waiverRequired: true,
      active: true,
      imageUrl: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=800",
    },
  });

  const expZipline = await prisma.experience.upsert({
    where: { tenantId_slug: { tenantId: tenant.id, slug: "zipline-canopy" } },
    update: {},
    create: {
      tenantId: tenant.id,
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
      active: true,
      imageUrl: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=800",
    },
  });

  const expSky = await prisma.experience.upsert({
    where: { tenantId_slug: { tenantId: tenant.id, slug: "sky-adventure" } },
    update: {},
    create: {
      tenantId: tenant.id,
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
      active: true,
      imageUrl: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=800",
    },
  });

  // Combo VIP (Package containing Go-Kart Adult + Paintball + Sky Adventure)
  const expComboVIP = await prisma.experience.upsert({
    where: { tenantId_slug: { tenantId: tenant.id, slug: "adventure-combo-vip" } },
    update: {},
    create: {
      tenantId: tenant.id,
      name: "Adventure Combo VIP Pass",
      slug: "adventure-combo-vip",
      description: "¡El paquete definitivo! Incluye 1 tanda de Go-Kart Adult Pro, 1 partida de Paintball Jungle (200 bolas) y Acceso completo al Sky High Ropes.",
      price: 89.00, // Discounted from 35+40+30 = $105
      currency: "USD",
      durationMinutes: 120,
      minimumAge: 14,
      capacity: 25,
      waiverRequired: true,
      isPackage: true,
      active: true,
      imageUrl: "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&q=80&w=800",
    },
  });

  // Link bundle items
  await prisma.experienceItem.deleteMany({ where: { packageId: expComboVIP.id } });
  await prisma.experienceItem.createMany({
    data: [
      { packageId: expComboVIP.id, componentId: expKartAdult.id, quantity: 1 },
      { packageId: expComboVIP.id, componentId: expPaintball.id, quantity: 1 },
      { packageId: expComboVIP.id, componentId: expSky.id, quantity: 1 },
    ],
  });
  console.log("✅ Catalog seeded with 5 activities + 1 VIP Package.");

  // 6. Waiver & Legal Version 1
  let waiver = await prisma.waiver.findFirst({ where: { tenantId: tenant.id } });
  if (!waiver) {
    waiver = await prisma.waiver.create({
      data: {
        tenantId: tenant.id,
        title: "SunKart Park General Activity, Karting & Risk Release Waiver",
        active: true,
        versions: {
          create: {
            versionNumber: 1,
            language: "es",
            legalText: `ACUERDO DE ASUNCIÓN DE RIESGOS, EXONERACIÓN DE RESPONSABILIDAD Y LIBERACIÓN LEGAL
SUNKART PARK PUNTA CANA (ADVENTUREOS)

Al firmar este documento electrónico, declaro de manera libre, consciente y voluntaria que comprendo plenamente la naturaleza de las actividades recreativas y de alta velocidad que se desarrollan en SunKart Park (incluyendo, sin limitación: carreras de go-karts, paintball, puentes colgantes, tirolesas y juegos mecánicos).

1. ASUNCIÓN DE RIESGOS: Reconozco que la conducción de karts y las actividades de aventura conllevan riesgos inherentes de choque, impacto contra barreras de neumáticos, fricción, ruido elevado y esfuerzo físico. Acepto voluntariamente dichos riesgos bajo mi entera responsabilidad.

2. REQUISITOS FÍSICOS Y MÉDICOS: Certifico que no sufro de problemas cardíacos, lesiones de cuello o espalda, problemas de equilibrio, embarazo o cualquier otra condición médica que desaconseje la participación en deportes de motor o adrenalina. Declaro no estar bajo la influencia del alcohol, drogas o medicamentos que afecten mis reflejos.

3. USO OBLIGATORIO DE EQUIPO: Me comprometo a utilizar en todo momento el casco de protección debidamente abrochado, protector de cuello (si aplica), cinturón de seguridad y calzado cerrado. Obedeceré de inmediato las banderas, semáforos e instrucciones del personal de pista.

4. MENORES DE EDAD (CONSENTIMIENTO DE PADRE/MADRE O TUTOR): En caso de actuar como padre, madre o tutor legal de un participante menor de dieciocho (18) años, otorgo mi autorización expresa para su participación y asumo de forma directa, solidaria e ilimitada cualquier responsabilidad derivada de su conducta y bienestar durante la visita al parque.

5. VALIDEZ FORENSE DE FIRMA ELECTRÓNICA: Acepto que mi firma digital manuscrita capturada en esta plataforma, junto con mi dirección IP y sello de tiempo digital, posee la misma fuerza probatoria y legal que una firma autógrafa sobre papel conforme a la Ley de Comercio Electrónico y Firmas Digitales de la República Dominicana.`,
            active: true,
          },
        },
      },
    });
  }
  console.log("✅ Legal Waiver v1 seeded with minor consent terms.");

  console.log("🚀 AdventureOS Database Seed Completed Successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
