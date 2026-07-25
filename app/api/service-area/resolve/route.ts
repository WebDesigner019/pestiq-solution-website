import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { zip, streetAddress, sqFt } = body;

    if (!zip) {
      return NextResponse.json({ error: "ZIP code is required" }, { status: 400 });
    }

    const cleanZip = String(zip).trim();
    let serviceAreaCode = "nyc";
    let serviceAreaName = "New York City";
    let isCovered = true;

    // Coverage Resolution Logic
    if (cleanZip.startsWith("07") || cleanZip.startsWith("08")) {
      serviceAreaCode = "newjersey";
      serviceAreaName = "Ocean County, NJ";
    } else if (cleanZip.startsWith("105") || cleanZip.startsWith("106") || cleanZip.startsWith("107") || cleanZip.startsWith("108")) {
      serviceAreaCode = "westchester";
      serviceAreaName = "Lower Westchester";
    } else if (cleanZip.startsWith("100") || cleanZip.startsWith("101") || cleanZip.startsWith("102") || cleanZip.startsWith("103") || cleanZip.startsWith("104") || cleanZip.startsWith("111") || cleanZip.startsWith("112") || cleanZip.startsWith("113") || cleanZip.startsWith("114") || cleanZip.startsWith("116")) {
      serviceAreaCode = "nyc";
      serviceAreaName = "New York City";
    } else {
      serviceAreaCode = "other";
      serviceAreaName = "Regional Review Needed";
      isCovered = false;
    }

    return NextResponse.json({
      zip: cleanZip,
      streetAddress: streetAddress || "",
      sqFt: Number(sqFt) || 1800,
      serviceAreaCode,
      serviceAreaName,
      isCovered,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to resolve service area" }, { status: 500 });
  }
}
