import type { Metadata } from 'next';
import { Inter, JetBrains_Mono, Outfit } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const metadata: Metadata = {
  title: 'CareerFlow.AI — AI Job Application Pipeline & Career Intelligence Studio',
  description:
    'Interactive 7-stage Kanban job application tracker with instant AI resume-to-job description match scoring, missing skill gap analysis, tailored cover letter generation, and interview question predictor.',
  keywords: [
    'job application tracker',
    'AI resume matcher',
    'kanban job search',
    'interview question predictor',
    'AI cover letter generator',
    'career pipeline',
  ],
  authors: [{ name: 'Abdul Nabi', url: 'https://github.com/abdulnabii' }],
  openGraph: {
    title: 'CareerFlow.AI — AI Job Application Pipeline & Career Intelligence Studio',
    description: 'Track job applications, match resumes, generate cover letters, and prepare for interviews with AI.',
    url: 'https://day-17-job-application-tracker.vercel.app',
    siteName: 'CareerFlow AI',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${mono.variable} ${outfit.variable} bg-[#060a12] text-slate-200 min-h-screen flex flex-col font-sans antialiased selection:bg-emerald-500/30 selection:text-white`}
      >
        {children}
      </body>
    </html>
  );
}
