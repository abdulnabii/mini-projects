'use client';

import Link from 'next/link';
import { TrendingUp, ExternalLink, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#080c10] border-t border-green-500/10 py-5 mt-auto font-mono text-xs">
      <div className="max-w-screen-2xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-slate-500">
          <TrendingUp className="w-3.5 h-3.5 text-green-500" />
          <span>StockPulse.AI — Prices are simulated for demonstration purposes only.</span>
        </div>
        <div className="flex items-center gap-4 text-slate-500">
          <Link href="/" className="hover:text-green-400 transition-colors">Terminal</Link>
          <Link href="/portfolio" className="hover:text-green-400 transition-colors">Portfolio</Link>
          <a href="https://github.com/abdulnabii/mini-projects" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1 text-green-500 hover:underline">
            <span>GitHub</span><ExternalLink className="w-3 h-3" />
          </a>
          <span className="flex items-center gap-1">Built by Abdul Nabi <Heart className="w-3 h-3 text-green-500 fill-green-500" /></span>
        </div>
      </div>
    </footer>
  );
}
