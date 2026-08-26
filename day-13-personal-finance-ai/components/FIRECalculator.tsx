'use client';

import { useState } from 'react';
import { Currency, FIREAnalysis } from '@/types';
import { formatCurrency } from '@/lib/storage';
import {
  Flame,
  TrendingUp,
  Sparkles,
  Sliders,
  Calendar,
  ArrowRight,
  ShieldCheck,
  Target,
  Award,
  Zap,
} from 'lucide-react';

interface Props {
  fire: FIREAnalysis;
  currency: Currency;
}

export default function FIRECalculator({ fire, currency }: Props) {
  const [savingsRateBonus, setSavingsRateBonus] = useState<number>(5);
  const [cutDiningMonthly, setCutDiningMonthly] = useState<number>(
    currency === 'PKR' ? 15000 : currency === 'INR' ? 5000 : 250
  );

  const fmt = (amt: number) => formatCurrency(amt, currency);

  // Recalculate scenario impact
  const totalExtraAnnualSavings =
    fire.annualSavings * (savingsRateBonus / 100) + cutDiningMonthly * 12;
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

  // Build SVG Projection Trajectory Curve Points
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

  const maxVal = Math.max(
    fire.fireNumber * 1.2,
    chartPoints[chartPoints.length - 1]?.boostedValue || 1000
  );
  const W = 600;
  const H = 220;
  const PAD = 35;

  const getX = (idx: number) => PAD + (idx / maxYears) * (W - 2 * PAD);
  const getY = (val: number) => H - PAD - (Math.min(val, maxVal) / maxVal) * (H - 2 * PAD);

  const baseLinePath = chartPoints
    .map(
      (p, idx) =>
        `${idx === 0 ? 'M' : 'L'} ${getX(idx).toFixed(1)} ${getY(p.baseValue).toFixed(1)}`
    )
    .join(' ');

  const boostedLinePath = chartPoints
    .map(
      (p, idx) =>
        `${idx === 0 ? 'M' : 'L'} ${getX(idx).toFixed(1)} ${getY(p.boostedValue).toFixed(1)}`
    )
    .join(' ');

  const fireTargetY = getY(fire.fireNumber);

  return (
    <div className="bg-[#0d1117] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl font-mono text-xs text-slate-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Flame className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-white text-sm font-mono">
                FIRE (Financial Independence, Retire Early) Target Engine
              </h3>
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                4% SWR FORMULA
              </span>
            </div>
            <p className="text-xs text-slate-400 prose-text">
              Calculated using the standard Trinity Study 4% Safe Withdrawal Rule (25x Annual Outflow)
            </p>
          </div>
        </div>

        <div className="px-3 py-1.5 rounded-lg bg-[#161b22] border border-slate-800 text-emerald-400 font-bold text-xs font-mono">
          Currency: {currency} • Progress: {fire.progressPercent}%
        </div>
      </div>

      {/* 4 FIRE Milestone Targets Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Traditional FIRE */}
        <div className="p-4 rounded-xl bg-[#161b22] border border-emerald-500/40 space-y-1 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-emerald-400 text-[10px] font-bold uppercase font-mono">
              Traditional FIRE (100%)
            </span>
            <Target className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <p className="text-xl font-bold text-white font-mono">{fmt(fire.fireNumber)}</p>
          <p className="text-[10px] text-slate-400">25x annual expenses ({fmt(fire.annualExpenses)}/yr)</p>
        </div>

        {/* Lean FIRE */}
        <div className="p-4 rounded-xl bg-[#161b22] border border-slate-800 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-cyan-400 text-[10px] font-bold uppercase font-mono">
              Lean FIRE (75%)
            </span>
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <p className="text-xl font-bold text-cyan-300 font-mono">{fmt(fire.leanFIRENumber)}</p>
          <p className="text-[10px] text-slate-400">Frugal baseline coverage</p>
        </div>

        {/* Fat FIRE */}
        <div className="p-4 rounded-xl bg-[#161b22] border border-slate-800 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-purple-400 text-[10px] font-bold uppercase font-mono">
              Fat FIRE (140%)
            </span>
            <Award className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <p className="text-xl font-bold text-purple-300 font-mono">{fmt(fire.fatFIRENumber)}</p>
          <p className="text-[10px] text-slate-400">Abundant luxury lifestyle</p>
        </div>

        {/* Coast FIRE */}
        <div className="p-4 rounded-xl bg-[#161b22] border border-slate-800 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-amber-400 text-[10px] font-bold uppercase font-mono">
              Coast FIRE Target
            </span>
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <p className="text-xl font-bold text-amber-300 font-mono">{fmt(fire.coastFIRENumber)}</p>
          <p className="text-[10px] text-slate-400">Zero additional savings needed</p>
        </div>
      </div>

      {/* 3 Core Pacing Telemetry */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="p-4 rounded-xl bg-[#161b22] border border-slate-800 space-y-1">
          <span className="text-slate-400 text-[10px] font-bold uppercase">Time to Financial Freedom</span>
          <p className="text-2xl font-bold text-emerald-400 font-mono">{fire.yearsToFIRE} Years</p>
          <p className="text-[10px] text-slate-400">
            Target Year: <strong className="text-emerald-300">{fire.expectedFIREDate.split('-')[0]}</strong>
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#161b22] border border-slate-800 space-y-1">
          <span className="text-slate-400 text-[10px] font-bold uppercase">Current Investment Stash</span>
          <p className="text-2xl font-bold text-white font-mono">{fmt(fire.currentInvestments)}</p>
          <p className="text-[10px] text-slate-400">
            {fire.progressPercent}% of Traditional Target
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#161b22] border border-slate-800 space-y-1">
          <span className="text-slate-400 text-[10px] font-bold uppercase">Annual Savings Cadence</span>
          <p className="text-2xl font-bold text-purple-400 font-mono">{fmt(fire.annualSavings / 12)}/mo</p>
          <p className="text-[10px] text-slate-400">
            {(fire.monthlySavingsRate * 100).toFixed(1)}% of net monthly cashflow
          </p>
        </div>
      </div>

      {/* Compound Growth Trajectory Chart */}
      <div className="p-5 rounded-xl bg-[#04080e] border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-bold text-white text-xs font-mono flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            Compound Net Worth &amp; FIRE Pacing Projection Curve
          </span>
          <div className="flex items-center gap-3 text-[10px] font-mono">
            <span className="flex items-center gap-1 text-slate-400">
              <span className="w-2 h-2 rounded-full bg-slate-500" /> Baseline Trajectory
            </span>
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400" /> Accelerated What-If
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
              stroke="#10b981"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
            <text
              x={W - PAD - 105}
              y={fireTargetY - 6}
              fill="#10b981"
              fontSize="10"
              fontFamily="monospace"
              fontWeight="bold"
            >
              FIRE Target: {fmt(fire.fireNumber)}
            </text>

            {/* Current Pacing Line */}
            <path
              d={baseLinePath}
              fill="none"
              stroke="#64748b"
              strokeWidth="2"
              strokeDasharray="3 3"
            />

            {/* Accelerated Curve */}
            <path d={boostedLinePath} fill="none" stroke="#10b981" strokeWidth="3" />
          </svg>
        </div>
      </div>

      {/* Interactive Scenario Simulator */}
      <div className="p-5 rounded-xl bg-[#161b22] border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <h4 className="font-bold text-white text-xs font-mono flex items-center gap-1.5">
            <Sliders className="w-4 h-4 text-emerald-400" />
            Interactive "What-If" Retirement Acceleration Simulator
          </h4>
          <span className="text-emerald-400 font-bold font-mono">
            Pulls in FIRE Date by {yearsSaved.toFixed(1)} Years!
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Slider 1: Savings Rate Bonus */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-slate-300 text-xs font-bold font-mono">
                Increase Savings Rate (+{savingsRateBonus}%)
              </label>
              <span className="text-emerald-400 font-bold font-mono">+{savingsRateBonus}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="25"
              step="1"
              value={savingsRateBonus}
              onChange={(e) => setSavingsRateBonus(Number(e.target.value))}
              className="w-full accent-emerald-400 cursor-pointer"
            />
            <p className="text-[10px] text-slate-500 prose-text">
              Auto-investing an additional +{savingsRateBonus}% of monthly income into broad index funds
            </p>
          </div>

          {/* Slider 2: Monthly Cut in Discretionary */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-slate-300 text-xs font-bold font-mono">
                Trim Discretionary Outflow ({fmt(cutDiningMonthly)}/mo)
              </label>
              <span className="text-emerald-400 font-bold font-mono">{fmt(cutDiningMonthly)}/mo</span>
            </div>
            <input
              type="range"
              min="0"
              max={currency === 'PKR' ? 60000 : currency === 'INR' ? 20000 : 800}
              step={currency === 'PKR' ? 2500 : currency === 'INR' ? 1000 : 25}
              value={cutDiningMonthly}
              onChange={(e) => setCutDiningMonthly(Number(e.target.value))}
              className="w-full accent-emerald-400 cursor-pointer"
            />
            <p className="text-[10px] text-slate-500 prose-text">
              Reallocating restaurant/shopping budget directly into compound equity portfolio
            </p>
          </div>
        </div>

        {/* Result Callout */}
        <div className="p-3.5 rounded-xl bg-[#0d1117] border border-emerald-500/30 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <p className="font-bold text-white text-xs font-mono">
                New Accelerated Retirement Date:{' '}
                <strong className="text-emerald-400 text-sm">
                  {newFIREYear} ({newYearsToFIRE} Years)
                </strong>
              </p>
              <p className="text-[10px] text-slate-400 prose-text">
                By investing an extra {fmt(totalExtraAnnualSavings / 12)}/month, you reach financial independence{' '}
                <strong className="text-emerald-300">{yearsSaved.toFixed(1)} years sooner</strong>!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
