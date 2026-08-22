'use client';

import { useState } from 'react';
import { TestConfig, HttpMethod, LoadProfileType, HttpHeader } from '@/types';
import { BENCHMARK_PRESETS, BenchmarkPreset } from '@/lib/sampleBenchmarks';
import { DEFAULT_TEST_CONFIG } from '@/lib/loadEngine';
import {
  Zap,
  Play,
  Sliders,
  Settings2,
  Plus,
  Trash2,
  Key,
  Code2,
  Layers,
  Sparkles,
  Users,
  Clock,
  Gauge,
  ArrowRight,
  ShieldAlert,
  Terminal,
  Activity,
  Globe,
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
  svgCurve: string;
}[] = [
  {
    id: 'ramping_spike',
    label: 'Ramping Spike',
    desc: 'Linear ramp to peak VUs, sustained plateau, followed by cooldown',
    svgCurve: 'M0,24 L10,8 L40,8 L50,24',
  },
  {
    id: 'constant',
    label: 'Constant Concurrency',
    desc: 'Instant full concurrency maintained steadily throughout duration',
    svgCurve: 'M0,8 L50,8',
  },
  {
    id: 'stress',
    label: 'Stress / Breaking Point',
    desc: 'Steep stair-step load escalation until server saturation occurs',
    svgCurve: 'M0,24 L15,16 L30,10 L50,4',
  },
  {
    id: 'soak',
    label: 'Soak / Reliability',
    desc: 'Extended endurance test for detecting memory leaks & connection decay',
    svgCurve: 'M0,12 L50,12',
  },
];

