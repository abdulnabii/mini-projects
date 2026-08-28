import type { Metadata } from 'next';
import { Inter, JetBrains_Mono, Outfit } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'BrandCrafter.AI — AI Brand Identity & Logo System',
  description: 'Instant AI-powered brand identity generation: custom vector logo concepts, color palettes with WCAG accessibility validation, Google Font typography pairings, and real-time mockup previews.',
  keywords: ['AI logo generator', 'brand identity builder', 'vector logo creator', 'color palette extractor', 'typography pairings'],
  authors: [{ name: 'Abdul Nabi', url: 'https://github.com/abdulnabii' }],
  openGraph: {
    title: 'BrandCrafter.AI — AI Brand Identity & Logo System',
    description: 'Generates professional vector logo concepts, brand palettes, typography guidelines, and real-time mockups.',
    url: 'https://ai-logo-generator.vercel.app',
    siteName: 'BrandCrafter AI',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
      "@id": "https://day-07-ai-logo-generator.vercel.app/#webapp",
      "name": "BrandForge.AI",
      "url": "https://day-07-ai-logo-generator.vercel.app",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "All",
      "description": "Generative vector branding platform synthesizing high-resolution logo marks, curated typography pairings, color palettes, and production-ready SVG brand kits.",
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
      "@id": "https://day-07-ai-logo-generator.vercel.app/#website",
      "url": "https://day-07-ai-logo-generator.vercel.app",
      "name": "BrandForge.AI",
      "publisher": {
        "@type": "Person",
        "name": "Abdul Nabi",
        "url": "https://github.com/abdulnabii"
      }
    },
    {
      "@type": "FAQPage",
      "@id": "https://day-07-ai-logo-generator.vercel.app/#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What formats can I export my brand kit in?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "BrandForge.AI allows 1-click export of production-ready vector SVGs, PNG assets, and complete brand style guide documentation."
          }
        }
      ]
    }
  ]
}` }}
        />
      </head>
      <body className={`${inter.variable} ${outfit.variable} ${mono.variable} bg-[#0a0d14] text-slate-200 min-h-screen flex flex-col`}>
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
