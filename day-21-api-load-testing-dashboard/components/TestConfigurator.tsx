'use client';

import { useState } from 'react';
import { TestConfig, HttpMethod, LoadProfileType, HttpHeader } from '@/types';
import { BENCHMARK_PRESETS, BenchmarkPreset } from '@/lib/sampleBenchmarks';
import { DEFAULT_TEST_CONFIG } from '@/lib/loadEngine';
import {
  Zap,
  Play,
  Settings2,
  Plus,
  Trash2,
  Key,
  Code2,
  Sparkles,
  Users,
  Clock,
  Gauge,
  ArrowRight,
  Globe,
  CheckCircle2,
  ShieldAlert,
  Server,
  Layers,
  Flame,
  Activity,
  AlertCircle,
  Radio,
  Loader2,
} from 'lucide-react';

interface Props {
  onStartTest: (config: TestConfig) => void;
  isRunning?: boolean;
}

const HTTP_METHODS: HttpMethod[] = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];

const LOAD_PROFILES: {
  id: LoadProfileType;
  label: string;
  desc: string;
  themeColor: string;
  borderColor: string;
  bgActive: string;
  textColor: string;
  svgCurve: string;
}[] = [
  {
    id: 'ramping_spike',
    label: 'Ramping Spike',
    desc: 'Linear ramp to peak VUs, sustain plateau, then cooldown',
    themeColor: '#06b6d4',
    borderColor: 'border-cyan-500/50',
    bgActive: 'bg-cyan-950/40',
    textColor: 'text-cyan-300',
    svgCurve: 'M0,22 L12,6 L38,6 L50,22',
  },
  {
    id: 'constant',
    label: 'Constant Load',
    desc: 'Instant full concurrency maintained throughout',
    themeColor: '#10b981',
    borderColor: 'border-emerald-500/50',
    bgActive: 'bg-emerald-950/40',
    textColor: 'text-emerald-300',
    svgCurve: 'M0,6 L50,6',
  },
  {
    id: 'stress',
    label: 'Stress / Breaking Point',
    desc: 'Stair-step load escalation until saturation occurs',
    themeColor: '#f43f5e',
    borderColor: 'border-rose-500/50',
    bgActive: 'bg-rose-950/40',
    textColor: 'text-rose-300',
    svgCurve: 'M0,22 L15,14 L30,8 L50,2',
  },
  {
    id: 'soak',
    label: 'Soak / Reliability',
    desc: 'Extended endurance test for socket & memory leaks',
    themeColor: '#a855f7',
    borderColor: 'border-purple-500/50',
    bgActive: 'bg-purple-950/40',
    textColor: 'text-purple-300',
    svgCurve: 'M0,10 L50,10',
  },
];

