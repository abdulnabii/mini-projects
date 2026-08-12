'use client';

import { useState } from 'react';
import { TargetModel } from '@/types';
import { Sparkles, Wand2, AlertCircle } from 'lucide-react';

interface Props {
  onOptimize: (rawPrompt: string, targetModel: TargetModel) => void;
  isLoading: boolean;
  initialPrompt?: string;
}

const TARGET_MODELS: { name: TargetModel; icon: string; desc: string }[] = [
  { name: 'Gemini 1.5 Pro/Flash', icon: '✨', desc: 'Google Gemini 1.5 1M context window' },
  { name: 'Claude 3.5 Sonnet', icon: '🧠', desc: 'Anthropic Claude reasoning & coding' },
  { name: 'GPT-4o / GPT-4', icon: '⚡', desc: 'OpenAI GPT-4o multimodal LLM' },
  { name: 'Midjourney v6', icon: '🎨', desc: 'Midjourney visual image generation' },
];

export default function PromptInputForm({ onOptimize, isLoading, initialPrompt = '' }: Props) {
  const [rawPrompt, setRawPrompt] = useState(initialPrompt);
  const [targetModel, setTargetModel] = useState<TargetModel>('Gemini 1.5 Pro/Flash');

  const charCount = rawPrompt.length;
  const estimatedTokens = Math.ceil(charCount / 4);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawPrompt.trim()) return;
    onOptimize(rawPrompt, targetModel);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Framework Target Selection */}
      <div>
        <label className="block text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-3">
          1. Select Target AI Model Framework
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {TARGET_MODELS.map((m) => (
            <button
              key={m.name}
              type="button"
              onClick={() => setTargetModel(m.name)}
              className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between gap-2 ${
                targetModel === m.name
                  ? 'bg-amber-500/10 border-amber-500 text-amber-300 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500'
                  : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-lg">{m.icon}</span>
                {targetModel === m.name && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                )}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-100 font-outfit">{m.name}</p>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5 line-clamp-1">{m.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Raw Prompt Input */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
            2. Enter Raw or Unstructured Prompt
          </label>
          <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
            <span>{charCount} chars</span>
            <span>•</span>
            <span className="text-amber-400 font-bold">~{estimatedTokens} tokens</span>
          </div>
        </div>

        <div className="relative">
          <textarea
            value={rawPrompt}
            onChange={(e) => setRawPrompt(e.target.value)}
            placeholder="e.g. Write a python script to parse CSV files and send daily emails to users about their subscription status..."
            rows={5}
            className="w-full rounded-2xl bg-slate-950 border border-slate-800 p-4 text-sm font-mono text-slate-200 placeholder-slate-600 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all"
            required
          />
          {!rawPrompt && (
            <div className="absolute right-4 bottom-4 text-xs font-mono text-slate-600 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Tip: Use {"{{variable_name}}"} for dynamic inputs</span>
            </div>
          )}
        </div>
      </div>

      {/* Optimization CTA Button */}
      <button
        type="submit"
        disabled={isLoading || !rawPrompt.trim()}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-emerald-600 font-outfit font-extrabold text-black hover:opacity-95 transition-all shadow-xl shadow-amber-500/20 disabled:opacity-50 flex items-center justify-center gap-2 text-base"
      >
        {isLoading ? (
          <>
            <Wand2 className="w-5 h-5 animate-spin text-black" />
            <span>Architecting Production Prompt...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5 text-black" />
            <span>Optimize &amp; Engineer Prompt with AI</span>
          </>
        )}
      </button>
    </form>
  );
}
