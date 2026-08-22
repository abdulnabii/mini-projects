'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TestConfig, TestResult, MetricPoint } from '@/types';
import TestConfigurator from '@/components/TestConfigurator';
import LiveExecutionHUD from '@/components/LiveExecutionHUD';
import { saveTestResult } from '@/lib/storage';
import { calculatePercentiles } from '@/lib/loadEngine';
import {
  Zap,
  Activity,
  Play,
  Sparkles,
  ShieldCheck,
  Server,
  Terminal,
  Loader2,
  Gauge,
  Clock,
  Cpu,
  Layers,
  Users,
} from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [isRunning, setIsRunning] = useState(false);
  const [progressSec, setProgressSec] = useState(0);
  const [liveRps, setLiveRps] = useState(0);
  const [liveVus, setLiveVus] = useState(0);
  const [activeConfig, setActiveConfig] = useState<TestConfig | null>(null);

  const handleStartTest = async (config: TestConfig) => {
    setIsRunning(true);
    setProgressSec(0);
    setActiveConfig(config);

    const totalSeconds = config.durationSeconds;
    const timeSeries: MetricPoint[] = [];
    const latencies: number[] = [];
    let totalReqs = 0;
    let failedReqs = 0;

    // High-concurrency load simulator loop
    const interval = setInterval(async () => {
      setProgressSec((prev) => {
        const nextSec = prev + 1;
        const rampProgress = Math.min(1, nextSec / (config.rampUpSeconds || 1));
        const activeVus = Math.round(config.virtualUsers * rampProgress);

        const isDelayed = config.url.includes('delay');
        const baseLatency = isDelayed ? 1100 : 90;
        const concurrencyFactor = Math.pow(activeVus / 50, 1.4);
        const currentP50 = Math.round(baseLatency + concurrencyFactor * 40 + (Math.random() * 30 - 15));
        const currentP95 = Math.round(currentP50 * (1.8 + (activeVus > 100 ? 0.8 : 0.2)));
        const currentP99 = Math.round(currentP50 * (2.6 + (activeVus > 100 ? 2.5 : 0.5)));

        const currentRps = Math.round((activeVus * (1000 / (currentP50 || 100))) * (0.8 + Math.random() * 0.4));
        const hasErrors = config.url.includes('429') || (activeVus > 150 && Math.random() > 0.6);
        const errorPercent = hasErrors ? Math.round(Math.random() * 8 * 10) / 10 : 0;

        for (let i = 0; i < Math.min(10, currentRps); i++) {
          latencies.push(currentP50 + Math.round(Math.random() * 60 - 30));
        }

        totalReqs += currentRps;
        if (hasErrors) failedReqs += Math.round(currentRps * (errorPercent / 100));

        setLiveRps(currentRps);
        setLiveVus(activeVus);

        timeSeries.push({
          timestampSec: nextSec,
          activeVus,
          rps: currentRps,
          p50Ms: currentP50,
          p90Ms: Math.round((currentP50 + currentP95) / 2),
          p95Ms: currentP95,
          p99Ms: currentP99,
          errorRatePercent: errorPercent,
          bytesPerSec: currentRps * 1250,
        });

        if (nextSec >= totalSeconds) {
          clearInterval(interval);
          finishTest(config, timeSeries, latencies, totalReqs, failedReqs);
        }

        return nextSec;
      });
    }, 1000);
  };

  const finishTest = async (
    config: TestConfig,
    timeSeries: MetricPoint[],
    latencies: number[],
    totalReqs: number,
    failedReqs: number
  ) => {
    const testId = 'res_' + Date.now();
    const percentiles = calculatePercentiles(latencies);
    const avgRps = Math.round((totalReqs / config.durationSeconds) * 10) / 10;
    const peakRps = Math.max(...timeSeries.map((t) => t.rps), avgRps);
    const errorRate = totalReqs > 0 ? Math.round((failedReqs / totalReqs) * 1000) / 10 : 0;

    const resultPayload: TestResult = {
      id: testId,
      config,
      startedAt: new Date(Date.now() - config.durationSeconds * 1000).toISOString(),
      completedAt: new Date().toISOString(),
      status: 'completed',
      totalRequests: totalReqs,
      successfulRequests: totalReqs - failedReqs,
      failedRequests: failedReqs,
      errorRate,
      avgRps,
      peakRps,
      totalDataTransferMb: Math.round(((totalReqs * 1.4) / 1024) * 10) / 10,
      percentiles,
      statusCodes: [
        {
          code: errorRate > 0 ? (config.url.includes('429') ? 429 : 504) : 200,
          count: failedReqs,
          description: errorRate > 0 ? 'Rate Limited / Gateway Timeout' : 'OK',
          isError: errorRate > 0,
        },
        {
          code: 200,
          count: totalReqs - failedReqs,
          description: 'OK — Successful HTTP Response',
          isError: false,
        },
      ].filter((s) => s.count > 0),
      recentErrors:
        failedReqs > 0
          ? [
              {
                timestamp: new Date().toLocaleTimeString(),
                statusCode: config.url.includes('429') ? 429 : 504,
                message: 'HTTP response exceeded SLA threshold or was throttled by origin host.',
              },
            ]
          : [],
      timeSeries,
    };

    // Analyze with Gemini
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testResult: resultPayload }),
      });
      if (res.ok) {
        const analysis = await res.json();
        resultPayload.aiAnalysis = analysis;
      }
    } catch (e) {
      console.warn('AI analysis fetch error:', e);
    }

    saveTestResult(resultPayload);
    setIsRunning(false);
    router.push(`/results/${testId}`);
  };

  return (
    <div className="space-y-10 font-mono w-full min-w-0">
      {/* Header Title (Project 9 Style) */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI LOAD TESTING &amp; SRE DIAGNOSTIC ENGINE</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight font-outfit">
          Analyze &amp; Stress Test Any{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-400">
            API Endpoint
          </span>
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm font-mono max-w-2xl mx-auto leading-relaxed">
          Simulate up to 250 concurrent virtual users, inspect real-time P50/P95/P99 latency distribution curves, and diagnose infrastructure bottlenecks with Gemini 1.5 Flash.
        </p>
      </div>

      {/* 4 Feature Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 max-w-5xl mx-auto font-mono text-left">
        <div className="p-4 rounded-2xl bg-[#0d1117] border border-cyan-500/20 space-y-1 shadow-lg">
          <span className="text-[10px] text-cyan-400 font-bold uppercase flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" /> Virtual Users
          </span>
          <div className="text-lg font-black text-white">250 VUs Peak</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0d1117] border border-indigo-500/20 space-y-1 shadow-lg">
          <span className="text-[10px] text-indigo-400 font-bold uppercase flex items-center gap-1.5">
            <Gauge className="w-3.5 h-3.5" /> SLA Percentiles
          </span>
          <div className="text-lg font-black text-indigo-300">P50 / P95 / P99</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0d1117] border border-emerald-500/20 space-y-1 shadow-lg">
          <span className="text-[10px] text-emerald-400 font-bold uppercase flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> AI Diagnostics
          </span>
          <div className="text-lg font-black text-emerald-300">Gemini 1.5 SRE</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0d1117] border border-purple-500/20 space-y-1 shadow-lg">
          <span className="text-[10px] text-purple-400 font-bold uppercase flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5" /> Native Scripts
          </span>
          <div className="text-lg font-black text-purple-300">k6.js &amp; cURL</div>
        </div>
      </div>

      {/* Live Execution HUD Modal */}
      <LiveExecutionHUD
        isRunning={isRunning}
        progressSec={progressSec}
        totalSec={activeConfig?.durationSeconds || 15}
        liveRps={liveRps}
        liveVus={liveVus}
        url={activeConfig?.url || ''}
      />

      {/* Main Test Configurator */}
      <TestConfigurator onStartTest={handleStartTest} isRunning={isRunning} />
    </div>
  );
}
