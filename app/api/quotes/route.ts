import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { serviceAreaCode = "nyc", planSlug = "complete", sqFt = 1800 } = body;

    let baseEssential = 59;
    let baseComplete = 69;
    let baseOnetime = 279;
    let initialFee = 149;

    if (serviceAreaCode === "westchester") {
      baseEssential = 49;
      baseComplete = 59;
      baseOnetime = 249;
    } else if (serviceAreaCode === "newjersey") {
      baseEssential = 45;
      baseComplete = 55;
      baseOnetime = 229;
    }

    let sqFtAdj = 0;
    const numSqFt = Number(sqFt) || 1800;
    if (numSqFt > 1500 && numSqFt <= 2500) sqFtAdj = 10;
    else if (numSqFt > 2500 && numSqFt <= 3500) sqFtAdj = 20;
    else if (numSqFt > 3500) sqFtAdj = 30;

    let selectedMonthly = 0;
    if (planSlug === "essential") selectedMonthly = baseEssential + sqFtAdj;
    else if (planSlug === "complete") selectedMonthly = baseComplete + sqFtAdj;
    else selectedMonthly = baseOnetime + (sqFtAdj * 3);

    const quoteId = `QTE-${Date.now().toString().slice(-6)}`;
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    return NextResponse.json({
      quoteId,
      serviceAreaCode,
      planSlug,
      sqFt: numSqFt,
      monthlyPriceCents: selectedMonthly * 100,
      initialFeeCents: planSlug === "onetime" ? 0 : initialFee * 100,
      totalDueTodayCents: 0, // No payment today per PestIQ guarantee
      expiresAt,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to generate server quote" }, { status: 500 });
  }
}
