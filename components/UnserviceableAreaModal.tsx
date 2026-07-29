"use client";

import React, { useState } from "react";
import { useLocation } from "@/context/LocationContext";
import { X, MapPin, Send, CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";

export function UnserviceableAreaModal() {
  const { 
    isUnserviceableModalOpen, 
    setIsUnserviceableModalOpen, 
    unserviceableAddress, 
    setIsAddressModalOpen 
  } = useLocation();

  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isUnserviceableModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-gray-100 relative">
        
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-[#071b4d] to-[#0a2540] px-6 py-5 text-white relative">
          <button 
            onClick={() => setIsUnserviceableModalOpen(false)}
            className="absolute top-4 right-4 text-gray-300 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-all"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <span className="text-amber-400 text-xs font-bold uppercase tracking-wider block">Service Area Notice</span>
              <h3 className="text-lg font-extrabold text-white leading-tight">We don&apos;t service this area yet</h3>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          <div className="bg-amber-50 border border-amber-200/70 rounded-xl p-3.5 mb-5 flex items-start gap-3">
            <MapPin className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-xs text-amber-900 block font-semibold">Address Searched:</strong>
              <span className="text-sm font-bold text-gray-800 break-words block">
                {unserviceableAddress || "Outside current service area"}
              </span>
            </div>
          </div>

          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            PestIQ Solutions currently provides residential pest control across:
          </p>

          <ul className="text-xs font-semibold text-gray-700 space-y-2 mb-6 bg-gray-50 p-4 rounded-xl border border-gray-200/80">
            <li className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#17824b]" /> New York City (Manhattan, Brooklyn, Queens, Bronx, Staten Island)
            </li>
            <li className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#17824b]" /> Lower Westchester & Long Island, NY
            </li>
            <li className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#17824b]" /> Northern & Central New Jersey (Hudson, Essex, Ocean County)
            </li>
            <li className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#17824b]" /> Fairfield County, CT
            </li>
          </ul>

          {/* Email Waitlist Capture Form */}
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-3">
              <label className="block text-xs font-bold text-[#071b4d] uppercase tracking-wider">
                Get notified when PestIQ launches in your neighborhood:
              </label>
              <div className="flex gap-2">
                <input 
                  type="email"
                  required
                  placeholder="Enter your email address..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0066cc]"
                />
                <button 
                  type="submit"
                  disabled={loading}
                  className="bg-[#0066cc] hover:bg-[#0052a3] text-white px-5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 transition-colors disabled:opacity-50"
                >
                  {loading ? "Saving..." : <>Join Waitlist <Send className="w-4 h-4" /></>}
                </button>
              </div>
            </form>
          ) : (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center text-emerald-800 animate-fade-in">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              <strong className="text-sm font-bold block">You&apos;re on the priority expansion list!</strong>
              <p className="text-xs text-emerald-700 mt-1">
                We&apos;ve logged your address request. We will email you the moment PestIQ launches in your neighborhood.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
            <button 
              onClick={() => {
                setIsUnserviceableModalOpen(false);
                setIsAddressModalOpen(true);
              }}
              className="text-xs font-extrabold text-[#0066cc] hover:underline"
            >
              ← Search a different address
            </button>
            <button 
              onClick={() => setIsUnserviceableModalOpen(false)}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
