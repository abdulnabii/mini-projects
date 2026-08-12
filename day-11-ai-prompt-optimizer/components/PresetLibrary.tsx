'use client';

import { PRESET_PROMPTS } from '@/lib/storage';
import { PresetPrompt } from '@/types';
import { Sparkles, Terminal, ArrowUpRight } from 'lucide-react';

interface Props {
  onSelectPreset: (preset: PresetPrompt) => void;
}

export default function PresetLibrary({ onSelectPreset }: Props) {
  return (
    <div className="space-y-4 font-mono">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white font-outfit flex items-center gap-2">
          <Terminal className="w-4 h-4 text-amber-400" />
          Production Prompt Presets &amp; Templates
        </h3>
        <span className="text-[11px] text-slate-500">6 Industry Benchmarks</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {PRESET_PROMPTS.map((p) => (
          <button
            key={p.id}
            onClick={() => onSelectPreset(p)}
            className="p-4 rounded-2xl bg-[#0f172a] border border-slate-800 hover:border-amber-500/50 text-left transition-all group flex flex-col justify-between gap-3 hover:shadow-xl hover:shadow-amber-500/5"
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                  {p.category}
                </span>
                <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </div>
              <h4 className="font-bold text-slate-200 text-xs font-outfit group-hover:text-white transition-colors">
                {p.title}
              </h4>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{p.description}</p>
            </div>

            <div className="text-[10px] text-slate-500 border-t border-slate-800/80 pt-2 flex items-center justify-between">
              <span>Model: {p.targetModel}</span>
              <span className="text-amber-400 font-bold">1-Click Load</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
