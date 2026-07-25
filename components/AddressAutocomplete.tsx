"use client";

import React, { useState, useEffect, useRef } from "react";
import { MapPin, Search } from "lucide-react";

interface AddressAutocompleteProps {
  value: string;
  onChange: (address: string, zip?: string, city?: string, state?: string) => void;
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
}

// Popular sample street suggestions for Tri-State area fallback when Google Places Key is pending
const SAMPLE_STREETS = [
  { street: "123 Main Street", city: "Newark", state: "NJ", zip: "07102" },
  { street: "45 Ocean Avenue", city: "Jersey City", state: "NJ", zip: "07305" },
  { street: "88 Broad Street", city: "Trenton", state: "NJ", zip: "08608" },
  { street: "500 Princeton Pike", city: "Princeton", state: "NJ", zip: "08540" },
  { street: "140 Atlantic Avenue", city: "Atlantic City", state: "NJ", zip: "08401" },
  { street: "248 W 57th Street", city: "New York", state: "NY", zip: "10107" },
  { street: "55 Mamaroneck Ave", city: "White Plains", state: "NY", zip: "10601" },
];

export default function AddressAutocomplete({
  value,
  onChange,
  placeholder = "Enter street address (e.g. 123 Main St, Newark, NJ)",
  className,
  style,
}: AddressAutocompleteProps) {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<typeof SAMPLE_STREETS>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    onChange(val);

    if (val.trim().length > 1) {
      const filtered = SAMPLE_STREETS.filter(s =>
        `${s.street} ${s.city} ${s.state} ${s.zip}`.toLowerCase().includes(val.toLowerCase())
      );
      setSuggestions(filtered.length > 0 ? filtered : [
        { street: val, city: "New Jersey", state: "NJ", zip: "07001" }
      ]);
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  };

  const handleSelect = (item: typeof SAMPLE_STREETS[0]) => {
    const fullAddr = `${item.street}, ${item.city}, ${item.state} ${item.zip}`;
    setQuery(fullAddr);
    onChange(fullAddr, item.zip, item.city, item.state);
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
          onFocus={() => { if (query.trim().length > 1) setShowDropdown(true); }}
          placeholder={placeholder}
          className={className}
          style={{
            width: "100%",
            height: 48,
            paddingLeft: 42,
            paddingRight: 16,
            borderRadius: 10,
            border: "1.5px solid #cbd5e1",
            fontSize: 14,
            fontWeight: 600,
            color: "#0f172a",
            outline: "none",
            background: "#ffffff",
          }}
        />
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
          maxHeight: 240,
        }}>
          <div style={{ padding: "8px 12px", background: "#f8fafc", borderBottom: "1px solid #f1f5f9", fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Suggested Address Match
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
              <div>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{item.street}</p>
                <p style={{ margin: 0, fontSize: 11, color: "#64748b" }}>{item.city}, {item.state} {item.zip} · New Jersey Statewide Coverage</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