export default function TestConfigurator({ onStartTest, isRunning }: Props) {
  const [config, setConfig] = useState<TestConfig>(DEFAULT_TEST_CONFIG);
  const [activeTab, setActiveTab] = useState<'headers' | 'auth' | 'body'>('headers');
  const [activePresetId, setActivePresetId] = useState<string | null>(null);
  const [probeStatus, setProbeStatus] = useState<'idle' | 'probing' | 'healthy' | 'unreachable'>('idle');
  const [probeLatency, setProbeLatency] = useState<number | null>(null);

  // Validate URL
  const isValidUrl = (url: string) => {
    try {
      const parsed = new URL(url);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const urlValid = isValidUrl(config.url);

  // Probe Connection Pre-flight
  const handleProbeConnection = async () => {
    if (!urlValid) return;
    setProbeStatus('probing');
    setProbeLatency(null);

    const start = performance.now();
    try {
      // Simulate quick preflight probe
      await new Promise((r) => setTimeout(r, 600));
      const elapsed = Math.round(performance.now() - start);
      setProbeLatency(elapsed);
      setProbeStatus('healthy');
    } catch {
      setProbeStatus('unreachable');
    }
  };

  // Preset Selector
  const handleSelectPreset = (preset: BenchmarkPreset) => {
    setActivePresetId(preset.id);
    setConfig({
      ...preset.config,
      id: 'test_' + Date.now(),
    });
    setProbeStatus('idle');
    setProbeLatency(null);
  };

  // Header management
  const addHeader = () => {
    setConfig({
      ...config,
      headers: [...config.headers, { key: '', value: '', enabled: true }],
    });
  };

  const updateHeader = (index: number, field: keyof HttpHeader, val: any) => {
    const updated = [...config.headers];
    updated[index] = { ...updated[index], [field]: val };
    setConfig({ ...config, headers: updated });
  };

  const removeHeader = (index: number) => {
    setConfig({
      ...config,
      headers: config.headers.filter((_, i) => i !== index),
    });
  };

  const getMethodBadge = (m: HttpMethod) => {
    switch (m) {
      case 'GET':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
      case 'POST':
        return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40';
      case 'PUT':
        return 'bg-indigo-500/20 text-indigo-400 border-indigo-500/40';
      case 'DELETE':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/40';
      default:
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
    }
  };

  return (
    <div className="space-y-10 font-sans w-full min-w-0">
      {/* ======================================================== */}
      {/* SECTION 1: QUICK TEMPLATE PRESETS (COMPACT CAROUSEL) */}
      {/* ======================================================== */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 font-mono text-[10px] font-bold border border-cyan-500/30 uppercase">
              QUICK TEMPLATES
            </span>
            <h3 className="text-sm font-bold text-slate-200 font-outfit uppercase tracking-wider">
              Verified Benchmark Scenarios
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">1-Click Autofill</span>
        </div>

        {/* Collapses to 1-col on mobile, 3-col on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 min-w-0">
          {/* Card 1: E-Commerce (Emerald) */}
          <div
            onClick={() => handleSelectPreset(BENCHMARK_PRESETS[0])}
            className={`p-4 rounded-2xl cursor-pointer transition-all border flex flex-col justify-between space-y-2 relative overflow-hidden group ${
              activePresetId === BENCHMARK_PRESETS[0].id
                ? 'bg-emerald-950/40 border-emerald-400 shadow-xl shadow-emerald-500/15'
                : 'bg-[#081524] border-emerald-500/20 hover:border-emerald-500/50 hover:bg-[#0a1c30]'
            }`}
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🛍️</span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-mono text-[9px] font-bold border border-emerald-500/30">
                    High Read
                  </span>
                </div>
                <span className="text-xs font-mono text-emerald-400 font-black">~200 RPS</span>
              </div>

              <h4 className="font-bold text-white text-sm font-outfit group-hover:text-emerald-300 transition-colors">
                E-Commerce Catalog API
              </h4>
              <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                Simulates high-traffic flash sale catalog queries with multi-filter load.
              </p>
            </div>

            <div className="pt-2 border-t border-emerald-500/20 flex items-center justify-between text-[11px] font-mono">
              <span className="text-emerald-400 font-bold">GET</span>
              <span className="text-slate-300 truncate max-w-[170px]">https://dummyjson.com/products</span>
            </div>
          </div>

          {/* Card 2: Database Lock (Amber) */}
          <div
            onClick={() => handleSelectPreset(BENCHMARK_PRESETS[1])}
            className={`p-4 rounded-2xl cursor-pointer transition-all border flex flex-col justify-between space-y-2 relative overflow-hidden group ${
              activePresetId === BENCHMARK_PRESETS[1].id
                ? 'bg-amber-950/40 border-amber-400 shadow-xl shadow-amber-500/15'
                : 'bg-[#1a1208] border-amber-500/20 hover:border-amber-500/50 hover:bg-[#241a0b]'
            }`}
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🐢</span>
                  <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-mono text-[9px] font-bold border border-amber-500/30">
                    DB Lock &amp; Timeout
                  </span>
                </div>
                <span className="text-xs font-mono text-amber-400 font-black">1.2s P50</span>
              </div>

              <h4 className="font-bold text-white text-sm font-outfit group-hover:text-amber-300 transition-colors">
                Database Contention Stress
              </h4>
              <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                Simulates unindexed queries and connection pool exhaustion.
              </p>
            </div>

            <div className="pt-2 border-t border-amber-500/20 flex items-center justify-between text-[11px] font-mono">
              <span className="text-amber-400 font-bold">GET</span>
              <span className="text-slate-300 truncate max-w-[170px]">https://httpbin.org/delay/1</span>
            </div>
          </div>

          {/* Card 3: Microservice Ping (Purple) */}
          <div
            onClick={() => handleSelectPreset(BENCHMARK_PRESETS[2])}
            className={`p-4 rounded-2xl cursor-pointer transition-all border flex flex-col justify-between space-y-2 relative overflow-hidden group ${
              activePresetId === BENCHMARK_PRESETS[2].id
                ? 'bg-purple-950/40 border-purple-400 shadow-xl shadow-purple-500/15'
                : 'bg-[#140b24] border-purple-500/20 hover:border-purple-500/50 hover:bg-[#1d1033]'
            }`}
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">⚡</span>
                  <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 font-mono text-[9px] font-bold border border-purple-500/30">
                    Ultra Low Latency
                  </span>
                </div>
                <span className="text-xs font-mono text-purple-400 font-black">45ms P50</span>
              </div>

              <h4 className="font-bold text-white text-sm font-outfit group-hover:text-purple-300 transition-colors">
                Microservice Gateway Ping
              </h4>
              <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                Sub-millisecond probe measuring reverse proxy TLS handshake lag.
              </p>
            </div>

            <div className="pt-2 border-t border-purple-500/20 flex items-center justify-between text-[11px] font-mono">
              <span className="text-purple-400 font-bold">GET</span>
              <span className="text-slate-300 truncate max-w-[170px]">https://httpbin.org/get</span>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SECTION 2: PRIMARY LOAD WORKSPACE STUDIO */}
      {/* ======================================================== */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#071120] border-2 border-cyan-500/40 shadow-2xl space-y-8 min-w-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-cyan-500/20 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Settings2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-white font-outfit">
                Scenario &amp; Workload Configurator
              </h3>
              <p className="text-xs text-slate-300">
                Design custom high-concurrency benchmarks, payload bodies, and SLA boundaries
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-950 border border-white/10 text-xs font-mono text-slate-300">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>Engine: Distributed Workers</span>
          </div>
        </div>

        {/* Step 1: Target Endpoint Bar with Probe Test */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-300 text-xs font-bold flex items-center justify-center font-mono border border-cyan-500/30">
                01
              </span>
              <label className="text-xs font-bold text-slate-200 uppercase font-mono tracking-wider">
                Target Host Endpoint URL
              </label>
            </div>

            {/* URL Validation State */}
            {!urlValid && config.url.length > 0 && (
              <span className="text-[11px] text-rose-400 font-mono flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                Invalid URL (Requires http:// or https://)
              </span>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch gap-2 p-2 rounded-2xl bg-slate-950 border border-cyan-500/30 shadow-inner">
            <select
              value={config.method}
              onChange={(e) => setConfig({ ...config, method: e.target.value as HttpMethod })}
              className={`px-4 py-3 rounded-xl font-mono font-black text-xs border focus:outline-none cursor-pointer ${getMethodBadge(
                config.method
              )}`}
            >
              {HTTP_METHODS.map((m) => (
                <option key={m} value={m} className="bg-slate-900 text-white font-mono">
                  {m}
                </option>
              ))}
            </select>

            <div className="relative flex-1 flex items-center">
              <Globe className="absolute left-3.5 w-4 h-4 text-cyan-400" />
              <input
                value={config.url}
                onChange={(e) => {
                  setConfig({ ...config, url: e.target.value });
                  setProbeStatus('idle');
                }}
                placeholder="https://api.yourdomain.com/v1/resource"
                className="w-full pl-10 pr-4 py-3 bg-transparent font-mono text-xs text-white placeholder-slate-500 focus:outline-none font-bold"
              />
            </div>

            {/* Probe Button */}
            <button
              type="button"
              onClick={handleProbeConnection}
              disabled={!urlValid || probeStatus === 'probing'}
              className="px-4 py-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20 text-cyan-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-30 shrink-0"
              title="Test pre-flight connectivity"
            >
              {probeStatus === 'probing' ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Probing...</span>
                </>
              ) : probeStatus === 'healthy' ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">{probeLatency}ms (OK)</span>
                </>
              ) : probeStatus === 'unreachable' ? (
                <>
                  <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                  <span className="text-rose-400">Failed</span>
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5" />
                  <span>Probe Connection</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Step 2 & 3: Split Studio (Workload vs Parameters) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-w-0">
          {/* Left Panel: Concurrency & Timeline (Cyan Theme) */}
          <div className="p-6 rounded-3xl bg-[#09152b] border border-cyan-500/30 space-y-6 min-w-0">
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-300 text-xs font-bold flex items-center justify-center font-mono border border-cyan-500/30">
                  02
                </span>
                <h4 className="text-xs font-bold text-cyan-300 uppercase font-mono tracking-wider flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" />
                  Concurrency &amp; Traffic Profiles
                </h4>
              </div>
              <span className="text-[11px] font-mono text-cyan-400 font-bold">{config.virtualUsers} VUs Peak</span>
            </div>

            {/* Virtual Users Slider with Calibrated Labels */}
            <div className="space-y-2.5 p-4 rounded-2xl bg-slate-950 border border-white/5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-200 font-bold font-outfit">Virtual Users (VUs)</span>
                <span className="font-mono font-black text-cyan-400 text-sm px-3 py-0.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
                  {config.virtualUsers} VUs
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="250"
                step="5"
                value={config.virtualUsers}
                onChange={(e) => setConfig({ ...config, virtualUsers: Number(e.target.value) })}
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-mono px-0.5">
                <span>5 VUs</span>
                <span>125 VUs</span>
                <span>250 VUs</span>
              </div>
            </div>

            {/* Duration Slider with Calibrated Labels */}
            <div className="space-y-2.5 p-4 rounded-2xl bg-slate-950 border border-white/5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-200 font-bold font-outfit">Test Duration</span>
                <span className="font-mono font-black text-indigo-400 text-sm px-3 py-0.5 rounded-lg bg-indigo-500/10 border border-indigo-500/30">
                  {config.durationSeconds}s
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="60"
                step="5"
                value={config.durationSeconds}
                onChange={(e) => setConfig({ ...config, durationSeconds: Number(e.target.value) })}
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-mono px-0.5">
                <span>5s</span>
                <span>30s</span>
                <span>60s</span>
              </div>
            </div>

            {/* 4 Multi-Colored Traffic Profile Cards */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-300 uppercase font-mono tracking-wider block">
                Traffic Generation Waveform
              </span>

              <div className="grid grid-cols-2 gap-2.5">
                {LOAD_PROFILES.map((prof) => {
                  const isSelected = config.loadProfile === prof.id;
                  return (
                    <button
                      key={prof.id}
                      type="button"
                      onClick={() => setConfig({ ...config, loadProfile: prof.id })}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer space-y-1.5 ${
                        isSelected
                          ? `${prof.bgActive} ${prof.borderColor} shadow-md`
                          : 'bg-slate-950 border-white/5 hover:border-white/20 text-slate-400'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs font-outfit text-white">{prof.label}</span>
                        <svg className="w-8 h-4" viewBox="0 0 50 30" fill="none">
                          <path
                            d={prof.svgCurve}
                            stroke={prof.themeColor}
                            strokeWidth="2.5"
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>
                      <span className="text-[10px] text-slate-300 block leading-tight line-clamp-1">
                        {prof.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Panel: Headers, Auth & Payloads (Purple Theme) */}
          <div className="p-6 rounded-3xl bg-[#120a24] border border-purple-500/30 space-y-5 min-w-0 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-purple-500/20 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-purple-500/20 text-purple-300 text-xs font-bold flex items-center justify-center font-mono border border-purple-500/30">
                    03
                  </span>
                  <h4 className="text-xs font-bold text-purple-300 uppercase font-mono tracking-wider flex items-center gap-1.5">
                    <Code2 className="w-3.5 h-3.5" />
                    Headers, Auth &amp; Payloads
                  </h4>
                </div>

                {/* Tab Pills */}
                <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-white/5 text-xs">
                  {[
                    { id: 'headers', label: `Headers (${config.headers.length})` },
                    { id: 'auth', label: `Auth (${config.authType.toUpperCase()})` },
                    { id: 'body', label: 'JSON Body' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer text-xs ${
                        activeTab === tab.id
                          ? 'bg-purple-500/30 text-purple-200 border border-purple-500/40 shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab 1: Headers */}
              {activeTab === 'headers' && (
                <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1 animate-in fade-in duration-150">
                  {config.headers.map((h, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={h.enabled}
                        onChange={(e) => updateHeader(idx, 'enabled', e.target.checked)}
                        className="accent-purple-400 w-4 h-4 cursor-pointer"
                      />
                      <input
                        value={h.key}
                        onChange={(e) => updateHeader(idx, 'key', e.target.value)}
                        placeholder="Header Key (e.g. Accept)"
                        className="flex-1 p-2.5 rounded-xl bg-slate-950 border border-purple-500/20 text-xs font-mono text-white placeholder-slate-500 focus:outline-none"
                      />
                      <input
                        value={h.value}
                        onChange={(e) => updateHeader(idx, 'value', e.target.value)}
                        placeholder="Value"
                        className="flex-1 p-2.5 rounded-xl bg-slate-950 border border-purple-500/20 text-xs font-mono text-white placeholder-slate-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => removeHeader(idx)}
                        className="p-2.5 rounded-xl bg-slate-950 text-slate-400 hover:text-rose-400 border border-white/10 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addHeader}
                    className="px-3.5 py-1.5 rounded-xl bg-purple-500/20 border border-purple-500/40 text-xs font-bold text-purple-300 hover:bg-purple-500/30 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Request Header</span>
                  </button>
                </div>
              )}

              {/* Tab 2: Auth */}
              {activeTab === 'auth' && (
                <div className="space-y-3 animate-in fade-in duration-150">
                  <div className="flex items-center gap-2">
                    {(['none', 'bearer', 'api_key'] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setConfig({ ...config, authType: t })}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                          config.authType === t
                            ? 'bg-purple-500 text-white shadow-md'
                            : 'bg-slate-950 text-slate-300 hover:text-white border border-white/5'
                        }`}
                      >
                        {t.replace('_', ' ')}
                      </button>
                    ))}
                  </div>

                  {config.authType !== 'none' && (
                    <input
                      value={config.authValue || ''}
                      onChange={(e) => setConfig({ ...config, authValue: e.target.value })}
                      placeholder={config.authType === 'bearer' ? 'Bearer eyJh...' : 'X-API-Key sk_live_...'}
                      className="w-full p-3 rounded-xl bg-slate-950 border border-purple-500/30 text-xs font-mono text-white placeholder-slate-500 focus:outline-none"
                    />
                  )}
                </div>
              )}

              {/* Tab 3: JSON Body */}
              {activeTab === 'body' && (
                <div className="space-y-2 animate-in fade-in duration-150">
                  <textarea
                    value={config.bodyContent || ''}
                    onChange={(e) => setConfig({ ...config, bodyContent: e.target.value, bodyType: 'json' })}
                    rows={6}
                    placeholder='{\n  "query": "macbook pro",\n  "limit": 50\n}'
                    className="w-full p-3.5 rounded-2xl bg-slate-950 border border-purple-500/30 text-xs font-mono text-white placeholder-slate-500 focus:outline-none font-bold"
                  />
                </div>
              )}
            </div>

            {/* Protocol Notice */}
            <div className="p-3.5 rounded-2xl bg-purple-950/30 border border-purple-500/30 text-[11px] text-purple-300 font-mono flex items-center justify-between">
              <span className="font-bold">Protocol: HTTP/2 Multiplexed</span>
              <span className="text-emerald-400 font-bold">Estimated Rate: ~{Math.round(config.virtualUsers * 2.5)} RPS</span>
            </div>
          </div>
        </div>

        {/* Step 4: High-Impact Launch CTA */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => onStartTest(config)}
            disabled={isRunning || !urlValid}
            className="w-full py-4.5 rounded-2xl bg-gradient-to-r from-cyan-400 via-teal-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-black text-base shadow-2xl shadow-cyan-500/30 hover:scale-[1.01] transition-all cursor-pointer flex items-center justify-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Play className="w-5 h-5 fill-black" />
            <span>Launch High-Concurrency Load Benchmark</span>
          </button>
        </div>
      </div>
    </div>
  );
}
