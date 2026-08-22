'use client';

import Link from 'next/link';
import { Zap, ShieldCheck, Terminal } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.08] bg-[#040812] py-12 px-6 text-xs text-slate-500 font-sans">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        {/* Brand statement */}
        <div className="space-y-1">
          <div className="flex items-center justify-center md:justify-start gap-2 text-white font-bold text-sm font-outfit">
            <div className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Zap className="w-3.5 h-3.5" />
            </div>
            <span>LoadPulse.AI</span>
          </div>
          <p className="text-slate-400 text-xs">
            High-Concurrency API Load Studio &amp; AI Performance Diagnostics
          </p>
        </div>

        {/* Attribution Notice */}
        <div className="text-slate-400 space-y-1">
          <p>
            Built by{' '}
            <a
              href="https://github.com/abdulnabii"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-cyan-300 font-bold underline transition-colors"
            >
              Abdul Nabi
            </a>
          </p>
          <p className="text-[11px] text-slate-500">
            Powered by Gemini 1.5 Flash Performance Architecture &amp; k6 Load Engine
          </p>
        </div>

        {/* Technical Notice */}
        <div className="max-w-xs text-[10px] text-slate-500 text-center md:text-right">
          Ensure you own or have explicit authorization to load test any target host endpoints.
        </div>
      </div>
    </footer>
  );
}
