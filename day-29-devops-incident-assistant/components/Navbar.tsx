'use client';

import { Activity, ShieldAlert, Terminal, GitBranch, Radio, ExternalLink, Cpu, Clock } from 'lucide-react';
import Link from 'next/link';

interface Props {
  activeSeverity: 'P1' | 'P2' | 'P3' | 'P4';
  serviceName: string;
  incidentId: string;
}

export default function Navbar({ activeSeverity, serviceName, incidentId }: Props) {
  const getSeverityStyle = () => {
    switch (activeSeverity) {
      case 'P1':
        return 'bg-rose-500 text-black border-rose-400 font-extrabold';
      case 'P2':
        return 'bg-amber-500 text-black border-amber-400 font-extrabold';
      case 'P3':
        return 'bg-yellow-500 text-black border-yellow-400 font-bold';
      default:
        return 'bg-emerald-500 text-black border-emerald-400 font-bold';
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#06090e]/90 backdrop-blur-xl font-mono text-xs">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:px-6">
        {/* Brand Lockup */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-rose-500 via-rose-600 to-amber-600 text-white shadow-lg shadow-rose-500/25 group-hover:scale-105 transition-transform">
              <Activity className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold tracking-tight text-white font-mono">
                OpsPulse<span className="text-rose-500">.AI</span>
              </span>
              <span className="hidden sm:inline-block px-1.5 py-0.2 rounded bg-white/[0.06] border border-white/[0.1] text-[9px] text-slate-400 font-bold">
                ENTERPRISE SRE
              </span>
            </div>
          </Link>

          <span className="text-slate-700 hidden md:inline">|</span>

          {/* Active Incident Beacon */}
          <div className="hidden md:flex items-center gap-2 text-[11px] text-slate-300">
            <span className={`px-2 py-0.5 rounded text-[10px] ${getSeverityStyle()}`}>
              {activeSeverity}
            </span>
            <span className="font-bold text-white uppercase">{incidentId}: {serviceName}</span>
            <span className="flex items-center gap-1 text-[10px] text-rose-400 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
              TRIAGE IN PROGRESS
            </span>
          </div>
        </div>

        {/* Right Status Meta */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#0d121d] border border-white/[0.08] text-[10px] text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>PagerDuty / Datadog Sync: <strong className="text-slate-200">Active</strong></span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#0d121d] border border-white/[0.08] text-[10px] text-slate-300">
            <Cpu className="w-3 h-3 text-rose-400" />
            <span>IC: <strong className="text-white">Abdul Nabi</strong></span>
          </div>

          <a
            href="https://github.com/abdulnabii/mini-projects"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 rounded-md bg-[#0d121d] border border-white/[0.08] hover:border-rose-500/40 px-2.5 py-1 text-[11px] font-mono text-slate-300 hover:text-white transition-all cursor-pointer"
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
