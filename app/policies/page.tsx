"use client";

import React from "react";
import Link from "next/link";
import { AlertTriangle, Clock, RotateCcw, Calendar, ShieldCheck } from "lucide-react";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function PoliciesPage() {
  return (
    <div className="site-shell site-v3 min-h-screen bg-white font-sans">
      <Header />
      <main className="w-full bg-white py-12 px-4 sm:px-8">
        <div className="max-w-[900px] mx-auto">

        
        {/* Header Block */}
        <header className="mb-10 text-center max-w-2xl mx-auto">
          <span className="text-[12px] uppercase tracking-widest font-extrabold text-primary-green">Customer Information</span>
          <h1 className="text-[34px] sm:text-[40px] font-extrabold text-dark-slate mt-1 leading-tight">
            Policies & Service Terms
          </h1>
          <p className="text-zinc-500 text-[14.5px] mt-2">
            Baseline policies and service terms. Please review before scheduling appointments or establishing active subscription plans.
          </p>
        </header>

        {/* Policies List */}
        <section className="flex flex-col gap-8 mb-12">
          
          {/* Policy 1 */}
          <article className="border border-border-gray p-6 sm:p-8 rounded-lg bg-zinc-50/30" id="appointments">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-white rounded border border-border-gray flex items-center justify-center text-primary-green flex-shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-[19px] font-bold text-dark-slate mb-2">Appointment Requests & Confirmations</h2>
                <p className="text-[13.5px] text-zinc-600 leading-relaxed">
                  All dates and arrival windows chosen online are treated as preferences. An appointment is officially confirmed only after our office staff has verified your address eligibility, discussed the target pest concern, and confirmed technician availability via phone or email.
                </p>
              </div>
            </div>
          </article>

          {/* Policy 2 */}
          <article className="border border-border-gray p-6 sm:p-8 rounded-lg bg-zinc-50/30" id="cancellation">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-white rounded border border-border-gray flex items-center justify-center text-primary-green flex-shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-[19px] font-bold text-dark-slate mb-2">Cancellation & Rescheduling</h2>
                <p className="text-[13.5px] text-zinc-600 leading-relaxed">
                  We request that cancellation or rescheduling notifications be submitted at least 24 hours prior to your scheduled technician window. Any late-cancellation, lock-out, or no-access fees will be fully disclosed in your written service agreement before any visits.
                </p>
              </div>
            </div>
          </article>

          {/* Policy 3 */}
          <article className="border border-border-gray p-6 sm:p-8 rounded-lg bg-zinc-50/30" id="refunds">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-white rounded border border-border-gray flex items-center justify-center text-primary-green flex-shrink-0">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-[19px] font-bold text-dark-slate mb-2">Refund Policy</h2>
                <p className="text-[13.5px] text-zinc-600 leading-relaxed">
                  For prepaid one-time services, you are eligible for a full refund if canceled at least 24 hours prior to dispatch. If a technician has already arrived or begun treatment, refund values will depend on the percentage of treatments completed and any exclusion seal materials used.
                </p>
              </div>
            </div>
          </article>

          {/* Policy 4 */}
          <article className="border border-border-gray p-6 sm:p-8 rounded-lg bg-zinc-50/30" id="subscriptions">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-white rounded border border-border-gray flex items-center justify-center text-primary-green flex-shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-[19px] font-bold text-dark-slate mb-2">Ongoing Monthly Subscriptions</h2>
                <p className="text-[13.5px] text-zinc-600 leading-relaxed">
                  Essential and Complete plans are billed monthly on a recurring cycle. Subscriptions continue automatically until you submit a cancellation request. The final service contract outlines included inspection cycles, scheduled dates, renewal schedules, and termination paths.
                </p>
              </div>
            </div>
          </article>

          {/* Policy 5 */}
          <article className="border border-border-gray p-6 sm:p-8 rounded-lg bg-zinc-50/30" id="privacy">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-white rounded border border-border-gray flex items-center justify-center text-primary-green flex-shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-[19px] font-bold text-dark-slate mb-2">Privacy & Consent</h2>
                <p className="text-[13.5px] text-zinc-600 leading-relaxed">
                  Contact information (name, phone, email) and property details (address, pest concerns) are gathered strictly to assess service eligibility, prepare estimates, coordinate scheduling, and manage client relations. We will never sell your information. Payment details are fully processed by secure certified partners.
                </p>
              </div>
            </div>
          </article>

        </section>

        {/* Warning callout */}
        <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-lg p-5 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
          <div className="text-[12.5px] leading-relaxed">
            <strong>Legal Notice & Review:</strong> The policies and terms outlined on this page serve as a structural reference for website demonstration purposes. They do not constitute formal legal advice or binding contracts. Actual terms will be reviewed and signed in a separate service agreement.
          </div>
        </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}

