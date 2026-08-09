'use client';

import React, { useState } from 'react';
import { Copy, Check, Sparkles, FileCode } from 'lucide-react';

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
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl space-y-0">
      {/* Header Bar */}
      <div className="bg-slate-950 border-b border-slate-800 px-5 py-3.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-white">AI Refactored Code Comparison</h3>
          <span className="text-[10px] font-mono uppercase bg-slate-800 text-cyan-300 px-2 py-0.5 rounded border border-slate-700">
            {language}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-mono">
            <button
              onClick={() => setActiveTab('split')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                activeTab === 'split' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Side-by-Side
            </button>
            <button
              onClick={() => setActiveTab('fixed')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                activeTab === 'fixed' ? 'bg-emerald-950 text-emerald-300 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Fixed Code Only
            </button>
          </div>

          <button
            onClick={handleCopyFixed}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 text-xs font-bold shadow-lg shadow-emerald-500/20 hover:scale-[1.02] transition-all"
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
        <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-800 bg-slate-950 text-xs font-mono min-h-[350px]">
          {/* Left: Original */}
          <div className="p-4 space-y-2 bg-red-950/10">
            <div className="flex items-center justify-between text-[11px] font-bold text-red-400 border-b border-red-900/40 pb-2">
              <span className="flex items-center gap-1.5">
                <FileCode className="w-3.5 h-3.5" /> Original Code (With Issues)
              </span>
            </div>
            <pre className="overflow-x-auto text-red-200/80 leading-relaxed whitespace-pre-wrap">
              {originalCode}
            </pre>
          </div>

          {/* Right: AI Fixed Code */}
          <div className="p-4 space-y-2 bg-emerald-950/10">
            <div className="flex items-center justify-between text-[11px] font-bold text-emerald-400 border-b border-emerald-900/40 pb-2">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> AI Clean Refactored Code
              </span>
            </div>
            <pre className="overflow-x-auto text-emerald-200/90 leading-relaxed whitespace-pre-wrap">
              {fixedCode}
            </pre>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-slate-950 text-xs font-mono min-h-[350px]">
          <pre className="overflow-x-auto text-emerald-300 leading-relaxed whitespace-pre-wrap">
            {fixedCode}
          </pre>
        </div>
      )}
    </div>
  );
}
