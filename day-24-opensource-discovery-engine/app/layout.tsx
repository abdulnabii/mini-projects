import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const metadata: Metadata = {
  title: 'GitMatch.AI — Open Source Project Discovery & AI First-Contribution Matchmaker',
  description:
    'Find open-source repositories matching your tech stack. Measure project health scores, browse good-first-issues, and generate step-by-step first PR guides powered by Gemini AI.',
  keywords: 'open source discovery, first pr guide, good first issue finder, github project health, developer tools, AI contributor matchmaker',
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
      "@id": "https://day-24-opensource-discovery-engine.vercel.app/#webapp",
      "name": "RepoRadar.AI",
      "url": "https://day-24-opensource-discovery-engine.vercel.app",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "All",
      "description": "Curated GitHub open-source discovery radar analyzing repository bus factor, maintenance velocity, issue resolution time, and good-first-issue opportunities.",
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
      "@id": "https://day-24-opensource-discovery-engine.vercel.app/#website",
      "url": "https://day-24-opensource-discovery-engine.vercel.app",
      "name": "RepoRadar.AI",
      "publisher": {
        "@type": "Person",
        "name": "Abdul Nabi",
        "url": "https://github.com/abdulnabii"
      }
    },
    {
      "@type": "FAQPage",
      "@id": "https://day-24-opensource-discovery-engine.vercel.app/#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is the Bus Factor metric?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Bus Factor calculates the minimum number of team members that have to disappear before a project stalls, helping developers identify well-distributed open source libraries."
          }
        }
      ]
    }
  ]
}` }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#060e14] text-slate-200 antialiased selection:bg-emerald-500 selection:text-black">
        <Navbar />
        <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full space-y-10 font-mono min-w-0">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
