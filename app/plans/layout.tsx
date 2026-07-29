import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pest Control Plans & Pricing — PestIQ Solutions",
  description:
    "Compare PestIQ pest control plans: PestFree365+, PestFree365, and One-Time treatments. Transparent pricing based on your address in NYC, Westchester, and NJ.",
  alternates: { canonical: "/plans" },
  openGraph: {
    title: "Pest Control Plans & Pricing — PestIQ Solutions",
    description: "Choose from our residential pest control plans. PestFree365+ covers 39 pests year-round with a full satisfaction guarantee.",
    url: "/plans",
  },
};

export default function PlansLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
