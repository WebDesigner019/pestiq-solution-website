import { NextRequest, NextResponse } from "next/server";

type Limit = { limit: number; windowMs: number };
type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

function clientKey(request: NextRequest) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("x-real-ip")
    || "unknown";
}

export function checkRateLimit(request: NextRequest, scope: string, config: Limit) {
  const now = Date.now();
  const key = `${scope}:${clientKey(request)}`;
  const current = buckets.get(key);
  const bucket = !current || current.resetAt <= now
    ? { count: 0, resetAt: now + config.windowMs }
    : current;

  bucket.count += 1;
  buckets.set(key, bucket);

  return {
    allowed: bucket.count <= config.limit,
    retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
  };
}

export function noStoreJson(body: unknown, init: ResponseInit = {}) {
  const headers = new Headers(init.headers);
  headers.set("Cache-Control", "no-store");
  headers.set("X-Content-Type-Options", "nosniff");
  return NextResponse.json(body, { ...init, headers });
}

// Deliberately excludes raw addresses, names, email addresses, and IP addresses.
export function reportAddressEvent(event: string, outcome: "allowed" | "rejected" | "unavailable") {
  console.info(JSON.stringify({ event, outcome, source: "NJ_Geocode", at: new Date().toISOString() }));
}
