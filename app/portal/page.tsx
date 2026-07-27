"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Calendar,
  Clock,
  AlertCircle,
  FileText,
  DollarSign,
  CheckCircle2,
  X,
  Send,
  ShieldCheck,
  Search,
  Download,
  History,
  LogOut,
  CalendarCheck
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

export default function CustomerPortal() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "plan" | "history">("dashboard");

  // Modals
  const [sightingModal, setSightingModal] = useState(false);
  const [rescheduleModal, setRescheduleModal] = useState(false);

  // Form states
  const [sightingType, setSightingType] = useState("Ants (Kitchen / Indoors)");
  const [sightingNotes, setSightingNotes] = useState("");
  const [sightingSuccess, setSightingSuccess] = useState(false);

  const [rescheduleDate, setRescheduleDate] = useState("2026-08-10");
  const [rescheduleWindow, setRescheduleWindow] = useState("09:00 AM - 11:00 AM");
  const [rescheduleSuccess, setRescheduleSuccess] = useState(false);

  const handleLogSighting = (e: React.FormEvent) => {
    e.preventDefault();
    setSightingSuccess(true);
    setTimeout(() => {
      setSightingSuccess(false);
      setSightingModal(false);
      setSightingNotes("");
    }, 2500);
  };

  const handleRescheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRescheduleSuccess(true);
    setTimeout(() => {
      setRescheduleSuccess(false);
      setRescheduleModal(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex font-sans">

      {/* ══ LEFT SIDEBAR ══ */}
      <aside className="w-64 bg-white border-r border-slate-200 flex-shrink-0 flex flex-col justify-between hidden md:flex sticky top-0 h-screen z-20">
        <div>
          {/* Logo Header */}
          <div className="p-6 border-b border-slate-100 flex items-center gap-3">
            <PestIQLogo size={36} />
            <div>
              <span className="font-black text-xl text-slate-900 tracking-tight block leading-none">PestIQ</span>
              <span className="text-[10px] font-extrabold text-[#2563eb] uppercase tracking-widest">Customer Portal</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {[
              { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
              { id: "plan", label: "My Plan & Coverage", icon: ShieldCheck },
              { id: "history", label: "Service History", icon: History },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all text-left ${
                    isActive
                      ? "bg-[#071b4d] text-white shadow-md shadow-slate-900/10"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-slate-400"}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Account Card */}
        <div className="p-4 border-t border-slate-100">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#071b4d] text-white flex items-center justify-center font-bold text-sm">
                JS
              </div>
              <div>
                <p className="text-xs font-extrabold text-slate-900 leading-snug">John Smith</p>
                <p className="text-[11px] text-slate-500 font-medium">Ocean County, NJ</p>
              </div>
            </div>
            <Link href="/portal/login" title="Sign out" className="text-slate-400 hover:text-rose-600 transition-colors p-1">
              <LogOut className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </aside>

      {/* ══ RIGHT CONTENT AREA ══ */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* TOP BAR */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4 flex-1 max-w-md">
            <div className="md:hidden flex items-center gap-2">
              <PestIQLogo size={30} />
            </div>
            <div className="relative w-full max-w-sm hidden sm:block">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search visits, reports, or plan..."
                className="w-full h-9 pl-9 pr-4 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-slate-800 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700">
              <span>Plan Rate: <strong className="text-slate-900">$69/mo</strong></span>
            </div>

            <div className="flex items-center gap-2 px-3.5 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full text-xs font-extrabold text-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Complete Protection Active
            </div>
          </div>
        </header>

        {/* MAIN BODY */}
        <main className="p-6 md:p-8 max-w-6xl w-full mx-auto space-y-6">

          {/* PAGE HEADING */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Welcome back, John Smith!</h1>
              <p className="text-slate-500 text-xs mt-1">Manage your active protection plan, upcoming technician visits, and service history.</p>
            </div>
            <Link href="/" className="text-xs font-bold text-slate-700 hover:text-slate-900 flex items-center gap-1">
              Back to main site →
            </Link>
          </div>

          {/* ══ TOP ROW: UPCOMING SERVICE + PRIORITY PEST SIGHTING ══ */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Next Scheduled Visit Card */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-extrabold text-blue-600 uppercase tracking-wider block">Upcoming Service</span>
                  <h2 className="text-lg font-black text-slate-900 mt-0.5">Routine Exterior Barrier &amp; Inspection</h2>
                </div>
                <span className="px-3 py-1 bg-blue-50 text-blue-800 border border-blue-200 text-xs font-extrabold rounded-full">
                  CONFIRMED
                </span>
              </div>

              <div className="p-6 space-y-4">
                <p className="text-xs text-slate-500 font-medium">
                  Assigned Lead Technician: <strong className="text-slate-800 font-bold">Dave Smith (Senior Specialist)</strong>
                </p>

                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-slate-900 font-black text-sm">
                      <Calendar className="w-4 h-4 text-[#071b4d]" />
                      Tuesday, August 5, 2026
                    </div>
                    <div className="flex items-center gap-2 text-slate-600 text-xs font-medium">
                      <Clock className="w-4 h-4 text-slate-400" />
                      Arrival Window: 09:00 AM - 11:00 AM (Eastern)
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => setRescheduleModal(true)}
                      className="flex-1 sm:flex-none px-4 py-2 border border-slate-300 text-slate-700 font-bold rounded-lg hover:bg-white text-xs transition-all"
                    >
                      Reschedule
                    </button>
                    <a
                      href="https://wa.me/?text=Hello%20PestIQ%2C%20confirming%20my%20service%20visit%20on%20Aug%205."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 sm:flex-none px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition-all shadow-sm flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Confirm Visit
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Report Pest Activity Card */}
            <div className="bg-[#071b4d] rounded-2xl p-6 text-white flex flex-col justify-between shadow-lg relative overflow-hidden">
              <div className="space-y-3 z-10 relative">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-[#FACC15] border border-amber-400/30 text-xs font-extrabold">
                  <AlertCircle className="w-3.5 h-3.5" /> Priority Response Guaranteed
                </div>
                <h3 className="text-xl font-black text-white leading-snug">Noticed Pest Activity?</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Don't wait for your next routine visit. Under your Complete Protection Plan, emergency re-treatments are 100% free.
                </p>
              </div>

              <button
                onClick={() => setSightingModal(true)}
                className="w-full mt-6 py-3 bg-[#FACC15] hover:bg-yellow-400 text-[#071b4d] font-black rounded-xl transition-all shadow-md text-xs flex items-center justify-center gap-2 z-10"
              >
                Log Sighting for Priority Dispatch
              </button>
            </div>

          </div>

          {/* ══ MIDDLE ROW: PLAN & COVERAGE SUMMARY ══ */}
          <div id="plan">
            <h2 className="text-lg font-black text-slate-900 mb-3">Plan &amp; Coverage Summary</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#071b4d] flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Active Plan</p>
                  <p className="font-black text-slate-900 text-sm">Complete Protection</p>
                  <p className="text-[11px] text-emerald-600 font-bold">100% Satisfaction Warranty</p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                  <DollarSign className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Monthly Rate</p>
                  <p className="font-black text-slate-900 text-sm">$69.00 / month</p>
                  <p className="text-[11px] text-slate-500">Auto-renews monthly</p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
                  <CalendarCheck className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Next Billing Cycle</p>
                  <p className="font-black text-slate-900 text-sm">August 22, 2026</p>
                  <p className="text-[11px] text-slate-500">Receipt sent to email</p>
                </div>
              </div>

            </div>
          </div>

          {/* ══ BOTTOM ROW: SERVICE HISTORY & INSPECTION REPORTS ══ */}
          <div id="history">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-black text-slate-900">Service History &amp; Inspection Reports</h2>
              <button className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 border border-slate-200 px-3 py-1.5 rounded-lg bg-white shadow-sm transition-all">
                <Download className="w-3.5 h-3.5" /> Export All Reports
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-200 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-3.5">Date</th>
                      <th className="px-6 py-3.5">Service Type</th>
                      <th className="px-6 py-3.5">Technician</th>
                      <th className="px-6 py-3.5">Status</th>
                      <th className="px-6 py-3.5 text-right">Inspection Report</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    <tr className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-900">May 10, 2026</td>
                      <td className="px-6 py-4 font-semibold text-slate-900">Spring Barrier &amp; Ant Spray</td>
                      <td className="px-6 py-4 text-slate-600">Dave Smith</td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-emerald-100 text-emerald-800">
                          Completed
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-blue-600 font-bold hover:underline">View PDF Report</button>
                      </td>
                    </tr>

                    <tr className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-900">Feb 14, 2026</td>
                      <td className="px-6 py-4 font-semibold text-slate-900">Winter Rodent Defense</td>
                      <td className="px-6 py-4 text-slate-600">Marcus Vance</td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-emerald-100 text-emerald-800">
                          Completed
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-blue-600 font-bold hover:underline">View PDF Report</button>
                      </td>
                    </tr>

                    <tr className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-900">Nov 02, 2025</td>
                      <td className="px-6 py-4 font-semibold text-slate-900">Fall Wasp &amp; Perimeter Inspection</td>
                      <td className="px-6 py-4 text-slate-600">Dave Smith</td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-emerald-100 text-emerald-800">
                          Completed
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-blue-600 font-bold hover:underline">View PDF Report</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </main>
      </div>

      {/* ══ MODAL A: LOG PEST SIGHTING ══ */}
      {sightingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSightingModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 z-10 animate-fadeIn border border-slate-200">
            <button onClick={() => setSightingModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-[#071b4d]" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">Report Pest Activity</h3>
                <p className="text-slate-500 text-xs">Priority dispatch for active plan subscribers</p>
              </div>
            </div>

            {sightingSuccess ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 text-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                <h4 className="text-base font-black text-emerald-950">Priority Request Logged!</h4>
                <p className="text-emerald-700 text-xs mt-1">A dispatch coordinator will contact you within 30 minutes to confirm technician arrival.</p>
              </div>
            ) : (
              <form onSubmit={handleLogSighting} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Pest Type Observed</label>
                  <select
                    value={sightingType}
                    onChange={e => setSightingType(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 bg-slate-50 outline-none focus:border-slate-800 focus:bg-white transition-all"
                  >
                    <option value="Ants (Kitchen / Indoors)">Ants (Kitchen / Indoors)</option>
                    <option value="Mice / Rodents">Mice / Rodents</option>
                    <option value="German Cockroaches">German Cockroaches</option>
                    <option value="Bed Bugs">Bed Bugs</option>
                    <option value="Wasps / Hornets Exterior">Wasps / Hornets Exterior</option>
                    <option value="Other Pest">Other Pest</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Location &amp; Details</label>
                  <textarea
                    rows={3}
                    value={sightingNotes}
                    onChange={e => setSightingNotes(e.target.value)}
                    placeholder="Describe location and severity..."
                    required
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-900 bg-slate-50 outline-none focus:border-slate-800 focus:bg-white transition-all"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full h-11 bg-[#071b4d] hover:bg-slate-900 text-white font-bold rounded-xl shadow-md flex items-center justify-center gap-2 text-xs transition-all"
                >
                  <Send className="w-3.5 h-3.5 text-[#FACC15]" /> Submit Priority Callback Request
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ══ MODAL B: RESCHEDULE VISIT ══ */}
      {rescheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setRescheduleModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 z-10 animate-fadeIn border border-slate-200">
            <button onClick={() => setRescheduleModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-black text-slate-900 mb-1">Reschedule Visit</h3>
            <p className="text-slate-500 text-xs mb-4">Select preferred date &amp; arrival window</p>

            {rescheduleSuccess ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-1" />
                <p className="text-emerald-800 font-bold text-xs">Reschedule Request Sent!</p>
              </div>
            ) : (
              <form onSubmit={handleRescheduleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">New Visit Date</label>
                  <input
                    type="date"
                    value={rescheduleDate}
                    onChange={e => setRescheduleDate(e.target.value)}
                    required
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 bg-slate-50 outline-none focus:border-slate-800 focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Arrival Window</label>
                  <select
                    value={rescheduleWindow}
                    onChange={e => setRescheduleWindow(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 bg-slate-50 outline-none focus:border-slate-800 focus:bg-white transition-all"
                  >
                    <option value="09:00 AM - 11:00 AM">09:00 AM - 11:00 AM</option>
                    <option value="11:00 AM - 01:00 PM">11:00 AM - 01:00 PM</option>
                    <option value="01:00 PM - 03:00 PM">01:00 PM - 03:00 PM</option>
                    <option value="03:00 PM - 05:00 PM">03:00 PM - 05:00 PM</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full h-10 bg-[#071b4d] hover:bg-slate-900 text-white font-bold rounded-xl shadow flex items-center justify-center text-xs transition-all"
                >
                  Confirm New Schedule
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
