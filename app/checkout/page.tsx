"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLocation } from "@/context/LocationContext";
import Link from "next/link";

const LockIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-8a2 2 0 00-2-2h-12a2 2 0 00-2 2v8a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const CheckIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
  </svg>
);

const CheckCircleIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ArrowRightIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);

const ShieldIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const StarIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const StarHalfIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const SpinnerIcon = ({ className = "w-5 h-5 animate-spin" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

export default function CheckoutPage() {
  const { cartItem, streetAddress, propertySqFt, clearCart, submitAddressSearch } = useLocation();
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [referenceCode, setReferenceCode] = useState("");

  const [inputAddress, setInputAddress] = useState(streetAddress || "");
  const [validationError, setValidationError] = useState("");
  const [isValidating, setIsValidating] = useState(false);

  // Keep input address in sync if context changes
  React.useEffect(() => {
    if (streetAddress && !inputAddress) {
      setInputAddress(streetAddress);
    }
  }, [streetAddress, inputAddress]);

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (!inputAddress.trim()) {
        setValidationError("Service address is required.");
        return;
      }

      setValidationError("");
      setIsValidating(true);

      try {
        const res = await fetch("/api/places/validate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ address: inputAddress })
        });
        
        const data = await res.json();
        
        if (res.ok && !data.valid) {
          setValidationError(data.error || "This address could not be verified. Please enter a valid residential address.");
          setIsValidating(false);
          return;
        }

        // Save validated address to location context
        submitAddressSearch(inputAddress);
      } catch (err) {
        console.warn("Validation request warning, proceeding anyway:", err);
      } finally {
        setIsValidating(false);
      }
    }
    setStep((s) => s + 1);
  };

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setReferenceCode(`PIQ-2026-${Math.floor(10000 + Math.random() * 90000)}`);
      clearCart();
      setStep(4);
    }, 2000);
  };

  const planName = cartItem?.planName || "PestFree365+ Plan";
  const rawMonthlyRate = cartItem?.monthlyPrice || "64.99";
  const rawInitialFee = cartItem?.initialFee || "149.00";

  const monthlyRate = rawMonthlyRate.startsWith("$") ? rawMonthlyRate : `$${rawMonthlyRate}`;
  const initialFee = rawInitialFee.startsWith("$") ? rawInitialFee : `$${rawInitialFee}`;

  return (
    <div className="site-shell site-v3 min-h-screen bg-[#f8fafc]">
      <Header />
      <main className="checkout-page py-8 sm:py-12">
        {step === 4 ? (
          <div className="flex justify-center items-center py-16 px-4">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 max-w-2xl w-full overflow-hidden">
              {/* Header Banner */}
              <div className="bg-[#071b4d] px-8 py-10 text-center relative">
                <div className="w-20 h-20 bg-[#ffc400] text-[#071b4d] rounded-full flex items-center justify-center shadow-lg mx-auto mb-6">
                  <CheckIcon className="w-10 h-10" />
                </div>
                <h1 className="text-4xl sm:text-5xl font-black text-white mb-2 tracking-tight">Order Confirmed</h1>
                <p className="text-blue-100 text-lg font-medium">Your PestIQ service is officially booked.</p>
              </div>

              {/* Receipt Body */}
              <div className="p-8 sm:p-12">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-200 pb-6 mb-6">
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">Reference Number</p>
                    <p className="text-xl font-bold text-[#071b4d]">{referenceCode}</p>
                  </div>
                  <div className="mt-4 sm:mt-0 text-left sm:text-right">
                    <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">Status</p>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-green-100 text-green-800">
                      Processing
                    </span>
                  </div>
                </div>

                <div className="space-y-6 mb-10">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">Plan Purchased</p>
                      <p className="text-lg font-bold text-gray-900">{planName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">Service Address</p>
                      <p className="text-base font-medium text-gray-800">{streetAddress || "Address not provided"}</p>
                    </div>
                  </div>
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
                    <p className="text-xs text-[#1557b8] uppercase tracking-widest font-bold mb-1">Next Steps</p>
                    <p className="text-sm text-gray-800 font-medium">We'll contact you within 24 hours to confirm your final appointment time. Keep an eye on your email.</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center gap-4 pt-6 border-t border-gray-200">
                  <Link href="/portal" className="w-full sm:w-auto flex-1 text-center bg-[#ffc400] hover:bg-[#e6af00] text-[#071b4d] px-8 py-4 rounded-full font-extrabold text-sm uppercase tracking-wider transition-colors shadow-md">
                    Go to My Portal ›
                  </Link>
                  <Link href="/" className="w-full sm:w-auto flex-1 text-center px-8 py-4 rounded-full font-extrabold text-sm uppercase tracking-wider text-gray-500 hover:text-[#071b4d] hover:bg-gray-50 transition-colors">
                    Back to Home
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="header-container checkout-layout max-w-6xl mx-auto px-4 sm:px-6">

            {/* Left Steps Bar — Readable font sizes */}
            <div className="checkout-steps space-y-6">
              <div className={`flex items-center gap-3.5 ${step > 1 ? "done" : step === 1 ? "active" : ""}`}>
                <span className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-base border-2 ${step === 1 ? "border-[#ffc400] bg-[#071b4d] text-white" : step > 1 ? "border-[#17824b] bg-[#17824b] text-white" : "border-slate-300 text-slate-500"}`}>
                  {step > 1 ? "✓" : "1"}
                </span>
                <div>
                  <strong className="text-base font-extrabold text-[#071b4d] block leading-tight">Customer Info</strong>
                  <small className="text-xs text-slate-500 font-semibold block mt-0.5">Contact details</small>
                </div>
              </div>

              <div className={`flex items-center gap-3.5 ${step > 2 ? "done" : step === 2 ? "active" : ""}`}>
                <span className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-base border-2 ${step === 2 ? "border-[#ffc400] bg-[#071b4d] text-white" : step > 2 ? "border-[#17824b] bg-[#17824b] text-white" : "border-slate-300 text-slate-500"}`}>
                  {step > 2 ? "✓" : "2"}
                </span>
                <div>
                  <strong className="text-base font-extrabold text-[#071b4d] block leading-tight">Schedule</strong>
                  <small className="text-xs text-slate-500 font-semibold block mt-0.5">Time &amp; access</small>
                </div>
              </div>

              <div className={`flex items-center gap-3.5 ${step === 3 ? "active" : ""}`}>
                <span className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-base border-2 ${step === 3 ? "border-[#ffc400] bg-[#071b4d] text-white" : "border-slate-300 text-slate-500"}`}>
                  3
                </span>
                <div>
                  <strong className="text-base font-extrabold text-[#071b4d] block leading-tight">Payment</strong>
                  <small className="text-xs text-slate-500 font-semibold block mt-0.5">Secure checkout</small>
                </div>
              </div>
            </div>
            
            {/* Center Form Area — Default comfortable font sizing */}
            <div className="checkout-form-area">
              {step === 1 && (
                <form className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 sm:p-10 space-y-6" onSubmit={handleNext}>
                  <header className="mb-6">
                    <p className="text-xs sm:text-sm font-black text-[#1557b8] uppercase tracking-wider mb-1">Step 1 of 3</p>
                    <h1 className="text-2xl sm:text-3xl font-black text-[#071b4d] tracking-tight mb-1">Let's get started</h1>
                    <span className="text-sm sm:text-base text-slate-600 font-medium">Please provide your contact information.</span>
                  </header>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-xs sm:text-sm font-bold text-[#071b4d] mb-1.5 block uppercase tracking-wider">First Name</label>
                      <input type="text" required className="w-full h-11 sm:h-12 px-4 rounded-xl border border-slate-300 text-sm sm:text-base font-medium text-slate-900 bg-slate-50/80 outline-none focus:border-[#1557b8] focus:bg-white transition-all" />
                    </div>
                    <div>
                      <label className="text-xs sm:text-sm font-bold text-[#071b4d] mb-1.5 block uppercase tracking-wider">Last Name</label>
                      <input type="text" required className="w-full h-11 sm:h-12 px-4 rounded-xl border border-slate-300 text-sm sm:text-base font-medium text-slate-900 bg-slate-50/80 outline-none focus:border-[#1557b8] focus:bg-white transition-all" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-xs sm:text-sm font-bold text-[#071b4d] mb-1.5 block uppercase tracking-wider">Email Address</label>
                      <input type="email" required className="w-full h-11 sm:h-12 px-4 rounded-xl border border-slate-300 text-sm sm:text-base font-medium text-slate-900 bg-slate-50/80 outline-none focus:border-[#1557b8] focus:bg-white transition-all" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-xs sm:text-sm font-bold text-[#071b4d] mb-1.5 block uppercase tracking-wider">Phone Number</label>
                      <input type="tel" required className="w-full h-11 sm:h-12 px-4 rounded-xl border border-slate-300 text-sm sm:text-base font-medium text-slate-900 bg-slate-50/80 outline-none focus:border-[#1557b8] focus:bg-white transition-all" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-xs sm:text-sm font-bold text-[#071b4d] mb-1.5 block uppercase tracking-wider">Service Address</label>
                      <input 
                        type="text" 
                        value={inputAddress} 
                        onChange={(e) => setInputAddress(e.target.value)} 
                        required 
                        className="w-full h-11 sm:h-12 px-4 rounded-xl border border-slate-300 text-sm sm:text-base font-medium text-slate-900 bg-slate-50/80 outline-none focus:border-[#1557b8] focus:bg-white transition-all" 
                      />
                      {validationError && (
                        <p className="mt-2 text-xs font-semibold text-red-600">⚠️ {validationError}</p>
                      )}
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-xs sm:text-sm font-bold text-[#071b4d] mb-1.5 block uppercase tracking-wider">Property Type</label>
                      <select required className="w-full h-11 sm:h-12 px-4 rounded-xl border border-slate-300 text-sm sm:text-base font-medium text-slate-900 bg-slate-50/80 outline-none focus:border-[#1557b8] focus:bg-white transition-all">
                        <option value="single">Single Family Home</option>
                        <option value="condo">Condo/Apartment</option>
                        <option value="townhouse">Townhouse</option>
                        <option value="multi">Multi-Family</option>
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-xs sm:text-sm font-bold text-[#071b4d] mb-1.5 block uppercase tracking-wider">Pest concern (optional)</label>
                      <textarea rows={3} placeholder="Tell us what you're seeing..." className="w-full p-4 rounded-xl border border-slate-300 text-sm sm:text-base font-medium text-slate-900 bg-slate-50/80 outline-none focus:border-[#1557b8] focus:bg-white transition-all" />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-slate-200">
                    <button 
                      type="submit" 
                      disabled={isValidating}
                      className="bg-[#ffc400] hover:bg-[#e6af00] text-[#071b4d] font-black text-sm sm:text-base px-8 py-3.5 rounded-full shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:bg-slate-300 disabled:cursor-not-allowed"
                    >
                      {isValidating ? "Verifying address..." : <>Continue to Schedule <ArrowRightIcon className="w-5 h-5" /></>}
                    </button>
                  </div>
                </form>
              )}

              {step === 2 && (
                <form className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 sm:p-10 space-y-6" onSubmit={handleNext}>
                  <header className="mb-6">
                    <p className="text-xs sm:text-sm font-black text-[#1557b8] uppercase tracking-wider mb-1">Step 2 of 3</p>
                    <h1 className="text-2xl sm:text-3xl font-black text-[#071b4d] tracking-tight mb-1">When works best for you?</h1>
                    <span className="text-sm sm:text-base text-slate-600 font-medium">Choose a preferred date for your initial service.</span>
                  </header>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-xs sm:text-sm font-bold text-[#071b4d] mb-1.5 block uppercase tracking-wider">Preferred Date</label>
                      <input type="date" required className="w-full h-11 sm:h-12 px-4 rounded-xl border border-slate-300 text-sm sm:text-base font-medium text-slate-900 bg-slate-50/80 outline-none focus:border-[#1557b8] focus:bg-white transition-all" />
                    </div>
                    <div>
                      <label className="text-xs sm:text-sm font-bold text-[#071b4d] mb-1.5 block uppercase tracking-wider">Arrival Window</label>
                      <select required className="w-full h-11 sm:h-12 px-4 rounded-xl border border-slate-300 text-sm sm:text-base font-medium text-slate-900 bg-slate-50/80 outline-none focus:border-[#1557b8] focus:bg-white transition-all">
                        <option value="8-12">8am - 12pm</option>
                        <option value="12-4">12pm - 4pm</option>
                        <option value="4-6">4pm - 6pm</option>
                        <option value="flexible">Flexible</option>
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-xs sm:text-sm font-bold text-[#071b4d] mb-1.5 block uppercase tracking-wider">Alternate Date (Optional)</label>
                      <input type="date" className="w-full h-11 sm:h-12 px-4 rounded-xl border border-slate-300 text-sm sm:text-base font-medium text-slate-900 bg-slate-50/80 outline-none focus:border-[#1557b8] focus:bg-white transition-all" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-xs sm:text-sm font-bold text-[#071b4d] mb-1.5 block uppercase tracking-wider">Access Notes</label>
                      <textarea rows={3} placeholder="Gate codes, dogs in yard, etc." className="w-full p-4 rounded-xl border border-slate-300 text-sm sm:text-base font-medium text-slate-900 bg-slate-50/80 outline-none focus:border-[#1557b8] focus:bg-white transition-all" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                    <button type="button" onClick={() => setStep(1)} className="text-sm font-bold text-[#1557b8] hover:underline cursor-pointer">← Back</button>
                    <button type="submit" className="bg-[#ffc400] hover:bg-[#e6af00] text-[#071b4d] font-black text-sm sm:text-base px-8 py-3.5 rounded-full shadow-md transition-all flex items-center gap-2 cursor-pointer">
                      Continue to Payment <ArrowRightIcon className="w-5 h-5" />
                    </button>
                  </div>
                </form>
              )}

              {step === 3 && (
                <form className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 sm:p-10 space-y-6" onSubmit={handleProcessPayment}>
                  <header className="mb-6">
                    <p className="text-xs sm:text-sm font-black text-[#1557b8] uppercase tracking-wider mb-1">Step 3 of 3</p>
                    <h1 className="text-2xl sm:text-3xl font-black text-[#071b4d] tracking-tight mb-1">Complete your subscription</h1>
                    <span className="text-sm sm:text-base text-slate-600 font-medium">Your first service is {initialFee}. Recurring monthly rate: {monthlyRate}/month after first service. Cancel anytime.</span>
                  </header>
                  
                  <div className="border border-slate-300 rounded-2xl p-6 bg-slate-50/80 relative mb-6 shadow-inner">
                    <div className="absolute top-4 right-4 flex items-center gap-1.5 text-slate-500 text-xs font-bold">
                      <LockIcon className="w-4 h-4 text-[#17824b]" /> Powered by Stripe
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-4">
                      <div className="sm:col-span-2">
                        <label className="text-xs sm:text-sm font-bold text-[#071b4d] mb-1.5 block uppercase tracking-wider">Card Number</label>
                        <input type="text" placeholder="4242 4242 4242 4242" required className="w-full h-12 px-4 rounded-xl border border-slate-300 font-mono tracking-widest text-base font-bold text-slate-900 bg-white outline-none focus:border-[#1557b8] transition-all" />
                      </div>
                      <div>
                        <label className="text-xs sm:text-sm font-bold text-[#071b4d] mb-1.5 block uppercase tracking-wider">Expiration (MM/YY)</label>
                        <input type="text" placeholder="MM/YY" required className="w-full h-12 px-4 rounded-xl border border-slate-300 font-mono tracking-widest text-base font-bold text-slate-900 bg-white outline-none focus:border-[#1557b8] transition-all" />
                      </div>
                      <div>
                        <label className="text-xs sm:text-sm font-bold text-[#071b4d] mb-1.5 block uppercase tracking-wider">CVC</label>
                        <input type="text" placeholder="123" required className="w-full h-12 px-4 rounded-xl border border-slate-300 font-mono tracking-widest text-base font-bold text-slate-900 bg-white outline-none focus:border-[#1557b8] transition-all" />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-xs sm:text-sm font-bold text-[#071b4d] mb-1.5 block uppercase tracking-wider">Cardholder Name</label>
                        <input type="text" placeholder="Name on card" required className="w-full h-12 px-4 rounded-xl border border-slate-300 text-sm sm:text-base font-medium text-slate-900 bg-white outline-none focus:border-[#1557b8] transition-all" />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-xs sm:text-sm font-bold text-[#071b4d] mb-1.5 block uppercase tracking-wider">Billing ZIP</label>
                        <input type="text" placeholder="ZIP code" required className="w-full h-12 px-4 rounded-xl border border-slate-300 text-sm sm:text-base font-medium text-slate-900 bg-white outline-none focus:border-[#1557b8] transition-all" />
                      </div>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={isProcessing}
                    className={`w-full text-white py-4 rounded-full font-extrabold text-base sm:text-lg flex justify-center items-center gap-3 transition-all shadow-md cursor-pointer ${isProcessing ? 'bg-slate-400 cursor-not-allowed' : 'bg-[#17824b] hover:bg-[#146b3f]'}`}
                  >
                    {isProcessing ? (
                      <>
                        <SpinnerIcon /> Processing payment...
                      </>
                    ) : (
                      `Subscribe — ${monthlyRate}/month`
                    )}
                  </button>
                  <p className="text-center text-xs sm:text-sm text-slate-600 mt-4 flex items-center justify-center gap-1 font-medium">
                    <LockIcon className="w-4 h-4 text-[#17824b]" /> Your payment info is encrypted and secure. You can cancel anytime from your portal.
                  </p>

                  <div className="flex justify-start pt-2">
                    <button type="button" onClick={() => setStep(2)} disabled={isProcessing} className="text-sm font-bold text-[#1557b8] hover:underline cursor-pointer">← Back</button>
                  </div>
                </form>
              )}
            </div>
            
            {/* Right Order Summary Sidebar — High legibility font sizes */}
            <aside className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 space-y-6 sticky top-6">
              <div className="flex items-center gap-2 text-[#071b4d] border-b border-slate-100 pb-4">
                <ShieldIcon className="w-6 h-6 text-[#071b4d]" /> <span className="font-black text-xl tracking-tight">PestIQ</span>
              </div>
              
              <div>
                <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-1 block">Your Order</span>
                <h2 className="text-xl sm:text-2xl font-black text-[#071b4d]">{planName}</h2>
                
                <div className="text-sm text-slate-700 mt-2 font-medium leading-relaxed">
                  {streetAddress ? (
                    <p className="font-bold">{streetAddress}</p>
                  ) : (
                    <p className="text-slate-400">Address not provided</p>
                  )}
                  <p className="text-xs text-slate-500 font-semibold mt-0.5">{propertySqFt ? `${propertySqFt} sq ft` : 'TBD'}</p>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-4 space-y-3">
                <div className="flex justify-between text-sm sm:text-base font-semibold">
                  <span className="text-slate-600">Initial Service Fee</span>
                  <strong className="text-[#071b4d] font-black">{initialFee}</strong>
                </div>
                <div className="flex justify-between text-sm sm:text-base font-semibold">
                  <span className="text-slate-600">Monthly Rate</span>
                  <strong className="text-[#071b4d] font-black">{monthlyRate}</strong>
                </div>
              </div>

              <div className="bg-[#e9f1fb] border border-[#b9c0ca] rounded-xl p-4">
                <div className="flex items-start gap-2.5">
                  <CheckCircleIcon className="text-[#17824b] w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#071b4d] text-sm font-extrabold block mb-1">No payment collected today</strong>
                    <p className="text-slate-600 text-xs leading-relaxed">Your appointment request will be reviewed before confirmation.</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-4">
                <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-3 block">Your Protection</span>
                <ul className="space-y-2.5">
                  <li className="flex gap-2 text-xs sm:text-sm text-slate-700 font-bold">
                    <CheckIcon className="text-[#17824b] w-4 h-4 flex-shrink-0 mt-0.5" /> PestIQ Guarantee included
                  </li>
                  <li className="flex gap-2 text-xs sm:text-sm text-slate-700 font-bold">
                    <CheckIcon className="text-[#17824b] w-4 h-4 flex-shrink-0 mt-0.5" /> Licensed technician dispatched
                  </li>
                  <li className="flex gap-2 text-xs sm:text-sm text-slate-700 font-bold">
                    <CheckIcon className="text-[#17824b] w-4 h-4 flex-shrink-0 mt-0.5" /> Service notes provided after each visit
                  </li>
                </ul>
              </div>

              <div className="border-t border-slate-200 pt-4">
                <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-2 block">Trust Signals</span>
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="flex text-[#ffc400]">
                    <StarIcon /><StarIcon /><StarIcon /><StarIcon /><StarHalfIcon />
                  </div>
                  <span className="text-sm font-black text-slate-800 ml-1">4.5</span>
                </div>
                <p className="text-xs text-slate-500 font-medium">Rated by 89,000+ customers</p>
              </div>
            </aside>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
