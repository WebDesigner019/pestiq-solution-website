import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyStaffSession } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  try {
    const staff = await verifyStaffSession(req.headers.get("authorization"));
    if (!staff) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    if (process.env.DATABASE_URL) {
      try {
        const jobs = await prisma.job.findMany({
          orderBy: { scheduledStart: "asc" },
          include: {
            order: { include: { customer: true } },
            request: { include: { address: true } },
            technician: true,
            calendarSyncs: true,
          },
        });

        const requests = await prisma.appointmentRequest.findMany({
          where: { confirmed: false },
          orderBy: { preferredDate: "asc" },
          include: { order: { include: { customer: true } }, address: true },
        });

        return NextResponse.json({ jobs, pendingRequests: requests });
      } catch (dbErr) {
        console.warn("DB offline, returning fallback appointments:", dbErr);
      }
    }

    return NextResponse.json({
      jobs: [],
      pendingRequests: [],
      message: "Appointments ready for DB sync",
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch appointments" }, { status: 500 });
  }
}
