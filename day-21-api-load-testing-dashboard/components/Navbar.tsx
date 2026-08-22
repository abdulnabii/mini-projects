'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Zap, History, Play, Sparkles } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 bg-[#060e14]/90 backdrop-blur-md border-b border-cyan-500/20 font-mono text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-400 via-teal-500 to-indigo-500 flex items-center justify-center text-black shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <Zap className="w-5 h-5 fill-black font-black" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black tracking-tight text-white font-outfit">
                LoadPulse<span className="text-cyan-400">.AI</span>
              </span>
              <span className="rounded-full bg-cyan-500/10 px-2 py-0.5 text-[9px] font-bold text-cyan-300 border border-cyan-500/30">
                PRO
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono">API Load Testing &amp; SRE Diagnostics</p>
          </div>
        </Link>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <Link
            href="/history"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all ${
              pathname === '/history'
                ? 'bg-cyan-500 text-black font-bold border-cyan-400 shadow-md'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:border-cyan-500/40'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Test History</span>
          </Link>

          <a
            href="https://github.com/abdulnabii/mini-projects"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-xl bg-slate-900 border border-slate-800 px-3.5 py-1.5 text-xs font-bold text-slate-200 hover:border-cyan-500/50 hover:text-white transition-all"
          >
            <svg className="w-4 h-4 fill-cyan-400" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12z" />
            </svg>
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </div>
      </div>
    </header>
  );
}
