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
      .split(/\s+/)[0];

    if (!streetPrefix) {
      return NextResponse.json({ valid: false, error: "Street name could not be parsed." });
    }

    const zipMatch = address.match(/\b\d{5}\b/);
    const zip = zipMatch ? zipMatch[0] : "";

    if (!zip) {
      return NextResponse.json({ valid: false, error: "ZIP code is required for validation." });
    }

    // Parse city name from full address
    const addressParts = address.split(",");
    let city = "";
    if (addressParts.length >= 3) {
      city = addressParts[addressParts.length - 2].trim().toUpperCase();
    } else if (addressParts.length === 2) {
      city = addressParts[1].trim().toUpperCase();
    }
    city = city.replace(/\b(NJ|NEW JERSEY)\b/gi, "").trim();

    // 2. Query the official New Jersey MOD-IV Composite Parcel Database (GIS State Master Records)
    // Query by house and street prefix. We check ZIP and MUN_NAME in code to avoid strict database typos.
    const whereClause = `PROP_LOC LIKE '${houseNumber} ${streetPrefix}%'`;
    const queryParams = new URLSearchParams({
      where: whereClause,
      outFields: "PROP_LOC,ZIP_CODE,MUN_NAME,PROP_CLASS",
      returnGeometry: "false",
      f: "json",
    });

    const url = `https://services2.arcgis.com/XVOqAjTOJ5P6ngMu/arcgis/rest/services/Parcels_Composite_NJ_WM/FeatureServer/0/query?${queryParams.toString()}`;

    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });

    if (!res.ok) {
      console.warn(`NJ Parcel Service returned HTTP ${res.status}`);
      return NextResponse.json({ valid: true, warning: "Validation service temporarily offline." });
    }

    const data = await res.json();

    if (data.features && Array.isArray(data.features) && data.features.length > 0) {
      const cleanCityName = city.replace(/\b(TWP|TOWNSHIP|BORO|BOROUGH|CITY)\b/gi, "").trim().toUpperCase();
      
      const matchedFeature = data.features.find((f: any) => {
        const attr = f.attributes || {};
        const propLoc = (attr.PROP_LOC || "").toUpperCase().trim();

        // Extract house number and first street word from propLoc
        const featHouseMatch = propLoc.match(/^(\d+)/);
        if (!featHouseMatch) return false;

        const featHouse = featHouseMatch[1];
        if (featHouse !== houseNumber) return false;

        const featStreetWord = propLoc
          .replace(/^\d+\s+/, "")
          .trim()
          .split(/\s+/)[0]
          .toUpperCase();

        if (featStreetWord !== streetPrefix) return false;

        const featZip = (attr.ZIP_CODE || "").trim();
        const featMun = (attr.MUN_NAME || "").toUpperCase().trim();

        // Check 1: ZIP code match
        if (featZip && featZip === zip) return true;

        // Check 2: Municipality name matches parsed City name (handles state typos like Toms River ZIP entered as 10951)
        if (featMun && cleanCityName && (featMun.includes(cleanCityName) || cleanCityName.includes(featMun))) return true;

        return false;
      });

      if (matchedFeature) {
        return NextResponse.json({
          valid: true,
          verifiedAddress: matchedFeature.attributes.PROP_LOC,
          zip: matchedFeature.attributes.ZIP_CODE,
        });
      }
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
