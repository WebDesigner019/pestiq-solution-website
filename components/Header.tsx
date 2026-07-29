"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLocation } from "@/context/LocationContext";
import { MapPin, Phone, ShoppingCart, User, ChevronDown, Menu } from "lucide-react";
export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3.5 group py-1" aria-label="PestIQ Solutions Home">
      {/* Official House-Q Brand Mark from Reference Screenshot */}
      <div className="w-11 h-11 rounded-xl bg-[#0a2540] flex items-center justify-center p-1.5 shadow-md group-hover:scale-105 transition-transform">
        <svg viewBox="0 0 200 200" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* House Outline */}
          <path d="M100 32 L160 82 V152 H40 V82 Z" stroke="#ffffff" strokeWidth="13" strokeLinejoin="round" strokeLinecap="round" />
          <path d="M138 52 V38 H152 V64" stroke="#ffffff" strokeWidth="11" strokeLinejoin="round" strokeLinecap="round" />
          {/* Bright Blue Q / Target Lens */}
          <circle cx="95" cy="110" r="42" stroke="#0066cc" strokeWidth="18" />
          <path d="M125 140 L158 172" stroke="#0066cc" strokeWidth="18" strokeLinecap="round" />
          {/* Gold Center Dot */}
          <circle cx="95" cy="110" r="12" fill="#ffc400" />
        </svg>
      </div>
      <div className="flex flex-col justify-center">
        <span className="text-[28px] font-black tracking-tight leading-none flex items-center">
          <span className="text-[#071b4d]">Pest</span>
          <span className="text-[#0066cc]">IQ</span>
        </span>
        <span className="text-[12px] font-medium tracking-[0.24em] text-[#071b4d] mt-1">
          Solutions
        </span>
      </div>
    </Link>
  );
}

