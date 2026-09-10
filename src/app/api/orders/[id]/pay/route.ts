import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { demoStore } from "@/lib/demo-store";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await req.json();
    const { method = "CASHIER_CASH", amount } = body;

    try {
      const order = await prisma.order.findUnique({
        where: { id },
        include: { pass: true, customer: true },
      });

      if (order) {
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
    } catch {
      // Fallback
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
