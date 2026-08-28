import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const metadata: Metadata = {
  title: 'LoadPulse.AI — High-Concurrency API Load Studio & AI Performance Diagnostics',
  description:
    'Simulate massive concurrent virtual users, visualize real-time P50/P95/P99 latency curves, and identify server bottlenecks with Gemini AI.',
  keywords: 'API load testing, k6, performance engineering, throughput RPS, latency percentiles, server bottlenecks, SRE diagnostics',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} dark`}>
      
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: `{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": "https://day-21-api-load-testing-dashboard.vercel.app/#webapp",
      "name": "LoadPulse.AI",
      "url": "https://day-21-api-load-testing-dashboard.vercel.app",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "All",
      "description": "High-throughput API performance tester simulating concurrent virtual users, p50/p95/p99 latency percentiles, error rate spikes, and AI bottleneck diagnoses.",
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
      "@id": "https://day-21-api-load-testing-dashboard.vercel.app/#website",
      "url": "https://day-21-api-load-testing-dashboard.vercel.app",
      "name": "LoadPulse.AI",
      "publisher": {
        "@type": "Person",
        "name": "Abdul Nabi",
        "url": "https://github.com/abdulnabii"
      }
    },
    {
      "@type": "FAQPage",
      "@id": "https://day-21-api-load-testing-dashboard.vercel.app/#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What performance metrics are captured?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "LoadPulse.AI tracks Requests Per Second (RPS), p50/p90/p95/p99 latency distributions, HTTP status codes, and throughput saturation."
          }
        }
      ]
    }
  ]
}` }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#060e14] text-slate-200 antialiased selection:bg-cyan-500 selection:text-black">
        <Navbar />
        <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full space-y-10 font-mono min-w-0">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
