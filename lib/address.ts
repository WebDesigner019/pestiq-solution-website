export type VerifiedAddress = {
  formattedAddress: string;
  addressLine1: string;
  houseNumber: string;
  street: string;
  unit?: string;
  city: string;
  state: "New Jersey";
  stateCode: "NJ";
  postalCode: string;
  county?: string;
  latitude: number;
  longitude: number;
  placeId?: string;
  confidence?: number;
  verified: true;
};

/**
 * Validates if a given postal code is a valid New Jersey 5-digit ZIP.
 * NJ ZIP codes strictly range from 07001 to 08989.
 */
export function isValidNJZip(zip: string): boolean {
  const clean = zip.trim();
  if (!/^\d{5}$/.test(clean)) return false;
  const num = parseInt(clean, 10);
  return (num >= 7001 && num <= 8989) || (num >= 7000 && num <= 8999);
}

/**
 * Normalizes raw Geoapify feature payload into a VerifiedAddress object.
 * Returns null if the payload does not represent a complete, valid New Jersey property.
 */
export function normalizeGeoapifyFeature(feat: any): VerifiedAddress | null {
  if (!feat || !feat.properties) return null;
  const props = feat.properties;

  // 1. Enforce New Jersey state code / state name
  const stateCode = (props.state_code || "").toUpperCase();
  const stateName = (props.state || "").toLowerCase();
  const isNJ = stateCode === "NJ" || stateName === "new jersey";
  if (!isNJ) return null;

  // 2. Enforce house number exists (reject street-only, city-only, zip-only)
  const houseNumber = String(props.housenumber || props.house_number || props.building_number || "").trim();
  if (!houseNumber) return null;

  // 3. Enforce street name exists
  const street = String(props.street || props.address_line1 || props.road || "").trim();
  if (!street) return null;

  // 4. Enforce locality exists (city, town, village, municipality, suburb)
  const city = String(
    props.city || props.town || props.village || props.municipality || props.suburb || props.district || props.county || ""
  ).trim();
  if (!city) return null;

  // 5. Enforce valid 5-digit NJ ZIP code
  const postalCode = String(props.postcode || props.postal_code || "").trim();
  if (!isValidNJZip(postalCode)) return null;

  // 6. Enforce valid coordinates
  const lat = Number(props.lat ?? feat.geometry?.coordinates?.[1]);
  const lon = Number(props.lon ?? feat.geometry?.coordinates?.[0]);
  if (isNaN(lat) || isNaN(lon)) return null;

  // 7. Enforce building/address level match type (reject country, state, county, city, street results)
  const resultType = (props.result_type || "").toLowerCase();
  const rejectedTypes = ["country", "state", "county", "city", "postcode", "street", "amenity_zone"];
  if (rejectedTypes.includes(resultType)) return null;

  const addressLine1 = `${houseNumber} ${street}`.trim();
  const formattedAddress = props.formatted || `${addressLine1}, ${city}, NJ ${postalCode}`;

  return {
    formattedAddress,
    addressLine1,
    houseNumber,
    street,
    city,
    state: "New Jersey",
    stateCode: "NJ",
    postalCode,
    county: props.county || undefined,
    latitude: lat,
    longitude: lon,
    placeId: props.place_id || `${lat},${lon}`,
    confidence: props.rank?.confidence ?? undefined,
    verified: true,
  };
}
