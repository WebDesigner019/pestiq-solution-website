import { NextRequest, NextResponse } from "next/server";
import { sendPasswordResetEmail } from "@/lib/email";
import { logAuditEvent } from "@/lib/audit";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: "Staff email address is required" }, { status: 400 });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const resetToken = crypto.randomBytes(32).toString("hex");
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const resetUrl = `${siteUrl}/admin?resetToken=${resetToken}&email=${encodeURIComponent(cleanEmail)}`;

    // Dispatch email notification via Resend
    await sendPasswordResetEmail({
      toEmail: cleanEmail,
      resetToken,
      resetUrl,
    });

    await logAuditEvent({
      staffId: cleanEmail,
      action: "STAFF_PASSWORD_RESET_REQUESTED",
      resource: "AdminAuth",
      metadata: { email: cleanEmail },
    });

    return NextResponse.json({
      success: true,
      message: `Password reset authorization link sent to ${cleanEmail}. Check your inbox.`,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to process password reset" }, { status: 500 });
  }
}
