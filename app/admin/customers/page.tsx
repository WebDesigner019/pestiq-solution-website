"use client";

import React, { useState } from "react";
import { Search, MessageCircle, X, Phone, Mail, MapPin, ArrowUpRight, ChevronRight } from "lucide-react";
import { MOCK_CUSTOMERS, MOCK_BOOKINGS, type Customer } from "@/lib/adminMockData";

// Semantic plan badge styles — brand palette only
const PLAN: Record<string, { dot:string; text:string; bg:string; border:string }> = {
  Complete:   { dot:"#071b4d", text:"#071b4d", bg:"#eef1f8", border:"#c7d2e8" },
  Essential:  { dot:"#1557b8", text:"#1557b8", bg:"#e8f0fc", border:"#b8d0f8" },
  "One-Time": { dot:"#d97706", text:"#92400e", bg:"#fef3c7", border:"#fde68a" },
  None:       { dot:"#94a3b8", text:"#475569", bg:"#f8fafc", border:"#e2e8f0" },
};

const STATUS_STYLE: Record<string,{bg:string;color:string;dot:string}> = {
  completed: { bg:"#dcfce7", color:"#166534", dot:"#16a34a" },
  confirmed: { bg:"#dbeafe", color:"#1e40af", dot:"#2563eb" },
  pending:   { bg:"#fef3c7", color:"#92400e", dot:"#d97706" },
  cancelled: { bg:"#fee2e2", color:"#991b1b", dot:"#dc2626" },
};

