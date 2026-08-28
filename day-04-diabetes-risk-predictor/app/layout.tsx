import type { Metadata } from 'next';
import { Inter, JetBrains_Mono, Outfit } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const metadata: Metadata = {
  title: 'DiabetesRisk.AI — Clinical ML Diabetes Risk Calculator & SHAP Explainer',
  description:
    'Calculate Type 2 Diabetes onset probability from clinical vitals using a trained Random Forest & XGBoost ensemble model (94% accuracy). Features SHAP feature importance analysis and personalized AI lifestyle guidance.',
  keywords: ['diabetes risk calculator', 'healthcare AI', 'SHAP feature importance', 'machine learning medical diagnostic', 'Pima dataset ML'],
  authors: [{ name: 'Abdul Nabi', url: 'https://github.com/abdulnabii' }],
  openGraph: {
    title: 'DiabetesRisk.AI — Clinical ML Diabetes Risk Calculator & SHAP Explainer',
    description: 'Clinical ML diabetes risk predictor with SHAP factor analysis.',
    url: 'https://day-04-diabetes-risk-predictor.vercel.app',
    siteName: 'DiabetesRisk AI',
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
      "@id": "https://diabetes-risk-predictor.vercel.app/#webapp",
      "name": "GlucoPredict.AI",
      "url": "https://diabetes-risk-predictor.vercel.app",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "All",
      "description": "Evidence-based clinical diabetes risk assessment tool utilizing ensemble ML models with SHAP feature importance explainability, lifestyle interventions, and metabolic biomarkers.",
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
      "@id": "https://diabetes-risk-predictor.vercel.app/#website",
      "url": "https://diabetes-risk-predictor.vercel.app",
      "name": "GlucoPredict.AI",
      "publisher": {
        "@type": "Person",
        "name": "Abdul Nabi",
        "url": "https://github.com/abdulnabii"
      }
    },
    {
      "@type": "FAQPage",
      "@id": "https://diabetes-risk-predictor.vercel.app/#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What machine learning models power GlucoPredict.AI?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "GlucoPredict.AI uses trained clinical classification algorithms paired with SHAP (SHapley Additive exPlanations) values to make predictive risk scores transparent and clinically actionable."
          }
        }
      ]
    }
  ]
}` }}
        />
      </head>
      <body className={`${inter.variable} ${mono.variable} ${outfit.variable} bg-[#061019] text-slate-100 min-h-screen flex flex-col font-sans antialiased selection:bg-teal-500/30 selection:text-white`}>
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
