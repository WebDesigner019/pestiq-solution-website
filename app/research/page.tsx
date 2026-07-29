"use client";

import React from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Bug, BookOpen, ShieldAlert, CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

const RESEARCH_TOPICS = [
  { title: "Termite Swarming Seasons", slug: "termites", category: "Wood Destroying Pests", desc: "Learn how to spot termite swarmer wings around windows and mud tubes on foundation walls before structural damage occurs." },
  { title: "Bed Bug Identification & Elimination", slug: "bed-bugs", category: "Parasitic Insects", desc: "Understanding the life cycle of bed bugs, heat treatment protocols, and preventatives when traveling." },
  { title: "Cockroach Control & Health Risks", slug: "cockroaches", category: "Sanitation Pests", desc: "Why German cockroaches reproduce rapidly in warm kitchens and how custom gel baits eliminate whole colonies." },
  { title: "Rodent Entry & Prevention", slug: "rodents", category: "Mammal Pests", desc: "How mice can fit through holes the size of a dime and the proven steps to seal foundation gaps." },
  { title: "Mosquito Disease Vectors", slug: "mosquitoes", category: "Outdoor Pests", desc: "Controlling breeding water sources around yards to suppress mosquito larvae before adult emergence." },
  { title: "Ant Colony Eradication Guide", slug: "ants", category: "Social Insects", desc: "Why spraying store-bought chemicals scatters ant nests (budding) and how professional baiting works." },
];

export default function ResearchPage() {
  return (
    <div className="site-shell site-v3 min-h-screen bg-slate-50">
      <Header />
      <main className="w-full">
        <section className="bg-[#071b4d] text-white py-16 sm:py-20 px-4 text-center">
          <div className="max-w-4xl mx-auto space-y-4">
            <span className="text-[#ffc400] text-xs sm:text-sm font-black tracking-widest uppercase">
              PESTIQ RESEARCH &amp; EDUCATION
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Entomology &amp; Pest Research Library
            </h1>
            <p className="text-slate-300 text-sm sm:text-lg max-w-2xl mx-auto font-medium">
              Expert articles, identification guides, and biological research from PestIQ board-certified entomologists.
            </p>
          </div>
        </section>

        <section className="max-w-6xl mx-auto py-16 px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {RESEARCH_TOPICS.map((item) => (
              <Link
                key={item.title}
                href={`/pests/${item.slug}`}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-[#1557b8] transition-all flex flex-col justify-between group"
              >
                <div>
                  <span className="text-[11px] font-extrabold text-[#1557b8] uppercase tracking-wider block mb-2">
                    {item.category}
                  </span>
                  <h3 className="text-lg font-black text-[#071b4d] mb-2 group-hover:text-[#1557b8] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed mb-4">
                    {item.desc}
                  </p>
                </div>
                <span className="text-xs font-bold text-[#1557b8] flex items-center gap-1">
                  Read Pest Guide <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
