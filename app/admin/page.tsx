"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, AlertCircle, CheckCircle2, ArrowRight, ArrowLeft } from "lucide-react";

/* ─── PestIQ Logo (inline SVG, matches favicon) ─── */
function PestIQLogo({ size = 38 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 200"
      width={size}
      height={size}
      style={{ display: "block", flexShrink: 0 }}
    >
      <rect width="200" height="200" rx="36" fill="#0a2540" />
      <path d="M100 32 L160 82 V152 H40 V82 Z" fill="none" stroke="#ffffff" strokeWidth="12" strokeLinejoin="round" strokeLinecap="round" />
      <path d="M138 52 V38 H152 V64" fill="none" stroke="#ffffff" strokeWidth="10" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx="95" cy="110" r="42" fill="none" stroke="#0066cc" strokeWidth="18" />
      <path d="M125 140 L158 172" stroke="#0066cc" strokeWidth="18" strokeLinecap="round" />
      <circle cx="95" cy="110" r="12" fill="#ffc400" />
    </svg>
  );
}

/* ─── Main Login Form ─── */
function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [viewMode, setViewMode] = useState<"login" | "forgot" | "reset">("login");
  const [email, setEmail] = useState("admin@pestiq.com");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
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
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        sessionStorage.setItem("pestiq_admin_auth", "1");
        if (rememberMe) localStorage.setItem("pestiq_admin_auth", "1");
        router.push("/admin/overview");
      } else {
        setError(data.error || "Invalid credentials. Please check your password.");
        setLoading(false);
      }
    } catch {
      setError("Connection failed. Please check your internet.");
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await fetch("/api/admin/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) setSuccessMsg(data.message || `Reset link sent to ${email}`);
      else setError(data.error || "Failed to send reset link.");
    } catch {
      setError("Connection failed. Please try again.");
    } finally { setLoading(false); }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await fetch("/api/admin/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: resetToken, newPassword, email }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccessMsg("Password updated successfully!");
        setTimeout(() => { setViewMode("login"); setSuccessMsg(""); }, 2000);
      } else setError(data.error || "Failed to reset password.");
    } catch {
      setError("Failed to update password.");
    } finally { setLoading(false); }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", height: 48, paddingLeft: 14, paddingRight: 14,
    background: "#f8fafc", border: "1.5px solid #e2e8f0",
    borderRadius: 10, fontSize: 14, outline: "none", color: "#0f172a",
    fontWeight: 600, boxSizing: "border-box", transition: "border-color 0.15s, background 0.15s",
    fontFamily: "inherit",
  };

  return (
    <>
      {/* Global styles for full-screen and mobile */}
      <style>{`
        html, body { margin: 0; padding: 0; height: 100%; }
        * { box-sizing: border-box; }
        @keyframes spin { to { transform: rotate(360deg); } }

        .admin-login-root {
          display: flex;
          min-height: 100dvh;
          height: 100%;
          font-family: var(--font-sans), system-ui, -apple-system, sans-serif;
        }

        /* LEFT hero panel */
        .admin-hero-panel {
          flex: 0 0 44%;
          position: relative;
          background-image: url('/images/admin_ops_hero.jpg');
          background-size: cover;
          background-position: center;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 40px 44px;
          overflow: hidden;
          min-height: 100dvh;
        }
        .admin-hero-panel::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            170deg,
            rgba(7, 27, 77, 0.82) 0%,
            rgba(5, 18, 55, 0.45) 50%,
            rgba(7, 27, 77, 0.90) 100%
          );
        }

        /* RIGHT form panel */
        .admin-form-panel {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 56px 60px;
          background: #ffffff;
          min-height: 100dvh;
          overflow-y: auto;
        }

        /* Mobile: stack vertically, hide hero */
        @media (max-width: 768px) {
          .admin-login-root { flex-direction: column; }
          .admin-hero-panel {
            flex: none;
            min-height: 220px;
            height: 220px;
            padding: 28px 28px;
          }
          .admin-form-panel {
            flex: 1;
            min-height: auto;
            padding: 40px 28px 48px;
          }
        }

        @media (max-width: 480px) {
          .admin-form-panel { padding: 32px 20px 40px; }
          .admin-hero-panel { height: 180px; min-height: 180px; padding: 22px 20px; }
        }

        /* Input focus ring */
        .admin-input:focus {
          border-color: #1557b8 !important;
          background: #ffffff !important;
        }
      `}</style>

      <div className="admin-login-root">

        {/* ── LEFT: Hero Panel ── */}
        <div className="admin-hero-panel">
          {/* Brand Mark */}
          <div style={{ position: "relative", zIndex: 2, display: "flex", alignItems: "center", gap: 12 }}>
            <PestIQLogo size={40} />
            <div>
              <span style={{ color: "#ffffff", fontWeight: 900, fontSize: 22, letterSpacing: "-0.03em", display: "block", lineHeight: 1 }}>PestIQ</span>
              <span style={{ color: "#FACC15", fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em" }}>Admin Console</span>
            </div>
          </div>

          {/* Bottom caption */}
          <div style={{ position: "relative", zIndex: 2 }}>
            <p style={{ color: "#ffffff", fontSize: 22, fontWeight: 900, lineHeight: 1.3, margin: "0 0 6px", letterSpacing: "-0.02em" }}>
              Smart Dispatch &amp;<br />Customer Intelligence
            </p>
            <p style={{ color: "#FACC15", fontSize: 12, fontWeight: 700, margin: 0 }}>
              Enterprise Fleet &amp; Operations Platform
            </p>
          </div>
        </div>

        {/* ── RIGHT: Form Panel ── */}
        <div className="admin-form-panel">
          <div style={{ maxWidth: 400, width: "100%", margin: "0 auto" }}>

            {/* Header */}
            <div style={{ marginBottom: 32 }}>
              {viewMode === "login" && (
                <h1 style={{ color: "#0f172a", fontSize: 28, fontWeight: 900, margin: 0, letterSpacing: "-0.035em" }}>
                  Welcome Back
                </h1>
              )}
              {viewMode === "forgot" && (
                <>
                  <button
                    onClick={() => { setViewMode("login"); setError(""); setSuccessMsg(""); }}
                    style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", gap: 6, padding: 0, marginBottom: 16 }}
                  >
                    <ArrowLeft size={14} /> Back to Sign In
                  </button>
                  <h1 style={{ color: "#0f172a", fontSize: 26, fontWeight: 900, margin: 0 }}>Forgot Password?</h1>
                </>
              )}
              {viewMode === "reset" && (
                <h1 style={{ color: "#0f172a", fontSize: 26, fontWeight: 900, margin: 0 }}>Set New Password</h1>
              )}
            </div>

            {/* Alerts */}
            {successMsg && (
              <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#ecfdf5", border: "1px solid #a7f3d0", borderRadius: 10, padding: "12px 14px", color: "#065f46", marginBottom: 20 }}>
                <CheckCircle2 size={18} color="#10b981" style={{ flexShrink: 0 }} />
                <span style={{ fontSize: 13, fontWeight: 600 }}>{successMsg}</span>
              </div>
            )}
            {error && (
              <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "12px 14px", color: "#991b1b", marginBottom: 20 }}>
                <AlertCircle size={18} color="#ef4444" style={{ flexShrink: 0 }} />
                <span style={{ fontSize: 13, fontWeight: 600 }}>{error}</span>
              </div>
            )}

            {/* ── Form A: Login ── */}
            {viewMode === "login" && (
              <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div>
                  <label style={{ display: "block", color: "#475569", fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Email</label>
                  <input
                    className="admin-input"
                    type="email"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setError(""); }}
                    placeholder="admin@pestiq.com"
                    required
                    style={inputStyle}
                  />
                </div>

                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <label style={{ color: "#475569", fontSize: 13, fontWeight: 700 }}>Password</label>
                    <button
                      type="button"
                      onClick={() => { setViewMode("forgot"); setError(""); setSuccessMsg(""); }}
                      style={{ background: "none", border: "none", color: "#1557b8", fontSize: 12, fontWeight: 700, cursor: "pointer", padding: 0 }}
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div style={{ position: "relative" }}>
                    <input
                      className="admin-input"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={e => { setPassword(e.target.value); setError(""); }}
                      placeholder="••••••••••••"
                      required
                      style={{ ...inputStyle, paddingRight: 46 }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(v => !v)}
                      style={{ position: "absolute", right: 13, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 4, display: "flex" }}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <label style={{ display: "flex", alignItems: "center", gap: 9, cursor: "pointer", fontSize: 13, color: "#475569", fontWeight: 600, userSelect: "none" }}>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                    style={{ width: 16, height: 16, accentColor: "#1557b8", cursor: "pointer" }}
                  />
                  Remember this session
                </label>

                <button
                  type="submit"
                  disabled={loading || !password}
                  style={{
                    height: 50, borderRadius: 11, border: "none",
                    background: loading || !password
                      ? "#94a3b8"
                      : "linear-gradient(135deg, #071b4d 0%, #1557b8 100%)",
                    color: "#ffffff", fontSize: 15, fontWeight: 800,
                    cursor: loading || !password ? "not-allowed" : "pointer",
                    boxShadow: loading || !password ? "none" : "0 6px 24px rgba(21, 87, 184, 0.28)",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    transition: "all 0.15s", marginTop: 4,
                    fontFamily: "inherit",
                  }}
                >
                  {loading ? (
                    <>
                      <div style={{ width: 17, height: 17, border: "2.5px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                      Authenticating...
                    </>
                  ) : (
                    <> Log In <ArrowRight size={16} /> </>
                  )}
                </button>
              </form>
            )}

            {/* ── Form B: Forgot Password ── */}
            {viewMode === "forgot" && (
              <form onSubmit={handleForgotPassword} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div>
                  <label style={{ display: "block", color: "#475569", fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Staff Email Address</label>
                  <input
                    className="admin-input"
                    type="email"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setError(""); }}
                    placeholder="admin@pestiq.com"
                    required
                    style={inputStyle}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || !email}
                  style={{ height: 50, borderRadius: 11, border: "none", background: "#1557b8", color: "#ffffff", fontSize: 15, fontWeight: 800, cursor: loading ? "not-allowed" : "pointer", boxShadow: "0 6px 24px rgba(21,87,184,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit" }}
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </button>
              </form>
            )}

            {/* ── Form C: Reset Password ── */}
            {viewMode === "reset" && (
              <form onSubmit={handleResetPassword} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div>
                  <label style={{ display: "block", color: "#475569", fontSize: 13, fontWeight: 700, marginBottom: 8 }}>New Password</label>
                  <input
                    className="admin-input"
                    type="password"
                    value={newPassword}
                    onChange={e => { setNewPassword(e.target.value); setError(""); }}
                    placeholder="Minimum 6 characters"
                    required
                    style={inputStyle}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || !newPassword}
                  style={{ height: 50, borderRadius: 11, border: "none", background: "#10b981", color: "#ffffff", fontSize: 15, fontWeight: 800, cursor: loading ? "not-allowed" : "pointer", boxShadow: "0 6px 24px rgba(16,185,129,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit" }}
                >
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

/* ─── Page Export with Suspense ─── */
export default function AdminLoginPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100dvh", background: "#050d21", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 32, height: 32, border: "3px solid rgba(250,204,21,0.3)", borderTopColor: "#FACC15", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    }>
      <AdminLoginForm />
    </Suspense>
  );
}
