"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { VerifiedAddress } from "@/lib/address";

export type PriceTier = "newjersey" | null;

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
  verifiedAddress: VerifiedAddress | null;
  isAddressVerified: boolean;
  isAddressModalOpen: boolean;
  isUnserviceableModalOpen: boolean;
  unserviceableAddress: string;
  setIsAddressModalOpen: (open: boolean) => void;
  setIsUnserviceableModalOpen: (open: boolean) => void;
  setUnserviceableAddress: (address: string) => void;
  setVerifiedAddress: (address: VerifiedAddress | null) => void;
  clearLocation: () => void;
  clearCart: () => void;
  submitAddressSearch: (address: VerifiedAddress) => boolean;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [verifiedAddress, setVerifiedAddressState] = useState<VerifiedAddress | null>(null);
  const [zipCode, setZipCodeState] = useState<string>("");
  const [streetAddress, setStreetAddressState] = useState<string>("");
  const [serviceArea, setServiceArea] = useState<string>("New Jersey (Statewide)");
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
    const raw = Math.abs(hash % 3001) + 1200;
    return Math.round(raw / 50) * 50;
  };

  const handleSetVerifiedAddress = (addr: VerifiedAddress | null) => {
    setVerifiedAddressState(addr);
    if (addr && addr.verified) {
      setZipCodeState(addr.postalCode);
      setStreetAddressState(addr.formattedAddress);
      setServiceArea("New Jersey (Statewide)");
      setPriceTier("newjersey");
      const sqft = calculateSqFt(addr.formattedAddress);
      setPropertySqFtState(sqft);

      if (typeof window !== "undefined") {
        localStorage.setItem("pestiq_verified_address", JSON.stringify(addr));
        localStorage.setItem("pestiq_zip", addr.postalCode);
        localStorage.setItem("pestiq_address", addr.formattedAddress);
        localStorage.setItem("pestiq_sqft", sqft.toString());
      }
    } else {
      // Clear derived states if address becomes unverified / cleared / edited
      setZipCodeState("");
      setStreetAddressState("");
      setServiceArea("New Jersey (Statewide)");
      setPriceTier(null);
      setPropertySqFtState(null);

      if (typeof window !== "undefined") {
        localStorage.removeItem("pestiq_verified_address");
        localStorage.removeItem("pestiq_zip");
        localStorage.removeItem("pestiq_address");
        localStorage.removeItem("pestiq_sqft");
      }
    }
  };

  const submitAddressSearch = (addr: VerifiedAddress): boolean => {
    if (!addr || !addr.verified || addr.stateCode !== "NJ") {
      setUnserviceableAddress(addr?.formattedAddress || "");
      setIsUnserviceableModalOpen(true);
      handleSetVerifiedAddress(null);
      return false;
    }
    handleSetVerifiedAddress(addr);
    return true;
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
    handleSetVerifiedAddress(null);
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
      const savedVerified = localStorage.getItem("pestiq_verified_address");
      const savedCart = localStorage.getItem("pestiq_cart");

      if (savedVerified) {
        try {
          const parsed: VerifiedAddress = JSON.parse(savedVerified);
          if (parsed && parsed.verified && parsed.stateCode === "NJ") {
            handleSetVerifiedAddress(parsed);
          }
        } catch {
          localStorage.removeItem("pestiq_verified_address");
        }
      }

      if (savedCart) {
        try {
          setCartItemState(JSON.parse(savedCart));
        } catch {}
      }
    }
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
        verifiedAddress,
        isAddressVerified: !!(verifiedAddress && verifiedAddress.verified),
        isAddressModalOpen,
        isUnserviceableModalOpen,
        unserviceableAddress,
        setIsAddressModalOpen,
        setIsUnserviceableModalOpen,
        setUnserviceableAddress,
        setVerifiedAddress: handleSetVerifiedAddress,
        clearLocation: handleClearLocation,
        clearCart: handleClearCart,
        submitAddressSearch,
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
