import { NextRequest, NextResponse } from "next/server";
import { normalizeGeoapifyFeature } from "@/lib/address";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  if (!lat || !lng) {
    return NextResponse.json({ error: "Latitude and Longitude are required" }, { status: 400 });
  }

  const geoapifyApiKey = process.env.GEOAPIFY_API_KEY;
  if (!geoapifyApiKey) {
    return NextResponse.json(
      { error: "Server configuration error: GEOAPIFY_API_KEY is missing." },
      { status: 500 }
    );
  }

  try {
    const geoRes = await fetch(
      `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&apiKey=${geoapifyApiKey}&lang=en`,
      { signal: AbortSignal.timeout(4000) }
    );

    if (geoRes.ok) {
      const geoData = await geoRes.json();
      const feat = geoData.features?.[0];
      if (feat) {
        const verified = normalizeGeoapifyFeature(feat);
        if (verified) {
          return NextResponse.json({
            street: verified.addressLine1,
            city: verified.city,
            state: verified.stateCode,
            zip: verified.postalCode,
            fullAddress: verified.formattedAddress,
            verifiedAddress: verified,
            provider: "geoapify",
          });
        }
      }
    }
  } catch (err) {
    console.warn("Geoapify Reverse Geocode error:", err);
  }

  return NextResponse.json(
    { error: "Could not verify a building-level property in New Jersey at this location." },
    { status: 400 }
  );
}
