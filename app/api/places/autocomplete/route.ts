import { NextRequest, NextResponse } from "next/server";

export interface PlaceSuggestion {
  street: string;
  city: string;
  state: string;
  zip: string;
  fullAddress: string;
  provider?: string;
}

// New Jersey geographic bounding box (west, south, east, north)
// Geoapify rect filter: minLon,minLat,maxLon,maxLat
const NJ_RECT = "-75.6,38.9,-73.9,41.4";
// NJ center for proximity bias (Toms River area)
const NJ_BIAS = "proximity:-74.4057,40.0583";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const rawQuery = searchParams.get("q") || "";
  const query = rawQuery.trim();

  if (!query || query.length < 1) {
    return NextResponse.json({ suggestions: [] });
  }

  const geoapifyApiKey = process.env.GEOAPIFY_API_KEY;

  if (!geoapifyApiKey) {
    console.error("GEOAPIFY_API_KEY is not set.");
    return NextResponse.json({ suggestions: [] });
  }

  try {
    // Use Geoapify's built-in NJ bounding box filter + proximity bias.
    // This means Geoapify itself restricts results to New Jersey geographically
    // — we never need to filter or fabricate anything ourselves.
    const url = [
      `https://api.geoapify.com/v1/geocode/autocomplete`,
      `?text=${encodeURIComponent(query)}`,
      `&filter=rect:${NJ_RECT}`,
      `&bias=${NJ_BIAS}`,
      `&limit=8`,
      `&apiKey=${geoapifyApiKey}`,
    ].join("");

    const geoRes = await fetch(url, { signal: AbortSignal.timeout(4000) });

    if (!geoRes.ok) {
      console.warn(`Geoapify returned HTTP ${geoRes.status}`);
      return NextResponse.json({ suggestions: [] });
    }

    const geoData = await geoRes.json();

    if (!geoData.features || !Array.isArray(geoData.features)) {
      return NextResponse.json({ suggestions: [] });
    }

    const results: PlaceSuggestion[] = [];
    const seen = new Set<string>();

    for (const feat of geoData.features) {
      const props = feat.properties || {};

      // Require a real street-level result
      const streetName = props.street || props.address_line1 || "";
      if (!streetName) continue;

      const house = props.housenumber ? `${props.housenumber} ` : "";
      const fullStreet = `${house}${streetName}`.trim();
      const city = props.city || props.town || props.suburb || props.county || "";
      const stateCode = (props.state_code || "NJ").toUpperCase();
      const zip = props.postcode || "";

      // props.formatted is Geoapify's authoritative address string — always accurate
      const fullAddress = props.formatted || `${fullStreet}, ${city}, ${stateCode} ${zip}`.trim();

      const key = fullAddress.toLowerCase().replace(/\s+/g, " ").trim();
      if (!seen.has(key)) {
        seen.add(key);
        results.push({ street: fullStreet, city, state: stateCode, zip, fullAddress, provider: "geoapify" });
      }
    }

    return NextResponse.json({ suggestions: results });
  } catch (e) {
    console.warn("Geoapify autocomplete error:", e);
    return NextResponse.json({ suggestions: [] });
  }
}
