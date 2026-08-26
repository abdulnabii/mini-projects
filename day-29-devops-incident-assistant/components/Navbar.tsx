'use client';

import { Activity, ShieldAlert, Terminal, GitBranch, Radio } from 'lucide-react';
import Link from 'next/link';

interface Props {
  activeSeverity: 'P1' | 'P2' | 'P3' | 'P4';
  serviceName: string;
}

export default function Navbar({ activeSeverity, serviceName }: Props) {
  const getSeverityBadge = () => {
    switch (activeSeverity) {
      case 'P1':
        return 'bg-rose-500/10 border-rose-500/30 text-rose-400';
      case 'P2':
        return 'bg-amber-500/10 border-amber-500/30 text-amber-400';
      case 'P3':
        return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300';
      default:
        return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400';
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-rose-500/20 bg-[#060e14]/95 backdrop-blur-md font-mono text-xs">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand Identity */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 via-amber-500 to-emerald-500 text-black shadow-md shadow-rose-500/20 group-hover:scale-105 transition-all">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base sm:text-lg font-bold tracking-tight text-white font-mono">
                OpsPulse<span className="text-rose-500">.AI</span>
              </span>
              <span className="rounded-md bg-rose-500/10 px-1.5 py-0.5 text-[9px] font-bold text-rose-400 border border-rose-500/30 font-mono">
                SRE COMMAND
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono hidden sm:block">
              AI DevOps Incident Response &amp; Autonomous Triage Terminal
            </p>
          </div>
        </Link>

        {/* Live Status Indicator */}
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border font-bold text-xs ${getSeverityBadge()}`}>
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping shrink-0" />
            <span>INCIDENT ACTIVE: {activeSeverity} ({serviceName})</span>
          </div>

          <a
            href="https://github.com/abdulnabii/mini-projects"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:flex items-center gap-1.5 rounded-lg bg-[#0d1117] border border-slate-800 px-3 py-1.5 text-xs font-mono font-medium text-slate-300 hover:border-rose-500/50 hover:text-white transition-all"
          >
            <svg className="w-3.5 h-3.5 fill-rose-500" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <span>GitHub</span>
          </a>
        </div>
      </div>
    </header>
  );
}
