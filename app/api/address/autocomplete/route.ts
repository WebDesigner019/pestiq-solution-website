import { NextRequest, NextResponse } from "next/server";
import { normalizeGeoapifyFeature, VerifiedAddress } from "@/lib/address";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const rawQuery = searchParams.get("q") || "";
    const query = rawQuery.trim();

    // 1. Input Validation: Minimum 4 useful characters, Maximum 100 characters
    if (!query || query.length < 4 || query.length > 100) {
      return NextResponse.json({ suggestions: [] });
    }

    // 2. Environment Variable Check: Server-only secret
    const apiKey = process.env.GEOAPIFY_API_KEY;
    if (!apiKey) {
      console.error("GEOAPIFY_API_KEY environment variable is not configured on the server.");
      return NextResponse.json(
        { error: "Server configuration error: GEOAPIFY_API_KEY is missing." },
        { status: 500 }
      );
    }

    // 3. Server-side Geoapify Autocomplete Request
    // Country filter: US, Geographic bias & bounding box: New Jersey (-75.5597, 38.9285, -73.8939, 41.3574)
    const geoapifyUrl = new URL("https://api.geoapify.com/v1/geocode/autocomplete");
    geoapifyUrl.searchParams.set("text", query);
    geoapifyUrl.searchParams.set("filter", "countrycode:us,rect:-75.5597,38.9285,-73.8939,41.3574");
    geoapifyUrl.searchParams.set("bias", "rect:-75.5597,38.9285,-73.8939,41.3574");
    geoapifyUrl.searchParams.set("limit", "10");
    geoapifyUrl.searchParams.set("lang", "en");
    geoapifyUrl.searchParams.set("apiKey", apiKey);

    const geoRes = await fetch(geoapifyUrl.toString(), {
      signal: AbortSignal.timeout(4000),
      headers: { Accept: "application/json" },
    });

    if (!geoRes.ok) {
      console.warn(`Geoapify returned HTTP ${geoRes.status}`);
      return NextResponse.json({ suggestions: [] });
    }

    const data = await geoRes.json();
    const features = Array.isArray(data.features) ? data.features : [];

    // 4. Strict Server-side New Jersey Filtering, House-Number Requirement, and Normalization
    const verifiedSuggestions: VerifiedAddress[] = [];
    const seenAddresses = new Set<string>();

    for (const feat of features) {
      const normalized = normalizeGeoapifyFeature(feat);
      if (!normalized) continue;

      const dedupeKey = normalized.formattedAddress.toLowerCase();
      if (!seenAddresses.has(dedupeKey)) {
        seenAddresses.add(dedupeKey);
        verifiedSuggestions.push(normalized);
      }
    }

    // 5. Return max 5 verified New Jersey suggestions
    return NextResponse.json({ suggestions: verifiedSuggestions.slice(0, 5) });
  } catch (err: any) {
    if (err.name === "AbortError") {
      return NextResponse.json({ suggestions: [] });
    }
    console.warn("Address autocomplete API error:", err);
    return NextResponse.json({ suggestions: [] });
  }
}
