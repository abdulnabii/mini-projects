'use client';

import { KeywordDensityMetric } from '@/types';
import { Search, CheckCircle2, XCircle, AlertTriangle, Layers } from 'lucide-react';

interface Props {
  keywordDensity: KeywordDensityMetric;
}

export default function KeywordDensityCard({ keywordDensity }: Props) {
  const getStatusBadge = (status: KeywordDensityMetric['status']) => {
    if (status === 'optimal')
      return <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold">Optimal Density (0.8% - 2.8%)</span>;
    if (status === 'under-optimized')
      return <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold">Under-Optimized (&lt; 0.8%)</span>;
    return <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 font-bold">Keyword Stuffing Risk (&gt; 2.8%)</span>;
  };

  const locations = [
    { label: 'Page Title (H1 / Title Tag)', passed: keywordDensity.inTitle },
    { label: 'Opening 100 Words (Introduction)', passed: keywordDensity.inFirst100Words },
    { label: 'Subheadings (H2 / H3)', passed: keywordDensity.inH2Count > 0 },
    { label: 'Meta Description Tag', passed: keywordDensity.inMetaDescription },
  ];

  return (
    <div className="bg-[#0e1424] border border-emerald-500/30 rounded-3xl p-6 sm:p-8 space-y-6 font-mono text-xs text-slate-300 shadow-xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base font-outfit">Keyword Density &amp; Distribution</h3>
            <p className="text-xs text-slate-400">
              Focus Keyword: <strong className="text-emerald-300">"{keywordDensity.targetKeyword}"</strong>
            </p>
          </div>
        </div>

        <div>{getStatusBadge(keywordDensity.status)}</div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Left: Metrics & Locations */}
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-slate-400 text-[10px] font-bold uppercase block">Keyword Frequency</span>
              <span className="text-2xl font-black text-white font-outfit">
                {keywordDensity.occurrences} <span className="text-xs text-slate-500 font-normal">matches</span>
              </span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 text-[10px] font-bold uppercase block">Density %</span>
              <span className="text-2xl font-black text-emerald-400 font-outfit">
                {keywordDensity.densityPercent}%
              </span>
            </div>
          </div>

          {/* Location Checklist */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Strategic Placement Checklist
            </label>
            <div className="space-y-1.5">
              {locations.map((loc, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between"
                >
                  <span className="text-slate-300">{loc.label}</span>
                  {loc.passed ? (
                    <span className="flex items-center gap-1 text-emerald-400 font-bold text-[10px]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Found
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-rose-400 font-bold text-[10px]">
                      <XCircle className="w-3.5 h-3.5" />
                      Missing
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Secondary LSI Keywords */}
        <div className="space-y-3">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            Secondary &amp; LSI Keyword Frequency
          </label>

          {keywordDensity.secondaryKeywords.length > 0 ? (
            <div className="space-y-2">
              {keywordDensity.secondaryKeywords.map((sec, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-bold">{sec.keyword}</span>
                    <span className="text-indigo-300 font-bold">
                      {sec.occurrences}x ({sec.densityPercent}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-500 h-full rounded-full"
                      style={{ width: `${Math.min(100, sec.densityPercent * 40)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 p-4 text-center">No secondary keywords configured.</p>
          )}
        </div>
      </div>
    </div>
  );
}
