import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
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
      <body className={`${inter.variable} ${outfit.variable} bg-[#0a0d14] text-slate-200 min-h-screen flex flex-col antialiased`}>
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
