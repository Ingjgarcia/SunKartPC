import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { demoStore } from "@/lib/demo-store";
import { generateOrderNumber, generatePassCode, formatCurrency } from "@/lib/formatters";
import { generateSecurityToken } from "@/lib/qr";
import { sendDigitalPassEmail } from "@/lib/email";

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

        // Resolve valid experienceId in DB
        const defaultExp = await prisma.experience.findFirst({ where: { tenantId: tenant.id } });
        const resolvedItems = await Promise.all(
          items.map(async (item: any) => {
            let exp = await prisma.experience.findFirst({
              where: {
                tenantId: tenant.id,
                OR: [{ id: item.experienceId }, { slug: item.experienceId }],
              },
            });
            return {
              experienceId: exp?.id || defaultExp?.id || item.experienceId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              totalPrice: item.totalPrice,
            };
          })
        );

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
              create: resolvedItems,
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
                status: "VALID",
              },
            },
          },
          include: {
            customer: true,
            items: { include: { experience: true } },
            participants: true,
            pass: true,
          },
        });

        // Trigger email if online paid
        if (isOnlinePaid && createdOrder.customer?.email && createdOrder.pass?.securityToken) {
          sendDigitalPassEmail({
            to: createdOrder.customer.email,
            orderNumber: createdOrder.orderNumber,
            customerName: `${createdOrder.customer.firstName} ${createdOrder.customer.lastName || ""}`.trim(),
            experienceTitle: (createdOrder.items?.[0] as any)?.experience?.name || "Experiencia SunKart Park",
            participantsCount: createdOrder.participants?.length || 1,
            participants: createdOrder.participants?.map((p: any) => p.fullName) || [],
            bookingDate: createdOrder.createdAt
              ? new Date(createdOrder.createdAt).toISOString().split("T")[0]
              : new Date().toISOString().split("T")[0],
            totalFormatted: formatCurrency(Number(createdOrder.total), createdOrder.currency || "USD"),
            paymentStatus: "PAID",
            passToken: createdOrder.pass.securityToken,
            passCode: createdOrder.pass.passCode,
            tenantSlug: "sunkart-pc",
          }).catch((err) => console.warn("Email send err on order create:", err));
        }

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
