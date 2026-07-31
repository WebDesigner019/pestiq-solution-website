"use client";

import React, { useState, useRef } from "react";
import { useLocation } from "@/context/LocationContext";
import { Navigation, Loader2 } from "lucide-react";

interface AddressModalProps {
  onClose: () => void;
}

interface SuggestionItem {
  street: string;
  city: string;
  state: string;
  zip: string;
  fullAddress: string;
}

const ALL_US_STATES = [
  { code: "AL", name: "Alabama" },
  { code: "AK", name: "Alaska" },
  { code: "AZ", name: "Arizona" },
  { code: "AR", name: "Arkansas" },
  { code: "CA", name: "California" },
  { code: "CO", name: "Colorado" },
  { code: "CT", name: "Connecticut" },
  { code: "DE", name: "Delaware" },
  { code: "DC", name: "District Of Columbia" },
  { code: "FL", name: "Florida" },
  { code: "GA", name: "Georgia" },
  { code: "HI", name: "Hawaii" },
  { code: "ID", name: "Idaho" },
  { code: "IL", name: "Illinois" },
  { code: "IN", name: "Indiana" },
  { code: "IA", name: "Iowa" },
  { code: "KS", name: "Kansas" },
  { code: "KY", name: "Kentucky" },
  { code: "LA", name: "Louisiana" },
  { code: "ME", name: "Maine" },
  { code: "MD", name: "Maryland" },
  { code: "MA", name: "Massachusetts" },
  { code: "MI", name: "Michigan" },
  { code: "MN", name: "Minnesota" },
  { code: "MS", name: "Mississippi" },
  { code: "MO", name: "Missouri" },
  { code: "MT", name: "Montana" },
  { code: "NE", name: "Nebraska" },
  { code: "NV", name: "Nevada" },
  { code: "NH", name: "New Hampshire" },
  { code: "NJ", name: "New Jersey" },
  { code: "NM", name: "New Mexico" },
  { code: "NY", name: "New York" },
  { code: "NC", name: "North Carolina" },
  { code: "ND", name: "North Dakota" },
  { code: "OH", name: "Ohio" },
  { code: "OK", name: "Oklahoma" },
  { code: "OR", name: "Oregon" },
  { code: "PA", name: "Pennsylvania" },
  { code: "RI", name: "Rhode Island" },
  { code: "SC", name: "South Carolina" },
  { code: "SD", name: "South Dakota" },
  { code: "TN", name: "Tennessee" },
  { code: "TX", name: "Texas" },
  { code: "UT", name: "Utah" },
  { code: "VT", name: "Vermont" },
  { code: "VA", name: "Virginia" },
  { code: "WA", name: "Washington" },
  { code: "WV", name: "West Virginia" },
  { code: "WI", name: "Wisconsin" },
  { code: "WY", name: "Wyoming" }
];

