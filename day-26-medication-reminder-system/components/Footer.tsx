'use client';

import { Heart, ShieldCheck, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-[#04080e] py-8 text-center font-mono text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-4 space-y-3">
        <div className="flex items-center justify-center gap-2 text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-white font-bold font-outfit">MediGuard.AI</span>
          <span>•</span>
          <span>AI Patient Medication Schedule &amp; Clinical Safety Guardian</span>
        </div>

        <p className="text-[11px] text-slate-500 max-w-xl mx-auto leading-relaxed">
          Disclaimer: MediGuard.AI is an AI clinical reference tool powered by Google Gemini 1.5 Flash. Always consult your licensed physician or pharmacist for medical diagnosis, drug changes, or emergency care.
        </p>

        <div className="pt-2 flex items-center justify-center gap-1 text-[11px] text-slate-400">
          <span>Built with</span>
          <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 inline" />
          <span>by</span>
          <a
            href="https://github.com/abdulnabii"
            target="_blank"
            rel="noreferrer"
            className="text-emerald-400 hover:text-emerald-300 font-bold underline transition-colors"
          >
            Abdul Nabi
          </a>
        </div>
      </div>
    </footer>
  );
}
