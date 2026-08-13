'use client';

import { Wallet, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-[#06080e] text-slate-400 font-mono text-xs py-8 mt-auto">
      <div className="mx-auto flex max-w-7xl flex-col sm:flex-row items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-2">
          <Wallet className="h-4 w-4 text-amber-400" />
          <span className="font-bold text-slate-200">WealthPulse.AI</span>
          <span className="text-slate-600">|</span>
          <span>AI Personal Finance &amp; FIRE Retirement Calculator</span>
        </div>

        <div className="flex items-center gap-1.5 text-slate-400">
          <span>Built with</span>
          <Heart className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
          <span>by</span>
          <a
            href="https://github.com/abdulnabii"
            target="_blank"
            rel="noreferrer"
            className="font-bold text-amber-400 hover:underline"
          >
            Abdul Nabi
          </a>
        </div>
      </div>
    </footer>
  );
}
