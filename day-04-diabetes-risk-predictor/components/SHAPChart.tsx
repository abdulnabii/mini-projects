'use client';

import React from 'react';
import { SHAPFactor } from '@/types';
import { BarChart3, AlertCircle, CheckCircle2 } from 'lucide-react';

interface SHAPChartProps {
  factors: SHAPFactor[];
}

export default function SHAPChart({ factors }: SHAPChartProps) {
  return (
    <div className="bg-[#0b1724] border border-teal-500/20 rounded-3xl p-6 space-y-4 shadow-xl font-mono">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-teal-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            SHAP Feature Importance Analysis
          </h3>
        </div>
        <span className="text-[10px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
          Ranked by Risk Weight
        </span>
      </div>

      <p className="text-xs text-slate-300 font-sans leading-relaxed">
        Shows how much each individual vital contributed to raising or lowering your diabetes risk score:
      </p>

      {/* Horizontal Bar Items */}
      <div className="space-y-3 pt-1">
        {factors.map((factor) => {
          const isCritical = factor.status === 'CRITICAL';
          const isElevated = factor.status === 'ELEVATED';

          const barColor = isCritical
            ? 'bg-rose-500 shadow-rose-500/30'
            : isElevated
            ? 'bg-amber-400 shadow-amber-400/30'
            : 'bg-teal-500 shadow-teal-500/30';

          const textColor = isCritical ? 'text-rose-400' : isElevated ? 'text-amber-400' : 'text-teal-400';

          return (
            <div key={factor.key} className="space-y-1 bg-[#07101a] p-3 rounded-2xl border border-slate-800/80">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-200">{factor.name}</span>
                  <span className="text-slate-400 font-normal">({factor.value})</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                    isCritical
                      ? 'bg-rose-950/80 text-rose-300 border-rose-800'
                      : isElevated
                      ? 'bg-amber-950/80 text-amber-300 border-amber-800'
                      : 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                  }`}>
                    {factor.status}
                  </span>
                  <span className={`font-mono font-bold ${textColor}`}>+{factor.impactPercent}% impact</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800/60">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ease-out ${barColor}`}
                  style={{ width: `${factor.impactPercent}%` }}
                />
              </div>

              <div className="text-[10px] text-slate-400 font-sans pt-0.5">
                Normal Clinical Benchmark: <span className="font-mono text-slate-300">{factor.normalRange}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
