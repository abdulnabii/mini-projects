'use client';

import React from 'react';
import Link from 'next/link';
import { Activity, Heart, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#061019] border-t border-teal-500/20 py-8 mt-auto font-mono text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center">
              <Activity className="w-4 h-4 text-teal-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-200">
                DiabetesRisk.AI — Clinical ML Diagnostic Risk Calculator
              </p>
              <p className="text-[11px] text-slate-400 font-sans">
                Built by Abdul Nabi
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-400">
            <Link href="/" className="hover:text-teal-400 transition-colors">Diagnostic Calculator</Link>
            <Link href="/history" className="hover:text-teal-400 transition-colors">Risk Logs</Link>
            <a
              href="https://github.com/abdulnabii/mini-projects"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-teal-400 hover:underline"
            >
              <span>GitHub Repo</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        <div className="mt-6 pt-5 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400 font-sans">
          <p>© {new Date().getFullYear()} Abdul Nabi. UCI Pima Dataset • Scikit-Learn Ensemble & Gemini API.</p>
          <p className="flex items-center gap-1">
            Engineered with <Heart className="w-3.5 h-3.5 text-teal-400 fill-teal-400" /> for Healthcare AI Innovation
          </p>
        </div>
      </div>
    </footer>
  );
}
