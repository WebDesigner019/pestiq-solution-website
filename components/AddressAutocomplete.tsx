"use client";

import React, { useState, useEffect, useRef } from "react";
import { MapPin, Loader2, Navigation, CheckCircle2, AlertCircle } from "lucide-react";
import { VerifiedAddress } from "@/lib/address";

interface AddressAutocompleteProps {
  value: string;
  onSelectVerifiedAddress: (verifiedAddr: VerifiedAddress | null) => void;
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function AddressAutocomplete({
  value,
  onSelectVerifiedAddress,
  placeholder = "Type your NJ street address (min 4 chars)...",
  className,
  style,
}: AddressAutocompleteProps) {
  const [query, setQuery] = useState(value);
  const [selectedItem, setSelectedItem] = useState<VerifiedAddress | null>(null);
  const [suggestions, setSuggestions] = useState<VerifiedAddress[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const wrapperRef = useRef<HTMLDivElement>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchPlaces = (text: string) => {
    const trimmed = text.trim();
    if (trimmed.length < 4) {
      setSuggestions([]);
      setIsLoading(false);
      setShowDropdown(false);
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading(true);
    setErrorMessage("");

    fetch(`/api/address/autocomplete?q=${encodeURIComponent(trimmed)}`, {
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
    setQuery(val);
    setErrorMessage("");

    // Editing clears verification immediately
    if (selectedItem) {
      setSelectedItem(null);
      onSelectVerifiedAddress(null);
    }

    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    if (val.trim().length >= 4) {
      setIsLoading(true);
      debounceTimer.current = setTimeout(() => {
        fetchPlaces(val);
      }, 350);
    } else {
      setSuggestions([]);
      setShowDropdown(false);
      setIsLoading(false);
    }
  };

  const handleSelect = (item: VerifiedAddress) => {
    setQuery(item.formattedAddress);
    setSelectedItem(item);
    onSelectVerifiedAddress(item);
    setShowDropdown(false);
    setErrorMessage("");
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setErrorMessage("Geolocation is not supported by your browser.");
      return;
    }

    setIsLocating(true);
    setErrorMessage("");
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(`/api/places/reverse-geocode?lat=${latitude}&lng=${longitude}`);
          if (res.ok) {
            const data = await res.json();
            if (data.verifiedAddress && data.verifiedAddress.verified) {
              const item: VerifiedAddress = data.verifiedAddress;
              setQuery(item.formattedAddress);
              setSelectedItem(item);
              onSelectVerifiedAddress(item);
              setShowDropdown(false);
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
      (error) => {
        console.warn("Geolocation error:", error);
        setIsLocating(false);
        setErrorMessage("Location access failed. Please type your New Jersey address.");
      },
      { timeout: 8000 }
    );
  };

  return (
    <div ref={wrapperRef} style={{ position: "relative", width: "100%", ...style }}>
      <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => {
            if (query.trim().length >= 4) {
              if (suggestions.length > 0) setShowDropdown(true);
              else fetchPlaces(query);
            }
          }}
          placeholder={placeholder}
          className={className}
          style={{
            width: "100%",
            height: 48,
            paddingLeft: 20,
            paddingRight: isLoading || isLocating ? 40 : 16,
            borderRadius: 50,
            border: selectedItem ? "2px solid #17824b" : "1px solid #cbd5e1",
            fontSize: 15,
            fontWeight: 500,
            color: "#0f172a",
            outline: "none",
            background: "#ffffff",
            boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
          }}
        />

        {(isLoading || isLocating) && (
          <Loader2 style={{ position: "absolute", right: 16, width: 18, height: 18, color: "#0066cc", animation: "spin 1s linear infinite" }} />
        )}
      </div>

      {selectedItem && selectedItem.verified && (
        <div style={{ marginTop: 6, fontSize: 12, fontWeight: 600, color: "#166534", display: "flex", alignItems: "center", gap: 4 }}>
          <CheckCircle2 style={{ width: 14, height: 14, color: "#16a34a" }} />
          Verified Property: {selectedItem.houseNumber} {selectedItem.street}, {selectedItem.city}, NJ {selectedItem.postalCode}
        </div>
      )}

      {errorMessage && (
        <div style={{ marginTop: 6, fontSize: 12, fontWeight: 600, color: "#b45309", display: "flex", alignItems: "center", gap: 4, background: "#fef3c7", padding: "8px 12px", borderRadius: 8, border: "1px solid #fde68a" }}>
          <AlertCircle style={{ width: 14, height: 14, color: "#d97706", flexShrink: 0 }} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Autocomplete Dropdown List */}
      {showDropdown && (
        <div style={{
          position: "absolute",
          top: "100%",
          left: 0,
          right: 0,
          marginTop: 8,
          background: "#ffffff",
          borderRadius: 16,
          border: "1px solid #e2e8f0",
          boxShadow: "0 15px 35px rgba(0,0,0,0.18)",
          zIndex: 50,
          overflow: "hidden",
          maxHeight: 280,
        }}>
          {/* Top GPS Option */}
          <div
            onClick={handleUseCurrentLocation}
            style={{
              padding: "12px 18px",
              display: "flex",
              alignItems: "center",
              gap: 10,
              cursor: "pointer",
              background: "#f0f9ff",
              borderBottom: "1px solid #e0f2fe",
              color: "#0369a1",
              fontWeight: 700,
              fontSize: 13,
            }}
          >
            {isLocating ? (
              <Loader2 style={{ width: 15, height: 15, color: "#0284c7", animation: "spin 1s linear infinite" }} />
            ) : (
              <Navigation style={{ width: 15, height: 15, transform: "rotate(45deg)", color: "#0284c7" }} />
            )}
            <span>{isLocating ? "Detecting GPS location..." : "Use my current location"}</span>
          </div>

          {suggestions.map((item, idx) => (
            <div
              key={idx}
              onClick={() => handleSelect(item)}
              style={{
                padding: "12px 18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                cursor: "pointer",
                borderBottom: "1px solid #f8fafc",
                transition: "background 0.15s",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "#f1f5f9")}
              onMouseLeave={e => (e.currentTarget.style.background = "#ffffff")}
            >
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>
                  {item.houseNumber} {item.street}
                </div>
                <div style={{ fontSize: 12, fontWeight: 500, color: "#64748b" }}>
                  {item.city}, NJ {item.postalCode}
                </div>
              </div>
              <span style={{ fontSize: 10, fontWeight: 700, background: "#e2e8f0", color: "#334155", padding: "3px 8px", borderRadius: 4 }}>
                SELECT
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
