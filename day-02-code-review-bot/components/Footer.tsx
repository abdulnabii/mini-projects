'use client';

import React from 'react';
import Link from 'next/link';
import { Terminal, Heart, ExternalLink, Cpu } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#090d16] border-t border-emerald-500/20 py-8 mt-auto font-mono text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center">
              <Terminal className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-zinc-200">
                CodeReview.AI — Cyber-Security Static Analyzer
              </p>
              <p className="text-[11px] text-zinc-500">
                Built by Abdul Nabi
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-zinc-400">
            <Link href="/" className="hover:text-emerald-400 transition-colors">Workspace</Link>
            <Link href="/history" className="hover:text-emerald-400 transition-colors">Review Logs</Link>
            <a
              href="https://github.com/abdulnabii/mini-projects"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-purple-400 hover:underline"
            >
              <span>GitHub Repo</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        <div className="mt-6 pt-5 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500">
          <p>© {new Date().getFullYear()} Abdul Nabi. Built with Next.js 14 & Google Gemini 1.5 Pro.</p>
          <p className="flex items-center gap-1">
            Engineered with <Heart className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" /> for AI Dev Tools
          </p>
        </div>
      </div>
    </footer>
  );
}
