import type { Metadata } from 'next';
import { Inter, JetBrains_Mono, Outfit } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const jetBrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const metadata: Metadata = {
  title: 'StockPulse.AI — Real-Time Market Intelligence & Quantitative AI Terminal',
  description: 'Real-time stock & crypto market terminal with simulated live tick feeds, candlestick charting, AI sentiment trade signals, and virtual paper trading.',
  keywords: ['stock market dashboard', 'AI sentiment analysis', 'candlestick chart', 'paper trading', 'crypto tracker', 'trading terminal'],
  authors: [{ name: 'Abdul Nabi', url: 'https://github.com/abdulnabii' }],
  openGraph: {
    title: 'StockPulse.AI — Market Intelligence Terminal',
    description: 'Real-time financial dashboard with AI sentiment engine and paper trading.',
    url: 'https://day-06-stock-dashboard.vercel.app',
    siteName: 'StockPulse AI',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${jetBrainsMono.variable} ${outfit.variable} bg-[#080c14] text-slate-200 min-h-screen flex flex-col font-sans antialiased selection:bg-green-500/30 selection:text-white`}>
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
