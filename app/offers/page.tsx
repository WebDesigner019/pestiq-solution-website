"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLocation } from "@/context/LocationContext";
import { Clock, ChevronRight } from "lucide-react";

const OFFERS = [
  {
    id: "pest-control",
    badge: "DON'T MISS OUT",
    title: "Save $50 on pest control!",
    description: "Save $50 on your initial pest control service. Use code SAVE50 at checkout!¹",
    code: "SAVE50",
    image: "/images/pestiq-technician-home.jpg",
    alt: "PestIQ technician assisting homeowners",
  },
  {
    id: "termite-control",
    badge: "LIMITED TIME",
    title: "Save $100 on Termite Control",
    description: "Protect your home from silent wood destroyers. Save $100 on complete termite bait or liquid treatment plans!²",
    code: "TERMITE100",
    image: "/images/technician-indoor-inspection.jpg",
    alt: "PestIQ technician inspecting home interior",
  },
  {
    id: "mosquito-tick",
    badge: "SEASONAL SPECIAL",
    title: "Beat the Bite! Save $50 on Mosquito & Tick Control",
    description: "Enjoy your yard all season long without irritating bites. Save $50 on initial seasonal barrier service with code BITE50.³",
    code: "BITE50",
    image: "/images/mosquito-family-outdoor.jpg",
    alt: "Family enjoying a pest-free lawn",
  },
];

