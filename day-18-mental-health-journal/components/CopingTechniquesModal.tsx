'use client';

import { useState } from 'react';
import { EVIDENCE_BASED_TECHNIQUES } from '@/lib/defaultEntries';
import { CopingTechnique } from '@/types';
import { X, Sparkles, CheckCircle2, ChevronRight, Compass, ShieldCheck } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onLaunchBreathing: () => void;
}

export default function CopingTechniquesModal({ isOpen, onClose, onLaunchBreathing }: Props) {
  const [selectedTech, setSelectedTech] = useState<CopingTechnique>(EVIDENCE_BASED_TECHNIQUES[1]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 font-mono text-xs text-slate-300">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0b1220] border-2 border-emerald-500/40 p-6 sm:p-8 space-y-6 shadow-2xl shadow-emerald-500/20">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base font-outfit">
                Evidence-Based CBT Coping Modules
              </h3>
              <p className="text-[11px] text-slate-400">Clinically validated techniques for emotional grounding and de-escalation</p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Techniques List */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Select Technique:</span>
            <div className="space-y-1.5">
              {EVIDENCE_BASED_TECHNIQUES.map((tech) => (
                <button
                  key={tech.id}
                  type="button"
                  onClick={() => setSelectedTech(tech)}
                  className={`w-full p-3 rounded-2xl border text-left transition-all flex items-center justify-between gap-2 cursor-pointer ${
                    selectedTech.id === tech.id
                      ? 'bg-emerald-500/10 border-emerald-400 text-white shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="space-y-0.5">
                    <span className="text-base">{tech.icon}</span>
                    <span className="block font-bold text-xs font-outfit line-clamp-1">{tech.title}</span>
                    <span className="text-[9px] text-slate-500">{tech.category} • {tech.durationMinutes}m</span>
                  </div>
                  <ChevronRight className="w-4 h-4 shrink-0 text-slate-600" />
                </button>
              ))}
            </div>
          </div>

          {/* Active Technique Interactive Detail */}
          <div className="md:col-span-2 p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{selectedTech.icon}</span>
                  <div>
                    <h4 className="font-bold text-white text-sm font-outfit">{selectedTech.title}</h4>
                    <span className="text-[10px] text-emerald-400 font-bold">{selectedTech.category}</span>
                  </div>
                </div>

                <span className="px-2.5 py-0.5 rounded-full bg-slate-900 text-slate-400 text-[10px] border border-slate-800">
                  ⏱️ ~{selectedTech.durationMinutes} Minutes
                </span>
              </div>

              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                {selectedTech.description}
              </p>

              {/* Step-by-Step Instructions */}
              <div className="space-y-2 pt-2 border-t border-slate-900">
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  Step-by-Step Exercise Instructions:
                </span>
                <ol className="space-y-2">
                  {selectedTech.steps.map((step, idx) => (
                    <li
                      key={idx}
                      className="p-3 rounded-xl bg-[#070c14] border border-slate-900 flex items-start gap-2.5 text-[11px] text-slate-200 font-sans leading-relaxed"
                    >
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px] shrink-0 font-mono">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {selectedTech.id === 'box-breathing' && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onLaunchBreathing();
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-400 to-emerald-400 text-black font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-teal-500/20 hover:scale-[1.01] transition-all cursor-pointer font-outfit"
              >
                <span>Launch Interactive Breath Timer</span>
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end pt-1">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-bold hover:text-white"
          >
            Close Coping Studio
          </button>
        </div>
      </div>
    </div>
  );
}