export default function AdminCustomersPage() {
  const [search,   setSearch]   = useState("");
  const [selected, setSelected] = useState<Customer | null>(null);

  const filtered = MOCK_CUSTOMERS.filter(c => {
    const q = search.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) ||
      c.city.toLowerCase().includes(q) || c.zip.includes(q) || c.phone.includes(q);
  });

  const topSpend  = Math.max(...MOCK_CUSTOMERS.map(c => c.totalSpent), 1);
  const cx = (c:Customer) => MOCK_BOOKINGS.filter(b=>b.customerName===c.name);
  const selBookings = selected ? cx(selected) : [];

  return (
    <div className="p-6 md:p-7 max-w-[1280px] mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-black text-[#071b4d] tracking-tight">Customers</h1>
          <p className="text-slate-400 text-xs mt-1">{filtered.length} records</p>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            value={search}
            onChange={e=>setSearch(e.target.value)}
            placeholder="Search customers…"
            className="w-full h-9 pl-9 pr-3 bg-white border border-slate-200 rounded-xl text-[13px] outline-none text-[#071b4d] focus:border-[#1557b8] transition-colors"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[680px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {["Customer","Plan","Bookings","Total Spent","Last Service",""].map(h=>(
                  <th key={h||"x"} className="text-left px-4 py-2.5 text-[11px] font-bold text-slate-400 uppercase tracking-[0.07em] whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => {
                const plan = PLAN[c.plan] ?? PLAN.None;
                const spendPct = Math.round((c.totalSpent/topSpend)*100);
                return (
                  <tr
                    key={c.id}
                    onClick={()=>setSelected(c)}
                    className="border-b border-slate-50 cursor-pointer hover:bg-[#fafcff] transition-colors"
                  >
                    {/* Customer — uniform navy avatar */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full flex-shrink-0 bg-[#071b4d] flex items-center justify-center text-white text-[11px] font-black">
                          {c.name.split(" ").map(n=>n[0]).join("").slice(0,2)}
                        </div>
                        <div>
                          <p className="text-[#071b4d] text-[13px] font-bold">{c.name}</p>
                          <p className="text-slate-400 text-[12px]">{c.email}</p>
                        </div>
                      </div>
                    </td>
                    {/* Plan badge */}
                    <td className="px-4 py-3">
                      <span
                        className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[12px] font-bold border"
                        style={{ background:plan.bg, color:plan.text, borderColor:plan.border }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background:plan.dot }} />
                        {c.plan}
                      </span>
                    </td>
                    {/* Bookings count */}
                    <td className="px-4 py-3">
                      <span className="text-[#071b4d] text-[14px] font-black">{c.totalBookings}</span>
                    </td>
                    {/* Total Spent with spend bar */}
                    <td className="px-4 py-3 min-w-[130px]">
                      <p className="text-[#071b4d] text-[14px] font-black mb-1">${c.totalSpent.toLocaleString()}</p>
                      <div className="h-1 rounded-full bg-slate-100 w-20">
                        <div className="h-full rounded-full bg-[#1557b8]/40" style={{ width:`${spendPct}%` }} />
                      </div>
                    </td>
                    {/* Last Service */}
                    <td className="px-4 py-3">
                      <span className={`text-[13px] font-medium ${c.lastService==="—" ? "text-slate-300" : "text-slate-600"}`}>
                        {c.lastService==="—" ? "Never" : new Date(c.lastService).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}
                      </span>
                    </td>
                    {/* Arrow */}
                    <td className="px-4 py-3">
                      <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                    </td>
                  </tr>
                );
              })}
              {filtered.length===0 && (
                <tr><td colSpan={6} className="px-4 py-14 text-center text-slate-400 text-[13px]">No customers found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Drawer */}
      {selected && (() => {
        const plan = PLAN[selected.plan] ?? PLAN.None;
        return (
          <div className="fixed inset-0 z-50 flex">
            <div className="flex-1 bg-black/40 backdrop-blur-[2px]" onClick={()=>setSelected(null)} />
            <div className="w-full max-w-[420px] bg-white flex flex-col shadow-2xl">

              {/* Drawer Header */}
              <div className="px-6 py-5 border-b border-slate-100">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {/* Uniform navy avatar — no rainbow gradient */}
                    <div className="w-10 h-10 rounded-full bg-[#071b4d] flex items-center justify-center text-white text-[13px] font-black">
                      {selected.name.split(" ").map(n=>n[0]).join("").slice(0,2)}
                    </div>
                    <div>
                      <h2 className="text-[#071b4d] text-base font-black">{selected.name}</h2>
                      <p className="text-slate-400 text-[12px] mt-0.5">{selected.id}</p>
                    </div>
                  </div>
                  <button onClick={()=>setSelected(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                    <X className="w-4.5 h-4.5" />
                  </button>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <span
                    className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[12px] font-bold border"
                    style={{ background:plan.bg, color:plan.text, borderColor:plan.border }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background:plan.dot }} />
                    {selected.plan} Plan
                  </span>
                  <span className="text-slate-400 text-[12px]">
                    Since {new Date(selected.joinedDate).toLocaleDateString("en-US",{month:"short",year:"numeric"})}
                  </span>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-5">

                {/* Mini stats */}
                <div className="grid grid-cols-2 gap-2.5 mb-5">
                  {[{ label:"Total Bookings", value:selected.totalBookings }, { label:"Total Spent", value:`$${selected.totalSpent.toLocaleString()}` }].map(({label,value})=>(
                    <div key={label} className="bg-slate-50 rounded-xl p-3.5">
                      <p className="text-slate-400 text-[12px] font-semibold mb-1">{label}</p>
                      <p className="text-[#071b4d] text-xl font-black">{value}</p>
                    </div>
                  ))}
                </div>

                {/* Contact */}
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400 mb-2.5">Contact</p>
                <div className="flex flex-col gap-2 mb-5">
                  {[
                    { icon:Phone, v:selected.phone, href:`tel:${selected.phone}` },
                    { icon:Mail,  v:selected.email, href:`mailto:${selected.email}` },
                    { icon:MapPin,v:`${selected.address}, ${selected.city}, ${selected.state} ${selected.zip}`,
                      href:`https://maps.google.com/?q=${encodeURIComponent(selected.address+" "+selected.city)}` },
                  ].map(({icon:Icon,v,href})=>(
                    <a key={href} href={href} target="_blank" rel="noopener noreferrer"
                      className="flex items-start gap-2.5 text-[13px] text-[#1557b8] no-underline hover:text-[#071b4d] transition-colors"
                    >
                      <Icon className="w-3.5 h-3.5 mt-0.5 text-slate-400 flex-shrink-0" />
                      <span className="flex-1">{v}</span>
                      <ArrowUpRight className="w-3 h-3 mt-0.5 flex-shrink-0 text-slate-400" />
                    </a>
                  ))}
                </div>

                {/* Booking history */}
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400 mb-2.5">
                  Service History ({selBookings.length})
                </p>
                {selBookings.length===0 ? (
                  <p className="text-slate-400 text-[13px]">No services yet.</p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {selBookings.map(b => {
                      const ss = STATUS_STYLE[b.status] ?? STATUS_STYLE.pending;
                      return (
                        <div key={b.id} className="flex items-center gap-2.5 bg-slate-50 rounded-xl px-3 py-2.5">
                          <div className="flex-1 min-w-0">
                            <p className="text-[#071b4d] text-[13px] font-bold">{b.service}</p>
                            <p className="text-slate-400 text-[12px] mt-0.5">
                              {new Date(b.scheduledDate).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})} &middot; ${b.price}
                            </p>
                          </div>
                          <span
                            className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2 py-0.5 rounded-full capitalize"
                            style={{ background:ss.bg, color:ss.color }}
                          >
                            <span className="w-1.5 h-1.5 rounded-full" style={{ background:ss.dot }} />
                            {b.status}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-slate-100">
                <a
                  href={`https://wa.me/${selected.phone.replace(/\D/g,"")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2.5 h-11 bg-[#17824b] hover:bg-[#146b3f] text-white rounded-xl text-[14px] font-bold no-underline transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  Message on WhatsApp
                </a>
              </div>

            </div>
          </div>
        );
      })()}
    </div>
  );
}
