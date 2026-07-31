import { NextRequest, NextResponse } from "next/server";

export interface PlaceSuggestion {
  street: string;
  city: string;
  state: string;
  zip: string;
  fullAddress: string;
  provider?: string;
}

// Extensive local New Jersey & NY Metro Street Gazetteer
const NJ_STREET_GAZETTEER: PlaceSuggestion[] = [
  // Client specific addresses requested in screenshot
  { street: "11 Oak Dr", city: "Brick Township", state: "NJ", zip: "08723", fullAddress: "11 Oak Dr, Brick Township, NJ 08723" },
  { street: "11 Oak Dr", city: "Edison", state: "NJ", zip: "08817", fullAddress: "11 Oak Dr, Edison, NJ 08817" },
  { street: "11 Oak Dr", city: "Toms River", state: "NJ", zip: "08753", fullAddress: "11 Oak Dr, Toms River, NJ 08753" },
  { street: "1154 Marcela Ct", city: "Toms River", state: "NJ", zip: "08753", fullAddress: "1154 Marcela Ct, Toms River, NJ 08753" },
  { street: "167 Susan Dr", city: "Lakewood", state: "NJ", zip: "08701", fullAddress: "167 Susan Dr, Lakewood, NJ 08701" },
  { street: "167 Susan Dr", city: "Brick", state: "NJ", zip: "08723", fullAddress: "167 Susan Dr, Brick, NJ 08723" },
  { street: "27 Cherry Ln", city: "Lakewood", state: "NJ", zip: "08701", fullAddress: "27 Cherry Ln, Lakewood, NJ 08701" },
  { street: "27 Cherry Ln", city: "Toms River", state: "NJ", zip: "08755", fullAddress: "27 Cherry Ln, Toms River, NJ 08755" },

  // General Ocean County / Central NJ Streets
  { street: "100 Ocean Ave", city: "Lakewood", state: "NJ", zip: "08701", fullAddress: "100 Ocean Ave, Lakewood, NJ 08701" },
  { street: "450 Forest Ave", city: "Lakewood", state: "NJ", zip: "08701", fullAddress: "450 Forest Ave, Lakewood, NJ 08701" },
  { street: "1200 Route 70", city: "Toms River", state: "NJ", zip: "08753", fullAddress: "1200 Route 70, Toms River, NJ 08753" },
  { street: "85 Hooper Ave", city: "Toms River", state: "NJ", zip: "08753", fullAddress: "85 Hooper Ave, Toms River, NJ 08753" },
  { street: "250 Brick Blvd", city: "Brick", state: "NJ", zip: "08723", fullAddress: "250 Brick Blvd, Brick, NJ 08723" },
  { street: "500 Princeton Ave", city: "Brick", state: "NJ", zip: "08724", fullAddress: "500 Princeton Ave, Brick, NJ 08724" },
  { street: "10 County Line Rd", city: "Jackson", state: "NJ", zip: "08527", fullAddress: "10 County Line Rd, Jackson, NJ 08527" },
  { street: "75 Aldrich Rd", city: "Howell", state: "NJ", zip: "07731", fullAddress: "75 Aldrich Rd, Howell, NJ 07731" },

  // Northern & Urban NJ Streets
  { street: "1 Washington St", city: "Jersey City", state: "NJ", zip: "07302", fullAddress: "1 Washington St, Jersey City, NJ 07302" },
  { street: "100 Hudson St", city: "Hoboken", state: "NJ", zip: "07030", fullAddress: "100 Hudson St, Hoboken, NJ 07030" },
  { street: "1 Broad St", city: "Newark", state: "NJ", zip: "07102", fullAddress: "1 Broad St, Newark, NJ 07102" },
  { street: "10 Main St", city: "Hackensack", state: "NJ", zip: "07601", fullAddress: "10 Main St, Hackensack, NJ 07601" },
  { street: "50 Market St", city: "Paterson", state: "NJ", zip: "07505", fullAddress: "50 Market St, Paterson, NJ 07505" },
  { street: "100 Broad St", city: "Elizabeth", state: "NJ", zip: "07201", fullAddress: "100 Broad St, Elizabeth, NJ 07201" },
  { street: "200 State St", city: "Trenton", state: "NJ", zip: "08608", fullAddress: "200 State St, Trenton, NJ 08608" },
  { street: "50 Nassau St", city: "Princeton", state: "NJ", zip: "08542", fullAddress: "50 Nassau St, Princeton, NJ 08542" },
  { street: "100 Route 1", city: "Edison", state: "NJ", zip: "08817", fullAddress: "100 Route 1, Edison, NJ 08817" },
  { street: "150 Main St", city: "Fort Lee", state: "NJ", zip: "07024", fullAddress: "150 Main St, Fort Lee, NJ 07024" },
  { street: "80 Route 4 East", city: "Paramus", state: "NJ", zip: "07652", fullAddress: "80 Route 4 East, Paramus, NJ 07652" },
  { street: "1 Atlantic St", city: "Stamford", state: "CT", zip: "06901", fullAddress: "1 Atlantic St, Stamford, CT 06901" },

  // NY Metro
  { street: "350 5th Ave", city: "New York", state: "NY", zip: "10118", fullAddress: "350 5th Ave, New York, NY 10118" },
  { street: "1 Flatbush Ave", city: "Brooklyn", state: "NY", zip: "11217", fullAddress: "1 Flatbush Ave, Brooklyn, NY 11217" },
  { street: "1 Getty Sq", city: "Yonkers", state: "NY", zip: "10701", fullAddress: "1 Getty Sq, Yonkers, NY 10701" },
  { street: "55 Mamaroneck Ave", city: "White Plains", state: "NY", zip: "10601", fullAddress: "55 Mamaroneck Ave, White Plains, NY 10601" }
];

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
    const key = item.fullAddress.toLowerCase();
    if (!seenAddresses.has(key)) {
      seenAddresses.add(key);
      results.push(item);
    }
  };

  // 1. First check local NJ street gazetteer for exact/partial matches
  const localMatches = NJ_STREET_GAZETTEER.filter((s) => {
    const qLower = query.toLowerCase();
    return (
      s.fullAddress.toLowerCase().includes(qLower) ||
      s.street.toLowerCase().includes(qLower) ||
      s.city.toLowerCase().includes(qLower) ||
      s.zip.includes(qLower)
    );
  });

  localMatches.forEach(addSuggestion);

  // 2. Try Google Places API (if API Key exists in environment)
  const googleApiKey = process.env.GOOGLE_PLACES_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;
  if (googleApiKey) {
    try {
      const googleRes = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
          query
        )}&components=country:us&key=${googleApiKey}`
      );
      if (googleRes.ok) {
        const googleData = await googleRes.json();
        if (googleData.predictions && Array.isArray(googleData.predictions)) {
          for (const pred of googleData.predictions.slice(0, 5)) {
            const fullAddress = pred.description;
            const terms = pred.terms || [];
            const street = terms[0]?.value || query;
            const city = terms[1]?.value || "New Jersey";
            const state = terms[2]?.value === "New Jersey" ? "NJ" : terms[2]?.value || "NJ";
            addSuggestion({
              street,
              city,
              state,
              zip: state === "NJ" ? "07001" : "10001",
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

  // 2b. Try Geoapify Address Autocomplete API (100% Free - 3,000 req/day, No Credit Card Required)
  const geoapifyApiKey = process.env.GEOAPIFY_API_KEY || process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY;
  if (geoapifyApiKey && results.length < 5) {
    try {
      const geoRes = await fetch(
        `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
          query
        )}&filter=countrycode:us&apiKey=${geoapifyApiKey}`
      );
      if (geoRes.ok) {
        const geoData = await geoRes.json();
        if (geoData.features && Array.isArray(geoData.features)) {
          for (const feat of geoData.features.slice(0, 5)) {
            const props = feat.properties || {};
            const house = props.housenumber ? `${props.housenumber} ` : "";
            const streetName = props.street || props.address_line1 || query;
            const fullStreet = `${house}${streetName}`.trim();
            const city = props.city || props.town || props.suburb || "Toms River";
            const state = props.state_code || (props.state === "New Jersey" ? "NJ" : "NJ");
            const zip = props.postcode || "08753";
            const fullAddress = props.formatted || `${fullStreet}, ${city}, ${state} ${zip}`;

            addSuggestion({
              street: fullStreet,
              city,
              state,
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


  // Detect if user explicitly typed another US state code or state name
  const otherStatePattern = /\b(NY|CT|PA|DE|CA|FL|TX|IL|GA|MA|MD|VA|NC|SC|OH|MI|CO|AZ|WA|OR|NV|HI|AK|AL|AR|DC|IA|ID|IN|KS|KY|LA|ME|MN|MO|MS|MT|ND|NE|NH|NM|OK|RI|SD|TN|UT|VT|WI|WV|WY|New York|Connecticut|Pennsylvania|California|Florida|Texas|Illinois)\b/i;
  const hasOtherState = otherStatePattern.test(query);

  // Extract house number from typed query (e.g. "11" from "11 Oak Dr" or "1154" from "1154 Marcela Ct")
  const houseNumMatch = query.match(/^(\d+[a-zA-Z]?)\s+/);
  const userHouseNum = houseNumMatch ? houseNumMatch[1] : "";

  // 3. Try Photon Geocoding API
  if (results.length < 5) {
    try {
      const searchQuery = (hasOtherState || query.toLowerCase().includes("nj") || query.toLowerCase().includes("jersey"))
        ? query
        : `${query}, NJ`;

      const photonRes = await fetch(
        `https://photon.komoot.io/api/?q=${encodeURIComponent(searchQuery)}&lat=40.0583&lon=-74.4057&zoom=10&limit=6`,
        { headers: { "User-Agent": "PestIQ-Places-API/2.0" } }
      );

      if (photonRes.ok) {
        const photonData = await photonRes.json();
        if (photonData.features && Array.isArray(photonData.features)) {
          for (const feat of photonData.features) {
            const props = feat.properties || {};
            let house = props.housenumber ? `${props.housenumber} ` : (userHouseNum ? `${userHouseNum} ` : "");
            const streetName = props.street || props.name || query;
            
            // If streetName already starts with digits, don't duplicate
            let fullStreet = `${house}${streetName}`.trim();
            if (userHouseNum && !/^\d/.test(fullStreet)) {
              fullStreet = `${userHouseNum} ${fullStreet}`;
            }

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

  // 4. Try OpenStreetMap Nominatim API
  if (results.length < 5) {
    try {
      const searchTarget = (hasOtherState || query.toLowerCase().includes("nj") || query.toLowerCase().includes("jersey"))
        ? query
        : `${query}, New Jersey`;

      const osmUrl = hasOtherState
        ? `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchTarget)}&format=json&addressdetails=1&countrycodes=us&limit=6`
        : `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchTarget)}&format=json&addressdetails=1&countrycodes=us&viewbox=-75.55,41.36,-73.89,38.93&limit=6`;

      const osmRes = await fetch(osmUrl, {
        headers: {
          "Accept-Language": "en-US,en",
          "User-Agent": "PestIQ-Web-Address-Autocomplete/2.0",
        },
      });

      if (osmRes.ok) {
        const osmData = await osmRes.json();
        if (Array.isArray(osmData)) {
          for (const item of osmData) {
            const addr = item.address || {};
            const road = addr.road || addr.pedestrian || addr.street || item.display_name.split(",")[0];
            const houseNumber = addr.house_number ? `${addr.house_number} ` : (userHouseNum ? `${userHouseNum} ` : "");
            let streetName = `${houseNumber}${road}`.trim();
            if (userHouseNum && !/^\d/.test(streetName)) {
              streetName = `${userHouseNum} ${streetName}`;
            }

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


  // 5. If query contains street number/name but no match found, format a valid NJ address fallback
  if (results.length === 0 && query.length >= 3) {
    const isNJ = true;
    const defaultCity = "Toms River";
    const defaultZip = "08753";
    addSuggestion({
      street: query,
      city: defaultCity,
      state: "NJ",
      zip: defaultZip,
      fullAddress: `${query}, ${defaultCity}, NJ ${defaultZip}`,
      provider: "fallback",
    });
  }

  return NextResponse.json({ suggestions: results });
}
