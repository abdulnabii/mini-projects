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
      "description": "AI-powered social media content studio generating viral Twitter/X threads, LinkedIn thought-leadership posts, and multi-slide carousels calibrated to your authentic voice with Gemini 1.5 Pro.",
      "featureList": [
        "Idea-to-10-Tweet thread generator with viral hooks",
        "LinkedIn professional long-form authority post generator",
        "AI voice calibration learning from user sample posts",
        "5-way viral hook variant generator with predicted CTR",
        "0-100 predicted engagement score and readability audit",
        "Multi-slide LinkedIn carousel generator",
        "Full-article content repurposing engine",
        "Drafts & scheduling queue with optimal posting time recommendations"
      ],
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
          "name": "How does ThreadGenius.AI calibrate to my authentic writing voice?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "ThreadGenius.AI analyzes sample past tweets, LinkedIn posts, or writing snippets using Google Gemini 1.5 Pro to extract sentence length, emoji density, and tone patterns for personalized generation."
          }
        },
        {
          "@type": "Question",
          "name": "How is the Predicted Viral Engagement Score calculated?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The 0-100 engagement metric evaluates hook strength, whitespace readability, emotional curiosity gaps, and call-to-action clarity against viral post heuristics."
          }
        },
        {
          "@type": "Question",
          "name": "What formats does the LinkedIn Carousel Creator generate?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The Carousel Studio transforms complex technical ideas into structured 5-10 slide visual outlines with high-impact headlines and scannable bullet takeaways."
          }
        },
        {
          "@type": "Question",
          "name": "Can I repurpose long-form engineering blogs or changelogs into social posts?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. The Repurposer Studio takes raw markdown or technical articles and atomizes them into a Twitter thread, a LinkedIn post, and a carousel outline in a single generation pass."
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
