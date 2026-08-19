'use client';

import { useState } from 'react';
import { CloudProvider, ArchitectureScale, ArchitecturePreset } from '@/types';
import { ARCHITECTURE_PRESETS } from '@/lib/sampleArchitectures';
import { Cloud, Sparkles, Server, Zap, ArrowRight, Layers, DollarSign, Activity } from 'lucide-react';

interface Props {
  onGenerate: (requirements: string, provider: CloudProvider, scale: ArchitectureScale) => void;
  isLoading: boolean;
}

export default function ArchitectureInput({ onGenerate, isLoading }: Props) {
  const [requirements, setRequirements] = useState<string>(
    ARCHITECTURE_PRESETS[0].requirements
  );
  const [provider, setProvider] = useState<CloudProvider>('AWS');
  const [scale, setScale] = useState<ArchitectureScale>('Growth (100k DAU)');

  const handleSelectPreset = (preset: ArchitecturePreset) => {
    setRequirements(preset.requirements);
    setProvider(preset.targetProvider);
    setScale(preset.targetScale);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requirements.trim()) return;
    onGenerate(requirements, provider, scale);
  };

  return (
    <div className="space-y-6 font-mono text-xs text-slate-300">
      {/* 1. Curated Architecture Archetypes */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            Select a Production System Design Archetype:
          </label>
          <span className="text-[10px] text-slate-500">Click to load blueprint</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {ARCHITECTURE_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleSelectPreset(preset)}
              className="p-3.5 rounded-2xl bg-slate-950/90 border border-slate-800 hover:border-cyan-500/50 text-left transition-all group flex flex-col justify-between gap-3 shadow-lg cursor-pointer"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{preset.icon}</span>
                  <span className="text-[9px] font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                    {preset.targetProvider}
                  </span>
                </div>
                <h4 className="font-bold text-white text-xs font-outfit group-hover:text-cyan-300 transition-colors line-clamp-1">
                  {preset.title}
                </h4>
                <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed font-sans">{preset.tagline}</p>
              </div>

              <span className="text-[9px] text-cyan-400 font-bold flex items-center gap-1 self-end pt-1 border-t border-slate-900 w-full justify-end">
                <span>Load Spec</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Main Input Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Requirements Textarea */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-200 flex items-center gap-1.5">
            <Server className="w-3.5 h-3.5 text-cyan-400" />
            Describe Product Requirements &amp; Target Workload
          </label>
          <textarea
            rows={4}
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            placeholder="e.g. Architect a scalable real-time gaming backend for 50,000 concurrent players with WebSocket matchmaking, low-latency Redis leaderboards, and Postgres player persistence..."
            className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 font-mono leading-relaxed shadow-inner"
          />
        </div>

        {/* Configuration Controls: Provider & Scale */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Cloud Provider */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
              <Cloud className="w-3.5 h-3.5 text-cyan-400" />
              Target Cloud Infrastructure Ecosystem
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['AWS', 'GCP', 'Azure'] as CloudProvider[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setProvider(p)}
                  className={`p-3 rounded-xl border text-center font-bold text-xs transition-all cursor-pointer ${
                    provider === p
                      ? 'bg-cyan-500/10 border-cyan-500 text-white shadow-lg shadow-cyan-500/20'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="block font-outfit">{p}</span>
                  <span className="text-[9px] text-slate-500 font-normal">
                    {p === 'AWS' ? 'Amazon Cloud' : p === 'GCP' ? 'Google Cloud' : 'MS Azure'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Scale Tier */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              Target Concurrency &amp; Daily Active Users (DAU)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['MVP (1k-10k DAU)', 'Growth (100k DAU)', 'Hyperscale (1M+ DAU)'] as ArchitectureScale[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setScale(s)}
                  className={`p-3 rounded-xl border text-center font-bold text-xs transition-all cursor-pointer ${
                    scale === s
                      ? 'bg-cyan-500/10 border-cyan-500 text-white shadow-lg shadow-cyan-500/20'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="block font-outfit truncate">{s.split(' ')[0]}</span>
                  <span className="text-[9px] text-slate-500 font-normal">{s.split(' ')[1]}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading || !requirements.trim()}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 hover:from-cyan-300 hover:to-indigo-400 text-black font-black text-sm tracking-wide font-outfit transition-all shadow-xl shadow-cyan-500/25 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>
              {isLoading
                ? 'SYNTHESIZING MULTI-TIER CLOUD ARCHITECTURE...'
                : `GENERATE ${provider} SYSTEM ARCHITECTURE & COST ESTIMATE`}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}
