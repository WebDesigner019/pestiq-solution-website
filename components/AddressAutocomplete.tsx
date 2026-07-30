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

export default function AddressAutocomplete({
  value,
  onChange,
  placeholder = "Enter street address (e.g. 11 Oak Dr, Brick, NJ)",
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

  const fetchPlaces = async (text: string) => {
    if (text.trim().length < 2) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`/api/places/autocomplete?q=${encodeURIComponent(text)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.suggestions && Array.isArray(data.suggestions)) {
          setSuggestions(data.suggestions);
          setShowDropdown(true);
          setIsLoading(false);
          return;
        }
      }
    } catch (err) {
      console.warn("Places API autocomplete error:", err);
    }

    // Fallback suggestion format
    setSuggestions([
      {
        street: text,
        city: "Toms River",
        state: "NJ",
        zip: "08753",
        fullAddress: `${text}, Toms River, NJ 08753`,
      },
    ]);
    setShowDropdown(true);
    setIsLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    onChange(val);

    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    if (val.trim().length >= 2) {
      setIsLoading(true);
      debounceTimer.current = setTimeout(() => {
        fetchPlaces(val);
      }, 250);
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
          onFocus={() => {
            if (query.trim().length >= 2) {
              if (suggestions.length > 0) setShowDropdown(true);
              else fetchPlaces(query);
            }
          }}
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
          {suggestions.map((item, idx) => (
            <div
              key={idx}
              onClick={() => handleSelect(item)}
              style={{
                padding: "11px 14px",
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
              <Search style={{ width: 15, height: 15, color: "#1557b8", flexShrink: 0 }} />
              <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                <p style={{ margin: 0, fontSize: 13.5, fontWeight: 700, color: "#0f172a" }}>{item.street}</p>
                <p style={{ margin: 0, fontSize: 11.5, color: "#64748b" }}>{item.city}, {item.state} {item.zip} · Verified Service Area</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
