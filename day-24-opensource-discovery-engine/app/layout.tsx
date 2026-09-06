import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const metadata: Metadata = {
  title: 'GitMatch.AI — Open Source Project Discovery & AI First-Contribution Matchmaker',
  description:
    'Find open-source repositories matching your tech stack. Measure project health scores, browse good-first-issues, and generate step-by-step first PR guides powered by Gemini AI.',
  keywords: 'open source discovery, first pr guide, good first issue finder, github project health, developer tools, AI contributor matchmaker',
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
      "@id": "https://day-24-opensource-discovery-engine.vercel.app/#webapp",
      "name": "GitMatch.AI",
      "url": "https://day-24-opensource-discovery-engine.vercel.app",
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "All",
      "description": "AI-powered open source project discovery engine matching developer tech stacks with healthy repositories, good-first-issues, and personalized first PR guides.",
      "featureList": [
        "Skill-based open source repository matching",
        "0-100 composite repository health score audit",
        "AI First-Contribution PR Guide generator powered by Gemini 1.5 Flash",
        "Live GitHub repository inspector (REST API v3)",
        "AI Issue Solver & PR Drafter Studio",
        "Personal PR Contribution Kanban Pipeline"
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
      "@id": "https://day-24-opensource-discovery-engine.vercel.app/#website",
      "url": "https://day-24-opensource-discovery-engine.vercel.app",
      "name": "GitMatch.AI",
      "publisher": {
        "@type": "Person",
        "name": "Abdul Nabi",
        "url": "https://github.com/abdulnabii"
      }
    },
    {
      "@type": "FAQPage",
      "@id": "https://day-24-opensource-discovery-engine.vercel.app/#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How does GitMatch.AI calculate the Open Source Project Health Score?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "GitMatch.AI computes a composite 0–100 health score evaluating five vital dimensions: maintenance recency, maintainer responsiveness, issue resolution velocity, documentation completeness, and community bus factor distribution."
          }
        },
        {
          "@type": "Question",
          "name": "What is the First PR Guide generator and how is it customized to my skills?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The First PR Guide uses Google Gemini 1.5 Flash to analyze the target repository's architecture, conventions, and contributing guidelines against your selected tech stack, generating an actionable onboarding roadmap."
          }
        },
        {
          "@type": "Question",
          "name": "Can I audit any GitHub repository that is not in the curated list?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. The Audit Any GitHub Repo tool connects directly to the GitHub REST API v3 to inspect real-time star velocity, open good-first-issues, license details, and maintainer turnaround in seconds."
          }
        },
        {
          "@type": "Question",
          "name": "What is the Bus Factor metric in open-source projects?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The Bus Factor calculates the minimum number of core maintainers whose absence would cause a repository to stall, helping first-time contributors identify healthy, well-mentored projects."
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
