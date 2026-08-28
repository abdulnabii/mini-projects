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
      
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: `{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": "https://day-10-ai-email-composer.vercel.app/#webapp",
      "name": "MailCraft.AI",
      "url": "https://day-10-ai-email-composer.vercel.app",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "All",
      "description": "High-converting email synthesizer with tone adjustment (Executive, Cold Outreach, Urgent), open-rate predictive scoring, and subject line A/B testing variations.",
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
      "@id": "https://day-10-ai-email-composer.vercel.app/#website",
      "url": "https://day-10-ai-email-composer.vercel.app",
      "name": "MailCraft.AI",
      "publisher": {
        "@type": "Person",
        "name": "Abdul Nabi",
        "url": "https://github.com/abdulnabii"
      }
    },
    {
      "@type": "FAQPage",
      "@id": "https://day-10-ai-email-composer.vercel.app/#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How does MailCraft.AI predict email open rates?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "MailCraft.AI assesses subject line character length, spam trigger keywords, curiosity gap triggers, and sentiment strength against marketing benchmarks."
          }
        }
      ]
    }
  ]
}` }}
        />
      </head>
      <body className={`${inter.variable} ${jetBrainsMono.variable} ${outfit.variable} bg-[#080c14] text-slate-200 min-h-screen flex flex-col font-sans antialiased selection:bg-indigo-500/30 selection:text-white`}>
        {children}
      </body>
    </html>
  );
}
