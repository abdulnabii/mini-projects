'use client';

import { Activity, Heart, ShieldAlert, Terminal } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-[#04080e] py-8 text-center font-mono text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-4 space-y-3">
        <div className="flex items-center justify-center gap-2 text-slate-400">
          <Activity className="w-4 h-4 text-rose-500" />
          <span className="text-white font-bold font-mono">OpsPulse.AI</span>
          <span>•</span>
          <span>AI DevOps Incident Response &amp; SRE Autonomous Triage Terminal</span>
        </div>

        <p className="text-[11px] text-slate-500 max-w-xl mx-auto leading-relaxed prose-text">
          Real-time log ingestion, P1-P4 severity triage, deployment correlation radar, executable CLI runbooks, and automated 5-Whys post-mortems powered by Gemini 1.5 Flash.
        </p>

        <div className="pt-2 flex items-center justify-center gap-1 text-[11px] text-slate-400">
          <span>Built with</span>
          <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 inline" />
          <span>by</span>
          <a
            href="https://github.com/abdulnabii"
            target="_blank"
            rel="noreferrer"
            className="text-rose-400 hover:text-rose-300 font-bold underline transition-colors font-mono"
          >
            Abdul Nabi
          </a>
        </div>
      </div>
    </footer>
  );
}
