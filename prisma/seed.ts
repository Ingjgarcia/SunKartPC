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
          logoUrl: "/images/sunkart-logo.png",
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

  // 5. Experiences / Activities Catalog (Exact 11 Experiences)
  const experiencesData = [
    {
      name: "Go-Kart Individual",
      slug: "go-kart-individual",
      description: "Siente la verdadera velocidad en nuestra pista de competición con karts de 270cc y cronometraje digital.",
      price: 10.00,
      durationMinutes: 15,
      minimumAge: 14,
      minimumHeightCm: 145,
      capacity: 1,
      waiverRequired: true,
      isPackage: false,
      imageUrl: "/images/experiences/gokart.jpg",
    },
    {
      name: "Go-Kart Crew 5",
      slug: "go-kart-crew-5",
      description: "Tanda de competición para grupo de 5 corredores con cronometraje digital en pista oficial.",
      price: 45.00,
      durationMinutes: 15,
      minimumAge: 14,
      minimumHeightCm: 145,
      capacity: 5,
      waiverRequired: true,
      isPackage: true,
      imageUrl: "/images/experiences/gokart.jpg",
    },
    {
      name: "Go-Kart Crew 10",
      slug: "go-kart-crew-10",
      description: "Gran Premio en pista exclusiva para 10 pilotos con tanda clasificatoria y carrera final.",
      price: 85.00,
      durationMinutes: 20,
      minimumAge: 14,
      minimumHeightCm: 145,
      capacity: 10,
      waiverRequired: true,
      isPackage: true,
      imageUrl: "/images/experiences/gokart.jpg",
    },
    {
      name: "Paintball Individual",
      slug: "paintball-individual",
      description: "Combate táctico individual en escenario temático. Incluye marcadora semi-automática y 100 paintballs.",
      price: 20.00,
      durationMinutes: 45,
      minimumAge: 12,
      capacity: 1,
      waiverRequired: true,
      isPackage: false,
      imageUrl: "/images/experiences/paintball.jpg",
    },
    {
      name: "Paintball Squad 5",
      slug: "paintball-squad-5",
      description: "Batalla táctica para escuadrón de 5 jugadores con 200 paintballs por persona y recarga ilimitada de CO2.",
      price: 90.00,
      durationMinutes: 45,
      minimumAge: 12,
      capacity: 5,
      waiverRequired: true,
      isPackage: true,
      imageUrl: "/images/experiences/paintball.jpg",
    },
    {
      name: "Paintball Battle 10",
      slug: "paintball-battle-10",
      description: "Torneo 5 vs 5 en campo temático con árbitro oficial, máscaras anti-empañamiento y 250 bolas por jugador.",
      price: 170.00,
      durationMinutes: 45,
      minimumAge: 12,
      capacity: 10,
      waiverRequired: true,
      isPackage: true,
      imageUrl: "/images/experiences/paintball.jpg",
    },
    {
      name: "Paintball Battle 20",
      slug: "paintball-battle-20",
      description: "Guerra táctica para eventos grupales y empresas de hasta 20 jugadores con campo completo reservado.",
      price: 300.00,
      durationMinutes: 60,
      minimumAge: 12,
      capacity: 20,
      waiverRequired: true,
      isPackage: true,
      imageUrl: "/images/experiences/paintball.jpg",
    },
    {
      name: "Sky Adventure Individual",
      slug: "sky-adventure-individual",
      description: "Circuito aéreo de puentes colgantes, redes y tirolesa a 10 metros de altura con vistas panorámicas.",
      price: 10.00,
      durationMinutes: 30,
      minimumAge: 8,
      minimumHeightCm: 120,
      capacity: 1,
      waiverRequired: true,
      isPackage: false,
      imageUrl: "/images/experiences/sky-adventure.jpg",
    },
    {
      name: "Sky Adventure Group 5",
      slug: "sky-adventure-group-5",
      description: "Desafío aéreo de cuerdas y puentes suspendidos para grupo de 5 personas con equipo de seguridad certificado.",
      price: 45.00,
      durationMinutes: 30,
      minimumAge: 8,
      minimumHeightCm: 120,
      capacity: 5,
      waiverRequired: true,
      isPackage: true,
      imageUrl: "/images/experiences/sky-adventure.jpg",
    },
    {
      name: "Sky Adventure Group 10",
      slug: "sky-adventure-group-10",
      description: "Aventura aérea completa para grupos y familias de 10 personas con guía y supervisor exclusivo.",
      price: 85.00,
      durationMinutes: 30,
      minimumAge: 8,
      minimumHeightCm: 120,
      capacity: 10,
      waiverRequired: true,
      isPackage: true,
      imageUrl: "/images/experiences/sky-adventure.jpg",
    },
    {
      name: "SunKart Triple Pass",
      slug: "sunkart-triple-pass",
      description: "Pase todo incluido: tanda de Go-Kart Pro 270cc, partida de Paintball Combat y circuito Sky Adventure.",
      price: 35.00,
      durationMinutes: 90,
      minimumAge: 14,
      capacity: 1,
      waiverRequired: true,
      isPackage: true,
      imageUrl: "/images/experiences/triple-pass.jpg",
    },
  ];

  for (const exp of experiencesData) {
    await prisma.experience.upsert({
      where: { tenantId_slug: { tenantId: tenant.id, slug: exp.slug } },
      update: {
        name: exp.name,
        description: exp.description,
        price: exp.price,
        capacity: exp.capacity,
        durationMinutes: exp.durationMinutes,
        minimumAge: exp.minimumAge,
        minimumHeightCm: exp.minimumHeightCm,
        isPackage: exp.isPackage,
        imageUrl: exp.imageUrl,
      },
      create: {
        tenantId: tenant.id,
        name: exp.name,
        slug: exp.slug,
        description: exp.description,
        price: exp.price,
        currency: "USD",
        durationMinutes: exp.durationMinutes,
        minimumAge: exp.minimumAge,
        minimumHeightCm: exp.minimumHeightCm,
        capacity: exp.capacity,
        waiverRequired: exp.waiverRequired,
        isPackage: exp.isPackage,
        active: true,
        imageUrl: exp.imageUrl,
      },
    });
  }
  console.log("✅ Catalog seeded with exact 11 experiences.");


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
