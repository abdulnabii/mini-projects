import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const metadata: Metadata = {
  title: 'ThreadGenius.AI — AI Tweet Thread, LinkedIn & Carousel Content Studio',
  description:
    'Generate high-converting Twitter/X threads, LinkedIn authority posts, and multi-slide carousels calibrated to your voice with AI viral score predictions.',
  keywords: 'AI tweet generator, twitter thread creator, linkedin post generator, viral hook generator, social media content studio',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} dark`}>
      
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: `{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": "https://day-25-ai-content-studio.vercel.app/#webapp",
      "name": "ThreadGenius.AI",
      "url": "https://day-25-ai-content-studio.vercel.app",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "All",
      "description": "Omnichannel content creation suite transforming long-form articles into viral Twitter/X threads, LinkedIn carousels, TikTok hooks, and newsletter snippets.",
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
      "@id": "https://day-25-ai-content-studio.vercel.app/#website",
      "url": "https://day-25-ai-content-studio.vercel.app",
      "name": "ThreadGenius.AI",
      "publisher": {
        "@type": "Person",
        "name": "Abdul Nabi",
        "url": "https://github.com/abdulnabii"
      }
    },
    {
      "@type": "FAQPage",
      "@id": "https://day-25-ai-content-studio.vercel.app/#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Which social platforms are supported?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "ThreadGenius.AI outputs optimized copy for Twitter/X threads, LinkedIn professional posts, Instagram captions, and short-form video scripts."
          }
        }
      ]
    }
  ]
}` }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#060e14] text-slate-200 antialiased selection:bg-emerald-500 selection:text-black">
        <Navbar />
        <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full space-y-10 font-mono min-w-0">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
