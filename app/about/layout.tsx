import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About PestIQ Solutions — Our Story, Standards & Team",
  description:
    "Learn about PestIQ Solutions — how we deliver transparent, property-aware pest control to homes across New York City, Westchester County, and Ocean County NJ.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About PestIQ Solutions — Our Story, Standards & Team",
    description:
      "PestIQ Solutions was built on clear service standards, transparent pricing, and local expertise. Meet our team and learn how we protect your home.",
    url: "/about",
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
