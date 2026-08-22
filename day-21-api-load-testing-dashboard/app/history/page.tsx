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
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Load Studio</span>
        </Link>

        <span className="text-xs font-mono text-cyan-400">
          {history.length} benchmark runs recorded
        </span>
      </div>

      {/* Hero */}
      <div className="p-6 sm:p-8 rounded-3xl glass-card border-2 border-cyan-500/30 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-cyan-400 uppercase font-mono tracking-wider">
            Regression &amp; Comparative Performance Engine
          </span>
          <h2 className="text-xl sm:text-3xl font-black text-white font-outfit">
            Load Test History &amp; Comparison Matrix
          </h2>
          <p className="text-xs text-slate-400">
            Select any 2 test runs to generate instant side-by-side latency &amp; RPS delta regression metrics
          </p>
        </div>
      </div>

      {/* Side-by-Side Comparison Box */}
      {testA && testB && (
        <div className="p-6 sm:p-8 rounded-3xl glass-card border-2 border-cyan-500/50 shadow-2xl space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
            <div className="flex items-center gap-2">
              <GitCompare className="w-5 h-5 text-cyan-400" />
              <h3 className="font-bold text-white text-base font-outfit">
                Side-by-Side Performance Comparison
              </h3>
            </div>
            <button
              onClick={() => setSelectedIds([])}
              className="text-xs text-slate-400 hover:text-white font-mono cursor-pointer"
            >
              Clear Comparison
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
            {/* Run A */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 font-bold uppercase text-[10px]">
                  Run A (Baseline)
                </span>
                <span className="text-slate-500 text-[10px]">{testA.config.virtualUsers} VUs</span>
              </div>
              <h4 className="font-bold text-white font-outfit text-sm line-clamp-1">{testA.config.title}</h4>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5">
                <div>
                  <span className="text-slate-500 text-[10px] block">Avg RPS</span>
                  <strong className="text-white text-sm">{testA.avgRps}</strong>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">P50 Latency</span>
                  <strong className="text-emerald-400 text-sm">{testA.percentiles.p50}ms</strong>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">P99 Tail</span>
                  <strong className="text-amber-400 text-sm">{testA.percentiles.p99}ms</strong>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Error Rate</span>
                  <strong className="text-rose-400 text-sm">{testA.errorRate}%</strong>
                </div>
              </div>
            </div>

            {/* Run B */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-cyan-500/40 space-y-3 shadow-lg shadow-cyan-500/10">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 font-bold uppercase text-[10px]">
                  Run B (Candidate)
                </span>
                <span className="text-slate-500 text-[10px]">{testB.config.virtualUsers} VUs</span>
              </div>
              <h4 className="font-bold text-white font-outfit text-sm line-clamp-1">{testB.config.title}</h4>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5">
                <div>
                  <span className="text-slate-500 text-[10px] block">Avg RPS</span>
                  <strong className="text-white text-sm">
                    {testB.avgRps}{' '}
                    <span className="text-[10px] text-emerald-400">
                      ({testB.avgRps >= testA.avgRps ? '+' : ''}
                      {Math.round(((testB.avgRps - testA.avgRps) / (testA.avgRps || 1)) * 100)}%)
                    </span>
                  </strong>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">P50 Latency</span>
                  <strong className="text-emerald-400 text-sm">
                    {testB.percentiles.p50}ms{' '}
                    <span className="text-[10px] text-cyan-400">
                      ({testB.percentiles.p50 - testA.percentiles.p50}ms)
                    </span>
                  </strong>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">P99 Tail</span>
                  <strong className="text-amber-400 text-sm">
                    {testB.percentiles.p99}ms{' '}
                    <span className="text-[10px] text-amber-400">
                      ({testB.percentiles.p99 - testA.percentiles.p99}ms)
                    </span>
                  </strong>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Error Rate</span>
                  <strong className="text-rose-400 text-sm">{testB.errorRate}%</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Historical List Table */}
      <div className="p-6 sm:p-8 rounded-3xl glass-card space-y-4">
        <h3 className="text-base font-black text-white font-outfit">
          Past Test Runs ({history.length})
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
                    : 'bg-slate-950/80 border-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-4">
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
                      <span className="text-[10px] text-slate-500 font-mono">
                        {new Date(run.completedAt).toLocaleString()}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {run.config.virtualUsers} VUs
                      </span>
                    </div>

                    <h4 className="font-bold text-white text-sm font-outfit">{run.config.title}</h4>
                    <p className="text-[11px] text-slate-400 font-mono line-clamp-1">{run.config.url}</p>
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
                      className="p-2 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white transition-colors"
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
    </div>
  );
}
