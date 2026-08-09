'use client';

import React, { useState } from 'react';
import { SUPPORTED_LANGUAGES, SAMPLE_PRESETS, detectLanguage } from '@/lib/language-detect';
import { CodePreset } from '@/types';
import { Code2, Sparkles, Play, RotateCcw, Zap } from 'lucide-react';

interface CodeEditorProps {
  code: string;
  onChange: (value: string) => void;
  language: string;
  onLanguageChange: (lang: string) => void;
  onReview: () => void;
  isLoading: boolean;
}

export default function CodeEditor({
  code,
  onChange,
  language,
  onLanguageChange,
  onReview,
  isLoading,
}: CodeEditorProps) {
  const [autoDetect, setAutoDetect] = useState(true);

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    onChange(val);
    if (autoDetect && val.length > 10) {
      const detected = detectLanguage(val);
      onLanguageChange(detected);
    }
  };

  const handlePresetSelect = (preset: CodePreset) => {
    onChange(preset.code);
    onLanguageChange(preset.language);
  };

  const lineCount = code.split('\n').length;
  const lineNumbers = Array.from({ length: Math.max(lineCount, 12) }, (_, i) => i + 1);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl space-y-0">
      {/* Editor Controls Bar */}
      <div className="bg-slate-950 border-b border-slate-800 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
            <Code2 className="w-4 h-4 text-cyan-400" />
            <span>Language:</span>
          </div>

          <select
            value={language}
            onChange={(e) => {
              setAutoDetect(false);
              onLanguageChange(e.target.value);
            }}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs font-mono font-semibold text-cyan-300 focus:outline-none focus:border-cyan-500"
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang.id} value={lang.id}>
                {lang.name}
              </option>
            ))}
          </select>

          <label className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono cursor-pointer">
            <input
              type="checkbox"
              checked={autoDetect}
              onChange={(e) => setAutoDetect(e.target.checked)}
              className="accent-cyan-400 rounded"
            />
            <span>Auto-detect</span>
          </label>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onChange('')}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors border border-slate-800"
            title="Clear Editor"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onReview}
            disabled={!code.trim() || isLoading}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 text-slate-950 font-bold text-xs hover:from-cyan-400 hover:to-emerald-400 disabled:opacity-50 transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/25"
          >
            {isLoading ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin text-slate-950" />
                <span>Analyzing Code...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-slate-950" />
                <span>Run AI Code Review</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Preset Chips */}
      <div className="bg-slate-950/60 px-4 py-2 border-b border-slate-800/80 overflow-x-auto flex items-center gap-2">
        <span className="text-[10px] uppercase font-mono text-slate-400 shrink-0 flex items-center gap-1">
          <Zap className="w-3 h-3 text-cyan-400" /> Presets:
        </span>
        {SAMPLE_PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => handlePresetSelect(preset)}
            className="text-xs px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-800 transition-colors whitespace-nowrap"
          >
            + {preset.title}
          </button>
        ))}
      </div>

      {/* Line-Numbered Editor Area */}
      <div className="flex bg-slate-950 font-mono text-xs text-slate-200 min-h-[380px] max-h-[550px] relative overflow-hidden">
        {/* Line Numbers */}
        <div className="w-12 py-3 bg-slate-950 border-r border-slate-800 text-slate-600 text-right pr-3 select-none shrink-0 font-mono leading-relaxed">
          {lineNumbers.map((num) => (
            <div key={num}>{num}</div>
          ))}
        </div>

        {/* Code Textarea */}
        <textarea
          value={code}
          onChange={handleCodeChange}
          placeholder="// Paste any code snippet here (Python, JS, TS, Go, Rust, Java, C++, SQL)..."
          className="w-full h-full p-3 bg-transparent text-slate-100 placeholder:text-slate-600 focus:outline-none resize-none leading-relaxed font-mono whitespace-pre overflow-x-auto"
          spellCheck={false}
        />
      </div>
    </div>
  );
}
