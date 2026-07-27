"use client";

import React from "react";
import Link from "next/link";
import {
  ClipboardList, Users, CalendarCheck, DollarSign,
  ArrowRight, MessageCircle, TrendingUp, TrendingDown,
  CheckCircle2, Clock, AlertCircle
} from "lucide-react";
import { MOCK_BOOKINGS, MOCK_CUSTOMERS, type BookingStatus } from "@/lib/adminMockData";

const STATUS: Record<BookingStatus, { text: string; bg: string; color: string }> = {
  pending:   { text: "Pending Review", bg: "#fef3c7", color: "#92400e" },
  confirmed: { text: "Confirmed",      bg: "#dbeafe", color: "#1e40af" },
  completed: { text: "Completed",      bg: "#dcfce7", color: "#166534" },
  cancelled: { text: "Cancelled",      bg: "#fee2e2", color: "#991b1b" },
};

function buildWA(b: (typeof MOCK_BOOKINGS)[0]) {
  const msg = `PestIQ Service Assignment\n\nBooking: ${b.id}\nCustomer: ${b.customerName}\nPhone: ${b.phone}\nAddress: ${b.address}, ${b.city}, ${b.state} ${b.zip}\nService: ${b.service} (${b.plan})\nDate: ${new Date(b.scheduledDate).toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric",year:"numeric"})}\nTime: ${b.scheduledTime}\nNotes: ${b.notes||"None"}\n\nPlease confirm arrival.`;
  return `https://wa.me/?text=${encodeURIComponent(msg)}`;
}

export default function AdminOverviewPage() {
  const pending   = MOCK_BOOKINGS.filter(b => b.status === "pending").length;
  const confirmed = MOCK_BOOKINGS.filter(b => b.status === "confirmed").length;
  const completed = MOCK_BOOKINGS.filter(b => b.status === "completed").length;
  const revenue   = MOCK_BOOKINGS.filter(b => b.status === "completed").reduce((s,b)=>s+b.price,0);
  const recent    = [...MOCK_BOOKINGS].sort((a,b)=>new Date(b.createdAt).getTime()-new Date(a.createdAt).getTime()).slice(0,5);
  const total     = MOCK_BOOKINGS.length;

  const stats = [
    { label:"Total Bookings",      value:total,                         sub:`${pending} pending review`, icon:ClipboardList, color:"#2563eb", bg:"#dbeafe", trend:"+12% vs last mo", up:true },
    { label:"Active Customers",    value:MOCK_CUSTOMERS.length,        sub:"All time records",          icon:Users,         color:"#8b5cf6", bg:"#f3e8ff", trend:"+18% growth",      up:true },
    { label:"Revenue Collected",   value:`$${revenue.toLocaleString()}`, sub:`${completed} jobs completed`,    icon:DollarSign,    color:"#10b981", bg:"#dcfce7", trend:"+24% vs target",   up:true },
    { label:"Confirmed This Week", value:confirmed,                    sub:"Scheduled appointments",    icon:CalendarCheck, color:"#f59e0b", bg:"#fef3c7", trend:`${confirmed} active`,      up:confirmed>0 },
  ];

  const breakdown = (["pending","confirmed","completed","cancelled"] as BookingStatus[]).map(s => ({
    s, count:MOCK_BOOKINGS.filter(b=>b.status===s).length, m:STATUS[s]
  }));

  return (
    <div className="p-6 md:p-8 max-w-6xl w-full mx-auto space-y-6">

      {/* PAGE TITLE */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-slate-500 text-xs mt-1">
            {new Date().toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric",year:"numeric"})} • PestIQ Dispatch Operations
          </p>
        </div>

        <Link
          href="/admin/bookings"
          className="px-4 py-2 bg-[#2563eb] hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center gap-2"
        >
          Manage All Bookings <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* KPI METRICS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, sub, icon:Icon, color, bg, trend, up }) => (
          <div key={label} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: bg, color }}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                {up ? <TrendingUp className="w-3 h-3 text-emerald-600" /> : <TrendingDown className="w-3 h-3 text-rose-600" />}
                {trend}
              </span>
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900 tracking-tight">{value}</p>
              <p className="text-xs font-bold text-slate-700 mt-1">{label}</p>
              <p className="text-[11px] text-slate-400 font-medium">{sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* MAIN TWO-COLUMN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* RECENT BOOKINGS TABLE (2 COLUMNS) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-black text-slate-900">Recent Service Bookings</h3>
                <p className="text-slate-500 text-xs">Latest customer appointments requiring dispatch</p>
              </div>
              <Link href="/admin/bookings" className="text-xs font-bold text-blue-600 hover:underline">
                View all →
              </Link>
            </div>

            <div className="space-y-3">
              {recent.map((b) => {
                const m = STATUS[b.status];
                return (
                  <div key={b.id} className="p-4 bg-slate-50/70 border border-slate-200/80 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-300 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#071b4d] text-white flex items-center justify-center font-black text-xs flex-shrink-0">
                        {b.customerName.split(" ").map(n => n[0]).join("").slice(0,2)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-xs text-slate-900">{b.customerName}</span>
                          <span className="text-[11px] text-slate-400 font-medium">• {b.id}</span>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5">{b.service} ({b.plan})</p>
                        <p className="text-[11px] text-slate-400">{b.city}, {b.state} • {b.scheduledDate}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 justify-end">
                      <span
                        className="px-2.5 py-1 rounded-full text-[11px] font-extrabold"
                        style={{ color: m.color, backgroundColor: m.bg }}
                      >
                        {m.text}
                      </span>
                      <a
                        href={buildWA(b)}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Dispatch via WhatsApp"
                        className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 flex items-center justify-center transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* STATUS BREAKDOWN & SYSTEM SUMMARY (1 COLUMN) */}
        <div className="space-y-6">

          {/* Status Distribution */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-base font-black text-slate-900 mb-4">Status Breakdown</h3>

            <div className="space-y-3">
              {breakdown.map(({ s, count, m }) => {
                const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                return (
                  <div key={s} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-700 capitalize">{s}</span>
                      <span className="font-black text-slate-900">{count} ({pct}%)</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%`, backgroundColor: m.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick System Actions */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-lg">
            <h4 className="font-black text-sm text-white mb-1">Fleet Operations Active</h4>
            <p className="text-xs text-slate-300 mb-4">4 lead technicians currently dispatched across NJ &amp; NYC.</p>

            <Link
              href="/admin/calendar"
              className="w-full py-2.5 bg-[#FACC15] hover:bg-yellow-400 text-[#071b4d] font-black rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-md"
            >
              Open Calendar Schedule
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
}
