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
  CheckCircle2,
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
    desc: 'Ramp to peak VUs, sustain, then cooldown',
    svgCurve: 'M0,22 L12,6 L38,6 L50,22',
  },
  {
    id: 'constant',
    label: 'Constant Load',
    desc: 'Instant full concurrency maintained throughout',
    svgCurve: 'M0,6 L50,6',
  },
  {
    id: 'stress',
    label: 'Stress / Limit',
    desc: 'Steep stair-step load escalation to saturation',
    svgCurve: 'M0,22 L15,14 L30,8 L50,2',
  },
  {
    id: 'soak',
    label: 'Soak / Soak Test',
    desc: 'Endurance test for socket & memory leaks',
    svgCurve: 'M0,10 L50,10',
  },
];

export default function TestConfigurator({ onStartTest, isRunning }: Props) {
  const [config, setConfig] = useState<TestConfig>(DEFAULT_TEST_CONFIG);
  const [activeTab, setActiveTab] = useState<'headers' | 'auth' | 'body' | 'sla'>('headers');
  const [activePresetId, setActivePresetId] = useState<string | null>(null);

  // Preset Selector
  const handleSelectPreset = (preset: BenchmarkPreset) => {
    setActivePresetId(preset.id);
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
    <div className="space-y-8 font-sans w-full min-w-0">
      {/* 3-Column Benchmark Target Presets */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Verified Benchmark Targets
          </span>
          <span className="text-[10px] text-slate-500 font-mono">1-Click Config</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 min-w-0">
          {BENCHMARK_PRESETS.map((preset) => {
            const isSelected = activePresetId === preset.id;
            return (
              <div
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className={`p-4 rounded-2xl glass-card glass-card-hover cursor-pointer flex flex-col justify-between space-y-3 border transition-all ${
                  isSelected
                    ? 'border-cyan-400 bg-cyan-950/30 shadow-lg shadow-cyan-500/10'
                    : 'border-white/[0.08]'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{preset.icon}</span>
                      <span className="px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-300 font-mono text-[9px] font-bold border border-cyan-500/20">
                        {preset.category}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">
                      {preset.expectedRps}
                    </span>
                  </div>

                  <h4 className="font-extrabold text-white text-sm font-outfit line-clamp-1">
                    {preset.name}
                  </h4>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {preset.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span className="text-cyan-400 font-bold">{preset.config.method}</span>
                  <span className="text-slate-300 truncate max-w-[160px]">{preset.config.url}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Studio Configurator Card */}
      <div className="p-6 sm:p-8 rounded-3xl glass-card border border-white/[0.08] shadow-2xl space-y-6 min-w-0">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Settings2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base font-outfit">
                Scenario &amp; Workload Configurator
              </h3>
              <p className="text-xs text-slate-400">
                Configure endpoint target, virtual concurrency curve, and request headers
              </p>
            </div>
          </div>
        </div>

        {/* Section 1: Endpoint URL Bar */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-slate-300 uppercase font-mono tracking-wider block">
            Target Host Endpoint URL
          </label>

          <div className="flex flex-col sm:flex-row items-stretch gap-2 p-1.5 rounded-2xl bg-slate-950 border border-white/10 shadow-inner">
            <select
              value={config.method}
              onChange={(e) => setConfig({ ...config, method: e.target.value as HttpMethod })}
              className={`px-4 py-2.5 rounded-xl font-mono font-bold text-xs border focus:outline-none cursor-pointer ${getMethodBadge(
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
              <Globe className="absolute left-3 w-4 h-4 text-slate-500" />
              <input
                value={config.url}
                onChange={(e) => setConfig({ ...config, url: e.target.value })}
                placeholder="https://api.yourdomain.com/v1/resource"
                className="w-full pl-9 pr-4 py-2.5 bg-transparent font-mono text-xs text-white placeholder-slate-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 2: 2-Column Split (Concurrency vs Parameters) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2 min-w-0">
          {/* Left Column: Workload Controls */}
          <div className="space-y-5 p-5 rounded-2xl bg-slate-950/80 border border-white/5 min-w-0">
            <h4 className="text-xs font-bold text-slate-200 uppercase font-mono tracking-wider flex items-center gap-1.5 border-b border-white/5 pb-2">
              <Users className="w-3.5 h-3.5 text-cyan-400" />
              Concurrency &amp; Timeline
            </h4>

            {/* Virtual Users Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-bold">Virtual Users (VUs)</span>
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

            {/* Duration Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-bold">Test Duration</span>
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

            {/* 2x2 Traffic Profiles */}
            <div className="space-y-2 pt-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase font-mono tracking-wider block">
                Traffic Generation Profile
              </span>

              <div className="grid grid-cols-2 gap-2">
                {LOAD_PROFILES.map((prof) => (
                  <button
                    key={prof.id}
                    type="button"
                    onClick={() => setConfig({ ...config, loadProfile: prof.id })}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer space-y-1 ${
                      config.loadProfile === prof.id
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-sm'
                        : 'bg-slate-900/80 border-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs font-outfit text-white">{prof.label}</span>
                      <svg className="w-8 h-4 opacity-70" viewBox="0 0 50 30" fill="none">
                        <path
                          d={prof.svgCurve}
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                    <span className="text-[9px] text-slate-400 block leading-tight line-clamp-1">
                      {prof.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Parameters & Headers */}
          <div className="space-y-4 p-5 rounded-2xl bg-slate-950/80 border border-white/5 min-w-0 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-1.5 border-b border-white/5 pb-2 text-xs">
                {[
                  { id: 'headers', label: `Headers (${config.headers.length})` },
                  { id: 'auth', label: `Auth (${config.authType.toUpperCase()})` },
                  { id: 'body', label: 'JSON Body' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer text-xs ${
                      activeTab === tab.id
                        ? 'bg-slate-900 text-cyan-400 border border-white/10'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab 1: Headers */}
              {activeTab === 'headers' && (
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {config.headers.map((h, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      <input
                        type="checkbox"
                        checked={h.enabled}
                        onChange={(e) => updateHeader(idx, 'enabled', e.target.checked)}
                        className="accent-cyan-400 w-3.5 h-3.5 cursor-pointer"
                      />
                      <input
                        value={h.key}
                        onChange={(e) => updateHeader(idx, 'key', e.target.value)}
                        placeholder="Header Key"
                        className="flex-1 p-2 rounded-lg bg-slate-900 border border-white/10 text-xs font-mono text-white placeholder-slate-600 focus:outline-none"
                      />
                      <input
                        value={h.value}
                        onChange={(e) => updateHeader(idx, 'value', e.target.value)}
                        placeholder="Value"
                        className="flex-1 p-2 rounded-lg bg-slate-900 border border-white/10 text-xs font-mono text-white placeholder-slate-600 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => removeHeader(idx)}
                        className="p-2 rounded-lg bg-slate-900 text-slate-500 hover:text-rose-400 border border-white/10 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addHeader}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-xs font-bold text-cyan-400 hover:bg-slate-800 transition-all cursor-pointer flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Header</span>
                  </button>
                </div>
              )}

              {/* Tab 2: Auth */}
              {activeTab === 'auth' && (
                <div className="space-y-3">
                  <div className="flex items-center gap-1.5">
                    {(['none', 'bearer', 'api_key'] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setConfig({ ...config, authType: t })}
                        className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                          config.authType === t
                            ? 'bg-cyan-500 text-black'
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
                      placeholder={config.authType === 'bearer' ? 'Bearer eyJh...' : 'X-API-Key sk_live_...'}
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs font-mono text-white placeholder-slate-600 focus:outline-none"
                    />
                  )}
                </div>
              )}

              {/* Tab 3: JSON Body */}
              {activeTab === 'body' && (
                <div className="space-y-2">
                  <textarea
                    value={config.bodyContent || ''}
                    onChange={(e) => setConfig({ ...config, bodyContent: e.target.value, bodyType: 'json' })}
                    rows={6}
                    placeholder='{\n  "query": "laptop",\n  "limit": 20\n}'
                    className="w-full p-3 rounded-xl bg-slate-900 border border-white/10 text-xs font-mono text-white placeholder-slate-600 focus:outline-none"
                  />
                </div>
              )}
            </div>

            {/* Pre-flight Info */}
            <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/20 text-[11px] text-cyan-300 font-mono flex items-center justify-between">
              <span>Target: {config.method}</span>
              <span>Estimated Rate: ~{Math.round(config.virtualUsers * 2.5)} RPS</span>
            </div>
          </div>
        </div>

        {/* Section 3: High-Impact Launch Button */}
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
