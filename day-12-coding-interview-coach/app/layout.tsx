import type { Metadata } from 'next';
import { Inter, JetBrains_Mono, Outfit } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'AlgoCoach.AI — Real-Time AI Technical Interview Simulator',
  description: 'AI-powered coding interview simulator. Practice LeetCode & System Design problems with Alex (AI Staff Engineer), progressive hints, test suites, and Big-O assessment reports.',
  keywords: ['AI coding interview', 'mock technical interview', 'LeetCode AI coach', 'System Design interview simulator', 'Big O analyzer'],
  authors: [{ name: 'Abdul Nabi', url: 'https://github.com/abdulnabii' }],
  openGraph: {
    title: 'AlgoCoach.AI — Real-Time AI Technical Interview Simulator',
    description: 'Practice real-time technical interviews with AI Staff Engineer, progressive hints, and automated evaluation reports.',
    url: 'https://day-12-coding-interview-coach.vercel.app',
    siteName: 'AlgoCoach AI',
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
      "@id": "https://day-12-coding-interview-coach.vercel.app/#webapp",
      "name": "AlgoCoach.AI",
      "url": "https://day-12-coding-interview-coach.vercel.app",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "All",
      "description": "Interactive technical interview simulator evaluating algorithmic problem solving, Big-O time/space complexity, edge-case coverage, and code design in real-time.",
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
      "@id": "https://day-12-coding-interview-coach.vercel.app/#website",
      "url": "https://day-12-coding-interview-coach.vercel.app",
      "name": "AlgoCoach.AI",
      "publisher": {
        "@type": "Person",
        "name": "Abdul Nabi",
        "url": "https://github.com/abdulnabii"
      }
    },
    {
      "@type": "FAQPage",
      "@id": "https://day-12-coding-interview-coach.vercel.app/#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How does AlgoCoach.AI evaluate coding submissions?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "It evaluates algorithmic correctness against test cases, calculates theoretical Big-O time and space complexity, and provides step-by-step optimization hints."
          }
        }
      ]
    }
  ]
}` }}
        />
      </head>
      <body className={`${inter.variable} ${outfit.variable} ${mono.variable} bg-[#0a0d14] text-slate-200 min-h-screen flex flex-col antialiased`}>
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
