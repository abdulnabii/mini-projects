'use client';

import { Flame, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-[#05070a] text-slate-400 font-mono text-xs py-8 mt-auto">
      <div className="mx-auto flex max-w-7xl flex-col sm:flex-row items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-2">
          <Flame className="h-4 w-4 fill-orange-500 text-orange-500" />
          <span className="font-bold text-slate-200">PortfolioRoaster.AI</span>
          <span className="text-slate-600">|</span>
          <span>Brutally Honest AI Portfolio Review &amp; ATS Optimization</span>
        </div>

        <div className="flex items-center gap-1.5 text-slate-400">
          <span>Built with</span>
          <Heart className="h-3.5 w-3.5 fill-orange-500 text-orange-500" />
          <span>by</span>
          <a
            href="https://github.com/abdulnabii"
            target="_blank"
            rel="noreferrer"
            className="font-bold text-orange-400 hover:underline"
          >
            Abdul Nabi
          </a>
        </div>
      </div>
    </footer>
  );
}
