import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DisclaimerBanner from '@/components/DisclaimerBanner';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'MediTriage AI — AI Symptom Checker & Triage Assistant',
  description:
    'Conversational AI symptom checker and WHO clinical triage assistant. Analyze symptoms, risk levels, and recommended next steps.',
  keywords: ['AI healthcare', 'symptom checker', 'medical triage', 'AI triage assistant', 'WHO triage'],
  authors: [{ name: 'Abdul Nabi', url: 'https://aiwithab.site' }],
  openGraph: {
    title: 'MediTriage AI — AI Symptom Checker',
    description: 'Conversational AI medical symptom checker and clinical triage engine.',
    url: 'https://symptom-checker.aiwithab.site',
    siteName: 'MediTriage AI',
    locale: 'en_US',
    type: 'website',
  },
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
      "@id": "https://ai-symptom-checker.vercel.app/#webapp",
      "name": "HealthPulse.AI",
      "url": "https://ai-symptom-checker.vercel.app",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "All",
      "description": "AI-powered clinical triage engine analyzing patient symptoms with severity stratification, red flag detection, differential considerations, and plain-English medical guidance.",
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
      "@id": "https://ai-symptom-checker.vercel.app/#website",
      "url": "https://ai-symptom-checker.vercel.app",
      "name": "HealthPulse.AI",
      "publisher": {
        "@type": "Person",
        "name": "Abdul Nabi",
        "url": "https://github.com/abdulnabii"
      }
    },
    {
      "@type": "FAQPage",
      "@id": "https://ai-symptom-checker.vercel.app/#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is HealthPulse.AI?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "HealthPulse.AI is an AI-powered medical symptom checker that assists patients in understanding potential health conditions through intelligent clinical triage and urgency stratification."
          }
        },
        {
          "@type": "Question",
          "name": "How does the clinical triage engine work?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The engine cross-references reported symptoms, duration, and patient demographics against medical knowledge graphs to evaluate emergency red flags and suggest appropriate care pathways."
          }
        }
      ]
    }
  ]
}` }}
        />
      </head>
      <body className={`${inter.variable} bg-slate-950 text-slate-100 min-h-screen flex flex-col`}>
        <DisclaimerBanner />
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
