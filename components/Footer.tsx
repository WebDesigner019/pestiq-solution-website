"use client";

import React from "react";
import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3.5 group py-1" aria-label="PestIQ Solutions Home">
      <div className="w-11 h-11 rounded-xl bg-[#0a2540] border border-white/20 flex items-center justify-center p-1.5 shadow-md group-hover:scale-105 transition-transform">
        <svg viewBox="0 0 200 200" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 32 L160 82 V152 H40 V82 Z" stroke="#ffffff" strokeWidth="13" strokeLinejoin="round" strokeLinecap="round" />
          <path d="M138 52 V38 H152 V64" stroke="#ffffff" strokeWidth="11" strokeLinejoin="round" strokeLinecap="round" />
          <circle cx="95" cy="110" r="42" stroke="#3b82f6" strokeWidth="18" />
          <path d="M125 140 L158 172" stroke="#3b82f6" strokeWidth="18" strokeLinecap="round" />
          <circle cx="95" cy="110" r="12" fill="#ffc400" />
        </svg>
      </div>
      <div className="flex flex-col justify-center">
        <span className="text-[28px] font-black tracking-tight leading-none flex items-center">
          <span className="text-white">Pest</span>
          <span className="text-[#3b82f6]">IQ</span>
        </span>
        <span className="text-[12px] font-medium tracking-[0.24em] text-slate-300 mt-1">
          Solutions
        </span>
      </div>
    </Link>
  );
}

const o = [
  ["Ant Control", "/pests/ants"],
  ["Cockroach Control", "/pests/cockroaches"],
  ["Rodent Control", "/pests/rodents"],
  ["Spider Control", "/pests/spiders"]
];

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-cta">
        <div className="header-container">
          <div>
            <strong>Ready to protect your home?</strong>
            <span>Check local availability and request a preferred appointment time.</span>
          </div>
          <Link href="/book">
            Get started <span>›</span>
          </Link>
        </div>
      </div>
      <div className="header-container footer-grid">
        <div className="footer-brand">
          <Logo />
          <p>
            Residential pest-control planning for select New York City, Lower Westchester, and Ocean County, NJ neighborhoods.
          </p>
          <a href="tel:+12125550148">(212) 555-0148</a>
        </div>
        <div>
          <h3>Services</h3>
          {o.map(([name, href]) => (
            <Link key={name} href={href}>
              {name}
            </Link>
          ))}
        </div>
        <div>
          <h3>Customer care</h3>
          <Link href="/book">Request service</Link>
          <Link href="/pests/general">Plans &amp; pricing</Link>
          <Link href="/#service-areas">Service areas</Link>
          <Link href="/policies">Policies</Link>
        </div>
        <div>
          <h3>Hours</h3>
          <p>
            Monday–Saturday
            <br />
            7:00am–7:00pm
          </p>
          <p>
            Sunday
            <br />
            9:00am–4:00pm
          </p>
          <a href="mailto:hello@pestiqsolutions.com">hello@pestiqsolutions.com</a>
        </div>
      </div>
      <div className="header-container footer-bottom">
        <span>© 2026 PestIQ Solutions</span>
        <div>
          <Link href="/policies#privacy">Privacy</Link>
          <Link href="/policies">Terms &amp; policies</Link>
          <span>USA</span>
        </div>
      </div>
    </footer>
  );
}
