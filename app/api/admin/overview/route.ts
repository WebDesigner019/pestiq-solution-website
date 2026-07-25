import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { MOCK_BOOKINGS, MOCK_CUSTOMERS } from "@/lib/adminMockData";

export async function GET(req: NextRequest) {
  try {
    if (process.env.DATABASE_URL) {
      try {
        const totalBookings = await prisma.order.count();
        const activeCustomers = await prisma.customer.count();
        const paidOrders = await prisma.order.findMany({
          where: { status: "PAID" },
          select: { totalCents: true },
        });
        const revenue = paidOrders.reduce((sum: number, o: { totalCents: number }) => sum + o.totalCents, 0) / 100;
        const recentOrders = await prisma.order.findMany({
          take: 5,
          orderBy: { createdAt: "desc" },
          include: { customer: true, address: true, plan: true },
        });

        return NextResponse.json({
          totalBookings,
          activeCustomers,
          revenue,
          recentOrders,
        });
      } catch (dbErr) {
        console.warn("DB not ready, returning fallback mock overview:", dbErr);
      }
    }

    // Mock fallback
    const pending = MOCK_BOOKINGS.filter(b => b.status === "pending").length;
    const confirmed = MOCK_BOOKINGS.filter(b => b.status === "confirmed").length;
    const completed = MOCK_BOOKINGS.filter(b => b.status === "completed").length;
    const revenue = MOCK_BOOKINGS.filter(b => b.status === "completed").reduce((s, b) => s + b.price, 0);

    return NextResponse.json({
      totalBookings: MOCK_BOOKINGS.length,
      activeCustomers: MOCK_CUSTOMERS.length,
      revenue,
      pending,
      confirmed,
      completed,
      recent: MOCK_BOOKINGS.slice(0, 5),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch overview metrics" }, { status: 500 });
  }
}
