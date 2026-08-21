'use client';

import Link from 'next/link';
import { Heart, Sparkles, Wind, TrendingUp, Download, BookOpen, ShieldCheck, Lock } from 'lucide-react';

interface Props {
  onOpenBreathing: () => void;
  onOpenExport: () => void;
  streakCount: number;
}

export default function Navbar({ onOpenBreathing, onOpenExport, streakCount }: Props) {
  return (
    <header className="sticky top-0 z-50 border-b border-emerald-500/20 bg-[#060a12]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6">
        {/* Brand Identity */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 via-teal-500 to-indigo-600 text-black shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-all">
            <Heart className="h-5.5 w-5.5 text-black fill-black" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight text-white font-outfit">
                MindSanctuary<span className="text-emerald-400">.AI</span>
              </span>
              <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30 font-mono flex items-center gap-1">
                <Lock className="w-2.5 h-2.5" />
                PRIVATE &amp; ENCRYPTED CBT COMPANION
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Empathetic AI Reflection, Cognitive Wellness &amp; Mood Tracking
            </p>
          </div>
        </Link>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 font-mono text-xs">
          <button
            type="button"
            onClick={onOpenBreathing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-teal-300 hover:text-white hover:border-teal-500/50 transition-all font-bold cursor-pointer"
          >
            <Wind className="w-3.5 h-3.5 text-teal-400" />
            <span className="hidden sm:inline">Breathwork Studio</span>
          </button>

          <Link
            href="/timeline"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-emerald-500/40 transition-all font-bold"
          >
            <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Mood Timeline</span>
          </Link>

          <button
            type="button"
            onClick={onOpenExport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-all font-bold cursor-pointer"
            title="Export Private Journal Archive"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Export</span>
          </button>
        </div>
      </div>
    </header>
  );
}
