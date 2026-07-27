"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, CalendarDays, Users, ClipboardList, LogOut, X, Menu,
} from "lucide-react";

/* ─── PestIQ Logo SVG ─── */
function PestIQLogo({ size = 32 }: { size?: number }) {
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

const NAV = [
  { href: "/admin/overview",  label: "Overview",  icon: LayoutDashboard },
  { href: "/admin/bookings",  label: "Bookings",  icon: ClipboardList, badge: 4 },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/calendar",  label: "Calendar",  icon: CalendarDays },
];

interface Props { isOpen: boolean; onToggle: () => void; }

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const router   = useRouter();

  const logout = () => {
    sessionStorage.removeItem("pestiq_admin_auth");
    localStorage.removeItem("pestiq_admin_auth");
    router.push("/admin");
  };

  return (
    <aside className="w-64 h-full bg-white border-r border-slate-200 flex flex-col justify-between">
      <div>
        {/* Brand */}
        <div className="h-16 px-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <PestIQLogo size={34} />
            <div>
              <span className="font-black text-xl text-slate-900 tracking-tight block leading-none">PestIQ</span>
              <span className="text-[10px] font-extrabold text-[#2563eb] uppercase tracking-widest">Admin Console</span>
            </div>
          </div>
          {onClose && (
            <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Nav section */}
        <nav className="p-4 space-y-1">
          <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest px-3 mb-2">Management</p>

          {NAV.map(({ href, label, icon: Icon, badge }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                  active
                    ? "bg-[#2563eb] text-white shadow-md shadow-blue-500/20"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${active ? "text-white" : "text-slate-400"}`} />
                  <span>{label}</span>
                </div>
                {badge && (
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                    active ? "bg-white text-blue-700" : "bg-blue-100 text-blue-700"
                  }`}>
                    {badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User footer */}
      <div className="p-4 border-t border-slate-100">
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#071b4d] text-white flex items-center justify-center font-bold text-sm">
              AD
            </div>
            <div>
              <p className="text-xs font-extrabold text-slate-900 leading-snug">Administrator</p>
              <p className="text-[11px] text-slate-500 font-medium">Ops Dispatch</p>
            </div>
          </div>
          <button onClick={logout} title="Log Out" className="text-slate-400 hover:text-rose-600 transition-colors p-1">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}

export default function AdminSidebar({ isOpen, onToggle }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={`hidden lg:block ${isOpen ? "w-64" : "w-0"} transition-all duration-200 flex-shrink-0`}>
        {isOpen && <SidebarContent />}
      </div>

      {/* Mobile Trigger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-3.5 left-4 z-40 p-2 bg-[#071b4d] text-white rounded-lg shadow-md"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="relative z-10">
            <SidebarContent onClose={() => setMobileOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
