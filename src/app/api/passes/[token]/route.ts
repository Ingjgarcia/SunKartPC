import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { demoStore } from "@/lib/demo-store";
import { generateQrDataUrl } from "@/lib/qr";

export async function GET(req: Request, { params }: { params: { token: string } }) {
  try {
    const { token } = params;

    // Check DB
    try {
      const pass = await prisma.digitalPass.findUnique({
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

      if (pass) {
        const qrDataUrl = await generateQrDataUrl(pass.securityToken);
        return NextResponse.json({
          success: true,
          data: {
            pass,
            order: pass.order,
            qrDataUrl,
          },
        });
      }
    } catch {
      // Fallback
    }

    // Check demoStore
    const demoOrder = demoStore.orders.find((o) => o.pass?.securityToken === token);
    if (!demoOrder || !demoOrder.pass) {
      return NextResponse.json(
        { success: false, error: { message: "Pase no encontrado." } },
        { status: 404 }
      );
    }

    const qrDataUrl = await generateQrDataUrl(demoOrder.pass.securityToken);
    return NextResponse.json({
      success: true,
      data: {
        pass: demoOrder.pass,
        order: demoOrder,
        qrDataUrl,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { message: error.message } },
      { status: 500 }
    );
  }
}
