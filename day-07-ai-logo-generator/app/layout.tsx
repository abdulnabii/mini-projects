import type { Metadata } from 'next';
import { Inter, JetBrains_Mono, Outfit } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'BrandCrafter.AI — AI Brand Identity & Logo System',
  description: 'Instant AI-powered brand identity generation: custom vector logo concepts, color palettes with WCAG accessibility validation, Google Font typography pairings, and real-time mockup previews.',
  keywords: ['AI logo generator', 'brand identity builder', 'vector logo creator', 'color palette extractor', 'typography pairings'],
  authors: [{ name: 'Abdul Nabi', url: 'https://github.com/abdulnabii' }],
  openGraph: {
    title: 'BrandCrafter.AI — AI Brand Identity & Logo System',
    description: 'Generates professional vector logo concepts, brand palettes, typography guidelines, and real-time mockups.',
    url: 'https://ai-logo-generator.vercel.app',
    siteName: 'BrandCrafter AI',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${outfit.variable} ${mono.variable} bg-[#0a0d14] text-slate-200 min-h-screen flex flex-col`}>
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
