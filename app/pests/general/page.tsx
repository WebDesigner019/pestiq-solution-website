"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLocation } from "@/context/LocationContext";
import Link from "next/link";
import { 
  Star, ShieldCheck, HeartPulse, Home, SprayCan, Crosshair, TrendingDown,
  Check, ChevronDown, ChevronUp, ChevronLeft, ChevronRight
} from "lucide-react";

const StarRating = () => (
  <div className="flex text-[#ffc400]">
    <Star className="w-4 h-4 fill-current" />
    <Star className="w-4 h-4 fill-current" />
    <Star className="w-4 h-4 fill-current" />
    <Star className="w-4 h-4 fill-current" />
    <Star className="w-4 h-4 fill-current" style={{ clipPath: "inset(0 50% 0 0)" }} />
  </div>
);

export default function GeneralPestControlPage() {
  const { setIsAddressModalOpen } = useLocation();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [activePestTab, setActivePestTab] = useState("Ants");

  const faqs = [
    {
      q: "What is pest control or pest treatment?",
      a: "At PestIQ, our pest control services offer uniquely tailored solutions to your individual needs. Depending on the type of pest, we'll have a specific treatment designed to eliminate an existing issue. In general, our pest control plans include an initial comprehensive interior and exterior inspection and treatment, ongoing exterior treatments scheduled regularly, and guaranteed protection for as long as you keep your plan. If pests come back between treatments, so will we - at no additional cost to you."
    },
    { q: "How often will I be serviced and billed?", a: "Your billing and service frequency depends on your specific plan. Most of our comprehensive plans feature quarterly service visits with monthly billing to keep things predictable and affordable." },
    { q: "Which pests are covered with PestIQ pest control?", a: "Our PestFree365+ plan covers over 39 common household pests including ants, spiders, roaches, mice, rats, centipedes, millipedes, silverfish, earwigs, and more." },
    { q: "How does pest control work?", a: "We start with a thorough inspection of your property to identify pests, entry points, and conducive conditions. We then develop a customized treatment plan using targeted applications to eliminate current pests and establish a protective barrier against future infestations." },
    { q: "How much does PestIQ pest control cost?", a: "Costs vary based on your location, property size, and the specific pest issues you're facing. Our starting plans generally cost around $40-$60 per month after an initial service fee. We recommend getting a customized quote." },
    { q: "Can you DIY pest control?", a: "While DIY methods can sometimes offer temporary relief for very minor issues, they often fail to eliminate the root cause or the entire nest. Professional pest control provides specialized products, targeted application techniques, and ongoing prevention that DIY solutions simply can't match." },
    { q: "How do I get started with pest control?", a: "Getting started is easy! Just enter your address in our search tool above, choose the plan that best fits your needs, and schedule your initial service. You can also give us a call for a custom consultation." },
    { q: "Is professional pest control worth it?", a: "Yes. Professional pest control not only eliminates nuisance pests but also protects your home from costly damage (like termites or rodents) and safeguards your family's health from disease-carrying insects. The peace of mind alone is worth the investment." }
  ];

  const pestLibrary = [
    { name: "Ants", image: "/images/ant-macro.jpg", title: "If ants come marching in, we'll help send them packing.", desc: "Ants are common insects that can be found in most parts of the world. While there are many different species of ants, all ants have a few defining characteristics. They have bodies with three sections: a head, an abdomen and a thorax. In addition, all ants have six legs and bent antennae." },
    { name: "Cockroaches", image: "/images/cockroach.jpg", title: "Keep roaches out of your kitchen.", desc: "Cockroaches are resilient pests that can contaminate food and spread disease. Our targeted treatments get to the source." },
    { name: "Bed Bugs", image: "/images/bedroom.jpg", title: "Sleep tight, don't let the bed bugs bite.", desc: "Bed bugs are notoriously difficult to eliminate. We use specialized techniques to ensure your home is completely bed bug free." },
    { name: "Mice & Rats", image: "/images/rodent.jpg", title: "Stop rodents in their tracks.", desc: "Rodents can cause structural damage and pose health risks. We focus on exclusion and elimination." },
    { name: "Termites", image: "/images/suburban-houses.png", title: "Protect your biggest investment.", desc: "Termites silently destroy wood structures. We offer advanced baiting and liquid treatments to stop them." },
    { name: "Spiders", image: "/images/spider.jpg", title: "Clear the webs and keep spiders away.", desc: "We knock down webs and apply perimeter treatments to keep spiders outside where they belong." }
  ];

  const currentPest = pestLibrary.find(p => p.name === activePestTab) || pestLibrary[0];

  return (
    <div className="site-shell site-v3 font-sans bg-white">
      <Header />
      <main className="w-full">
        {/* HERO SECTION */}
        <section className="relative w-full min-h-[420px] md:h-[600px] py-12 md:py-0 flex items-center bg-gray-900 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image 
              src="/images/pestiq-technician-home.jpg" 
              alt="Pest Technician" 
              fill
              className="object-cover opacity-70 object-center"
              priority
              sizes="100vw"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent z-10"></div>
          <div className="relative z-20 max-w-7xl mx-auto px-4 md:px-8 w-full">
            <div className="text-white max-w-xl">
              <h1 className="text-4xl md:text-6xl font-black mb-6 leading-[1.1] tracking-tight">
                Your home.<br />Your peace.<br />Your pest control.
              </h1>
              <p className="text-lg md:text-xl font-bold mb-2">Trusted | Safe | Guaranteed</p>
              <p className="text-base md:text-lg mb-8 font-medium max-w-md opacity-90">
                Expert pest control that gets rid of pests and keeps them from coming back.
              </p>
              
              <button 
                onClick={() => setIsAddressModalOpen(true)}
                className="bg-[#ffc400] hover:bg-[#e6af00] text-[#071b4d] font-extrabold text-[15px] uppercase tracking-wider px-8 py-4 rounded-full shadow-lg transition-all mb-6"
              >
                Choose Your Plan ›
              </button>
              
              <div className="flex items-center gap-3">
                <StarRating />
                <span className="font-bold text-sm">4.5</span>
                <span className="text-xs font-semibold underline hover:text-[#ffc400] cursor-pointer transition-colors opacity-80">Based on 89k verified reviews</span>
              </div>
            </div>
          </div>
        </section>

        {/* PROMO BANNER */}
        <section className="max-w-7xl mx-auto px-4 md:px-8 relative z-30 -mt-12 md:-mt-24 mb-16">
          <div className="bg-white shadow-2xl flex flex-col md:flex-row overflow-hidden border-t-4 border-[#17824b]">
            <div className="p-8 md:p-12 flex-1 flex flex-col justify-center">
              <h2 className="text-2xl md:text-3xl font-black text-[#071b4d] mb-4 uppercase italic tracking-tight">Save $50 on Pest Control!</h2>
              <p className="text-gray-700 font-medium mb-8 text-lg">
                Save <strong className="font-bold text-[#071b4d]">$50</strong> on your initial pest control service. Use code <strong className="font-bold text-[#071b4d]">SAVE50</strong> at checkout!
              </p>
              <button 
                onClick={() => setIsAddressModalOpen(true)}
                className="bg-[#ffc400] hover:bg-[#e6af00] text-[#071b4d] font-extrabold text-[13px] uppercase tracking-wider px-8 py-3.5 rounded-full shadow-sm transition-all w-fit"
              >
                Get started ›
              </button>
            </div>
            <div className="md:w-[45%] bg-gray-200 relative min-h-[250px]">
               <div className="absolute top-4 right-4 bg-[#17824b] text-white text-[10px] font-black px-3 py-1 uppercase tracking-widest z-10 rounded-sm shadow-sm">
                 Summer Savings
               </div>
               <Image src="/images/family-lawn.jpg" alt="Family on lawn" fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
            </div>
          </div>
        </section>

        {/* PROTECT WHAT MATTERS MOST */}
        <section className="bg-[#071b4d] py-20 px-4">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Protect what matters most</h2>
            <p className="text-blue-100 font-medium mb-12 text-sm md:text-base">
              Pests don't just invade — they threaten your home, health, and peace of mind. That's why thousands trust PestIQ.
            </p>

            <div className="bg-white rounded-xl shadow-2xl p-6 md:p-10 text-left">
              <div className="space-y-6">
                <div className="flex items-start gap-5 pb-6 border-b border-gray-100">
                  <HeartPulse className="w-8 h-8 text-[#1557b8] shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-[#071b4d] text-lg mb-1">Health and safety first</h3>
                    <p className="text-gray-600 text-sm font-medium">Rodents and roaches carry bacteria, allergens, and disease.</p>
                  </div>
                </div>
                <div className="flex items-start gap-5 pb-6 border-b border-gray-100">
                  <Home className="w-8 h-8 text-[#1557b8] shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-[#071b4d] text-lg mb-1">Damage control</h3>
                    <p className="text-gray-600 text-sm font-medium">Pests silently destroy wiring, walls, and insulation — fast.</p>
                  </div>
                </div>
                <div className="flex items-start gap-5 pb-6 border-b border-gray-100">
                  <SprayCan className="w-8 h-8 text-[#1557b8] shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-[#071b4d] text-lg mb-1">DIY isn't enough</h3>
                    <p className="text-gray-600 text-sm font-medium">Most home remedies treat symptoms, not the source.</p>
                  </div>
                </div>
                <div className="flex items-start gap-5 pb-6 border-b border-gray-100">
                  <Crosshair className="w-8 h-8 text-[#1557b8] shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-[#071b4d] text-lg mb-1">Targeted solutions</h3>
                    <p className="text-gray-600 text-sm font-medium">Our experts design custom treatment plans tailored to your pest problem.</p>
                  </div>
                </div>
                <div className="flex items-start gap-5">
                  <TrendingDown className="w-8 h-8 text-[#1557b8] shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-[#071b4d] text-lg mb-1">Prevention saves money</h3>
                    <p className="text-gray-600 text-sm font-medium">Stop infestations early and avoid costly repairs later.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PRICING CARDS */}
        <section className="bg-gray-50 py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-black text-[#071b4d] mb-4">Ongoing pest protection</h2>
              <p className="text-[#1557b8] font-bold text-lg mb-8">Introducing PestFree365 and PestFree365+.</p>
              <div className="flex flex-col md:flex-row items-center justify-center gap-6 max-w-4xl mx-auto text-left md:text-center">
                <div className="w-24 h-24 shrink-0 rounded-full border-[3px] border-[#17824b] flex flex-col items-center justify-center text-[#17824b]">
                  <span className="text-3xl font-black leading-none">365</span>
                  <span className="text-[9px] font-bold tracking-widest uppercase mt-1">Protection</span>
                </div>
                <p className="text-gray-600 text-sm font-medium leading-relaxed max-w-2xl text-left">
                  As a <a href="#" className="text-blue-600 underline">pest control company</a> with over 90 years of experience, we understand the value of protecting your home and family. Introducing PestFree365 — PestIQ's exclusive year-round preventative pest control program that helps keep your home and family protected from many common household pests. Our PestFree365 plans are backed by highly trained, local pest exterminators and cutting-edge technology for peace of mind all year long. What's your pest control plan this year? <a href="#" className="text-[#17824b] font-bold underline">Learn more about PestFree365 ›</a>
                </p>
              </div>
            </div>

            <h3 className="text-2xl font-black text-center text-[#071b4d] mb-10">Get started with pest control.</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {/* Card 1 */}
              <div className="bg-white border-2 border-gray-200 p-8 rounded-lg flex flex-col hover:border-gray-300 transition-colors">
                <div className="text-center mb-8">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Better Protection</p>
                  <h4 className="text-2xl font-black text-[#071b4d]">PestFree365 Plan</h4>
                </div>
                <ul className="space-y-4 mb-10 flex-1">
                  <li className="flex items-start gap-3"><Check className="w-5 h-5 text-[#17824b] shrink-0" /><span className="text-sm font-medium text-gray-700">Interior and exterior pest inspection</span></li>
                  <li className="flex items-start gap-3"><Check className="w-5 h-5 text-[#17824b] shrink-0" /><span className="text-sm font-medium text-gray-700">Protection from 25 common household pests²</span></li>
                  <li className="flex items-start gap-3"><Check className="w-5 h-5 text-[#17824b] shrink-0" /><span className="text-sm font-medium text-gray-700">Regularly scheduled pest treatments</span></li>
                  <li className="flex items-start gap-3"><Check className="w-5 h-5 text-[#17824b] shrink-0" /><span className="text-sm font-medium text-gray-700">PestIQ Guarantee which means if pests come back between treatments, so will we — at no additional cost⁴</span></li>
                </ul>
                <button onClick={() => setIsAddressModalOpen(true)} className="w-full bg-[#ffc400] hover:bg-[#e6af00] text-[#071b4d] font-extrabold text-[13px] uppercase tracking-wider py-4 rounded-full shadow-sm transition-all">
                  See Pricing
                </button>
              </div>

              {/* Card 2 (Featured) */}
              <div className="bg-white border-2 border-[#17824b] p-8 rounded-lg flex flex-col relative shadow-2xl">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#071b4d] text-white px-5 py-1.5 font-bold text-[11px] uppercase tracking-widest flex items-center gap-1.5 shadow-md whitespace-nowrap">
                  <Star className="w-3 h-3 fill-current" /> Best Protection
                </div>
                <div className="text-center mb-8 mt-2">
                  <h4 className="text-3xl font-black text-[#071b4d]">PestFree365+ Plan</h4>
                </div>
                <ul className="space-y-4 mb-10 flex-1">
                  <li className="flex items-start gap-3"><Check className="w-5 h-5 text-[#17824b] shrink-0" /><span className="text-sm font-medium text-gray-700">Interior and exterior pest inspection</span></li>
                  <li className="flex items-start gap-3"><Check className="w-5 h-5 text-[#17824b] shrink-0" /><span className="text-sm font-medium text-gray-700">Protection from 39 pests,² including 14 pests that may be costly to eliminate⁵</span></li>
                  <li className="flex items-start gap-3"><Check className="w-5 h-5 text-[#17824b] shrink-0" /><span className="text-sm font-medium text-gray-700">Regularly scheduled pest treatments</span></li>
                  <li className="flex items-start gap-3"><Check className="w-5 h-5 text-[#17824b] shrink-0" /><span className="text-sm font-medium text-gray-700">PestIQ Guarantee which means if pests come back between treatments, so will we — at no additional cost⁴</span></li>
                </ul>
                <button onClick={() => setIsAddressModalOpen(true)} className="w-full bg-[#ffc400] hover:bg-[#e6af00] text-[#071b4d] font-extrabold text-[13px] uppercase tracking-wider py-4 rounded-full shadow-sm transition-all">
                  See Pricing
                </button>
              </div>

              {/* Card 3 */}
              <div className="bg-white border-2 border-gray-200 p-8 rounded-lg flex flex-col hover:border-gray-300 transition-colors">
                <div className="text-center mb-8">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Good Protection</p>
                  <h4 className="text-2xl font-black text-[#071b4d]">One-time Pest Plan</h4>
                </div>
                <ul className="space-y-4 mb-10 flex-1">
                  <li className="flex items-start gap-3"><Check className="w-5 h-5 text-[#17824b] shrink-0" /><span className="text-sm font-medium text-gray-700">Interior and exterior inspection</span></li>
                  <li className="flex items-start gap-3"><Check className="w-5 h-5 text-[#17824b] shrink-0" /><span className="text-sm font-medium text-gray-700">One pest treatment</span></li>
                  <li className="flex items-start gap-3"><Check className="w-5 h-5 text-[#17824b] shrink-0" /><span className="text-sm font-medium text-gray-700">PestIQ Guarantee which means if pests come back within 30 days of your treatment, so will we — at no additional cost⁶</span></li>
                </ul>
                <button onClick={() => setIsAddressModalOpen(true)} className="w-full bg-[#ffc400] hover:bg-[#e6af00] text-[#071b4d] font-extrabold text-[13px] uppercase tracking-wider py-4 rounded-full shadow-sm transition-all">
                  See Pricing
                </button>
              </div>
            </div>

            {/* Comparison Table */}
            <div className="max-w-4xl mx-auto mt-20">
              <h3 className="text-2xl font-black text-center text-[#071b4d] mb-10">Compare plans, feature-by-feature</h3>
              <div className="bg-white border border-gray-200 overflow-x-auto shadow-sm">
                <table className="w-full text-left text-sm font-medium">
                  <thead>
                    <tr className="bg-gray-100 border-b border-gray-200">
                      <th className="p-4 w-1/2"></th>
                      <th className="p-4 text-center bg-[#17824b] text-white font-bold border-r border-[#15612f]">PestFree365+</th>
                      <th className="p-4 text-center text-[#071b4d] border-r border-gray-200">PestFree365</th>
                      <th className="p-4 text-center text-[#071b4d]">One-Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-4 text-gray-800"><strong>Multipoint pest inspection</strong> including the interior and exterior of your home</td>
                      <td className="p-4 text-center border-r border-gray-100"><Check className="w-6 h-6 text-[#17824b] mx-auto" /></td>
                      <td className="p-4 text-center border-r border-gray-100"><Check className="w-6 h-6 text-[#17824b] mx-auto" /></td>
                      <td className="p-4 text-center"><Check className="w-6 h-6 text-[#17824b] mx-auto" /></td>
                    </tr>
                    <tr className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-4 text-gray-800"><strong>PestIQ Guarantee</strong> — we'll come back between treatments at no cost</td>
                      <td className="p-4 text-center border-r border-gray-100"><Check className="w-6 h-6 text-[#17824b] mx-auto" /></td>
                      <td className="p-4 text-center border-r border-gray-100"><Check className="w-6 h-6 text-[#17824b] mx-auto" /></td>
                      <td className="p-4 text-center text-xs text-gray-500">30 days only</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="p-4 text-gray-800"><strong>Protection from 39 pests</strong> including scorpions, wasps, and hornets</td>
                      <td className="p-4 text-center border-r border-gray-100"><Check className="w-6 h-6 text-[#17824b] mx-auto" /></td>
                      <td className="p-4 text-center border-r border-gray-100">-</td>
                      <td className="p-4 text-center">-</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* THREATS & REVIEWS */}
        <section className="bg-[#17824b] text-white">
          <div className="max-w-7xl mx-auto pt-16 pb-12 px-4 md:px-8">
            <h2 className="text-3xl md:text-5xl font-black text-center mb-2 tracking-tight">The PestIQ Difference</h2>
            <p className="text-center text-green-100 text-lg font-medium mb-12">Here's what our customers have to say...</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white text-gray-900 p-8 shadow-xl relative transform transition-transform hover:-translate-y-1">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-bold text-[#1557b8] text-sm">Customer {i}</h4>
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">New Jersey, NJ</p>
                    </div>
                    <div className="bg-blue-100 text-blue-700 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">G</div>
                  </div>
                  <StarRating />
                  <p className="text-sm font-medium text-gray-700 mt-4 leading-relaxed line-clamp-4">
                    "I had thousands of roaches when I moved in. I couldn't get rid of them no matter what I did. PestIQ solved the problem quickly and safely for my animals. Highly recommend!"
                  </p>
                  <p className="text-[10px] text-gray-400 mt-6 font-bold uppercase tracking-widest">2 Months Ago</p>
                </div>
              ))}
            </div>
            
            <div className="flex justify-center gap-4 mt-8">
              <button className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center hover:bg-white hover:text-[#17824b] transition-colors"><ChevronLeft className="w-5 h-5" /></button>
              <button className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center hover:bg-white hover:text-[#17824b] transition-colors"><ChevronRight className="w-5 h-5" /></button>
            </div>
          </div>
        </section>

        {/* NEWSLETTER */}
        <section className="bg-[#071b4d] py-8 px-4">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <h3 className="text-white font-bold text-lg md:text-xl text-center md:text-left">Sign up for deals and updates</h3>
            <form onSubmit={e => e.preventDefault()} className="flex w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter email"
                required
                className="px-5 py-3 rounded-l-md w-full md:w-72 outline-none text-sm font-medium bg-white text-gray-900 placeholder:text-gray-400"
              />
              <button
                type="submit"
                className="bg-[#17824b] hover:bg-[#136b3d] text-white px-6 py-3 rounded-r-md font-bold text-sm transition-colors uppercase tracking-wider"
              >
                Submit
              </button>
            </form>
          </div>
        </section>


        {/* PEST TABS */}
        <section className="py-20 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-black text-center text-[#071b4d] mb-12">
              Here are some of the most common pests we protect against
            </h2>
            
            <div className="flex flex-nowrap overflow-x-auto justify-start md:justify-center gap-4 md:gap-8 border-b border-gray-200 pb-0 mb-12 scrollbar-hide">
              {pestLibrary.map(pest => (
                <button 
                  key={pest.name}
                  onClick={() => setActivePestTab(pest.name)}
                  className={`pb-4 px-2 whitespace-nowrap transition-colors relative font-bold text-sm md:text-base ${activePestTab === pest.name ? "text-[#17824b]" : "text-gray-500 hover:text-gray-900"}`}
                >
                  {pest.name}
                  {activePestTab === pest.name && (
                    <span className="absolute bottom-0 left-0 w-full h-1 bg-[#17824b]"></span>
                  )}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto items-center">
              <div className="h-64 md:h-80 rounded-xl overflow-hidden shadow-lg border border-gray-100 relative">
                <Image src={currentPest.image} alt={currentPest.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
              </div>
              <div className="flex flex-col">
                <h3 className="text-2xl font-black text-[#1557b8] mb-4">{currentPest.title}</h3>
                <p className="text-gray-700 font-medium mb-4 leading-relaxed">{currentPest.desc}</p>
                <a href="#" className="text-[#17824b] font-bold underline mb-8 inline-block hover:text-[#15612f]">Learn more</a>
                
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mt-auto">
                  <p className="text-xs font-bold text-[#1557b8] uppercase tracking-widest mb-2">Did you know?</p>
                  <p className="text-xs text-gray-600 font-medium leading-relaxed">
                    An ant's caste, or position within the colony will ultimately determine its lifespan. Males, for example, only live for a few weeks and die after mating with a queen.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="bg-gray-50 py-20 px-4 border-t border-gray-200">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-black text-center text-[#071b4d] mb-12">
              Frequently asked pest control questions
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                  <button 
                    onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                    className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-bold text-[#071b4d] text-base">{faq.q}</span>
                    {activeFaq === index ? <ChevronUp className="w-5 h-5 text-gray-400 shrink-0" /> : <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />}
                  </button>
                  {activeFaq === index && (
                    <div className="px-6 pb-6 text-gray-600 font-medium text-sm leading-relaxed bg-white">
                      {faq.a}
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
