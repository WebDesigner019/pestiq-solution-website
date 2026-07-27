import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createHash } from "crypto";

// Simple in-memory rate limiter (per IP)
const attempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 6;
const WINDOW_MS = 15 * 60 * 1000; // 15 min

function getIP(req: NextRequest) {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

function hashPassword(plain: string) {
  return createHash("sha256").update(plain + process.env.PORTAL_SECRET || "pestiq-portal-salt").digest("hex");
}

export async function POST(req: NextRequest) {
  const ip = getIP(req);

  // Rate limit check
  const now = Date.now();
  const state = attempts.get(ip);
  if (state) {
    if (now < state.resetAt && state.count >= MAX_ATTEMPTS) {
      return NextResponse.json(
        { error: "Too many login attempts. Please wait 15 minutes before trying again." },
        { status: 429 }
      );
    }
    if (now >= state.resetAt) attempts.delete(ip);
  }

  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    const customer = await prisma.customer.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!customer || !customer.passwordHash) {
      // Record failed attempt
      const cur = attempts.get(ip) || { count: 0, resetAt: now + WINDOW_MS };
      attempts.set(ip, { count: cur.count + 1, resetAt: cur.resetAt });
      return NextResponse.json(
        { error: "No account found with this email. Please check your credentials or contact support." },
        { status: 401 }
      );
    }

    const hashed = hashPassword(password);
    if (hashed !== customer.passwordHash) {
      const cur = attempts.get(ip) || { count: 0, resetAt: now + WINDOW_MS };
      attempts.set(ip, { count: cur.count + 1, resetAt: cur.resetAt });
      const remaining = MAX_ATTEMPTS - (cur.count + 1);
      return NextResponse.json(
        { error: `Incorrect password. ${remaining > 0 ? `${remaining} attempts remaining.` : "Account temporarily locked."}` },
        { status: 401 }
      );
    }

    // Clear attempts on success
    attempts.delete(ip);

    // Set secure session cookie
    const res = NextResponse.json({
      success: true,
      customer: { id: customer.id, email: customer.email, fullName: customer.fullName },
    });

    res.cookies.set("pestiq_portal_session", customer.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return res;
  } catch (err) {
    console.error("Portal login error:", err);
    return NextResponse.json({ error: "Authentication service error. Please try again." }, { status: 500 });
  }
}
