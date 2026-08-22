'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { TestResult } from '@/types';
import { getStoredTestHistory, deleteTestResult } from '@/lib/storage';
import {
  History,
  Trash2,
  ExternalLink,
  ArrowLeft,
  Zap,
  TrendingDown,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  ArrowRight,
  GitCompare,
  Play,
  Layers,
} from 'lucide-react';

export default function HistoryPage() {
  const [history, setHistory] = useState<TestResult[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    setHistory(getStoredTestHistory());
  }, []);

  const handleDelete = (id: string) => {
    const updated = deleteTestResult(id);
    setHistory(updated);
    setSelectedIds(selectedIds.filter((s) => s !== id));
  };

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((s) => s !== id));
    } else {
      if (selectedIds.length >= 2) {
        setSelectedIds([selectedIds[1], id]);
      } else {
        setSelectedIds([...selectedIds, id]);
      }
    }
  };

  const testA = history.find((h) => h.id === selectedIds[0]);
  const testB = history.find((h) => h.id === selectedIds[1]);

  return (
    <div className="space-y-8 font-sans w-full min-w-0">
      {/* Top Breadcrumbs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Load Studio</span>
        </Link>

        <span className="text-xs font-mono text-cyan-400 font-bold">
          {history.length} benchmark runs recorded
        </span>
      </div>

      {/* Hero Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#09152b] border-2 border-cyan-500/30 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-cyan-300 uppercase font-mono tracking-wider">
            Comparative Performance Engine
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white font-outfit">
            Load Test History &amp; Regression Matrix
          </h2>
          <p className="text-xs text-slate-300">
            Select any 2 benchmark runs to compute instant side-by-side latency &amp; throughput delta metrics
          </p>
        </div>

        <Link
          href="/"
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-extrabold text-xs shadow-md shadow-cyan-500/20 hover:scale-105 transition-all shrink-0 flex items-center gap-1.5"
        >
          <Play className="w-3.5 h-3.5 fill-black" />
          <span>New Benchmark</span>
        </Link>
      </div>

      {/* Empty State */}
      {history.length === 0 ? (
        <div className="p-12 sm:p-16 rounded-3xl bg-[#09152b] border border-white/10 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto">
            <History className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white font-outfit">No Test History Recorded Yet</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Run your first high-concurrency API benchmark from the Load Studio to start building your regression dataset.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            <Play className="w-4 h-4 fill-black" />
            <span>Launch First Benchmark</span>
          </Link>
        </div>
      ) : (
        <>
          {/* Side-by-Side Comparison Box */}
          {testA && testB && (
            <div className="p-6 sm:p-8 rounded-3xl bg-[#09152b] border-2 border-cyan-500/50 shadow-2xl space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4">
                <div className="flex items-center gap-2">
                  <GitCompare className="w-5 h-5 text-cyan-400" />
                  <h3 className="font-bold text-white text-base font-outfit">
                    Side-by-Side Performance Delta Matrix
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedIds([])}
                  className="text-xs text-slate-300 hover:text-white font-mono cursor-pointer underline"
                >
                  Clear Comparison
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
                {/* Run A */}
                <div className="p-5 rounded-2xl bg-slate-950 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 font-bold uppercase text-[10px]">
                      Run A (Baseline)
                    </span>
                    <span className="text-slate-400 text-[10px]">{testA.config.virtualUsers} VUs</span>
                  </div>
                  <h4 className="font-bold text-white font-outfit text-sm line-clamp-1">{testA.config.title}</h4>

                  <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-white/5">
                    <div>
                      <span className="text-slate-400 text-[10px] block">Avg RPS</span>
                      <strong className="text-white text-sm">{testA.avgRps}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">P50 Latency</span>
                      <strong className="text-emerald-400 text-sm">{testA.percentiles.p50}ms</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">P99 Tail</span>
                      <strong className="text-amber-400 text-sm">{testA.percentiles.p99}ms</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">Error Rate</span>
                      <strong className="text-rose-400 text-sm">{testA.errorRate}%</strong>
                    </div>
                  </div>
                </div>

                {/* Run B */}
                <div className="p-5 rounded-2xl bg-slate-950 border-2 border-cyan-500/40 space-y-3 shadow-lg shadow-cyan-500/10">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 font-bold uppercase text-[10px]">
                      Run B (Candidate)
                    </span>
                    <span className="text-slate-400 text-[10px]">{testB.config.virtualUsers} VUs</span>
                  </div>
                  <h4 className="font-bold text-white font-outfit text-sm line-clamp-1">{testB.config.title}</h4>

                  <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-white/5">
                    <div>
                      <span className="text-slate-400 text-[10px] block">Avg RPS</span>
                      <strong className="text-white text-sm">
                        {testB.avgRps}{' '}
                        <span className="text-[10px] text-emerald-400 font-bold">
                          ({testB.avgRps >= testA.avgRps ? '+' : ''}
                          {Math.round(((testB.avgRps - testA.avgRps) / (testA.avgRps || 1)) * 100)}%)
                        </span>
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">P50 Latency</span>
                      <strong className="text-emerald-400 text-sm">
                        {testB.percentiles.p50}ms{' '}
                        <span className="text-[10px] text-cyan-400 font-bold">
                          ({testB.percentiles.p50 - testA.percentiles.p50}ms)
                        </span>
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">P99 Tail</span>
                      <strong className="text-amber-400 text-sm">
                        {testB.percentiles.p99}ms{' '}
                        <span className="text-[10px] text-amber-400 font-bold">
                          ({testB.percentiles.p99 - testA.percentiles.p99}ms)
                        </span>
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">Error Rate</span>
                      <strong className="text-rose-400 text-sm">{testB.errorRate}%</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Past Runs Table */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#09152b] border border-white/10 space-y-4">
            <h3 className="text-base font-bold text-white font-outfit">
              Recorded Test Runs ({history.length})
            </h3>

            <div className="space-y-3">
              {history.map((run) => {
                const isSelected = selectedIds.includes(run.id);
                return (
                  <div
                    key={run.id}
                    className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                      isSelected
                        ? 'bg-cyan-950/40 border-cyan-400 shadow-lg shadow-cyan-500/10'
                        : 'bg-slate-950 border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelect(run.id)}
                        className="accent-cyan-400 w-4 h-4 cursor-pointer"
                        title="Select to compare"
                      />

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 font-mono text-[9px] font-bold uppercase">
                            {run.config.method}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {new Date(run.completedAt).toLocaleString()}
                          </span>
                          <span className="text-[10px] text-slate-300 font-mono font-bold">
                            {run.config.virtualUsers} VUs
                          </span>
                        </div>

                        <h4 className="font-bold text-white text-sm font-outfit">{run.config.title}</h4>
                        <p className="text-[11px] text-slate-300 font-mono line-clamp-1">{run.config.url}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-white/5">
                      <div className="flex items-center gap-3 text-xs font-mono font-bold">
                        <span className="text-white">{run.avgRps} RPS</span>
                        <span className="text-emerald-400">P50: {run.percentiles.p50}ms</span>
                        <span className="text-amber-400">P99: {run.percentiles.p99}ms</span>
                        <span className={run.errorRate > 0 ? 'text-rose-400' : 'text-emerald-400'}>
                          {run.errorRate}% err
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          href={`/results/${run.id}`}
                          className="p-2 rounded-xl bg-slate-900 border border-white/10 text-slate-200 hover:text-white transition-colors"
                          title="View full results"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>

                        <button
                          onClick={() => handleDelete(run.id)}
                          className="p-2 rounded-xl bg-slate-900 border border-white/10 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                          title="Delete entry"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
