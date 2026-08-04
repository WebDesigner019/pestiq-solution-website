import { NextRequest } from "next/server";
import { searchVerifiedNjAddresses } from "@/lib/njGeocode";
import { checkRateLimit, noStoreJson, reportAddressEvent } from "@/lib/requestGuards";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const rateLimit = checkRateLimit(request, "address-autocomplete", { limit: 30, windowMs: 60_000 });
  if (!rateLimit.allowed) {
    reportAddressEvent("address_autocomplete", "rejected");
    return noStoreJson(
      { error: "Too many address searches. Please wait a moment and try again.", suggestions: [] },
      { status: 429, headers: { "Retry-After": String(rateLimit.retryAfterSeconds) } },
    );
  }

  const query = new URL(request.url).searchParams.get("q")?.trim() ?? "";
  if (query.length < 3) return noStoreJson({ suggestions: [] });

  try {
    const suggestions = await searchVerifiedNjAddresses(query);
    reportAddressEvent("address_autocomplete", suggestions.length > 0 ? "allowed" : "rejected");
    return noStoreJson({ suggestions });
  } catch {
    reportAddressEvent("address_autocomplete", "unavailable");
    return noStoreJson(
      { error: "New Jersey address verification is temporarily unavailable. Please try again shortly.", suggestions: [] },
      { status: 503 },
    );
  }
}
