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
      
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: `{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": "https://day-19-collaborative-whiteboard.vercel.app/#webapp",
      "name": "ScribbleAI",
      "url": "https://day-19-collaborative-whiteboard.vercel.app",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "All",
      "description": "Infinite vector canvas supporting freehand drawing, geometric shape snapping, sticky notes, and AI-driven sketch-to-diagram conversion.",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "author": {
        "@type": "Person",
        "name": "Abdul Nabi",
        "url": "https://github.com/abdulnabii"
      }
    },
    {
      "@type": "WebSite",
      "@id": "https://day-19-collaborative-whiteboard.vercel.app/#website",
      "url": "https://day-19-collaborative-whiteboard.vercel.app",
      "name": "ScribbleAI",
      "publisher": {
        "@type": "Person",
        "name": "Abdul Nabi",
        "url": "https://github.com/abdulnabii"
      }
    },
    {
      "@type": "FAQPage",
      "@id": "https://day-19-collaborative-whiteboard.vercel.app/#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What can I build on ScribbleAI?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "ScribbleAI allows drawing software architecture flowcharts, mind maps, user journeys, and generating auto-aligned diagrams from sketches."
          }
        }
      ]
    }
  ]
}` }}
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
