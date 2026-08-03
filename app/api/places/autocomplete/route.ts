import { NextRequest, NextResponse } from "next/server";

export interface PlaceSuggestion {
  street: string;
  city: string;
  state: string;
  zip: string;
  fullAddress: string;
  provider?: string;
}

const NJ_RECT = "-75.6,38.9,-73.9,41.4";
const NJ_BIAS = "proximity:-74.4057,40.0583";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const rawQuery = searchParams.get("q") || "";
  const query = rawQuery.trim();

  if (!query || query.length < 1) {
    return NextResponse.json({ suggestions: [] });
  }

  let results: PlaceSuggestion[] = [];
  const seenAddresses = new Set<string>();

  const addSuggestion = (item: PlaceSuggestion) => {
    const key = item.fullAddress.toLowerCase().replace(/\s+/g, " ").trim();
    if (!seenAddresses.has(key)) {
      seenAddresses.add(key);
      results.push(item);
    }
  };

  // ─── PROVIDER 1: Geoapify ────────────────────────────────────────────────
  const geoapifyApiKey = process.env.GEOAPIFY_API_KEY;
  let geoapifySucceeded = false;

  if (geoapifyApiKey) {
    try {
      const url = [
        `https://api.geoapify.com/v1/geocode/autocomplete`,
        `?text=${encodeURIComponent(query)}`,
        `&filter=rect:${NJ_RECT}`,
        `&bias=${NJ_BIAS}`,
        `&limit=8`,
        `&apiKey=${geoapifyApiKey}`,
      ].join("");

      const geoRes = await fetch(url, { signal: AbortSignal.timeout(3000) });
      if (geoRes.ok) {
        const geoData = await geoRes.json();
        if (geoData.features && Array.isArray(geoData.features) && geoData.features.length > 0) {
          geoapifySucceeded = true;
          for (const feat of geoData.features) {
            const props = feat.properties || {};
            const stateCode = (props.state_code || "").toUpperCase();

            if (stateCode && stateCode !== "NJ") continue;

            const streetName = props.street || props.address_line1 || "";
            if (!streetName) continue;

            const house = props.housenumber ? `${props.housenumber} ` : "";
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
      console.warn("Geoapify autocomplete fetch error:", e);
    }
  }

  // ─── PROVIDER 2: Photon ──────────────────────────────────────────────────
  if (!geoapifySucceeded && results.length < 8) {
    try {
      const searchQuery = query.toLowerCase().includes("nj") || query.toLowerCase().includes("jersey")
        ? query
        : `${query}, NJ`;

      const photonRes = await fetch(
        `https://photon.komoot.io/api/?q=${encodeURIComponent(searchQuery)}&lat=40.0583&lon=-74.4057&zoom=10&limit=10`,
        { headers: { "User-Agent": "PestIQ-Places-API/2.0" }, signal: AbortSignal.timeout(3000) }
      );

      if (photonRes.ok) {
        const photonData = await photonRes.json();
        if (photonData.features && Array.isArray(photonData.features)) {
          for (const feat of photonData.features) {
            const props = feat.properties || {};
            const state = props.state || "";
            const countryCode = (props.countrycode || "").toUpperCase();

            if (state !== "New Jersey" && state !== "NJ") continue;
            if (countryCode && countryCode !== "US") continue;

            const streetName = props.street || props.name || "";
            if (!streetName) continue;

            const house = props.housenumber ? `${props.housenumber} ` : "";
            const fullStreet = `${house}${streetName}`.trim();
            const city = props.city || props.town || props.district || props.county || "";
            const zip = props.postcode || "";
            const fullAddress = `${fullStreet}, ${city}, NJ ${zip}`.trim();

            addSuggestion({
              street: fullStreet,
              city,
              state: "NJ",
              zip,
              fullAddress,
              provider: "photon",
            });
          }
        }
      }
    } catch (e) {
      console.warn("Photon autocomplete fetch error:", e);
    }
  }

  // ─── PROVIDER 3: OSM Nominatim ─────────────────────────────────────────────
  if (!geoapifySucceeded && results.length < 4) {
    try {
      const searchTarget = query.toLowerCase().includes("nj") || query.toLowerCase().includes("jersey")
        ? query
        : `${query}, New Jersey`;

      const osmUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchTarget)}&format=json&addressdetails=1&countrycodes=us&viewbox=-75.55,41.36,-73.89,38.93&bounded=1&limit=8`;

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
            const state = addr.state || "";

            if (state !== "New Jersey" && state !== "NJ") continue;

            const road = addr.road || addr.pedestrian || addr.street || "";
            if (!road) continue;

            const houseNumber = addr.house_number ? `${addr.house_number} ` : "";
            const streetName = `${houseNumber}${road}`.trim();
            const city = addr.city || addr.town || addr.village || addr.suburb || addr.county || "";
            const zip = addr.postcode || "";
            const fullAddress = `${streetName}, ${city}, NJ ${zip}`.trim();

            addSuggestion({
              street: streetName,
              city,
              state: "NJ",
              zip,
              fullAddress,
              provider: "nominatim",
            });
          }
        }
      }
    } catch (e) {
      console.warn("Nominatim autocomplete fetch error:", e);
    }
  }

  // ─── ZIP CODE CITY NORMALIZATION (USPS Postal City Matcher) ─────────────────
  const zipsToFetch = Array.from(new Set(results.map((r) => r.zip).filter((z) => z && /^\d{5}$/.test(z))));

  if (zipsToFetch.length > 0) {
    try {
      const zipMap = new Map<string, string>();
      await Promise.all(
        zipsToFetch.map(async (z) => {
          try {
            const zRes = await fetch(`https://api.zippopotam.us/us/${z}`, {
              signal: AbortSignal.timeout(1500),
            });
            if (zRes.ok) {
              const zData = await zRes.json();
              const placeName = zData.places?.[0]?.["place name"];
              if (placeName) {
                zipMap.set(z, placeName);
              }
            }
          } catch {
            // silent fallback
          }
        })
      );

      for (const item of results) {
        if (item.zip && zipMap.has(item.zip)) {
          const normalizedCity = zipMap.get(item.zip)!;
          if (item.city !== normalizedCity) {
            const escapedOldCity = item.city.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
            item.fullAddress = item.fullAddress.replace(
              new RegExp(`,\\s*${escapedOldCity},\\s*NJ`, "i"),
              `, ${normalizedCity}, NJ`
            );
            item.city = normalizedCity;
          }
        }
      }
    } catch (e) {
      console.warn("ZIP city normalization error:", e);
    }
  }

  // ─── NEW JERSEY STATEWIDE MOD-IV REAL PROPERTY FILTER ───────────────────────
  // We check each suggestion containing a house number against the official state tax records.
  // This filters out interpolated/fabricated house numbers before they are displayed.
  const rawSuggestions = [...results];

  const suggestionsToValidate = results.filter((r) => {
    const hasHouse = /^\d+/.test(r.street);
    return hasHouse && r.zip;
  });

  if (suggestionsToValidate.length > 0) {
    try {
      const whereClauses = suggestionsToValidate.map((s) => {
        const houseMatch = s.street.match(/^(\d+)/);
        const house = houseMatch ? houseMatch[1] : "";
        const cleanStreet = s.street
          .replace(/^\d+\s+/, "")
          .toUpperCase()
          .replace(/\b(ROAD|RD|DRIVE|DR|LANE|LN|COURT|CT|STREET|ST|AVENUE|AVE|PLACE|PL|WAY|BOULEVARD|BLVD|TERRACE|TER|CIRCLE|CIR)\b/g, "")
          .trim()
          .split(/\s+/)[0]
          .slice(0, 5); // Max 5 chars for spelling resilience (e.g. "MARCE" matches "MARCELA" and "MARCELLA")

        return `(PROP_LOC LIKE '${house} ${cleanStreet}%' AND ZIP_CODE = '${s.zip}')`;
      });

      const url = `https://services2.arcgis.com/XVOqAjTOJ5P6ngMu/arcgis/rest/services/Parcels_Composite_NJ_WM/FeatureServer/0/query?${new URLSearchParams({
        where: whereClauses.join(" OR "),
        outFields: "PROP_LOC,ZIP_CODE",
        returnGeometry: "false",
        f: "json",
      }).toString()}`;

      const parcelRes = await fetch(url, { signal: AbortSignal.timeout(1800) });
      
      if (parcelRes.ok) {
        const parcelData = await parcelRes.json();
        const verifiedKeys = new Set<string>();

        if (parcelData.features && Array.isArray(parcelData.features)) {
          parcelData.features.forEach((f: any) => {
            const attr = f.attributes || {};
            const propLoc = (attr.PROP_LOC || "").toUpperCase().trim();
            const zip = attr.ZIP_CODE || "";
            verifiedKeys.add(`${propLoc}_${zip}`);
          });
        }

        // Keep suggestions that match the verified parcel keys,
        // or suggestions that do not contain house numbers (like generic streets).
        results = results.filter((s) => {
          const houseMatch = s.street.match(/^(\d+)/);
          if (!houseMatch || !s.zip) return true; // Keep street-level results

          const house = houseMatch[1];
          const cleanStreet = s.street
            .replace(/^\d+\s+/, "")
            .toUpperCase()
            .replace(/\b(ROAD|RD|DRIVE|DR|LANE|LN|COURT|CT|STREET|ST|AVENUE|AVE|PLACE|PL|WAY|BOULEVARD|BLVD|TERRACE|TER|CIRCLE|CIR)\b/g, "")
            .trim()
            .split(/\s+/)[0]
            .slice(0, 5);

          const matchKeyPrefix = `${house} ${cleanStreet}`;
          return Array.from(verifiedKeys).some(
            (k) => k.startsWith(matchKeyPrefix) && k.endsWith(`_${s.zip}`)
          );
        });

        // Fallback: if strict verification filtered out every suggestion,
        // revert to showing the raw geocoded suggestions so it "at least shows something"
        if (results.length === 0) {
          results = rawSuggestions;
        }
      }
    } catch (e) {
      console.warn("State parcel filtering error:", e);
      // Fallback: in case of parcel API timeout/error, do not empty suggestions, let them load.
      if (results.length === 0) {
        results = rawSuggestions;
      }
    }
  }

  return NextResponse.json({ suggestions: results.slice(0, 8) });
}
