'use client';

import Link from 'next/link';
import { Flame, Sparkles, Heart, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-[#04080e] py-12 px-6 text-xs text-slate-500 font-sans">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        {/* Brand statement */}
        <div className="space-y-1">
          <div className="flex items-center justify-center md:justify-start gap-2 text-white font-bold text-sm">
            <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Flame className="w-3.5 h-3.5" />
            </div>
            <span>NutriGenius.AI</span>
          </div>
          <p className="text-slate-400 text-xs">
            Precision Vision Nutrition &amp; Longevity Architecture
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
              className="text-emerald-400 hover:text-emerald-300 font-bold underline transition-colors"
            >
              Abdul Nabi
            </a>
          </p>
          <p className="text-[11px] text-slate-500">
            Powered by Gemini 1.5 Flash Vision &amp; Clinical Sports Dietitian Intelligence
          </p>
        </div>

        {/* Disclaimer */}
        <div className="max-w-xs text-[10px] text-slate-500 text-center md:text-right">
          For wellness, athletic tracking, and dietary educational purposes. Consult a licensed healthcare provider for medical advice.
        </div>
      </div>
    </footer>
  );
}
