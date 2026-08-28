import type { Metadata } from 'next';
import { Inter, JetBrains_Mono, Outfit } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const metadata: Metadata = {
  title: 'ArchCraft.AI — AI Cloud Architecture, Cost Estimator & System Design Studio',
  description:
    'Generate production-grade multi-tier cloud architectures, itemized AWS/GCP/Azure monthly cost estimations, single point of failure (SPOF) reliability audits, and copy-ready Terraform infrastructure code.',
  keywords: [
    'cloud architecture generator',
    'system design AI',
    'AWS cost estimator',
    'Terraform code generator',
    'SPOF reliability audit',
    'cloud diagram generator',
    'GCP architecture',
    'microservices design',
  ],
  authors: [{ name: 'Abdul Nabi', url: 'https://github.com/abdulnabii' }],
  openGraph: {
    title: 'ArchCraft.AI — AI Cloud Architecture, Cost Estimator & System Design Studio',
    description: 'Transform requirements into visual cloud architecture diagrams, cost estimates, and Terraform code.',
    url: 'https://day-16-cloud-architecture-ai.vercel.app',
    siteName: 'ArchCraft AI',
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
      "@id": "https://day-16-cloud-architecture-ai.vercel.app/#webapp",
      "name": "CloudArchitect.AI",
      "url": "https://day-16-cloud-architecture-ai.vercel.app",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "All",
      "description": "Interactive cloud topology designer with automated Single Point of Failure (SPOF) security audits, multi-region high-availability recommendations, and 1-click Terraform HCL generation.",
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
      "@id": "https://day-16-cloud-architecture-ai.vercel.app/#website",
      "url": "https://day-16-cloud-architecture-ai.vercel.app",
      "name": "CloudArchitect.AI",
      "publisher": {
        "@type": "Person",
        "name": "Abdul Nabi",
        "url": "https://github.com/abdulnabii"
      }
    },
    {
      "@type": "FAQPage",
      "@id": "https://day-16-cloud-architecture-ai.vercel.app/#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Can CloudArchitect.AI generate infrastructure code?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! CloudArchitect.AI converts visual architecture diagrams directly into production-ready Terraform (IaC) and AWS CloudFormation templates."
          }
        }
      ]
    }
  ]
}` }}
        />
      </head>
      <body
        className={`${inter.variable} ${mono.variable} ${outfit.variable} bg-[#060a12] text-slate-200 min-h-screen flex flex-col font-sans antialiased selection:bg-cyan-500/30 selection:text-white`}
      >
        {children}
      </body>
    </html>
  );
}
