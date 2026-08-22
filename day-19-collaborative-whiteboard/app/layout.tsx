import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CanvasFlow.AI — Infinite Canvas & AI Diagram Studio',
  description: 'Real-time collaborative infinite canvas whiteboard with AI diagram generation. Draw, brainstorm, and design together.',
  keywords: 'collaborative whiteboard, real-time canvas, AI diagrams, team collaboration, infinite canvas',
  openGraph: {
    title: 'CanvasFlow.AI',
    description: 'Infinite Canvas. Real-Time Intelligence.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