export default function TestConfigurator({ onStartTest, isRunning }: Props) {
  const [config, setConfig] = useState<TestConfig>(DEFAULT_TEST_CONFIG);
  const [activeTab, setActiveTab] = useState<'params' | 'headers' | 'body' | 'auth'>('params');

  // Preset Selector
  const handleSelectPreset = (preset: BenchmarkPreset) => {
    setConfig({
      ...preset.config,
      id: 'test_' + Date.now(),
    });
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
    <div className="space-y-10 font-sans">
      {/* Preset Benchmarks Zone */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Quick-Launch Verified Benchmark Presets
          </span>
          <span className="text-[10px] text-slate-500 font-mono">1-Click Config Fill</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {BENCHMARK_PRESETS.map((preset) => (
            <div
              key={preset.id}
              onClick={() => handleSelectPreset(preset)}
              className="p-5 rounded-2xl glass-card border border-white/[0.08] hover:border-cyan-500/50 transition-all cursor-pointer group flex items-start justify-between gap-4 relative overflow-hidden"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{preset.icon}</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 font-mono text-[9px] font-bold border border-cyan-500/20">
                    {preset.category}
                  </span>
                </div>
                <h4 className="font-extrabold text-white text-base font-outfit group-hover:text-cyan-300 transition-colors">
                  {preset.name}
                </h4>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {preset.description}
                </p>
                <div className="text-[11px] font-mono text-slate-400 pt-1 flex items-center gap-2">
                  <span className="text-cyan-400 font-bold">{preset.config.method}</span>
                  <span className="text-slate-300 truncate max-w-[280px]">{preset.config.url}</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900 border border-white/10 text-slate-400 group-hover:text-cyan-400 group-hover:scale-110 transition-all shrink-0 mt-1">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Test Configurator Studio */}
      <div className="p-6 sm:p-8 rounded-3xl glass-card border border-white/[0.08] shadow-2xl space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Settings2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-white text-lg font-outfit">
                Scenario &amp; Workload Configurator
              </h3>
              <p className="text-xs text-slate-400">
                Configure target endpoint, concurrency curve, and request headers
              </p>
            </div>
          </div>
        </div>

        {/* Step 1: Target Endpoint */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold flex items-center justify-center font-mono">
              01
            </span>
            <label className="text-xs font-bold text-slate-200 uppercase font-mono tracking-wider">
              Target Host Endpoint URL
            </label>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch gap-2 p-2 rounded-2xl bg-slate-950 border border-white/10 shadow-inner">
            {/* Method Select */}
            <select
              value={config.method}
              onChange={(e) => setConfig({ ...config, method: e.target.value as HttpMethod })}
              className={`px-4 py-3 rounded-xl font-mono font-bold text-xs border focus:outline-none cursor-pointer ${getMethodBadge(
                config.method
              )}`}
            >
              {HTTP_METHODS.map((m) => (
                <option key={m} value={m} className="bg-slate-900 text-white font-mono">
                  {m}
                </option>
              ))}
            </select>

            {/* URL Input */}
            <div className="relative flex-1 flex items-center">
              <Globe className="absolute left-3 w-4 h-4 text-slate-500" />
              <input
                value={config.url}
                onChange={(e) => setConfig({ ...config, url: e.target.value })}
                placeholder="https://api.yourdomain.com/v1/resource"
                className="w-full pl-9 pr-4 py-3 bg-transparent font-mono text-xs text-white placeholder-slate-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Step 2: Concurrency & Virtual Users */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-bold flex items-center justify-center font-mono">
              02
            </span>
            <label className="text-xs font-bold text-slate-200 uppercase font-mono tracking-wider">
              Concurrency &amp; Execution Timeline
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 rounded-2xl bg-slate-950/80 border border-white/5">
            {/* Virtual Users */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300 font-outfit flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-cyan-400" />
                  Virtual Users (VUs)
                </span>
                <span className="font-mono font-black text-cyan-400 text-sm">
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
                className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>5 VUs</span>
                <span>125 VUs</span>
                <span>250 VUs</span>
              </div>
            </div>

            {/* Test Duration */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300 font-outfit flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-indigo-400" />
                  Test Duration
                </span>
                <span className="font-mono font-black text-indigo-400 text-sm">
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
                className="w-full accent-indigo-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>5s</span>
                <span>30s</span>
                <span>60s</span>
              </div>
            </div>

            {/* Ramp-Up Duration */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300 font-outfit flex items-center gap-1.5">
                  <Gauge className="w-4 h-4 text-emerald-400" />
                  Ramp-Up Time
                </span>
                <span className="font-mono font-black text-emerald-400 text-sm">
                  {config.rampUpSeconds}s
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="15"
                step="1"
                value={config.rampUpSeconds}
                onChange={(e) => setConfig({ ...config, rampUpSeconds: Number(e.target.value) })}
                className="w-full accent-emerald-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>1s</span>
                <span>7s</span>
                <span>15s</span>
              </div>
            </div>
          </div>
        </div>

        {/* Step 3: Traffic Generation Pattern */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold flex items-center justify-center font-mono">
              03
            </span>
            <label className="text-xs font-bold text-slate-200 uppercase font-mono tracking-wider">
              Traffic Generation Curve Profile
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {LOAD_PROFILES.map((prof) => (
              <button
                key={prof.id}
                type="button"
                onClick={() => setConfig({ ...config, loadProfile: prof.id })}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer space-y-2 relative overflow-hidden ${
                  config.loadProfile === prof.id
                    ? 'bg-cyan-500/15 text-cyan-300 border-cyan-400 shadow-xl shadow-cyan-500/10'
                    : 'bg-slate-950/80 border-white/5 text-slate-400 hover:text-white hover:border-white/15'
                }`}
              >
                {/* Mini SVG Curve preview */}
                <div className="h-6 w-full opacity-60">
                  <svg className="w-full h-full" viewBox="0 0 50 30" fill="none">
                    <path
                      d={prof.svgCurve}
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                <div className="font-bold text-xs text-white font-outfit">{prof.label}</div>
                <div className="text-[10px] text-slate-400 leading-relaxed">{prof.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Step 4: Tabbed Parameters (Headers, Auth, Body) */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-bold flex items-center justify-center font-mono">
              04
            </span>
            <label className="text-xs font-bold text-slate-200 uppercase font-mono tracking-wider">
              Request Headers, Authentication &amp; Payloads
            </label>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950/80 border border-white/5 space-y-4">
            <div className="flex items-center gap-1.5 border-b border-white/[0.08] pb-3 text-xs">
              {[
                { id: 'headers', label: `Headers (${config.headers.length})` },
                { id: 'auth', label: `Authentication (${config.authType.toUpperCase()})` },
                { id: 'body', label: 'JSON Body' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-slate-900 text-cyan-400 border border-white/10 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Headers Editor */}
            {activeTab === 'headers' && (
              <div className="space-y-2.5 animate-in fade-in duration-150">
                {config.headers.map((h, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={h.enabled}
                      onChange={(e) => updateHeader(idx, 'enabled', e.target.checked)}
                      className="accent-cyan-400 w-4 h-4 cursor-pointer"
                    />
                    <input
                      value={h.key}
                      onChange={(e) => updateHeader(idx, 'key', e.target.value)}
                      placeholder="Header Key (e.g. Authorization)"
                      className="flex-1 p-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs font-mono text-white placeholder-slate-600 focus:outline-none"
                    />
                    <input
                      value={h.value}
                      onChange={(e) => updateHeader(idx, 'value', e.target.value)}
                      placeholder="Header Value"
                      className="flex-1 p-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs font-mono text-white placeholder-slate-600 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => removeHeader(idx)}
                      className="p-2.5 rounded-xl bg-slate-900 text-slate-500 hover:text-rose-400 border border-white/10 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addHeader}
                  className="px-4 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs font-bold text-cyan-400 hover:bg-slate-800 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Header</span>
                </button>
              </div>
            )}

            {/* Auth Editor */}
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
                          ? 'bg-cyan-500 text-black shadow-md'
                          : 'bg-slate-900 text-slate-400 hover:text-white'
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
                    placeholder={config.authType === 'bearer' ? 'Bearer Token (eyJh...)' : 'X-API-Key (sk_live_...)'}
                    className="w-full p-3 rounded-xl bg-slate-900 border border-white/10 text-xs font-mono text-white placeholder-slate-600 focus:outline-none"
                  />
                )}
              </div>
            )}

            {/* Body Editor */}
            {activeTab === 'body' && (
              <div className="space-y-2 animate-in fade-in duration-150">
                <textarea
                  value={config.bodyContent || ''}
                  onChange={(e) => setConfig({ ...config, bodyContent: e.target.value, bodyType: 'json' })}
                  rows={5}
                  placeholder='{\n  "sku": "PROD-9981",\n  "quantity": 1\n}'
                  className="w-full p-3.5 rounded-xl bg-slate-900 border border-white/10 text-xs font-mono text-white placeholder-slate-600 focus:outline-none"
                />
              </div>
            )}
          </div>
        </div>

        {/* Big Glowing Launch Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => onStartTest(config)}
            disabled={isRunning || !config.url}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-black font-black text-sm shadow-xl shadow-cyan-500/25 hover:scale-[1.01] transition-all cursor-pointer flex items-center justify-center gap-2.5 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Play className="w-4 h-4 fill-black" />
            <span>Launch High-Concurrency Load Benchmark</span>
          </button>
        </div>
      </div>
    </div>
  );
}
