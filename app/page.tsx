"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLocation } from "@/context/LocationContext";
import {
  Bug, BedDouble, BugOff, Rat,
  Shield, ChevronRight, ChevronLeft, ChevronDown, Star, Clock
} from "lucide-react";

// ─── Pest Library ─────────────────────────────────────────────────────────────
const pestLibrary = [
  {
    name: "Ants",
    icon: <Bug className="w-5 h-5" />,
    image: "/images/ant-macro.jpg",
    description: "Ants are common insects that can be found in most parts of the world. While there are many different species of ants, all ants have a few defining characteristics. They have bodies with three sections: a head, an abdomen and a thorax. In addition, all ants have six legs and bent antennae.",
    tagline: "If ants come marching in, we'll help send them packing.",
    link: "/pests/ants",
  },
  {
    name: "Bed Bugs",
    icon: <BedDouble className="w-5 h-5" />,
    image: "/images/bed-bug-mattress.png",
    description: "Bed bugs are small, reddish-brown parasitic insects that feed on blood of humans and animals. They are expert hiders and can live in mattresses, box springs, bed frames, and other furniture. Early detection is critical to preventing a widespread infestation.",
    tagline: "Don't let bed bugs bite. We'll get them out tonight.",
    link: "/pests/bed-bugs",
  },
  {
    name: "Centipedes",
    icon: <BugOff className="w-5 h-5" />,
    image: "/images/spider-web.png",
    description: "House centipedes are fast-moving insects with many legs that thrive in damp environments. While not directly dangerous, their presence often signals excess moisture or a prey insect problem. We identify the root cause and treat accordingly.",
    tagline: "Too many legs under your roof? We'll show them the door.",
    link: "/pests/centipedes-millipedes",
  },
  {
    name: "Cockroaches",
    icon: <Bug className="w-5 h-5" />,
    image: "/images/cockroach.jpg",
    description: "Cockroaches are among the most common household pests. They contaminate food, spread bacteria, and can trigger allergic reactions. German and American cockroaches are the most prevalent in the Northeast. We target harborage areas, egg cases, and entry points.",
    tagline: "Cockroaches don't stand a chance against our proven treatments.",
    link: "/pests/cockroaches",
  },
  {
    name: "Mice & Rats",
    icon: <Rat className="w-5 h-5" />,
    image: "/images/rodent-mouse.png",
    description: "Rodents can cause significant structural damage and carry serious diseases. They gnaw through wiring, insulation, and walls. We perform exclusion assessments, strategic baiting programs, and entry-point sealing to eliminate rodents and prevent re-entry.",
    tagline: "Mice and rats don't belong in your home. We'll evict them.",
    link: "/pests/rodents",
  },
  {
    name: "Mosquitoes",
    icon: <Bug className="w-5 h-5" />,
    image: "/images/mosquito-macro.png",
    description: "Mosquitoes breed in standing water and are active from spring through fall. They carry West Nile Virus, Eastern Equine Encephalitis, and other diseases. Our barrier treatments and breeding-site elimination dramatically reduce mosquito populations.",
    tagline: "Reclaim your backyard from mosquitoes this season.",
    link: "/pests/mosquitoes",
  },
  {
    name: "Spiders",
    icon: <BugOff className="w-5 h-5" />,
    image: "/images/spider-web.png",
    description: "Most house spiders are harmless but their webs and presence are unwelcome. Spiders are drawn to homes with active insect populations. We reduce their food source with comprehensive pest management and treat harboring areas directly.",
    tagline: "Webs in the corner? We'll clear them out for good.",
    link: "/pests/spiders",
  },
  {
    name: "Termites",
    icon: <BugOff className="w-5 h-5" />,
    image: "/images/ant-macro.jpg",
    description: "Termites silently destroy wood framing, flooring, and support structures — often for years before detection. A single colony can consume a pound of wood per day. We offer advanced baiting systems, liquid treatments, and annual monitoring.",
    tagline: "Protect your biggest investment from silent destroyers.",
    link: "/pests/termites",
  },
  {
    name: "Ticks",
    icon: <Bug className="w-5 h-5" />,
    image: "/images/mosquito-macro.png",
    description: "Ticks carry Lyme disease, anaplasmosis, and other serious illnesses. They lurk in tall grass and wooded areas, attaching to pets and people. Our yard barrier treatment creates a protective zone, dramatically reducing tick populations around your property.",
    tagline: "Stop ticks before they reach your family and pets.",
    link: "/pests/ticks",
  },
  {
    name: "Wildlife",
    icon: <Rat className="w-5 h-5" />,
    image: "/images/suburban-houses.png",
    description: "Raccoons, squirrels, and opossums can cause structural damage and carry parasites. Our trained wildlife specialists use humane trapping, exclusion, and one-way door systems to safely remove animals and prevent their return.",
    tagline: "Humane wildlife removal that gets the job done right.",
    link: "/pests/wildlife",
  },
];

