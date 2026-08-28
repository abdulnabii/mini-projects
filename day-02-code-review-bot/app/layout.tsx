import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'CodeReview AI — Real-Time Automated Code Review Bot',
  description:
    'Paste any code snippet and get instant senior engineer code reviews covering security flaws, logic bugs, O(n²) performance bottlenecks, and side-by-side refactored code.',
  keywords: ['AI code review', 'security scanner', 'static analysis', 'code refactoring', 'code quality score'],
  authors: [{ name: 'Abdul Nabi', url: 'https://aiwithab.site' }],
  openGraph: {
    title: 'CodeReview AI — Real-Time Automated Code Review Bot',
    description: 'Instant senior engineer PR code review & security static analysis powered by AI.',
    url: 'https://code-review.aiwithab.site',
    siteName: 'CodeReview AI',
    locale: 'en_US',
    type: 'website',
  },
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
      "@id": "https://code-review-bot.vercel.app/#webapp",
      "name": "CodeReview.AI",
      "url": "https://code-review-bot.vercel.app",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "All",
      "description": "Autonomous multi-language code quality and security auditor providing AST syntax tree parsing, CVE vulnerability detection, performance optimization diffs, and clean code refactoring.",
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
      "@id": "https://code-review-bot.vercel.app/#website",
      "url": "https://code-review-bot.vercel.app",
      "name": "CodeReview.AI",
      "publisher": {
        "@type": "Person",
        "name": "Abdul Nabi",
        "url": "https://github.com/abdulnabii"
      }
    },
    {
      "@type": "FAQPage",
      "@id": "https://code-review-bot.vercel.app/#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is CodeReview.AI?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "CodeReview.AI is a real-time static code analysis and security auditing tool that identifies anti-patterns, memory leaks, and vulnerabilities across multiple programming languages."
          }
        },
        {
          "@type": "Question",
          "name": "Which languages are supported?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "CodeReview.AI supports TypeScript, JavaScript, Python, Rust, Go, Java, and C++ with full syntax highlighting and inline diff suggestions."
          }
        }
      ]
    }
  ]
}` }}
        />
      </head>
      <body className={`${inter.variable} bg-slate-950 text-slate-100 min-h-screen flex flex-col`}>
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
