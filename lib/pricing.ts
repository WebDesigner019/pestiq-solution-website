import { PriceTier } from "@/context/LocationContext";

export function calculatePrices(priceTier: PriceTier, propertySqFt: number | null) {
  // Base rates for New Jersey
  let baseEssential = 45;
  let baseComplete = 55;
  let baseOnetime = 229;

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
