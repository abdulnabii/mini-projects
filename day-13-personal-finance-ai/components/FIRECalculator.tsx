'use client';

import { useState } from 'react';
import { Currency, FIREAnalysis } from '@/types';
import { formatCurrency } from '@/lib/storage';
import { Flame, TrendingUp, Sparkles, Sliders, Calendar, ArrowRight, ShieldCheck } from 'lucide-react';

interface Props {
  fire: FIREAnalysis;
  currency: Currency;
}

export default function FIRECalculator({ fire, currency }: Props) {
  const [savingsRateBonus, setSavingsRateBonus] = useState<number>(5); // +5% default
  const [cutDiningMonthly, setCutDiningMonthly] = useState<number>(currency === 'PKR' ? 15000 : 200);

  const fmt = (amt: number) => formatCurrency(amt, currency);

  // Recalculate scenario impact
  const totalExtraAnnualSavings = (fire.annualSavings * (savingsRateBonus / 100)) + (cutDiningMonthly * 12);
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

  return (
    <div className="bg-[#0d1117] border border-amber-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl shadow-amber-500/10 font-mono text-xs text-slate-300">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base font-outfit">FIRE (Financial Independence, Retire Early) Target</h3>
            <p className="text-xs text-slate-400">Calculated using 4% Safe Withdrawal Rate Formula (25 x Annual Expenses)</p>
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
          <p className="text-[10px] text-slate-500">Expected FIRE Year: <strong className="text-emerald-300">{fire.expectedFIREDate.split('-')[0]}</strong></p>
        </div>

        {/* Current Savings Rate */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
          <span className="text-slate-400 text-[11px] font-bold">Current Savings Cadence</span>
          <p className="text-2xl sm:text-3xl font-black text-purple-400 font-outfit">{fmt(fire.annualSavings / 12)}/mo</p>
          <p className="text-[10px] text-slate-500">{(fire.monthlySavingsRate * 100).toFixed(1)}% of net monthly income</p>
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
              <label className="text-slate-300 text-xs font-bold">Cut Discretionary Spending ({fmt(cutDiningMonthly)}/mo)</label>
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
              <p className="font-bold text-white text-xs">New Accelerated FIRE Date: <strong className="text-emerald-400 font-outfit text-sm">{newFIREYear} ({newYearsToFIRE} Years)</strong></p>
              <p className="text-[10px] text-slate-400">By saving an extra {fmt(totalExtraAnnualSavings / 12)}/month, you retire <strong className="text-amber-400">{yearsSaved.toFixed(1)} years sooner</strong>!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
