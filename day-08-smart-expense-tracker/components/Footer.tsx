'use client';

import { Wallet, Heart, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#060e0e] border-t border-emerald-500/10 py-6 mt-auto font-mono text-xs">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-slate-400">
          <Wallet className="w-4 h-4 text-emerald-400" />
          <span>ExpenseMind.AI — Smart Expense Diary &amp; AI Financial Advisory</span>
        </div>
        <div className="flex items-center gap-5 text-slate-400">
          <a
            href="https://github.com/abdulnabii/mini-projects"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-emerald-400 hover:underline"
          >
            <span>GitHub</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <span className="flex items-center gap-1">
            Built by Abdul Nabi <Heart className="w-3 h-3 text-emerald-400 fill-emerald-400" />
          </span>
        </div>
      </div>
    </footer>
  );
}
