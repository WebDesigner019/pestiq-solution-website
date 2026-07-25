import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyStaffSession } from "@/lib/supabase";
import { MOCK_CUSTOMERS } from "@/lib/adminMockData";

export async function GET(req: NextRequest) {
  try {
    const staff = await verifyStaffSession(req.headers.get("authorization"));
    if (!staff) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    if (process.env.DATABASE_URL) {
      try {
        const customers = await prisma.customer.findMany({
          orderBy: { createdAt: "desc" },
          include: {
            addresses: true,
            orders: {
              include: { plan: true },
            },
            subscriptions: true,
          },
        });
        return NextResponse.json({ customers });
      } catch (dbErr) {
        console.warn("DB offline, returning fallback customer CRM data:", dbErr);
      }
    }

    return NextResponse.json({ customers: MOCK_CUSTOMERS });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch customer CRM records" }, { status: 500 });
  }
}
