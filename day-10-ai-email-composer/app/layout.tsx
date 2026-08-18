import type { Metadata } from 'next';
import { Inter, JetBrains_Mono, Outfit } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const jetBrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const metadata: Metadata = {
  title: 'MailCraft.AI — AI Cold Email Copywriter & Subject Line Optimizer',
  description: 'Transform rough notes & bullet points into 3 high-converting cold email variants, follow-up sequences, and subject lines with predicted open rates.',
  keywords: ['AI email composer', 'cold email generator', 'subject line optimizer', 'open rate predictor', 'email copywriter'],
  authors: [{ name: 'Abdul Nabi', url: 'https://github.com/abdulnabii' }],
  openGraph: {
    title: 'MailCraft.AI — AI Email Studio',
    description: 'Transform rough notes into high-converting cold outreach packages.',
    url: 'https://day-10-ai-email-composer.vercel.app',
    siteName: 'MailCraft AI',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${jetBrainsMono.variable} ${outfit.variable} bg-[#080c14] text-slate-200 min-h-screen flex flex-col font-sans antialiased selection:bg-indigo-500/30 selection:text-white`}>
        {children}
      </body>
    </html>
  );
}
