'use client';

import { useState } from 'react';
import { PatientVitals } from '@/types';
import { calculateDiabetesRisk } from '@/lib/diabetes-ml';
import { Sliders, Sparkles, TrendingDown, ShieldCheck, ArrowRight, HeartPulse } from 'lucide-react';

interface Props {
  baselineVitals: PatientVitals;
  baselineRiskPercent: number;
}

export default function WhatIfSimulator({ baselineVitals, baselineRiskPercent }: Props) {
  const [glucoseReduction, setGlucoseReduction] = useState(25);
  const [bmiReduction, setBmiReduction] = useState(2.5);
  const [bpReduction, setBpReduction] = useState(8);

  // Compute simulated vitals
  const simulatedVitals: PatientVitals = {
    ...baselineVitals,
    glucose: Math.max(75, baselineVitals.glucose - glucoseReduction),
    bmi: Math.max(18.5, Number((baselineVitals.bmi - bmiReduction).toFixed(1))),
    bloodPressure: Math.max(65, baselineVitals.bloodPressure - bpReduction),
  };

  const simulatedPrediction = calculateDiabetesRisk(simulatedVitals);
  const riskDrop = Math.max(0, baselineRiskPercent - simulatedPrediction.riskPercent);

  return (
    <div className="bg-[#0b1724] border border-teal-500/20 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl font-mono text-xs text-slate-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base font-outfit">
              Interactive "What-If" Lifestyle Risk Mitigator
            </h3>
            <p className="text-xs text-slate-400">
              Simulate dietary &amp; weight loss interventions to observe projected Type 2 Diabetes probability reduction
            </p>
          </div>
        </div>

        <div className="px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-xs flex items-center gap-1.5">
          <TrendingDown className="w-4 h-4" />
          <span>-{riskDrop}% Risk Reduction</span>
        </div>
      </div>

      {/* Sliders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Glucose Improvement */}
        <div className="space-y-2 bg-[#07101a] p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between">
            <label className="text-slate-300 text-xs font-bold">Fasting Glucose Target</label>
            <span className="text-teal-400 font-bold">-{glucoseReduction} mg/dL</span>
          </div>
          <input
            type="range"
            min="0"
            max="80"
            step="5"
            value={glucoseReduction}
            onChange={(e) => setGlucoseReduction(Number(e.target.value))}
            className="w-full accent-teal-400 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>Baseline: {baselineVitals.glucose}</span>
            <span className="text-emerald-400 font-bold">Simulated: {simulatedVitals.glucose} mg/dL</span>
          </div>
        </div>

        {/* BMI Improvement */}
        <div className="space-y-2 bg-[#07101a] p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between">
            <label className="text-slate-300 text-xs font-bold">BMI Weight Loss Target</label>
            <span className="text-teal-400 font-bold">-{bmiReduction} kg/m²</span>
          </div>
          <input
            type="range"
            min="0"
            max="10"
            step="0.5"
            value={bmiReduction}
            onChange={(e) => setBmiReduction(Number(e.target.value))}
            className="w-full accent-teal-400 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>Baseline: {baselineVitals.bmi}</span>
            <span className="text-emerald-400 font-bold">Simulated: {simulatedVitals.bmi}</span>
          </div>
        </div>

        {/* BP Improvement */}
        <div className="space-y-2 bg-[#07101a] p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between">
            <label className="text-slate-300 text-xs font-bold">Diastolic BP Reduction</label>
            <span className="text-teal-400 font-bold">-{bpReduction} mmHg</span>
          </div>
          <input
            type="range"
            min="0"
            max="25"
            step="1"
            value={bpReduction}
            onChange={(e) => setBpReduction(Number(e.target.value))}
            className="w-full accent-teal-400 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>Baseline: {baselineVitals.bloodPressure}</span>
            <span className="text-emerald-400 font-bold">Simulated: {simulatedVitals.bloodPressure} mmHg</span>
          </div>
        </div>
      </div>

      {/* Comparison Callout Card */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-teal-950/60 to-emerald-950/60 border border-teal-500/40 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <HeartPulse className="w-8 h-8 text-teal-400 shrink-0" />
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-slate-400">Post-Intervention Risk Forecast</span>
            <p className="text-sm font-bold text-white font-outfit">
              Risk Drops from <span className="text-rose-400 line-through">{baselineRiskPercent}%</span> to{' '}
              <span className="text-emerald-400 text-lg font-black">{simulatedPrediction.riskPercent}%</span>
            </p>
          </div>
        </div>

        <div className="text-[11px] text-teal-200 sm:text-right">
          <span className="block font-bold">Category: {simulatedPrediction.classification}</span>
          <span className="text-slate-400 text-[10px]">Model Flagged Vitals: {simulatedPrediction.flaggedCount} of 8</span>
        </div>
      </div>
    </div>
  );
}
