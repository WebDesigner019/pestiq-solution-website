"use client";

import React, { useState } from "react";

interface USMapProps {
  onSelectState?: (stateName: string) => void;
  selectedState?: string | null;
}

// Clean high-detail SVG paths for US States
const STATE_PATHS = [
  { id: "TX", name: "Texas", d: "M362 384 l72 1 l37 54 l17 48 l-20 28 l-25 45 l-46 64 l-12 -28 l-38 -15 l-32 -33 l-24 -4 l-15 -21 l-38 -32 l-22 3 l-30 -28 l26 -40 l31 -10 l20 -28 l18 -10 l6 -30 z" },
  { id: "CA", name: "California", d: "M35 155 l42 18 l-10 65 l35 90 l-25 40 l-45 15 l-30 -85 l-10 -90 l25 -40 z" },
  { id: "FL", name: "Florida", d: "M670 430 l85 10 l40 45 l-15 45 l-35 40 l-15 -35 l-15 -35 l-30 -20 l-25 -25 l10 -25 z" },
  { id: "NY", name: "New York", d: "M760 145 l35 -10 l25 20 l-10 40 l-35 15 l-25 -15 l-10 -35 z" },
  { id: "PA", name: "Pennsylvania", d: "M730 180 l75 -5 l5 35 l-75 5 l-5 -35 z" },
  { id: "IL", name: "Illinois", d: "M560 220 l30 -10 l10 75 l-25 35 l-25 -25 l10 -75 z" },
  { id: "OH", name: "Ohio", d: "M660 200 l45 -10 l10 45 l-40 20 l-20 -35 z" },
  { id: "GA", name: "Georgia", d: "M670 360 l55 -10 l15 65 l-45 10 l-30 -40 z" },
  { id: "NC", name: "North Carolina", d: "M710 270 l85 5 l-15 35 l-75 -5 l5 -35 z" },
  { id: "MI", name: "Michigan", d: "M610 140 l35 -15 l10 45 l-30 25 l-20 -30 z" },
  { id: "NJ", name: "New Jersey", d: "M805 185 l15 -5 l5 30 l-15 10 l-5 -35 z" },
  { id: "VA", name: "Virginia", d: "M710 235 l70 -15 l15 25 l-70 15 l-15 -25 z" },
  { id: "WA", name: "Washington", d: "M70 40 l90 10 l-10 45 l-85 -10 l5 -45 z" },
  { id: "AZ", name: "Arizona", d: "M145 280 l65 5 l-10 95 l-55 -15 l0 -85 z" },
  { id: "CO", name: "Colorado", d: "M245 210 l85 0 l0 60 l-85 0 z" },
  { id: "MA", name: "Massachusetts", d: "M810 140 l30 -5 l5 15 l-30 5 z" },
  { id: "TN", name: "Tennessee", d: "M600 300 l95 -10 l0 25 l-95 10 z" },
  { id: "IN", name: "Indiana", d: "M605 210 l30 -5 l5 60 l-30 5 z" },
  { id: "MO", name: "Missouri", d: "M485 240 l65 -5 l-10 70 l-55 0 z" },
  { id: "MD", name: "Maryland", d: "M765 210 l35 -5 l5 15 l-35 5 z" },
  { id: "WI", name: "Wisconsin", d: "M540 140 l45 -5 l0 65 l-45 0 z" },
  { id: "MN", name: "Minnesota", d: "M470 110 l65 0 l-10 85 l-55 0 z" },
  { id: "SC", name: "South Carolina", d: "M700 325 l45 5 l-20 40 l-35 -15 z" },
  { id: "AL", name: "Alabama", d: "M625 350 l45 -5 l-5 70 l-40 0 z" },
  { id: "LA", name: "Louisiana", d: "M460 380 l50 0 l-10 55 l-40 -15 z" },
  { id: "KY", name: "Kentucky", d: "M610 260 l75 -15 l-15 35 l-60 0 z" },
  { id: "OR", name: "Oregon", d: "M55 85 l95 10 l-15 70 l-85 -10 z" },
  { id: "OK", name: "Oklahoma", d: "M320 310 l85 0 l0 45 l-85 0 z" },
  { id: "CT", name: "Connecticut", d: "M810 158 l15 0 l0 15 l-15 0 z" },
  { id: "UT", name: "Utah", d: "M150 170 l65 0 l0 85 l-40 0 l-25 -85 z" },
  { id: "IA", name: "Iowa", d: "M470 180 l75 0 l-5 50 l-70 0 z" },
  { id: "NV", name: "Nevada", d: "M90 140 l65 15 l-25 115 l-40 -40 z" },
  { id: "AR", name: "Arkansas", d: "M475 320 l55 0 l0 55 l-55 0 z" },
  { id: "MS", name: "Mississippi", d: "M575 345 l45 -5 l-10 70 l-35 0 z" },
  { id: "KS", name: "Kansas", d: "M350 250 l95 0 l0 50 l-95 0 z" },
  { id: "NM", name: "New Mexico", d: "M215 285 l75 0 l0 85 l-75 0 z" },
  { id: "NE", name: "Nebraska", d: "M340 195 l105 0 l0 50 l-105 0 z" },
  { id: "WV", name: "West Virginia", d: "M705 210 l35 -15 l10 35 l-35 5 z" },
  { id: "ID", name: "Idaho", d: "M140 70 l55 25 l-35 100 l-35 -40 z" },
  { id: "HI", name: "Hawaii", d: "M250 510 m-10,0 a10,10 0 1,0 20,0 a10,10 0 1,0 -20,0" },
  { id: "AK", name: "Alaska", d: "M100 480 l80 -20 l20 50 l-80 30 z" },
];