export default function OffersPage() {
  const { setIsAddressModalOpen } = useLocation();

  const scrollToSpecials = () => {
    document.getElementById("specials-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="site-shell site-v3 min-h-screen bg-white font-sans">
      <Header />
      <main className="w-full">

        {/* ═══════════════════════════════════════════════
            OFFERS HERO HEADER (Matching Terminix Screenshot 100%)
            Background photo + Breadcrumb + Bold Title + Yellow Pill Button
        ═══════════════════════════════════════════════ */}
        <section className="relative w-full h-[320px] sm:h-[380px] md:h-[420px] flex items-center overflow-hidden bg-[#071b4d]">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/hero-split-technician.jpg"
              alt="PestIQ technician with homeowners"
              fill
              className="object-cover object-center"
              priority
              sizes="100vw"
            />
            {/* Dark gradient overlay for crisp white text legibility */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/30" />
          </div>

          {/* Overlaid Content */}
          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 md:px-8 w-full flex flex-col justify-center">
            {/* Breadcrumb */}
            <nav className="text-white/80 text-xs sm:text-sm font-semibold mb-4 flex items-center gap-1.5">
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
              <span>/</span>
              <span className="text-white font-bold">Coupons and Discounts</span>
            </nav>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight drop-shadow-md max-w-3xl leading-[1.08]">
              PestIQ discounts, coupons,<br className="hidden sm:block" /> and promo codes
            </h1>

            {/* Yellow Pill Button */}
            <div>
              <button
                onClick={scrollToSpecials}
                className="bg-[#ffc400] hover:bg-[#e6af00] text-[#071b4d] font-extrabold text-xs sm:text-sm px-6 sm:px-7 py-3 rounded-full transition-all shadow-md inline-flex items-center gap-1"
              >
                View PestIQ coupons
              </button>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
            OFFERS CARDS SECTION (Matching Terminix layout 100%)
        ═══════════════════════════════════════════════ */}
        <section id="specials-section" className="max-w-5xl mx-auto pt-12 pb-16 px-4 sm:px-6">
          {/* Sub-heading with thin underline */}
          <div className="mb-10 border-b border-gray-200 pb-3">
            <h2 className="text-2xl sm:text-3xl font-black text-[#071b4d] tracking-tight">
              Pest control specials
            </h2>
          </div>

          <div className="space-y-10">
            {OFFERS.map((offer) => (
              <div
                key={offer.id}
                className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm bg-[#f4f5f7] flex flex-col md:flex-row relative"
              >
                {/* Top Navy Accent Bar */}
                <div className="absolute top-0 left-0 right-0 h-2.5 bg-[#071b4d] z-10" />

                {/* Left Side — Offer Text & Dotted Pattern */}
                <div
                  className="w-full md:w-3/5 p-8 sm:p-10 md:p-12 flex flex-col justify-center relative pt-10"
                  style={{
                    backgroundImage: "radial-gradient(#d1d5db 1.5px, transparent 1.5px)",
                    backgroundSize: "16px 16px",
                  }}
                >
                  <h3 className="text-2xl sm:text-3xl font-black text-[#071b4d] mb-4 leading-tight">
                    {offer.title}
                  </h3>
                  <p className="text-sm sm:text-base text-[#071b4d] font-medium leading-relaxed mb-8 max-w-lg">
                    {offer.description}
                  </p>
                  <div>
                    <button
                      onClick={() => setIsAddressModalOpen(true)}
                      className="bg-[#ffc400] hover:bg-[#e6af00] text-[#071b4d] font-black text-sm sm:text-base px-8 py-3 rounded-full transition-all shadow-sm inline-flex items-center gap-1.5"
                    >
                      Get started <ChevronRight className="w-4 h-4 stroke-[3]" />
                    </button>
                  </div>
                </div>

                {/* Right Side — Image & Green Pill Badge */}
                <div className="w-full md:w-2/5 min-h-[260px] md:min-h-[320px] relative overflow-hidden">
                  <Image
                    src={offer.image}
                    alt={offer.alt}
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 768px) 100vw, 40vw"
                  />
                  {/* Green Badge Overlay */}
                  <div className="absolute top-0 left-0 bg-[#17824b] text-white px-4 py-1.5 font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5 rounded-br-xl z-20 shadow-md">
                    <Clock className="w-3.5 h-3.5" /> {offer.badge}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
            INTRO COPY SECTION (Matching Terminix bottom text)
        ═══════════════════════════════════════════════ */}
        <section className="max-w-5xl mx-auto pb-12 px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-black text-[#071b4d] mb-6 tracking-tight">
            Get pest control deals with special offers from PestIQ
          </h2>

          <div className="w-full h-[1px] bg-gray-200 mb-8" />

          <div className="space-y-4 text-sm md:text-base text-gray-700 leading-relaxed max-w-4xl">
            <p>
              With PestIQ, you get proven pest control solutions backed by over 25 years of experience — plus great savings. Take advantage of a PestIQ discount to help treat common household pests like cockroaches, ants, spiders, and rodents.
            </p>
            <p>
              Whether you&apos;re searching for the latest PestIQ promo code or exploring available coupons, these offers help you save while protecting your home with expert service. When you work with us, our technicians will customize a treatment plan that meets the unique needs of your home. Leave your home in the hands of the industry-leading experts at PestIQ.
            </p>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
            EMAIL SIGNUP BAR (Matching Terminix bottom banner)
        ═══════════════════════════════════════════════ */}
        <section className="bg-[#071b4d] py-10 px-4">
          <form
            onSubmit={(e) => e.preventDefault()}
            className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6"
          >
            <p className="text-white font-black text-lg sm:text-xl text-center sm:text-left">
              Sign up for deals, updates and a free guide
            </p>
            <div className="flex gap-0 flex-shrink-0 w-full sm:w-auto justify-center">
              <input
                type="email"
                placeholder="Enter email"
                required
                className="h-11 px-4 text-sm outline-none w-56 sm:w-72 bg-white text-gray-900 rounded-l-md"
              />
              <button
                type="submit"
                className="bg-[#17824b] hover:bg-[#136b3d] text-white font-bold text-sm px-6 h-11 transition-colors rounded-r-md"
              >
                Submit
              </button>
            </div>
          </form>
        </section>

        {/* ═══════════════════════════════════════════════
            FOOTNOTES & TERMS (Matching Terminix bottom terms)
        ═══════════════════════════════════════════════ */}
        <section className="max-w-5xl mx-auto py-10 px-4 sm:px-6 text-xs text-gray-500 space-y-3 leading-relaxed">
          <p>
            ¹Service frequency will vary based on geography. PestFree365+ does not include the following pests: honey bees, flies, lice, dust mites, mosquitoes, exterior ticks, ornamental/turf pests, slugs, snails, termites, wildlife, birds, and brown recluse spiders. Voles and fire ants are only covered if they are in the home, we will not treat the lawn. Home must be free of bed bugs at the initial service to qualify for coverage of bed bugs under the PestFree365+ plan. Requires purchase of a new PestFree365+ agreement. Automatic Payment is required for PestFree365+. Treatment terms defined in your plan. Limitations apply. See plan for details. For qualifying homes only. Valid only at participating locations. Single-family dwelling units only.
          </p>
          <p>
            ²Participating locations and single-family dwelling units only. Cannot be combined with other discounts. Limitations apply. See Plan for details. Offer expires 8/31/26.
          </p>
          <p>
            ³Participating locations only. Requires purchase of a new Rodent &amp; Wildlife Exclusion Plan. Covered Pests defined in your Plan. Coverage generally includes commensal rodents (house mice, Norway rats, roof rats). Valid only at participating locations. Single-family dwelling units only.
          </p>
        </section>

      </main>
      <Footer />
    </div>
  );
}
