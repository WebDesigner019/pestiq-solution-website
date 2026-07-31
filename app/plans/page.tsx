"use client";

import React from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLocation } from "@/context/LocationContext";

export default function PlansPage() {
  const { priceTier, serviceArea, zipCode, setIsAddressModalOpen } = useLocation();

  // Prices are automatically set based on the user's location tier
  const getPrices = () => {
    if (priceTier === "newjersey") {
      return { essential: 45, complete: 55, onetime: 229 };
    } else if (priceTier === "westchester") {
      return { essential: 49, complete: 59, onetime: 249 };
    } else if (priceTier === "longisland") {
      return { essential: 59, complete: 69, onetime: 269 };
    } else if (priceTier === "ct") {
      return { essential: 55, complete: 65, onetime: 259 };
    }
    // Default (NYC, other)
    return { essential: 59, complete: 69, onetime: 279 };
  };

  const prices = getPrices();

  const handleCta = (e: React.MouseEvent) => {
    if (!zipCode) {
      e.preventDefault();
      setIsAddressModalOpen(true);
    }
  };

  return (
    <div className="site-shell site-v3">
      <Header />
      <main>
        {/* Address Alert Bar */}
        {!zipCode && (
          <div className="w-full bg-[#fdfaf2] border-b border-[#f3ebcf] py-3.5 px-4 sm:px-8">
            <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-[13.5px]">
              <div className="flex items-center gap-2 text-amber-800 font-semibold">
                <span className="text-[16px] -mt-0.5">⚠️</span>
                <span>To see localized pricing, please verify your service address first.</span>
              </div>
              <button
                onClick={() => setIsAddressModalOpen(true)}
                className="px-4 py-1.5 bg-[#17824b] hover:bg-[#155f2e] text-white rounded font-bold text-[12.5px] transition-all whitespace-nowrap"
              >
                Verify Address →
              </button>
            </div>
          </div>
        )}

        {/* PLANS PAGE HEADER */}
        <section className="plans-page-header">
          <div className="v3-content">
            <p>PestIQ Solutions plans</p>
            <h1>Straightforward protection for your property.</h1>
            <div className="flex flex-col items-center gap-4 mt-2">
              {zipCode ? (
                <div className="flex items-center gap-2 bg-[#e8f5ed] border border-[#17824b]/20 px-5 py-2.5 rounded-2xl shadow-sm">
                  <span className="text-sm font-semibold text-[#17824b] flex items-center gap-1.5">
                    📍 Local pricing for: <strong>{serviceArea}</strong>
                  </span>
                  <button
                    onClick={() => setIsAddressModalOpen(true)}
                    className="text-[11px] font-bold text-[#0066cc] hover:underline ml-2"
                  >
                    Change
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsAddressModalOpen(true)}
                  className="bg-[#0066cc] hover:bg-[#0052a3] text-white font-bold px-6 py-2.5 rounded-full text-xs uppercase tracking-wider shadow-sm transition-all"
                >
                  📍 Enter address to see local pricing →
                </button>
              )}
            </div>
          </div>
        </section>

        {/* COMPARISON CARDS */}
        <section className="v3-section comparison-section">
          <div className="v3-content">
            <div className="comparison-grid">
              {/* ESSENTIAL CARD */}
              <article className="comparison-card">
                <span className="comparison-rank">Better protection</span>
                <h2>Essential Protection</h2>
                <ul>
                  <li>
                    <span>✓</span>Interior and exterior assessment
                  </li>
                  <li>
                    <span>✓</span>Common household pest coverage
                  </li>
                  <li>
                    <span>✓</span>Scheduled service visits
                  </li>
                  <li>
                    <span>✓</span>Written service notes
                  </li>
                  <li>
                    <span>✓</span>Targeted baiting and barriers
                  </li>
                </ul>
                <div className="comparison-price">
                  <strong>${prices.essential}</strong>
                  <small>/ month</small>
                </div>
                <Link href="/book?plan=monthly" onClick={handleCta} className="w-full">
                  Check availability
                </Link>
              </article>

              {/* COMPLETE CARD */}
              <article className="comparison-card selected">
                <div className="comparison-best">★ Most complete</div>
                <span className="comparison-rank">Best protection</span>
                <h2>Complete Protection</h2>
                <ul>
                  <li>
                    <span>✓</span>Interior and exterior assessment
                  </li>
                  <li>
                    <span>✓</span>Expanded pest coverage
                  </li>
                  <li>
                    <span>✓</span>Scheduled service visits
                  </li>
                  <li>
                    <span>✓</span>Priority follow-up pathway
                  </li>
                  <li>
                    <span>✓</span>Exterior perimeter protection
                  </li>
                  <li>
                    <span>✓</span>Worry-free service guarantee
                  </li>
                </ul>
                <div className="comparison-price">
                  <strong>${prices.complete}</strong>
                  <small>/ month</small>
                </div>
                <Link href="/book?plan=monthly" onClick={handleCta} className="w-full">
                  Check local price
                </Link>
              </article>

              {/* ONE-TIME CARD */}
              <article className="comparison-card">
                <span className="comparison-rank">Single concern</span>
                <h2>One-Time Service</h2>
                <ul>
                  <li>
                    <span>✓</span>Issue-focused inspection
                  </li>
                  <li>
                    <span>✓</span>One agreed treatment scope
                  </li>
                  <li>
                    <span>✓</span>Property recommendations
                  </li>
                  <li>
                    <span>✓</span>No monthly commitment
                  </li>
                  <li>
                    <span>✓</span>30-day follow-up window
                  </li>
                </ul>
                <div className="comparison-price">
                  <strong>${prices.onetime}</strong>
                  <small>starting price</small>
                </div>
                <Link href="/book?plan=one-time" onClick={handleCta} className="w-full">
                  Request a visit
                </Link>
              </article>
            </div>

          </div>
        </section>

        {/* COMPARISON TABLE */}
        <section className="v3-section comparison-table-section">
          <div className="v3-content overflow-x-auto">
            <h2>Compare plan features.</h2>
            <div className="comparison-table min-w-[600px]">
              <div className="table-row head">
                <strong>Feature</strong>
                <span>Essential</span>
                <span>Complete</span>
                <span>One-Time</span>
              </div>
              <div className="table-row">
                <strong>Targeted pests</strong>
                <span>Common</span>
                <span>All standard</span>
                <span>Single issue</span>
              </div>
              <div className="table-row">
                <strong>Visits</strong>
                <span>Scheduled</span>
                <span>Priority</span>
                <span>Single visit</span>
              </div>
              <div className="table-row">
                <strong>Service notes</strong>
                <span>Written</span>
                <span>Written</span>
                <span>Summary report</span>
              </div>
              <div className="table-row">
                <strong>Assurance</strong>
                <span>Service guarantee</span>
                <span>Priority pathway</span>
                <span>30-day window</span>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
