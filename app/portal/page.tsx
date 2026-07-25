"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import { Calendar, Clock, AlertTriangle, FileText, DollarSign, CalendarCheck, CheckCircle2, X, Send, ShieldCheck, PhoneCall } from "lucide-react";

export default function CustomerPortal() {
  const [sightingModal, setSightingModal] = useState(false);
  const [rescheduleModal, setRescheduleModal] = useState(false);
  const [sightingType, setSightingType] = useState("Ants");
  const [sightingNotes, setSightingNotes] = useState("");
  const [sightingSuccess, setSightingSuccess] = useState(false);

  const [rescheduleDate, setRescheduleDate] = useState("2026-08-10");
  const [rescheduleWindow, setRescheduleWindow] = useState("09:00 AM – 11:00 AM");
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
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <div className="flex-grow flex w-full max-w-7xl mx-auto overflow-hidden">

        {/* Left Sidebar */}
        <aside className="w-64 bg-[#071b4d] text-white flex-shrink-0 hidden md:block border-r border-slate-800">
          <div className="p-6">
            <div className="font-black text-2xl tracking-wider mb-8 text-[#FACC15] flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-[#FACC15]" /> PEST<span className="text-white">IQ</span>
            </div>
            <nav className="space-y-2 text-sm font-medium">
              <Link href="/portal" className="block px-4 py-3 bg-[#133075] rounded-lg text-white border-l-4 border-[#FACC15] font-bold">
                Dashboard
              </Link>
              <a href="#subscriptions" className="block px-4 py-3 text-gray-300 hover:bg-[#133075] hover:text-white rounded-lg transition-colors">
                My Plan &amp; Coverage
              </a>
              <a href="#history" className="block px-4 py-3 text-gray-300 hover:bg-[#133075] hover:text-white rounded-lg transition-colors">
                Service History &amp; Reports
              </a>
              <button onClick={() => setRescheduleModal(true)} className="w-full text-left px-4 py-3 text-gray-300 hover:bg-[#133075] hover:text-white rounded-lg transition-colors">
                Request Reschedule
              </button>
              <button onClick={() => setSightingModal(true)} className="w-full text-left px-4 py-3 text-[#FACC15] hover:bg-[#133075] rounded-lg transition-colors font-bold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> Report Sighting
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-grow p-6 md:p-10 bg-slate-50">

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 border-b border-gray-200 pb-6 gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">
                <span>Customer Self-Service Portal</span>
              </div>
              <h1 className="text-3xl font-black text-slate-900 margin-0">Welcome back, John Smith!</h1>
              <p className="text-slate-500 text-sm mt-1">Manage your active protection plan, upcoming technician visits, and service history.</p>
            </div>
            <div>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-xs border border-emerald-300 shadow-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                COMPLETE PROTECTION — ACTIVE
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

            {/* Next Scheduled Service */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="border-b border-gray-100 px-6 py-4 bg-slate-50 flex justify-between items-center">
                <h2 className="font-extrabold text-[#071b4d] text-base">Next Scheduled Service Visit</h2>
                <span className="text-xs font-black text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">CONFIRMED</span>
              </div>
              <div className="p-6">
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="flex-grow">
                    <h3 className="text-xl font-black text-slate-900 mb-1">Routine Exterior Barrier &amp; Inspection</h3>
                    <p className="text-slate-500 text-sm mb-4">Assigned Lead Technician: <span className="font-bold text-slate-800">Dave Smith (Senior Specialist)</span></p>

                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 inline-block mb-4 w-full sm:w-auto">
                      <div className="flex items-center gap-3 text-[#071b4d] font-black text-base mb-2">
                        <Calendar className="w-5 h-5 text-[#1557b8]" /> Tuesday, August 5, 2026
                      </div>
                      <div className="flex items-center gap-3 text-slate-600 text-sm">
                        <Clock className="w-5 h-5 text-slate-400" /> Arrival Window: 09:00 AM – 11:00 AM (Eastern)
                      </div>
                    </div>
                  </div>

                  <div className="flex sm:flex-col gap-3 justify-center">
                    <button
                      onClick={() => setRescheduleModal(true)}
                      className="flex-1 sm:flex-none px-5 py-2.5 border border-slate-300 text-slate-700 font-bold rounded-lg hover:bg-slate-100 transition-colors text-sm"
                    >
                      Reschedule
                    </button>
                    <a
                      href="https://wa.me/?text=Hello%20PestIQ%2C%20confirming%20my%20service%20visit%20on%20Aug%205."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 sm:flex-none px-5 py-2.5 bg-[#16a34a] text-white font-bold rounded-lg hover:bg-green-700 transition-colors shadow text-sm text-center flex items-center justify-center gap-2"
                    >
                      Confirm Visit ✓
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Report Pest Activity CTA */}
            <div className="bg-[#071b4d] rounded-xl shadow-lg border border-slate-800 text-white p-6 flex flex-col justify-between text-left relative overflow-hidden">
              <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
                <AlertTriangle className="w-48 h-48 text-[#FACC15]" />
              </div>
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-[#FACC15] border border-amber-400/30 text-xs font-bold mb-3">
                  <AlertTriangle className="w-3.5 h-3.5" /> Priority Response Guaranteed
                </div>
                <h3 className="text-xl font-black mb-2 text-white">Noticed Pest Activity?</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Don't wait for your next routine visit. Under your Complete Protection Plan, emergency re-treatments are 100% free.
                </p>
              </div>

              <button
                onClick={() => setSightingModal(true)}
                className="w-full mt-6 py-3 bg-[#FACC15] hover:bg-yellow-400 text-[#071b4d] font-black rounded-lg transition-all shadow-md text-sm flex items-center justify-center gap-2"
              >
                Log Sighting for Priority Dispatch
              </button>
            </div>
          </div>

          {/* Subscription Overview */}
          <div id="subscriptions" className="mb-8">
            <h2 className="text-xl font-black text-slate-900 mb-4">Plan &amp; Coverage Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-[#1557b8] flex-shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Active Protection Plan</p>
                  <p className="font-black text-slate-900 text-base">Complete Protection Plan</p>
                  <p className="text-xs text-emerald-600 font-bold">100% Satisfaction Warranty</p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 flex-shrink-0">
                  <DollarSign className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Monthly Rate</p>
                  <p className="font-black text-slate-900 text-base">$69.00 / month</p>
                  <p className="text-xs text-slate-500">Auto-renews monthly</p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 flex-shrink-0">
                  <CalendarCheck className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Next Billing Cycle</p>
                  <p className="font-black text-slate-900 text-base">August 22, 2026</p>
                  <p className="text-xs text-slate-500">Receipt sent to email</p>
                </div>
              </div>
            </div>
          </div>

          {/* Service History Table */}
          <div id="history">
            <h2 className="text-xl font-black text-slate-900 mb-4">Service History &amp; Inspection Reports</h2>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-600 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 font-extrabold">Date</th>
                      <th className="px-6 py-4 font-extrabold">Service Type</th>
                      <th className="px-6 py-4 font-extrabold">Technician</th>
                      <th className="px-6 py-4 font-extrabold">Status</th>
                      <th className="px-6 py-4 font-extrabold">Inspection Report</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr className="hover:bg-slate-50">
                      <td className="px-6 py-4 text-slate-900 font-bold">May 10, 2026</td>
                      <td className="px-6 py-4 text-slate-800 font-semibold">Spring Barrier &amp; Ant Spray</td>
                      <td className="px-6 py-4 text-slate-600">Dave Smith</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" /> Completed
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        <button className="text-blue-600 font-bold hover:underline">View PDF Report</button>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="px-6 py-4 text-slate-900 font-bold">Feb 14, 2026</td>
                      <td className="px-6 py-4 text-slate-800 font-semibold">Winter Rodent Defense</td>
                      <td className="px-6 py-4 text-slate-600">Marcus Vance</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" /> Completed
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500">
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

      {/* Log Pest Sighting Modal */}
      {sightingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSightingModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 z-10">
            <button onClick={() => setSightingModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900">Log Pest Activity</h3>
                <p className="text-slate-500 text-xs">Priority dispatch for active plan subscribers</p>
              </div>
            </div>

            {sightingSuccess ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-2" />
                <h4 className="text-lg font-black text-emerald-900">Priority Request Logged!</h4>
                <p className="text-emerald-700 text-xs mt-1">A PestIQ dispatch coordinator has been notified and will call you within 30 minutes to confirm technician arrival.</p>
              </div>
            ) : (
              <form onSubmit={handleLogSighting} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Pest Type Observed</label>
                  <select
                    value={sightingType}
                    onChange={e => setSightingType(e.target.value)}
                    className="w-full h-11 px-3 rounded-lg border border-slate-300 text-sm font-semibold text-slate-900 bg-white"
                  >
                    <option value="Ants">Ants (Kitchen / Indoors)</option>
                    <option value="Rodents">Mice / Rodents</option>
                    <option value="Roaches">German Cockroaches</option>
                    <option value="BedBugs">Bed Bugs</option>
                    <option value="Wasps">Wasps / Hornets Exterior</option>
                    <option value="Other">Other Pest</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Location &amp; Additional Details</label>
                  <textarea
                    rows={3}
                    value={sightingNotes}
                    onChange={e => setSightingNotes(e.target.value)}
                    placeholder="e.g., Noticed small black ants along kitchen counter near sink..."
                    required
                    className="w-full p-3 rounded-lg border border-slate-300 text-sm text-slate-900 bg-white outline-none focus:border-blue-600"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full h-12 bg-[#071b4d] hover:bg-blue-900 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 text-sm"
                >
                  <Send className="w-4 h-4 text-[#FACC15]" /> Submit Priority Callback Request
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {rescheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setRescheduleModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 z-10">
            <button onClick={() => setRescheduleModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-black text-slate-900 mb-1">Reschedule Visit</h3>
            <p className="text-slate-500 text-xs mb-4">Select your preferred date &amp; arrival window</p>

            {rescheduleSuccess ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                <p className="text-emerald-800 font-bold text-sm">Reschedule Request Sent!</p>
              </div>
            ) : (
              <form onSubmit={handleRescheduleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">New Preferred Date</label>
                  <input
                    type="date"
                    value={rescheduleDate}
                    onChange={e => setRescheduleDate(e.target.value)}
                    required
                    className="w-full h-11 px-3 rounded-lg border border-slate-300 text-sm font-semibold text-slate-900 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Arrival Window</label>
                  <select
                    value={rescheduleWindow}
                    onChange={e => setRescheduleWindow(e.target.value)}
                    className="w-full h-11 px-3 rounded-lg border border-slate-300 text-sm font-semibold text-slate-900 bg-white"
                  >
                    <option value="09:00 AM – 11:00 AM">09:00 AM – 11:00 AM</option>
                    <option value="11:00 AM – 01:00 PM">11:00 AM – 01:00 PM</option>
                    <option value="01:00 PM – 03:00 PM">01:00 PM – 03:00 PM</option>
                    <option value="03:00 PM – 05:00 PM">03:00 PM – 05:00 PM</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full h-11 bg-[#1557b8] hover:bg-blue-700 text-white font-bold rounded-xl shadow flex items-center justify-center gap-2 text-sm"
                >
                  Confirm New Schedule
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
