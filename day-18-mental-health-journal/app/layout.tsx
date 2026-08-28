import type { Metadata } from 'next';
import { Inter, JetBrains_Mono, Outfit } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const metadata: Metadata = {
  title: 'MindSanctuary.AI — Private AI Mental Health Journal & Cognitive Wellness Companion',
  description:
    'A private, trauma-informed journaling companion powered by AI emotional intelligence. Free-form writing, CBT pattern recognition, empathetic reflections, guided breathwork, and 30-day mood timelines.',
  keywords: [
    'mental health journal',
    'AI journaling',
    'CBT cognitive distortion detector',
    'mood tracker',
    'box breathing',
    'emotional intelligence AI',
  ],
  authors: [{ name: 'Abdul Nabi', url: 'https://github.com/abdulnabii' }],
  openGraph: {
    title: 'MindSanctuary.AI — Private AI Mental Health Journal & Cognitive Wellness Companion',
    description: 'Empathetic AI reflections, CBT pattern recognition, and 30-day mood tracking.',
    url: 'https://day-18-mental-health-journal.vercel.app',
    siteName: 'MindSanctuary AI',
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
      "@id": "https://day-18-mental-health-journal.vercel.app/#webapp",
      "name": "MindReflect.AI",
      "url": "https://day-18-mental-health-journal.vercel.app",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "All",
      "description": "Confidential, encrypted wellness journal utilizing evidence-based Cognitive Behavioral Therapy (CBT) techniques to identify cognitive distortions and guide constructive thought reframing.",
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
      "@id": "https://day-18-mental-health-journal.vercel.app/#website",
      "url": "https://day-18-mental-health-journal.vercel.app",
      "name": "MindReflect.AI",
      "publisher": {
        "@type": "Person",
        "name": "Abdul Nabi",
        "url": "https://github.com/abdulnabii"
      }
    },
    {
      "@type": "FAQPage",
      "@id": "https://day-18-mental-health-journal.vercel.app/#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Is MindReflect.AI private and secure?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "MindReflect.AI processes journal entries with client-side privacy safeguards and provides supportive, non-clinical CBT thought reframing exercises."
          }
        }
      ]
    }
  ]
}` }}
        />
      </head>
      <body
        className={`${inter.variable} ${mono.variable} ${outfit.variable} bg-[#060a12] text-slate-200 min-h-screen flex flex-col font-sans antialiased selection:bg-emerald-500/30 selection:text-white`}
      >
        {children}
      </body>
    </html>
  );
}
