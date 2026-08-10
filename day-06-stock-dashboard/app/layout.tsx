import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const jetBrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'StockPulse.AI — AI-Powered Market Intelligence Terminal',
  description: 'Real-time stock market terminal with simulated live price feeds, AI sentiment analysis, portfolio tracking, and price alerts. Powered by Gemini AI.',
  keywords: ['stock market dashboard', 'AI sentiment analysis', 'portfolio tracker', 'market intelligence', 'trading terminal'],
  authors: [{ name: 'Abdul Nabi', url: 'https://github.com/abdulnabii' }],
  openGraph: {
    title: 'StockPulse.AI — Market Intelligence Terminal',
    description: 'Real-time stock dashboard with AI sentiment engine and portfolio tracking.',
    url: 'https://stock-pulse-ai.vercel.app',
    siteName: 'StockPulse AI',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${jetBrainsMono.variable} bg-[#080c10] text-slate-200 min-h-screen flex flex-col`}>
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
