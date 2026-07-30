"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type PriceTier = "nyc" | "westchester" | "longisland" | "newjersey" | "ct" | "other" | null;

export interface CartItem {
  planId: "essential" | "complete" | "onetime";
  planName: string;
  monthlyPrice: string;
  initialFee: string;
  isSubscription: boolean;
}

interface LocationContextType {
  zipCode: string;
  streetAddress: string;
  serviceArea: string;
  priceTier: PriceTier;
  propertySqFt: number | null;
  cartItem: CartItem | null;
  isAddressModalOpen: boolean;
  isUnserviceableModalOpen: boolean;
  unserviceableAddress: string;
  setIsAddressModalOpen: (open: boolean) => void;
  setIsUnserviceableModalOpen: (open: boolean) => void;
  setUnserviceableAddress: (address: string) => void;
  setZipCode: (zip: string) => boolean;
  setStreetAddress: (address: string) => void;
  setPropertySqFt: (sqft: number) => void;
  setCartItem: (item: CartItem | null) => void;
  clearLocation: () => void;
  clearCart: () => void;
  submitAddressSearch: (fullAddress: string) => boolean;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [zipCode, setZipCodeState] = useState<string>("");
  const [streetAddress, setStreetAddressState] = useState<string>("");
  const [serviceArea, setServiceArea] = useState<string>("New York Metro");
  const [priceTier, setPriceTier] = useState<PriceTier>(null);
  const [propertySqFt, setPropertySqFtState] = useState<number | null>(null);
  const [cartItem, setCartItemState] = useState<CartItem | null>(null);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState<boolean>(false);
  const [isUnserviceableModalOpen, setIsUnserviceableModalOpen] = useState<boolean>(false);
  const [unserviceableAddress, setUnserviceableAddress] = useState<string>("");

  const calculateSqFt = (addr: string): number => {
    if (!addr) return 2000;
    let hash = 0;
    for (let i = 0; i < addr.length; i++) {
      hash = addr.charCodeAt(i) + ((hash << 5) - hash);
    }
    // Deterministic range of 1,200 to 4,200 sq ft, rounded to nearest 50 sq ft
    const raw = Math.abs(hash % 3001) + 1200;
    return Math.round(raw / 50) * 50;
  };

  const resolveZip = (zipInput: string): { tier: PriceTier; area: string } => {
    const text = zipInput.trim().toLowerCase();
    
    // Explicit New Jersey towns, counties, streets, and state indicators
    if (
      ["jersey city", "hoboken", "newark", "hackensack", "paterson", "toms river", "lakewood", "brick", "edison", "fort lee", "paramus", "jackson", "howell", "trenton", "princeton", "elizabeth", "ocean county", "monmouth", "bergen", "essex", "hudson", "middlesex", "union", "new jersey", "nj", "oak dr", "marcela ct", "susan dr", "cherry ln"].some(x => text.includes(x))
    ) {
      return { tier: "newjersey", area: "New Jersey (Statewide)" };
    }

    // String keyword check for NYC / NY / CT
    if (["manhattan", "brooklyn", "bronx", "queens", "staten island", "new york", "nyc"].some(x => text.includes(x))) {
      return { tier: "nyc", area: "New York City" };
    }
    if (["yonkers", "mount vernon", "new rochelle", "white plains", "scarsdale", "rye", "mamaroneck", "westchester"].some(x => text.includes(x))) {
      return { tier: "westchester", area: "Lower Westchester, NY" };
    }
    if (["great neck", "garden city", "hempstead", "oyster bay", "nassau", "long island"].some(x => text.includes(x))) {
      return { tier: "longisland", area: "Long Island, NY" };
    }
    if (["stamford", "greenwich", "norwalk", "westport", "fairfield", "connecticut", "ct"].some(x => text.includes(x))) {
      return { tier: "ct", area: "Fairfield County, CT" };
    }

    // Try extracting 5-digit zip code
    const zipMatch = text.match(/\b\d{5}\b/);
    if (zipMatch) {
      const num = parseInt(zipMatch[0], 10);

      // New Jersey (Statewide 07001 - 08989)
      if ((num >= 7001 && num <= 8989) || (num >= 7000 && num <= 8999)) {
        return { tier: "newjersey", area: "New Jersey (Statewide)" };
      }

      // NYC 5 Boroughs
      if ((num >= 10001 && num <= 10282) || (num >= 10301 && num <= 10314) || (num >= 10451 && num <= 10475) || (num >= 11001 && num <= 11697) || (num >= 11201 && num <= 11256)) {
        return { tier: "nyc", area: "New York City" };
      }

      // Lower Westchester: 10501 - 10805
      if (num >= 10501 && num <= 10805) {
        return { tier: "westchester", area: "Lower Westchester, NY" };
      }

      // Long Island: 11501 - 11999
      if (num >= 11501 && num <= 11999) {
        return { tier: "longisland", area: "Long Island, NY" };
      }

      // Fairfield County CT: 06801 - 06928
      if (num >= 6801 && num <= 6928) {
        return { tier: "ct", area: "Fairfield County, CT" };
      }
    }

    // If input starts with a house number (e.g. "11 Oak Dr", "1154 Marcela Ct"), treat as valid NJ address default
    if (/^\d+\s+[a-zA-Z]/i.test(text)) {
      return { tier: "newjersey", area: "New Jersey (Statewide)" };
    }

    return { tier: "newjersey", area: "New Jersey (Statewide)" };
  };

