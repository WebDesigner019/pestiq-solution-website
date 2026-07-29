import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How PestIQ Works — Our 4-Step Treatment Process",
  description:
    "Discover how PestIQ's 4-step pest control process works: inspection, custom treatment, barrier application, and ongoing monitoring. Guaranteed results.",
  alternates: { canonical: "/how-it-works" },
  openGraph: {
    title: "How PestIQ Works — Our 4-Step Treatment Process",
    description: "From comprehensive inspection to ongoing monitoring, PestIQ's professional process eliminates pests and keeps them from returning.",
    url: "/how-it-works",
  },
};

export default function HowItWorksLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
