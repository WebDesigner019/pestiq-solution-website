"use client";

import React from "react";
import Link from "next/link";
import { Search, ShieldAlert, Sparkles, ClipboardCheck, ArrowRight, ShieldCheck } from "lucide-react";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function HowItWorksPage() {
  const steps = [
    {
      icon: Search,
      num: "01",
      title: "Comprehensive Inspection",
      desc: "Our technician begins by examining your property's crawlspaces, basement joists, wall joints, and external perimeters. We identify the target pest species, entry trails, active nesting zones, and environmental factors (like water pooling or exposed food) that support activity."
    },
    {
      icon: ShieldAlert,
      num: "02",
      title: "Precision Treatment",
      desc: "Using the inspection results, we apply localized treatments to eradicate active pests. Baits are placed selectively along trail routes, and perimeter sprays establish an invisible barrier. We prioritize child- and pet-safe container placements."
    },
    {
      icon: Sparkles,
      num: "03",
      title: "Structural Exclusion",
      desc: "Eradication is only half the battle. We pinpoint critical gaps, weep holes, and pipe entry points and fill them with professional chew-proof steel wool or mesh sealants. This physical exclusion stops new pests from taking the same paths."
    },
    {
      icon: ClipboardCheck,
      num: "04",
      title: "Detailed Reporting",
      desc: "Following treatment, you receive a full digital report detailing findings, product EPA numbers, exclusion work completed, and recommendations to minimize future risk."
    }
  ];

  return (
    <div className="site-shell site-v3 min-h-screen bg-white font-sans">
      <Header />
      <main className="w-full bg-white py-12 px-4 sm:px-8">
        <div className="max-w-[1000px] mx-auto">
          <header className="mb-12 text-center max-w-2xl mx-auto">
            <span className="text-[12px] uppercase tracking-widest font-extrabold text-[#17824b]">Service Process</span>
            <h1 className="text-[34px] sm:text-[40px] font-extrabold text-[#071b4d] leading-tight mt-1">
              A planned, documented path to pest elimination.
            </h1>
            <p className="text-zinc-500 text-[14.5px] mt-2 leading-relaxed">
              We follow a clean, disciplined sequence designed to locate, isolate, and block pest activity on your property. Here is what you can expect during our visits.
            </p>
          </header>


        {/* Steps Layout */}
        <section className="flex flex-col gap-8 mb-16">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div 
                key={index} 
                className="border border-border-gray rounded-lg p-6 sm:p-8 bg-[#fcfdfc] flex flex-col md:flex-row gap-6 items-start"
              >
                {/* Num and Icon */}
                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="w-12 h-12 bg-white rounded-full border border-border-gray flex items-center justify-center font-extrabold text-[15px] text-zinc-500">
                    {step.num}
                  </div>
                  <div className="w-12 h-12 bg-emerald-50 text-primary-green rounded-lg flex items-center justify-center border border-emerald-100">
                    <IconComponent className="w-6 h-6" />
                  </div>
                </div>

                {/* Text Content */}
                <div className="flex flex-col gap-2">
                  <h3 className="text-[19px] font-bold text-dark-slate leading-tight">{step.title}</h3>
                  <p className="text-zinc-650 text-[14px] leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </section>

        {/* Guarantee Banner Callout */}
        <section className="bg-zinc-900 rounded-xl p-8 text-white flex flex-col md:flex-row justify-between items-center gap-8 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="bg-zinc-800 p-3 rounded-lg border border-zinc-700 text-primary-green mt-1 flex-shrink-0">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <strong className="text-[18px] font-extrabold text-white block">
                The Satisfaction Callback Guarantee
              </strong>
              <p className="text-[13.5px] text-zinc-400 mt-1 max-w-[550px] leading-relaxed">
                Ongoing subscribers enjoy year-round callback safety. If you notice any pest outbreaks in covered zones between treatments, we will send a technician back to treat the areas for free.
              </p>
            </div>
          </div>
          <Link
            href="/get-started"
            className="px-5 py-3 bg-primary-green hover:bg-primary-green-dark text-white font-bold rounded text-[14px] transition-smooth whitespace-nowrap"
          >
            Schedule Initial Assessment
            <ArrowRight className="w-4 h-4 inline ml-1" />
          </Link>
        </section>

        </div>
      </main>
      <Footer />
    </div>
  );
}