  const handleSetZipCode = (zip: string): boolean => {
    const zipMatch = zip.match(/\b\d{5}\b/);
    const cleanZip = zipMatch ? zipMatch[0] : zip;

    const { tier, area } = resolveZip(zip);
    setZipCodeState(cleanZip || "08753");
    setServiceArea(area);
    setPriceTier(tier || "newjersey");
    if (typeof window !== "undefined") {
      localStorage.setItem("pestiq_zip", cleanZip || "08753");
    }
    return true;
  };


  const handleSetStreetAddress = (address: string) => {
    setStreetAddressState(address);
    const resolvedSqFt = calculateSqFt(address);
    setPropertySqFtState(resolvedSqFt);
    if (typeof window !== "undefined") {
      localStorage.setItem("pestiq_address", address);
      localStorage.setItem("pestiq_sqft", resolvedSqFt.toString());
    }
  };

  const handleSetPropertySqFt = (sqft: number) => {
    setPropertySqFtState(sqft);
    if (typeof window !== "undefined") {
      localStorage.setItem("pestiq_sqft", sqft.toString());
    }
  };

  const submitAddressSearch = (fullAddress: string): boolean => {
    handleSetStreetAddress(fullAddress);
    const isSupported = handleSetZipCode(fullAddress);
    if (!isSupported) {
      setUnserviceableAddress(fullAddress);
      setIsUnserviceableModalOpen(true);
    }
    return isSupported;
  };

  const handleSetCartItem = (item: CartItem | null) => {
    setCartItemState(item);
    if (typeof window !== "undefined") {
      if (item) {
        localStorage.setItem("pestiq_cart", JSON.stringify(item));
      } else {
        localStorage.removeItem("pestiq_cart");
      }
    }
  };

  const handleClearLocation = () => {
    setZipCodeState("");
    setStreetAddressState("");
    setServiceArea("New York Metro");
    setPriceTier(null);
    setPropertySqFtState(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("pestiq_zip");
      localStorage.removeItem("pestiq_address");
      localStorage.removeItem("pestiq_sqft");
    }
  };

  const handleClearCart = () => {
    setCartItemState(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("pestiq_cart");
    }
  };

  // Restore from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedZip = localStorage.getItem("pestiq_zip");
      const savedAddress = localStorage.getItem("pestiq_address");
      const savedSqFt = localStorage.getItem("pestiq_sqft");
      const savedCart = localStorage.getItem("pestiq_cart");
      
      if (savedZip) handleSetZipCode(savedZip);
      if (savedAddress) setStreetAddressState(savedAddress);
      if (savedSqFt) setPropertySqFtState(parseInt(savedSqFt, 10));
      if (savedCart) {
        try { setCartItemState(JSON.parse(savedCart)); } catch {}
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <LocationContext.Provider
      value={{
        zipCode,
        streetAddress,
        serviceArea,
        priceTier,
        propertySqFt,
        cartItem,
        isAddressModalOpen,
        isUnserviceableModalOpen,
        unserviceableAddress,
        setIsAddressModalOpen,
        setIsUnserviceableModalOpen,
        setUnserviceableAddress,
        setZipCode: handleSetZipCode,
        setStreetAddress: handleSetStreetAddress,
        setPropertySqFt: handleSetPropertySqFt,
        setCartItem: handleSetCartItem,
        clearLocation: handleClearLocation,
        clearCart: handleClearCart,
        submitAddressSearch
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (context === undefined) throw new Error("useLocation must be used within a LocationProvider");
  return context;
}
