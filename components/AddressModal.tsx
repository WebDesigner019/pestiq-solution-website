"use client";

import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "@/context/LocationContext";
import { VerifiedAddress } from "@/lib/address";
import { Search, MapPin, Loader2, Navigation, CheckCircle2, AlertCircle, X } from "lucide-react";

interface AddressModalProps {
  onClose: () => void;
}

export default function AddressModal({ onClose }: AddressModalProps) {
  const { submitAddressSearch, verifiedAddress, setVerifiedAddress } = useLocation();

  const [inputVal, setInputVal] = useState<string>("");
  const [unitVal, setUnitVal] = useState<string>("");
  const [selectedAddress, setSelectedAddress] = useState<VerifiedAddress | null>(null);
  const [suggestions, setSuggestions] = useState<VerifiedAddress[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize input if already verified
  useEffect(() => {
    if (verifiedAddress && verifiedAddress.verified) {
      setSelectedAddress(verifiedAddress);
      setInputVal(verifiedAddress.formattedAddress);
      if (verifiedAddress.unit) setUnitVal(verifiedAddress.unit);
    }
  }, [verifiedAddress]);

  // Click outside listener to dismiss dropdown safely
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Server-side Geoapify fetch with 350ms debounce and AbortController cancellation
  const fetchSuggestions = (queryText: string) => {
    const text = queryText.trim();
    if (text.length < 4) {
      setSuggestions([]);
      setShowDropdown(false);
      setIsLoading(false);
      return;
    }

    // Cancel obsolete request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading(true);
    setErrorMessage("");

    fetch(`/api/address/autocomplete?q=${encodeURIComponent(text)}`, {
      signal: controller.signal,
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Verification failed");
        const data = await res.json();
        const results: VerifiedAddress[] = Array.isArray(data.suggestions) ? data.suggestions : [];
        setSuggestions(results);
        setShowDropdown(true);
        setIsLoading(false);

        if (results.length === 0) {
          setErrorMessage(
            "We couldn’t verify this New Jersey address. Check the house number, street, city, and ZIP code."
          );
        }
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          setIsLoading(false);
          setSuggestions([]);
          setErrorMessage(
            "We couldn’t verify this New Jersey address. Check the house number, street, city, and ZIP code."
          );
        }
      });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputVal(val);

    // Editing invalidates any previously selected address immediately
    if (selectedAddress) {
      setSelectedAddress(null);
      setVerifiedAddress(null);
    }

    setErrorMessage("");
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    if (val.trim().length >= 4) {
      setIsLoading(true);
      debounceTimerRef.current = setTimeout(() => {
        fetchSuggestions(val);
      }, 350);
    } else {
      setSuggestions([]);
      setShowDropdown(false);
      setIsLoading(false);
    }
  };

  const handleSelectSuggestion = (item: VerifiedAddress) => {
    const addrWithUnit = unitVal.trim() ? { ...item, unit: unitVal.trim() } : item;
    setSelectedAddress(addrWithUnit);
    setInputVal(item.formattedAddress);
    setShowDropdown(false);
    setErrorMessage("");
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setErrorMessage("Geolocation is not supported by your browser. Please type your address.");
      return;
    }

    setIsLocating(true);
    setErrorMessage("");
    setShowDropdown(false);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(`/api/places/reverse-geocode?lat=${latitude}&lng=${longitude}`);
          if (res.ok) {
            const data = await res.json();
            if (data.verifiedAddress && data.verifiedAddress.verified) {
              const item: VerifiedAddress = data.verifiedAddress;
              setSelectedAddress(item);
              setInputVal(item.formattedAddress);
              setIsLocating(false);
              return;
            }
          }
        } catch {
          // fall through
        }
        setIsLocating(false);
        setErrorMessage("Could not detect a building-level property in New Jersey at your current location.");
      },
      (err) => {
        setIsLocating(false);
        if (err.code === err.PERMISSION_DENIED) {
          setErrorMessage("Location access was denied. Please type your New Jersey address.");
        } else {
          setErrorMessage("Location unavailable. Please type your New Jersey address.");
        }
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAddress || !selectedAddress.verified) return;

    setIsSubmitted(true);
    const finalAddress = unitVal.trim()
      ? { ...selectedAddress, unit: unitVal.trim() }
      : selectedAddress;

    submitAddressSearch(finalAddress);
    setTimeout(() => {
      onClose();
    }, 200);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-8 sm:pt-14 px-4 overflow-y-auto pb-12 animate-fade-in"
      style={{ backgroundColor: "rgba(3, 14, 43, 0.93)" }}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 sm:top-6 sm:right-6 text-white/70 hover:text-white text-3xl font-light leading-none outline-none transition-colors cursor-pointer"
        aria-label="Close dialog"
      >
        <X className="w-8 h-8" />
      </button>

      <div className="w-full max-w-xl text-center text-white flex flex-col items-center gap-5 mt-2 sm:mt-4" ref={wrapperRef}>
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#17824b]/30 text-green-300 border border-[#17824b]/50 mb-3">
            <CheckCircle2 className="w-3.5 h-3.5" /> New Jersey Statewide Coverage
          </span>
          <h2 className="text-[30px] sm:text-[42px] font-extrabold tracking-tight leading-tight mb-2">
            What is your service address?
          </h2>
          <p className="text-zinc-300 text-[14px] sm:text-[15px] max-w-md mx-auto">
            Your customized local price is based strictly on your verified New Jersey property.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full relative flex flex-col gap-3">
          {/* Main Search Input Container */}
          <div className="relative w-full">
            <div className="relative flex items-center">
              <input
                ref={inputRef}
                type="text"
                value={inputVal}
                onChange={handleInputChange}
                onFocus={() => {
                  if (suggestions.length > 0) setShowDropdown(true);
                  else if (inputVal.trim().length >= 4) fetchSuggestions(inputVal);
                }}
                placeholder="Type your NJ street address (e.g. 11 Oak Dr)..."
                className="w-full pl-5 pr-28 py-4 text-[15px] sm:text-[16px] text-gray-900 placeholder:text-gray-400 bg-white rounded-full shadow-2xl outline-none focus:ring-4 focus:ring-yellow-400/40 transition-all font-medium border border-gray-200"
                autoFocus
                autoComplete="off"
                aria-label="Service Street Address"
                aria-expanded={showDropdown}
                aria-autocomplete="list"
              />

              {/* Action Button: Disabled until verified address selected */}
              <button
                type="submit"
                disabled={!selectedAddress || !selectedAddress.verified || isSubmitted || isLocating}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#ffc400] hover:bg-[#e6af00] disabled:opacity-40 disabled:cursor-not-allowed text-[#071b4d] font-extrabold text-[13px] uppercase tracking-wider px-6 py-2.5 rounded-full transition-all shadow-md flex items-center gap-1.5"
              >
                {isLoading || isSubmitted ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Go →"
                )}
              </button>
            </div>

            {/* Verified Address Indicator */}
            {selectedAddress && selectedAddress.verified && (
              <div className="mt-2 text-left px-4 flex items-center justify-between bg-green-500/20 border border-green-400/40 rounded-xl py-2 px-3 text-xs text-green-200">
                <span className="flex items-center gap-1.5 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" /> Verified NJ Property: {selectedAddress.formattedAddress}
                </span>
                <span className="text-[11px] text-green-300 font-bold uppercase">Ready</span>
              </div>
            )}
          </div>

          {/* Separate Optional Unit / Apartment Input */}
          {selectedAddress && selectedAddress.verified && (
            <div className="w-full animate-fade-in">
              <input
                type="text"
                value={unitVal}
                onChange={(e) => {
                  setUnitVal(e.target.value);
                  if (selectedAddress) {
                    setSelectedAddress({ ...selectedAddress, unit: e.target.value });
                  }
                }}
                placeholder="Apt, Suite, Unit, or Floor # (Optional)"
                className="w-full px-5 py-3 text-sm text-gray-900 bg-white/95 rounded-2xl outline-none focus:ring-2 focus:ring-yellow-400 font-medium"
              />
            </div>
          )}

          {/* Verified Dropdown List */}
          {showDropdown && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl overflow-hidden z-50 text-left border border-gray-100 max-h-[38vh] overflow-y-auto py-1">
              {/* Top GPS Option */}
              <button
                type="button"
                onClick={handleUseCurrentLocation}
                disabled={isLocating}
                className="w-full px-5 py-3 text-left bg-sky-50 hover:bg-sky-100 text-sky-900 text-xs sm:text-sm font-semibold flex items-center gap-2.5 border-b border-sky-100 transition-colors cursor-pointer"
              >
                {isLocating ? (
                  <Loader2 className="w-4 h-4 shrink-0 text-sky-600 animate-spin" />
                ) : (
                  <Navigation className="w-4 h-4 shrink-0 text-sky-600 rotate-45" />
                )}
                <span>{isLocating ? "Detecting location..." : "Use my current location"}</span>
              </button>

              {/* Suggestions List */}
              <div className="divide-y divide-gray-100 pb-2">
                {suggestions.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectSuggestion(item)}
                    className="w-full px-5 py-3.5 text-left text-gray-900 hover:bg-blue-50/80 transition-colors cursor-pointer flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <MapPin className="w-4 h-4 text-[#17824b] shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-gray-900 truncate">
                          {item.houseNumber} {item.street}
                        </p>
                        <p className="text-xs text-gray-500 font-medium truncate">
                          {item.city}, NJ {item.postalCode}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 group-hover:text-blue-600 uppercase tracking-wider shrink-0 bg-gray-100 group-hover:bg-blue-100 px-2 py-1 rounded">
                      Select
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </form>

        {/* GPS Link when dropdown is closed */}
        {!showDropdown && !selectedAddress && (
          <button
            type="button"
            onClick={handleUseCurrentLocation}
            disabled={isLocating}
            className="flex items-center gap-2 text-sky-300 hover:text-white text-xs sm:text-sm font-medium transition-colors disabled:opacity-50 cursor-pointer -mt-1"
          >
            <Navigation className="w-3.5 h-3.5 rotate-45 text-sky-400" />
            {isLocating ? "Detecting your location..." : "Use my current location"}
          </button>
        )}

        {/* Error / Unverified Message Container */}
        {errorMessage && (
          <div className="bg-amber-500/20 border border-amber-400/40 rounded-xl p-3.5 text-amber-200 text-xs sm:text-sm font-medium text-left flex items-start gap-2.5 max-w-md w-full animate-fade-in">
            <AlertCircle className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
}