export function Header() {
  const { zipCode, serviceArea, cartItem, setIsAddressModalOpen } = useLocation();
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="relative w-full z-50 flex flex-col font-sans">
      {/* Tier 1 - Utility Bar */}
      <div 
        className="w-full flex items-center justify-between px-3 md:px-8 text-white text-[11px] sm:text-xs"
        style={{ backgroundColor: "#071b4d", minHeight: "32px" }}
      >
        <div className="flex items-center space-x-3 sm:space-x-6">
          <span>Need Help? <a href="tel:2125550148" className="font-semibold hover:underline">(212) 555-0148</a></span>
          <Link href="/locations" className="hidden sm:inline hover:underline">Locations</Link>
          <Link href="/contact" className="hidden sm:inline hover:underline">Contact Us</Link>
        </div>
        <div>
          <Link 
            href="/commercial" 
            className="px-2.5 py-0.5 rounded-full text-white font-semibold transition-opacity hover:opacity-80 flex items-center text-[10px] sm:text-xs"
            style={{ backgroundColor: "#0a2540" }}
          >
            Commercial <ChevronDown className="w-3 h-3 ml-1" />
          </Link>
        </div>
      </div>

      {/* Tier 2 - Brand Bar */}
      <div className="w-full bg-white flex items-center justify-between px-3 sm:px-6 md:px-8 py-2.5 sm:py-4 border-b border-gray-100 relative">
        <div className="flex-shrink-0 flex items-center scale-90 sm:scale-100 origin-left">
          <Logo />
        </div>

        {/* Center: Location picker */}
        <div className="hidden md:flex items-center justify-center flex-1 mx-4">
          <button 
            onClick={() => setIsAddressModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 rounded border border-gray-200 hover:bg-gray-50 transition-colors text-sm"
          >
            <MapPin className="text-gray-500 w-5 h-5" />
            <span className="text-gray-600 font-medium">My Branch:</span>
            <span className="font-bold text-gray-900">{zipCode ? serviceArea : "Select Location"}</span>
            <span className="text-blue-600 font-medium text-xs ml-2 hover:underline">Change</span>
          </button>
        </div>

        {/* Right: Icons */}
        <div className="flex items-center space-x-2.5 sm:space-x-5">
          {/* Mobile Location Quick Button */}
          <button 
            onClick={() => setIsAddressModalOpen(true)}
            className="md:hidden flex items-center gap-1 bg-gray-50 border border-gray-200 px-2 py-1 rounded text-[10px] font-bold text-[#071b4d]"
          >
            <MapPin className="w-3 h-3 text-[#17824b]" />
            <span className="truncate max-w-[65px]">{zipCode ? serviceArea.split(",")[0] : "Location"}</span>
          </button>

          <a href="tel:2125550148" className="hidden sm:flex flex-col items-center text-gray-700 hover:text-[#071b4d]">
            <Phone className="w-4 h-4 sm:w-5 sm:h-5 mb-0.5" />
            <span className="text-[10px] sm:text-xs font-semibold">Call</span>
          </a>
          <Link href="/checkout" className="flex flex-col items-center text-gray-700 hover:text-[#071b4d] relative">
            <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 mb-0.5" />
            <span className="text-[10px] sm:text-xs font-semibold">Cart</span>
            {cartItem !== null && (
              <span className="absolute -top-1 -right-2 bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                1
              </span>
            )}
          </Link>
          <Link href="/portal" className="flex flex-col items-center text-gray-700 hover:text-[#071b4d]">
            <User className="w-4 h-4 sm:w-5 sm:h-5 mb-0.5" />
            <span className="text-[10px] sm:text-xs font-semibold">Account</span>
          </Link>

          {/* Mobile menu button */}
          <button 
            className="md:hidden flex items-center justify-center text-gray-700 p-1.5 rounded-lg border border-gray-200 bg-gray-50"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Tier 3 - Nav Bar */}
      <nav 
        className="hidden md:flex w-full bg-white border-b border-[#e8e8e8] relative px-4 md:px-8 text-sm font-semibold text-gray-800"
      >
        <div className="flex space-x-8 items-center h-14">
          <Link href="/termites" className="hover:text-[#17824b] flex items-center h-full">
            Termite Treatment <ChevronDown className="w-4 h-4 ml-1 opacity-70" />
          </Link>

          <div 
            className="h-full flex items-center group relative"
            onMouseEnter={() => setIsMegaMenuOpen(true)}
            onMouseLeave={() => setIsMegaMenuOpen(false)}
          >
            <button className="hover:text-[#17824b] flex items-center h-full focus:outline-none">
              Pest Control Services <ChevronDown className="w-4 h-4 ml-1 opacity-70" />
            </button>
            
            {/* Mega Dropdown */}
            {isMegaMenuOpen && (
              <div className="absolute top-full -left-20 md:-left-44 w-[92vw] max-w-[960px] bg-white shadow-2xl rounded-b-xl border border-gray-200 p-6 grid grid-cols-4 md:grid-cols-5 gap-4 z-50 text-[13px]">
                {/* Column 1 */}
                <div className="flex flex-col space-y-3">
                  <Link href="/pests/general" className="text-gray-600 hover:text-[#17824b] hover:underline">General Pest Control</Link>
                  <Link href="/pests/ants" className="text-gray-600 hover:text-[#17824b] hover:underline">Ant Control</Link>
                  <Link href="/pests/bats" className="text-gray-600 hover:text-[#17824b] hover:underline">Bat Control</Link>
                  <Link href="/pests/bed-bugs" className="text-gray-600 hover:text-[#17824b] hover:underline">Bed Bug Control</Link>
                </div>
                {/* Column 2 */}
                <div className="flex flex-col space-y-3">
                  <Link href="/pests/birds" className="text-gray-600 hover:text-[#17824b] hover:underline">Bird Control</Link>
                  <Link href="/pests/carpenter-ants" className="text-gray-600 hover:text-[#17824b] hover:underline">Carpenter Ant Control</Link>
                  <Link href="/pests/centipedes-millipedes" className="text-gray-600 hover:text-[#17824b] hover:underline">Centipede & Millipede Control</Link>
                  <Link href="/pests/cockroaches" className="text-gray-600 hover:text-[#17824b] hover:underline">Cockroach Control</Link>
                </div>
                {/* Column 3 */}
                <div className="flex flex-col space-y-3">
                  <Link href="/pests/crickets" className="text-gray-600 hover:text-[#17824b] hover:underline">Cricket Control</Link>
                  <Link href="/pests/fleas" className="text-gray-600 hover:text-[#17824b] hover:underline">Flea Control</Link>
                  <Link href="/pests/flies" className="text-gray-600 hover:text-[#17824b] hover:underline">Fly Control</Link>
                  <Link href="/pests/mice" className="text-gray-600 hover:text-[#17824b] hover:underline">Mice Control</Link>
                  <Link href="/pests/mosquitoes" className="text-gray-600 hover:text-[#17824b] hover:underline">Mosquito Control</Link>
                </div>
                {/* Column 4 */}
                <div className="flex flex-col space-y-3">
                  <Link href="/pests/moths" className="text-gray-600 hover:text-[#17824b] hover:underline">Moth Control</Link>
                  <Link href="/pests/rats" className="text-gray-600 hover:text-[#17824b] hover:underline">Rat Control</Link>
                  <Link href="/pests/rodents" className="text-gray-600 hover:text-[#17824b] hover:underline">Rodent Control Services</Link>
                  <Link href="/pests/scorpions" className="text-gray-600 hover:text-[#17824b] hover:underline">Scorpion Control</Link>
                </div>
                {/* Column 5 */}
                <div className="flex flex-col space-y-3">
                  <Link href="/pests/silverfish" className="text-gray-600 hover:text-[#17824b] hover:underline">Silverfish Control</Link>
                  <Link href="/pests/spiders" className="text-gray-600 hover:text-[#17824b] hover:underline">Spider Control</Link>
                  <Link href="/pests/stinging-pests" className="text-gray-600 hover:text-[#17824b] hover:underline">Stinging Pest Control</Link>
                  <Link href="/pests/ticks" className="text-gray-600 hover:text-[#17824b] hover:underline">Tick Control</Link>
                  <Link href="/pests/wasps" className="text-gray-600 hover:text-[#17824b] hover:underline">Wasp Control</Link>
                </div>
              </div>
            )}
          </div>

          <Link href="/home-services" className="hover:text-[#17824b] flex items-center h-full">
            Home Services <ChevronDown className="w-4 h-4 ml-1 opacity-70" />
          </Link>
          <Link href="/research" className="hover:text-[#17824b] flex items-center h-full">
            Pest Research <ChevronDown className="w-4 h-4 ml-1 opacity-70" />
          </Link>
          <Link href="/about" className="hover:text-[#17824b] flex items-center h-full">
            About PestIQ <ChevronDown className="w-4 h-4 ml-1 opacity-70" />
          </Link>
          <Link href="/offers" className="hover:text-[#17824b] flex items-center h-full text-red-600">
            Exclusive Offers <ChevronDown className="w-4 h-4 ml-1 opacity-70" />
          </Link>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-xl border-t border-gray-100 flex flex-col z-50">
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <button 
              onClick={() => { setMobileMenuOpen(false); setIsAddressModalOpen(true); }}
              className="w-full bg-white px-4 py-3 rounded border border-gray-300 text-sm font-bold flex justify-between items-center"
            >
              <span><MapPin className="w-4 h-4 inline-block mr-1" /> My Branch: {zipCode ? serviceArea : "Select Location"}</span>
              <span className="text-blue-600">Change</span>
            </button>
          </div>
          <Link href="/termites" className="p-4 border-b border-gray-100 font-bold text-gray-800">Termite Treatment</Link>
          <div className="p-4 border-b border-gray-100 flex flex-col">
            <span className="font-bold text-gray-800 mb-3">Pest Control Services</span>
            <div className="grid grid-cols-2 gap-2 pl-4 text-sm">
              <Link href="/pests/ants" className="text-gray-600 py-1">Ant Control</Link>
              <Link href="/pests/cockroaches" className="text-gray-600 py-1">Cockroach Control</Link>
              <Link href="/pests/rodents" className="text-gray-600 py-1">Rodent Control</Link>
              <Link href="/pests/mosquitoes" className="text-gray-600 py-1">Mosquito Control</Link>
              <Link href="/pests/bed-bugs" className="text-gray-600 py-1">Bed Bug Control</Link>
              <Link href="/pests/general" className="text-blue-600 py-1 font-semibold">View All Pests →</Link>
            </div>
          </div>
          <Link href="/home-services" className="p-4 border-b border-gray-100 font-bold text-gray-800">Home Services</Link>
          <Link href="/research" className="p-4 border-b border-gray-100 font-bold text-gray-800">Pest Research</Link>
          <Link href="/about" className="p-4 border-b border-gray-100 font-bold text-gray-800">About PestIQ</Link>
          <Link href="/offers" className="p-4 border-b border-gray-100 font-bold text-red-600">Exclusive Offers</Link>
        </div>
      )}
    </header>
  );
}
