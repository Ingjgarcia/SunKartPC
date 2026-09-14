import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { demoStore } from "@/lib/demo-store";

export async function GET() {
  try {
    try {
      const tenant = await prisma.tenant.findFirst({ where: { slug: "sunkart-pc" } });
      if (tenant) {
        const session = await prisma.cashierSession.findFirst({
          where: { tenantId: tenant.id, status: "OPEN" },
          include: {
            payments: true,
            user: true,
          },
          orderBy: { openedAt: "desc" },
        });

        if (session) {
          const openingFloat = Number(session.openingFloat) || 0;
          let cashCollected = 0;
          let cardPosCollected = 0;

          session.payments.forEach((p) => {
            const amt = Number(p.amount) || 0;
            if (p.provider === "CASHIER_CASH" || p.provider === "CASH") {
              cashCollected += amt;
            } else if (p.provider === "CASHIER_CARD_POS" || p.provider === "CARD_POS") {
              cardPosCollected += amt;
            }
          });

          return NextResponse.json({
            success: true,
            data: {
              id: session.id,
              isOpen: true,
              openedAt: session.openedAt.toISOString(),
              openingFloat,
              cashCollected,
              cardPosCollected,
              ordersProcessed: session.payments.length,
              expectedCash: openingFloat + cashCollected,
              cashierName: session.user?.name || "Valeria Peña",
              notes: session.notes,
            },
          });
        } else {
          return NextResponse.json({
            success: true,
            data: {
              isOpen: false,
              openingFloat: 0,
              cashCollected: 0,
              cardPosCollected: 0,
              ordersProcessed: 0,
              expectedCash: 0,
              cashierName: "Valeria Peña",
            },
          });
        }
      }
    } catch (dbErr) {
      console.warn("DB not reachable for cashier session, falling back to demoStore:", dbErr);
    }

    // Fallback to demoStore
    return NextResponse.json({
      success: true,
      data: {
        ...demoStore.cashierSession,
        expectedCash: (demoStore.cashierSession.openingFloat || 0) + (demoStore.cashierSession.cashCollected || 0),
        cashierName: "Valeria Peña",
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { message: error.message } },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, float = 100, sessionId, closingFloat, notes } = body;

    try {
      const tenant = await prisma.tenant.findFirst({ where: { slug: "sunkart-pc" } });
      const cashierUser = await prisma.user.findFirst({
        where: { tenantId: tenant?.id, role: "CASHIER" },
      });

      if (tenant && cashierUser) {
        if (action === "OPEN") {
          // Close any zombie open sessions first
          await prisma.cashierSession.updateMany({
            where: { tenantId: tenant.id, status: "OPEN" },
            data: { status: "CLOSED", closedAt: new Date() },
          });

          const newSession = await prisma.cashierSession.create({
            data: {
              tenantId: tenant.id,
              userId: cashierUser.id,
              status: "OPEN",
              openingFloat: Number(float) || 100,
              openedAt: new Date(),
            },
            include: { user: true },
          });

          // Sync demoStore as well
          demoStore.cashierSession.isOpen = true;
          demoStore.cashierSession.openedAt = newSession.openedAt.toISOString();
          demoStore.cashierSession.openingFloat = Number(float) || 100;
          demoStore.cashierSession.cashCollected = 0;
          demoStore.cashierSession.cardPosCollected = 0;
          demoStore.cashierSession.ordersProcessed = 0;

          return NextResponse.json({
            success: true,
            data: {
              id: newSession.id,
              isOpen: true,
              openedAt: newSession.openedAt.toISOString(),
              openingFloat: Number(newSession.openingFloat),
              cashCollected: 0,
              cardPosCollected: 0,
              ordersProcessed: 0,
              expectedCash: Number(newSession.openingFloat),
              cashierName: newSession.user?.name || cashierUser.name,
            },
          });
        } else if (action === "CLOSE") {
          const targetSession = sessionId
            ? await prisma.cashierSession.findUnique({
                where: { id: sessionId },
                include: { payments: true, user: true },
              })
            : await prisma.cashierSession.findFirst({
                where: { tenantId: tenant.id, status: "OPEN" },
                include: { payments: true, user: true },
                orderBy: { openedAt: "desc" },
              });

          if (targetSession) {
            const opening = Number(targetSession.openingFloat) || 0;
            let cashCollected = 0;
            let cardPosCollected = 0;

            targetSession.payments.forEach((p) => {
              const amt = Number(p.amount) || 0;
              if (p.provider === "CASHIER_CASH" || p.provider === "CASH") {
                cashCollected += amt;
              } else if (p.provider === "CASHIER_CARD_POS" || p.provider === "CARD_POS") {
                cardPosCollected += amt;
              }
            });

            const expectedCash = opening + cashCollected;
            const actualCash = Number(closingFloat) || 0;
            const difference = actualCash - expectedCash;

            const finalNotes = notes
              ? `${notes} | Diferencia de caja: ${difference >= 0 ? "+" : ""}${difference.toFixed(2)} USD`
              : `Diferencia de caja: ${difference >= 0 ? "+" : ""}${difference.toFixed(2)} USD`;

            const closed = await prisma.cashierSession.update({
              where: { id: targetSession.id },
              data: {
                status: "CLOSED",
                closedAt: new Date(),
                closingFloat: actualCash,
                notes: finalNotes,
              },
              include: { user: true },
            });

            // Update demoStore
            demoStore.cashierSession.isOpen = false;

            return NextResponse.json({
              success: true,
              data: {
                id: closed.id,
                isOpen: false,
                openedAt: closed.openedAt.toISOString(),
                closedAt: closed.closedAt?.toISOString(),
                openingFloat: opening,
                closingFloat: actualCash,
                cashCollected,
                cardPosCollected,
                expectedCash,
                difference,
                notes: closed.notes,
                ordersProcessed: targetSession.payments.length,
                cashierName: closed.user?.name || cashierUser.name,
              },
            });
          }
        }
      }
    } catch (dbErr) {
      console.warn("DB error in cashier session action, using demoStore:", dbErr);
    }

    // Fallback demoStore
    if (action === "OPEN") {
      demoStore.cashierSession.isOpen = true;
      demoStore.cashierSession.openedAt = new Date().toISOString();
      demoStore.cashierSession.openingFloat = Number(float) || 100;
      demoStore.cashierSession.cashCollected = 0;
      demoStore.cashierSession.cardPosCollected = 0;
      demoStore.cashierSession.ordersProcessed = 0;
    } else if (action === "CLOSE") {
      demoStore.cashierSession.isOpen = false;
    }

    return NextResponse.json({
      success: true,
      data: {
        ...demoStore.cashierSession,
        expectedCash: (demoStore.cashierSession.openingFloat || 0) + (demoStore.cashierSession.cashCollected || 0),
        cashierName: "Valeria Peña",
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { message: error.message } },
      { status: 500 }
    );
  }
}
