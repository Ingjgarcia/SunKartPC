import { NextResponse } from "next/server";
import { demoStore } from "@/lib/demo-store";

export async function GET() {
  return NextResponse.json({
    success: true,
    data: demoStore.cashierSession,
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, float } = body;

    if (action === "OPEN") {
      demoStore.cashierSession.isOpen = true;
      demoStore.cashierSession.openedAt = new Date().toISOString();
      demoStore.cashierSession.openingFloat = float || 100;
      demoStore.cashierSession.cashCollected = 0;
      demoStore.cashierSession.cardPosCollected = 0;
      demoStore.cashierSession.ordersProcessed = 0;
    } else if (action === "CLOSE") {
      demoStore.cashierSession.isOpen = false;
    }

    return NextResponse.json({
      success: true,
      data: demoStore.cashierSession,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { message: error.message } },
      { status: 500 }
    );
  }
}
