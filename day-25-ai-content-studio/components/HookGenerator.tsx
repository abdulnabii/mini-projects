'use client';

import { useState } from 'react';
import { HookVariant } from '@/types';
import { Sparkles, Copy, Check, TrendingUp, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  hooks: HookVariant[];
  onSelectHook?: (hookText: string) => void;
}

export default function HookGenerator({ hooks, onSelectHook }: Props) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleApply = (text: string) => {
    if (onSelectHook) {
      onSelectHook(text);
      confetti({
        particleCount: 20,
        spread: 50,
        origin: { y: 0.7 },
        colors: ['#10b981', '#06b6d4'],
      });
    }
  };

  if (!hooks || hooks.length === 0) return null;

  return (
    <div className="p-6 rounded-3xl bg-[#0d1117] border border-slate-800 space-y-4 font-mono shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <h4 className="font-bold text-white text-xs uppercase tracking-wider">
            5 High-Converting Hook Variations
          </h4>
        </div>
        <span className="text-[10px] text-slate-500">
          Ranked by predicted Click-Through-Rate (CTR)
        </span>
      </div>

      <div className="space-y-3">
        {hooks.map((hook, idx) => (
          <div
            key={idx}
            className="p-4 rounded-2xl bg-[#161b22] border border-slate-800 hover:border-emerald-500/40 transition-all space-y-2"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold text-emerald-400">
                {hook.style}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                <span>{hook.predictedCTR} Est. CTR</span>
              </span>
            </div>

            <p className="text-xs text-white font-sans leading-relaxed">
              "{hook.text}"
            </p>

            <p className="text-[10px] text-slate-500 font-mono italic">
              💡 Formula: {hook.formulaExplanation}
            </p>

            <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-800/80">
              <button
                type="button"
                onClick={() => handleCopy(hook.text, idx)}
                className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white text-[11px] transition-colors flex items-center gap-1 cursor-pointer"
              >
                {copiedIndex === idx ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedIndex === idx ? 'Copied' : 'Copy'}</span>
              </button>

              {onSelectHook && (
                <button
                  type="button"
                  onClick={() => handleApply(hook.text)}
                  className="px-3 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer"
                >
                  <span>Apply as Hook</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
