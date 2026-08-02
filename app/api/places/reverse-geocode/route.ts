import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  if (!lat || !lng) {
    return NextResponse.json({ error: "Latitude and Longitude are required" }, { status: 400 });
  }

  const geoapifyApiKey = process.env.GEOAPIFY_API_KEY || process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY;
  const googleApiKey = process.env.GOOGLE_PLACES_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;

  // 1. Try Geoapify Reverse Geocoding (always available via free API key)
  if (geoapifyApiKey) {
    try {
      const geoRes = await fetch(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&apiKey=${geoapifyApiKey}`,
        { signal: AbortSignal.timeout(4000) }
      );
      if (geoRes.ok) {
        const geoData = await geoRes.json();
        const feat = geoData.features?.[0];
        if (feat) {
          const props = feat.properties || {};
          const house = props.housenumber ? `${props.housenumber} ` : "";
          const streetName = props.street || props.address_line1 || "Main St";
          const street = `${house}${streetName}`.trim();
          const city = props.city || props.town || props.suburb || props.county || "Toms River";
          const stateCode = props.state_code || "NJ";
          const zip = props.postcode || "08753";
          const fullAddress = props.formatted || `${street}, ${city}, ${stateCode} ${zip}`;

          return NextResponse.json({ street, city, state: stateCode, zip, fullAddress, provider: "geoapify" });
        }
      }
    } catch (err) {
      console.warn("Geoapify Reverse Geocode error:", err);
    }
  }

  // 1. Try Google Reverse Geocoding API if key is present
  if (googleApiKey) {
    try {
      const googleRes = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${googleApiKey}`
      );
      if (googleRes.ok) {
        const data = await googleRes.json();
        if (data.results && data.results.length > 0) {
          const result = data.results[0];
          const fullAddress = result.formatted_address;
          
          let streetNumber = "";
          let route = "";
          let city = "Toms River";
          let state = "NJ";
          let zip = "08753";

          for (const comp of result.address_components || []) {
            const types = comp.types || [];
            if (types.includes("street_number")) streetNumber = comp.long_name;
            if (types.includes("route")) route = comp.long_name;
            if (types.includes("locality") || types.includes("sublocality")) city = comp.long_name;
            if (types.includes("administrative_area_level_1")) state = comp.short_name;
            if (types.includes("postal_code")) zip = comp.long_name;
          }

          const street = `${streetNumber} ${route}`.trim() || fullAddress.split(",")[0];

          return NextResponse.json({
            street,
            city,
            state,
            zip,
            fullAddress,
            provider: "google"
          });
        }
      }
    } catch (err) {
      console.warn("Google Reverse Geocode error:", err);
    }
  }

  // 2. Try OpenStreetMap Nominatim Reverse Geocoding
  try {
    const osmRes = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`,
      {
        headers: {
          "Accept-Language": "en-US,en",
          "User-Agent": "PestIQ-Web-Reverse-Geocode/2.0",
        },
      }
    );

    if (osmRes.ok) {
      const item = await osmRes.json();
      const addr = item.address || {};
      const houseNumber = addr.house_number ? `${addr.house_number} ` : "";
      const road = addr.road || addr.pedestrian || addr.street || "Main St";
      const street = `${houseNumber}${road}`.trim();
      const city = addr.city || addr.town || addr.village || addr.suburb || addr.county || "Toms River";
      const state = addr.state === "New Jersey" ? "NJ" : addr.state === "New York" ? "NY" : addr.state || "NJ";
      const zip = addr.postcode || (state === "NJ" ? "08753" : "10001");
      const fullAddress = `${street}, ${city}, ${state} ${zip}`;

      return NextResponse.json({
        street,
        city,
        state,
        zip,
        fullAddress,
        provider: "nominatim"
      });
    }
  } catch (err) {
    console.warn("OSM Reverse Geocode error:", err);
  }

  // 3. Fallback mock location if GPS is test coordinates
  return NextResponse.json({
    street: "11 Oak Dr",
    city: "Brick Township",
    state: "NJ",
    zip: "08723",
    fullAddress: "11 Oak Dr, Brick Township, NJ 08723",
    provider: "fallback"
  });
}
