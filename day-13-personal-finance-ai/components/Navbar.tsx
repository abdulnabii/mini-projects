'use client';

import { Wallet, ShieldCheck, Flame, PieChart, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-emerald-500/20 bg-[#060e14]/95 backdrop-blur-md font-mono text-xs">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand Identity */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500 text-black shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-all">
            <Wallet className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base sm:text-lg font-bold tracking-tight text-white font-mono">
                WealthPulse<span className="text-emerald-400">.AI</span>
              </span>
              <span className="rounded-md bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-bold text-emerald-300 border border-emerald-500/30 font-mono">
                FIRE PRO
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono hidden sm:block">
              AI Personal Finance &amp; Financial Independence Engine
            </p>
          </div>
        </Link>

        {/* Status badges */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 rounded-lg bg-[#0d1117] border border-slate-800 px-3 py-1.5 text-xs text-slate-300 font-mono">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>AES-256 Client Privacy</span>
          </div>

          <a
            href="https://github.com/abdulnabii/mini-projects"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 rounded-lg bg-[#0d1117] border border-slate-800 px-3 py-1.5 text-xs font-mono font-medium text-slate-300 hover:border-emerald-500/50 hover:text-white transition-all"
          >
            <svg className="w-3.5 h-3.5 fill-emerald-400" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </div>
      </div>
    </header>
  );
}
