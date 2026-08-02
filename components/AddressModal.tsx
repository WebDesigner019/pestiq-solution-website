"use client";

import React, { useState, useRef } from "react";
import { useLocation } from "@/context/LocationContext";

interface AddressModalProps {
  onClose: () => void;
}

interface SuggestionItem {
  fullAddress: string;
}

export default function AddressModal({ onClose }: AddressModalProps) {
  const { submitAddressSearch } = useLocation();
  const [addressInput, setAddressInput] = useState("");
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchSuggestions = async (val: string) => {
    if (val.length < 1) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    setIsLoadingSuggestions(true);
    try {
      const res = await fetch(`/api/places/autocomplete?q=${encodeURIComponent(val)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.suggestions && Array.isArray(data.suggestions)) {
          setSuggestions(data.suggestions);
          setShowSuggestions(data.suggestions.length > 0);
        }
      }
    } catch {
      // silent
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setAddressInput(val);
    setLocationError("");
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(val), 80);
  };

  const commitAddress = (address: string) => {
    if (!address.trim()) return;
    setIsSubmitting(true);
    setShowSuggestions(false);
    submitAddressSearch(address);
    setTimeout(() => {
      onClose();
    }, 200);
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Location not supported. Please type your address.");
      return;
    }
    setIsLocating(true);
    setLocationError("");
    setShowSuggestions(false);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(`/api/places/reverse-geocode?lat=${latitude}&lng=${longitude}`);
          const data = await res.json();
          if (res.ok && data.fullAddress) {
            setIsLocating(false);
            commitAddress(data.fullAddress);
            return;
          }
          // API returned an error message — show it
          setIsLocating(false);
          setLocationError(data.error || "Could not detect your location. Please type your address.");
        } catch {
          setIsLocating(false);
          setLocationError("Could not detect your location. Please type your address.");
        }
      },
      (err) => {
        setIsLocating(false);
        if (err.code === err.PERMISSION_DENIED) {
          setLocationError("Location permission denied. Please type your address.");
        } else {
          setLocationError("Location unavailable. Please type your address.");
        }
      },
      { timeout: 10000, enableHighAccuracy: true, maximumAge: 0 }
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-fade-in"
      style={{ backgroundColor: "rgba(3, 14, 43, 0.93)" }}
    >
      {/* Close button — large circle, easy to tap */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 sm:top-5 sm:right-5 w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-white/15 hover:bg-white/30 text-white text-2xl font-light leading-none outline-none cursor-pointer transition-all"
        aria-label="Close"
      >
        ×
      </button>

      {/* Modal card */}
      <div className="w-full max-w-lg text-white text-center flex flex-col items-center gap-5">

        {/* Title */}
        <div className="flex flex-col gap-2">
          <h2 className="text-[36px] sm:text-[52px] font-extrabold tracking-tight leading-tight">
            What is your address?
          </h2>
          <p className="text-zinc-300 text-sm sm:text-base">
            Your customized price is based on location.
          </p>
        </div>

        {/* Search input + dropdown */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            commitAddress(addressInput);
          }}
          className="w-full relative"
        >
          <div className="relative">
            {/* Search icon */}
            <span className="absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              {isLoadingSuggestions ? (
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <circle cx="11" cy="11" r="7" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
                </svg>
              )}
            </span>

            <input
              ref={inputRef}
              type="text"
              value={addressInput}
              onChange={handleInputChange}
              onFocus={() => {
                if (suggestions.length > 0) setShowSuggestions(true);
              }}
              placeholder="Search address or ZIP code..."
              className="w-full pl-14 pr-6 py-4 text-[15px] text-gray-900 placeholder:text-gray-400 bg-white rounded-full shadow-2xl outline-none focus:ring-4 focus:ring-yellow-400/30 transition-all font-medium"
              autoFocus
              autoComplete="street-address"
              disabled={isSubmitting || isLocating}
            />
          </div>

          {/* Autocomplete dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl overflow-hidden z-50 text-left border border-gray-100 max-h-[38vh] overflow-y-auto py-1">
              {/* GPS option at top of dropdown */}
              <button
                type="button"
                onClick={handleUseCurrentLocation}
                disabled={isLocating}
                className="w-full px-5 py-3 text-left bg-sky-50 hover:bg-sky-100 text-sky-800 text-sm font-semibold flex items-center gap-3 border-b border-sky-100 transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4 shrink-0 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <circle cx="12" cy="12" r="3" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v2m0 16v2M2 12h2m16 0h2" />
                </svg>
                {isLocating ? "Detecting location..." : "Use my current location"}
              </button>

              <div className="divide-y divide-gray-100 pb-1">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => commitAddress(s.fullAddress)}
                    className="w-full px-5 py-3.5 text-left text-gray-800 hover:bg-blue-50 text-sm font-medium transition-colors cursor-pointer flex items-center gap-2.5"
                  >
                    <svg className="w-4 h-4 text-gray-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span className="truncate">{s.fullAddress}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </form>

        {/* "Can't find" manual link */}
        <p className="text-zinc-400 text-[13px] -mt-1">
          Can&apos;t find your address?{" "}
          <button
            type="button"
            onClick={() => {
              if (addressInput.trim()) {
                commitAddress(addressInput.trim());
              } else {
                inputRef.current?.focus();
              }
            }}
            className="underline underline-offset-2 hover:text-white transition-colors cursor-pointer"
          >
            Enter it manually.
          </button>
        </p>

        {/* GPS link — always visible below dropdown */}
        {!showSuggestions && (
          <button
            type="button"
            onClick={handleUseCurrentLocation}
            disabled={isLocating}
            className="flex items-center gap-2 text-sky-300 hover:text-white text-sm font-medium transition-colors disabled:opacity-50 cursor-pointer -mt-1"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <circle cx="12" cy="12" r="3" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v2m0 16v2M2 12h2m16 0h2" />
            </svg>
            {isLocating ? "Detecting your location..." : "Use my current location"}
          </button>
        )}

        {locationError && (
          <p className="text-amber-300 text-sm font-medium -mt-2">⚠️ {locationError}</p>
        )}

        {/* CONTINUE button */}
        <button
          type="button"
          onClick={() => commitAddress(addressInput)}
          disabled={!addressInput.trim() || isSubmitting || isLocating}
          className="w-full max-w-xs bg-[#ffc400] hover:bg-[#e6af00] disabled:opacity-40 disabled:cursor-not-allowed text-[#071b4d] font-extrabold text-[15px] uppercase tracking-widest py-4 rounded-full shadow-lg transition-all cursor-pointer mt-1"
        >
          {isSubmitting ? "Loading..." : "Continue ›"}
        </button>
      </div>
    </div>
  );
}
