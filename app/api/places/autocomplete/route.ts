import { NextRequest, NextResponse } from "next/server";

export interface PlaceSuggestion {
  street: string;
  city: string;
  state: string;
  zip: string;
  fullAddress: string;
  provider?: string;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const rawQuery = searchParams.get("q") || "";
  const query = rawQuery.trim();

  if (!query || query.length < 1) {
    return NextResponse.json({ suggestions: [] });
  }

  const results: PlaceSuggestion[] = [];
  const seenAddresses = new Set<string>();

  const addSuggestion = (item: PlaceSuggestion) => {
    // Normalize key for dedup: lowercase, collapse whitespace
    const key = item.fullAddress.toLowerCase().replace(/\s+/g, " ").trim();
    if (!seenAddresses.has(key)) {
      seenAddresses.add(key);
      results.push(item);
    }
  };

  // ─── STEP 2: Geoapify (ALWAYS called when key present - full US dataset) ──
  const geoapifyApiKey = process.env.GEOAPIFY_API_KEY;
  let geoapifySucceeded = false;

  if (geoapifyApiKey) {
    try {
      const geoRes = await fetch(
        `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
          query
        )}&filter=countrycode:us&apiKey=${geoapifyApiKey}&limit=8`,
        { signal: AbortSignal.timeout(3000) }
      );
      if (geoRes.ok) {
        const geoData = await geoRes.json();
        if (geoData.features && Array.isArray(geoData.features) && geoData.features.length > 0) {
          geoapifySucceeded = true;
          for (const feat of geoData.features.slice(0, 8)) {
            const props = feat.properties || {};
            const stateCode = (props.state_code || "").toUpperCase();

            // Only accept New Jersey results — reject all other states
            if (stateCode && stateCode !== "NJ") continue;

            const house = props.housenumber ? `${props.housenumber} ` : "";
            const streetName = props.street || props.address_line1 || "";
            if (!streetName) continue; // skip city/county-level results with no street
            const fullStreet = `${house}${streetName}`.trim();
            const city = props.city || props.town || props.suburb || props.county || "";
            const zip = props.postcode || "";
            const fullAddress = props.formatted || `${fullStreet}, ${city}, NJ ${zip}`;

            addSuggestion({
              street: fullStreet,
              city,
              state: "NJ",
              zip,
              fullAddress,
              provider: "geoapify",
            });
          }
        }
      }
    } catch (e) {
      console.warn("Geoapify API fetch error:", e);
    }
  }

