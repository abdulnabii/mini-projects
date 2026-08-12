'use client';

import { useState } from 'react';
import { OptimizationResult, PromptVariant } from '@/types';
import { Check, Copy, Sparkles, Play, ShieldAlert, Cpu, Layers, FileCode, CheckCircle2 } from 'lucide-react';
import LiveSandbox from './LiveSandbox';

interface Props {
  result: OptimizationResult;
}

export default function OptimizationDashboard({ result }: Props) {
  const [selectedVariantId, setSelectedVariantId] = useState<string>(result.variants[0]?.id || '');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeSandboxVariant, setActiveSandboxVariant] = useState<PromptVariant | null>(null);

  const currentVariant = result.variants.find((v) => v.id === selectedVariantId) || result.variants[0];

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    if (score >= 60) return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
    return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
  };

  return (
    <div className="space-y-8 font-mono">
      {/* Scorecard Header */}
      <div className="rounded-3xl bg-[#0f172a] border border-amber-500/20 p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h2 className="text-xl font-bold text-white font-outfit">Prompt Audit &amp; Quality Scorecard</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Target Framework: <strong className="text-amber-400">{result.targetModel}</strong>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className={`px-4 py-2 rounded-2xl border flex items-center gap-2 ${getScoreColor(result.scorecard.totalScore)}`}>
              <span className="text-2xl font-black font-outfit">{result.scorecard.totalScore}</span>
              <span className="text-[10px] font-bold uppercase tracking-wider">/ 100 Quality Rating</span>
            </div>
          </div>
        </div>

        {/* 5-Axis Score Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 text-xs">
          {[
            result.scorecard.clarity,
            result.scorecard.context,
            result.scorecard.constraints,
            result.scorecard.formatting,
            result.scorecard.guardrails,
          ].map((m, idx) => (
            <div key={idx} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between font-bold">
                <span className="text-slate-300 text-[11px]">{m.name}</span>
                <span className="text-amber-400">{m.score}/20</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full rounded-full transition-all"
                  style={{ width: `${(m.score / 20) * 100}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-400 line-clamp-2">{m.feedback}</p>
            </div>
          ))}
        </div>

        {/* Audit Summary */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 flex items-start gap-3">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p>{result.scorecard.summaryFeedback}</p>
        </div>
      </div>

      {/* 3 Optimized Variants Selector */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white font-outfit flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-400" />
            Optimized Prompt Variants
          </h3>
          <span className="text-xs text-slate-400 font-mono">3 Structural Approaches</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {result.variants.map((v) => (
            <button
              key={v.id}
              onClick={() => setSelectedVariantId(v.id)}
              className={`p-5 rounded-2xl border text-left transition-all space-y-3 ${
                selectedVariantId === v.id
                  ? 'bg-amber-500/10 border-amber-500 text-white shadow-xl shadow-amber-500/10'
                  : 'bg-[#0f172a] border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30">
                  {v.goalTag}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">~{v.estimatedTokens} tokens</span>
              </div>
              <div>
                <h4 className="font-bold text-slate-100 text-sm font-outfit">{v.title}</h4>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">{v.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Current Selected Variant View */}
      {currentVariant && (
        <div className="rounded-3xl bg-[#0f172a] border border-amber-500/30 p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div>
              <h3 className="text-lg font-bold text-white font-outfit flex items-center gap-2">
                <FileCode className="w-5 h-5 text-amber-400" />
                {currentVariant.title}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">{currentVariant.description}</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() =>
                  handleCopy(
                    `${currentVariant.systemInstruction ? `SYSTEM:\n${currentVariant.systemInstruction}\n\nUSER:\n` : ''}${currentVariant.userPrompt}`,
                    currentVariant.id
                  )
                }
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:text-white hover:border-amber-500/50 text-xs font-bold transition-all"
              >
                {copiedId === currentVariant.id ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-amber-400" />
                    <span>Copy Full Prompt</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setActiveSandboxVariant(currentVariant)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-500 text-black text-xs font-extrabold hover:opacity-95 transition-all shadow-lg shadow-amber-500/20"
              >
                <Play className="w-4 h-4 fill-black text-black" />
                <span>Test Run in Sandbox</span>
              </button>
            </div>
          </div>

          {/* System Instruction (If present) */}
          {currentVariant.systemInstruction && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5" />
                System Instruction / Role Definition
              </label>
              <pre className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/20 text-xs text-emerald-300 whitespace-pre-wrap font-mono leading-relaxed">
                {currentVariant.systemInstruction}
              </pre>
            </div>
          )}

          {/* User Prompt Text */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Engineered User Prompt
            </label>
            <pre className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-200 whitespace-pre-wrap font-mono leading-relaxed max-h-[350px] overflow-y-auto">
              {currentVariant.userPrompt}
            </pre>
          </div>
        </div>
      )}

      {/* Live Sandbox Modal / Drawer */}
      {activeSandboxVariant && (
        <LiveSandbox variant={activeSandboxVariant} onClose={() => setActiveSandboxVariant(null)} />
      )}
    </div>
  );
}
