'use client';

import Link from 'next/link';
import { BrainCircuit, Clock, Sparkles } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="border-b border-purple-500/20 bg-[#080c14]/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Identity */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="p-2.5 rounded-2xl bg-gradient-to-br from-purple-500 via-violet-600 to-indigo-600 text-white shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-all">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-white text-lg tracking-tight font-outfit">
                MeetingMind<span className="text-purple-400">.AI</span>
              </span>
              <span className="rounded-full bg-purple-500/10 px-2 py-0.5 text-[9px] font-bold text-purple-300 border border-purple-500/30 font-mono">
                ENTERPRISE
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono">AI-Powered Meeting Intelligence &amp; Action Plan Extractor</p>
          </div>
        </Link>

        {/* Action Controls & GitHub */}
        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 font-bold">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Gemini 1.5 Flash Verified</span>
          </div>

          <Link
            href="/history"
            className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white transition-colors px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-purple-500/40"
          >
            <Clock className="w-3.5 h-3.5 text-purple-400" />
            <span>History</span>
          </Link>

          <a
            href="https://github.com/abdulnabii/mini-projects"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-xl bg-slate-900 border border-slate-800 px-3.5 py-1.5 text-xs font-bold text-slate-200 hover:border-purple-500/50 hover:text-white transition-all"
          >
            <svg className="w-4 h-4 fill-purple-400" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12z" />
            </svg>
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </div>
      </div>
    </header>
  );
}
