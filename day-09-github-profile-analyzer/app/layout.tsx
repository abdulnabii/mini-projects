import type { Metadata } from 'next';
import { Inter, JetBrains_Mono, Outfit } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const metadata: Metadata = {
  title: 'GitPulse.AI — AI GitHub Developer Portfolio & Impact Analyzer',
  description: 'Transform any GitHub username into a visual developer portfolio analysis: repository impact scores, language DNA radar, 52-week contribution heatmap, and AI developer persona.',
  keywords: ['GitHub profile analyzer', 'developer portfolio AI', 'impact score ranking', 'contribution heatmap', 'developer persona generator'],
  authors: [{ name: 'Abdul Nabi', url: 'https://github.com/abdulnabii' }],
  openGraph: {
    title: 'GitPulse.AI — AI GitHub Developer Portfolio & Impact Analyzer',
    description: 'Visual developer portfolio analysis, impact scores, and AI persona.',
    url: 'https://day-09-github-profile-analyzer.vercel.app',
    siteName: 'GitPulse AI',
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
      "@id": "https://day-09-github-profile-analyzer.vercel.app/#webapp",
      "name": "GitPulse.AI",
      "url": "https://day-09-github-profile-analyzer.vercel.app",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "All",
      "description": "Deep repository intelligence tool analyzing GitHub profiles for commit consistency, language breadth, architectural complexity, and open-source impact scoring.",
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
      "@id": "https://day-09-github-profile-analyzer.vercel.app/#website",
      "url": "https://day-09-github-profile-analyzer.vercel.app",
      "name": "GitPulse.AI",
      "publisher": {
        "@type": "Person",
        "name": "Abdul Nabi",
        "url": "https://github.com/abdulnabii"
      }
    },
    {
      "@type": "FAQPage",
      "@id": "https://day-09-github-profile-analyzer.vercel.app/#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What metrics does GitPulse.AI analyze?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "GitPulse.AI evaluates commit frequency, repository complexity, PR velocity, language distribution, and open-source contribution impact."
          }
        }
      ]
    }
  ]
}` }}
        />
      </head>
      <body className={`${inter.variable} ${mono.variable} ${outfit.variable} bg-[#0a0d14] text-slate-200 min-h-screen flex flex-col font-sans antialiased selection:bg-emerald-500/30 selection:text-white`}>
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
