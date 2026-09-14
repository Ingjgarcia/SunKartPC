import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { demoStore } from "@/lib/demo-store";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await req.json();
    const { method = "CASHIER_CASH", amount, authCode } = body;

    try {
      const order = await prisma.order.findUnique({
        where: { id },
        include: { pass: true, customer: true, items: true, participants: true },
      });

      if (order) {
        // Find active open cashier session
        const activeSession = await prisma.cashierSession.findFirst({
          where: { tenantId: order.tenantId, status: "OPEN" },
          orderBy: { openedAt: "desc" },
        });

        const payAmount = Number(amount) || Number(order.total);

        // Record payment transaction
        await prisma.payment.create({
          data: {
            orderId: order.id,
            cashierSessionId: activeSession?.id || null,
            provider: method,
            externalTxId: authCode || `POS-${Date.now()}`,
            amount: payAmount,
            currency: order.currency,
            status: "PAID",
          },
        });

        // Activate digital pass
        if (order.pass) {
          await prisma.digitalPass.update({
            where: { id: order.pass.id },
            data: { status: "VALID" },
          });
        }

        // Update order status
        const updated = await prisma.order.update({
          where: { id },
          data: {
            orderStatus: "PAID",
            paymentStatus: "PAID",
            paymentMethod: method,
          },
          include: { pass: true, customer: true, items: true, participants: true },
        });

        return NextResponse.json({ success: true, data: updated });
      }
    } catch (dbErr) {
      console.warn("Database payment collection fallback to demoStore:", dbErr);
    }

    const updatedDemoOrder = demoStore.collectPayment(id, method, amount || 0);
    if (!updatedDemoOrder) {
      return NextResponse.json(
        { success: false, error: { message: "Orden no encontrada." } },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updatedDemoOrder });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { message: error.message } },
      { status: 500 }
    );
  }
}
