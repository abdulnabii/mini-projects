'use client';

import { Mail, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-[#060a12] text-slate-400 font-mono text-xs py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-indigo-400" />
          <span className="font-bold text-slate-200">MailCraft.AI</span>
          <span className="text-slate-600">|</span>
          <span>AI Cold Email Copywriter &amp; Subject Line Optimizer</span>
        </div>

        <div className="flex items-center gap-1.5 text-slate-400">
          <span>Built with</span>
          <Heart className="h-3.5 w-3.5 fill-indigo-500 text-indigo-500" />
          <span>by</span>
          <a
            href="https://github.com/abdulnabii"
            target="_blank"
            rel="noreferrer"
            className="font-bold text-indigo-400 hover:underline"
          >
            Abdul Nabi
          </a>
        </div>
      </div>
    </footer>
  );
}
