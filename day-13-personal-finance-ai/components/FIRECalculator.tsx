'use client';

import { useState } from 'react';
import { Currency, FIREAnalysis } from '@/types';
import { formatCurrency } from '@/lib/storage';
import { Flame, TrendingUp, Sparkles, Sliders, Calendar, ArrowRight, ShieldCheck, Target, Award } from 'lucide-react';

interface Props {
  fire: FIREAnalysis;
  currency: Currency;
}

export default function FIRECalculator({ fire, currency }: Props) {
  const [savingsRateBonus, setSavingsRateBonus] = useState<number>(5);
  const [cutDiningMonthly, setCutDiningMonthly] = useState<number>(currency === 'PKR' ? 15000 : 200);

  const fmt = (amt: number) => formatCurrency(amt, currency);

  // Recalculate scenario impact
  const totalExtraAnnualSavings = fire.annualSavings * (savingsRateBonus / 100) + cutDiningMonthly * 12;
  const newAnnualSavings = fire.annualSavings + totalExtraAnnualSavings;

  const computeNewYears = () => {
    let current = fire.currentInvestments;
    let years = 0;
    const returnRate = 0.08;
    while (current < fire.fireNumber && years < 50) {
      current = current * (1 + returnRate) + newAnnualSavings;
      years++;
    }
    return years;
  };

  const newYearsToFIRE = computeNewYears();
  const yearsSaved = Math.max(0, fire.yearsToFIRE - newYearsToFIRE);
  const currentYear = new Date().getFullYear();
  const newFIREYear = currentYear + newYearsToFIRE;

  // Build SVG Projection Trajectory Curve Points (15 Data Points)
  const maxYears = Math.max(fire.yearsToFIRE, 15);
  const chartPoints: { year: number; baseValue: number; boostedValue: number }[] = [];

  let bVal = fire.currentInvestments;
  let boostVal = fire.currentInvestments;

  for (let y = 0; y <= maxYears; y++) {
    chartPoints.push({
      year: currentYear + y,
      baseValue: bVal,
      boostedValue: boostVal,
    });
    bVal = bVal * 1.08 + fire.annualSavings;
    boostVal = boostVal * 1.08 + newAnnualSavings;
  }

  const maxVal = Math.max(fire.fireNumber * 1.2, chartPoints[chartPoints.length - 1]?.boostedValue || 1000);
  const W = 600;
  const H = 220;
  const PAD = 30;

  const getX = (idx: number) => PAD + (idx / maxYears) * (W - 2 * PAD);
  const getY = (val: number) => H - PAD - (Math.min(val, maxVal) / maxVal) * (H - 2 * PAD);

  const baseLinePath = chartPoints
    .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${getX(idx).toFixed(1)} ${getY(p.baseValue).toFixed(1)}`)
    .join(' ');

  const boostedLinePath = chartPoints
    .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${getX(idx).toFixed(1)} ${getY(p.boostedValue).toFixed(1)}`)
    .join(' ');

  const fireTargetY = getY(fire.fireNumber);

  return (
    <div className="bg-[#0d1117] border border-amber-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl shadow-amber-500/10 font-mono text-xs text-slate-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base font-outfit">
              FIRE (Financial Independence, Retire Early) Target
            </h3>
            <p className="text-xs text-slate-400">
              Calculated using 4% Safe Withdrawal Rate Formula (25 x Annual Expenses)
            </p>
          </div>
        </div>

        <div className="px-4 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold text-xs">
          4% Rule Verified ({currency})
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* FIRE Target Number */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
          <span className="text-slate-400 text-[11px] font-bold">FIRE Target Portfolio</span>
          <p className="text-2xl sm:text-3xl font-black text-amber-400 font-outfit">{fmt(fire.fireNumber)}</p>
          <p className="text-[10px] text-slate-500">Based on {fmt(fire.annualExpenses)}/yr expenses</p>
        </div>

        {/* Years to FIRE */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
          <span className="text-slate-400 text-[11px] font-bold">Years to Financial Freedom</span>
          <p className="text-2xl sm:text-3xl font-black text-emerald-400 font-outfit">{fire.yearsToFIRE} Years</p>
          <p className="text-[10px] text-slate-500">
            Expected FIRE Year:{' '}
            <strong className="text-emerald-300">{fire.expectedFIREDate.split('-')[0]}</strong>
          </p>
        </div>

        {/* Current Savings Rate */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
          <span className="text-slate-400 text-[11px] font-bold">Current Savings Cadence</span>
          <p className="text-2xl sm:text-3xl font-black text-purple-400 font-outfit">{fmt(fire.annualSavings / 12)}/mo</p>
          <p className="text-[10px] text-slate-500">
            {(fire.monthlySavingsRate * 100).toFixed(1)}% of net monthly income
          </p>
        </div>
      </div>

      {/* Compound Growth Trajectory Chart */}
      <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-bold text-white text-xs font-outfit flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-amber-400" />
            Compound Portfolio Net Worth &amp; FIRE Pacing Projection Curve
          </span>
          <div className="flex items-center gap-3 text-[10px]">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400" /> Current Pacing
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Accelerated Scenario
            </span>
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-48 drop-shadow-xl min-w-[500px]">
            {/* Grid Lines */}
            <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke="#1e293b" strokeWidth="1" />
            <line x1={PAD} y1={PAD} x2={PAD} y2={H - PAD} stroke="#1e293b" strokeWidth="1" />

            {/* Target FIRE Horizontal Dash Line */}
            <line
              x1={PAD}
              y1={fireTargetY}
              x2={W - PAD}
              y2={fireTargetY}
              stroke="#f59e0b"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
            <text x={W - PAD - 90} y={fireTargetY - 6} fill="#f59e0b" fontSize="10" fontFamily="monospace">
              FIRE Goal: {fmt(fire.fireNumber)}
            </text>

            {/* Current Pacing Line */}
            <path d={baseLinePath} fill="none" stroke="#64748b" strokeWidth="2" strokeDasharray="3 3" />

            {/* Accelerated Curve */}
            <path d={boostedLinePath} fill="none" stroke="#10b981" strokeWidth="3" />
          </svg>
        </div>
      </div>

      {/* Interactive Scenario Simulator */}
      <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h4 className="font-bold text-white text-xs font-outfit flex items-center gap-2">
            <Sliders className="w-4 h-4 text-amber-400" />
            Interactive "What-If" Retirement Acceleration Simulator
          </h4>
          <span className="text-emerald-400 font-bold">Pulls in FIRE Date by {yearsSaved.toFixed(1)} Years!</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Slider 1: Savings Rate Bonus */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-slate-300 text-xs font-bold">Increase Savings Rate (+{savingsRateBonus}%)</label>
              <span className="text-amber-400 font-bold">+{savingsRateBonus}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="20"
              step="1"
              value={savingsRateBonus}
              onChange={(e) => setSavingsRateBonus(Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
            <p className="text-[10px] text-slate-500">Auto-investing an additional +{savingsRateBonus}% of income</p>
          </div>

          {/* Slider 2: Monthly Cut in Discretionary */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-slate-300 text-xs font-bold">
                Cut Discretionary Spending ({fmt(cutDiningMonthly)}/mo)
              </label>
              <span className="text-emerald-400 font-bold">{fmt(cutDiningMonthly)}/mo</span>
            </div>
            <input
              type="range"
              min="0"
              max={currency === 'PKR' ? 50000 : 600}
              step={currency === 'PKR' ? 2500 : 25}
              value={cutDiningMonthly}
              onChange={(e) => setCutDiningMonthly(Number(e.target.value))}
              className="w-full accent-emerald-400 cursor-pointer"
            />
            <p className="text-[10px] text-slate-500">Reallocating dining/shopping into index funds</p>
          </div>
        </div>

        {/* Result Callout */}
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <p className="font-bold text-white text-xs">
                New Accelerated FIRE Date:{' '}
                <strong className="text-emerald-400 font-outfit text-sm">
                  {newFIREYear} ({newYearsToFIRE} Years)
                </strong>
              </p>
              <p className="text-[10px] text-slate-400">
                By saving an extra {fmt(totalExtraAnnualSavings / 12)}/month, you retire{' '}
                <strong className="text-amber-400">{yearsSaved.toFixed(1)} years sooner</strong>!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
