import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { demoStore } from "@/lib/demo-store";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const tenantSlug = searchParams.get("tenant") || "sunkart-pc";

    try {
      const tenant = await prisma.tenant.findUnique({
        where: { slug: tenantSlug },
        include: {
          experiences: {
            where: { active: true },
            orderBy: { price: "asc" },
          },
          settings: true,
        },
      });

      if (tenant && tenant.experiences.length > 0) {
        return NextResponse.json({
          success: true,
          data: {
            tenant: {
              name: tenant.name,
              slug: tenant.slug,
              currency: tenant.currency,
              settings: tenant.settings,
            },
            experiences: tenant.experiences,
          },
        });
      }
    } catch {
      // Database connection error -> use demoStore
    }

    // Fallback to demoStore
    return NextResponse.json({
      success: true,
      data: {
        tenant: demoStore.tenant,
        experiences: demoStore.experiences,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: { message: error.message || "Failed to fetch experiences" },
      },
      { status: 500 }
    );
  }
}
