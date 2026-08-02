import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { address } = await req.json();

    if (!address || typeof address !== "string") {
      return NextResponse.json({ valid: false, error: "Invalid address input" }, { status: 400 });
    }

    // 1. Parse the address to extract the house number, street name, and ZIP code.
    // Standard format from geocoder: "123 Main St, City, NJ 08753"
    const match = address.match(/^(\d+)\s+([^,]+)/);
    if (!match) {
      // If it doesn't start with a house number, we cannot validate it as a residential property
      return NextResponse.json({
        valid: false,
        error: "Address must contain a valid house number (e.g. 140 Flintlock Road).",
      });
    }

    const houseNumber = match[1];
    const streetPart = match[2];

    // Standardize street name: uppercase and remove common suffixes for prefix matching
    const streetPrefix = streetPart
      .toUpperCase()
      .replace(/\b(ROAD|RD|DRIVE|DR|LANE|LN|COURT|CT|STREET|ST|AVENUE|AVE|PLACE|PL|WAY|BOULEVARD|BLVD|TERRACE|TER|CIRCLE|CIR)\b/g, "")
      .trim()
      .split(/\s+/)[0]
      .slice(0, 5); // Max 5 chars for spelling resilience (e.g. "MARCE" matches "MARCELA" and "MARCELLA")

    if (!streetPrefix) {
      return NextResponse.json({ valid: false, error: "Street name could not be parsed." });
    }

    const zipMatch = address.match(/\b\d{5}\b/);
    const zip = zipMatch ? zipMatch[0] : "";

    if (!zip) {
      return NextResponse.json({ valid: false, error: "ZIP code is required for validation." });
    }

    // 2. Query the official New Jersey MOD-IV Composite Parcel Database (GIS State Master Records)
    // If it exists in this tax parcel map, it is an actual physical building on a valid lot.
    const whereClause = `PROP_LOC LIKE '${houseNumber} ${streetPrefix}%' AND ZIP_CODE = '${zip}'`;
    const queryParams = new URLSearchParams({
      where: whereClause,
      outFields: "PROP_LOC,ZIP_CODE,PROP_CLASS",
      returnGeometry: "false",
      f: "json",
    });

    const url = `https://services2.arcgis.com/XVOqAjTOJ5P6ngMu/arcgis/rest/services/Parcels_Composite_NJ_WM/FeatureServer/0/query?${queryParams.toString()}`;

    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });

    if (!res.ok) {
      console.warn(`NJ Parcel Service returned HTTP ${res.status}`);
      // Fallback: if the state database is down, do not block the user, just warn in logs
      return NextResponse.json({ valid: true, warning: "Validation service temporarily offline." });
    }

    const data = await res.json();

    if (data.features && data.features.length > 0) {
      // Address exists and is verified in NJ GIS Master Records
      return NextResponse.json({
        valid: true,
        verifiedAddress: data.features[0].attributes.PROP_LOC,
        zip: data.features[0].attributes.ZIP_CODE,
      });
    }

    // Address is fabricated or interpolated (doesn't exist in tax records)
    return NextResponse.json({
      valid: false,
      error: "This house number could not be verified in the New Jersey parcel registry. Please check for spelling errors or input a valid address.",
    });

  } catch (err) {
    console.error("Address validation error:", err);
    // Fallback: do not block checkout if verification API crashes
    return NextResponse.json({ valid: true, warning: "Validation error occurred." });
  }
}
