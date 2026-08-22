'use client';

import { useState } from 'react';
import { DangerousClause } from '@/types';
import {
  AlertTriangle,
  Flame,
  Copy,
  Check,
  ArrowRight,
  ShieldAlert,
  Quote,
  Sparkles,
} from 'lucide-react';

interface Props {
  clauses: DangerousClause[];
}

export default function DangerousClauseList({ clauses }: Props) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (clauses.length === 0) {
    return (
      <div className="p-8 rounded-3xl bg-[#0d1117] border border-slate-800 text-center space-y-2 font-mono">
        <span className="text-2xl">🎉</span>
        <h4 className="font-bold text-white text-base">No Critical Dangerous Clauses Detected</h4>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          The document does not appear to contain severe one-sided IP grabs, excessive non-competes, or predatory liability shifts.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 font-mono">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-white font-outfit flex items-center gap-2">
          <Flame className="w-5 h-5 text-rose-500" />
          <span>Flagged Dangerous Clauses ({clauses.length})</span>
        </h3>
        <span className="text-xs text-slate-400">Review &amp; Negotiate</span>
      </div>

      <div className="space-y-4">
        {clauses.map((clause, index) => (
          <div
            key={clause.id || index}
            className="p-6 rounded-3xl bg-[#0d1117] border border-rose-500/30 space-y-4 shadow-xl hover:border-rose-500/60 transition-all"
          >
            {/* Header with Severity & Category */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${
                    clause.severity === 'SEVERE'
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                      : clause.severity === 'MODERATE'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                  }`}
                >
                  {clause.severity} RISK
                </span>
                <span className="text-xs font-bold text-slate-300 px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                  {clause.category}
                </span>
              </div>

              <span className="text-[11px] text-slate-400">Clause #{index + 1}</span>
            </div>

            {/* Title */}
            <h4 className="font-extrabold text-white text-base font-outfit">{clause.title}</h4>

            {/* Exact Quote */}
            <div className="p-4 rounded-2xl bg-[#161b22] border border-slate-800 space-y-1.5 text-xs text-slate-300 relative">
              <div className="flex items-center gap-1.5 text-[10px] text-amber-400 font-bold uppercase">
                <Quote className="w-3.5 h-3.5" />
                <span>Exact Text Quote from Contract:</span>
              </div>
              <p className="italic font-mono text-slate-300 pl-2 border-l-2 border-amber-500/50 leading-relaxed">
                "{clause.exactText}"
              </p>
            </div>

            {/* Plain English Translation */}
            <div className="space-y-1 text-xs">
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">
                Plain-English Translation:
              </span>
              <p className="text-slate-200 font-sans leading-relaxed text-sm">{clause.plainEnglish}</p>
            </div>

            {/* Legal Implication */}
            {clause.legalImplication && (
              <div className="space-y-1 text-xs">
                <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block">
                  Practical Real-World Consequence:
                </span>
                <p className="text-slate-300 font-sans leading-relaxed">{clause.legalImplication}</p>
              </div>
            )}

            {/* Actionable Counter-Proposal */}
            {clause.counterProposal && (
              <div className="p-4 rounded-2xl bg-[#091624] border border-cyan-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    Recommended Counter-Proposal Wording:
                  </span>

                  <button
                    onClick={() => handleCopy(clause.id, clause.counterProposal)}
                    className="px-3 py-1 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/30 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                    title="Copy counter-proposal"
                  >
                    {copiedId === clause.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Counter-Proposal</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-xs font-mono text-cyan-100 bg-[#0d1f33] p-3 rounded-xl border border-cyan-500/20 leading-relaxed select-all">
                  {clause.counterProposal}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
