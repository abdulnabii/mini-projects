'use client';

import { NLPEntityMetric } from '@/types';
import { Sparkles, Brain, CheckCircle2, AlertCircle, PlusCircle, Layers, Tag } from 'lucide-react';

interface Props {
  nlpEntities: NLPEntityMetric;
}

export default function NLPEntitiesCard({ nlpEntities }: Props) {
  return (
    <div className="bg-[#090d16] border border-white/[0.08] rounded-3xl p-6 sm:p-8 space-y-6 font-mono text-xs text-slate-300 shadow-xl sre-card">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base font-outfit">
              Google NLP Semantic Entity Radar &amp; Content Gaps
            </h3>
            <p className="text-xs text-slate-400">
              Identifies high-relevance topic entities required for Hummingbird &amp; RankBrain authority
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1 rounded-xl bg-[#04080e] border border-white/[0.08] text-right">
            <span className="text-[9px] text-slate-500 block uppercase">Entity Coverage</span>
            <strong className="text-emerald-400 font-mono text-xs">
              {nlpEntities.entityCoverageScore}% Depth
            </strong>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Covered Entities */}
        <div className="space-y-3">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 font-mono">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Detected Semantic Entities ({nlpEntities.coveredEntities.length})
          </label>

          {nlpEntities.coveredEntities.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {nlpEntities.coveredEntities.map((ent, idx) => (
                <div
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-[#0f1422] border border-emerald-500/30 text-slate-200 flex items-center gap-2"
                >
                  <span className="font-bold text-white text-[11px]">{ent.name}</span>
                  <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded">
                    {ent.count}x
                  </span>
                  <span className="text-[8px] text-slate-500 uppercase">{ent.category}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 text-[11px] p-3 rounded-xl bg-[#04080e]">
              No recognized NLP knowledge graph entities detected yet.
            </p>
          )}
        </div>

        {/* 2. Missing Content Gap Entities */}
        <div className="space-y-3">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 font-mono">
            <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
            Recommended Semantic Content Gaps ({nlpEntities.missingEntities.length})
          </label>

          <div className="space-y-2">
            {nlpEntities.missingEntities.map((missing, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-[#04080e] border border-white/[0.06] hover:border-amber-500/30 transition-colors space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-300 text-xs font-mono">
                    + {missing.name}
                  </span>
                  <span className="text-[9px] font-bold text-amber-400 px-1.5 py-0.2 rounded bg-amber-500/10 border border-amber-500/30">
                    {missing.importance} PRIORITY
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  {missing.suggestedContext}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
