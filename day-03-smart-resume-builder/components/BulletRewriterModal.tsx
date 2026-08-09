'use client';

import React, { useState } from 'react';
import { Sparkles, Check, X, ArrowRight, Wand2 } from 'lucide-react';

interface BulletRewriterModalProps {
  originalBullet: string;
  role?: string;
  targetJobDescription?: string;
  onApply: (newBullet: string) => void;
  onClose: () => void;
}

export default function BulletRewriterModal({
  originalBullet,
  role,
  targetJobDescription,
  onApply,
  onClose,
}: BulletRewriterModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [rewrittenResult, setRewrittenResult] = useState<{
    rewrittenBullet: string;
    actionVerb: string;
    metricsAdded: string;
  } | null>(null);

  const handleRunAI = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/rewrite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawBullet: originalBullet, role, targetJobDescription }),
      });
      const data = await res.json();
      setRewrittenResult(data);
    } catch (err) {
      console.error('Failed to rewrite bullet:', err);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    handleRunAI();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white">AI STAR Bullet Point Optimizer</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Original Bullet */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Original Text:</span>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 italic">
            "{originalBullet}"
          </div>
        </div>

        {/* AI Processing / Result */}
        {isLoading ? (
          <div className="py-8 text-center space-y-3 bg-indigo-950/20 rounded-2xl border border-indigo-500/20">
            <Sparkles className="w-8 h-8 text-indigo-400 animate-spin mx-auto" />
            <p className="text-xs text-indigo-300 font-mono">
              Injecting action verbs & quantified impact metrics...
            </p>
          </div>
        ) : rewrittenResult ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> AI STAR Statement:
              </span>
              <span className="text-[10px] font-mono bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800">
                Action Verb: {rewrittenResult.actionVerb}
              </span>
            </div>

            <div className="bg-emerald-950/20 border border-emerald-500/30 p-4 rounded-2xl text-xs text-emerald-100 leading-relaxed font-sans shadow-inner">
              {rewrittenResult.rewrittenBullet}
            </div>

            {rewrittenResult.metricsAdded && (
              <div className="text-[11px] font-mono text-indigo-300 bg-indigo-950/40 p-2 rounded-xl border border-indigo-800/40 flex items-center gap-1.5">
                <ArrowRight className="w-3.5 h-3.5 text-indigo-400" />
                <span>Quantified Metric Added: <strong>{rewrittenResult.metricsAdded}</strong></span>
              </div>
            )}
          </div>
        ) : null}

        {/* Action Controls */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-mono font-semibold hover:bg-slate-700"
          >
            Cancel
          </button>

          {rewrittenResult && (
            <button
              type="button"
              onClick={() => {
                onApply(rewrittenResult.rewrittenBullet);
                onClose();
              }}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 text-slate-950 text-xs font-mono font-bold hover:scale-[1.02] transition-all flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
            >
              <Check className="w-4 h-4" />
              <span>Apply AI Bullet</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
