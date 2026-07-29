"use client";

import React, { useState } from "react";
import { Phone, Mail, Clock, MapPin, Send, CheckCircle2 } from "lucide-react";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email && message) {
      setSubmitted(true);
      setTimeout(() => {
        setName("");
        setEmail("");
        setMessage("");
      }, 2000);
    }
  };

  return (
    <div className="site-shell site-v3 min-h-screen bg-white font-sans">
      <Header />
      <main className="w-full bg-white py-12 px-4 sm:px-8">

      <div className="max-w-[1100px] mx-auto">
        
        {/* Header Block */}
        <header className="mb-12 text-center max-w-2xl mx-auto">
          <span className="text-[12px] uppercase tracking-widest font-extrabold text-primary-green">Customer Channels</span>
          <h1 className="text-[34px] sm:text-[40px] font-extrabold text-dark-slate leading-tight mt-1">
            We are here to coordinate your service.
          </h1>
          <p className="text-zinc-500 text-[14.5px] mt-2">
            Reach out via phone, email, or through our quick support form below. We typically reply within 2 hours during active support slots.
          </p>
        </header>

        {/* Form and Sidebar Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Contact Form (Left) */}
          <div className="lg:col-span-7 bg-zinc-50 border border-border-gray p-6 sm:p-8 rounded-lg shadow-sm">
            {submitted ? (
              <div className="text-center py-10 flex flex-col items-center gap-4 animate-in zoom-in-95">
                <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center border border-emerald-100">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <strong className="text-[20px] font-extrabold text-dark-slate">Message Sent Successfully!</strong>
                <p className="text-zinc-500 text-[13.5px] max-w-[340px] mx-auto leading-normal">
                  Thank you for reaching out. A PestIQ coordinator will review your message and contact you shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-4 py-2 border border-zinc-300 hover:border-zinc-400 text-zinc-650 rounded font-bold text-[12px] transition-smooth mt-2"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <h2 className="text-[18px] font-extrabold text-dark-slate mb-1">Send a Message</h2>
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12.5px] font-bold text-zinc-500 uppercase tracking-wider">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Jane Doe"
                    className="px-3.5 py-2.5 border border-zinc-300 rounded text-[14px] bg-white focus:outline-none focus:border-primary-green text-zinc-800 font-medium"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[12.5px] font-bold text-zinc-500 uppercase tracking-wider">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. jane@domain.com"
                    className="px-3.5 py-2.5 border border-zinc-300 rounded text-[14px] bg-white focus:outline-none focus:border-primary-green text-zinc-800 font-medium"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[12.5px] font-bold text-zinc-500 uppercase tracking-wider">Message *</label>
                  <textarea
                    rows={5}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="How can we help? (e.g. questions about pest exclusions, custom commercial services)"
                    className="px-3.5 py-2.5 border border-zinc-300 rounded text-[14px] bg-white focus:outline-none focus:border-primary-green text-zinc-800 font-medium"
                  />
                </div>

                <button
                  type="submit"
                  className="px-5 py-3 bg-primary-green hover:bg-primary-green-dark text-white rounded font-bold text-[14px] transition-smooth flex items-center justify-center gap-2 self-start w-full sm:w-auto"
                >
                  <Send className="w-4 h-4" />
                  Submit Message
                </button>
              </form>
            )}
          </div>

          {/* Channels Sidebar (Right) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Quick Contacts */}
            <div className="border border-border-gray rounded-lg p-5 flex flex-col gap-4">
              <h2 className="text-[16px] font-extrabold text-zinc-800 uppercase tracking-wider border-b border-border-gray pb-3">
                Direct Channels
              </h2>
              
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-primary-green flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[14px] text-zinc-850 block">Customer Phone</strong>
                  <a href="tel:+12125550148" className="text-[15px] font-bold text-primary-green hover:underline mt-0.5 block">
                    (212) 555-0148
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary-green flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[14px] text-zinc-850 block">Support Email</strong>
                  <a href="mailto:hello@pestiqsolutions.com" className="text-[14px] text-zinc-600 hover:text-primary-green transition-colors mt-0.5 block">
                    hello@pestiqsolutions.com
                  </a>
                </div>
              </div>
            </div>

            {/* Operating Hours */}
            <div className="border border-border-gray rounded-lg p-5 flex flex-col gap-4 bg-zinc-50/50">
              <h2 className="text-[16px] font-extrabold text-zinc-800 uppercase tracking-wider border-b border-border-gray pb-3">
                Support Hours
              </h2>
              
              <div className="flex items-start gap-3 text-[13px] text-zinc-600">
                <Clock className="w-5 h-5 text-primary-green flex-shrink-0" />
                <div>
                  <strong className="text-zinc-800 font-bold block">Office Coordination:</strong>
                  <span className="block mt-0.5">Monday – Saturday: 7:00 am – 7:00 pm</span>
                  <span className="block">Sunday: 9:00 am – 4:00 pm</span>
                </div>
              </div>
            </div>

            {/* Covered Areas list */}
            <div className="border border-border-gray rounded-lg p-5 flex flex-col gap-3">
              <div className="flex items-center gap-2 border-b border-border-gray pb-3">
                <MapPin className="w-5 h-5 text-primary-green" />
                <h2 className="text-[16px] font-extrabold text-zinc-800 uppercase tracking-wider">
                  Service Counties
                </h2>
              </div>
              <ul className="text-[13px] text-zinc-600 flex flex-col gap-1.5 font-medium">
                <li>• New York City boroughs (Manhattan, Brooklyn, Bronx, Queens, Staten Island)</li>
                <li>• Lower Westchester (Yonkers, Mount Vernon, New Rochelle, White Plains)</li>
                <li>• Ocean County, NJ (Lakewood, Brick Township, Toms River)</li>
              </ul>
            </div>

          </div>

        </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
