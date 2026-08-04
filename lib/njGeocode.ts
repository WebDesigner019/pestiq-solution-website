const NJ_GEOCODER_URL = "https://geo.nj.gov/arcgis/rest/services/Tasks/NJ_Geocode/GeocodeServer";
const NJ_MOD_IV_PARCELS_URL = "https://maps.nj.gov/arcgis/rest/services/Applications/NJ_TaxListSearch/MapServer/2/query";
const CACHE_TTL_MS = 5 * 60 * 1000;
const LOOKUP_TIMEOUT_MS = 8_000;

type GeocoderCandidate = {
  address?: string;
  score?: number;
  attributes?: Record<string, unknown>;
};

export type VerifiedNjAddress = {
  fullAddress: string;
  street: string;
  city: string;
  state: "NJ";
  zip: string;
  provider: "nj-geocode" | "nj-mod-iv";
  sourceId?: string;
};

type ParcelFeature = {
  attributes?: Record<string, unknown>;
};

type CachedResult = { expiresAt: number; results: VerifiedNjAddress[] };
const cache = new Map<string, CachedResult>();

function cacheKey(value: string) {
  return value.trim().replace(/\s+/g, " ").toUpperCase();
}

function readText(attributes: Record<string, unknown>, key: string) {
  const value = attributes[key];
  return typeof value === "string" ? value.trim() : "";
}

function normalizeParcelStreet(value: string) {
  const suffixes: Record<string, string> = {
    AVENUE: "AVE",
    BOULEVARD: "BLVD",
    COURT: "CT",
    DRIVE: "DR",
    HIGHWAY: "HWY",
    LANE: "LN",
    PLACE: "PL",
    ROAD: "RD",
    STREET: "ST",
    TERRACE: "TER",
  };

  return value
    .trim()
    .toUpperCase()
    .replace(/\./g, "")
    .replace(/\s+/g, " ")
    .split(" ")
    .map((part) => suffixes[part] ?? part)
    .join(" ");
}

function parseCompleteNjAddress(value: string) {
  const match = value.trim().match(/^(.+?),\s*([^,]+),\s*NJ\s+(\d{5})(?:-\d{4})?\s*$/i);
  if (!match) return null;

  const [, street, city, zip] = match;
  if (!/^\d+[A-Za-z0-9-]*\s+/.test(street.trim())) return null;

  return { street: street.trim(), city: city.trim(), zip };
}

