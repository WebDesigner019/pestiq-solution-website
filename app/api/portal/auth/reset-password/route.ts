import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createHash } from "crypto";

function hashPassword(plain: string) {
  return createHash("sha256").update(plain + process.env.PORTAL_SECRET || "pestiq-portal-salt").digest("hex");
}

export async function POST(req: NextRequest) {
  try {
    const { token, email, newPassword } = await req.json();

    if (!token || !email || !newPassword) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
    }

    const customer = await prisma.customer.findFirst({
      where: {
        email: email.toLowerCase().trim(),
        portalResetToken: token,
        portalResetTokenExpiry: { gte: new Date() },
      },
    });

    if (!customer) {
      return NextResponse.json(
        { error: "This reset link is invalid or has expired. Please request a new one." },
        { status: 400 }
      );
    }

    await prisma.customer.update({
      where: { id: customer.id },
      data: {
        passwordHash: hashPassword(newPassword),
        portalResetToken: null,
        portalResetTokenExpiry: null,
      },
    });

    return NextResponse.json({ message: "Password updated successfully! You can now sign in." });
  } catch (err) {
    console.error("Portal reset-password error:", err);
    return NextResponse.json({ error: "Service error. Please try again." }, { status: 500 });
  }
}
