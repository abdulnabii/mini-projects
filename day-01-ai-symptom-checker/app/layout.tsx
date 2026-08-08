import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DisclaimerBanner from '@/components/DisclaimerBanner';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'MediTriage AI — AI Symptom Checker & Triage Assistant',
  description:
    'Conversational AI symptom checker and WHO clinical triage assistant. Analyze symptoms, risk levels, and recommended next steps.',
  keywords: ['AI healthcare', 'symptom checker', 'medical triage', 'AI triage assistant', 'WHO triage'],
  authors: [{ name: 'Abdul Nabi', url: 'https://aiwithab.site' }],
  openGraph: {
    title: 'MediTriage AI — AI Symptom Checker',
    description: 'Conversational AI medical symptom checker and clinical triage engine.',
    url: 'https://symptom-checker.aiwithab.site',
    siteName: 'MediTriage AI',
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
      <body className={`${inter.variable} bg-slate-950 text-slate-100 min-h-screen flex flex-col`}>
        <DisclaimerBanner />
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
