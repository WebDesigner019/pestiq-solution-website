import { NextRequest } from "next/server";
import { validateNjAddress } from "@/lib/njGeocode";
import { checkRateLimit, noStoreJson, reportAddressEvent } from "@/lib/requestGuards";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const rateLimit = checkRateLimit(request, "address-validate", { limit: 15, windowMs: 60_000 });
  if (!rateLimit.allowed) {
    reportAddressEvent("address_validation", "rejected");
    return noStoreJson({ valid: false, error: "Too many verification attempts. Please wait a moment and try again." }, {
      status: 429,
      headers: { "Retry-After": String(rateLimit.retryAfterSeconds) },
    });
  }

  try {
    const body = await request.json() as { address?: unknown };
    if (typeof body.address !== "string" || !body.address.trim()) {
      return noStoreJson({ valid: false, error: "Enter a complete New Jersey street address." }, { status: 400 });
    }

    const verifiedAddress = await validateNjAddress(body.address);
    if (!verifiedAddress) {
      reportAddressEvent("address_validation", "rejected");
      return noStoreJson({
        valid: false,
        error: "We could not verify this as an exact New Jersey address. Check the house number, street, city, and ZIP code.",
      });
    }

    reportAddressEvent("address_validation", "allowed");
    return noStoreJson({ valid: true, verifiedAddress });
  } catch {
    reportAddressEvent("address_validation", "unavailable");
    return noStoreJson(
      { valid: false, error: "New Jersey address verification is temporarily unavailable. Please try again shortly." },
      { status: 503 },
    );
  }
}
