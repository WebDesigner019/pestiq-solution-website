"use client";

import React from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLocation } from "@/context/LocationContext";
import { Building2, Shield, Phone, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

const INDUSTRIES = [
  "Food Service & Restaurants",
  "Hotels & Hospitality",
  "Healthcare & Hospitals",
  "Warehousing & Logistics",
  "Property Management",
  "Retail & Shopping Malls",
  "Educational Facilities",
  "Office Buildings",
];

export default function CommercialPage() {
  const { setIsAddressModalOpen } = useLocation();

  return (
    <div className="site-shell site-v3 min-h-screen bg-slate-50">
      <Header />
      <main className="w-full">
        <section className="bg-[#071b4d] text-white py-16 sm:py-24 px-4 text-center">
          <div className="max-w-4xl mx-auto space-y-4">
            <span className="text-[#ffc400] text-xs sm:text-sm font-black tracking-widest uppercase">
              COMMERCIAL PEST MANAGEMENT
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Enterprise &amp; Commercial Pest Control Solutions
            </h1>
            <p className="text-slate-300 text-sm sm:text-lg max-w-2xl mx-auto font-medium">
              Zero-tolerance pest prevention for businesses, food manufacturing, healthcare, and commercial property managers.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => setIsAddressModalOpen(true)}
                className="bg-[#ffc400] hover:bg-[#e6af00] text-[#071b4d] font-extrabold text-sm px-8 py-3.5 rounded-full shadow-md transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                Request Commercial Audit <ArrowRight className="w-4 h-4" />
              </button>
              <a
                href="tel:2125550148"
                className="border border-white/30 hover:bg-white/10 text-white font-extrabold text-sm px-8 py-3.5 rounded-full transition-all inline-flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4 text-[#ffc400]" /> Call Dedicated Business Desk
              </a>
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto py-16 px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-4xl font-black text-[#071b4d]">Industries We Protect</h2>
            <p className="text-slate-600 text-sm font-medium mt-1">Tailored audit-ready documentation and IPM compliance programs.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {INDUSTRIES.map((ind) => (
              <div key={ind} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm font-bold text-sm text-[#071b4d] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#17824b] flex-shrink-0" />
                <span>{ind}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
