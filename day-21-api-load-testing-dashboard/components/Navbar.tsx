'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Zap,
  Activity,
  History,
  Sparkles,
  Server,
  Play,
  FileCode,
  ShieldCheck,
  Globe,
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-cyan-500/20 bg-[#060a12]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6">
        {/* Brand Identity */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-teal-500 to-indigo-600 text-black shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-all">
            <Zap className="h-5.5 w-5.5 text-black fill-black" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight text-white font-outfit">
                LoadPulse<span className="text-cyan-400">.AI</span>
              </span>
              <span className="rounded-full bg-cyan-500/10 px-2.5 py-0.5 text-[10px] font-bold text-cyan-400 border border-cyan-500/30 font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                HIGH-CONCURRENCY API LOAD STUDIO
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono hidden sm:block">
              Real-Time Throughput RPS, Percentile Telemetry &amp; Gemini 1.5 SRE Diagnostics
            </p>
          </div>
        </Link>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 font-mono text-xs">
          <Link
            href="/history"
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border transition-all font-bold ${
              pathname === '/history'
                ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 shadow-sm'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:border-cyan-500/40'
            }`}
          >
            <History className="w-3.5 h-3.5 text-cyan-400" />
            <span>Test History</span>
          </Link>

          <Link
            href="/"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-extrabold shadow-md shadow-cyan-500/20 hover:scale-105 transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-black" />
            <span className="hidden sm:inline">New Benchmark</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
