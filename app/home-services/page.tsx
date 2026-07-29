"use client";

import React from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLocation } from "@/context/LocationContext";
import { Home, ShieldCheck, Wrench, Droplet, Sun, ArrowRight, Phone } from "lucide-react";
import Link from "next/link";

export default function HomeServicesPage() {
  const { setIsAddressModalOpen } = useLocation();

  return (
    <div className="site-shell site-v3 min-h-screen bg-slate-50">
      <Header />
      <main className="w-full">
        {/* Hero Section */}
        <section className="bg-[#071b4d] text-white py-16 sm:py-24 px-4 text-center">
          <div className="max-w-4xl mx-auto space-y-4">
            <span className="text-[#ffc400] text-xs sm:text-sm font-black tracking-widest uppercase">
              SPECIALIZED HOME PROTECTION
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              PestIQ Home Services &amp; Property Shielding
            </h1>
            <p className="text-slate-300 text-sm sm:text-lg max-w-2xl mx-auto font-medium">
              Complete crawl space encapsulation, TAP thermal insulation, moisture control, and wildlife exclusion.
            </p>
            <div className="pt-4">
              <button
                onClick={() => setIsAddressModalOpen(true)}
                className="bg-[#ffc400] hover:bg-[#e6af00] text-[#071b4d] font-extrabold text-sm px-8 py-3.5 rounded-full shadow-md transition-all inline-flex items-center gap-2 cursor-pointer"
              >
                Schedule Free Home Inspection <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="max-w-6xl mx-auto py-16 px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#1557b8] flex items-center justify-center mb-6">
                  <Droplet className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black text-[#071b4d] mb-2">Moisture &amp; Vapor Barrier</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6 font-medium">
                  High-humidity crawl spaces attract termites, carpenter ants, and mold. Our vapor barriers keep your crawl space dry and pest-free.
                </p>
              </div>
              <button onClick={() => setIsAddressModalOpen(true)} className="text-[#1557b8] font-bold text-sm flex items-center gap-1 hover:underline">
                Get Inspection Quote ›
              </button>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-green-50 text-[#17824b] flex items-center justify-center mb-6">
                  <Sun className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black text-[#071b4d] mb-2">TAP® Pest Control Insulation</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6 font-medium">
                  Blown-in thermal insulation infused with EPA-registered pest control compounds to prevent attic infestations and save on energy bills.
                </p>
              </div>
              <button onClick={() => setIsAddressModalOpen(true)} className="text-[#1557b8] font-bold text-sm flex items-center gap-1 hover:underline">
                Learn About TAP Insulation ›
              </button>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-6">
                  <Wrench className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black text-[#071b4d] mb-2">Wildlife Exclusion &amp; Seal</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6 font-medium">
                  We seal foundation cracks, roof gaps, and vent openings to permanently prevent squirrels, raccoons, bats, and mice from entering.
                </p>
              </div>
              <button onClick={() => setIsAddressModalOpen(true)} className="text-[#1557b8] font-bold text-sm flex items-center gap-1 hover:underline">
                Schedule Exclusion Service ›
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
