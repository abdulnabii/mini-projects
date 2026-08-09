import type { Metadata } from 'next';
import { Inter, Fira_Code } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const firaCode = Fira_Code({ subsets: ['latin'], variable: '--font-fira-code' });

export const metadata: Metadata = {
  title: 'SmartResume.AI — ATS Resume Builder & STAR Bullet Optimizer',
  description:
    'Transform your work history into an ATS-optimized, STAR-format executive resume. Real-time ATS match score, keyword gap analysis, 3 professional templates, and 1-click PDF download.',
  keywords: ['AI resume builder', 'ATS score scanner', 'STAR bullet rewriter', 'resume templates', 'executive resume optimizer'],
  authors: [{ name: 'Abdul Nabi', url: 'https://aiwithab.site' }],
  openGraph: {
    title: 'SmartResume.AI — ATS Resume Builder & STAR Bullet Optimizer',
    description: 'Build ATS-proof executive resumes in seconds with AI keyword optimization.',
    url: 'https://resume-builder.aiwithab.site',
    siteName: 'SmartResume AI',
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
      <body className={`${inter.variable} ${firaCode.variable} bg-[#0b0f19] text-slate-100 min-h-screen flex flex-col`}>
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