// ─── Reviews ──────────────────────────────────────────────────────────────────
const reviews = [
  {
    name: "Carol Swann",
    initial: "C",
    location: "Lakewood, NJ",
    text: "Having an account with PestIQ on a quarterly basis gives me peace of mind. They are professional, knowledgeable and kind from beginning to end. Thank you for a great job!",
    ago: "2 Months Ago",
  },
  {
    name: "Armando Jimenez",
    initial: "A",
    location: "Yonkers, NY",
    text: "From my initial interaction with the specialist over the phone, the Residential Inspector and the Field Professional — this was such a pleasant experience. Each of them were helpful, honest, genuine, and answered all my questions. Highly recommend!",
    ago: "3 Months Ago",
  },
  {
    name: "Bonnie Chen",
    initial: "B",
    location: "New Rochelle, NY",
    text: "I have a monthly technician in place, and I feel completely at ease in my home. Highly recommend!",
    ago: "5 Months Ago",
  },
  {
    name: "Marcus Williams",
    initial: "M",
    location: "Ocean County, NJ",
    text: "Quick response, no-nonsense approach. Tech explained everything he was doing and why. Will definitely stick with PestIQ long-term.",
    ago: "1 Month Ago",
  },
  {
    name: "Sarah Park",
    initial: "S",
    location: "White Plains, NY",
    text: "After two failed attempts with other companies, PestIQ finally solved our roach problem. Three months in and not a single sighting.",
    ago: "4 Months Ago",
  },
];

