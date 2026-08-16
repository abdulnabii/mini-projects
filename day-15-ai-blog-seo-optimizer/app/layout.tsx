import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const metadata: Metadata = {
  title: 'RankCraft.AI — AI-Powered Blog SEO Optimizer & SERP Intelligence Platform',
  description: 'Data-driven on-page SEO content auditor. Evaluate keyword density, Flesch-Kincaid readability, heading structure hierarchy, SERP snippet previews, and AI paragraph rewrites.',
  keywords: ['blog SEO optimizer', 'Flesch Kincaid readability', 'keyword density analyzer', 'SERP snippet simulator', 'AI content rewriter', 'on-page SEO audit'],
  authors: [{ name: 'Abdul Nabi', url: 'https://github.com/abdulnabii' }],
  openGraph: {
    title: 'RankCraft.AI — AI-Powered Blog SEO Optimizer & SERP Intelligence Platform',
    description: 'Data-driven SEO content audit with 8-point quality check and AI section rewrites.',
    url: 'https://day-15-ai-blog-seo-optimizer.vercel.app',
    siteName: 'RankCraft AI',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${outfit.variable} bg-[#080c14] text-slate-200 min-h-screen flex flex-col antialiased`}>
        {children}
      </body>
    </html>
  );
}
