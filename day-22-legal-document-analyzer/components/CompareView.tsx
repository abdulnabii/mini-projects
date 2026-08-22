'use client';

import { useState } from 'react';
import { VersionDiff } from '@/types';
import { SAMPLE_CONTRACTS } from '@/lib/sampleContracts';
import {
  GitCompare,
  ArrowRight,
  PlusCircle,
  MinusCircle,
  AlertTriangle,
  Sparkles,
  Loader2,
  CheckCircle2,
  FileText,
} from 'lucide-react';

export default function CompareView() {
  const [v1Text, setV1Text] = useState(SAMPLE_CONTRACTS[0].rawText);
  const [v2Text, setV2Text] = useState(
    `EMPLOYMENT AND CONFIDENTIALITY AGREEMENT (REVISED DRAFT)

1. POSITION AND DUTIES
Employee shall serve as Senior Software Engineer on a standard full-time basis.

2. INTELLECTUAL PROPERTY ASSIGNMENT (AMENDED)
Employee assigns to the Company inventions, designs, and code authored by Employee during regular working hours, utilizing Company hardware or software resources, and directly relating to the Company's active commercial products. All pre-existing inventions and personal side-projects listed on Schedule A remain Employee's exclusive property.

3. NON-COMPETE COVENANT (AMENDED)
For a period of six (6) months following departure, Employee shall not work for direct enterprise competitor software platforms within a 50-mile geographic radius.

4. TERMINATION AND NOTICE
Either party may terminate employment upon thirty (30) days advance written notice, or payment of thirty (30) days salary in lieu of notice.

5. GOVERNING LAW & ARBITRATION
Governed by the laws of Delaware, with dispute costs shared equally.`
  );

  const [isLoading, setIsLoading] = useState(false);
  const [diffResult, setDiffResult] = useState<VersionDiff | null>(null);

  const handleRunComparison = async () => {
    if (!v1Text.trim() || !v2Text.trim() || isLoading) return;
    setIsLoading(true);

    try {
      const res = await fetch('/api/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ v1Text, v2Text }),
      });

      const data = await res.json();
      setDiffResult(data);
    } catch (e) {
      console.error('Comparison error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 font-mono w-full min-w-0">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0d1117] border border-amber-500/30 shadow-2xl space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs">
          <GitCompare className="w-3.5 h-3.5" />
          <span>REDLINE VERSION COMPARATOR</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white font-outfit">
          Compare Contract Versions &amp; Tracked Changes
        </h2>
        <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
          Paste the initial draft alongside the counterparty proposal to instantly detect hidden insertions, deleted safeguards, and modified legal clauses.
        </p>
      </div>

      {/* 2-Column Text Input */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Version 1 */}
        <div className="bg-[#0d1117] border border-slate-800 rounded-3xl p-5 space-y-3 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              Version 1 (Original / Initial Draft)
            </span>
            <span className="text-[10px] text-slate-500">{v1Text.length} chars</span>
          </div>

          <textarea
            value={v1Text}
            onChange={(e) => setV1Text(e.target.value)}
            rows={12}
            placeholder="Paste Version 1 text here..."
            className="w-full bg-[#161b22] border border-slate-800 rounded-2xl p-4 text-xs text-slate-200 placeholder-slate-600 focus:outline-none font-mono leading-relaxed"
          />
        </div>

        {/* Version 2 */}
        <div className="bg-[#0d1117] border border-slate-800 rounded-3xl p-5 space-y-3 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              Version 2 (Revised / Counterparty Proposal)
            </span>
            <span className="text-[10px] text-slate-500">{v2Text.length} chars</span>
          </div>

          <textarea
            value={v2Text}
            onChange={(e) => setV2Text(e.target.value)}
            rows={12}
            placeholder="Paste Version 2 text here..."
            className="w-full bg-[#161b22] border border-slate-800 rounded-2xl p-4 text-xs text-slate-200 placeholder-slate-600 focus:outline-none font-mono leading-relaxed"
          />
        </div>
      </div>

      {/* Action Button */}
      <div className="text-center">
        <button
          type="button"
          onClick={handleRunComparison}
          disabled={!v1Text.trim() || !v2Text.trim() || isLoading}
          className="px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 hover:from-amber-300 hover:to-orange-400 text-black font-black text-sm shadow-xl shadow-amber-500/20 hover:scale-105 transition-all cursor-pointer disabled:opacity-40"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Analyzing Redline Differences...</span>
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>Run Redline Diff Analysis</span>
            </span>
          )}
        </button>
      </div>

      {/* Diff Results Display */}
      {diffResult && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0d1117] border border-cyan-500/30 space-y-6 shadow-2xl animate-in fade-in duration-300">
          <div className="space-y-2 border-b border-slate-800 pb-4">
            <span className="text-[10px] text-cyan-400 font-bold uppercase">Executive Redline Summary</span>
            <h3 className="text-xl font-bold text-white font-outfit">Comparison Findings</h3>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">{diffResult.summary}</p>
          </div>

          {/* Added & Removed Clauses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Added */}
            <div className="p-5 rounded-2xl bg-[#06140e] border border-emerald-500/30 space-y-2.5">
              <h4 className="text-xs font-bold text-emerald-400 uppercase flex items-center gap-1.5">
                <PlusCircle className="w-4 h-4" />
                New Clauses Introduced in V2 ({diffResult.addedClauses.length})
              </h4>
              <ul className="text-xs text-slate-200 font-sans space-y-2 list-disc list-inside leading-relaxed">
                {diffResult.addedClauses.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>

            {/* Removed */}
            <div className="p-5 rounded-2xl bg-[#140608] border border-rose-500/30 space-y-2.5">
              <h4 className="text-xs font-bold text-rose-400 uppercase flex items-center gap-1.5">
                <MinusCircle className="w-4 h-4" />
                Clauses Deleted from V1 ({diffResult.removedClauses.length})
              </h4>
              <ul className="text-xs text-slate-200 font-sans space-y-2 list-disc list-inside leading-relaxed">
                {diffResult.removedClauses.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Modified Clauses Breakdown */}
          {diffResult.modifiedClauses && diffResult.modifiedClauses.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white font-outfit">
                Modified Clauses &amp; Favorability Shifts ({diffResult.modifiedClauses.length})
              </h4>

              <div className="space-y-3">
                {diffResult.modifiedClauses.map((mod, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-[#161b22] border border-slate-800 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <h5 className="font-bold text-white text-xs">{mod.title}</h5>
                      <span
                        className={`px-2.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                          mod.favorability === 'MORE_FAVORABLE'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : mod.favorability === 'LESS_FAVORABLE'
                            ? 'bg-rose-500/20 text-rose-400'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {mod.favorability.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-400 space-y-1">
                        <span className="text-[10px] text-slate-500 font-bold block">ORIGINAL (V1):</span>
                        <p className="line-through text-slate-400">{mod.original}</p>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-950/80 border border-cyan-500/30 text-cyan-200 space-y-1">
                        <span className="text-[10px] text-cyan-400 font-bold block">REVISED (V2):</span>
                        <p>{mod.modified}</p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 font-sans">{mod.explanation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
