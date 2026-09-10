import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { demoStore } from "@/lib/demo-store";

export async function POST(req: Request, { params }: { params: { token: string } }) {
  try {
    const { token } = params;
    const body = await req.json().catch(() => ({}));
    const staffName = body.staffName || "Staff de Operaciones";

    // 1. Try Prisma Atomic Transaction
    try {
      const result = await prisma.$transaction(async (tx) => {
        const pass = await tx.digitalPass.findUnique({
          where: { securityToken: token },
          include: {
            order: {
              include: {
                customer: true,
                items: { include: { experience: true } },
                participants: true,
              },
            },
          },
        });

        if (!pass) {
          return { status: "NOT_FOUND", message: "Pase no encontrado en la base de datos." };
        }

        if (pass.order.paymentStatus !== "PAID") {
          return {
            status: "UNPAID",
            message: `Esta orden (${pass.order.orderNumber}) aún no ha sido pagada. Remitir al cliente a Caja.`,
            order: pass.order,
          };
        }

        if (pass.status === "USED") {
          return {
            status: "ALREADY_USED",
            message: `Pase YA FUE UTILIZADO a las ${new Date(pass.usedAt || Date.now()).toLocaleTimeString()} por ${pass.validatedBy || "otro operador"}.`,
            order: pass.order,
          };
        }

        if (pass.status !== "VALID") {
          return { status: pass.status, message: `Pase en estado: ${pass.status}`, order: pass.order };
        }

        // Conditional atomic update
        const updated = await tx.digitalPass.updateMany({
          where: {
            id: pass.id,
            status: "VALID",
          },
          data: {
            status: "USED",
            usedAt: new Date(),
            validatedBy: staffName,
          },
        });

        if (updated.count === 0) {
          return {
            status: "ALREADY_USED",
            message: "El pase acaba de ser canjeado en otro escaneo concurrente.",
          };
        }

        return {
          status: "SUCCESS",
          message: `Pase validado exitosamente para ${pass.order.participants.length} participante(s).`,
          order: pass.order,
        };
      });

      return NextResponse.json({ success: true, data: result });
    } catch {
      // Fallback to demoStore
    }

    const demoResult = demoStore.redeemPass(token, staffName);
    return NextResponse.json({ success: true, data: demoResult });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { message: error.message } },
      { status: 500 }
    );
  }
}
