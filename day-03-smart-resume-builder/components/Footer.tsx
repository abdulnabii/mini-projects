'use client';

import React from 'react';
import Link from 'next/link';
import { FileText, Heart, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#090d16] border-t border-indigo-500/20 py-8 mt-auto font-mono text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center">
              <FileText className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-200">
                SmartResume.AI — ATS Optimizer & STAR Resume Builder
              </p>
              <p className="text-[11px] text-slate-500 font-sans">
                Part of 30 AI Projects in 30 Days by Abdul Nabi
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-400">
            <Link href="/" className="hover:text-indigo-400 transition-colors">Resume Workspace</Link>
            <Link href="/history" className="hover:text-indigo-400 transition-colors">Saved Versions</Link>
            <a
              href="https://aiwithab.site"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-amber-400 hover:underline"
            >
              <span>aiwithab.site</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        <div className="mt-6 pt-5 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 font-sans">
          <p>© {new Date().getFullYear()} Abdul Nabi. Built with Next.js 14 & Google Gemini API.</p>
          <p className="flex items-center gap-1">
            Engineered with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for AI Productivity Tools
          </p>
        </div>
      </div>
    </footer>
  );
}
