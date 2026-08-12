'use client';

import { DeveloperPersona } from '@/types';
import { Bot, Sparkles, Zap, Code, ShieldCheck } from 'lucide-react';

interface Props {
  persona: DeveloperPersona;
}

export default function PersonaCard({ persona }: Props) {
  return (
    <div className="bg-[#161b22] border border-emerald-500/20 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl font-mono">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">AI Developer Persona</h3>
            <span className="text-[11px] text-slate-400">Synthesized by Gemini 1.5 Flash</span>
          </div>
        </div>

        <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
          {persona.archetype}
        </div>
      </div>

      {/* Summary */}
      <div className="p-4 rounded-2xl bg-[#0d1117] border border-slate-800 space-y-2 text-xs text-slate-200 leading-relaxed">
        <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
          <Sparkles className="w-4 h-4" />
          <span>Architectural &amp; Coding Style Persona</span>
        </div>
        <p>{persona.summary}</p>
      </div>

      {/* Traits Pills */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Inferred Personality Traits</span>
        <div className="flex flex-wrap gap-2">
          {persona.traits.map((trait) => (
            <span
              key={trait}
              className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-sky-400 text-xs font-bold"
            >
              ✦ {trait}
            </span>
          ))}
        </div>
      </div>

      {/* Fun Fact & Strength Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div className="p-4 rounded-2xl bg-[#0d1117] border border-amber-500/30 space-y-1">
          <span className="text-amber-400 font-bold flex items-center gap-1.5 text-xs">
            <Zap className="w-4 h-4" />
            Fun Coding Habit Fact
          </span>
          <p className="text-slate-300 text-[11px] leading-relaxed">{persona.funFact}</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#0d1117] border border-emerald-500/30 space-y-1">
          <span className="text-emerald-400 font-bold flex items-center gap-1.5 text-xs">
            <ShieldCheck className="w-4 h-4" />
            Technical Core Strength
          </span>
          <p className="text-slate-300 text-[11px] leading-relaxed">{persona.technicalStrength}</p>
        </div>
      </div>
    </div>
  );
}
