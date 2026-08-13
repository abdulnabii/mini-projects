'use client';

import React, { useState, useRef } from 'react';
import { SUPPORTED_LANGUAGES, SAMPLE_PRESETS, detectLanguage } from '@/lib/language-detect';
import { CodePreset } from '@/types';
import { Terminal, Play, RotateCcw, Zap, Sparkles, Code2, Check, FileCode2 } from 'lucide-react';

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
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

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

  const handleScroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  const lineCount = code.split('\n').length;
  // Always render enough line numbers to fill the generous editor height
  const lineNumbers = Array.from({ length: Math.max(lineCount, 35) }, (_, i) => i + 1);

  return (
    <div className="bg-[#0d1117] border border-emerald-500/20 rounded-2xl overflow-hidden shadow-2xl flex flex-col min-h-[600px] lg:min-h-[700px] h-full terminal-glow font-mono">
      {/* Editor Controls & IDE Window Title Bar */}
      <div className="bg-[#080c14] border-b border-zinc-800/80 px-4 py-3 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          {/* Terminal Window Dots */}
          <div className="flex items-center gap-1.5 mr-1">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>

          <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-mono">
            <Code2 className="w-4 h-4 text-emerald-400" />
            <span>Language:</span>
          </div>

          <select
            value={language}
            onChange={(e) => {
              setAutoDetect(false);
              onLanguageChange(e.target.value);
            }}
            className="bg-zinc-900 border border-zinc-700/80 rounded-xl px-3 py-1.5 text-xs font-mono font-bold text-emerald-300 focus:outline-none focus:border-emerald-500"
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang.id} value={lang.id}>
                {lang.name}
              </option>
            ))}
          </select>

          <label className="flex items-center gap-1.5 text-[11px] text-zinc-400 font-mono cursor-pointer select-none">
            <input
              type="checkbox"
              checked={autoDetect}
              onChange={(e) => setAutoDetect(e.target.checked)}
              className="accent-emerald-400 rounded"
            />
            <span>Auto-detect</span>
          </label>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onChange('')}
            className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors border border-zinc-800"
            title="Clear Editor"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={onReview}
            disabled={!code.trim() || isLoading}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-purple-600 text-zinc-950 font-mono font-bold text-xs hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/25"
          >
            {isLoading ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin text-zinc-950" />
                <span>Analyzing AST &amp; Security...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-zinc-950" />
                <span>Execute AI Code Review</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Vulnerability Presets Toolbar */}
      <div className="bg-[#090d16] px-4 py-2 border-b border-zinc-800/80 overflow-x-auto flex items-center gap-2 shrink-0">
        <span className="text-[10px] uppercase font-mono text-emerald-400 font-bold shrink-0 flex items-center gap-1">
          <Zap className="w-3 h-3 text-emerald-400" /> Presets:
        </span>
        {SAMPLE_PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => handlePresetSelect(preset)}
            className="text-xs px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-emerald-300 border border-zinc-800 transition-colors whitespace-nowrap font-mono"
          >
            + {preset.title}
          </button>
        ))}
      </div>

      {/* Line-Numbered Spacious Code Area */}
      <div className="flex bg-[#0b0f17] font-mono text-xs text-zinc-200 flex-1 relative overflow-hidden min-h-[480px]">
        {/* Synchronized Line Numbers Column */}
        <div
          ref={lineNumbersRef}
          className="w-12 py-3 bg-[#080c14] border-r border-zinc-800/80 text-zinc-600 text-right pr-3 select-none shrink-0 font-mono leading-relaxed overflow-hidden"
        >
          {lineNumbers.map((num) => (
            <div key={num} className="h-[21px] flex items-center justify-end">{num}</div>
          ))}
        </div>

        {/* Code Textarea Area */}
        <textarea
          ref={textareaRef}
          value={code}
          onChange={handleCodeChange}
          onScroll={handleScroll}
          placeholder="// Paste Python, TS, JS, Go, Rust, Java, C++, SQL code snippet..."
          className="w-full h-full p-3 bg-transparent text-emerald-100 placeholder:text-zinc-700 focus:outline-none resize-none leading-relaxed font-mono whitespace-pre overflow-y-auto overflow-x-auto selection:bg-emerald-500/30 font-normal leading-[21px]"
          spellCheck={false}
        />
      </div>

      {/* Editor Footer Status Bar */}
      <div className="bg-[#080c14] border-t border-zinc-800/80 px-4 py-2 flex items-center justify-between text-[11px] text-zinc-500 font-mono shrink-0">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-emerald-400 font-semibold">
            <FileCode2 className="w-3.5 h-3.5" />
            {language.toUpperCase()}
          </span>
          <span>UTF-8</span>
          <span>LF</span>
        </div>
        <div className="flex items-center gap-3">
          <span>Lines: <strong className="text-zinc-300">{lineCount}</strong></span>
          <span>Chars: <strong className="text-zinc-300">{code.length}</strong></span>
        </div>
      </div>
    </div>
  );
}
