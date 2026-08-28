import type { Metadata } from 'next';
import { Inter, JetBrains_Mono, Outfit } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const jetBrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const metadata: Metadata = {
  title: 'MedVision.AI — Medical Image Classifier & GradCAM Heatmap Overlay',
  description: 'Browser-native AI diagnostic education tool. Classify chest X-rays (Pneumonia) and skin lesions (Melanoma) with GradCAM activation heatmaps.',
  keywords: ['medical AI classifier', 'GradCAM heatmap', 'radiology AI simulator', 'chest X-ray pneumonia classifier', 'dermatology melanoma AI'],
  authors: [{ name: 'Abdul Nabi', url: 'https://github.com/abdulnabii' }],
  openGraph: {
    title: 'MedVision.AI — Medical Image Classifier & GradCAM Heatmap Overlay',
    description: 'Classify chest X-rays and skin lesions with client-side inference and GradCAM explainability colormaps.',
    url: 'https://day-11-medical-image-classifier.vercel.app',
    siteName: 'MedVision AI',
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
      "@id": "https://day-11-medical-image-classifier.vercel.app/#webapp",
      "name": "RadVision.AI",
      "url": "https://day-11-medical-image-classifier.vercel.app",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "All",
      "description": "Clinical diagnostic assistant analyzing radiographic scans with simulated GradCAM class activation heatmap overlays, confidence metrics, and radiological differential findings.",
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
      "@id": "https://day-11-medical-image-classifier.vercel.app/#website",
      "url": "https://day-11-medical-image-classifier.vercel.app",
      "name": "RadVision.AI",
      "publisher": {
        "@type": "Person",
        "name": "Abdul Nabi",
        "url": "https://github.com/abdulnabii"
      }
    },
    {
      "@type": "FAQPage",
      "@id": "https://day-11-medical-image-classifier.vercel.app/#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is GradCAM in medical imaging?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "GradCAM (Gradient-weighted Class Activation Mapping) produces visual heatmaps highlighting the exact regions of an X-ray or MRI that influenced the AI model diagnostic classification."
          }
        }
      ]
    }
  ]
}` }}
        />
      </head>
      <body className={`${inter.variable} ${jetBrainsMono.variable} ${outfit.variable} bg-[#080c14] text-slate-200 min-h-screen flex flex-col font-sans antialiased selection:bg-cyan-500/30 selection:text-white`}>
        {children}
      </body>
    </html>
  );
}
