import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

const baseUrl = 'https://day-30-ai-saas-boilerplate.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "SaaSForge.AI — Multi-Tenant AI SaaS Boilerplate & Starter Kit",
    template: "%s | SaaSForge.AI",
  },
  description:
    "Production-ready multi-tenant AI SaaS starter kit with Stripe billing, Gemini 1.5 Flash token metering, Upstash Redis rate limits, and executive SRE admin telemetry. Built by Abdul Nabi.",
  keywords: [
    "AI SaaS boilerplate",
    "Next.js 16 SaaS starter",
    "multi-tenant architecture",
    "Stripe subscriptions",
    "Gemini 1.5 Flash API",
    "Upstash Redis rate limiting",
    "SaaS telemetry",
  ],
  authors: [{ name: "Abdul Nabi", url: "https://github.com/abdulnabii" }],
  creator: "Abdul Nabi",
  publisher: "Abdul Nabi",
  category: "Technology",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "SaaSForge.AI — Full-Stack Multi-Tenant AI SaaS Starter Kit",
    description:
      "Deploy scalable AI SaaS applications with isolated workspace tenancy, Stripe checkout, automated token metering, and live SRE telemetry.",
    url: baseUrl,
    siteName: "SaaSForge.AI",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SaaSForge.AI — Production AI SaaS Starter Kit",
    description:
      "Production-ready Next.js 16 SaaS starter kit with multi-tenancy, metered credits, and live SRE dashboards.",
    creator: "@abdulnabii",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": `${baseUrl}/#webapp`,
      name: "SaaSForge.AI",
      url: baseUrl,
      applicationCategory: "BusinessApplication",
      operatingSystem: "All",
      description:
        "Production-ready multi-tenant AI SaaS boilerplate featuring Stripe billing, isolated workspace quotas, and Gemini API token metering.",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      author: {
        "@type": "Person",
        name: "Abdul Nabi",
        url: "https://github.com/abdulnabii",
      },
    },
    {
      "@type": "WebSite",
      "@id": `${baseUrl}/#website`,
      url: baseUrl,
      name: "SaaSForge.AI",
      publisher: {
        "@type": "Person",
        name: "Abdul Nabi",
        url: "https://github.com/abdulnabii",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased bg-[#06090e] text-slate-100 min-h-screen flex flex-col`}
      >
        {children}
      </body>
    </html>
  );
}
