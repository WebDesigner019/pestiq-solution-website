"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Calendar,
  Clock,
  AlertTriangle,
  FileText,
  DollarSign,
  CheckCircle2,
  X,
  Send,
  ShieldCheck,
  Search,
  ChevronDown,
  ChevronUp,
  Download,
  User,
  LifeBuoy,
  CreditCard,
  History,
  PlusCircle,
  LogOut,
  Sparkles,
  ArrowRight,
  PhoneCall,
  Check
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
  const [activeTab, setActiveTab] = useState<"dashboard" | "tickets" | "plan" | "history">("dashboard");

  // Ticket Creation Form State
  const [requestType, setRequestType] = useState("Pest Sighting & Re-treatment");
  const [propertyArea, setPropertyArea] = useState("Kitchen & Dining");
  const [priorityLevel, setPriorityLevel] = useState("Standard Dispatch (24-48h)");
  const [preferredDate, setPreferredDate] = useState("2026-08-05");
  const [remarks, setRemarks] = useState("");
  const [ticketSubmitted, setTicketSubmitted] = useState(false);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Recent Tickets Data
  const [tickets, setTickets] = useState([
    {
      id: "SR#136354726",
      type: "Re-treatment Request",
      date: "20 Jan 2026",
      status: "In Progress",
      statusColor: "#8b5cf6",
      statusBg: "#f3e8ff",
      technician: "Dave Smith (Lead Tech)",
      details: "Ant activity reported along rear kitchen patio door.",
    },
    {
      id: "SR#136354745",
      type: "Routine Seasonal Visit",
      date: "25 Jan 2026",
      status: "Approved",
      statusColor: "#10b981",
      statusBg: "#dcfce7",
      technician: "Marcus Vance",
      details: "Exterior barrier application & perimeter inspection completed.",
    },
    {
      id: "SR#136354787",
      type: "Inspection & Audit",
      date: "23 Jan 2026",
      status: "Submitted",
      statusColor: "#2563eb",
      statusBg: "#dbeafe",
      technician: "Pending Assignment",
      details: "Annual termite station monitor check & report.",
    },
  ]);

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `SR#${Math.floor(100000000 + Math.random() * 900000000)}`;
    const newTicket = {
      id: newId,
      type: requestType,
      date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      status: "Submitted",
      statusColor: "#2563eb",
      statusBg: "#dbeafe",
      technician: "Dispatch Pending",
      details: remarks || `${requestType} in ${propertyArea}`,
    };

    setTickets([newTicket, ...tickets]);
    setTicketSubmitted(true);
    setTimeout(() => {
      setTicketSubmitted(false);
      setRemarks("");
    }, 3000);
  };

  const faqs = [
    {
      q: "How do free emergency re-treatments work?",
      a: "Under your active Complete Protection Plan, if pests return between scheduled quarterly visits, simply log a sighting ticket here. A certified PestIQ technician will be dispatched to re-treat your property at $0 additional cost.",
    },
    {
      q: "Can I reschedule my upcoming service visit?",
      a: "Yes. You can select your preferred arrival date and 2-hour arrival window directly from this portal or by submitting a schedule change ticket at least 24 hours prior.",
    },
    {
      q: "Where can I download my inspection reports and invoices?",
      a: "All completed service reports, chemical application logs, and digital receipts are automatically stored under the 'Service History & Reports' section.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex font-sans">

      {/* ══ LEFT SIDEBAR (TripSunnah / Modern Portal Style) ══ */}
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
              { id: "tickets", label: "Support & Tickets", icon: LifeBuoy },
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
                      ? "bg-[#2563eb] text-white shadow-md shadow-blue-500/20"
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
          {/* Mobile Logo / Search */}
          <div className="flex items-center gap-4 flex-1 max-w-md">
            <div className="md:hidden flex items-center gap-2">
              <PestIQLogo size={30} />
            </div>
            <div className="relative w-full max-w-sm hidden sm:block">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search ticket, technician, or report..."
                className="w-full h-9 pl-9 pr-4 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-blue-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Right Status Actions */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700">
              <CreditCard className="w-3.5 h-3.5 text-slate-400" />
              <span>Plan Rate: <strong className="text-slate-900">$69/mo</strong></span>
            </div>

            <div className="flex items-center gap-2 px-3.5 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full text-xs font-extrabold text-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Complete Protection Active
            </div>
          </div>
        </header>

        {/* MAIN BODY AREA */}
        <main className="p-6 md:p-8 max-w-6xl w-full mx-auto space-y-6">

          {/* PAGE HEADING */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Support Ticket &amp; Service Portal</h1>
              <p className="text-slate-500 text-xs mt-1">When customers have issues or need re-treatments, open support tickets below.</p>
            </div>
            <Link href="/" className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1">
              Back to main site →
            </Link>
          </div>

          {/* ══ SECTION 1: CREATE NEW TICKET CARD (Matching 4th Screenshot Style) ══ */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
            <div className="mb-6">
              <h2 className="text-lg font-black text-slate-900">Create New Service Ticket</h2>
              <p className="text-slate-500 text-xs mt-0.5">Fill out the information below, then click submit button for priority dispatch.</p>
            </div>

            {ticketSubmitted ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center animate-fadeIn">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                <h3 className="text-base font-black text-emerald-950">Ticket Submitted Successfully!</h3>
                <p className="text-emerald-700 text-xs mt-1">
                  Your ticket has been routed to lead technician Dave Smith. Dispatch confirmation details sent to your registered email.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitTicket} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Select Request Type */}
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">Select Request Type *</label>
                    <select
                      value={requestType}
                      onChange={(e) => setRequestType(e.target.value)}
                      className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 outline-none focus:border-blue-600 focus:bg-white"
                    >
                      <option value="Re-treatment Request">Re-treatment Request (Free)</option>
                      <option value="Pest Sighting Ticket">Pest Sighting Ticket</option>
                      <option value="Reschedule Visit">Reschedule Visit</option>
                      <option value="Billing & Account Request">Billing &amp; Account Request</option>
                    </select>
                  </div>

                  {/* Target Area */}
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">Target Area / Room</label>
                    <select
                      value={propertyArea}
                      onChange={(e) => setPropertyArea(e.target.value)}
                      className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 outline-none focus:border-blue-600 focus:bg-white"
                    >
                      <option value="Kitchen & Dining">Kitchen &amp; Dining</option>
                      <option value="Exterior Perimeter & Patio">Exterior Perimeter &amp; Patio</option>
                      <option value="Basement & Crawlspace">Basement &amp; Crawlspace</option>
                      <option value="Attic / Roofline">Attic / Roofline</option>
                      <option value="Whole Property">Whole Property</option>
                    </select>
                  </div>

                  {/* Passenger / Customer Name (from screenshot design) */}
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">Customer Name</label>
                    <input
                      type="text"
                      readOnly
                      value="John Smith"
                      className="w-full h-10 px-3 bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 cursor-not-allowed"
                    />
                  </div>

                  {/* Account / Ticket Reference Number */}
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">Account ID</label>
                    <input
                      type="text"
                      readOnly
                      value="ACC-8849201"
                      className="w-full h-10 px-3 bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Priority Level */}
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">Priority Dispatch</label>
                    <select
                      value={priorityLevel}
                      onChange={(e) => setPriorityLevel(e.target.value)}
                      className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 outline-none focus:border-blue-600 focus:bg-white"
                    >
                      <option value="Standard Dispatch (24-48h)">Standard Dispatch (24-48h)</option>
                      <option value="Urgent Same-Day (100% Free)">Urgent Same-Day (100% Free)</option>
                    </select>
                  </div>

                  {/* Preferred Date */}
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">Preferred Visit Date</label>
                    <input
                      type="date"
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 outline-none focus:border-blue-600 focus:bg-white"
                    />
                  </div>

                  {/* Remarks / Details (Spans 2 columns) */}
                  <div className="lg:col-span-2">
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">Remarks / Sighting Description</label>
                    <input
                      type="text"
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      placeholder="Write your notes here e.g. noticed ant trail near sink..."
                      className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 outline-none focus:border-blue-600 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#2563eb] hover:bg-blue-700 text-white font-bold rounded-lg text-xs shadow-md shadow-blue-500/20 transition-all flex items-center gap-2"
                  >
                    Submit Ticket
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* ══ SECTION 2: GRID SPLIT (LATEST SUPPORT HISTORY + FAQ) ══ */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* LEFT 2 COLUMNS: LATEST SUPPORT HISTORY */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-black text-slate-900">Latest Support History</h3>
                    <p className="text-slate-500 text-xs">Here is your most recent service history</p>
                  </div>
                  <button className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 border border-slate-200 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-white transition-all">
                    <Download className="w-3.5 h-3.5" /> Export
                  </button>
                </div>

                {/* History List Table */}
                <div className="space-y-3">
                  {tickets.map((t) => (
                    <div key={t.id} className="p-4 bg-slate-50/70 border border-slate-200/80 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-300 transition-all">
                      <div>
                        <div className="flex items-center gap-2.5">
                          <span className="font-extrabold text-xs text-slate-900">{t.id}</span>
                          <span className="text-xs font-semibold text-slate-700">• {t.type}</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">{t.details}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">Technician: {t.technician}</p>
                      </div>

                      <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-1">
                        <span className="text-[11px] text-slate-400 font-semibold">{t.date}</span>
                        <span
                          className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold"
                          style={{ color: t.statusColor, backgroundColor: t.statusBg }}
                        >
                          {t.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT 1 COLUMN: FREQUENTLY ASKED QUESTIONS */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h3 className="text-base font-black text-slate-900 mb-4">Frequently Asked Questions</h3>

              <div className="space-y-3">
                {faqs.map((faq, idx) => {
                  const isOpen = openFaq === idx;
                  return (
                    <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden">
                      <button
                        onClick={() => setOpenFaq(isOpen ? null : idx)}
                        className="w-full p-3.5 text-left font-bold text-xs text-slate-900 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors"
                      >
                        <span>{faq.q}</span>
                        {isOpen ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                      </button>
                      {isOpen && (
                        <div className="p-3.5 bg-white text-xs text-slate-600 border-t border-slate-100 leading-relaxed">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 p-4 bg-blue-50/60 border border-blue-100 rounded-xl text-center">
                <p className="text-xs font-extrabold text-[#071b4d]">Need urgent phone support?</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Call our dedicated Ocean County dispatch line</p>
                <a
                  href="tel:18005557378"
                  className="mt-2 inline-flex items-center gap-1.5 text-xs font-black text-blue-700 hover:underline"
                >
                  <PhoneCall className="w-3.5 h-3.5" /> +1 (800) 555-PEST
                </a>
              </div>
            </div>

          </div>

        </main>
      </div>

    </div>
  );
}
