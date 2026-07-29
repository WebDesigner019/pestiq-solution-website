"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLocation } from "@/context/LocationContext";
import { Search, Bug, Shield, MapPin, Phone, Home, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  const { setZipCode, setIsAddressModalOpen } = useLocation();
  const [searchInput, setSearchInput] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setZipCode(searchInput.trim());
      setIsAddressModalOpen(true);
    }
  };

  return (
    <div className="site-shell site-v3 min-h-screen bg-slate-50">
      <Header />

      <main className="w-full">
        {/* Terminix-style Top Hero Banner matching Screenshot 4 */}
        <section className="bg-[#071b4d] text-white py-16 sm:py-20 px-4 text-center">
          <div className="max-w-4xl mx-auto space-y-4">
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              With 50+ PestIQ Branches, we're always ready to help.
            </h1>
            <p className="text-[#ffc400] text-sm sm:text-base font-extrabold tracking-widest uppercase">
              HOME / ALL LOCATIONS / SEARCH
            </p>
          </div>
        </section>

        {/* Terminix-style Dark Blue Bar with Search Input */}
        <section className="bg-[#0a2540] py-6 px-4 border-t border-b border-white/10 shadow-lg">
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-3">
              <label className="text-white font-extrabold text-sm whitespace-nowrap">
                Search for a PestIQ exterminator near you:
              </label>
              <div className="relative flex-1 w-full">
                <input
                  type="text"
                  placeholder="enter zip code"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full h-11 px-4 pr-12 rounded-full bg-white text-slate-900 text-sm font-semibold outline-none focus:ring-2 focus:ring-[#ffc400]"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 w-9 h-9 bg-[#071b4d] hover:bg-[#1557b8] text-white rounded-full flex items-center justify-center transition-colors"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* Clear "No Results Found" Title matching Screenshot 4 */}
        <section className="bg-white py-12 px-4 border-b border-slate-200">
          <div className="max-w-4xl mx-auto text-center space-y-3">
            <h2 className="text-3xl sm:text-4xl font-black text-[#071b4d]">No Results Found</h2>
            <p className="text-slate-600 text-base font-medium max-w-xl mx-auto">
              We couldn't find the exact page or resource you requested, but we can help you find what you need right away.
            </p>
          </div>
        </section>

        {/* Smart Keyword Suggestions & Direct Service Shortcuts */}
        <section className="max-w-5xl mx-auto py-12 px-4 sm:px-6">
          <div className="text-center mb-8">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">
              RECOMMENDED PAGES &amp; SERVICES
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-[#071b4d]">Looking for one of these services?</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            <Link
              href="/pests/general"
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-[#1557b8] transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1557b8] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Bug className="w-5 h-5" />
                </div>
                <h4 className="font-extrabold text-base text-[#071b4d] mb-1">Pest Control Services</h4>
                <p className="text-xs text-slate-600 font-medium">Ants, Cockroaches, Spiders, Fleas &amp; Household Pests.</p>
              </div>
              <span className="text-xs font-extrabold text-[#1557b8] mt-4 flex items-center gap-1">
                Explore Services <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>

            <Link
              href="/pests/termites"
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-[#1557b8] transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Shield className="w-5 h-5" />
                </div>
                <h4 className="font-extrabold text-base text-[#071b4d] mb-1">Termite Protection</h4>
                <p className="text-xs text-slate-600 font-medium">Subterranean &amp; Drywood termite inspections and baiting.</p>
              </div>
              <span className="text-xs font-extrabold text-[#1557b8] mt-4 flex items-center gap-1">
                View Protection <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>

            <Link
              href="/plans"
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-[#1557b8] transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-green-50 text-[#17824b] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Shield className="w-5 h-5" />
                </div>
                <h4 className="font-extrabold text-base text-[#071b4d] mb-1">PestFree365+ Plans</h4>
                <p className="text-xs text-slate-600 font-medium">Year-round protection covering 39+ common pests with guarantee.</p>
              </div>
              <span className="text-xs font-extrabold text-[#1557b8] mt-4 flex items-center gap-1">
                See Plans &amp; Pricing <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>

            <Link
              href="/locations"
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-[#1557b8] transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#e9f1fb] text-[#1557b8] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <MapPin className="w-5 h-5" />
                </div>
                <h4 className="font-extrabold text-base text-[#071b4d] mb-1">Local Branch Locator</h4>
                <p className="text-xs text-slate-600 font-medium">Find licensed PestIQ exterminators and offices near you.</p>
              </div>
              <span className="text-xs font-extrabold text-[#1557b8] mt-4 flex items-center gap-1">
                Find Local Branch <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>

            <a
              href="tel:2125550148"
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-[#1557b8] transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-yellow-50 text-[#071b4d] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Phone className="w-5 h-5" />
                </div>
                <h4 className="font-extrabold text-base text-[#071b4d] mb-1">24/7 Phone Support</h4>
                <p className="text-xs text-slate-600 font-medium">Speak directly with a pest expert at (212) 555-0148.</p>
              </div>
              <span className="text-xs font-extrabold text-[#1557b8] mt-4 flex items-center gap-1">
                Call Now <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </a>

            <Link
              href="/"
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-[#1557b8] transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Home className="w-5 h-5" />
                </div>
                <h4 className="font-extrabold text-base text-[#071b4d] mb-1">Homepage</h4>
                <p className="text-xs text-slate-600 font-medium">Return to the PestIQ main homepage.</p>
              </div>
              <span className="text-xs font-extrabold text-[#1557b8] mt-4 flex items-center gap-1">
                Back to Home <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center bg-[#ffc400] hover:bg-[#e6af00] text-[#071b4d] font-extrabold px-8 py-3.5 rounded-full shadow-md text-sm transition-colors"
            >
              Return to Homepage
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
