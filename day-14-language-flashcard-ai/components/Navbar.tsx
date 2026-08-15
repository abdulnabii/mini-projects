'use client';

import { Sparkles, Flame, Zap, Award } from 'lucide-react';
import Link from 'next/link';

interface Props {
  streak: number;
  xp: number;
  level: number;
}

export default function Navbar({ streak, xp, level }: Props) {
  return (
    <header className="sticky top-0 z-40 border-b border-emerald-500/20 bg-[#0b0f19]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6">
        {/* Brand Identity */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 via-teal-500 to-indigo-600 text-black shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-all">
            <Sparkles className="h-5.5 w-5.5 font-bold" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight text-white font-outfit">
                LingoPulse<span className="text-emerald-400">.AI</span>
              </span>
              <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30 font-mono">
                SM-2 SPACED REPETITION
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">AI Language Mastery &amp; Spaced Repetition Engine</p>
          </div>
        </Link>

        {/* Gamification Quick Stats & GitHub */}
        <div className="flex items-center gap-3 font-mono text-xs">
          {/* Streak Counter */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold">
            <Flame className="w-4 h-4 fill-amber-400 text-amber-400 animate-pulse" />
            <span>{streak} Day Streak</span>
          </div>

          {/* XP Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-bold">
            <Zap className="w-4 h-4 fill-indigo-400 text-indigo-400" />
            <span>{xp} XP</span>
          </div>

          {/* Level Badge */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold">
            <Award className="w-4 h-4" />
            <span>Level {level}</span>
          </div>

          {/* GitHub Repo */}
          <a
            href="https://github.com/abdulnabii/mini-projects"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-xl bg-slate-900 border border-slate-800 px-3.5 py-1.5 text-xs font-bold text-slate-200 hover:border-emerald-500/50 hover:text-white transition-all"
          >
            <svg className="w-4 h-4 fill-emerald-400" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12z" />
            </svg>
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </div>
      </div>
    </header>
  );
}
