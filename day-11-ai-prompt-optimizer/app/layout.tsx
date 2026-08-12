import type { Metadata } from 'next';
import { Inter, JetBrains_Mono, Outfit } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'PromptCraft.AI — Advanced AI Prompt Engineering Terminal',
  description: 'Production-grade AI prompt optimization engine. Transforms unstructured prompts into structured, model-tuned system instructions for Gemini, Claude, and GPT-4.',
  keywords: ['AI prompt optimizer', 'prompt engineering', 'system prompt builder', 'Claude 3.5 prompts', 'Gemini 1.5 prompts'],
  authors: [{ name: 'Abdul Nabi', url: 'https://github.com/abdulnabii' }],
  openGraph: {
    title: 'PromptCraft.AI — Advanced AI Prompt Engineering Terminal',
    description: 'Model-specific prompt optimization, quality scorecards, variable extraction, and live execution sandboxes.',
    url: 'https://day-11-ai-prompt-optimizer.vercel.app',
    siteName: 'PromptCraft AI',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${outfit.variable} ${mono.variable} bg-[#080b11] text-slate-200 min-h-screen flex flex-col antialiased`}>
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
