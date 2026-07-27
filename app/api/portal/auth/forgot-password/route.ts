import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/email";
import { randomBytes } from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email address is required." }, { status: 400 });
    }

    const customer = await prisma.customer.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    // Always return success to prevent email enumeration attacks
    if (!customer) {
      return NextResponse.json({
        message: "If an account exists with this email, you will receive a reset link shortly.",
      });
    }

    // Generate secure reset token
    const resetToken = randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

    await prisma.customer.update({
      where: { id: customer.id },
      data: {
        portalResetToken: resetToken,
        portalResetTokenExpiry: expiry,
      },
    });

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://pestiq.com";
    const resetUrl = `${baseUrl}/portal/login?resetToken=${resetToken}&email=${encodeURIComponent(email)}`;

    await sendPasswordResetEmail({
      toEmail: email,
      resetToken,
      resetUrl,
    });

    return NextResponse.json({
      message: "If an account exists with this email, you will receive a reset link shortly.",
    });
  } catch (err) {
    console.error("Portal forgot-password error:", err);
    return NextResponse.json({ error: "Service error. Please try again." }, { status: 500 });
  }
}
