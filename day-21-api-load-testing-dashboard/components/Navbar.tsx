'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Zap,
  Activity,
  Play,
  History,
  Sparkles,
  Server,
  ShieldCheck,
  Plus,
} from 'lucide-react';

const NAV_LINKS = [
  { href: '/', label: 'Load Studio', icon: Zap },
  { href: '/history', label: 'Test History', icon: History },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full h-16 bg-[#030712]/95 backdrop-blur-2xl border-b border-white/[0.08] shadow-2xl font-sans">
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform text-white">
            <Zap className="w-5 h-5" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-black text-lg text-white tracking-tight font-outfit">
              LoadPulse<span className="text-cyan-400">.AI</span>
            </span>
            <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 font-mono text-[9px] font-bold border border-cyan-500/30">
              k6 SRE
            </span>
          </div>
        </Link>

        {/* Center Nav Tabs */}
        <nav className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950/80 border border-white/5">
          {NAV_LINKS.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-emerald-500/30 text-[11px] font-mono font-bold text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Engine Ready</span>
          </div>

          <Link
            href="/"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-black font-extrabold text-xs shadow-lg shadow-cyan-500/20 hover:scale-105 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span className="hidden sm:inline">New Benchmark</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
