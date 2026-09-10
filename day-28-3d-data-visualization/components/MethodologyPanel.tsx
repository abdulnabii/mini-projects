'use client';

import { BookOpen, CheckCircle, Calculator, Sigma, ShieldCheck } from 'lucide-react';

export default function MethodologyPanel() {
  return (
    <div className="p-6 sm:p-8 rounded-2xl bg-[#0d1527] border border-[#1e293b] shadow-xl space-y-6 font-mono">
      <div className="flex items-center gap-3 border-b border-[#1e293b] pb-4">
        <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
          <BookOpen className="w-4 h-4" />
        </div>
        <div>
          <h3 className="font-bold text-white text-sm font-mono">
            Analytical &amp; Statistical Methodology
          </h3>
          <p className="text-xs text-slate-400">
            Formal mathematical definitions, fences, and score derivations implemented in OmniData.3D.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* IQR Outlier Detection */}
        <div className="p-4 rounded-xl bg-[#111827] border border-[#1e293b] space-y-2">
          <div className="flex items-center gap-2 text-cyan-400 font-bold">
            <Calculator className="w-4 h-4" />
            <span>1. Interquartile Range (IQR) Outlier Fences</span>
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            Outliers are detected deterministically using standard Tukey boxplot fences. For each numeric dimension:
          </p>
          <div className="p-2.5 rounded-lg bg-[#060a10] border border-[#1e293b] text-[11px] text-emerald-400">
            Lower Fence = Q1 - 1.5 × (Q3 - Q1)<br />
            Upper Fence = Q3 + 1.5 × (Q3 - Q1)
          </div>
          <p className="text-slate-400 text-[10px]">
            Points lying outside 3.0 × IQR are marked as critical severity.
          </p>
        </div>

        {/* Pearson Correlation */}
        <div className="p-4 rounded-xl bg-[#111827] border border-[#1e293b] space-y-2">
          <div className="flex items-center gap-2 text-purple-400 font-bold">
            <Sigma className="w-4 h-4" />
            <span>2. Pearson Correlation Coefficient (r)</span>
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            Pairwise linear association computed across complete observations:
          </p>
          <div className="p-2.5 rounded-lg bg-[#060a10] border border-[#1e293b] text-[11px] text-cyan-400">
            r = Σ((x - x̄)(y - ȳ)) / [ √(Σ(x - x̄)²) × √(Σ(y - ȳ)²) ]
          </div>
          <p className="text-slate-400 text-[10px] italic">
            *Statistical association only. Correlation does not imply causation.
          </p>
        </div>

        {/* OmniData Quality Score */}
        <div className="p-4 rounded-xl bg-[#111827] border border-[#1e293b] space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>3. OmniData Quality Score (0–100)</span>
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            Composite data health metric weighted across 4 key dimensions:
          </p>
          <div className="p-2.5 rounded-lg bg-[#060a10] border border-[#1e293b] text-[11px] text-slate-300 space-y-0.5">
            <div>• Completeness (40%): Non-null cells / Total cells</div>
            <div>• Uniqueness (30%): (Rows - Duplicate rows) / Total rows</div>
            <div>• Consistency (15%): Uniform data types per column</div>
            <div>• Validity (15%): Numerical range compliance</div>
          </div>
        </div>

        {/* AI Grounding Principle */}
        <div className="p-4 rounded-xl bg-[#111827] border border-[#1e293b] space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-bold">
            <CheckCircle className="w-4 h-4" />
            <span>4. Zero-Hallucination AI Grounding</span>
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            The LLM is explicitly barred from performing mathematical calculations or deriving new metrics. All figures cited in executive summaries, patterns, and interactive Q&amp;A originate directly from the local TypeScript statistics engine.
          </p>
        </div>
      </div>
    </div>
  );
}
