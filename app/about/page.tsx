"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ShieldCheck, Award, FileText, CheckCircle } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="site-shell site-v3 min-h-screen flex flex-col bg-white font-sans">


      <Header />
      
      <main className="flex-grow py-12 px-4 sm:px-8">
        <div className="max-w-[1000px] mx-auto">
          
          {/* Header Block */}
          <header className="mb-10 text-center max-w-2xl mx-auto">
            <span className="text-[12px] uppercase tracking-widest font-extrabold text-[#17824b]">Operating Standards</span>
            <h1 className="text-[34px] sm:text-[40px] font-extrabold text-[#071b4d] mt-1 leading-tight">
              Built on trust, safety, and local coordination.
            </h1>
            <p className="text-zinc-500 text-[14.5px] mt-2 leading-relaxed">
              PestIQ Solutions delivers clear, structured, and property-aware residential pest-control services. We focus on transparent communication and reliable maintenance.
            </p>
          </header>

          {/* Story split section */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center mb-16">
            <div className="flex flex-col gap-4">
              <h2 className="text-[24px] font-extrabold text-[#071b4d]">Why PestIQ was started</h2>
              <p className="text-gray-700 text-[14.5px] leading-relaxed">
                Pest control should feel organized and certain, not confusing. Homeowners often struggle with hidden fees, vague service descriptions, and unpredictable schedules. 
              </p>
              <p className="text-gray-700 text-[14.5px] leading-relaxed">
                PestIQ Solutions was designed to solve this by providing address-gated transparent pricing, step-by-step treatment outlines, and reliable callback promises. We align our treatment plans with your specific building structure and neighborhood conditions.
              </p>
            </div>
            <div className="h-[280px] rounded-xl overflow-hidden border border-gray-200 shadow-md relative">
              <Image 
                src="/images/pestiq-technician-home.jpg" 
                alt="PestIQ pest control technician performing a residential inspection" 
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </section>

          {/* 3 Core Values Grid */}
          <section className="bg-zinc-50 border border-gray-200 rounded-lg p-6 sm:p-8 mb-16">
            <h2 className="text-[20px] font-extrabold text-[#071b4d] mb-8 text-center uppercase tracking-wider">
              Our Service Commitments
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              <div className="flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border border-gray-200 text-[#17824b]">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <strong className="text-[16px] text-[#071b4d] font-bold">Property Safety First</strong>
                <span className="text-[13px] text-zinc-500 leading-relaxed">
                  All treatments match EPA standards and are applied target-selectively. We secure chemical baits in tamper-resistant containers away from families and pets.
                </span>
              </div>

              <div className="flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border border-gray-200 text-[#17824b]">
                  <Award className="w-6 h-6" />
                </div>
                <strong className="text-[16px] text-[#071b4d] font-bold">Licensed Technicians</strong>
                <span className="text-[13px] text-zinc-500 leading-relaxed">
                  Our technicians are fully certified and undergo ongoing training in pest biology, structural exclusion techniques, and target-selective applications.
                </span>
              </div>

              <div className="flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border border-gray-200 text-[#17824b]">
                  <FileText className="w-6 h-6" />
                </div>
                <strong className="text-[16px] text-[#071b4d] font-bold">Detailed written sheets</strong>
                <span className="text-[13px] text-zinc-500 leading-relaxed">
                  We log active monitors, structural gaps sealed, and chemical applications made. Homeowners receive a clear digital copy outlining recommendations after every visit.
                </span>
              </div>

            </div>
          </section>

          {/* Credentials / Local Licensing Info */}
          <section className="border border-gray-200 rounded-lg p-6 sm:p-8">
            <h2 className="text-[20px] font-extrabold text-[#071b4d] mb-4">Credentials & Local Compliance</h2>
            <p className="text-gray-700 text-[14px] leading-relaxed mb-5">
              PestIQ Solutions operates in compliance with all New York State Department of Environmental Conservation (DEC) guidelines. We carry comprehensive general liability coverage to secure your property.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 bg-white border border-gray-200 p-4 rounded flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[#17824b] flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[14px] text-zinc-800 block">NYS DEC Registered</strong>
                  <span className="text-[12px] text-zinc-500 block mt-0.5">Licensed for Category 7A (Structural and Rodent Pest Control) services.</span>
                </div>
              </div>
              <div className="flex-1 bg-white border border-gray-200 p-4 rounded flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[#17824b] flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[14px] text-zinc-800 block">Fully Insured & Bonded</strong>
                  <span className="text-[12px] text-zinc-500 block mt-0.5">Comprehensive liability coverage ensures secure operations on residential properties.</span>
                </div>
              </div>
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
