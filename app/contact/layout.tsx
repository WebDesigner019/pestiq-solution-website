import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us — PestIQ Solutions",
  description:
    "Get in touch with PestIQ Solutions for pest control inquiries, service requests, or scheduling. Serving NYC, Westchester County, and Ocean County NJ.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact PestIQ Solutions",
    description: "Reach our customer service team for pest control inquiries, scheduling, and service support across New York and New Jersey.",
    url: "/contact",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
