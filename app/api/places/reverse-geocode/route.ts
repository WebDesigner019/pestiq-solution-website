import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  if (!lat || !lng) {
    return NextResponse.json({ error: "Latitude and Longitude are required" }, { status: 400 });
  }

  // ── GEOAPIFY reverse geocode: the only trusted source ───────────────────────
  // We use only Geoapify. No Nominatim fallback, no hardcoded mock address.
  const geoapifyApiKey = process.env.GEOAPIFY_API_KEY;

  if (!geoapifyApiKey) {
    console.error("GEOAPIFY_API_KEY is not set. Cannot reverse geocode.");
    return NextResponse.json(
      { error: "Location lookup unavailable. Please type your address manually." },
      { status: 503 }
    );
  }

  try {
    const geoRes = await fetch(
      `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&apiKey=${geoapifyApiKey}`,
      { signal: AbortSignal.timeout(5000) }
    );

    if (!geoRes.ok) {
      console.warn(`Geoapify reverse geocode returned HTTP ${geoRes.status}`);
      return NextResponse.json(
        { error: "Could not detect your location. Please type your address." },
        { status: 502 }
      );
    }

    const geoData = await geoRes.json();
    const feat = geoData.features?.[0];

    if (!feat) {
      return NextResponse.json(
        { error: "No address found at your location. Please type your address." },
        { status: 404 }
      );
    }

    const props = feat.properties || {};

    // ── Build from verified Geoapify data only ───────────────────────────────
    const house = props.housenumber ? `${props.housenumber} ` : "";
    const streetName = props.street || props.address_line1 || "";
    const street = `${house}${streetName}`.trim();
    const city = props.city || props.town || props.suburb || props.county || "";
    const stateCode = (props.state_code || "NJ").toUpperCase();
    const zip = props.postcode || "";

    // props.formatted is Geoapify's authoritative formatted address string.
    const fullAddress = props.formatted || `${street}, ${city}, ${stateCode} ${zip}`.trim();

    return NextResponse.json({
      street,
      city,
      state: stateCode,
      zip,
      fullAddress,
      provider: "geoapify",
    });
  } catch (err) {
    console.warn("Geoapify Reverse Geocode error:", err);
    return NextResponse.json(
      { error: "Location lookup failed. Please type your address." },
      { status: 500 }
    );
  }
}
