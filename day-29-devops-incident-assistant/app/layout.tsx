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

export const metadata: Metadata = {
  title: "OpsPulse.AI — AI DevOps Incident Response & SRE Triage",
  description:
    "Intelligent SRE incident response command center. Real-time log triage, Gemini 1.5 root cause analysis, deployment correlation radar, and automated post-mortems.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: `{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": "https://day-29-devops-incident-assistant.vercel.app/#webapp",
      "name": "OpsPulse.AI",
      "url": "https://day-29-devops-incident-assistant.vercel.app",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "All",
      "description": "Enterprise Site Reliability Engineering (SRE) war room platform diagnosing production outages, analyzing Kubernetes pod telemetry, calculating revenue burn, and executing automated runbooks.",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "author": {
        "@type": "Person",
        "name": "Abdul Nabi",
        "url": "https://github.com/abdulnabii"
      }
    },
    {
      "@type": "WebSite",
      "@id": "https://day-29-devops-incident-assistant.vercel.app/#website",
      "url": "https://day-29-devops-incident-assistant.vercel.app",
      "name": "OpsPulse.AI",
      "publisher": {
        "@type": "Person",
        "name": "Abdul Nabi",
        "url": "https://github.com/abdulnabii"
      }
    },
    {
      "@type": "FAQPage",
      "@id": "https://day-29-devops-incident-assistant.vercel.app/#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What incident response features are included?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "OpsPulse.AI features automated severity tiering (P1-P4), blast radius impact calculation, step-by-step remediation runbooks, and AI post-mortem generation."
          }
        }
      ]
    }
  ]
}` }}
        />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased bg-[#060e14] text-slate-100 min-h-screen flex flex-col`}
      >
        {children}
      </body>
    </html>
  );
}
