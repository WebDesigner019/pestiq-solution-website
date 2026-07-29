"use client";

import React, { useEffect } from "react";
import { LocationProvider, useLocation } from "@/context/LocationContext";
import AddressModal from "@/components/AddressModal";

function GlobalModalWrapper() {
  const { isAddressModalOpen, setIsAddressModalOpen } = useLocation();
  if (!isAddressModalOpen) return null;
  return <AddressModal onClose={() => setIsAddressModalOpen(false)} />;
}

// Scroll-reveal: watches [data-reveal] elements and adds .is-visible when in viewport
function ScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    const observe = () => {
      document.querySelectorAll("[data-reveal]").forEach((el) => observer.observe(el));
    };
    observe();
    // Re-observe after any route change (covers Next.js soft nav)
    const mo = new MutationObserver(observe);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => { observer.disconnect(); mo.disconnect(); };
  }, []);
  return null;
}

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <LocationProvider>
      <ScrollReveal />
      {children}
      <GlobalModalWrapper />
    </LocationProvider>
  );
}
