'use client';

import { BrainCircuit, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-purple-500/10 bg-[#05080e] py-8 mt-auto font-mono text-xs text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <BrainCircuit className="w-4 h-4 text-purple-400" />
          <span className="font-bold text-white">MeetingMind.AI</span>
          <span className="text-slate-600">|</span>
          <span>Enterprise AI Meeting Summarizer &amp; Intelligence Extractor</span>
        </div>

        <div className="flex items-center gap-1.5 text-slate-400">
          <span>Built with</span>
          <Heart className="w-3.5 h-3.5 fill-purple-500 text-purple-500" />
          <span>by</span>
          <a
            href="https://github.com/abdulnabii"
            target="_blank"
            rel="noreferrer"
            className="font-bold text-purple-400 hover:underline"
          >
            Abdul Nabi
          </a>
        </div>
      </div>
    </footer>
  );
}