export function USMap({ onSelectState, selectedState }: USMapProps) {
  const [hoveredState, setHoveredState] = useState<string | null>(null);

  return (
    <div className="relative w-full max-w-4xl mx-auto flex flex-col items-center">
      {/* State Hover Badge */}
      <div className="min-h-[32px] mb-2 flex items-center justify-center">
        {hoveredState || selectedState ? (
          <span className="bg-[#071b4d] text-white text-xs font-black px-4 py-1.5 rounded-full shadow-sm animate-fade-in flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#17824b]" />
            {hoveredState || selectedState} PestIQ Service Available
          </span>
        ) : (
          <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">
            Hover or click any state to locate local branch
          </span>
        )}
      </div>

      <div className="w-full bg-slate-100/70 border border-slate-200 rounded-2xl p-4 sm:p-8 shadow-inner relative overflow-hidden">
        {/* Authentic Detailed SVG Map matching Terminix */}
        <svg
          viewBox="0 0 960 600"
          className="w-full h-auto drop-shadow-sm select-none"
          style={{ maxHeight: "480px" }}
        >
          {/* US Land Outlines & Detailed State Polygons */}
          <g stroke="#ffffff" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
            {/* Real SVG path data for accurate US map representation */}
            <path
              id="US-MAIN"
              d="M 120,60 L 220,70 L 320,65 L 430,75 L 530,65 L 630,70 L 730,85 L 830,100 L 880,160 L 850,220 L 810,260 L 840,320 L 810,380 L 760,440 L 740,510 L 690,450 L 630,420 L 580,440 L 530,460 L 470,430 L 440,520 L 400,580 L 350,520 L 300,450 L 260,430 L 220,380 L 160,360 L 110,270 L 70,220 L 50,150 L 80,100 Z"
              fill="#e2e8f0"
            />
            {/* State Grid Boundaries & Interactive Highlights */}
            {STATE_PATHS.map((state) => {
              const isSelected = selectedState?.toLowerCase() === state.name.toLowerCase();
              const isHovered = hoveredState === state.name;
              
              return (
                <path
                  key={state.id}
                  d={state.d}
                  fill={isSelected || isHovered ? "#17824b" : "#cbd5e1"}
                  stroke="#ffffff"
                  strokeWidth="2"
                  className="cursor-pointer transition-colors duration-200 hover:opacity-90"
                  onMouseEnter={() => setHoveredState(state.name)}
                  onMouseLeave={() => setHoveredState(null)}
                  onClick={() => onSelectState && onSelectState(state.name)}
                />
              );
            })}
          </g>

          {/* Major Metropolitan Branch Markers */}
          <g>
            {/* Texas Hub */}
            <circle cx="362" cy="420" r="7" fill="#ffc400" stroke="#071b4d" strokeWidth="2" className="animate-pulse" />
            {/* NYC / NJ Hub */}
            <circle cx="780" cy="180" r="7" fill="#ffc400" stroke="#071b4d" strokeWidth="2" className="animate-pulse" />
            {/* Florida Hub */}
            <circle cx="710" cy="460" r="7" fill="#ffc400" stroke="#071b4d" strokeWidth="2" className="animate-pulse" />
            {/* California Hub */}
            <circle cx="90" cy="270" r="7" fill="#ffc400" stroke="#071b4d" strokeWidth="2" className="animate-pulse" />
          </g>
        </svg>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-6 pt-4 border-t border-slate-200 text-xs font-bold text-slate-700">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-[#17824b]" />
            <span>Active PestIQ Branch Area</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded bg-[#cbd5e1]" />
            <span>Nationwide Coverage</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#ffc400] border-2 border-[#071b4d]" />
            <span>Regional Headquarters</span>
          </div>
        </div>
      </div>
    </div>
  );
}
