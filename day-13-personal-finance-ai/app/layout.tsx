import type { Metadata } from 'next';
import { Inter, JetBrains_Mono, Outfit } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const jetBrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const metadata: Metadata = {
  title: 'WealthPulse.AI — AI Personal Finance & FIRE Intelligence Platform',
  description: 'AI-powered financial health dashboard. Transform bank statements into net worth tracking, FIRE retirement calculations, debt payoff optimization, and AI CFP advice.',
  keywords: ['AI personal finance', 'FIRE calculator', 'bank statement parser', 'debt avalanche optimizer', 'financial health score'],
  authors: [{ name: 'Abdul Nabi', url: 'https://github.com/abdulnabii' }],
  openGraph: {
    title: 'WealthPulse.AI — AI Personal Finance & FIRE Intelligence Platform',
    description: 'Transform bank statements into net worth tracking, FIRE retirement projections, and AI financial health reports.',
    url: 'https://day-13-personal-finance-ai.vercel.app',
    siteName: 'WealthPulse AI',
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
      "@id": "https://day-13-personal-finance-ai.vercel.app/#webapp",
      "name": "WealthPulse.AI",
      "url": "https://day-13-personal-finance-ai.vercel.app",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "All",
      "description": "Comprehensive wealth building and FIRE (Financial Independence, Retire Early) planning suite featuring Monte Carlo simulations, compound growth modeling, and asset allocation advice.",
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
      "@id": "https://day-13-personal-finance-ai.vercel.app/#website",
      "url": "https://day-13-personal-finance-ai.vercel.app",
      "name": "WealthPulse.AI",
      "publisher": {
        "@type": "Person",
        "name": "Abdul Nabi",
        "url": "https://github.com/abdulnabii"
      }
    },
    {
      "@type": "FAQPage",
      "@id": "https://day-13-personal-finance-ai.vercel.app/#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is the FIRE calculation methodology?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "WealthPulse.AI uses the 4% safe withdrawal rule combined with 1,000-run Monte Carlo market simulations to predict the exact year and required capital for financial independence."
          }
        }
      ]
    }
  ]
}` }}
        />
      </head>
      <body className={`${inter.variable} ${jetBrainsMono.variable} ${outfit.variable} bg-[#080c14] text-slate-200 min-h-screen flex flex-col font-sans antialiased selection:bg-amber-500/30 selection:text-white`}>
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
