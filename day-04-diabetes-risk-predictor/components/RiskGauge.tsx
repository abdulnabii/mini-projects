'use client';

import React from 'react';
import { MLPredictionResult } from '@/types';
import { Activity, AlertTriangle, ShieldCheck, Flame } from 'lucide-react';

interface RiskGaugeProps {
  prediction: MLPredictionResult;
}

export default function RiskGauge({ prediction }: RiskGaugeProps) {
  const { riskPercent, classification, confidence, modelName, flaggedCount } = prediction;

  const getStyle = (pct: number) => {
    if (pct >= 65) return { text: 'text-rose-400', border: 'border-rose-500/40', bg: 'bg-rose-950/40', fill: 'stroke-rose-500', badge: 'HIGH RISK DETECTED', icon: Flame };
    if (pct >= 35) return { text: 'text-amber-400', border: 'border-amber-500/40', bg: 'bg-amber-950/40', fill: 'stroke-amber-400', badge: 'MODERATE RISK', icon: AlertTriangle };
    return { text: 'text-emerald-400', border: 'border-emerald-500/40', bg: 'bg-emerald-950/40', fill: 'stroke-emerald-400', badge: 'LOW RISK (OPTIMAL)', icon: ShieldCheck };
  };

  const style = getStyle(riskPercent);
  const Icon = style.icon;

  const radius = 42;
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference - (riskPercent / 100) * circumference;

  return (
    <div className={`p-6 rounded-3xl border ${style.border} ${style.bg} backdrop-blur-xl space-y-4 shadow-2xl font-mono`}>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Semicircular Risk Gauge */}
        <div className="relative w-44 h-24 flex items-end justify-center shrink-0">
          <svg className="w-full h-full" viewBox="0 0 100 50">
            {/* Background Arc */}
            <path
              d="M 10,50 A 40,40 0 0,1 90,50"
              fill="none"
              className="stroke-slate-800/80"
              strokeWidth="10"
              strokeLinecap="round"
            />
            {/* Value Arc */}
            <path
              d="M 10,50 A 40,40 0 0,1 90,50"
              fill="none"
              className={`transition-all duration-1000 ease-out ${style.fill}`}
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute text-center bottom-0">
            <span className={`text-2xl font-extrabold font-mono block ${style.text}`}>{riskPercent}%</span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Risk Score</span>
          </div>
        </div>

        {/* Text Details */}
        <div className="space-y-2 text-center sm:text-left flex-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-xs font-bold uppercase tracking-wider">
            <Icon className={`w-4 h-4 ${style.text}`} />
            <span className={style.text}>{style.badge}</span>
          </div>

          <h3 className="text-sm text-slate-200 font-sans leading-relaxed">
            Patient vitals indicate a <strong className={style.text}>{riskPercent}% probability</strong> of Type 2 Diabetes onset based on statistical risk factors.
          </h3>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 pt-1 border-t border-slate-800/80">
            <span>Model Confidence: <strong className="text-teal-300">{confidence}%</strong></span>
            <span>•</span>
            <span>Flagged Vitals: <strong className="text-amber-300">{flaggedCount} of 8</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
}
