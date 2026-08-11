import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'ExpenseMind.AI — AI Expense Tracker & Financial Coach',
  description: 'AI-first personal finance application featuring receipt OCR scanning, automatic category classification, spending analytics, and Gemini conversational financial coaching.',
  keywords: ['AI expense tracker', 'receipt OCR scanner', 'personal finance AI', 'budget manager', 'spending analytics'],
  authors: [{ name: 'Abdul Nabi', url: 'https://github.com/abdulnabii' }],
  openGraph: {
    title: 'ExpenseMind.AI — AI Expense Tracker & Financial Coach',
    description: 'Automate expense tracking with receipt OCR and AI financial coaching.',
    url: 'https://smart-expense-tracker.vercel.app',
    siteName: 'ExpenseMind AI',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${mono.variable} bg-[#060e0e] text-slate-200 min-h-screen flex flex-col`}>
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