export default function HomePage() {
  const { setIsAddressModalOpen, setOnAddressSubmitRedirect } = useLocation();
  const [activeTab, setActiveTab] = useState("Ants");
  const [reviewIndex, setReviewIndex] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const currentPest = pestLibrary.find(p => p.name === activeTab) || pestLibrary[0];

  const visibleReviews = [
    reviews[reviewIndex % reviews.length],
    reviews[(reviewIndex + 1) % reviews.length],
    reviews[(reviewIndex + 2) % reviews.length],
  ];

  const faqs = [
    {
      q: "How much does PestIQ cost?",
      a: "Costs depend on your location, property size, and pest type. All initial inspections are completely free — our technician will assess your property and provide a personalised plan with transparent pricing before any treatment begins.",
    },
    {
      q: "What services does PestIQ provide?",
      a: "We offer comprehensive protection against ants, cockroaches, rodents, spiders, mosquitoes, ticks, bed bugs, termites, and wildlife across New York City, Westchester County, and Ocean County NJ.",
    },
    {
      q: "How do I pay my PestIQ bill?",
      a: "You can manage billing, view treatment history, and update your account through the secure Customer Portal after signup. We accept all major credit cards.",
    },
    {
      q: "Is service guaranteed?",
      a: "Yes. If pests return between scheduled treatments, we return to re-treat at no additional cost. This is our PestIQ It Guarantee — backed by every plan we offer.",
    },
    {
      q: "How do I schedule my first visit?",
      a: "Simply click 'Get started', enter your address, and we'll confirm your service area and book a time that works for you — often same week.",
    },
    {
      q: "Are your products safe for pets?",
      a: "All products we use are EPA-registered and applied according to strict safety protocols. We always follow label directions and advise on any specific precautions for pets or children.",
    },
    {
      q: "Do you offer commercial pest control?",
      a: "Yes. PestIQ serves restaurants, retail spaces, multi-family properties, and offices. Contact us for a customised commercial programme.",
    },
  ];

  return (
    <div className="site-shell site-v3 font-sans">
      <Header />
      <main className="w-full">

        {/* ═══════════════════════════════════════════════
            SECTION 1 — HERO
            Background photo + dark gradient overlay + offer card
        ═══════════════════════════════════════════════ */}
        <section className="relative w-full min-h-[540px] md:h-[620px] py-10 md:py-0 flex items-center bg-[#f4f3f0] overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/pestiq-technician-home.jpg"
              alt="PestIQ Pest Control Technician"
              fill
              className="object-cover object-center"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 md:via-black/40 to-black/30 md:to-transparent" />
          </div>

          {/* Diagonal dark shape — right edge */}
          <div
            className="absolute top-0 right-0 bottom-0 w-[20%] bg-[#0a2540] z-0 hidden lg:block"
            style={{ clipPath: "polygon(40% 0, 100% 0, 100% 100%, 0% 100%)" }}
          />

          {/* Content */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 w-full flex flex-col md:flex-row justify-between items-center gap-6 sm:gap-8">
            {/* Left — headline + service pills */}
            <div className="text-white w-full md:w-[55%]">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-2 sm:mb-4 tracking-tight drop-shadow-md">
                PestIQ<sup className="text-base sm:text-lg md:text-xl lg:text-2xl top-[-0.5em]">®</sup> Pest Control
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-8 drop-shadow-md text-gray-200">
                Protecting what matters most
              </p>

              {/* Service quick-links — 2×2 pill grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3.5 mb-4 sm:mb-6 w-full max-w-[520px]">
                <Link href="/pests/ants" className="bg-white hover:bg-gray-100 rounded-full px-4 sm:px-5 py-2.5 sm:py-3 transition-colors flex items-center gap-2 shadow-md">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" viewBox="0 0 24 24" fill="#071b4d">
                    <path d="M12 2c-1.1 0-2 .9-2 2 0 .74.4 1.38 1 1.73V7H9V5.5C9 4.12 7.88 3 6.5 3S4 4.12 4 5.5v1C4 7.33 4.67 8 5.5 8H7v1.26C5.83 9.7 5 11 5 12.5c0 1.68.91 3.14 2.25 3.93L7 20h1v-3h8v3h1l-.25-3.57A4.5 4.5 0 0 0 19 12.5c0-1.5-.83-2.8-2-3.24V8h1.5c.83 0 1.5-.67 1.5-1.5v-1C20 4.12 18.88 3 17.5 3S15 4.12 15 5.5V7h-2V5.73c.6-.35 1-.99 1-1.73 0-1.1-.9-2-2-2z"/>
                  </svg>
                  <span className="font-extrabold text-slate-900 text-xs sm:text-sm tracking-wide truncate">Pest Control ›</span>
                </Link>
                <Link href="/pests/termites" className="bg-white hover:bg-gray-100 rounded-full px-4 sm:px-5 py-2.5 sm:py-3 transition-colors flex items-center gap-2 shadow-md">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" viewBox="0 0 24 24" fill="#071b4d">
                    <path d="M12 3C9.24 3 7 5.24 7 8v1H6c-.55 0-1 .45-1 1v1c0 .55.45 1 1 1h.06l.92 7.36C7.19 19.81 7.85 20.5 8.67 20.5h6.66c.82 0 1.48-.69 1.69-1.64L18 12h.06c.55 0 1-.45 1-1v-1c0-.55-.45-1-1-1h-1V8c0-2.76-2.24-5-5-5zm0 2c1.65 0 3 1.35 3 3v1H9V8c0-1.65 1.35-3 3-3zm-1 8h2l-.5 4h-1l-.5-4z"/>
                  </svg>
                  <span className="font-extrabold text-slate-900 text-xs sm:text-sm tracking-wide truncate">Termite Control ›</span>
                </Link>
                <Link href="/pests/rodents" className="bg-white hover:bg-gray-100 rounded-full px-4 sm:px-5 py-2.5 sm:py-3 transition-colors flex items-center gap-2 shadow-md">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" viewBox="0 0 24 24" fill="#071b4d">
                    <path d="M20 8c0-1.1-.9-2-2-2-1.29 0-2.4.84-2.82 2H14c-.55 0-1 .45-1 1v1H8.5c-2.49 0-4.5 2.01-4.5 4.5S6.01 19 8.5 19h7c2.49 0 4.5-2.01 4.5-4.5 0-.98-.31-1.88-.83-2.61L20 8zm-2 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM8.5 17C7.12 17 6 15.88 6 14.5S7.12 12 8.5 12H13v1h-1c-.55 0-1 .45-1 1s.45 1 1 1h1v1H8.5z"/>
                  </svg>
                  <span className="font-extrabold text-slate-900 text-xs sm:text-sm tracking-wide truncate">Rodent Control ›</span>
                </Link>
                <Link href="/pests/mosquitoes" className="bg-white hover:bg-gray-100 rounded-full px-4 sm:px-5 py-2.5 sm:py-3 transition-colors flex items-center gap-2 shadow-md">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" viewBox="0 0 24 24" fill="#071b4d">
                    <path d="M20.34 4.34L18 6.68l-1.42-1.42 2.34-2.34-1.41-1.41L15.17 3.85 14.5 3.18C13.93 2.6 13.16 2.25 12.31 2.25c-1.79 0-3.25 1.46-3.25 3.25 0 .35.06.69.17 1H7.25C5.46 6.5 4 7.96 4 9.75v.5C4 12.04 5.46 13.5 7.25 13.5H8v1H7c-1.1 0-2 .9-2 2H4v2h1c0 1.1.9 2 2 2s2-.9 2-2h6c0 1.1.9 2 2 2s2-.9 2-2h1v-2h-1c0-1.1-.9-2-2-2h-1v-1h.75c1.79 0 3.25-1.46 3.25-3.25v-.5c0-.67-.21-1.29-.55-1.81l1.06-1.06 1.42 1.42 1.41-1.41L21.76 5.76l-1.42-1.42z"/>
                  </svg>
                  <span className="font-extrabold text-slate-900 text-xs sm:text-sm tracking-wide truncate">Mosquito Control ›</span>
                </Link>
              </div>

              <button
                onClick={() => document.getElementById("pest-library")?.scrollIntoView({ behavior: "smooth" })}
                className="text-[#ffc400] hover:text-white font-bold text-xs sm:text-[15px] transition-colors flex items-center gap-1"
              >
                View more services <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            {/* Right — offer card */}
            <div className="w-full md:w-[45%] flex justify-center md:justify-end mt-4 md:mt-0">
              <div className="bg-[#f4f5f7] rounded-2xl shadow-2xl overflow-hidden w-full max-w-sm relative border border-gray-200">
                {/* Green badge */}
                <div className="absolute top-0 left-0 bg-[#17824b] text-white px-3.5 py-1.5 font-bold text-[11px] uppercase tracking-wider flex items-center gap-1.5 rounded-br-lg z-20">
                  <Clock className="w-3.5 h-3.5" /> SUMMER SAVINGS
                </div>
                <div className="p-6 sm:p-8 pt-12 sm:pt-14">
                  <h2 className="text-2xl sm:text-[26px] leading-tight font-black text-[#0a2540] mb-3">
                    Save $50 on Pest Control
                  </h2>
                  <p className="text-[#0a2540] font-medium mb-6 text-xs sm:text-[15px] leading-relaxed">
                    Use code <strong className="font-bold">SAVE50</strong> at checkout to save $50 when starting a new pest control plan.
                  </p>
                  <button
                    onClick={() => {
                      setOnAddressSubmitRedirect("/pests/general#plans");
                      setIsAddressModalOpen(true);
                    }}
                    className="bg-[#ffc400] hover:bg-[#e6af00] text-[#0a2540] font-bold text-xs sm:text-[15px] px-6 sm:px-8 py-3 sm:py-3.5 rounded-full transition-all flex items-center gap-1 w-max shadow-sm"
                  >
                    Get started <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
            SECTION 2 — BEAT THE BITE (Promo split)
            Green bar top & bottom | Dotted background left | family photo right
        ═══════════════════════════════════════════════ */}
        <div className="w-full h-2.5 bg-[#17824b]" />
        <section className="bg-[#f5f5f5] w-full flex flex-col md:flex-row min-h-[350px]">
          <div
            className="w-full md:w-1/2 py-16 px-6 md:px-12 flex justify-end"
            style={{
              backgroundImage: "radial-gradient(#d1d5db 2px, transparent 2px)",
              backgroundSize: "16px 16px",
            }}
          >
            <div className="max-w-lg w-full flex flex-col justify-center">
              <h2 className="text-3xl font-black text-[#071b4d] mb-4">Beat the Bite!</h2>
              <p className="text-lg text-[#071b4d] mb-8 font-medium">
                Start Mosquito &amp; Tick Control today and Save $50.{" "}
                <strong className="font-bold">Use code BITE50</strong> at checkout.²
              </p>
              <button
                onClick={() => {
                  setOnAddressSubmitRedirect("/pests/mosquitoes#plans");
                  setIsAddressModalOpen(true);
                }}
                className="bg-[#ffc400] text-[#071b4d] px-8 py-3 rounded-full font-bold hover:bg-yellow-400 transition-colors shadow-sm w-max text-sm tracking-wide"
              >
                Save Now
              </button>
            </div>
          </div>
          <div className="w-full md:w-1/2 h-64 md:h-auto relative">
            <Image
              src="/images/family-lawn.jpg"
              alt="Family playing on a lawn"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </section>
        <div className="w-full h-2.5 bg-[#17824b]" />

        {/* ═══════════════════════════════════════════════
            SECTION 3 — TRUST COPY + PESTIQ IT.
            White background, centered text, giant brand statement
        ═══════════════════════════════════════════════ */}
        <section className="bg-white pt-20 pb-16 px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-black text-[#071b4d] mb-6">
              When pests show up, so do we.
            </h2>
            <p className="text-lg text-[#071b4d] font-medium mb-4 leading-relaxed max-w-3xl mx-auto">
              For nearly a century, PestIQ has been one of America&apos;s most trusted names in pest control.
              Every day, our exterminators serve thousands of homes and businesses nationwide,
              combining national service with local knowledge to provide best-in-class, proactive pest
              management solutions. We stop problems before they start and respond quickly if issues
              arise, keeping your property protected.
            </p>
            <p className="text-lg text-[#071b4d] font-medium mb-10 max-w-3xl mx-auto">
              And for extra peace of mind, if pests come back, so do we-guaranteed.³
            </p>

            {/* Giant brand statement */}
            <div className="text-6xl md:text-8xl font-black italic text-[#17824b] mb-12 tracking-tight leading-none">
              PESTIQ IT.
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
            SECTION 3.5 — PESTIQ IT GUARANTEE (Standalone Full-Bleed Banner)
            Full width 100% edge-to-edge matching screenshot 100%
        ═══════════════════════════════════════════════ */}
        <section className="w-full bg-[#f2f4f7] py-7 px-6 border-t border-b border-gray-200/80 text-left">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8">
            {/* Standalone line-art shield logo matching screenshot 1 */}
            <div className="flex-shrink-0 flex flex-col items-center justify-center text-center">
              <svg className="w-10 h-11 text-[#071b4d]" viewBox="0 0 48 54" fill="none">
                <path d="M24 3L6 11v16c0 14.5 10.8 28.1 18 31 7.2-2.9 18-16.5 18-31V11L24 3z" stroke="#071b4d" strokeWidth="2.8" strokeLinejoin="round" />
                <path d="M16 25l6 6 11-11" stroke="#071b4d" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-[11px] font-black text-[#17824b] tracking-wider uppercase leading-none mt-2">
                PESTIQ IT
              </span>
              <span className="text-[9px] font-extrabold text-[#17824b] tracking-widest uppercase leading-tight">
                GUARANTEE
              </span>
            </div>

            {/* Vertical divider */}
            <div className="hidden md:block w-[1px] h-14 bg-gray-300/80 flex-shrink-0" />

            {/* Text with explicit space */}
            <p className="text-xs md:text-[13.5px] text-[#071b4d] leading-relaxed font-normal">
              The <strong className="font-bold">PestIQ It Guarantee</strong>{" "}means that if pests come back, so do we — to re-treat at no additional cost. No excuses, just a commitment to care for your home like it&apos;s our own with protection you can trust.³
            </p>
          </div>
        </section>


        {/* ═══════════════════════════════════════════════
            SECTION 4 — COMMITMENT 3-COLUMN
            White bg, 3 icon columns WITH SUBTLE VERTICAL DIVIDERS matching screenshot 1 100%
        ═══════════════════════════════════════════════ */}
        <section className="bg-white pb-24 pt-16 px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-black text-[#071b4d] text-center mb-16 tracking-tight leading-tight">
              Our commitment to you, your family,<br className="hidden md:block" /> and the environment
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0 text-center relative">
              {/* Col 1 — Pet safe */}
              <div className="flex flex-col items-center gap-3.5 px-6 py-2 relative">
                <div className="w-14 h-14 flex items-center justify-center mb-1">
                  <svg className="w-11 h-11 text-[#071b4d]" viewBox="0 0 48 48" fill="none">
                    <circle cx="15" cy="11" r="3.5" stroke="#071b4d" strokeWidth="2.4" />
                    <circle cx="33" cy="11" r="3.5" stroke="#071b4d" strokeWidth="2.4" />
                    <circle cx="8" cy="22" r="3.5" stroke="#071b4d" strokeWidth="2.4" />
                    <circle cx="40" cy="22" r="3.5" stroke="#071b4d" strokeWidth="2.4" />
                    <path d="M24 40c-6.5 0-12-4.5-12-10s4.5-9 12-9 12 3.5 12 9-5.5 10-12 10z" stroke="#071b4d" strokeWidth="2.4" />
                  </svg>
                </div>
                <h3 className="text-sm md:text-base font-black text-[#071b4d]">Pet and family safe</h3>
                <p className="text-[12px] text-gray-500 leading-relaxed max-w-[210px]">
                  PestIQ treats homes with pets by using EPA-approved products
                </p>
                {/* Vertical line right */}
                <div className="hidden md:block absolute right-0 top-2 bottom-2 w-[1px] bg-gray-200/80" />
              </div>

              {/* Col 2 — Eco */}
              <div className="flex flex-col items-center gap-3.5 px-6 py-2 relative">
                <div className="w-14 h-14 flex items-center justify-center mb-1">
                  <svg className="w-11 h-11 text-[#071b4d]" viewBox="0 0 48 48" fill="none">
                    <path d="M36 9C18 13.5 13.5 30 7.5 39c7.5-4.5 13.5-13.5 28.5-27z" stroke="#071b4d" strokeWidth="2.4" strokeLinejoin="round" />
                    <path d="M39 7.5c0 15-13.5 25.5-22.5 31.5" stroke="#071b4d" strokeWidth="2.4" strokeLinecap="round" />
                  </svg>
                </div>
                <h3 className="text-sm md:text-base font-black text-[#071b4d]">
                  Environmentally responsible<br />approach
                </h3>
                <p className="text-[12px] text-gray-500 leading-relaxed max-w-[210px]">
                  PestIQ practices Integrated Pest Management (IPM)
                </p>
                {/* Vertical line right */}
                <div className="hidden md:block absolute right-0 top-2 bottom-2 w-[1px] bg-gray-200/80" />
              </div>

              {/* Col 3 — Humane */}
              <div className="flex flex-col items-center gap-3.5 px-6 py-2">
                <div className="w-14 h-14 flex items-center justify-center mb-1">
                  <svg className="w-11 h-11 text-[#071b4d]" viewBox="0 0 48 48" fill="none">
                    <path d="M24 6L8 14v12c0 10.5 7.5 20.5 16 23 8.5-2.5 16-12.5 16-23V14L24 6z" stroke="#071b4d" strokeWidth="2.4" strokeLinejoin="round" />
                    <path d="M17 23l5 5 9-10" stroke="#071b4d" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3 className="text-sm md:text-base font-black text-[#071b4d]">Humane pest removal</h3>
                <p className="text-[12px] text-gray-500 leading-relaxed max-w-[210px]">
                  PestIQ prioritizes humane pest removal and control
                </p>
              </div>
            </div>
          </div>
        </section>




        {/* ═══════════════════════════════════════════════
            SECTION 5 — PEST LIBRARY TABS
            Centered heading, tab icons, feature panel (3-col inside)
        ═══════════════════════════════════════════════ */}
        <section id="pest-library" className="bg-white border-t border-gray-200 py-16 px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-black text-[#071b4d] text-center mb-10">
              Here are some of the most common pests we protect against
            </h2>

            {/* Tab bar */}
            <div className="flex flex-wrap justify-center border-b border-gray-200 mb-8 gap-0">
              {pestLibrary.map(pest => (
                <button
                  key={pest.name}
                  onClick={() => setActiveTab(pest.name)}
                  className={`flex flex-col items-center gap-1.5 px-3 py-3 text-[11px] font-bold transition-colors border-b-2 min-w-[60px]
                    ${activeTab === pest.name
                      ? "border-[#071b4d] text-[#071b4d]"
                      : "border-transparent text-gray-500 hover:text-[#071b4d]"
                    }`}
                >
                  <span className={activeTab === pest.name ? "text-[#071b4d]" : "text-gray-400"}>
                    {pest.icon}
                  </span>
                  {pest.name}
                </button>
              ))}
            </div>

            {/* Feature panel — 3 columns: photo | description | tagline */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm">
              {/* Photo */}
              <div className="relative h-56 md:h-auto min-h-[220px] p-2">
                <div className="relative w-full h-full rounded-xl overflow-hidden min-h-[200px]">
                  <Image
                    key={currentPest.name}
                    src={currentPest.image}
                    alt={currentPest.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="p-6 md:p-8 flex flex-col justify-center">
                <p className="text-xs md:text-sm text-gray-700 leading-relaxed mb-4">
                  {currentPest.description}
                </p>
                <Link
                  href={currentPest.link}
                  className="text-[#071b4d] font-bold text-xs md:text-sm hover:underline"
                >
                  Learn more about {currentPest.name.toLowerCase()}
                </Link>
              </div>

              {/* Tagline + CTA */}
              <div className="p-6 md:p-8 border-l border-gray-200 flex flex-col justify-center bg-[#fafafa]">
                <p className="text-lg md:text-xl font-black text-[#071b4d] mb-6 leading-tight">
                  {currentPest.tagline}
                </p>
                <button
                  onClick={() => {
                    setOnAddressSubmitRedirect(`${currentPest.link}#plans`);
                    setIsAddressModalOpen(true);
                  }}
                  className="bg-[#ffc400] hover:bg-[#e6af00] text-[#071b4d] font-bold text-xs md:text-sm px-5 py-2.5 rounded-full transition-colors w-max flex items-center gap-2 shadow-sm"
                >
                  View {currentPest.name.toLowerCase()} control plans <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
            SECTION 6 — PROCESS (How it works)
            White bg, centered heading, 4-col numbered steps, green bottom stripe
        ═══════════════════════════════════════════════ */}
        <section className="bg-white border-t border-gray-100 pt-16 pb-0 px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-black text-[#071b4d] text-center mb-14">
              Local pest control technicians with a<br className="hidden md:block" /> process you can trust
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-0">
              {[
                { num: "01", title: "Thorough inspections",  body: "Our trained exterminators identify the root of your local pest problem, spotting existing and potential issues." },
                { num: "02", title: "Custom treatments",     body: "We work with you to develop a customised management plan to eliminate pests and prevent them from returning." },
                { num: "03", title: "Lasting protection",    body: "Once we start treatment, you can relax. We guarantee we'll fix your pests and keep them from coming back." },
                { num: "04", title: "Always on support",     body: "With convenient online scheduling and 24/7 customer service, managing your pest control has never been easier." },
              ].map(step => (
                <div key={step.num} className="flex flex-col">
                  <span className="text-5xl font-black text-[#d1d5db] mb-3 leading-none">{step.num}</span>
                  <h3 className="font-black text-[#071b4d] text-base mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{step.body}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Green bottom stripe */}
          <div className="bg-[#17824b] h-3 mt-14 w-full" />
        </section>

        {/* ═══════════════════════════════════════════════
            SECTION 7 — REVIEWS CAROUSEL
            Dark GREEN background, white cards, prev/next arrows
        ═══════════════════════════════════════════════ */}
        <section className="bg-[#1a5c2c] py-16 px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-black text-white text-center mb-2">
              The PestIQ Difference
            </h2>
            <p className="text-center text-green-200 mb-10 text-base">
              Here&apos;s what our customers have to say...
            </p>

            {/* 3 review cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
              {visibleReviews.map((rev, i) => (
                <div
                  key={`${rev.name}-${reviewIndex}-${i}`}
                  className="bg-white rounded-xl p-5 shadow-md flex flex-col gap-3"
                >
                  {/* Header */}
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-black text-[#071b4d] text-sm">{rev.name}</p>
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mt-0.5">
                        {rev.location}
                      </p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#3b82f6]/20 text-[#3b82f6] flex items-center justify-center text-xs font-black flex-shrink-0">
                      {rev.initial}
                    </div>
                  </div>

                  {/* Stars */}
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star key={s} className="w-4 h-4 text-[#ffc400]" fill="#ffc400" />
                    ))}
                  </div>

                  {/* Review text */}
                  <p className="text-xs md:text-sm text-gray-700 leading-relaxed flex-1">
                    {rev.text}
                  </p>

                  {/* Time ago */}
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">
                    {rev.ago}
                  </p>
                </div>
              ))}
            </div>

            {/* Navigation arrows */}
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setReviewIndex(i => (i - 1 + reviews.length) % reviews.length)}
                className="w-9 h-9 rounded-full border-2 border-white/50 text-white flex items-center justify-center hover:border-white hover:bg-white/10 transition-colors"
                aria-label="Previous reviews"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setReviewIndex(i => (i + 1) % reviews.length)}
                className="w-9 h-9 rounded-full border-2 border-white/50 text-white flex items-center justify-center hover:border-white hover:bg-white/10 transition-colors"
                aria-label="Next reviews"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
            SECTION 8 — LOCAL EXPERTS
            White bg, rounded photo left, text right
        ═══════════════════════════════════════════════ */}
        <section className="bg-white py-16 px-4">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-10">
            {/* Photo */}
            <div className="w-full md:w-[45%] flex-shrink-0">
              <div className="relative h-72 md:h-80 rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src="/images/pest-technician.jpg"
                  alt="Local PestIQ expert technician"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 45vw"
                />
              </div>
            </div>

            {/* Text */}
            <div className="w-full md:w-[55%]">
              <h2 className="text-3xl md:text-4xl font-black text-[#071b4d] mb-4">
                Local experts, global support
              </h2>
              <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                PestIQ combines global expertise with the knowledge of your neighborhood.
                Using Integrated Pest Management (IPM), an eco-friendly approach that focuses
                on targeted treatments to solve your problem.
              </p>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
            SECTION 9 — EMAIL SIGNUP BAR
            Dark navy bg, inline email form
        ═══════════════════════════════════════════════ */}
        <section className="bg-[#071b4d] py-8 px-4">
          <form
            onSubmit={e => e.preventDefault()}
            className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <p className="text-white font-bold text-base sm:text-lg text-center sm:text-left">
              Sign up for deals, updates and a free guide
            </p>
            <div className="flex gap-0 flex-shrink-0">
              <input
                type="email"
                placeholder="Enter your email"
                required
                className="h-10 px-4 text-sm outline-none w-52 sm:w-64 bg-white text-gray-900 placeholder:text-gray-400"
              />
              <button
                type="submit"
                className="bg-[#17824b] hover:bg-[#136b3d] text-white font-bold text-sm px-5 h-10 transition-colors"
              >
                Submit
              </button>
            </div>
          </form>
        </section>

        {/* ═══════════════════════════════════════════════
            SECTION 10 — FAQ ACCORDION (Card items)
            White bg, centered, card rows with chevron toggle
        ═══════════════════════════════════════════════ */}
        <section className="bg-white py-16 px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-black text-[#071b4d] text-center mb-10">
              FAQs about PestIQ pest control services
            </h2>

            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="border border-gray-200 rounded-md bg-white overflow-hidden transition-shadow hover:shadow-sm"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full flex justify-between items-center px-5 py-4 text-left gap-4"
                  >
                    <span className="font-bold text-[#071b4d] text-sm md:text-base">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform duration-200 ${openFaq === idx ? "rotate-180" : ""}`}
                    />
                  </button>
                  {openFaq === idx && (
                    <div className="px-5 pb-5 pt-1 border-t border-gray-100">
                      <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}