import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const metadata: Metadata = {
  title: 'LingoPulse.AI — AI Language Flashcards & Spaced Repetition Platform',
  description: 'Master Spanish, Arabic, Urdu, French, and German using the scientific SuperMemo 2 (SM-2) spaced repetition algorithm, AI contextual flashcards, and Web Speech pronunciation assessor.',
  keywords: ['language flashcards', 'SM-2 spaced repetition', 'AI language learning', 'Arabic flashcards RTL', 'Urdu flashcards', 'pronunciation checker'],
  authors: [{ name: 'Abdul Nabi', url: 'https://github.com/abdulnabii' }],
  openGraph: {
    title: 'LingoPulse.AI — AI Language Flashcards & Spaced Repetition Platform',
    description: 'Scientific SM-2 spaced repetition with AI flashcard deck generation and native speech recognition.',
    url: 'https://day-14-language-flashcard-ai.vercel.app',
    siteName: 'LingoPulse AI',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${outfit.variable} bg-[#0b0f19] text-slate-200 min-h-screen flex flex-col antialiased`}>
        {children}
      </body>
    </html>
  );
}
