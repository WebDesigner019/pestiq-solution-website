"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ShieldCheck, Eye, EyeOff, AlertCircle, Lock,
  CheckCircle2, Sparkles, MessageCircle,
  Users, ArrowRight, Shield, Zap, Mail, KeyRound,
  ArrowLeft
} from "lucide-react";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [viewMode, setViewMode] = useState<"login" | "forgot" | "reset">("login");

  // Form States
  const [email, setEmail] = useState("admin@pestiq.com");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Status States
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetToken, setResetToken] = useState("");

  useEffect(() => {
    const token = searchParams.get("resetToken");
    const mailParam = searchParams.get("email");
    if (token) {
      setResetToken(token);
      if (mailParam) setEmail(mailParam);
      setViewMode("reset");
    }
  }, [searchParams]);

  // Handle Login Submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setLoading(true);

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
        setError(data.error || "Invalid credentials. Please try again.");
        setLoading(false);
      }
    } catch (err: any) {
      setError("Network error. Could not connect to authentication service.");
      setLoading(false);
    }
  };

  // Handle Forgot Password Request
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccessMsg(data.message || `Password reset link sent to ${email}`);
      } else {
        setError(data.error || "Failed to process password reset.");
      }
    } catch (err) {
      setError("Connection failed. Please check your internet connection.");
    } finally {
      setLoading(false);
    }
  };

  // Handle New Password Submission
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: resetToken, newPassword, email }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccessMsg(data.message || "Password updated successfully!");
        setTimeout(() => {
          setViewMode("login");
          setSuccessMsg("");
        }, 2000);
      } else {
        setError(data.error || "Failed to reset password.");
      }
    } catch (err) {
      setError("Failed to update password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "radial-gradient(ellipse at top, #0f1c3f 0%, #030816 70%, #01040d 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px 16px",
      fontFamily: "var(--font-sans), system-ui, -apple-system, sans-serif",
      position: "relative",
      overflow: "hidden",
    }}>

      {/* Ambient Lighting Spheres */}
      <div style={{
        position: "absolute", top: "10%", left: "15%", width: 500, height: 500,
        background: "radial-gradient(circle, rgba(21,87,184,0.2) 0%, transparent 70%)",
        borderRadius: "50%", filter: "blur(80px)", pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: "10%", right: "15%", width: 450, height: 450,
        background: "radial-gradient(circle, rgba(250,204,21,0.12) 0%, transparent 70%)",
        borderRadius: "50%", filter: "blur(90px)", pointerEvents: "none",
      }} />

      {/* MAIN FLOATING CONTAINER CARD (Inspired by E Spurt & Smart AI Dribbble layouts) */}
      <div style={{
        width: "100%",
        maxWidth: 1040,
        background: "rgba(10, 22, 53, 0.75)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderRadius: 28,
        border: "1px solid rgba(255, 255, 255, 0.12)",
        boxShadow: "0 30px 80px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.15)",
        display: "flex",
        overflow: "hidden",
        position: "relative",
        zIndex: 10,
      }}>

        {/* LEFT PANEL — Visual Showcase Banner */}
        <div className="hidden md:flex" style={{
          flex: 1.1,
          position: "relative",
          background: "linear-gradient(135deg, #071b4d 0%, #0d286d 50%, #05143a 100%)",
          padding: "48px 48px",
          flexDirection: "column",
          justifyContent: "space-between",
          borderRight: "1px solid rgba(255, 255, 255, 0.08)",
          overflow: "hidden",
        }}>

          {/* Background Vector Shield Watermark */}
          <div style={{
            position: "absolute",
            right: "-40px",
            bottom: "-40px",
            opacity: 0.04,
            pointerEvents: "none",
            userSelect: "none",
            transform: "rotate(-10deg)",
          }}>
            <Shield style={{ width: 480, height: 480, color: "#ffffff" }} />
          </div>

          {/* Top Brand Tag */}
          <div style={{ position: "relative", zIndex: 2, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 14,
              background: "linear-gradient(135deg, #FACC15 0%, #eab308 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 8px 24px rgba(250, 204, 21, 0.35)",
            }}>
              <ShieldCheck style={{ width: 24, height: 24, color: "#071b4d" }} />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ color: "#ffffff", fontWeight: 900, fontSize: 22, letterSpacing: "-0.03em" }}>PestIQ</span>
                <span style={{ background: "rgba(250, 204, 21, 0.15)", color: "#FACC15", border: "1px solid rgba(250, 204, 21, 0.3)", padding: "2px 8px", borderRadius: 999, fontSize: 10, fontWeight: 800, textTransform: "uppercase" }}>Enterprise</span>
              </div>
              <p style={{ color: "#94a3b8", fontSize: 11, fontWeight: 700, margin: 0, letterSpacing: "0.1em", textTransform: "uppercase" }}>Solutions &amp; Dispatch Console</p>
            </div>
          </div>

          {/* Center Showcase Content */}
          <div style={{ position: "relative", zIndex: 2, margin: "40px 0" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "6px 14px", borderRadius: 999,
              background: "rgba(255, 255, 255, 0.08)", border: "1px solid rgba(255, 255, 255, 0.15)",
              marginBottom: 20,
            }}>
              <Sparkles style={{ width: 14, height: 14, color: "#FACC15" }} />
              <span style={{ color: "#e2e8f0", fontSize: 12, fontWeight: 700 }}>Simplify operations with our CRM</span>
            </div>

            <h1 style={{
              color: "#ffffff", fontSize: "clamp(30px, 2.6vw, 42px)", fontWeight: 900,
              lineHeight: 1.15, letterSpacing: "-0.03em", margin: "0 0 16px"
            }}>
              Precision Dispatch &amp;<br />
              <span style={{ background: "linear-gradient(90deg, #FACC15, #38bdf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Customer Intelligence
              </span>
            </h1>

            <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.6, maxWidth: 440, margin: "0 0 28px" }}>
              Unified management console for dispatch coordinators and field technicians across NY, NJ &amp; CT.
            </p>

            {/* Feature Pills */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[
                { icon: Zap, title: "Live Booking Queue", desc: "Real-time orders" },
                { icon: MessageCircle, title: "WhatsApp Alerts", desc: "1-click dispatch" },
                { icon: Users, title: "Customer History", desc: "Subscriptions & notes" },
                { icon: Shield, title: "Rate Limit Shield", desc: "Anti-brute force" },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} style={{
                  background: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: 12, padding: "12px 14px",
                  display: "flex", alignItems: "flex-start", gap: 10,
                }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 8,
                    background: "rgba(250, 204, 21, 0.12)", display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, marginTop: 1,
                  }}>
                    <Icon style={{ width: 14, height: 14, color: "#FACC15" }} />
                  </div>
                  <div>
                    <p style={{ color: "#ffffff", fontSize: 12, fontWeight: 700, margin: "0 0 2px" }}>{title}</p>
                    <p style={{ color: "#64748b", fontSize: 10, margin: 0 }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Security Footer */}
          <div style={{
            position: "relative", zIndex: 2,
            display: "flex", alignItems: "center", justifyContent: "space-between",
            paddingTop: 18, borderTop: "1px solid rgba(255, 255, 255, 0.08)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981", boxShadow: "0 0 10px #10b981" }} />
              <span style={{ color: "#cbd5e1", fontSize: 12, fontWeight: 600 }}>All Systems Operational</span>
            </div>
            <span style={{ color: "#64748b", fontSize: 11 }}>SSL 256-Bit Encrypted</span>
          </div>
        </div>

        {/* RIGHT PANEL — Sleek White Authentication Card */}
        <div style={{
          flex: 1,
          maxWidth: 480,
          background: "#ffffff",
          padding: "48px 40px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}>

          <div>
            {/* Header Block */}
            <div style={{ marginBottom: 28 }}>
              {viewMode === "login" && (
                <>
                  <div style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    padding: "4px 10px", borderRadius: 6, background: "#eff6ff",
                    color: "#1557b8", fontSize: 11, fontWeight: 800, marginBottom: 12,
                  }}>
                    <Lock style={{ width: 12, height: 12 }} /> Protected Access
                  </div>
                  <h2 style={{ color: "#0f172a", fontSize: 26, fontWeight: 900, margin: 0, letterSpacing: "-0.03em" }}>
                    Welcome Back
                  </h2>
                  <p style={{ color: "#64748b", fontSize: 13, margin: "4px 0 0", lineHeight: 1.5 }}>
                    Sign in to access your unified dispatch console.
                  </p>
                </>
              )}

              {viewMode === "forgot" && (
                <>
                  <button
                    onClick={() => { setViewMode("login"); setError(""); setSuccessMsg(""); }}
                    style={{
                      background: "none", border: "none", color: "#64748b", cursor: "pointer",
                      fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", gap: 6, padding: 0, marginBottom: 16,
                    }}
                  >
                    <ArrowLeft style={{ width: 14, height: 14 }} /> Back to Sign In
                  </button>
                  <h2 style={{ color: "#0f172a", fontSize: 24, fontWeight: 900, margin: 0 }}>
                    Forgot Password?
                  </h2>
                  <p style={{ color: "#64748b", fontSize: 13, margin: "4px 0 0" }}>
                    Enter your staff email address and we'll send a password authorization link.
                  </p>
                </>
              )}

              {viewMode === "reset" && (
                <>
                  <h2 style={{ color: "#0f172a", fontSize: 24, fontWeight: 900, margin: 0 }}>
                    Set New Password
                  </h2>
                  <p style={{ color: "#64748b", fontSize: 13, margin: "4px 0 0" }}>
                    Enter your new secure master password below.
                  </p>
                </>
              )}
            </div>

            {/* Success Alert Banner */}
            {successMsg && (
              <div style={{
                display: "flex", alignItems: "center", gap: 10,
                background: "#ecfdf5", border: "1px solid #a7f3d0",
                borderRadius: 10, padding: "12px 14px", color: "#065f46", marginBottom: 20,
              }}>
                <CheckCircle2 style={{ width: 18, height: 18, flexShrink: 0, color: "#10b981" }} />
                <span style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.4 }}>{successMsg}</span>
              </div>
            )}

            {/* Error Alert Banner */}
            {error && (
              <div style={{
                display: "flex", alignItems: "center", gap: 10,
                background: "#fef2f2", border: "1px solid #fecaca",
                borderRadius: 10, padding: "12px 14px", color: "#991b1b", marginBottom: 20,
              }}>
                <AlertCircle style={{ width: 18, height: 18, flexShrink: 0, color: "#ef4444" }} />
                <span style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.4 }}>{error}</span>
              </div>
            )}

            {/* FORM A: SIGN IN */}
            {viewMode === "login" && (
              <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <div>
                  <label style={{ display: "block", color: "#0f172a", fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>
                    Staff Email
                  </label>
                  <div style={{ position: "relative" }}>
                    <Mail style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: "#94a3b8" }} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(""); }}
                      placeholder="admin@pestiq.com"
                      required
                      style={{
                        width: "100%", height: 46, paddingLeft: 42, paddingRight: 14,
                        background: "#f8fafc", border: "1.5px solid #e2e8f0",
                        borderRadius: 10, fontSize: 14, outline: "none", color: "#0f172a",
                        fontWeight: 600, boxSizing: "border-box", transition: "all 0.15s",
                      }}
                      onFocus={e => { e.target.style.borderColor = "#1557b8"; e.target.style.background = "#ffffff"; }}
                      onBlur={e => { e.target.style.borderColor = "#e2e8f0"; e.target.style.background = "#f8fafc"; }}
                    />
                  </div>
                </div>

                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <label style={{ color: "#0f172a", fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      Master Password / PIN
                    </label>
                    <button
                      type="button"
                      onClick={() => { setViewMode("forgot"); setError(""); setSuccessMsg(""); }}
                      style={{ background: "none", border: "none", color: "#1557b8", fontSize: 12, fontWeight: 700, cursor: "pointer", padding: 0 }}
                    >
                      Forgot password?
                    </button>
                  </div>

                  <div style={{ position: "relative" }}>
                    <KeyRound style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: "#94a3b8" }} />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setError(""); }}
                      placeholder="Enter admin password (PIN: pestiq2025)"
                      required
                      style={{
                        width: "100%", height: 46, paddingLeft: 42, paddingRight: 44,
                        background: "#f8fafc", border: "1.5px solid #e2e8f0",
                        borderRadius: 10, fontSize: 14, outline: "none", color: "#0f172a",
                        fontWeight: 600, boxSizing: "border-box", transition: "all 0.15s",
                      }}
                      onFocus={e => { e.target.style.borderColor = "#1557b8"; e.target.style.background = "#ffffff"; }}
                      onBlur={e => { e.target.style.borderColor = "#e2e8f0"; e.target.style.background = "#f8fafc"; }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(v => !v)}
                      style={{
                        position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                        background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 4,
                      }}
                    >
                      {showPassword ? <EyeOff style={{ width: 16, height: 16 }} /> : <Eye style={{ width: 16, height: 16 }} />}
                    </button>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, color: "#475569", fontWeight: 600 }}>
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={e => setRememberMe(e.target.checked)}
                      style={{ borderRadius: 4, accentColor: "#1557b8", width: 16, height: 16 }}
                    />
                    Remember this session
                  </label>
                  <span style={{ fontSize: 11, color: "#94a3b8" }}>PIN: pestiq2025</span>
                </div>

                <button
                  type="submit"
                  disabled={loading || !password}
                  style={{
                    height: 48, borderRadius: 10, border: "none",
                    background: "linear-gradient(135deg, #071b4d 0%, #1557b8 100%)",
                    color: "#ffffff", fontSize: 14, fontWeight: 800,
                    cursor: loading || !password ? "not-allowed" : "pointer",
                    opacity: loading || !password ? 0.65 : 1,
                    boxShadow: "0 6px 20px rgba(7, 27, 77, 0.25)",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    marginTop: 6, transition: "all 0.15s",
                  }}
                >
                  {loading ? (
                    <>
                      <div style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                      Authenticating...
                    </>
                  ) : (
                    <>
                      Sign In to Console <ArrowRight style={{ width: 16, height: 16 }} />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* FORM B: FORGOT PASSWORD */}
            {viewMode === "forgot" && (
              <form onSubmit={handleForgotPassword} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <div>
                  <label style={{ display: "block", color: "#0f172a", fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>
                    Staff Email Address
                  </label>
                  <div style={{ position: "relative" }}>
                    <Mail style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: "#94a3b8" }} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(""); }}
                      placeholder="admin@pestiq.com"
                      required
                      style={{
                        width: "100%", height: 46, paddingLeft: 42, paddingRight: 14,
                        background: "#f8fafc", border: "1.5px solid #e2e8f0",
                        borderRadius: 10, fontSize: 14, outline: "none", color: "#0f172a",
                        fontWeight: 600, boxSizing: "border-box",
                      }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !email}
                  style={{
                    height: 48, borderRadius: 10, border: "none",
                    background: "#1557b8", color: "#ffffff", fontSize: 14, fontWeight: 800,
                    cursor: loading || !email ? "not-allowed" : "pointer",
                    boxShadow: "0 6px 20px rgba(21, 87, 184, 0.25)",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  }}
                >
                  {loading ? "Sending..." : "Send Password Reset Link"}
                </button>
              </form>
            )}

            {/* FORM C: RESET PASSWORD */}
            {viewMode === "reset" && (
              <form onSubmit={handleResetPassword} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <div>
                  <label style={{ display: "block", color: "#0f172a", fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => { setNewPassword(e.target.value); setError(""); }}
                    placeholder="At least 6 characters"
                    required
                    style={{
                      width: "100%", height: 46, paddingLeft: 14, paddingRight: 14,
                      background: "#f8fafc", border: "1.5px solid #e2e8f0",
                      borderRadius: 10, fontSize: 14, outline: "none", color: "#0f172a",
                      fontWeight: 600, boxSizing: "border-box",
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !newPassword}
                  style={{
                    height: 48, borderRadius: 10, border: "none",
                    background: "#10b981", color: "#ffffff", fontSize: 14, fontWeight: 800,
                    cursor: loading || !newPassword ? "not-allowed" : "pointer",
                    boxShadow: "0 6px 20px rgba(16, 185, 129, 0.25)",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  }}
                >
                  {loading ? "Updating..." : "Save New Password"}
                </button>
              </form>
            )}
          </div>

          {/* Bottom Security Assurance Badge */}
          <div style={{ marginTop: 32, paddingTop: 20, borderTop: "1px solid #f1f5f9", textAlign: "center" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#64748b", fontSize: 12, fontWeight: 600 }}>
              <CheckCircle2 style={{ width: 14, height: 14, color: "#10b981" }} />
              <span>Anti-Brute Force Protection Active (Max 5 attempts)</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100vh", background: "#071b4d", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 32, height: 32, border: "3px solid rgba(250,204,21,0.3)", borderTopColor: "#FACC15", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    }>
      <AdminLoginForm />
    </Suspense>
  );
}
