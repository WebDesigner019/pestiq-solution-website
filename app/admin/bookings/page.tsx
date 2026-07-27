"use client";

import React, { useState } from "react";
import { Search, MessageSquare, X, Phone, Mail, MapPin, ArrowUpRight } from "lucide-react";
import { MOCK_BOOKINGS, type Booking, type BookingStatus } from "@/lib/adminMockData";

const STATUS: Record<BookingStatus, { label: string; dot: string; text: string; bg: string; border: string }> = {
  pending:   { label: "Pending",   dot: "#d97706", text: "#92400e", bg: "#fef3c7", border: "#fde68a" },
  confirmed: { label: "Confirmed", dot: "#2563eb", text: "#1e40af", bg: "#dbeafe", border: "#bfdbfe" },
  completed: { label: "Completed", dot: "#16a34a", text: "#166534", bg: "#dcfce7", border: "#bbf7d0" },
  cancelled: { label: "Cancelled", dot: "#dc2626", text: "#991b1b", bg: "#fee2e2", border: "#fecaca" },
};

const TABS: { key: BookingStatus | "all"; label: string }[] = [
  { key: "all",       label: "All"       },
  { key: "pending",   label: "Pending"   },
  { key: "confirmed", label: "Confirmed" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
];

function buildWA(b: Booking) {
  const msg = `PestIQ Service Assignment\n\nBooking: ${b.id}\nCustomer: ${b.customerName}\nContact: ${b.phone}\nAddress: ${b.address}, ${b.city}, ${b.state} ${b.zip}\nService: ${b.service} (${b.plan})\nDate: ${new Date(b.scheduledDate).toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric",year:"numeric"})}\nTime: ${b.scheduledTime}\nNotes: ${b.notes||"None"}\n\nPlease confirm arrival.`;
  return `https://wa.me/?text=${encodeURIComponent(msg)}`;
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS);
  const [search,   setSearch]   = useState("");
  const [filter,   setFilter]   = useState<BookingStatus | "all">("all");
  const [selected, setSelected] = useState<Booking | null>(null);

  const counts: Record<string, number> = {
    all: bookings.length,
    pending:   bookings.filter(b => b.status === "pending").length,
    confirmed: bookings.filter(b => b.status === "confirmed").length,
    completed: bookings.filter(b => b.status === "completed").length,
    cancelled: bookings.filter(b => b.status === "cancelled").length,
  };

  const filtered = bookings.filter(b => {
    const q = search.toLowerCase();
    const matchQ = b.customerName.toLowerCase().includes(q) || b.id.toLowerCase().includes(q) ||
      b.city.toLowerCase().includes(q) || b.service.toLowerCase().includes(q);
    const matchF = filter === "all" || b.status === filter;
    return matchQ && matchF;
  });

  const changeStatus = (id: string, s: BookingStatus) => {
    setBookings(p => p.map(b => b.id === id ? { ...b, status: s } : b));
    setSelected(p => p?.id === id ? { ...p, status: s } : p);
  };

  return (
    <div className="p-6 md:p-8 max-w-6xl w-full mx-auto space-y-6">

      {/* Heading */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Bookings Management</h1>
          <p className="text-slate-500 text-xs mt-1">{bookings.length} total service requests recorded</p>
        </div>
      </div>

      {/* Toolbar: Filter Tabs + Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">

        {/* Filter Tabs */}
        <div className="inline-flex bg-slate-200/70 p-1 rounded-xl border border-slate-300/60 gap-1 flex-wrap">
          {TABS.map(({ key, label }) => {
            const active = filter === key;
            const m = key !== "all" ? STATUS[key] : null;
            return (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  active
                    ? "bg-[#071b4d] text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                {m && <span className="w-2 h-2 rounded-full" style={{ backgroundColor: active ? "#ffffff" : m.dot }} />}
                {label}
                <span className={`text-[11px] font-extrabold px-2 py-0.5 rounded-full ${
                  active ? "bg-white/20 text-white" : "bg-slate-300/80 text-slate-700"
                }`}>
                  {counts[key]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, service, city..."
            className="w-full h-9 pl-9 pr-4 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-blue-600 focus:bg-white transition-all shadow-xs"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-200 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3.5">#</th>
                <th className="px-6 py-3.5">Customer</th>
                <th className="px-6 py-3.5">Service</th>
                <th className="px-6 py-3.5">Date &amp; Time</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filtered.map((b) => {
                const m = STATUS[b.status];
                const initials = b.customerName.split(" ").map(n => n[0]).join("").slice(0, 2);
                return (
                  <tr
                    key={b.id}
                    onClick={() => setSelected(b)}
                    className="hover:bg-slate-50/60 transition-colors cursor-pointer"
                  >
                    {/* ID */}
                    <td className="px-6 py-4 font-mono text-[11px] text-slate-400 font-bold">
                      {b.id}
                    </td>

                    {/* Customer */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#071b4d] text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                          {initials}
                        </div>
                        <div>
                          <p className="font-extrabold text-xs text-slate-900">{b.customerName}</p>
                          <p className="text-[11px] text-slate-400">{b.city}, {b.state}</p>
                        </div>
                      </div>
                    </td>

                    {/* Service */}
                    <td className="px-6 py-4">
                      <p className="font-bold text-xs text-slate-900">{b.service}</p>
                      <p className="text-[11px] text-slate-400">{b.plan} • ${b.price}</p>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="font-bold text-xs text-slate-900">
                        {new Date(b.scheduledDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </p>
                      <p className="text-[11px] text-slate-400">{b.scheduledTime}</p>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold"
                        style={{ color: m.text, backgroundColor: m.bg, border: `1px solid ${m.border}` }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: m.dot }} />
                        {m.label}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        {b.status === "pending" && (
                          <button
                            onClick={() => changeStatus(b.id, "confirmed")}
                            className="px-3 py-1 text-xs font-bold rounded-lg border border-blue-200 bg-blue-50 text-blue-800 hover:bg-blue-100 transition-all"
                          >
                            Confirm
                          </button>
                        )}
                        {b.status === "confirmed" && (
                          <button
                            onClick={() => changeStatus(b.id, "completed")}
                            className="px-3 py-1 text-xs font-bold rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition-all"
                          >
                            Complete
                          </button>
                        )}
                        {(b.status === "pending" || b.status === "confirmed") && (
                          <button
                            onClick={() => changeStatus(b.id, "cancelled")}
                            className="px-3 py-1 text-xs font-bold rounded-lg border border-rose-200 bg-rose-50 text-rose-800 hover:bg-rose-100 transition-all"
                          >
                            Cancel
                          </button>
                        )}
                        <a
                          href={buildWA(b)}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Dispatch via WhatsApp"
                          className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 flex items-center justify-center transition-colors"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400 text-xs">
                    No bookings match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Drawer */}
      {selected && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="relative z-10 w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-fadeIn">
            {/* Drawer Header */}
            <div className="p-6 border-b border-slate-100 flex items-start justify-between">
              <div>
                <p className="font-mono text-xs text-slate-400 font-bold mb-1">{selected.id}</p>
                <h2 className="text-xl font-black text-slate-900">{selected.customerName}</h2>
                <p className="text-xs text-slate-500 mt-0.5">{selected.service}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="p-6 space-y-6 flex-1 overflow-y-auto">
              {/* Status Selector */}
              <div>
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">Update Status</p>
                <div className="flex gap-2 flex-wrap">
                  {(["pending", "confirmed", "completed", "cancelled"] as BookingStatus[]).map(s => {
                    const m = STATUS[s];
                    const active = selected.status === s;
                    return (
                      <button
                        key={s}
                        onClick={() => changeStatus(selected.id, s)}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1.5 capitalize transition-all ${
                          active
                            ? "border-slate-900 bg-slate-900 text-white shadow-xs"
                            : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: active ? "#ffffff" : m.dot }} />
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Contact Info */}
              <div>
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">Contact</p>
                <div className="space-y-2">
                  {[
                    { icon: Phone, v: selected.phone, href: `tel:${selected.phone}` },
                    { icon: Mail, v: selected.email, href: `mailto:${selected.email}` },
                    {
                      icon: MapPin,
                      v: `${selected.address}, ${selected.city}, ${selected.state} ${selected.zip}`,
                      href: `https://maps.google.com/?q=${encodeURIComponent(selected.address + " " + selected.city)}`
                    },
                  ].map(({ icon: Icon, v, href }) => (
                    <a
                      key={href}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-2.5 text-xs text-blue-600 font-bold hover:underline"
                    >
                      <Icon className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                      <span className="flex-1">{v}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Service Details */}
              <div>
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">Service Details</p>
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-2 text-xs">
                  {[
                    ["Service", selected.service],
                    ["Plan", selected.plan],
                    ["Price", `$${selected.price}`],
                    ["Property", `${selected.sqFt.toLocaleString()} sq ft`],
                    ["Date", new Date(selected.scheduledDate).toLocaleDateString("en-US", { weekday: "short", month: "long", day: "numeric", year: "numeric" })],
                    ["Time", selected.scheduledTime],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between">
                      <span className="text-slate-500 font-semibold">{label}</span>
                      <span className="font-bold text-slate-900">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {selected.notes && (
                <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-3.5">
                  <p className="text-[10px] font-extrabold text-amber-800 uppercase tracking-widest mb-1">Notes</p>
                  <p className="text-xs text-slate-800 leading-relaxed font-medium">{selected.notes}</p>
                </div>
              )}
            </div>

            {/* Footer Action */}
            <div className="p-4 border-t border-slate-100">
              <a
                href={buildWA(selected)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <MessageSquare className="w-4 h-4" /> Dispatch to Tech via WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
