import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
});

export const metadata: Metadata = {
  title: 'MediGuard.AI — Patient Medication Schedule & AI Clinical Safety Guardian',
  description:
    'AI-powered medication adherence, real-time dosing reminders, Gemini drug interaction checker, and prescription OCR scanner for chronic disease management.',
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
      "@id": "https://day-26-medication-reminder-system.vercel.app/#webapp",
      "name": "MediGuard.AI",
      "url": "https://day-26-medication-reminder-system.vercel.app",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "All",
      "description": "Patient safety companion tracking medication schedules, cross-referencing contraindications and dangerous drug-drug interactions, and providing clear dosage guidelines.",
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
      "@id": "https://day-26-medication-reminder-system.vercel.app/#website",
      "url": "https://day-26-medication-reminder-system.vercel.app",
      "name": "MediGuard.AI",
      "publisher": {
        "@type": "Person",
        "name": "Abdul Nabi",
        "url": "https://github.com/abdulnabii"
      }
    },
    {
      "@type": "FAQPage",
      "@id": "https://day-26-medication-reminder-system.vercel.app/#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How does MediGuard.AI detect drug interactions?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "MediGuard.AI analyzes active chemical compounds and contraindication databases to flag severe, moderate, and mild interaction risks between concurrent prescriptions."
          }
        }
      ]
    }
  ]
}` }}
        />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} min-h-screen flex flex-col bg-[#060e14] text-slate-100 antialiased selection:bg-emerald-500/30 selection:text-emerald-200`}
      >
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
