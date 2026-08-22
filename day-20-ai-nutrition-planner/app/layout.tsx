import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const metadata: Metadata = {
  title: 'NutriGenius.AI — Precision Vision Nutrition & AI Meal Intelligence',
  description:
    'Snap any meal photo for instant macronutrient & caloric breakdown. Get personalized 7-day performance meal plans powered by Gemini AI.',
  keywords: 'AI nutrition planner, macro tracker, food vision recognition, calorie counter, meal plans, health longevity',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} dark`}>
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
