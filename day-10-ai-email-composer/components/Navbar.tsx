'use client';

import Link from 'next/link';
import { Mail, Sparkles, Send } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 bg-[#0b0f19]/95 backdrop-blur border-b border-indigo-500/20">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Mail className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-white font-mono">
              EmailPulse<span className="text-indigo-400">.AI</span>
            </span>
            <span className="block text-[10px] text-slate-400 font-mono tracking-wider">
              AI Writing Assistant &amp; Subject Line Optimizer
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3 font-mono">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>A/B Variant Engine Active</span>
          </div>
        </div>
      </div>
    </header>
  );
}
