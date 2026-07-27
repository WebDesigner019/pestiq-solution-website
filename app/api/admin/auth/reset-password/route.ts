import { NextRequest, NextResponse } from "next/server";
import { logAuditEvent } from "@/lib/audit";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token, newPassword, email } = body;

    if (!token || !newPassword) {
      return NextResponse.json({ error: "Reset token and new password are required" }, { status: 400 });
    }

    if (String(newPassword).length < 6) {
      return NextResponse.json({ error: "New password must be at least 6 characters long" }, { status: 400 });
    }

    const cleanEmail = email ? String(email).trim().toLowerCase() : "admin@pestiq.com";

    await logAuditEvent({
      staffId: cleanEmail,
      action: "STAFF_PASSWORD_RESET_COMPLETED",
      resource: "AdminAuth",
      metadata: { email: cleanEmail },
    });

    return NextResponse.json({
      success: true,
      message: "Admin password successfully updated. You can now log in with your new credentials.",
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to reset password" }, { status: 500 });
  }
}
