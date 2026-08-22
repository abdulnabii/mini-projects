'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Zap,
  Activity,
  Play,
  History,
  FileCode2,
  Sparkles,
  Terminal,
  ShieldCheck,
  Server,
} from 'lucide-react';

const NAV_LINKS = [
  { href: '/', label: 'Load Studio', icon: Zap },
  { href: '/history', label: 'Test History', icon: History },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <div className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 pt-3 pointer-events-none font-sans">
      <header className="max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6 py-2.5 bg-[#080d1a]/90 backdrop-blur-2xl border border-cyan-500/30 rounded-full shadow-2xl shadow-black/80 pointer-events-auto transition-all">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-violet-600 flex items-center justify-center shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform text-white">
            <Zap className="w-4 h-4" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-black text-base text-white tracking-tight font-outfit">
              LoadPulse<span className="text-cyan-400">.AI</span>
            </span>
            <span className="px-1.5 py-0.2 rounded-md bg-cyan-500/20 text-cyan-300 font-mono text-[8px] font-bold border border-cyan-500/30">
              k6 SRE
            </span>
          </div>
        </Link>

        {/* Center Nav Links */}
        <nav className="flex items-center gap-1 p-1 rounded-full bg-slate-950/80 border border-white/5">
          {NAV_LINKS.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Live Engine Status */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/80 border border-emerald-500/30 text-[10px] font-mono font-bold text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>Engine Ready</span>
          </div>

          <Link
            href="/"
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-extrabold text-xs shadow-md shadow-cyan-500/20 hover:scale-105 transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-black" />
            <span>New Test</span>
          </Link>
        </div>
      </header>
    </div>
  );
}
