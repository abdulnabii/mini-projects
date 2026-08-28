import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const metadata: Metadata = {
  title: 'AuraHome.AI — Voice-Controlled Smart Home Ecosystem & Energy Intelligence',
  description:
    'Control smart lights, thermostats, locks, and scenes with natural voice commands. Real-time wattage draw, energy radar, and automation engine powered by Gemini AI.',
  keywords: 'smart home dashboard, voice AI, Home Assistant, IoT dashboard, energy monitoring, smart lighting, thermostat control, smart locks',
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
      "@id": "https://day-23-smart-home-dashboard.vercel.app/#webapp",
      "name": "HomeSync.AI",
      "url": "https://day-23-smart-home-dashboard.vercel.app",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "All",
      "description": "Unified IoT control platform managing smart lighting, climate, security cameras, and automated energy-saving routines with real-time kilowatt telemetry.",
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
      "@id": "https://day-23-smart-home-dashboard.vercel.app/#website",
      "url": "https://day-23-smart-home-dashboard.vercel.app",
      "name": "HomeSync.AI",
      "publisher": {
        "@type": "Person",
        "name": "Abdul Nabi",
        "url": "https://github.com/abdulnabii"
      }
    },
    {
      "@type": "FAQPage",
      "@id": "https://day-23-smart-home-dashboard.vercel.app/#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How does HomeSync.AI optimize energy consumption?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "HomeSync.AI correlates ambient weather forecasts, room occupancy sensors, and peak utility pricing tiers to schedule HVAC and appliance usage automatically."
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
