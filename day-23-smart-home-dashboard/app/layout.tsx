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
      "name": "AuraHome.AI",
      "url": "https://day-23-smart-home-dashboard.vercel.app",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "All",
      "description": "Voice-controlled smart home dashboard managing smart lighting, HVAC climate control, deadbolt security, and automated energy-saving routines with real-time wattage telemetry powered by Gemini AI.",
      "featureList": ["Voice command parsing via Gemini 1.5 Flash","Real-time device state management","6 pre-configured scene automations","Live energy consumption monitoring","IF/THEN automation rule builder","Smart lock and security camera panel"],
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
      "name": "AuraHome.AI",
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
          "name": "How does AuraHome.AI process voice commands without a wake word?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "AuraHome.AI uses the browser's Web Speech API to capture audio on demand when you press the microphone button. The raw transcript is sent to Google Gemini 1.5 Flash which parses natural language intent and returns a structured JSON command that maps to one or more device actions — all within 400ms round-trip latency."
          }
        },
        {
          "@type": "Question",
          "name": "Can AuraHome.AI control real smart home devices like Philips Hue or Nest?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "AuraHome.AI is built as a full-stack demonstration platform. It ships with a simulated device state machine for instant demos. The Ecosystem Bridge settings panel is designed to connect real hardware via MQTT (Zigbee 3.0 / Tuya), Home Assistant REST API, or any WebSocket-capable IoT broker — making it production-ready for real smart home deployments."
          }
        },
        {
          "@type": "Question",
          "name": "How does the energy monitoring work?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Every device card tracks real-time wattage draw based on its current state and configured power rating. The Energy Radar page aggregates live draw across all active appliances, renders 24-hour load profiles using Recharts, and calls Gemini 1.5 Flash to generate 3 data-backed optimization insights with an estimated monthly savings figure in USD."
          }
        },
        {
          "@type": "Question",
          "name": "What smart home scenes does AuraHome.AI support?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "AuraHome.AI ships with 6 one-click scenes: Movie Night (warm dim lighting + TV backlight + locked perimeter), Sleep Sanctuary (all lights off + 68°F bedroom climate + door locked), Away / Lock Down (non-essential appliances off + HVAC eco mode + security armed), Morning Rise (kitchen lights at 80% + espresso maker warming + 72°F climate), Deep Focus Work (office keylight at 100% crisp white + calibrated audio), and Eco Saver (all lights at 40% + thermostat on efficiency curve)."
          }
        },
        {
          "@type": "Question",
          "name": "How do automation rules work in AuraHome.AI?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The Smart Rules engine supports IF/THEN automation rules with time-based triggers (e.g., lock doors at 11:00 PM every night), wattage-threshold triggers (e.g., dim lights when grid draw exceeds 2,500W), and temperature triggers. Each rule defines a set of device state updates that execute automatically, simulating real Home Assistant automation YAML logic in the browser."
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
