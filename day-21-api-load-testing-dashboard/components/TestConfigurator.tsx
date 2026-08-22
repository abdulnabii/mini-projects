'use client';

import { useState } from 'react';
import { TestConfig, HttpMethod, LoadProfileType, HttpHeader } from '@/types';
import { BENCHMARK_PRESETS, BenchmarkPreset } from '@/lib/sampleBenchmarks';
import { DEFAULT_TEST_CONFIG } from '@/lib/loadEngine';
import InteractiveWaveformPreview from '@/components/InteractiveWaveformPreview';
import {
  Zap,
  Play,
  Sliders,
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
  Search,
  Command,
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
  badge: string;
}[] = [
  {
    id: 'ramping_spike',
    label: 'Ramping Spike',
    desc: 'Linear ramp to peak VUs, sustained plateau, followed by cooldown',
    badge: 'Recommended',
  },
  {
    id: 'constant',
    label: 'Constant Load',
    desc: 'Instant full concurrency maintained steadily throughout duration',
    badge: 'High Throughput',
  },
  {
    id: 'stress',
    label: 'Stress / Breaking Point',
    desc: 'Steep stair-step load escalation until server saturation occurs',
    badge: 'Limits Test',
  },
  {
    id: 'soak',
    label: 'Soak / Reliability',
    desc: 'Extended endurance test for detecting memory leaks & socket decay',
    badge: 'Endurance',
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

  const getMethodColor = (m: HttpMethod) => {
    switch (m) {
      case 'GET':
        return 'text-emerald-400';
      case 'POST':
        return 'text-cyan-400';
      case 'PUT':
        return 'text-indigo-400';
      case 'DELETE':
        return 'text-rose-400';
      default:
        return 'text-amber-400';
    }
  };

  return (
    <div className="space-y-8 font-mono w-full min-w-0">
      {/* Target Search Bar & Preset Quick-Select */}
      <div className="max-w-4xl mx-auto space-y-3">
        {/* Preset Chips */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-400">Try Benchmark Targets:</span>
          {BENCHMARK_PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => handleSelectPreset(p)}
              className={`px-3 py-1 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
                activePresetId === p.id
                  ? 'bg-cyan-500 text-black border-cyan-400 shadow-md'
                  : 'bg-[#161b22] border-slate-800 text-slate-300 hover:border-cyan-500/50 hover:text-white'
              }`}
            >
              <span>{p.icon}</span>
              <span>{p.name}</span>
            </button>
          ))}
        </div>

        {/* URL Input Form */}
        <div className="flex flex-col sm:flex-row gap-2 p-2 rounded-2xl bg-[#161b22] border border-cyan-500/30 shadow-xl">
          <select
            value={config.method}
            onChange={(e) => setConfig({ ...config, method: e.target.value as HttpMethod })}
            className={`px-4 py-3 rounded-xl bg-[#0d1117] border border-slate-700 font-mono font-bold text-xs focus:outline-none cursor-pointer ${getMethodColor(
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
            <Globe className="w-4 h-4 text-slate-500 absolute left-3" />
            <input
              type="text"
              value={config.url}
              onChange={(e) => {
                setConfig({ ...config, url: e.target.value });
                setProbeStatus('idle');
              }}
              placeholder="Enter target API URL (e.g. https://dummyjson.com/products)..."
              className="w-full bg-transparent pl-10 pr-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none font-mono font-bold"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleProbeConnection}
              disabled={!urlValid || probeStatus === 'probing'}
              className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-500/50 text-cyan-400 text-xs font-bold transition-all cursor-pointer disabled:opacity-40"
              title="Test pre-flight connectivity"
            >
              {probeStatus === 'probing' ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : probeStatus === 'healthy' ? (
                <span className="text-emerald-400">{probeLatency}ms (OK)</span>
              ) : (
                <span>Probe</span>
              )}
            </button>

            <button
              type="button"
              onClick={() => onStartTest(config)}
              disabled={isRunning || !urlValid}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-extrabold text-xs transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50 cursor-pointer hover:scale-105"
            >
              <Play className="w-4 h-4 fill-black" />
              <span>Launch Test</span>
            </button>
          </div>
        </div>

        {!urlValid && config.url.length > 0 && (
          <p className="text-xs text-rose-400 px-1">Please enter a valid HTTP/HTTPS URL.</p>
        )}
      </div>

      {/* 2-Column Split Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
        {/* Left Column: Workload & Concurrency */}
        <div className="bg-[#0d1117] border border-cyan-500/20 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2.5">
              <Users className="w-5 h-5 text-cyan-400" />
              <h3 className="text-base font-bold text-white font-outfit">Concurrency &amp; Traffic Model</h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-md bg-cyan-500/10 text-cyan-300 text-[10px] font-bold border border-cyan-500/30">
              {config.virtualUsers} VUs Peak
            </span>
          </div>

          {/* Virtual Users Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-bold">Virtual Users (VUs):</span>
              <strong className="text-cyan-400 text-sm font-black">{config.virtualUsers} VUs</strong>
            </div>
            <input
              type="range"
              min="5"
              max="250"
              step="5"
              value={config.virtualUsers}
              onChange={(e) => setConfig({ ...config, virtualUsers: Number(e.target.value) })}
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>5 VUs</span>
              <span>125 VUs</span>
              <span>250 VUs</span>
            </div>
          </div>

          {/* Duration Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-bold">Test Duration:</span>
              <strong className="text-indigo-400 text-sm font-black">{config.durationSeconds}s</strong>
            </div>
            <input
              type="range"
              min="5"
              max="60"
              step="5"
              value={config.durationSeconds}
              onChange={(e) => setConfig({ ...config, durationSeconds: Number(e.target.value) })}
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>5s</span>
              <span>30s</span>
              <span>60s</span>
            </div>
          </div>

          {/* Dynamic Live Waveform Preview */}
          <InteractiveWaveformPreview
            vus={config.virtualUsers}
            duration={config.durationSeconds}
            profile={config.loadProfile}
          />

          {/* Traffic Profiles */}
          <div className="space-y-2.5 pt-1">
            <span className="text-xs text-slate-400 block">Traffic Waveform Profile:</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {LOAD_PROFILES.map((prof) => {
                const isSelected = config.loadProfile === prof.id;
                return (
                  <button
                    key={prof.id}
                    type="button"
                    onClick={() => setConfig({ ...config, loadProfile: prof.id })}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer space-y-1 ${
                      isSelected
                        ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-300 shadow-md'
                        : 'bg-[#161b22] border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-white">{prof.label}</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-900 text-slate-400 border border-slate-800">
                        {prof.badge}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">{prof.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Parameters & Headers */}
        <div className="bg-[#0d1117] border border-cyan-500/20 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <Code2 className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white font-outfit">Headers, Auth &amp; Payloads</h3>
              </div>

              {/* Tabs */}
              <div className="flex items-center bg-[#161b22] p-1 rounded-xl border border-slate-800 text-xs">
                {[
                  { id: 'headers', label: `Headers (${config.headers.length})` },
                  { id: 'auth', label: `Auth (${config.authType.toUpperCase()})` },
                  { id: 'body', label: 'JSON Body' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                      activeTab === tab.id
                        ? 'bg-cyan-500 text-black shadow-md'
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
              <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
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
                      placeholder="Header Key (e.g. Accept)"
                      className="flex-1 p-2.5 rounded-xl bg-[#161b22] border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none"
                    />
                    <input
                      value={h.value}
                      onChange={(e) => updateHeader(idx, 'value', e.target.value)}
                      placeholder="Value"
                      className="flex-1 p-2.5 rounded-xl bg-[#161b22] border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => removeHeader(idx)}
                      className="p-2.5 rounded-xl bg-[#161b22] text-slate-500 hover:text-rose-400 border border-slate-800 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addHeader}
                  className="px-3.5 py-1.5 rounded-xl bg-[#161b22] border border-slate-800 text-xs font-bold text-cyan-400 hover:border-cyan-500/50 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Request Header</span>
                </button>
              </div>
            )}

            {/* Tab 2: Auth */}
            {activeTab === 'auth' && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  {(['none', 'bearer', 'api_key'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setConfig({ ...config, authType: t })}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                        config.authType === t
                          ? 'bg-cyan-500 text-black font-black shadow-md'
                          : 'bg-[#161b22] text-slate-400 hover:text-white border border-slate-800'
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
                    className="w-full p-3 rounded-xl bg-[#161b22] border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none"
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
                  placeholder='{\n  "query": "macbook pro",\n  "limit": 50\n}'
                  className="w-full p-3 rounded-2xl bg-[#161b22] border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none font-bold"
                />
              </div>
            )}
          </div>

          <div className="p-3.5 rounded-2xl bg-[#161b22] border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
            <span className="font-bold text-slate-400">Protocol: HTTP/2 Multiplexed</span>
            <span className="text-emerald-400 font-bold">Estimated Rate: ~{Math.round(config.virtualUsers * 2.5)} RPS</span>
          </div>
        </div>
      </div>
    </div>
  );
}
