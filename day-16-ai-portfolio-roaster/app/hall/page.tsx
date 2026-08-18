'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HallGallery from '@/components/HallGallery';
import Link from 'next/link';
import { Flame, ArrowLeft } from 'lucide-react';

export default function HallPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#080a0f] text-slate-200">
      <Navbar />

      <main className="flex-1 space-y-8 py-8 px-4 sm:px-6 max-w-7xl mx-auto w-full font-mono">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white hover:border-orange-500/40 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Roaster Workbench</span>
          </Link>
        </div>

        <section className="rounded-3xl bg-[#0f1420] border border-orange-500/20 p-6 sm:p-8 shadow-2xl shadow-orange-500/10">
          <HallGallery />
        </section>
      </main>

      <Footer />
    </div>
  );
}
