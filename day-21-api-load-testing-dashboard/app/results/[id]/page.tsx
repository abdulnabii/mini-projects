'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { TestResult } from '@/types';
import { getTestResultById } from '@/lib/storage';
import { BENCHMARK_PRESETS } from '@/lib/sampleBenchmarks';
import LiveThroughputChart from '@/components/LiveThroughputChart';
import LatencyPercentileCurve from '@/components/LatencyPercentileCurve';
import StatusCodeDonut from '@/components/StatusCodeDonut';
import AIBottleneckDiagnostic from '@/components/AIBottleneckDiagnostic';
import K6ScriptExporter from '@/components/K6ScriptExporter';
import ExportReportModal from '@/components/ExportReportModal';
import {
  ArrowLeft,
  Share2,
  FileText,
  Play,
  RotateCcw,
  Sparkles,
  Zap,
  Activity,
  Flame,
  CheckCircle2,
  AlertTriangle,
  XCircle,
} from 'lucide-react';

export default function TestResultPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [result, setResult] = useState<TestResult | null>(null);
  const [isExportOpen, setIsExportOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    const stored = getTestResultById(id);
    if (stored) {
      setResult(stored);
    } else {
      // Check preset mocks
      const preset = BENCHMARK_PRESETS.find((p) => p.mockResult.id === id);
      if (preset) {
        setResult(preset.mockResult);
      } else {
        setResult(BENCHMARK_PRESETS[0].mockResult);
      }
    }
  }, [id]);

  if (!result) {
    return (
      <div className="p-16 text-center space-y-4 font-sans">
        <div className="w-8 h-8 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin mx-auto" />
        <p className="text-sm text-slate-400">Loading benchmark telemetry...</p>
      </div>
    );
  }

  const p = result.percentiles;

  return (
    <div className="space-y-8 font-sans">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Load Studio</span>
        </Link>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setIsExportOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 border border-white/10 hover:border-cyan-500/40 text-xs font-bold text-white transition-all cursor-pointer"
          >
            <FileText className="w-4 h-4 text-cyan-400" />
            <span>Export Stakeholder Report</span>
          </button>

          <Link
            href="/"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-extrabold text-xs shadow-md shadow-cyan-500/20 hover:scale-105 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Rerun Test</span>
          </Link>
        </div>
      </div>

      {/* Main Results Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl glass-card border-2 border-cyan-500/30 shadow-2xl space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-[10px] font-bold border border-cyan-500/30 uppercase">
                {result.config.method}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {result.config.virtualUsers} VUs • {result.config.durationSeconds}s Duration • {result.config.loadProfile.replace('_', ' ')}
              </span>
            </div>
            <h2 className="text-xl sm:text-3xl font-black text-white font-outfit">
              {result.config.title}
            </h2>
            <p className="text-xs font-mono text-slate-300 break-all">{result.config.url}</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 px-5 rounded-2xl bg-slate-950 border border-white/10 text-center">
              <span className="text-2xl font-black font-mono text-cyan-400 leading-none">
                {result.avgRps}
              </span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mt-1">
                Avg RPS
              </span>
            </div>

            <div className="p-3 px-5 rounded-2xl bg-slate-950 border border-white/10 text-center">
              <span className="text-2xl font-black font-mono text-emerald-400 leading-none">
                {p.p50}ms
              </span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mt-1">
                P50 Median
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Summary Telemetry Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        <div className="p-5 rounded-2xl glass-card space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Total Requests</span>
          <div className="text-2xl font-black text-white">
            {result.totalRequests.toLocaleString()}
          </div>
          <span className="text-[10px] text-emerald-400">
            {result.successfulRequests.toLocaleString()} succeeded
          </span>
        </div>

        <div className="p-5 rounded-2xl glass-card space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Peak Throughput</span>
          <div className="text-2xl font-black text-cyan-400">
            {result.peakRps} <span className="text-xs font-normal text-slate-500">RPS</span>
          </div>
          <span className="text-[10px] text-slate-400">Avg: {result.avgRps} RPS</span>
        </div>

        <div className="p-5 rounded-2xl glass-card space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase">P99 Tail SLA</span>
          <div className="text-2xl font-black text-amber-400">
            {p.p99} <span className="text-xs font-normal text-slate-500">ms</span>
          </div>
          <span className="text-[10px] text-slate-400">P95: {p.p95}ms</span>
        </div>

        <div className="p-5 rounded-2xl glass-card space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Error Rate</span>
          <div className={`text-2xl font-black ${result.errorRate > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
            {result.errorRate}%
          </div>
          <span className="text-[10px] text-slate-400">
            {result.failedRequests} failed requests
          </span>
        </div>
      </div>

      {/* Live Charts (Throughput & Latency Curve) */}
      <div className="grid grid-cols-1 gap-6">
        <LiveThroughputChart
          data={result.timeSeries}
          peakRps={result.peakRps}
          avgRps={result.avgRps}
        />

        <LatencyPercentileCurve
          percentiles={result.percentiles}
          timeSeries={result.timeSeries}
        />
      </div>

      {/* Status Codes & Error Log */}
      <StatusCodeDonut
        statusCodes={result.statusCodes}
        recentErrors={result.recentErrors}
        errorRate={result.errorRate}
        totalRequests={result.totalRequests}
      />

      {/* Gemini AI Root-Cause Diagnostic Studio */}
      <AIBottleneckDiagnostic analysis={result.aiAnalysis} />

      {/* Native k6 / cURL Script Exporter */}
      <K6ScriptExporter config={result.config} />

      {/* Export Report Modal */}
      <ExportReportModal
        result={result}
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />
    </div>
  );
}
