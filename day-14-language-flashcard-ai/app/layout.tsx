import type { Metadata } from 'next';
import { Inter, JetBrains_Mono, Outfit } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const metadata: Metadata = {
  title: 'LingoPulse.AI — AI Language Flashcards & Spaced Repetition Platform',
  description: 'Master Spanish, Arabic, Urdu, French, and German using the scientific SuperMemo 2 (SM-2) spaced repetition algorithm, AI contextual flashcards, and Web Speech pronunciation assessor.',
  keywords: ['language flashcards', 'SM-2 spaced repetition', 'AI language learning', 'Arabic flashcards RTL', 'Urdu flashcards', 'pronunciation checker'],
  authors: [{ name: 'Abdul Nabi', url: 'https://github.com/abdulnabii' }],
  openGraph: {
    title: 'LingoPulse.AI — AI Language Flashcards & Spaced Repetition Platform',
    description: 'Scientific SM-2 spaced repetition with AI flashcard deck generation and native speech recognition.',
    url: 'https://day-14-language-flashcard-ai.vercel.app',
    siteName: 'LingoPulse AI',
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
      "@id": "https://day-14-language-flashcard-ai.vercel.app/#webapp",
      "name": "LingoPulse.AI",
      "url": "https://day-14-language-flashcard-ai.vercel.app",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "All",
      "description": "Multi-sensory language acquisition engine combining the SuperMemo-2 (SM-2) algorithm, 3D interactive flashcards, AI deck generation across 5 languages (with RTL Arabic/Urdu), and live speech pronunciation scoring.",
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
      "@id": "https://day-14-language-flashcard-ai.vercel.app/#website",
      "url": "https://day-14-language-flashcard-ai.vercel.app",
      "name": "LingoPulse.AI",
      "publisher": {
        "@type": "Person",
        "name": "Abdul Nabi",
        "url": "https://github.com/abdulnabii"
      }
    },
    {
      "@type": "FAQPage",
      "@id": "https://day-14-language-flashcard-ai.vercel.app/#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How does the SM-2 spaced repetition algorithm work?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "SM-2 calculates optimal review intervals dynamically based on user recall grades (0 to 5), ensuring flashcards are presented immediately before natural memory decay occurs."
          }
        }
      ]
    }
  ]
}` }}
        />
      </head>
      <body className={`${inter.variable} ${mono.variable} ${outfit.variable} bg-[#0b0f19] text-slate-200 min-h-screen flex flex-col font-sans antialiased selection:bg-emerald-500/30 selection:text-white`}>
        {children}
      </body>
    </html>
  );
}
