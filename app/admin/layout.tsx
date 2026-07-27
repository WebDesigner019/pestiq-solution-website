"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopBar from "@/components/admin/AdminTopBar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checked, setChecked] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (pathname === "/admin" || pathname === "/admin/") {
      setChecked(true);
      return;
    }
    const sessionAuth = sessionStorage.getItem("pestiq_admin_auth");
    const localAuth = localStorage.getItem("pestiq_admin_auth");
    if (sessionAuth !== "1" && localAuth !== "1") {
      router.replace("/admin");
    } else {
      setChecked(true);
    }
  }, [pathname, router]);

  const isLoginPage = pathname === "/admin" || pathname === "/admin/";

  if (isLoginPage) return <>{children}</>;

  if (!checked) {
    return (
      <div style={{ minHeight: "100vh", background: "#071b4d", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{
          width: 28, height: 28,
          border: "3px solid rgba(250,204,21,0.3)",
          borderTopColor: "#FACC15",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite"
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "#f4f6fb" }}>
      <AdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(o => !o)} />
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <AdminTopBar sidebarOpen={sidebarOpen} onToggle={() => setSidebarOpen(o => !o)} />
        <main style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
