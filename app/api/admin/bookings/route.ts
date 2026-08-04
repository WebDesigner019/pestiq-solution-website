import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { MOCK_BOOKINGS } from "@/lib/adminMockData";
import { verifyStaffSession } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  try {
    const staff = await verifyStaffSession(req.headers.get("authorization"));
    if (!staff) return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });

    if (process.env.DATABASE_URL) {
      try {
        const dbBookings = await prisma.order.findMany({
          orderBy: { createdAt: "desc" },
          include: { customer: true, address: true, plan: true, requests: true, jobs: true },
        });
        return NextResponse.json({ bookings: dbBookings });
      } catch (dbErr) {
        console.warn("DB offline, falling back to mock bookings:", dbErr);
      }
    }

    return NextResponse.json({ bookings: MOCK_BOOKINGS });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch bookings" }, { status: 500 });
  }
}
