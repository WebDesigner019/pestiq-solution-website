"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Eye, EyeOff, AlertCircle, CheckCircle2,
  ArrowRight, ArrowLeft, ShieldCheck, Home
} from "lucide-react";

/* ─── PestIQ Logo SVG ─── */
function PestIQLogo({ size = 38 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width={size} height={size} style={{ display: "block", flexShrink: 0 }}>
      <rect width="200" height="200" rx="36" fill="#0a2540" />
      <path d="M100 32 L160 82 V152 H40 V82 Z" fill="none" stroke="#ffffff" strokeWidth="12" strokeLinejoin="round" strokeLinecap="round" />
      <path d="M138 52 V38 H152 V64" fill="none" stroke="#ffffff" strokeWidth="10" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx="95" cy="110" r="42" fill="none" stroke="#0066cc" strokeWidth="18" />
      <path d="M125 140 L158 172" stroke="#0066cc" strokeWidth="18" strokeLinecap="round" />
      <circle cx="95" cy="110" r="12" fill="#ffc400" />
    </svg>
  );
}

/* ─── Main Form (needs Suspense because it reads searchParams) ─── */
function PortalLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [viewMode, setViewMode] = useState<"login" | "forgot" | "reset">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetToken, setResetToken] = useState("");

  useEffect(() => {
    const token = searchParams.get("resetToken");
    const mail = searchParams.get("email");
    if (token) {
      setResetToken(token);
      if (mail) setEmail(mail);
      setViewMode("reset");
    }
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await fetch("/api/portal/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        sessionStorage.setItem("pestiq_portal_auth", "1");
        sessionStorage.setItem("pestiq_portal_email", email);
        if (rememberMe) {
          localStorage.setItem("pestiq_portal_auth", "1");
          localStorage.setItem("pestiq_portal_email", email);
        }
        router.push("/portal");
      } else {
        setError(data.error || "Incorrect email or password.");
        setLoading(false);
      }
    } catch {
      setError("Connection failed. Please check your internet and try again.");
      setLoading(false);
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await fetch("/api/portal/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setSuccessMsg(data.message || "Check your email for a reset link.");
    } catch {
      setError("Connection failed. Please try again.");
    } finally { setLoading(false); }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await fetch("/api/portal/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: resetToken, email, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccessMsg(data.message || "Password updated! You can now sign in.");
        setTimeout(() => { setViewMode("login"); setSuccessMsg(""); setNewPassword(""); }, 2500);
      } else {
        setError(data.error || "Reset failed.");
      }
    } catch {
      setError("Failed to update password.");
    } finally { setLoading(false); }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", height: 50, padding: "0 14px",
    background: "#f8fafc", border: "1.5px solid #e2e8f0",
    borderRadius: 11, fontSize: 15, outline: "none", color: "#0f172a",
    fontWeight: 600, boxSizing: "border-box", transition: "border-color 0.15s, background 0.15s",
    fontFamily: "inherit",
  };

  return (
    <>
      <style>{`
        html, body { margin: 0; padding: 0; height: 100%; }
        *, *::before, *::after { box-sizing: border-box; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }

        .portal-root {
          display: flex;
          min-height: 100dvh;
          font-family: var(--font-sans), system-ui, -apple-system, sans-serif;
        }

        /* ── LEFT: Full Hero Panel ── */
        .portal-hero {
          flex: 0 0 56%;
          position: relative;
          background-image: url('/images/customer_hero.jpg');
          background-size: cover;
          background-position: center 30%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          overflow: hidden;
        }
        .portal-hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            165deg,
            rgba(7,27,77,0.72) 0%,
            rgba(7,27,77,0.25) 45%,
            rgba(7,27,77,0.80) 100%
          );
        }

        .portal-hero-inner {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 100%;
          padding: 44px 52px;
        }

        /* ── RIGHT: Form Panel ── */
        .portal-form-panel {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 56px 64px;
          background: #ffffff;
          overflow-y: auto;
        }

        .portal-form-inner {
          max-width: 400px;
          width: 100%;
          margin: 0 auto;
          animation: fadeUp 0.35s ease-out;
        }

        .portal-input:focus {
          border-color: #071b4d !important;
          background: #ffffff !important;
        }

        /* Trust badges strip */
        .trust-strip {
          display: flex;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
        }

        /* ── Mobile ── */
        @media (max-width: 900px) {
          .portal-root { flex-direction: column; }
          .portal-hero { flex: none; min-height: 260px; height: 260px; }
          .portal-hero-inner { padding: 28px 28px; }
          .portal-form-panel { padding: 40px 28px 52px; }
        }
        @media (max-width: 480px) {
          .portal-hero { height: 200px; min-height: 200px; }
          .portal-hero-inner { padding: 22px 20px; }
          .portal-form-panel { padding: 32px 20px 44px; }
        }
      `}</style>

      <div className="portal-root">

        {/* ══ LEFT: Terminix-Style Full Hero Panel ══ */}
        <div className="portal-hero">
          <div className="portal-hero-inner">

            {/* Top: Brand + Back to site */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <PestIQLogo size={42} />
                <div>
                  <span style={{ color: "#ffffff", fontWeight: 900, fontSize: 22, letterSpacing: "-0.03em", display: "block", lineHeight: 1.1 }}>PestIQ</span>
                  <span style={{ color: "#FACC15", fontSize: 10, fontWeight: 800, textTransform: "uppercase" as const, letterSpacing: "0.1em" }}>Solutions</span>
                </div>
              </div>
              <Link href="/" style={{ display: "flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.7)", fontSize: 13, fontWeight: 700, textDecoration: "none", padding: "6px 12px", borderRadius: 8, background: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)" }}>
                <Home size={14} /> Back to site
              </Link>
            </div>

            {/* Bottom: Hero Text + Trust Badges (Terminix style) */}
            <div>
              <h1 style={{ color: "#ffffff", fontSize: "clamp(28px, 3.5vw, 46px)", fontWeight: 900, margin: "0 0 10px", lineHeight: 1.15, letterSpacing: "-0.03em", textShadow: "0 2px 12px rgba(0,0,0,0.3)" }}>
                Protecting What<br />Matters Most
              </h1>
              <p style={{ color: "rgba(255,255,255,0.82)", fontSize: 16, fontWeight: 500, margin: "0 0 28px", lineHeight: 1.6, maxWidth: 400 }}>
                Access your service history, schedule visits, and manage your home protection plan — all in one place.
              </p>

              {/* Trust Badges — Terminix-style pill buttons */}
              <div className="trust-strip">
                {[
                  { icon: "🐜", label: "Pest Control" },
                  { icon: "🕷️", label: "Spider & Web" },
                  { icon: "🐭", label: "Rodent Control" },
                  { icon: "🦟", label: "Mosquito & Tick" },
                ].map(b => (
                  <div key={b.label} style={{
                    display: "flex", alignItems: "center", gap: 8,
                    background: "rgba(255,255,255,0.15)", backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255,255,255,0.25)",
                    borderRadius: 100, padding: "7px 16px",
                    color: "#ffffff", fontSize: 13, fontWeight: 700,
                  }}>
                    <span style={{ fontSize: 16 }}>{b.icon}</span>
                    {b.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ══ RIGHT: Clean Form Panel ══ */}
        <div className="portal-form-panel">
          <div className="portal-form-inner">

            {/* Header */}
            <div style={{ marginBottom: 28 }}>
              {viewMode === "login" && (
                <>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 6, padding: "4px 10px", marginBottom: 14 }}>
                    <ShieldCheck size={13} color="#16a34a" />
                    <span style={{ color: "#15803d", fontSize: 11, fontWeight: 800 }}>Secure Customer Portal</span>
                  </div>
                  <h2 style={{ color: "#0f172a", fontSize: 28, fontWeight: 900, margin: 0, letterSpacing: "-0.035em" }}>
                    Sign In to Your Account
                  </h2>
                </>
              )}
              {viewMode === "forgot" && (
                <>
                  <button onClick={() => { setViewMode("login"); setError(""); setSuccessMsg(""); }}
                    style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", gap: 6, padding: 0, marginBottom: 16 }}>
                    <ArrowLeft size={14} /> Back to Sign In
                  </button>
                  <h2 style={{ color: "#0f172a", fontSize: 26, fontWeight: 900, margin: 0 }}>Reset Password</h2>
                  <p style={{ color: "#64748b", fontSize: 14, margin: "6px 0 0" }}>
                    Enter your email and we'll send you a reset link.
                  </p>
                </>
              )}
              {viewMode === "reset" && (
                <h2 style={{ color: "#0f172a", fontSize: 26, fontWeight: 900, margin: 0 }}>Set New Password</h2>
              )}
            </div>

            {/* Alerts */}
            {successMsg && (
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10, background: "#ecfdf5", border: "1px solid #a7f3d0", borderRadius: 10, padding: "12px 14px", color: "#065f46", marginBottom: 20 }}>
                <CheckCircle2 size={18} color="#10b981" style={{ flexShrink: 0, marginTop: 1 }} />
                <span style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.5 }}>{successMsg}</span>
              </div>
            )}
            {error && (
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10, background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "12px 14px", color: "#991b1b", marginBottom: 20 }}>
                <AlertCircle size={18} color="#ef4444" style={{ flexShrink: 0, marginTop: 1 }} />
                <span style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.5 }}>{error}</span>
              </div>
            )}

            {/* ── Form A: Login ── */}
            {viewMode === "login" && (
              <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div>
                  <label style={{ display: "block", color: "#334155", fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Email Address</label>
                  <input className="portal-input" type="email" value={email} onChange={e => { setEmail(e.target.value); setError(""); }}
                    placeholder="you@example.com" required style={inputStyle} />
                </div>

                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <label style={{ color: "#334155", fontSize: 13, fontWeight: 700 }}>Password</label>
                    <button type="button" onClick={() => { setViewMode("forgot"); setError(""); setSuccessMsg(""); }}
                      style={{ background: "none", border: "none", color: "#071b4d", fontSize: 12, fontWeight: 700, cursor: "pointer", padding: 0 }}>
                      Forgot password?
                    </button>
                  </div>
                  <div style={{ position: "relative" }}>
                    <input className="portal-input" type={showPassword ? "text" : "password"} value={password}
                      onChange={e => { setPassword(e.target.value); setError(""); }} placeholder="Enter your password" required
                      style={{ ...inputStyle, paddingRight: 46 }} />
                    <button type="button" onClick={() => setShowPassword(v => !v)}
                      style={{ position: "absolute", right: 13, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 4, display: "flex" }}>
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <label style={{ display: "flex", alignItems: "center", gap: 9, cursor: "pointer", fontSize: 13, color: "#475569", fontWeight: 600, userSelect: "none" as const }}>
                  <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)}
                    style={{ width: 16, height: 16, accentColor: "#071b4d", cursor: "pointer" }} />
                  Keep me signed in
                </label>

                <button type="submit" disabled={loading || !password || !email}
                  style={{
                    height: 52, borderRadius: 12, border: "none",
                    background: loading || !password || !email ? "#94a3b8" : "linear-gradient(135deg, #071b4d 0%, #1557b8 100%)",
                    color: "#ffffff", fontSize: 15, fontWeight: 800,
                    cursor: loading || !password || !email ? "not-allowed" : "pointer",
                    boxShadow: loading ? "none" : "0 6px 24px rgba(7,27,77,0.22)",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    transition: "all 0.15s", marginTop: 4, fontFamily: "inherit",
                  }}>
                  {loading ? (
                    <><div style={{ width: 18, height: 18, border: "2.5px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /> Signing In...</>
                  ) : (
                    <>Sign In <ArrowRight size={16} /></>
                  )}
                </button>

                {/* New customer CTA */}
                <p style={{ textAlign: "center", color: "#94a3b8", fontSize: 13, margin: 0 }}>
                  New customer?{" "}
                  <Link href="/get-started" style={{ color: "#071b4d", fontWeight: 700, textDecoration: "none" }}>
                    Get started →
                  </Link>
                </p>
              </form>
            )}

            {/* ── Form B: Forgot Password ── */}
            {viewMode === "forgot" && (
              <form onSubmit={handleForgot} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div>
                  <label style={{ display: "block", color: "#334155", fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Email Address</label>
                  <input className="portal-input" type="email" value={email} onChange={e => { setEmail(e.target.value); setError(""); }}
                    placeholder="you@example.com" required style={inputStyle} />
                </div>
                <button type="submit" disabled={loading || !email}
                  style={{ height: 52, borderRadius: 12, border: "none", background: "#071b4d", color: "#ffffff", fontSize: 15, fontWeight: 800, cursor: loading ? "not-allowed" : "pointer", boxShadow: "0 6px 24px rgba(7,27,77,0.22)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit" }}>
                  {loading ? "Sending..." : "Send Reset Link"}
                </button>
              </form>
            )}

            {/* ── Form C: Reset Password ── */}
            {viewMode === "reset" && (
              <form onSubmit={handleReset} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div>
                  <label style={{ display: "block", color: "#334155", fontSize: 13, fontWeight: 700, marginBottom: 8 }}>New Password</label>
                  <input className="portal-input" type="password" value={newPassword} onChange={e => { setNewPassword(e.target.value); setError(""); }}
                    placeholder="Minimum 8 characters" required style={inputStyle} />
                </div>
                <button type="submit" disabled={loading || !newPassword}
                  style={{ height: 52, borderRadius: 12, border: "none", background: "#10b981", color: "#ffffff", fontSize: 15, fontWeight: 800, cursor: loading ? "not-allowed" : "pointer", boxShadow: "0 6px 24px rgba(16,185,129,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit" }}>
                  {loading ? "Saving..." : "Save New Password"}
                </button>
              </form>
            )}

          </div>
        </div>
      </div>
    </>
  );
}

/* ─── Page export with Suspense ─── */
export default function PortalLoginPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100dvh", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 32, height: 32, border: "3px solid #e2e8f0", borderTopColor: "#071b4d", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    }>
      <PortalLoginForm />
    </Suspense>
  );
}
