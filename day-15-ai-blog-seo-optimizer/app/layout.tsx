import type { Metadata } from 'next';
import { Inter, JetBrains_Mono, Outfit } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

const baseUrl = 'https://day-15-ai-blog-seo-optimizer.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'RankCraft.AI — AI Blog SEO Optimizer & SERP Intelligence Platform',
    template: '%s | RankCraft.AI',
  },
  description:
    'Data-driven on-page SEO content auditor & Answer Engine Optimizer (AEO). Evaluates Google E-E-A-T signals, NLP semantic entity coverage, Flesch-Kincaid readability, heading hierarchy, SERP snippet previews, and AI section rewrites.',
  keywords: [
    'blog SEO optimizer',
    'AEO answer engine optimization',
    'Google E-E-A-T score',
    'NLP entity coverage',
    'Flesch Kincaid readability',
    'keyword density analyzer',
    'SERP snippet simulator',
    'AI content rewriter',
    'on-page SEO audit',
    'Position 0 FAQ schema generator',
    'Gemini AI SEO',
  ],
  authors: [{ name: 'Abdul Nabi', url: 'https://github.com/abdulnabii' }],
  creator: 'Abdul Nabi',
  publisher: 'Abdul Nabi',
  category: 'Technology',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'RankCraft.AI — AI-Powered Blog SEO & AEO Intelligence Platform',
    description:
      'Transform blog content into top-ranking search assets. 8-point on-page SEO health check, Google E-E-A-T radar, NLP entity gap detector, and multi-mode AI paragraph rewrites.',
    url: baseUrl,
    siteName: 'RankCraft.AI',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'RankCraft.AI - On-Page SEO & SERP Intelligence Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RankCraft.AI — AI Blog SEO Optimizer & SERP Intelligence',
    description:
      'Run 8-point SEO health checks, Google E-E-A-T audits, NLP semantic entity analysis, and instant AI rewrites.',
    creator: '@abdulnabii',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

// Machine-readable Schema.org JSON-LD structured data for 100% SEO & AEO compliance
const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      '@id': `${baseUrl}/#webapp`,
      name: 'RankCraft.AI',
      url: baseUrl,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'All',
      browserRequirements: 'Requires JavaScript. Requires HTML5.',
      description:
        'AI-powered on-page SEO content auditor, Google E-E-A-T evaluator, NLP semantic entity gap detector, and SERP snippet simulator.',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
        availability: 'https://schema.org/OnlineOnly',
      },
      author: {
        '@type': 'Person',
        name: 'Abdul Nabi',
        url: 'https://github.com/abdulnabii',
      },
    },
    {
      '@type': 'WebSite',
      '@id': `${baseUrl}/#website`,
      url: baseUrl,
      name: 'RankCraft.AI',
      description: 'AI Blog SEO Optimizer & SERP Intelligence Suite',
      publisher: {
        '@type': 'Person',
        name: 'Abdul Nabi',
        url: 'https://github.com/abdulnabii',
      },
    },
    {
      '@type': 'FAQPage',
      '@id': `${baseUrl}/#faq`,
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is RankCraft.AI?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'RankCraft.AI is an AI-powered on-page SEO and Answer Engine Optimization (AEO) platform that analyzes blog drafts against search engine ranking signals, Google E-E-A-T guidelines, Flesch-Kincaid readability, and NLP semantic entities.',
          },
        },
        {
          '@type': 'Question',
          name: 'How does RankCraft.AI optimize for Answer Engine Optimization (AEO)?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'RankCraft.AI optimizes content for AEO by generating direct, chunkable Q&A blocks, outputting Schema.org FAQPage JSON-LD structured data, measuring semantic NLP entity coverage, and optimizing reading ease for LLMs like ChatGPT, Perplexity AI, and Google AI Overviews.',
          },
        },
        {
          '@type': 'Question',
          name: 'What SEO scoring algorithms does RankCraft.AI use?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'RankCraft.AI combines the mathematical Flesch Reading Ease formula, Flesch-Kincaid Grade Level metric, keyword distribution heuristics, Google E-E-A-T signal scoring, Top-10 SERP competitor benchmarks, and Google Gemini 1.5 Flash generative rewrites.',
          },
        },
      ],
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body
        className={`${inter.variable} ${mono.variable} ${outfit.variable} bg-[#06090e] text-slate-200 min-h-screen flex flex-col font-sans antialiased selection:bg-emerald-500/30 selection:text-white`}
      >
        {children}
      </body>
    </html>
  );
}
