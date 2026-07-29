"use client";

import React from "react";
import Link from "next/link";
import { Star, ShieldCheck, MapPin, CheckCircle } from "lucide-react";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function ReviewsPage() {
  const reviews = [
    {
      name: "Marcus G.",
      location: "Brooklyn, NY",
      rating: 5,
      date: "July 12, 2026",
      plan: "Complete Protection Plan",
      text: "We had a persistent mouse issue in our townhouse kitchen for months. The PestIQ technician was extremely meticulous during the inspection. They located two small gaps around the radiator pipes under our floorboards and sealed them with steel wool. We haven't heard a sound behind the walls since."
    },
    {
      name: "Sarah K.",
      location: "Yonkers, NY",
      rating: 5,
      date: "June 28, 2026",
      plan: "Essential Protection Plan",
      text: "The localized price tier for Westchester was very reasonable. I signed up for the Essential Plan after noticing ant trails in our crawlspace. The service was prompt, and the detailed report sent to my email afterward outlined exactly what was treated. Very professional company."
    },
    {
      name: "David T.",
      location: "Manhattan, NY",
      rating: 5,
      date: "May 19, 2026",
      plan: "One-Time Service",
      text: "Great experience. Needed emergency bed bug inspection for a bedroom. Booking online was simple, and they called me back in less than an hour to confirm a technician for the next morning. The technician was transparent about the scope and costs before starting. 5 stars."
    },
    {
      name: "Elena R.",
      location: "Queens, NY",
      rating: 4,
      date: "April 30, 2026",
      plan: "Complete Protection Plan",
      text: "Very satisfied with their service. We've been using their quarterly plan for roach and spider prevention. Technicians are polite, prompt, and always wear protective shoe covers when entering my home. The satisfaction callback guarantee gives real peace of mind."
    },
    {
      name: "Robert M.",
      location: "New Rochelle, NY",
      rating: 5,
      date: "March 14, 2026",
      plan: "Essential Protection Plan",
      text: "Clean, simplified billing and extremely thorough inspections. They sweep away cobwebs around our roofline as part of our regular check. They explain what structural areas need to be adjusted to prevent future entry. Highly recommended pest control."
    }
  ];

  return (
    <div className="site-shell site-v3 min-h-screen bg-white font-sans">
      <Header />
      <main className="w-full bg-white py-12 px-4 sm:px-8">
        <div className="max-w-[1000px] mx-auto">

        
        {/* Header Block */}
        <header className="mb-12 text-center max-w-2xl mx-auto">
          <span className="text-[12px] uppercase tracking-widest font-extrabold text-primary-green">Customer Feedback</span>
          <h1 className="text-[34px] sm:text-[40px] font-extrabold text-dark-slate leading-tight mt-1">
            What New York homeowners say about us.
          </h1>
          <p className="text-zinc-500 text-[14.5px] mt-2">
            Read verified testimonials regarding our inspections, structural exclusions, and seasonal protection perimeters.
          </p>
        </header>

        {/* Rating Summary Panel */}
        <section className="bg-zinc-50 border border-border-gray rounded-lg p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 mb-12">
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-1">
            <span className="text-[11px] uppercase tracking-widest font-extrabold text-zinc-400">Average Rating</span>
            <div className="flex items-center gap-2 mt-1">
              <strong className="text-[38px] font-extrabold text-dark-slate leading-none">4.9</strong>
              <div>
                <div className="flex text-amber-500">
                  <Star className="w-4.5 h-4.5 fill-current" />
                  <Star className="w-4.5 h-4.5 fill-current" />
                  <Star className="w-4.5 h-4.5 fill-current" />
                  <Star className="w-4.5 h-4.5 fill-current" />
                  <Star className="w-4.5 h-4.5 fill-current" />
                </div>
                <span className="text-[12px] text-zinc-500 mt-0.5 block">Based on verified customer reviews</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white border border-border-gray p-4 rounded-lg shadow-sm">
            <ShieldCheck className="w-7 h-7 text-primary-green flex-shrink-0" />
            <div className="text-[12.5px] leading-relaxed text-zinc-600 max-w-[320px]">
              <strong>100% Verified Feedback:</strong> Reviews are sourced exclusively from customers who have completed an active treatment or protection check.
            </div>
          </div>
        </section>

        {/* Reviews List */}
        <section className="flex flex-col gap-6">
          {reviews.map((rev, index) => (
            <article 
              key={index}
              className="border border-border-gray p-6 rounded-lg bg-white shadow-sm hover:shadow-md transition-smooth flex flex-col gap-3"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 border-b border-border-gray pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center font-bold text-[13px] text-zinc-700">
                    {rev.name[0]}
                  </div>
                  <div>
                    <strong className="text-[14.5px] text-dark-slate block">{rev.name}</strong>
                    <span className="text-[11px] text-zinc-400 font-semibold uppercase tracking-wider block mt-0.5">{rev.plan}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-[12px] text-zinc-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-zinc-300" />
                    {rev.location}
                  </span>
                  <span>·</span>
                  <span>{rev.date}</span>
                </div>
              </div>

              {/* Stars & Text */}
              <div className="flex text-amber-500 gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 ${i < rev.rating ? "fill-current text-amber-500" : "text-zinc-200"}`} 
                  />
                ))}
              </div>

              <p className="text-[14px] text-zinc-650 leading-relaxed font-medium">
                "{rev.text}"
              </p>
              
              <div className="inline-flex items-center gap-1 text-[11px] text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded w-max border border-emerald-100 mt-1">
                <CheckCircle className="w-3.5 h-3.5" />
                Verified Treatment Complete
              </div>
            </article>
          ))}
        </section>

        </div>
      </main>
      <Footer />
    </div>
  );
}

