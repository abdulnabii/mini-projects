'use client';

import { useState } from 'react';
import { Droplet, Plus, RotateCcw, Sparkles } from 'lucide-react';

interface Props {
  currentMl: number;
  targetMl: number;
  onAddWater: (amountMl: number) => void;
  onResetWater: () => void;
}

export default function WaterTracker({ currentMl, targetMl, onAddWater, onResetWater }: Props) {
  const percent = Math.min(100, Math.round((currentMl / targetMl) * 100));

  return (
    <div className="p-6 rounded-3xl bg-[#09121d] border-2 border-cyan-500/30 shadow-xl space-y-5 font-sans">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Droplet className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-white text-sm font-outfit">Hydration Station</h4>
            <p className="text-[11px] text-slate-400">Target: {(targetMl / 1000).toFixed(1)}L / Day</p>
          </div>
        </div>

        <button
          onClick={onResetWater}
          className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          title="Reset today's water"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Visual Water Fill Progress */}
      <div className="flex items-center gap-6">
        {/* Animated Glass Cylinder */}
        <div className="relative w-16 h-28 rounded-2xl bg-slate-950 border-2 border-cyan-500/40 overflow-hidden flex flex-col justify-end p-1 shadow-inner shrink-0">
          <div
            className="w-full rounded-xl bg-gradient-to-t from-cyan-500 to-blue-400 transition-all duration-700 ease-out shadow-lg shadow-cyan-500/30"
            style={{ height: `${percent}%` }}
          />
          <div className="absolute inset-0 flex items-center justify-center font-mono font-black text-xs text-white">
            {percent}%
          </div>
        </div>

        {/* Status & Stats */}
        <div className="space-y-1.5 flex-1">
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black font-mono text-cyan-400">{(currentMl / 1000).toFixed(2)}L</span>
            <span className="text-xs text-slate-400 font-mono">/ {(targetMl / 1000).toFixed(1)}L</span>
          </div>

          <p className="text-xs text-slate-300">
            {percent >= 100
              ? '🎉 Optimal cellular hydration achieved!'
              : `${Math.max(0, targetMl - currentMl)}ml remaining to reach peak performance.`}
          </p>

          {/* Quick Buttons */}
          <div className="flex items-center gap-2 pt-2 flex-wrap">
            {[
              { label: '+250ml Glass', amount: 250 },
              { label: '+500ml Bottle', amount: 500 },
              { label: '+750ml Shaker', amount: 750 },
            ].map((btn) => (
              <button
                key={btn.amount}
                onClick={() => onAddWater(btn.amount)}
                className="px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20 text-cyan-300 font-bold text-xs transition-all cursor-pointer flex items-center gap-1 hover:scale-105"
              >
                <Plus className="w-3 h-3" />
                <span>{btn.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
