'use client';

import { RoastIntensity } from '@/types';
import { Flame, Sparkles, Skull, Shield } from 'lucide-react';

interface Props {
  intensity: RoastIntensity;
  onChange: (val: RoastIntensity) => void;
}

export default function IntensityPicker({ intensity, onChange }: Props) {
  const options: { id: RoastIntensity; label: string; desc: string; icon: any; color: string; activeClass: string }[] = [
    {
      id: 'mild',
      label: 'Mild (Constructive)',
      desc: 'Gentle feedback with friendly banter and polite tips',
      icon: Shield,
      color: 'text-emerald-400',
      activeClass: 'bg-emerald-500/10 border-emerald-500 text-emerald-300 shadow-emerald-500/20',
    },
    {
      id: 'spicy',
      label: 'Spicy (Gordon Ramsay)',
      desc: 'Brutally honest, witty, sarcastic reality check',
      icon: Flame,
      color: 'text-orange-400',
      activeClass: 'bg-orange-500/10 border-orange-500 text-orange-300 shadow-orange-500/20',
    },
    {
      id: 'nuclear',
      label: 'Nuclear (Unhinged Savage)',
      desc: 'Devastating, ruthless, zero-mercy developer roast',
      icon: Skull,
      color: 'text-rose-500',
      activeClass: 'bg-rose-500/10 border-rose-500 text-rose-300 shadow-rose-500/20',
    },
  ];

  return (
    <div className="space-y-3 font-mono text-xs">
      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
        <Flame className="w-3.5 h-3.5 text-orange-400" />
        Select Roast Heat Level &amp; Tone
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {options.map((opt) => {
          const Icon = opt.icon;
          const isSelected = intensity === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id)}
              className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between gap-2 shadow-lg ${
                isSelected
                  ? `${opt.activeClass} border-2`
                  : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`font-bold text-xs font-outfit ${isSelected ? 'text-white' : opt.color}`}>
                  {opt.label}
                </span>
                <Icon className={`w-4 h-4 ${isSelected ? 'animate-pulse' : 'text-slate-600'}`} />
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed font-sans">{opt.desc}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
