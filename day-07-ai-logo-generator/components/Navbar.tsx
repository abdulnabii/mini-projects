'use client';

import Link from 'next/link';
import { Palette, Sparkles, FolderHeart } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 bg-[#0a0d14]/95 backdrop-blur border-b border-amber-500/20">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-rose-500 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <Palette className="w-5 h-5 text-black" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-white font-outfit">
              BrandCrafter<span className="text-amber-400">.AI</span>
            </span>
            <span className="block text-[10px] text-slate-400 font-mono tracking-wider">
              AI Brand Identity & Logo System
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Brand Studio</span>
          </div>
        </div>
      </div>
    </header>
  );
}
