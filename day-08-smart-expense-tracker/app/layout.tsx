import type { Metadata } from 'next';
import { Inter, JetBrains_Mono, Outfit } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const jetBrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const metadata: Metadata = {
  title: 'ExpenseMind.AI — Smart Expense Tracker & AI Financial Advisory',
  description: 'Smart personal expense tracker with AI receipt vision OCR scanning, real-time budget progress, financial health scorecards, and Gemini financial advisory.',
  keywords: ['smart expense tracker', 'receipt scanner OCR', 'AI financial coach', 'budgeting app', 'personal finance AI'],
  authors: [{ name: 'Abdul Nabi', url: 'https://github.com/abdulnabii' }],
  openGraph: {
    title: 'ExpenseMind.AI — Smart Expense Tracker & Financial Coach',
    description: 'Track expenses, scan receipts with AI Vision OCR, and optimize personal cashflow.',
    url: 'https://day-08-smart-expense-tracker.vercel.app',
    siteName: 'ExpenseMind AI',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${jetBrainsMono.variable} ${outfit.variable} bg-[#060e0e] text-slate-200 min-h-screen flex flex-col font-sans antialiased selection:bg-emerald-500/30 selection:text-white`}>
        {children}
      </body>
    </html>
  );
}
