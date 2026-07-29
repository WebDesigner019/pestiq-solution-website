import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "General Pest Control Services — PestIQ Solutions",
  description:
    "PestIQ's general pest control covers ants, cockroaches, bed bugs, rodents, spiders, termites, and more. Year-round protection plans starting from $49/month.",
  alternates: { canonical: "/pests/general" },
  openGraph: {
    title: "General Pest Control Services — PestIQ Solutions",
    description: "Expert pest control for 39+ common household pests. Covered by the PestIQ Guarantee — if they come back, so do we at no cost.",
    url: "/pests/general",
  },
};

export default function GeneralPestLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
