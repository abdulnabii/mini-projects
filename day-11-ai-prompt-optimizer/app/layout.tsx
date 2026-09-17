import type { Metadata } from 'next';
import { Inter, JetBrains_Mono, Outfit } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

const baseUrl = 'https://day-11-ai-prompt-optimizer.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'PromptCraft.AI — Advanced AI Prompt Engineering Terminal',
    template: '%s | PromptCraft.AI',
  },
  description:
    'Production-grade AI prompt optimization engine. Transforms unstructured prompts into structured, model-tuned system instructions for Gemini, Claude, and GPT-4.',
  keywords: [
    'AI prompt optimizer',
    'prompt engineering',
    'system prompt builder',
    'Claude 3.5 prompts',
    'Gemini 1.5 prompts',
    'few-shot prompt generator',
    'prompt evaluation score',
  ],
  authors: [{ name: 'Abdul Nabi', url: 'https://github.com/abdulnabii' }],
  creator: 'Abdul Nabi',
  publisher: 'Abdul Nabi',
  category: 'Technology',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'PromptCraft.AI — Advanced AI Prompt Engineering Terminal',
    description:
      'Model-specific prompt optimization, quality scorecards, variable extraction, and live execution sandboxes.',
    url: baseUrl,
    siteName: 'PromptCraft AI',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PromptCraft.AI — Advanced AI Prompt Engineering Terminal',
    description:
      'Model-specific prompt optimization, quality scorecards, variable extraction, and live execution sandboxes.',
    creator: '@abdulnabii',
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

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      '@id': `${baseUrl}/#webapp`,
      name: 'PromptCraft.AI',
      url: baseUrl,
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'All',
      description:
        'Production-grade AI prompt optimization engine. Transforms unstructured prompts into structured, model-tuned system instructions.',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
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
      name: 'PromptCraft.AI',
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
          name: 'What is PromptCraft.AI?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'PromptCraft.AI is an advanced AI prompt engineering terminal that analyzes, refines, and formats prompts for major LLMs including Gemini, Claude, and GPT-4.',
          },
        },
        {
          '@type': 'Question',
          name: 'How does prompt optimization work?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'The engine evaluates structural components like role definition, task specification, constraints, and few-shot examples to maximize response quality and reduce hallucinations.',
          },
        },
      ],
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.variable} ${outfit.variable} ${mono.variable} bg-[#080b11] text-slate-200 min-h-screen flex flex-col antialiased`}>
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
