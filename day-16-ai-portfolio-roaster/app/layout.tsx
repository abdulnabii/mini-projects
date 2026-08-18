import type { Metadata } from 'next';
import { Inter, JetBrains_Mono, Outfit } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const metadata: Metadata = {
  title: 'PortfolioRoaster.AI — Brutally Honest AI Portfolio Critiques & ATS Fixes',
  description:
    'Get roasted by senior UI/UX designers and hiring managers. Receive brutally honest portfolio feedback across design, project depth, bio cringe factor, UX speed, and ATS hireability.',
  keywords: [
    'portfolio roaster',
    'AI portfolio review',
    'developer portfolio critique',
    'portfolio score',
    'ATS portfolio optimizer',
    'designer portfolio roast',
  ],
  authors: [{ name: 'Abdul Nabi', url: 'https://github.com/abdulnabii' }],
  openGraph: {
    title: 'PortfolioRoaster.AI — Brutally Honest AI Portfolio Critiques & ATS Fixes',
    description: 'AI-powered developer & designer portfolio review engine with actionable engineering fixes.',
    url: 'https://day-16-ai-portfolio-roaster.vercel.app',
    siteName: 'PortfolioRoaster AI',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${mono.variable} ${outfit.variable} bg-[#080a0f] text-slate-200 min-h-screen flex flex-col font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
