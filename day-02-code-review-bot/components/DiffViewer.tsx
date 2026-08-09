'use client';

import React, { useState } from 'react';
import { Copy, Check, Sparkles, Terminal } from 'lucide-react';

interface DiffViewerProps {
  originalCode: string;
  fixedCode: string;
  language: string;
}

export default function DiffViewer({ originalCode, fixedCode, language }: DiffViewerProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'split' | 'fixed'>('split');

  const handleCopyFixed = () => {
    navigator.clipboard.writeText(fixedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#0d1117] border border-emerald-500/20 rounded-2xl overflow-hidden shadow-2xl space-y-0 font-mono">
      {/* Header Bar */}
      <div className="bg-[#080c14] border-b border-zinc-800 px-5 py-3.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-bold text-white">AI Refactored Code Comparison</h3>
          <span className="text-[10px] font-mono uppercase bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800">
            {language}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-[#0b0f17] p-1 rounded-xl border border-zinc-800 text-xs font-mono">
            <button
              onClick={() => setActiveTab('split')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                activeTab === 'split' ? 'bg-zinc-800 text-white font-bold' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Side-by-Side
            </button>
            <button
              onClick={() => setActiveTab('fixed')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                activeTab === 'fixed' ? 'bg-emerald-950 text-emerald-300 font-bold' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Fixed Code Only
            </button>
          </div>

          <button
            onClick={handleCopyFixed}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-purple-600 text-zinc-950 text-xs font-mono font-bold shadow-lg shadow-emerald-500/20 hover:scale-[1.02] transition-all"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Copied Code!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Corrected Code</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Display */}
      {activeTab === 'split' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-zinc-800 bg-[#0b0f17] text-xs font-mono min-h-[380px]">
          {/* Left: Original */}
          <div className="p-4 space-y-2 bg-red-950/15">
            <div className="flex items-center justify-between text-[11px] font-bold text-red-400 border-b border-red-900/40 pb-2">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500" /> Original Code (With Issues)
              </span>
            </div>
            <pre className="overflow-x-auto text-red-200/80 leading-relaxed whitespace-pre-wrap">
              {originalCode}
            </pre>
          </div>

          {/* Right: AI Fixed Code */}
          <div className="p-4 space-y-2 bg-emerald-950/15">
            <div className="flex items-center justify-between text-[11px] font-bold text-emerald-400 border-b border-emerald-900/40 pb-2">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> AI Clean Refactored Code
              </span>
            </div>
            <pre className="overflow-x-auto text-emerald-200/90 leading-relaxed whitespace-pre-wrap">
              {fixedCode}
            </pre>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-[#0b0f17] text-xs font-mono min-h-[380px]">
          <pre className="overflow-x-auto text-emerald-300 leading-relaxed whitespace-pre-wrap">
            {fixedCode}
          </pre>
        </div>
      )}
    </div>
  );
}
