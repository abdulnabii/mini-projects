'use client';

import { UserProfile, MealAnalysisResult } from '@/types';
import { Flame, Dumbbell, Wheat, Droplet, Sparkles } from 'lucide-react';

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
  const caloriePercent = Math.min(100, Math.round((consumedCalories / profile.targetCalories) * 100));

  // Circular calculations
  const radius = 78;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (caloriePercent / 100) * circumference;

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-[#09121d] border-2 border-emerald-500/30 shadow-2xl shadow-emerald-500/10 space-y-6 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-black text-white text-base font-outfit">Today's Macro &amp; Energy Balance</h3>
            <p className="text-xs text-slate-400">Real-time daily metabolic tracking</p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono font-bold text-xs">
          {caloriePercent}% Goal Reached
        </span>
      </div>

      {/* Main Calorie Ring & Macro Bars */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Circular Calorie Gauge */}
        <div className="relative w-48 h-48 flex items-center justify-center shrink-0">
          <svg className="w-full h-full transform -rotate-90">
            {/* Background Ring */}
            <circle
              cx="96"
              cy="96"
              r={radius}
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth="14"
              fill="transparent"
            />
            {/* Progress Ring */}
            <circle
              cx="96"
              cy="96"
              r={radius}
              stroke="url(#calorie-gradient)"
              strokeWidth="14"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-700 ease-out"
            />
            <defs>
              <linearGradient id="calorie-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="50%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#818cf8" />
              </linearGradient>
            </defs>
          </svg>

          {/* Center Stats */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-black text-white font-mono leading-none">
              {consumedCalories.toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">
              / {profile.targetCalories.toLocaleString()} kcal
            </span>
            <span className="text-[10px] text-emerald-400 font-mono mt-0.5">
              {remainingCalories} kcal left
            </span>
          </div>
        </div>

        {/* Macro Bars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1 w-full">
          {/* Protein */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Dumbbell className="w-4 h-4 text-emerald-400" />
                Protein
              </span>
              <span className="text-xs font-mono font-bold text-emerald-400">
                {Math.round(consumedProtein)}g / {profile.targetProteinG}g
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-emerald-400 transition-all duration-500"
                style={{
                  width: `${Math.min(100, (consumedProtein / profile.targetProteinG) * 100)}%`,
                }}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
              <span>{Math.round((consumedProtein * 4) / (consumedCalories || 1) * 100)}% of intake</span>
              <span>Goal: {profile.targetProteinG}g</span>
            </div>
          </div>

          {/* Carbohydrates */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Wheat className="w-4 h-4 text-cyan-400" />
                Carbohydrates
              </span>
              <span className="text-xs font-mono font-bold text-cyan-400">
                {Math.round(consumedCarbs)}g / {profile.targetCarbsG}g
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-cyan-400 transition-all duration-500"
                style={{
                  width: `${Math.min(100, (consumedCarbs / profile.targetCarbsG) * 100)}%`,
                }}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
              <span>{Math.round((consumedCarbs * 4) / (consumedCalories || 1) * 100)}% of intake</span>
              <span>Goal: {profile.targetCarbsG}g</span>
            </div>
          </div>

          {/* Healthy Fats */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Droplet className="w-4 h-4 text-amber-400" />
                Total Fats
              </span>
              <span className="text-xs font-mono font-bold text-amber-400">
                {Math.round(consumedFat)}g / {profile.targetFatG}g
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-amber-400 transition-all duration-500"
                style={{
                  width: `${Math.min(100, (consumedFat / profile.targetFatG) * 100)}%`,
                }}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
              <span>{Math.round((consumedFat * 9) / (consumedCalories || 1) * 100)}% of intake</span>
              <span>Goal: {profile.targetFatG}g</span>
            </div>
          </div>

          {/* Dietary Fiber */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-violet-400" />
                Prebiotic Fiber
              </span>
              <span className="text-xs font-mono font-bold text-violet-400">
                {Math.round(consumedFiber)}g / {profile.targetFiberG}g
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-violet-400 transition-all duration-500"
                style={{
                  width: `${Math.min(100, (consumedFiber / profile.targetFiberG) * 100)}%`,
                }}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
              <span>Gut Microbiome Target</span>
              <span>{Math.round((consumedFiber / profile.targetFiberG) * 100)}% complete</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
