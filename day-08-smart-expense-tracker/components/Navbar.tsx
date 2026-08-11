'use client';

import Link from 'next/link';
import { Wallet, Sparkles, TrendingUp } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 bg-[#060e0e]/95 backdrop-blur border-b border-emerald-500/20">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <Wallet className="w-5 h-5 text-black" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-white font-mono">
              ExpenseMind<span className="text-emerald-400">.AI</span>
            </span>
            <span className="block text-[10px] text-slate-400 font-mono tracking-wider">
              AI-Powered Expense &amp; Financial Intelligence
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>OCR &amp; AI Coach Active</span>
          </div>
        </div>
      </div>
    </header>
  );
}
