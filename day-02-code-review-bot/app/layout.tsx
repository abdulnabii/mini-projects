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
      <body className={`${inter.variable} bg-slate-950 text-slate-100 min-h-screen flex flex-col`}>
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