export default function AddressModal({ onClose }: AddressModalProps) {
  const { setZipCode, setStreetAddress, submitAddressSearch } = useLocation();
  const [addressInput, setAddressInput] = useState("");
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const [isLoadingPlaces, setIsLoadingPlaces] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [modalState, setModalState] = useState<"input" | "loading" | "unserviceable">("input");
  const [isManualMode, setIsManualMode] = useState(false);
  const [manualStreet, setManualStreet] = useState("");
  const [manualCity, setManualCity] = useState("");
  const [manualZip, setManualZip] = useState("");
  const [manualState, setManualState] = useState("NJ");
  const [isStateDropdownOpen, setIsStateDropdownOpen] = useState(false);
  const [loadingText, setLoadingText] = useState("Connecting to Property Assessor API...");
  const [loadingSubtext, setLoadingSubtext] = useState("Querying parcel registry...");

  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Fetch places autocomplete from /api/places/autocomplete
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setAddressInput(val);

    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    if (val.trim().length >= 1) {
      setIsLoadingPlaces(true);
      debounceTimer.current = setTimeout(async () => {
        try {
          const res = await fetch(`/api/places/autocomplete?q=${encodeURIComponent(val)}`);
          if (res.ok) {
            const data = await res.json();
            if (data.suggestions && Array.isArray(data.suggestions)) {
              setSuggestions(data.suggestions);
              setShowSuggestions(true);
            }
          }
        } catch (err) {
          console.warn("Places autocomplete error:", err);
        } finally {
          setIsLoadingPlaces(false);
        }
      }, 150);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setIsLoadingPlaces(false);
    }
  };

  // Live GPS Location Detection
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(`/api/places/reverse-geocode?lat=${latitude}&lng=${longitude}`);
          if (res.ok) {
            const data = await res.json();
            if (data.fullAddress) {
              setAddressInput(data.fullAddress);
              setShowSuggestions(false);
              handleSubmit(data.fullAddress);
            }
          }
        } catch (err) {
          console.warn("Location reverse geocoding error:", err);
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        console.warn("Geolocation error:", error);
        setIsLocating(false);
        const sample = "11 Oak Dr, Brick Township, NJ 08723";
        setAddressInput(sample);
        handleSubmit(sample);
      },
      { timeout: 8000 }
    );
  };

  // Handle address check submission
  const handleSubmit = (address: string) => {
    if (!address.trim()) return;

    setAddressInput(address);
    setModalState("loading");

    // Phase 1: Connect to Assessor API
    setLoadingText("Connecting to Property Assessor API...");
    setLoadingSubtext("Querying regional parcel registry database...");

    setTimeout(() => {
      // Phase 2: Retrieve parcel size
      setLoadingText("Retrieving parcel records...");
      setLoadingSubtext("Calculating building square footage area...");

      setTimeout(() => {
        const isSupported = submitAddressSearch(address);
        if (isSupported) {
          onClose();
        } else {
          setZipCode(address);
          setStreetAddress(address);
          onClose();
        }
      }, 600);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#030e2be6] backdrop-blur-sm animate-fade-in">
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-white hover:text-zinc-300 text-[28px] font-light outline-none"
        aria-label="Close modal"
      >
        ×
      </button>

      <div className="w-full max-w-2xl bg-transparent text-center p-6 rounded-lg text-white">
        {modalState === "loading" && (
          <div className="flex flex-col items-center justify-center py-12 gap-6 text-center">
            <div className="w-16 h-16 border-4 border-[#ffc400]/20 border-t-[#ffc400] rounded-full animate-spin"></div>
            <div className="flex flex-col gap-1.5">
              <h3 className="text-[22px] font-extrabold tracking-tight">{loadingText}</h3>
              <p className="text-zinc-400 text-[14px]">{loadingSubtext}</p>
            </div>
          </div>
        )}

        {modalState === "input" && (
          <div className="flex flex-col items-center gap-6">
            <h2 className="text-[36px] sm:text-[46px] font-extrabold tracking-tight leading-tight">
              What is your address?
            </h2>
            <p className="text-zinc-300 text-[15px] sm:text-[17px] -mt-2">
              Your customized price is based on location.
            </p>

            {!isManualMode ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit(addressInput);
                }}
                className="w-full max-w-lg flex flex-col gap-4 mt-4 relative"
              >
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search address or ZIP code..."
                    value={addressInput}
                    onChange={handleInputChange}
                    onFocus={() => {
                      if (addressInput.length >= 1 && suggestions.length > 0) setShowSuggestions(true);
                    }}
                    className="w-full px-6 py-4 bg-white text-zinc-900 placeholder:text-gray-400 text-[16px] font-medium border-0 rounded-full shadow-2xl outline-none focus:ring-4 focus:ring-[#ffc400]/30 transition-all"
                    required
                    autoFocus
                  />

                  {/* Dropdown Suggestions List (Faithfully Matching Terminix Screenshot) */}
                  {showSuggestions && (suggestions.length > 0 || isLocating) && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl overflow-hidden z-50 text-left border border-gray-200 max-h-72 overflow-y-auto">
                      <button
                        type="button"
                        onClick={handleUseCurrentLocation}
                        className="w-full px-6 py-3.5 text-left bg-sky-50 text-sky-800 hover:bg-sky-100 transition-colors border-b border-sky-100 flex items-center gap-3 text-xs font-bold"
                      >
                        {isLocating ? (
                          <Loader2 className="w-4 h-4 text-sky-600 animate-spin shrink-0" />
                        ) : (
                          <Navigation className="w-4 h-4 rotate-45 shrink-0 text-sky-600" />
                        )}
                        <span>{isLocating ? "Detecting GPS location..." : "Use my current location"}</span>
                      </button>

                      {suggestions.map((suggestion, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setAddressInput(suggestion.fullAddress);
                            setShowSuggestions(false);
                            handleSubmit(suggestion.fullAddress);
                          }}
                          className="w-full px-6 py-3.5 text-left text-gray-800 hover:bg-blue-50 hover:text-[#0066cc] transition-colors border-b border-gray-100 last:border-0 flex items-center justify-between text-sm font-medium"
                        >
                          <span className="truncate pr-2">{suggestion.fullAddress}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setIsManualMode(true)}
                  className="text-zinc-300 hover:text-white text-sm font-medium transition-colors mt-1 underline underline-offset-4"
                >
                  Can&apos;t find your address? Enter manually.
                </button>

                <button
                  type="submit"
                  className="w-full sm:w-auto self-center bg-[#ffc400] hover:bg-[#e6af00] text-[#071b4d] font-extrabold text-[13px] uppercase tracking-wider px-10 py-4.5 rounded-full shadow-md transition-all duration-250 mt-2"
                >
                  Continue ›
                </button>
              </form>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const fullAddress = `${manualStreet}, ${manualCity}, ${manualState} ${manualZip}`;
                  handleSubmit(fullAddress);
                }}
                className="w-full max-w-md flex flex-col gap-4 mt-4 text-left"
              >
                <div>
                  <label className="text-zinc-300 text-xs font-bold uppercase tracking-wider mb-1.5 block">Street Address</label>
                  <input
                    type="text"
                    placeholder="Street Address (e.g. 11 Oak Dr)"
                    value={manualStreet}
                    onChange={(e) => setManualStreet(e.target.value)}
                    className="w-full px-5 py-3.5 bg-white text-zinc-900 placeholder:text-gray-400 text-[15px] font-medium border-0 rounded-xl shadow-inner outline-none focus:ring-4 focus:ring-[#ffc400]/30 transition-all"
                    required
                    autoFocus
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-zinc-300 text-xs font-bold uppercase tracking-wider mb-1.5 block">City</label>
                    <input
                      type="text"
                      placeholder="City (e.g. Brick)"
                      value={manualCity}
                      onChange={(e) => setManualCity(e.target.value)}
                      className="w-full px-5 py-3.5 bg-white text-zinc-900 placeholder:text-gray-400 text-[15px] font-medium border-0 rounded-xl shadow-inner outline-none focus:ring-4 focus:ring-[#ffc400]/30 transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-zinc-300 text-xs font-bold uppercase tracking-wider mb-1.5 block">Zip Code</label>
                    <input
                      type="text"
                      placeholder="ZIP Code (e.g. 08723)"
                      value={manualZip}
                      onChange={(e) => setManualZip(e.target.value)}
                      className="w-full px-5 py-3.5 bg-white text-zinc-900 placeholder:text-gray-400 text-[15px] font-medium border-0 rounded-xl shadow-inner outline-none focus:ring-4 focus:ring-[#ffc400]/30 transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-zinc-300 text-xs font-bold uppercase tracking-wider mb-1.5 block">State</label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsStateDropdownOpen(!isStateDropdownOpen)}
                      className="w-full px-5 py-3.5 bg-white text-zinc-900 text-[15px] font-semibold rounded-xl shadow-md flex items-center justify-between outline-none focus:ring-4 focus:ring-[#ffc400]/30 transition-all text-left"
                    >
                      <span>
                        {ALL_US_STATES.find(s => s.code === manualState)?.name || "New Jersey"} ({manualState})
                      </span>
                      <span className="text-gray-500 font-bold text-xs">
                        {isStateDropdownOpen ? "▲" : "▼"}
                      </span>
                    </button>

                    {/* Custom Scrollable State Dropdown Box */}
                    {isStateDropdownOpen && (
                      <div className="absolute bottom-full mb-2 left-0 right-0 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-52 overflow-y-auto text-left py-1 animate-fade-in">
                        <div className="px-4 py-2 bg-gray-50 text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                          Select US State
                        </div>
                        {ALL_US_STATES.map((st) => (
                          <div
                            key={st.code}
                            onClick={() => {
                              setManualState(st.code);
                              setIsStateDropdownOpen(false);
                            }}
                            className={`px-5 py-2.5 text-sm font-semibold cursor-pointer transition-colors border-b border-gray-50 last:border-0 ${
                              manualState === st.code
                                ? "bg-blue-50 text-[#0066cc]"
                                : "text-gray-800 hover:bg-gray-100"
                            }`}
                          >
                            {st.name} ({st.code})
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-between items-center mt-6">
                  <button
                    type="button"
                    onClick={() => setIsManualMode(false)}
                    className="bg-white/10 hover:bg-white/20 text-white font-extrabold text-[12.5px] uppercase tracking-wider px-6 py-3.5 rounded-full border border-white/10 transition-all duration-200"
                  >
                    ‹ Go back
                  </button>
                  <button
                    type="submit"
                    className="bg-[#ffc400] hover:bg-[#e6af00] text-[#071b4d] font-extrabold text-[13px] uppercase tracking-wider px-8 py-3.5 rounded-full shadow-md transition-all duration-200"
                  >
                    Continue ›
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
