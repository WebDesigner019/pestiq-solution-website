import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { MOCK_BOOKINGS } from "@/lib/adminMockData";

export async function GET(req: NextRequest) {
  try {
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
