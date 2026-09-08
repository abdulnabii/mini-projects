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
      "applicationCategory": "HealthApplication",
      "operatingSystem": "All",
      "description": "Clinical medication schedule and patient safety guardian tracking dose adherence, cross-referencing severe drug-drug interactions with Gemini 1.5 Pro, and providing prescription OCR scanning.",
      "featureList": [
        "Patient medication schedule and real-time dosing timeline",
        "Clinical drug-drug interaction checker powered by Gemini 1.5 Pro",
        "AI missed-dose safety guidance based on medication half-life",
        "Prescription photo OCR scanning via computer vision",
        "Bilingual English and Urdu language support",
        "Caregiver remote adherence monitoring portal",
        "Refill depletion tracking and inventory alerts"
      ],
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
          "name": "How does MediGuard.AI detect dangerous drug-drug interactions?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "MediGuard.AI evaluates active pharmaceutical compounds against clinical databases using Google Gemini 1.5 Pro, categorizing combinations into SEVERE, MODERATE, and MILD with physiological explanations and physician action alerts."
          }
        },
        {
          "@type": "Question",
          "name": "What should a patient do if they miss a scheduled medication dose?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The AI Missed-Dose Advisor analyzes the specific drug class, half-life, and hours elapsed since the scheduled dose to provide safe guidance on whether to take late, skip, or call a physician."
          }
        },
        {
          "@type": "Question",
          "name": "How does the Prescription OCR Scanner work?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Patients upload a photo of a doctor's prescription. Computer vision OCR extracts text and passes it to Gemini 1.5 Pro to parse medication names, strengths, and frequencies into 1-click schedule entries."
          }
        },
        {
          "@type": "Question",
          "name": "Does MediGuard.AI support bilingual English and Urdu?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. MediGuard.AI features native bilingual toggling between English and Urdu Nastaliq, high-contrast accessibility modes, and voice readouts for elderly patients."
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