function escapeArcGisSql(value: string) {
  return value.replace(/'/g, "''");
}

function toVerifiedAddress(candidate: GeocoderCandidate, exactMatch: boolean): VerifiedNjAddress | null {
  const attributes = candidate.attributes ?? {};
  const addressType = readText(attributes, "Addr_type");
  const state = readText(attributes, "RegionAbbr").toUpperCase();
  const score = Number(candidate.score ?? attributes.Score ?? 0);
  const street = readText(attributes, "StAddr");
  const city = readText(attributes, "City");
  const zip = readText(attributes, "Postal");
  const houseNumber = readText(attributes, "AddNum");

  // Point and sub-address matches originate from the state's address-point data.
  // Street-range matches are deliberately excluded because they may interpolate a house number.
  const isAddressPoint = addressType === "PointAddress" || addressType === "SubAddress";
  const meetsScore = exactMatch ? score >= 100 : score >= 90;

  if (!isAddressPoint || !meetsScore || state !== "NJ" || !street || !city || !zip || !houseNumber) {
    return null;
  }

  const fullAddress = readText(attributes, "LongLabel") || candidate.address || `${street}, ${city}, NJ ${zip}`;

  return {
    fullAddress,
    street,
    city,
    state: "NJ",
    zip: zip.slice(0, 5),
    provider: "nj-geocode",
    sourceId: readText(attributes, "Loc_name") || undefined,
  };
}

async function requestCandidates(query: string): Promise<GeocoderCandidate[]> {
  const params = new URLSearchParams({
    SingleLine: query,
    outFields: "*",
    maxLocations: "8",
    f: "json",
  });
  const response = await fetch(`${NJ_GEOCODER_URL}/findAddressCandidates?${params.toString()}`, {
    signal: AbortSignal.timeout(LOOKUP_TIMEOUT_MS),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`NJ geocoder returned ${response.status}`);
  }

  const data = await response.json() as { candidates?: GeocoderCandidate[]; error?: unknown };
  if (data.error) {
    throw new Error("NJ geocoder returned an error");
  }

  return Array.isArray(data.candidates) ? data.candidates : [];
}

async function findVerifiedModIvParcel(address: string): Promise<VerifiedNjAddress | null> {
  const parsed = parseCompleteNjAddress(address);
  if (!parsed) return null;

  const normalizedStreet = normalizeParcelStreet(parsed.street);
  const params = new URLSearchParams({
    where: `UPPER(PROP_LOC) = '${escapeArcGisSql(normalizedStreet)}' AND ZIP5 = '${parsed.zip}'`,
    outFields: "PAMS_PIN,PROP_LOC,MUN_NAME,ZIP5",
    returnGeometry: "false",
    resultRecordCount: "2",
    f: "json",
  });
  const response = await fetch(`${NJ_MOD_IV_PARCELS_URL}?${params.toString()}`, {
    signal: AbortSignal.timeout(LOOKUP_TIMEOUT_MS),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`NJ MOD-IV parcel service returned ${response.status}`);
  }

  const data = await response.json() as { features?: ParcelFeature[]; error?: unknown };
  if (data.error) {
    throw new Error("NJ MOD-IV parcel service returned an error");
  }

  const matches = (Array.isArray(data.features) ? data.features : [])
    .map((feature) => feature.attributes ?? {})
    .filter((attributes) => normalizeParcelStreet(readText(attributes, "PROP_LOC")) === normalizedStreet)
    .filter((attributes) => readText(attributes, "ZIP5") === parsed.zip);

  // A unique exact street-and-ZIP parcel match is sufficient proof of a real NJ property.
  // Never accept a range, fuzzy match, or an ambiguous parcel response.
  if (matches.length !== 1) return null;

  const attributes = matches[0];
  const street = readText(attributes, "PROP_LOC");
  const municipality = readText(attributes, "MUN_NAME");
  if (!street || !municipality) return null;

  return {
    fullAddress: `${street}, ${municipality}, NJ ${parsed.zip}`,
    street,
    city: municipality,
    state: "NJ",
    zip: parsed.zip,
    provider: "nj-mod-iv",
    sourceId: readText(attributes, "PAMS_PIN") || undefined,
  };
}

export async function searchVerifiedNjAddresses(query: string): Promise<VerifiedNjAddress[]> {
  const normalizedQuery = query.trim();
  if (normalizedQuery.length < 3) return [];

  const key = cacheKey(normalizedQuery);
  const cached = cache.get(key);
  if (cached && cached.expiresAt > Date.now()) return cached.results;

  const seen = new Set<string>();
  const results = (await requestCandidates(`${normalizedQuery}, NJ`))
    .map((candidate) => toVerifiedAddress(candidate, false))
    .filter((candidate): candidate is VerifiedNjAddress => candidate !== null)
    .filter((candidate) => {
      const uniqueKey = candidate.fullAddress.toUpperCase();
      if (seen.has(uniqueKey)) return false;
      seen.add(uniqueKey);
      return true;
    });

  cache.set(key, { expiresAt: Date.now() + CACHE_TTL_MS, results });
  return results;
}

export async function validateNjAddress(address: string): Promise<VerifiedNjAddress | null> {
  const normalizedAddress = address.trim();
  if (!normalizedAddress || !/^\d+[A-Za-z0-9-]*\s+/.test(normalizedAddress)) return null;

  let candidates: GeocoderCandidate[] = [];
  try {
    candidates = await requestCandidates(normalizedAddress);
  } catch {
    // The MOD-IV parcel record is an independent official source. If the
    // address-point service is temporarily unavailable, a unique parcel match
    // can still verify a complete manual address without inventing one.
    return findVerifiedModIvParcel(normalizedAddress);
  }
  const addressPoint = candidates
    .map((candidate) => toVerifiedAddress(candidate, true))
    .find((candidate): candidate is VerifiedNjAddress => candidate !== null);

  if (addressPoint) return addressPoint;
  return findVerifiedModIvParcel(normalizedAddress);
}
