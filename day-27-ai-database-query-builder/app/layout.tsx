import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
});

export const metadata: Metadata = {
  title: 'QueryForge.AI — AI Database Query Builder & Visual Data Studio',
  description:
    'Translate plain English questions into production SQL queries, MongoDB aggregation pipelines, and Prisma/Drizzle ORM code with live execution sandbox and auto-charts.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
      "@id": "https://day-27-ai-database-query-builder.vercel.app/#webapp",
      "name": "QueryForge.AI",
      "url": "https://day-27-ai-database-query-builder.vercel.app",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "All",
      "description": "Natural language database copilot converting plain English prompts into optimized SQL queries, Prisma/Drizzle ORM schemas, and EXPLAIN execution plan insights.",
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
      "@id": "https://day-27-ai-database-query-builder.vercel.app/#website",
      "url": "https://day-27-ai-database-query-builder.vercel.app",
      "name": "QueryForge.AI",
      "publisher": {
        "@type": "Person",
        "name": "Abdul Nabi",
        "url": "https://github.com/abdulnabii"
      }
    },
    {
      "@type": "FAQPage",
      "@id": "https://day-27-ai-database-query-builder.vercel.app/#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Which database dialects are supported?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "QueryForge.AI supports PostgreSQL, MySQL, SQLite, MongoDB Aggregations, Prisma ORM, and Drizzle ORM syntax."
          }
        }
      ]
    }
  ]
}` }}
        />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} min-h-screen flex flex-col bg-[#060e14] text-slate-100 antialiased selection:bg-emerald-500/30 selection:text-emerald-200`}
      >
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