  // ─── STEP 3: Google Places API (if key present - premium option) ───────────
  const googleApiKey = process.env.GOOGLE_PLACES_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;
  if (googleApiKey && results.length < 8) {
    try {
      const googleRes = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
          query
        )}&components=country:us&key=${googleApiKey}`,
        { signal: AbortSignal.timeout(3000) }
      );
      if (googleRes.ok) {
        const googleData = await googleRes.json();
        if (googleData.predictions && Array.isArray(googleData.predictions)) {
          for (const pred of googleData.predictions.slice(0, 5)) {
            const fullAddress = pred.description;
            const terms = pred.terms || [];
            const street = terms[0]?.value || query;
            const city = terms[1]?.value || "New Jersey";
            const stateCode = terms[2]?.value === "New Jersey" ? "NJ" : terms[2]?.value || "NJ";
            addSuggestion({
              street,
              city,
              state: stateCode,
              zip: stateCode === "NJ" ? "07001" : "10001",
              fullAddress,
              provider: "google",
            });
          }
        }
      }
    } catch (e) {
      console.warn("Google Places API fetch error:", e);
    }
  }

  // ─── STEP 4: Photon fallback (only if Geoapify didn't succeed) ─────────────
  if (!geoapifySucceeded && results.length < 8) {
    const hasOtherState = /\b(NY|CT|PA|DE|CA|FL|TX|IL|GA|MA|MD|VA|NC|SC|OH|MI|CO|AZ|WA|OR|NV|HI|AK|AL|AR|DC|IA|ID|IN|KS|KY|LA|ME|MN|MO|MS|MT|ND|NE|NH|NM|OK|RI|SD|TN|UT|VT|WI|WV|WY|New York|Connecticut|Pennsylvania|California|Florida|Texas|Illinois)\b/i.test(query);
    const houseNumMatch = query.match(/^(\d+[a-zA-Z]?)\s+/);
    const userHouseNum = houseNumMatch ? houseNumMatch[1] : "";

    try {
      const searchQuery = (hasOtherState || query.toLowerCase().includes("nj") || query.toLowerCase().includes("jersey"))
        ? query
        : `${query}, NJ`;

      const photonRes = await fetch(
        `https://photon.komoot.io/api/?q=${encodeURIComponent(searchQuery)}&lat=40.0583&lon=-74.4057&zoom=10&limit=6`,
        { headers: { "User-Agent": "PestIQ-Places-API/2.0" }, signal: AbortSignal.timeout(3000) }
      );

      if (photonRes.ok) {
        const photonData = await photonRes.json();
        if (photonData.features && Array.isArray(photonData.features)) {
          for (const feat of photonData.features) {
            const props = feat.properties || {};
            // Never inject the raw user-typed text as a house number onto unrelated streets
            const house = props.housenumber ? `${props.housenumber} ` : "";
            const streetName = props.street || props.name || "";
            if (!streetName) continue; // skip results with no real street name
            const fullStreet = `${house}${streetName}`.trim();
            const city = props.city || props.town || props.district || props.county || "New Jersey";
            const state = props.state === "New Jersey" ? "NJ" : props.state === "New York" ? "NY" : props.state || "NJ";
            const zip = props.postcode || (state === "NJ" ? "08701" : "10001");

            addSuggestion({
              street: fullStreet,
              city,
              state,
              zip,
              fullAddress: `${fullStreet}, ${city}, ${state} ${zip}`,
              provider: "photon",
            });
          }
        }
      }
    } catch (e) {
      console.warn("Photon API fetch error:", e);
    }
  }

  // ─── STEP 5: OSM Nominatim — only if everything else failed ───────────────
  if (!geoapifySucceeded && results.length < 4) {
    const hasOtherState = /\b(NY|CT|PA|DE|CA|FL|TX|IL|GA|MA|MD|VA|NC|SC|OH|MI|CO|AZ|WA|OR|NV|HI|AK|AL|AR|DC|IA|ID|IN|KS|KY|LA|ME|MN|MO|MS|MT|ND|NE|NH|NM|OK|RI|SD|TN|UT|VT|WI|WV|WY|New York|Connecticut|Pennsylvania|California|Florida|Texas|Illinois)\b/i.test(query);
    const houseNumMatch = query.match(/^(\d+[a-zA-Z]?)\s+/);
    const userHouseNum = houseNumMatch ? houseNumMatch[1] : "";
    const searchTarget = (hasOtherState || query.toLowerCase().includes("nj") || query.toLowerCase().includes("jersey"))
      ? query
      : `${query}, New Jersey`;

    try {
      const osmUrl = hasOtherState
        ? `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchTarget)}&format=json&addressdetails=1&countrycodes=us&limit=6`
        : `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchTarget)}&format=json&addressdetails=1&countrycodes=us&viewbox=-75.55,41.36,-73.89,38.93&limit=6`;

      const osmRes = await fetch(osmUrl, {
        headers: {
          "Accept-Language": "en-US,en",
          "User-Agent": "PestIQ-Web-Address-Autocomplete/2.0",
        },
        signal: AbortSignal.timeout(3000),
      });

      if (osmRes.ok) {
        const osmData = await osmRes.json();
        if (Array.isArray(osmData)) {
          for (const item of osmData) {
            const addr = item.address || {};
            const road = addr.road || addr.pedestrian || addr.street || "";
            if (!road) continue; // skip results with no real street name
            // Never inject raw user-typed text as a house number onto unrelated streets
            const houseNumber = addr.house_number ? `${addr.house_number} ` : "";
            const streetName = `${houseNumber}${road}`.trim();
            const city = addr.city || addr.town || addr.village || addr.suburb || addr.county || "New Jersey";
            const state = addr.state === "New Jersey" ? "NJ" : addr.state === "New York" ? "NY" : addr.state || "NJ";
            const zip = addr.postcode || (state === "NJ" ? "08701" : "10001");

            addSuggestion({
              street: streetName,
              city,
              state,
              zip,
              fullAddress: `${streetName}, ${city}, ${state} ${zip}`,
              provider: "nominatim",
            });
          }
        }
      }
    } catch (e) {
      console.warn("OSM Nominatim fetch error:", e);
    }
  }

  // STEP 6 removed: never fabricate or invent addresses from user input

  // Return max 8 clean results
  return NextResponse.json({ suggestions: results.slice(0, 8) });
}
