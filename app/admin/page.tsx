"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ShieldCheck, Eye, EyeOff, AlertCircle, Lock,
  CheckCircle2, ArrowRight, ArrowLeft
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
        setError(data.error || "Invalid credentials. Please check your admin password.");
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
      background: "linear-gradient(135deg, #eef2f6 0%, #e2e8f0 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "32px 16px",
      fontFamily: "var(--font-sans), system-ui, -apple-system, sans-serif",
      position: "relative",
    }}>

      {/* FLOATING CARD CONTAINER (Exact Nucleus Dribbble Layout) */}
      <div style={{
        width: "100%",
        maxWidth: 920,
        background: "#ffffff",
        borderRadius: 24,
        boxShadow: "0 20px 60px rgba(7, 27, 77, 0.12), 0 1px 3px rgba(0, 0, 0, 0.05)",
        display: "flex",
        overflow: "hidden",
        position: "relative",
        zIndex: 10,
        border: "1px solid rgba(226, 232, 240, 0.8)",
      }}>

        {/* LEFT PANEL — High-Resolution Photographic Hero Showcase */}
        <div className="hidden md:flex" style={{
          flex: "0 0 42%",
          position: "relative",
          backgroundImage: `url('/images/admin_hero.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center 20%",
          padding: "40px 36px",
          flexDirection: "column",
          justifyContent: "space-between",
          overflow: "hidden",
        }}>
          {/* Dark Overlay Gradient for maximum contrast */}
          <div style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, rgba(7, 27, 77, 0.75) 0%, rgba(7, 27, 77, 0.3) 40%, rgba(7, 27, 77, 0.88) 100%)",
            pointerEvents: "none",
          }} />

          {/* Top Brand Tag */}
          <div style={{ position: "relative", zIndex: 2, display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: "linear-gradient(135deg, #FACC15 0%, #eab308 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 6px 18px rgba(250, 204, 21, 0.35)",
            }}>
              <ShieldCheck style={{ width: 20, height: 20, color: "#071b4d" }} />
            </div>
            <div>
              <span style={{ color: "#ffffff", fontWeight: 900, fontSize: 20, letterSpacing: "-0.03em" }}>PestIQ</span>
            </div>
          </div>

          {/* Bottom Testimonial Quote (Nucleus Style) */}
          <div style={{ position: "relative", zIndex: 2 }}>
            <p style={{
              color: "#ffffff", fontSize: 17, fontWeight: 700,
              lineHeight: 1.45, margin: "0 0 12px", textShadow: "0 2px 8px rgba(0,0,0,0.3)"
            }}>
              “Simply all the dispatch &amp; customer tools that our operations team needs every day.”
            </p>
            <div>
              <p style={{ color: "#FACC15", fontSize: 13, fontWeight: 800, margin: "0 0 2px" }}>Marcus Vance</p>
              <p style={{ color: "#cbd5e1", fontSize: 11, fontWeight: 600, margin: 0 }}>VP of Operations &amp; Dispatch</p>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL — Clean White Authentication Form */}
        <div style={{
          flex: 1,
          padding: "48px 44px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#ffffff",
        }}>

          <div>
            {/* Header Block */}
            <div style={{ marginBottom: 28 }}>
              {viewMode === "login" && (
                <>
                  <h2 style={{ color: "#0f172a", fontSize: 26, fontWeight: 900, margin: "0 0 6px", letterSpacing: "-0.03em" }}>
                    Welcome Back to PestIQ
                  </h2>
                  <p style={{ color: "#64748b", fontSize: 13, margin: 0, lineHeight: 1.5 }}>
                    Sign in to your account to access the master dispatch console.
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
                  <h2 style={{ color: "#0f172a", fontSize: 24, fontWeight: 900, margin: "0 0 6px" }}>
                    Forgot Password?
                  </h2>
                  <p style={{ color: "#64748b", fontSize: 13, margin: 0 }}>
                    Enter your staff email address and we'll send a reset authorization link.
                  </p>
                </>
              )}

              {viewMode === "reset" && (
                <>
                  <h2 style={{ color: "#0f172a", fontSize: 24, fontWeight: 900, margin: "0 0 6px" }}>
                    Set New Password
                  </h2>
                  <p style={{ color: "#64748b", fontSize: 13, margin: 0 }}>
                    Enter your new secure master password below.
                  </p>
                </>
              )}
            </div>

            {/* Success Alert */}
            {successMsg && (
              <div style={{
                display: "flex", alignItems: "center", gap: 10,
                background: "#ecfdf5", border: "1px solid #a7f3d0",
                borderRadius: 10, padding: "12px 14px", color: "#065f46", marginBottom: 20,
              }}>
                <CheckCircle2 style={{ width: 18, height: 18, flexShrink: 0, color: "#10b981" }} />
                <span style={{ fontSize: 13, fontWeight: 600 }}>{successMsg}</span>
              </div>
            )}

            {/* Error Alert */}
            {error && (
              <div style={{
                display: "flex", alignItems: "center", gap: 10,
                background: "#fef2f2", border: "1px solid #fecaca",
                borderRadius: 10, padding: "12px 14px", color: "#991b1b", marginBottom: 20,
              }}>
                <AlertCircle style={{ width: 18, height: 18, flexShrink: 0, color: "#ef4444" }} />
                <span style={{ fontSize: 13, fontWeight: 600 }}>{error}</span>
              </div>
            )}

            {/* FORM A: SIGN IN */}
            {viewMode === "login" && (
              <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div>
                  <label style={{ display: "block", color: "#334155", fontSize: 13, fontWeight: 700, marginBottom: 8 }}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(""); }}
                    placeholder="alex.jordan@gmail.com"
                    required
                    style={{
                      width: "100%", height: 46, paddingLeft: 14, paddingRight: 14,
                      background: "#f8fafc", border: "1.5px solid #e2e8f0",
                      borderRadius: 10, fontSize: 14, outline: "none", color: "#0f172a",
                      fontWeight: 600, boxSizing: "border-box", transition: "all 0.15s",
                    }}
                    onFocus={e => { e.target.style.borderColor = "#2563eb"; e.target.style.background = "#ffffff"; }}
                    onBlur={e => { e.target.style.borderColor = "#e2e8f0"; e.target.style.background = "#f8fafc"; }}
                  />
                </div>

                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <label style={{ color: "#334155", fontSize: 13, fontWeight: 700 }}>
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => { setViewMode("forgot"); setError(""); setSuccessMsg(""); }}
                      style={{ background: "none", border: "none", color: "#2563eb", fontSize: 12, fontWeight: 700, cursor: "pointer", padding: 0 }}
                    >
                      Forgot password?
                    </button>
                  </div>

                  <div style={{ position: "relative" }}>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setError(""); }}
                      placeholder="••••••••••••"
                      required
                      style={{
                        width: "100%", height: 46, paddingLeft: 14, paddingRight: 44,
                        background: "#f8fafc", border: "1.5px solid #e2e8f0",
                        borderRadius: 10, fontSize: 14, outline: "none", color: "#0f172a",
                        fontWeight: 600, boxSizing: "border-box", transition: "all 0.15s",
                      }}
                      onFocus={e => { e.target.style.borderColor = "#2563eb"; e.target.style.background = "#ffffff"; }}
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
                      style={{ borderRadius: 4, accentColor: "#2563eb", width: 16, height: 16 }}
                    />
                    Remember sign in details
                  </label>
                  <span style={{ fontSize: 11, color: "#94a3b8" }}>PIN: pestiq2025</span>
                </div>

                <button
                  type="submit"
                  disabled={loading || !password}
                  style={{
                    height: 46, borderRadius: 10, border: "none",
                    background: "linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)",
                    color: "#ffffff", fontSize: 14, fontWeight: 800,
                    cursor: loading || !password ? "not-allowed" : "pointer",
                    opacity: loading || !password ? 0.65 : 1,
                    boxShadow: "0 4px 16px rgba(37, 99, 235, 0.3)",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    marginTop: 4, transition: "all 0.15s",
                  }}
                >
                  {loading ? (
                    <>
                      <div style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                      Authenticating...
                    </>
                  ) : (
                    <>
                      Log In <ArrowRight style={{ width: 16, height: 16 }} />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* FORM B: FORGOT PASSWORD */}
            {viewMode === "forgot" && (
              <form onSubmit={handleForgotPassword} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <div>
                  <label style={{ display: "block", color: "#334155", fontSize: 13, fontWeight: 700, marginBottom: 8 }}>
                    Staff Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(""); }}
                    placeholder="admin@pestiq.com"
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
                  disabled={loading || !email}
                  style={{
                    height: 46, borderRadius: 10, border: "none",
                    background: "#2563eb", color: "#ffffff", fontSize: 14, fontWeight: 800,
                    cursor: loading || !email ? "not-allowed" : "pointer",
                    boxShadow: "0 4px 16px rgba(37, 99, 235, 0.3)",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  }}
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </button>
              </form>
            )}

            {/* FORM C: RESET PASSWORD */}
            {viewMode === "reset" && (
              <form onSubmit={handleResetPassword} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <div>
                  <label style={{ display: "block", color: "#334155", fontSize: 13, fontWeight: 700, marginBottom: 8 }}>
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
                    height: 46, borderRadius: 10, border: "none",
                    background: "#10b981", color: "#ffffff", fontSize: 14, fontWeight: 800,
                    cursor: loading || !newPassword ? "not-allowed" : "pointer",
                    boxShadow: "0 4px 16px rgba(16, 185, 129, 0.3)",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  }}
                >
                  {loading ? "Updating..." : "Save New Password"}
                </button>
              </form>
            )}
          </div>

          {/* Bottom Security Note */}
          <div style={{ marginTop: 28, paddingTop: 16, borderTop: "1px solid #f1f5f9", textAlign: "center" }}>
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
      <div style={{ minHeight: "100vh", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 32, height: 32, border: "3px solid #cbd5e1", borderTopColor: "#2563eb", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    }>
      <AdminLoginForm />
    </Suspense>
  );
}
