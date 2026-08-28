import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "MeetingMind.AI — AI-Powered Meeting Intelligence & Action Plan Extractor",
  description: "Transform raw audio transcripts into executive intelligence dossiers: speaker participation analytics, key decisions, assignable action items, and AI Q&A assistant.",
  authors: [{ name: "Abdul Nabi", url: "https://github.com/abdulnabii" }],
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
      "@id": "https://day-05-ai-meeting-summarizer.vercel.app/#webapp",
      "name": "MeetingMind.AI",
      "url": "https://day-05-ai-meeting-summarizer.vercel.app",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "All",
      "description": "Automated meeting intelligence platform transforming dense transcripts into structured executive summaries, categorized action items with assignees, decision trees, and sentiment analysis.",
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
      "@id": "https://day-05-ai-meeting-summarizer.vercel.app/#website",
      "url": "https://day-05-ai-meeting-summarizer.vercel.app",
      "name": "MeetingMind.AI",
      "publisher": {
        "@type": "Person",
        "name": "Abdul Nabi",
        "url": "https://github.com/abdulnabii"
      }
    },
    {
      "@type": "FAQPage",
      "@id": "https://day-05-ai-meeting-summarizer.vercel.app/#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How does MeetingMind.AI process meeting transcripts?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "MeetingMind.AI parses audio/text transcripts through Gemini 1.5 Flash to automatically detect speakers, separate decisions from discussions, and assign action items with deadlines."
          }
        }
      ]
    }
  ]
}` }}
        />
      </head>
      <body className={`${inter.variable} ${mono.variable} ${outfit.variable} font-sans min-h-screen flex flex-col antialiased bg-[#080c14] text-slate-300 selection:bg-purple-500/30 selection:text-white`}>
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
