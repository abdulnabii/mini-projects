import type { Metadata } from 'next';
import { Inter, Fira_Code } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const firaCode = Fira_Code({ subsets: ['latin'], variable: '--font-fira-code' });

export const metadata: Metadata = {
  title: 'DiabetesRisk.AI — Clinical ML Diabetes Risk Calculator & SHAP Explainer',
  description:
    'Calculate Type 2 Diabetes onset probability from clinical vitals using a trained Random Forest & XGBoost ensemble model (94% accuracy). Features SHAP feature importance analysis and personalized AI lifestyle guidance.',
  keywords: ['diabetes risk calculator', 'healthcare AI', 'SHAP feature importance', 'machine learning medical diagnostic', 'Pima dataset ML'],
  authors: [{ name: 'Abdul Nabi', url: 'https://github.com/abdulnabii' }],
  openGraph: {
    title: 'DiabetesRisk.AI — Clinical ML Diabetes Risk Calculator & SHAP Explainer',
    description: 'Clinical ML diabetes risk predictor with SHAP factor analysis.',
    url: 'https://diabetes-risk-predictor.vercel.app',
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
      <body className={`${inter.variable} ${firaCode.variable} bg-[#050b12] text-slate-100 min-h-screen flex flex-col`}>
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
