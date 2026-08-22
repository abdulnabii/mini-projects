import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const metadata: Metadata = {
  title: 'LoadPulse.AI — High-Concurrency API Load Studio & AI Performance Diagnostics',
  description:
    'Simulate massive concurrent virtual users, visualize real-time P50/P95/P99 latency curves, and identify server bottlenecks with Gemini AI.',
  keywords: 'API load testing, k6, performance engineering, throughput RPS, latency percentiles, server bottlenecks, SRE diagnostics',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} dark`}>
      <body className="bg-[#030712] text-slate-100 min-h-screen flex flex-col font-sans antialiased selection:bg-cyan-500 selection:text-black">
        <Navbar />
        <main className="flex-1 py-8 px-4 sm:px-6 max-w-6xl mx-auto w-full min-w-0">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
