"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Bug, Bell, PanelLeftClose, PanelLeftOpen, ChevronRight } from "lucide-react";

interface Props { sidebarOpen: boolean; onToggle: () => void; }

const PAGE_NAMES: Record<string, string> = {
  "/admin/overview": "Dashboard Overview",
  "/admin/bookings": "Bookings Management",
  "/admin/customers": "Customer CRM",
  "/admin/calendar": "Appointment Calendar",
};

export default function AdminTopBar({ sidebarOpen, onToggle }: Props) {
  const pathname = usePathname();
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
  const currentPage = PAGE_NAMES[pathname] || "Admin Portal";

  return (
    <header style={{
      height: 58, background: "#fff",
      borderBottom: "1px solid #e8edf5",
      display: "flex", alignItems: "center",
      paddingRight: 20, flexShrink: 0, zIndex: 10,
    }}>
      {/* Sidebar toggle button */}
      <button
        onClick={onToggle}
        title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
        className="hidden lg:flex"
        style={{
          width: 58, height: 58, flexShrink: 0,
          alignItems: "center", justifyContent: "center",
          border: "none", background: "none", cursor: "pointer",
          color: "#64748b", borderRight: "1px solid #f1f5f9",
          transition: "background 0.15s, color 0.15s",
        }}
        onMouseEnter={e => { e.currentTarget.style.background = "#f8fafc"; e.currentTarget.style.color = "#0d1e4a"; }}
        onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "#64748b"; }}
      >
        {sidebarOpen
          ? <PanelLeftClose style={{ width: 18, height: 18 }} />
          : <PanelLeftOpen  style={{ width: 18, height: 18 }} />
        }
      </button>

      {/* Show Logo ONLY when sidebar is collapsed. When sidebar is open, show page title/breadcrumb to avoid duplicate logos! */}
      {!sidebarOpen ? (
        <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "0 18px", borderRight: "1px solid #f1f5f9" }}>
          <div style={{
            width: 30, height: 30, borderRadius: 9, background: "#0d1e4a",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <Bug style={{ width: 15, height: 15, color: "#FACC15" }} />
          </div>
          <div>
            <p style={{ color: "#0d1e4a", fontWeight: 900, fontSize: 15, margin: 0, letterSpacing: "-0.03em" }}>PestIQ</p>
            <p style={{ color: "#94a3b8", fontWeight: 600, fontSize: 9, margin: 0, textTransform: "uppercase", letterSpacing: "0.12em" }}>Admin Portal</p>
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "0 20px" }}>
          <span style={{ color: "#94a3b8", fontSize: 13, fontWeight: 500 }}>Admin</span>
          <ChevronRight style={{ width: 13, height: 13, color: "#cbd5e1" }} />
          <span style={{ color: "#0d1e4a", fontSize: 13, fontWeight: 700 }}>{currentPage}</span>
        </div>
      )}

      <div style={{ flex: 1 }} />

      {/* Date */}
      <span style={{ color: "#94a3b8", fontSize: 12, fontWeight: 500, marginRight: 16, display: "none" }}
        className="sm:inline-block">{dateStr}</span>

      {/* Notification bell */}
      <button style={{
        width: 36, height: 36, borderRadius: 9,
        background: "none", border: "1px solid #e8edf5",
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", position: "relative", color: "#64748b", marginRight: 10,
        flexShrink: 0,
      }}
        onMouseEnter={e => (e.currentTarget.style.background = "#f8fafc")}
        onMouseLeave={e => (e.currentTarget.style.background = "none")}
      >
        <Bell style={{ width: 15, height: 15 }} />
        <span style={{
          position: "absolute", top: 8, right: 8,
          width: 7, height: 7, borderRadius: "50%",
          background: "#FACC15", border: "2px solid #fff",
        }} />
      </button>

      {/* Admin chip */}
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        padding: "5px 11px 5px 5px",
        borderRadius: 10, border: "1px solid #e8edf5",
        background: "#fafbfc", cursor: "default", flexShrink: 0,
      }}>
        <div style={{
          width: 28, height: 28, borderRadius: "50%", background: "#0d1e4a",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#FACC15", fontSize: 11, fontWeight: 900,
        }}>A</div>
        <div>
          <p style={{ color: "#0f172a", fontSize: 12, fontWeight: 700, margin: 0, lineHeight: 1.2 }}>Admin</p>
          <p style={{ color: "#94a3b8", fontSize: 10, margin: 0, lineHeight: 1.2 }}>Authenticated staff</p>
        </div>
      </div>
    </header>
  );
}
