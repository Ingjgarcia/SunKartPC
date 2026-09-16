import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { demoStore } from "@/lib/demo-store";
import { sendDigitalPassEmail } from "@/lib/email";
import { formatCurrency } from "@/lib/formatters";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderId, passToken, targetEmail } = body;

    let orderData: any = null;

    // 1. Search in database
    try {
      if (orderId) {
        orderData = await prisma.order.findFirst({
          where: { OR: [{ id: orderId }, { orderNumber: orderId }] },
          include: {
            customer: true,
            items: { include: { experience: true } },
            participants: true,
            pass: true,
          },
        });
      } else if (passToken) {
        const pass = await prisma.digitalPass.findUnique({
          where: { securityToken: passToken },
          include: {
            order: {
              include: {
                customer: true,
                items: { include: { experience: true } },
                participants: true,
                pass: true,
              },
            },
          },
        });
        if (pass?.order) {
          orderData = pass.order;
        }
      }
    } catch (dbErr) {
      console.warn("DB lookup error in send-pass, falling back to demoStore:", dbErr);
    }

    // 2. Search in demoStore fallback
    if (!orderData) {
      if (orderId) {
        orderData = demoStore.orders.find(
          (o) => o.id === orderId || o.orderNumber === orderId
        );
      } else if (passToken) {
        orderData = demoStore.orders.find((o) => o.pass?.securityToken === passToken);
      }
    }

    if (!orderData) {
      return NextResponse.json(
        { success: false, error: "Orden o Pase no encontrado." },
        { status: 404 }
      );
    }

    const recipientEmail = targetEmail || orderData.customer?.email;
    if (!recipientEmail) {
      return NextResponse.json(
        { success: false, error: "No se proporcionó un correo electrónico de destino." },
        { status: 400 }
      );
    }

    const customerName = `${orderData.customer?.firstName || "Visitante"} ${
      orderData.customer?.lastName || ""
    }`.trim();

    const experienceTitle =
      orderData.items?.[0]?.experience?.title ||
      orderData.items?.[0]?.title ||
      "Experiencia SunKart Park";

    const participants =
      orderData.participants?.map((p: any) => p.fullName || p.name) || [customerName];

    const passTokenStr =
      orderData.pass?.securityToken ||
      orderData.securityToken ||
      passToken ||
      "demo-token";

    const passCodeStr =
      orderData.pass?.passCode || orderData.passCode || `SK-PASS-${orderData.orderNumber}`;

    const totalFormatted = formatCurrency(
      Number(orderData.total),
      orderData.currency || "USD"
    );

    const bookingDate =
      orderData.bookingDate instanceof Date
        ? orderData.bookingDate.toISOString().split("T")[0]
        : orderData.bookingDate || new Date().toISOString().split("T")[0];

    const result = await sendDigitalPassEmail({
      to: recipientEmail,
      orderNumber: orderData.orderNumber,
      customerName,
      experienceTitle,
      participantsCount: participants.length,
      participants,
      bookingDate,
      totalFormatted,
      paymentStatus: orderData.paymentStatus === "PAID" ? "PAID" : "PENDING_PAYMENT",
      passToken: passTokenStr,
      passCode: passCodeStr,
      tenantSlug: "sunkart-pc",
    });

    return NextResponse.json({
      success: true,
      email: recipientEmail,
      simulated: result.simulated,
      messageId: result.messageId,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Error al procesar el envío del pase." },
      { status: 500 }
    );
  }
}
