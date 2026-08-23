'use client';

import { useState } from 'react';
import {
  Sparkles,
  X,
  Loader2,
  Check,
  Copy,
  Zap,
  TrendingUp,
  Smile,
  MessageSquare,
  Flame,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  initialText: string;
  isOpen: boolean;
  onClose: () => void;
  onApplyRewrittenText: (newText: string) => void;
}

const REWRITE_MODES = [
  { id: 'punchy', label: '⚡ Punchy & Contrarian', icon: Zap, desc: 'Short, sharp, bold claim' },
  { id: 'metrics', label: '📈 Add Hard Metrics', icon: TrendingUp, desc: 'Inject percentages & data' },
  { id: 'simplify', label: '🧠 Simplify (ELI5)', icon: Smile, desc: 'Remove all technical jargon' },
  { id: 'founder', label: '🚀 Founder / Builder', icon: Flame, desc: 'Authentic build-in-public energy' },
  { id: 'engagement', label: '💬 Maximize Comments', icon: MessageSquare, desc: 'High-friction debate question' },
];

export default function RewriteStudio({
  initialText,
  isOpen,
  onClose,
  onApplyRewrittenText,
}: Props) {
  const [selectedMode, setSelectedMode] = useState('punchy');
  const [inputText, setInputText] = useState(initialText);
  const [rewrittenOutput, setRewrittenOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleRewrite = async (mode: string = selectedMode) => {
    if (!inputText.trim()) return;

    setIsLoading(true);
    try {
      const res = await fetch('/api/rewrite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText, mode }),
      });

      const data = await res.json();
      if (data.rewrittenText) {
        setRewrittenOutput(data.rewrittenText);
        confetti({
          particleCount: 20,
          spread: 50,
          origin: { y: 0.6 },
          colors: ['#10b981', '#38bdf8'],
        });
      }
    } catch (e) {
      console.error('Rewrite failed:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = () => {
    if (rewrittenOutput) {
      onApplyRewrittenText(rewrittenOutput);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150 font-mono">
      <div className="relative w-full max-w-xl rounded-3xl bg-[#0d1117] border-2 border-emerald-500/40 p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base font-outfit">
                AI Virality Polisher &amp; Hook Rewriter
              </h3>
              <p className="text-xs text-slate-400">
                Transform any draft into high-retention social copy in 1 click
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mode Selector Chips */}
        <div className="space-y-1.5">
          <span className="text-[10px] text-slate-400 font-bold uppercase">
            Select Virality Style Mode:
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {REWRITE_MODES.map((m) => {
              const isSelected = selectedMode === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    setSelectedMode(m.id);
                    handleRewrite(m.id);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-500 text-black font-black shadow-md'
                      : 'bg-[#161b22] border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {m.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Input Textarea */}
        <div className="space-y-1.5">
          <label className="text-[10px] text-slate-400 font-bold uppercase">
            Original Text:
          </label>
          <textarea
            rows={3}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full p-3.5 rounded-2xl bg-[#161b22] border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 font-sans"
          />
        </div>

        {/* Rewritten Output */}
        {isLoading ? (
          <div className="py-8 text-center space-y-2">
            <Loader2 className="w-6 h-6 text-emerald-400 animate-spin mx-auto" />
            <p className="text-xs text-slate-400">Polishing copy for virality...</p>
          </div>
        ) : rewrittenOutput ? (
          <div className="p-4 rounded-2xl bg-[#04080e] border border-emerald-500/40 space-y-2 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-emerald-400 font-bold uppercase flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> High-Engagement Rewrite:
              </span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(rewrittenOutput);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <p className="text-xs text-emerald-300 font-sans whitespace-pre-wrap leading-relaxed">
              {rewrittenOutput}
            </p>
          </div>
        ) : null}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <button
            type="button"
            onClick={() => handleRewrite()}
            disabled={isLoading || !inputText.trim()}
            className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white cursor-pointer"
          >
            Re-generate
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleApply}
              disabled={!rewrittenOutput}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 text-black font-extrabold text-xs transition-all disabled:opacity-40 cursor-pointer shadow-md"
            >
              Apply Rewrite
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
