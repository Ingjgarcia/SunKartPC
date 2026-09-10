import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { demoStore } from "@/lib/demo-store";
import { generateOrderNumber, generatePassCode } from "@/lib/formatters";
import { generateSecurityToken } from "@/lib/qr";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";

    try {
      const dbOrders = await prisma.order.findMany({
        where: query
          ? {
              OR: [
                { orderNumber: { contains: query, mode: "insensitive" } },
                { customer: { firstName: { contains: query, mode: "insensitive" } } },
                { customer: { lastName: { contains: query, mode: "insensitive" } } },
                { customer: { phone: { contains: query } } },
                { customer: { email: { contains: query, mode: "insensitive" } } },
                { pass: { passCode: { contains: query, mode: "insensitive" } } },
              ],
            }
          : undefined,
        include: {
          customer: true,
          items: { include: { experience: true } },
          participants: true,
          pass: true,
        },
        orderBy: { createdAt: "desc" },
        take: 20,
      });

      if (dbOrders.length > 0) {
        return NextResponse.json({ success: true, data: dbOrders });
      }
    } catch {
      // Fallback
    }

    const results = demoStore.findOrderByNumberOrQuery(query);
    return NextResponse.json({ success: true, data: results });
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
    const {
      customer,
      items,
      participants,
      paymentMethod,
      subtotal,
      tax,
      discount = 0,
      total,
      currency = "USD",
      isOnlinePaid = false,
    } = body;

    const orderNumber = generateOrderNumber("SK");
    const securityToken = generateSecurityToken();
    const passCode = generatePassCode("SK-PASS");

    const orderStatus = isOnlinePaid ? "PAID" : "PENDING_PAYMENT";
    const paymentStatus = isOnlinePaid ? "PAID" : "UNPAID";

    // Try creating via Prisma if possible
    try {
      const tenant = await prisma.tenant.findFirst({ where: { slug: "sunkart-pc" } });
      if (tenant) {
        let dbCustomer = await prisma.customer.findFirst({
          where: { tenantId: tenant.id, email: customer.email },
        });

        if (!dbCustomer) {
          dbCustomer = await prisma.customer.create({
            data: {
              tenantId: tenant.id,
              firstName: customer.firstName,
              lastName: customer.lastName,
              email: customer.email,
              phone: customer.phone,
            },
          });
        }

        const createdOrder = await prisma.order.create({
          data: {
            orderNumber,
            tenantId: tenant.id,
            customerId: dbCustomer.id,
            subtotal,
            tax,
            discount,
            total,
            currency,
            orderStatus,
            paymentStatus,
            paymentMethod,
            items: {
              create: items.map((item: any) => ({
                experienceId: item.experienceId,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                totalPrice: item.totalPrice,
              })),
            },
            participants: {
              create: participants.map((p: any) => ({
                fullName: p.fullName,
                isMinor: !!p.isMinor,
              })),
            },
            pass: {
              create: {
                passCode,
                securityToken,
                status: isOnlinePaid ? "VALID" : "VALID", // pass is generated, but scanner verifies paymentStatus == 'PAID'
              },
            },
          },
          include: {
            customer: true,
            items: true,
            participants: true,
            pass: true,
          },
        });

        return NextResponse.json({
          success: true,
          data: createdOrder,
        });
      }
    } catch {
      // Fallback
    }

    // Save in demoStore
    const savedOrder = demoStore.createOrder({
      orderNumber,
      tenantId: "tenant-sunkart-01",
      customer,
      items,
      participants: participants.map((p: any) => ({
        fullName: p.fullName,
        isMinor: !!p.isMinor,
        hasSignature: true,
      })),
      subtotal,
      tax,
      discount,
      total,
      currency,
      orderStatus,
      paymentStatus,
      paymentMethod,
      pass: {
        passCode,
        securityToken,
        status: "VALID",
      },
    });

    return NextResponse.json({
      success: true,
      data: savedOrder,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { message: error.message } },
      { status: 500 }
    );
  }
}
