'use client';

import { UserProfile, MealAnalysisResult } from '@/types';
import { Flame, Dumbbell, Wheat, Droplet, Sparkles, Activity } from 'lucide-react';

interface Props {
  profile: UserProfile;
  mealLogs: MealAnalysisResult[];
}

export default function MacroRing({ profile, mealLogs }: Props) {
  // Aggregate today's consumption
  const consumedCalories = mealLogs.reduce((sum, m) => sum + m.totals.calories, 0);
  const consumedProtein = mealLogs.reduce((sum, m) => sum + m.totals.protein, 0);
  const consumedCarbs = mealLogs.reduce((sum, m) => sum + m.totals.carbs, 0);
  const consumedFat = mealLogs.reduce((sum, m) => sum + m.totals.fat, 0);
  const consumedFiber = mealLogs.reduce((sum, m) => sum + m.totals.fiber, 0);

  const remainingCalories = Math.max(0, profile.targetCalories - consumedCalories);
  const calPercent = Math.min(100, (consumedCalories / profile.targetCalories) * 100);
  const proPercent = Math.min(100, (consumedProtein / profile.targetProteinG) * 100);
  const carbPercent = Math.min(100, (consumedCarbs / profile.targetCarbsG) * 100);
  const fatPercent = Math.min(100, (consumedFat / profile.targetFatG) * 100);

  // Concentric ring radii & circumferences
  const rings = [
    { r: 84, stroke: 10, percent: calPercent, color: '#10b981', gradientId: 'cal-grad' },
    { r: 70, stroke: 9, percent: proPercent, color: '#06b6d4', gradientId: 'pro-grad' },
    { r: 57, stroke: 8, percent: carbPercent, color: '#38bdf8', gradientId: 'carb-grad' },
    { r: 45, stroke: 7, percent: fatPercent, color: '#f59e0b', gradientId: 'fat-grad' },
  ];

  return (
    <div className="p-6 sm:p-8 rounded-3xl glass-card space-y-6 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-black text-white text-base font-outfit">
              Daily Macro &amp; Energy Metabolism
            </h3>
            <p className="text-xs text-slate-400">Concentric biological target tracker</p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono font-bold text-xs">
          {Math.round(calPercent)}% Calorie Budget
        </span>
      </div>

      {/* Main Rings + Macro Metrics */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Concentric SVG Donut Rings */}
        <div className="relative w-52 h-52 flex items-center justify-center shrink-0">
          <svg className="w-full h-full transform -rotate-90">
            <defs>
              <linearGradient id="cal-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#34d399" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
              <linearGradient id="pro-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#22d3ee" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
              <linearGradient id="carb-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#60a5fa" />
                <stop offset="100%" stopColor="#38bdf8" />
              </linearGradient>
              <linearGradient id="fat-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
            </defs>

            {rings.map((ring, idx) => {
              const circ = 2 * Math.PI * ring.r;
              const offset = circ - (ring.percent / 100) * circ;
              return (
                <g key={idx}>
                  {/* Track */}
                  <circle
                    cx="104"
                    cy="104"
                    r={ring.r}
                    stroke="rgba(255, 255, 255, 0.05)"
                    strokeWidth={ring.stroke}
                    fill="transparent"
                  />
                  {/* Progress Fill */}
                  <circle
                    cx="104"
                    cy="104"
                    r={ring.r}
                    stroke={`url(#${ring.gradientId})`}
                    strokeWidth={ring.stroke}
                    strokeDasharray={circ}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-700 ease-out"
                  />
                </g>
              );
            })}
          </svg>

          {/* Center Readout */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-black text-white font-mono leading-none tracking-tight">
              {consumedCalories.toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">
              / {profile.targetCalories.toLocaleString()} kcal
            </span>
            <span className="text-[10px] text-emerald-400 font-mono font-bold mt-0.5">
              {remainingCalories} kcal left
            </span>
          </div>
        </div>

        {/* 4 Macro Breakdown Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 flex-1 w-full">
          {/* Protein */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 space-y-2 hover:border-emerald-500/30 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5 font-outfit">
                <Dumbbell className="w-4 h-4 text-emerald-400" />
                Protein
              </span>
              <span className="text-xs font-mono font-bold text-emerald-400">
                {Math.round(consumedProtein)}g / {profile.targetProteinG}g
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800/80 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 transition-all duration-500 shadow-sm shadow-emerald-400/50"
                style={{ width: `${Math.min(100, proPercent)}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span>{Math.round(proPercent)}% Target</span>
              <span>{Math.round(consumedProtein * 4)} kcal</span>
            </div>
          </div>

          {/* Carbohydrates */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 space-y-2 hover:border-cyan-500/30 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5 font-outfit">
                <Wheat className="w-4 h-4 text-cyan-400" />
                Carbohydrates
              </span>
              <span className="text-xs font-mono font-bold text-cyan-400">
                {Math.round(consumedCarbs)}g / {profile.targetCarbsG}g
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800/80 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-sky-400 transition-all duration-500 shadow-sm shadow-cyan-400/50"
                style={{ width: `${Math.min(100, carbPercent)}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span>{Math.round(carbPercent)}% Target</span>
              <span>{Math.round(consumedCarbs * 4)} kcal</span>
            </div>
          </div>

          {/* Healthy Fats */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 space-y-2 hover:border-amber-500/30 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5 font-outfit">
                <Droplet className="w-4 h-4 text-amber-400" />
                Total Fats
              </span>
              <span className="text-xs font-mono font-bold text-amber-400">
                {Math.round(consumedFat)}g / {profile.targetFatG}g
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800/80 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-400 to-yellow-400 transition-all duration-500 shadow-sm shadow-amber-400/50"
                style={{ width: `${Math.min(100, fatPercent)}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span>{Math.round(fatPercent)}% Target</span>
              <span>{Math.round(consumedFat * 9)} kcal</span>
            </div>
          </div>

          {/* Dietary Prebiotic Fiber */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 space-y-2 hover:border-purple-500/30 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5 font-outfit">
                <Sparkles className="w-4 h-4 text-purple-400" />
                Prebiotic Fiber
              </span>
              <span className="text-xs font-mono font-bold text-purple-400">
                {Math.round(consumedFiber)}g / {profile.targetFiberG}g
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800/80 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-500 shadow-sm shadow-purple-400/50"
                style={{
                  width: `${Math.min(100, (consumedFiber / profile.targetFiberG) * 100)}%`,
                }}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span>Gut Microbiome Score</span>
              <span>{Math.round((consumedFiber / profile.targetFiberG) * 100)}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
