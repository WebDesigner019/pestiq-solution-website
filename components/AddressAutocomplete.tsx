"use client";

import React, { useState, useEffect, useRef } from "react";
import { MapPin, Search, Loader2 } from "lucide-react";

interface AddressAutocompleteProps {
  value: string;
  onChange: (address: string, zip?: string, city?: string, state?: string) => void;
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
}

interface AddressResult {
  street: string;
  city: string;
  state: string;
  zip: string;
  fullAddress: string;
}

// Fallback suggestions for Tri-State area
const FALLBACK_STREETS: AddressResult[] = [
  { street: "123 Main Street", city: "Newark", state: "NJ", zip: "07102", fullAddress: "123 Main Street, Newark, NJ 07102" },
  { street: "45 Ocean Avenue", city: "Jersey City", state: "NJ", zip: "07305", fullAddress: "45 Ocean Avenue, Jersey City, NJ 07305" },
  { street: "88 Broad Street", city: "Trenton", state: "NJ", zip: "08608", fullAddress: "88 Broad Street, Trenton, NJ 08608" },
  { street: "500 Princeton Pike", city: "Princeton", state: "NJ", zip: "08540", fullAddress: "500 Princeton Pike, Princeton, NJ 08540" },
  { street: "140 Atlantic Avenue", city: "Atlantic City", state: "NJ", zip: "08401", fullAddress: "140 Atlantic Avenue, Atlantic City, NJ 08401" },
  { street: "248 W 57th Street", city: "New York", state: "NY", zip: "10107", fullAddress: "248 W 57th Street, New York, NY 10107" },
  { street: "55 Mamaroneck Ave", city: "White Plains", state: "NY", zip: "10601", fullAddress: "55 Mamaroneck Ave, White Plains, NY 10601" },
];

export default function AddressAutocomplete({
  value,
  onChange,
  placeholder = "Enter street address (e.g. 123 Main St, Newark, NJ)",
  className,
  style,
}: AddressAutocompleteProps) {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<AddressResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

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

  const fetchOpenStreetMapPlaces = async (text: string) => {
    if (text.trim().length < 3) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      // Query OpenStreetMap Nominatim API (100% Free, No Credit Card, No Key required)
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(text)}&format=json&addressdetails=1&countrycodes=us&limit=6`,
        {
          headers: {
            "Accept-Language": "en-US,en",
            "User-Agent": "PestIQ-Web-Address-Autocomplete/1.0",
          },
        }
      );

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const formatted: AddressResult[] = data.map((item: any) => {
            const addr = item.address || {};
            const road = addr.road || addr.pedestrian || addr.street || item.display_name.split(",")[0];
            const houseNumber = addr.house_number ? `${addr.house_number} ` : "";
            const streetName = `${houseNumber}${road}`.trim();
            const city = addr.city || addr.town || addr.village || addr.suburb || addr.county || "New Jersey";
            const state = addr.state === "New Jersey" ? "NJ" : addr.state === "New York" ? "NY" : addr.state || "NJ";
            const zip = addr.postcode || (state === "NJ" ? "07001" : "10001");

            return {
              street: streetName,
              city,
              state,
              zip,
              fullAddress: `${streetName}, ${city}, ${state} ${zip}`,
            };
          });

          setSuggestions(formatted);
          setShowDropdown(true);
          setIsLoading(false);
          return;
        }
      }
    } catch (err) {
      console.warn("OpenStreetMap search warning:", err);
    }

    // Fallback to offline search matching
    const filtered = FALLBACK_STREETS.filter(s =>
      s.fullAddress.toLowerCase().includes(text.toLowerCase())
    );
    setSuggestions(
      filtered.length > 0
        ? filtered
        : [{ street: text, city: "New Jersey", state: "NJ", zip: "07001", fullAddress: `${text}, New Jersey, NJ 07001` }]
    );
    setShowDropdown(true);
    setIsLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    onChange(val);

    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    if (val.trim().length >= 3) {
      setIsLoading(true);
      debounceTimer.current = setTimeout(() => {
        fetchOpenStreetMapPlaces(val);
      }, 350);
    } else {
      setSuggestions([]);
      setShowDropdown(false);
      setIsLoading(false);
    }
  };

  const handleSelect = (item: AddressResult) => {
    setQuery(item.fullAddress);
    onChange(item.fullAddress, item.zip, item.city, item.state);
    setShowDropdown(false);
  };

  return (
    <div ref={wrapperRef} style={{ position: "relative", width: "100%", ...style }}>
      <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
        <MapPin style={{ position: "absolute", left: 14, width: 18, height: 18, color: "#1557b8", pointerEvents: "none" }} />
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => { if (query.trim().length >= 3) setShowDropdown(true); }}
          placeholder={placeholder}
          className={className}
          style={{
            width: "100%",
            height: 48,
            paddingLeft: 42,
            paddingRight: isLoading ? 40 : 16,
            borderRadius: 10,
            border: "1.5px solid #cbd5e1",
            fontSize: 14,
            fontWeight: 600,
            color: "#0f172a",
            outline: "none",
            background: "#ffffff",
          }}
        />
        {isLoading && (
          <Loader2 style={{ position: "absolute", right: 14, width: 18, height: 18, color: "#1557b8", animation: "spin 1s linear infinite" }} />
        )}
      </div>

      {/* Autocomplete Dropdown List */}
      {showDropdown && suggestions.length > 0 && (
        <div style={{
          position: "absolute",
          top: "100%",
          left: 0,
          right: 0,
          marginTop: 6,
          background: "#ffffff",
          borderRadius: 12,
          border: "1px solid #e2e8f0",
          boxShadow: "0 10px 25px rgba(0,0,0,0.12)",
          zIndex: 50,
          overflow: "hidden",
          maxHeight: 260,
        }}>
          <div style={{ padding: "8px 12px", background: "#f8fafc", borderBottom: "1px solid #f1f5f9", fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", display: "flex", justifyContent: "space-between" }}>
            <span>Live Street Address Autocomplete</span>
            <span style={{ color: "#1557b8" }}>100% Free · No Card Required</span>
          </div>
          {suggestions.map((item, idx) => (
            <div
              key={idx}
              onClick={() => handleSelect(item)}
              style={{
                padding: "10px 14px",
                display: "flex",
                alignItems: "center",
                gap: 10,
                cursor: "pointer",
                borderBottom: "1px solid #f8fafc",
                transition: "background 0.1s",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "#eff6ff")}
              onMouseLeave={e => (e.currentTarget.style.background = "#ffffff")}
            >
              <Search style={{ width: 14, height: 14, color: "#1557b8", flexShrink: 0 }} />
              <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{item.street}</p>
                <p style={{ margin: 0, fontSize: 11, color: "#64748b" }}>{item.city}, {item.state} {item.zip} · PestIQ Covered Area</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
