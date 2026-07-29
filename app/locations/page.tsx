"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLocation } from "@/context/LocationContext";
import { Search } from "lucide-react";
import Link from "next/link";

const US_STATES_COLUMNS = [
  // Column 1
  [
    { name: "Alabama", count: 12 },
    { name: "Arizona", count: 7 },
    { name: "Arkansas", count: 19 },
    { name: "California", count: 56 },
    { name: "Colorado", count: 9 },
    { name: "Connecticut", count: 6 },
    { name: "Delaware", count: 3 },
    { name: "Florida", count: 51 },
    { name: "Georgia", count: 20 },
    { name: "Hawaii", count: 6 },
    { name: "Idaho", count: 2 },
    { name: "Illinois", count: 24 },
  ],
  // Column 2
  [
    { name: "Indiana", count: 9 },
    { name: "Iowa", count: 3 },
    { name: "Kansas", count: 6 },
    { name: "Kentucky", count: 8 },
    { name: "Louisiana", count: 15 },
    { name: "Maine", count: 1 },
    { name: "Maryland", count: 15 },
    { name: "Massachusetts", count: 11 },
    { name: "Michigan", count: 14 },
    { name: "Minnesota", count: 6 },
    { name: "Mississippi", count: 13 },
    { name: "Missouri", count: 7 },
  ],
  // Column 3
  [
    { name: "Nebraska", count: 1 },
    { name: "Nevada", count: 3 },
    { name: "New Hampshire", count: 3 },
    { name: "New Jersey", count: 17 },
    { name: "New Mexico", count: 1 },
    { name: "New York", count: 18 },
    { name: "North Carolina", count: 51 },
    { name: "Ohio", count: 24 },
    { name: "Oklahoma", count: 8 },
    { name: "Oregon", count: 3 },
    { name: "Pennsylvania", count: 25 },
    { name: "Rhode Island", count: 2 },
  ],
  // Column 4
  [
    { name: "South Carolina", count: 34 },
    { name: "Tennessee", count: 16 },
    { name: "Texas", count: 55 },
    { name: "Utah", count: 3 },
    { name: "Virginia", count: 16 },
    { name: "Washington", count: 8 },
    { name: "West Virginia", count: 4 },
    { name: "Wisconsin", count: 9 },
    { name: "Wyoming", count: 1 },
  ],
];

export default function LocationsPage() {
  const { setZipCode, setIsAddressModalOpen } = useLocation();
  const [searchInput, setSearchInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setZipCode(searchInput.trim());
      setIsAddressModalOpen(true);
    }
  };

  const handleStateClick = (stateName: string) => {
    setIsAddressModalOpen(true);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setEmailInput("");
    }
  };

  return (
    <div className="site-shell site-v3 min-h-screen bg-white font-sans">
      <Header />

      <main className="w-full">
        {/* Terminix Top Light Header Section matching Screenshot */}
        <section className="bg-[#f4f6f8] py-12 sm:py-16 px-4 text-center border-b border-slate-200">
          <div className="max-w-4xl mx-auto space-y-3">
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight text-[#071b4d]">
              With 50+ PestIQ Branches,
            </h1>
            <p className="text-2xl sm:text-4xl font-extrabold text-[#071b4d] tracking-tight">
              we're always ready to help.
            </p>
            <div className="text-xs font-extrabold tracking-wider flex items-center justify-center gap-1.5 pt-4">
              <Link href="/" className="hover:underline text-[#1557b8] uppercase">HOME</Link>
              <span className="text-slate-400">/</span>
              <span className="text-[#071b4d] uppercase font-bold">ALL LOCATIONS</span>
            </div>
          </div>
        </section>

        {/* Terminix Dark Blue Search Bar Bar with Yellow Text */}
        <section className="bg-[#071b4d] py-4 sm:py-5 px-4 shadow-md">
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <label className="text-[#ffc400] font-extrabold text-xs sm:text-sm whitespace-nowrap tracking-wide">
                Search for a PestIQ exterminator near you
              </label>
              <div className="relative flex-1 w-full max-w-md">
                <input
                  type="text"
                  placeholder="enter zip code"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full h-10 sm:h-11 px-4 pr-10 rounded-full bg-white text-slate-900 text-xs sm:text-sm font-semibold outline-none focus:ring-2 focus:ring-[#ffc400] shadow-inner"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 w-8 sm:w-9 h-8 sm:h-9 bg-[#071b4d] hover:bg-[#1557b8] text-white rounded-full flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Search"
                >
                  <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* State Directory Section — 100% Resembling Terminix Clean 4-Column Layout */}
        <section className="bg-[#f4f6f8] py-12 sm:py-16 px-4 sm:px-6 border-b border-slate-200">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-3">
              {US_STATES_COLUMNS.map((column, colIdx) => (
                <div key={colIdx} className="space-y-3">
                  {column.map((st) => (
                    <button
                      key={st.name}
                      onClick={() => handleStateClick(st.name)}
                      className="text-left w-full text-xs sm:text-sm font-extrabold text-[#071b4d] hover:text-[#1557b8] hover:underline cursor-pointer block leading-snug transition-colors"
                    >
                      <span className="underline decoration-[#071b4d] group-hover:decoration-[#1557b8]">{st.name}</span>{" "}
                      <span className="text-slate-600 font-bold">({st.count})</span>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Terminix Newsletter Signup Bar */}
        <section className="bg-[#071b4d] text-white py-8 px-4 sm:px-8 border-t border-b border-white/10">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <span className="text-base sm:text-lg font-black text-white tracking-tight">
              Sign up for deals, updates and a free guide
            </span>

            <form onSubmit={handleSubscribe} className="flex items-center gap-2 w-full md:w-auto max-w-md">
              <input
                type="email"
                placeholder="Enter email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="flex-1 h-11 px-4 rounded-full bg-white text-slate-900 text-xs sm:text-sm font-semibold outline-none focus:ring-2 focus:ring-[#ffc400]"
              />
              <button
                type="submit"
                className="h-11 px-8 bg-[#8a939e] hover:bg-[#ffc400] hover:text-[#071b4d] text-white font-extrabold text-xs sm:text-sm rounded-full transition-colors whitespace-nowrap cursor-pointer"
              >
                {subscribed ? "Subscribed!" : "Submit"}
              </button>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
