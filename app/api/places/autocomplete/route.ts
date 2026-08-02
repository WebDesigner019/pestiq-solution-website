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
    const key = item.fullAddress.toLowerCase().replace(/\s+/g, " ").trim();
    if (!seenAddresses.has(key)) {
      seenAddresses.add(key);
      results.push(item);
    }
  };

  // ─── GEOAPIFY: The only trusted source of address data ────────────────────
  // We ONLY use Geoapify. No Photon, no Nominatim, no synthetic fallbacks.
  // Geoapify returns real, verified addresses directly from authoritative datasets.
  const geoapifyApiKey = process.env.GEOAPIFY_API_KEY;

  if (!geoapifyApiKey) {
    console.error("GEOAPIFY_API_KEY is not set. No address results will be returned.");
    return NextResponse.json({ suggestions: [] });
  }

  try {
    const geoRes = await fetch(
      `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
        query
      )}&filter=countrycode:us&apiKey=${geoapifyApiKey}&limit=8`,
      { signal: AbortSignal.timeout(4000) }
    );

    if (!geoRes.ok) {
      console.warn(`Geoapify returned HTTP ${geoRes.status}`);
      return NextResponse.json({ suggestions: [] });
    }

    const geoData = await geoRes.json();

    if (!geoData.features || !Array.isArray(geoData.features)) {
      return NextResponse.json({ suggestions: [] });
    }

    for (const feat of geoData.features.slice(0, 8)) {
      const props = feat.properties || {};
      const stateCode = (props.state_code || "").toUpperCase();

      // ── Only accept New Jersey results ──────────────────────────────────────
      // Geoapify returns the real state_code from its dataset — we trust this.
      if (stateCode && stateCode !== "NJ") continue;

      // ── Require a real street name — reject city/county-level entries ───────
      const streetName = props.street || props.address_line1 || "";
      if (!streetName) continue;

      // ── Build address components from verified Geoapify data only ───────────
      const house = props.housenumber ? `${props.housenumber} ` : "";
      const fullStreet = `${house}${streetName}`.trim();
      const city = props.city || props.town || props.suburb || props.county || "";
      const zip = props.postcode || "";

      // props.formatted is Geoapify's authoritative formatted address string.
      // It is always accurate — use it as the primary display value.
      const fullAddress = props.formatted || `${fullStreet}, ${city}, NJ ${zip}`.trim();

      addSuggestion({
        street: fullStreet,
        city,
        state: "NJ",
        zip,
        fullAddress,
        provider: "geoapify",
      });
    }
  } catch (e) {
    console.warn("Geoapify autocomplete fetch error:", e);
  }

  // ── No fabrication. No fallbacks. If Geoapify returned nothing, we return nothing. ──
  return NextResponse.json({ suggestions: results.slice(0, 8) });
}
