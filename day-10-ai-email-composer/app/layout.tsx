import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'EmailPulse.AI — AI Writing Assistant & Subject Line Optimizer',
  description: 'Transform bullet points into 3 A/B email variants and 5 subject lines with predicted open rate scores, 1-click clipboard copy, and Gmail deep linking.',
  keywords: ['AI email composer', 'subject line optimizer', 'open rate predictor', 'A/B email variants', 'cold outreach assistant'],
  authors: [{ name: 'Abdul Nabi', url: 'https://github.com/abdulnabii' }],
  openGraph: {
    title: 'EmailPulse.AI — AI Writing Assistant & Subject Line Optimizer',
    description: 'A/B email variant generation and subject line open rate optimization.',
    url: 'https://ai-email-composer.vercel.app',
    siteName: 'EmailPulse AI',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${mono.variable} bg-[#0b0f19] text-slate-200 min-h-screen flex flex-col`}>
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
