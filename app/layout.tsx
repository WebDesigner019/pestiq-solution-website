import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, DM_Sans } from "next/font/google";
import "./globals.css";
import ClientWrapper from "@/components/ClientWrapper";

// HEADING FONT: Barlow Condensed — editorial, industrial authority
// Used by professional service brands; nothing like typical AI fonts (Inter/Poppins)
const barlowCondensed = Barlow_Condensed({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

// BODY FONT: DM Sans — clean, modern, highly legible without looking generic
const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const SITE_URL = "https://www.pestiqsolutions.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  // Primary SEO
  title: {
    default: "PestIQ Solutions | Professional Pest Control — NYC, Westchester & NJ",
    template: "%s | PestIQ Solutions",
  },
  description:
    "PestIQ offers expert residential and commercial pest control in New York City, Westchester County, and Ocean County NJ. Guaranteed service plans starting from $49/mo. Ants, cockroaches, rodents, bed bugs, termites, and more.",
  keywords: [
    "pest control NYC",
    "pest control New Jersey",
    "exterminator Westchester",
    "bed bug treatment",
    "termite control",
    "rodent control",
    "PestIQ",
    "pest control plans",
    "pest management",
    "Ocean County pest control",
  ],

  // Canonical + locale
  alternates: {
    canonical: "/",
  },

  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Open Graph
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "PestIQ Solutions",
    title: "PestIQ Solutions | Professional Pest Control — NYC, Westchester & NJ",
    description:
      "Expert pest control with guaranteed satisfaction. Serving New York City, Westchester County, and Ocean County NJ. Get a free estimate today.",
    images: [
      {
        url: "/images/pestiq-technician-home.jpg",
        width: 1200,
        height: 630,
        alt: "PestIQ Solutions — Professional Pest Control Services",
      },
    ],
  },

  // Twitter / X card
  twitter: {
    card: "summary_large_image",
    site: "@PestIQSolutions",
    title: "PestIQ Solutions | Professional Pest Control",
    description:
      "Expert pest control with guaranteed satisfaction. Serving NYC, Westchester & NJ. Ants, roaches, rodents, bed bugs, termites and more.",
    images: ["/images/pestiq-technician-home.jpg"],
  },

  // App & favicon
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },

  // Verification (add when available)
  // verification: {
  //   google: "YOUR_GOOGLE_VERIFICATION_TOKEN",
  // },

  // Category
  category: "pest control services",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

// Schema.org structured data for local business
const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "PestControlService",
  name: "PestIQ Solutions",
  description:
    "Professional pest control services for residential and commercial properties in New York City, Westchester County, and Ocean County NJ.",
  url: SITE_URL,
  telephone: "+1-800-PESTIQ",
  priceRange: "$$",
  areaServed: ["New York City", "Westchester County", "Ocean County NJ"],
  sameAs: [],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Pest Control Plans",
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "PestFree365+ Plan" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "PestFree365 Plan" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "One-Time Treatment" } },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${barlowCondensed.variable} ${dmSans.variable} h-full antialiased scroll-smooth`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
      </head>
      <body className="min-h-full">
        <ClientWrapper>
          {children}
        </ClientWrapper>
      </body>
    </html>
  );
}
