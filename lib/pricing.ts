import { PriceTier } from "@/context/LocationContext";

export function calculatePrices(priceTier: PriceTier, propertySqFt: number | null) {
  let baseEssential = 59;
  let baseComplete = 69;
  let baseOnetime = 279;

  if (priceTier === "westchester") {
    baseEssential = 49;
    baseComplete = 59;
    baseOnetime = 249;
  } else if (priceTier === "newjersey") {
    baseEssential = 45;
    baseComplete = 55;
    baseOnetime = 229;
  } else if (priceTier === "longisland") {
    baseEssential = 59;
    baseComplete = 69;
    baseOnetime = 269;
  } else if (priceTier === "ct") {
    baseEssential = 55;
    baseComplete = 65;
    baseOnetime = 259;
  }

  let monthlyAdjustment = 0;
  let onetimeAdjustment = 0;

  if (propertySqFt) {
    if (propertySqFt > 1500 && propertySqFt <= 2500) {
      monthlyAdjustment = 10;
      onetimeAdjustment = 30;
    } else if (propertySqFt > 2500 && propertySqFt <= 3500) {
      monthlyAdjustment = 20;
      onetimeAdjustment = 60;
    } else if (propertySqFt > 3500) {
      monthlyAdjustment = 30;
      onetimeAdjustment = 90;
    }
  }

  return {
    essential: baseEssential + monthlyAdjustment,
    complete: baseComplete + monthlyAdjustment,
    onetime: baseOnetime + onetimeAdjustment,
  };
}
