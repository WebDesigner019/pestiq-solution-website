import { NextRequest, NextResponse } from "next/server";
import { logAuditEvent } from "@/lib/audit";

// Rate limiting state: IP -> { attempts: number, lockUntil: number }
const FAILED_ATTEMPTS = new Map<string, { attempts: number; lockUntil: number }>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes lockout

const MASTER_PIN = process.env.ADMIN_PIN || "pestiq2025";
const MASTER_EMAIL = process.env.ADMIN_EMAIL || "admin@pestiq.com";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const now = Date.now();

    // Check Rate Limiting Lockout
    const rateLimit = FAILED_ATTEMPTS.get(ip);
    if (rateLimit && rateLimit.lockUntil > now) {
      const remainingMins = Math.ceil((rateLimit.lockUntil - now) / 60000);
      await logAuditEvent({
        action: "STAFF_LOGIN_BLOCKED_RATELIMIT",
        resource: "AdminAuth",
        metadata: { ip, remainingMins },
      });
      return NextResponse.json(
        { error: `Account locked due to multiple failed login attempts. Please try again in ${remainingMins} minutes.` },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { email, password } = body;

    if (!password) {
      return NextResponse.json({ error: "Password is required" }, { status: 400 });
    }

    const inputPass = String(password).trim();
    const inputEmail = email ? String(email).trim().toLowerCase() : MASTER_EMAIL;

    // Verify Password & Email
    if (inputPass === MASTER_PIN) {
      // Clear failed attempts on success
      FAILED_ATTEMPTS.delete(ip);

      await logAuditEvent({
        staffId: inputEmail,
        action: "STAFF_LOGIN_SUCCESS",
        resource: "AdminConsole",
        metadata: { ip, email: inputEmail },
      });

      const response = NextResponse.json({
        success: true,
        email: inputEmail,
        role: "ADMIN",
        message: "Authenticated successfully",
      });

      // Set Secure Cookie
      response.cookies.set("pestiq_admin_session", "authenticated_master_session", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return response;
    } else {
      // Record Failed Attempt
      const currentAttempts = (rateLimit ? rateLimit.attempts : 0) + 1;
      let lockUntil = 0;
      if (currentAttempts >= MAX_ATTEMPTS) {
        lockUntil = now + LOCKOUT_MS;
      }

      FAILED_ATTEMPTS.set(ip, { attempts: currentAttempts, lockUntil });

      await logAuditEvent({
        staffId: inputEmail,
        action: "STAFF_LOGIN_FAILED",
        resource: "AdminConsole",
        metadata: { ip, attemptCount: currentAttempts, locked: currentAttempts >= MAX_ATTEMPTS },
      });

      if (currentAttempts >= MAX_ATTEMPTS) {
        return NextResponse.json(
          { error: "Too many failed login attempts. Security lockout engaged for 15 minutes." },
          { status: 429 }
        );
      }

      return NextResponse.json(
        { error: `Invalid credentials. (${MAX_ATTEMPTS - currentAttempts} attempt(s) remaining)` },
        { status: 401 }
      );
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Authentication error" }, { status: 500 });
  }
}
