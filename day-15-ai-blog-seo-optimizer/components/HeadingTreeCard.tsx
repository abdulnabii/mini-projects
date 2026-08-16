'use client';

import { HeadingStructureMetric } from '@/types';
import { AlignLeft, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

interface Props {
  structure: HeadingStructureMetric;
}

export default function HeadingTreeCard({ structure }: Props) {
  return (
    <div className="bg-[#0e1424] border border-emerald-500/30 rounded-3xl p-6 sm:p-8 space-y-6 font-mono text-xs text-slate-300 shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <AlignLeft className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base font-outfit">Heading Structure Hierarchy (H1→H2→H3)</h3>
            <p className="text-xs text-slate-400">Validates heading nestings and prevents search crawler indexing confusion</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold">
            H1: {structure.h1Count}
          </span>
          <span className="px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 font-bold">
            H2: {structure.h2Count}
          </span>
          <span className="px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 text-indigo-300 font-bold">
            H3: {structure.h3Count}
          </span>
        </div>
      </div>

      {/* Warnings & Issues */}
      {structure.issues.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
          <span className="text-amber-400 font-bold text-xs flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4" />
            Detected Heading Hierarchy Issues:
          </span>
          <ul className="list-disc list-inside space-y-1 text-slate-300 text-[11px]">
            {structure.issues.map((issue, idx) => (
              <li key={idx}>{issue}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Heading Hierarchy Tree */}
      <div className="space-y-2 pt-1">
        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
          Document Heading Outline
        </label>
        <div className="space-y-1.5 max-h-72 overflow-y-auto pr-2">
          {structure.headings.map((h, idx) => (
            <div
              key={idx}
              className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition-all ${
                h.tag === 'h1'
                  ? 'bg-slate-950 border-emerald-500/40 text-white font-bold'
                  : h.tag === 'h2'
                  ? 'bg-slate-950/80 border-slate-800 text-slate-200 ml-4'
                  : 'bg-slate-950/40 border-slate-800/80 text-slate-400 ml-8'
              } ${h.isSkippedLevel ? 'border-rose-500/50 bg-rose-500/10' : ''}`}
            >
              <div className="flex items-center gap-2 truncate">
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                    h.tag === 'h1'
                      ? 'bg-emerald-500 text-black'
                      : h.tag === 'h2'
                      ? 'bg-indigo-500/30 text-indigo-300'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {h.tag.toUpperCase()}
                </span>
                <span className="truncate">{h.text}</span>
              </div>

              <div className="shrink-0 flex items-center gap-2">
                {h.hasKeyword ? (
                  <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                    Keyword in Tag
                  </span>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
