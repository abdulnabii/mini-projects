'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { UserProfile, MealAnalysisResult } from '@/types';
import {
  getStoredProfile,
  getTodayMealLogs,
  getWaterIntakeMl,
  addWaterIntakeMl,
  resetWaterIntake,
  deleteMealLog,
} from '@/lib/storage';
import MacroRing from '@/components/MacroRing';
import WaterTracker from '@/components/WaterTracker';
import MicronutrientRadar from '@/components/MicronutrientRadar';
import {
  Camera,
  Calendar,
  ChefHat,
  Sparkles,
  Flame,
  Dumbbell,
  Wheat,
  Droplet,
  Trash2,
  Plus,
  ArrowRight,
  Utensils,
  Clock,
  Heart,
  TrendingUp,
  ShieldCheck,
  Zap,
  Activity,
} from 'lucide-react';

export default function DashboardPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [mealLogs, setMealLogs] = useState<MealAnalysisResult[]>([]);
  const [waterMl, setWaterMl] = useState<number>(1750);

  useEffect(() => {
    setProfile(getStoredProfile());
    setMealLogs(getTodayMealLogs());
    setWaterMl(getWaterIntakeMl());
  }, []);

  const handleAddWater = (amt: number) => {
    const updated = addWaterIntakeMl(amt);
    setWaterMl(updated);
  };

  const handleResetWater = () => {
    const updated = resetWaterIntake();
    setWaterMl(updated);
  };

  const handleDeleteMeal = (id: string) => {
    const updated = deleteMealLog(id);
    setMealLogs(updated);
  };

  if (!profile) return null;

  const totalCaloriesConsumed = mealLogs.reduce((sum, m) => sum + m.totals.calories, 0);
  const totalProteinConsumed = mealLogs.reduce((sum, m) => sum + m.totals.protein, 0);

  return (
    <div className="space-y-10 font-mono w-full min-w-0">
      {/* Header Title (Project 9/10/21/22 Signature Style) */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span>PRECISION AI NUTRITION &amp; METABOLIC INTELLIGENCE</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight font-outfit">
          Precision Vision Nutrition &amp;{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400">
            Macro Intelligence
          </span>
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm font-mono max-w-2xl mx-auto leading-relaxed">
          Snap any meal photo for instant macronutrient &amp; caloric decomposition. Track protein targets, water hydration, and longevity micronutrients powered by Gemini 1.5 Vision.
        </p>
      </div>

      {/* Active Profile Banner */}
      <div className="p-6 rounded-3xl bg-[#0d1117] border border-emerald-500/30 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30 uppercase">
              {profile.dietType.replace(/_/g, ' ')}
            </span>
            <span className="text-xs text-slate-400">Targeting {profile.goal.replace(/_/g, ' ')}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-outfit">
            Welcome Back, {profile.name}
          </h2>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Link
            href="/scan"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-500 hover:from-emerald-300 hover:to-cyan-400 text-black font-extrabold text-xs shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all flex items-center gap-1.5"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Scan Meal Photo</span>
          </Link>

          <Link
            href="/plan"
            className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-emerald-500/40 text-white font-bold text-xs transition-all flex items-center gap-1.5"
          >
            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
            <span>7-Day Meal Plan</span>
          </Link>
        </div>
      </div>

      {/* 4 Stat Metric Strips */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#0d1117] border border-emerald-500/20 space-y-1 shadow-lg">
          <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-rose-400" /> Energy Budget
          </span>
          <div className="text-2xl font-black text-white">
            {totalCaloriesConsumed} <span className="text-xs text-slate-400 font-normal">/ {profile.targetCalories} kcal</span>
          </div>
          <span className="text-[10px] text-emerald-400">
            {Math.max(0, profile.targetCalories - totalCaloriesConsumed)} kcal remaining
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[#0d1117] border border-emerald-500/20 space-y-1 shadow-lg">
          <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1.5">
            <Dumbbell className="w-3.5 h-3.5 text-emerald-400" /> Protein Target
          </span>
          <div className="text-2xl font-black text-emerald-400">
            {Math.round(totalProteinConsumed)}g <span className="text-xs text-slate-400 font-normal">/ {profile.targetProteinG}g</span>
          </div>
          <span className="text-[10px] text-slate-400">
            {Math.round((totalProteinConsumed / profile.targetProteinG) * 100)}% target reached
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[#0d1117] border border-emerald-500/20 space-y-1 shadow-lg">
          <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1.5">
            <Droplet className="w-3.5 h-3.5 text-cyan-400" /> Hydration Level
          </span>
          <div className="text-2xl font-black text-cyan-400">
            {(waterMl / 1000).toFixed(2)}L <span className="text-xs text-slate-400 font-normal">/ {(profile.targetWaterMl / 1000).toFixed(1)}L</span>
          </div>
          <span className="text-[10px] text-slate-400">
            {Math.round((waterMl / profile.targetWaterMl) * 100)}% hydration
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[#0d1117] border border-emerald-500/20 space-y-1 shadow-lg">
          <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" /> Satiety Index
          </span>
          <div className="text-2xl font-black text-purple-400">
            94/100
          </div>
          <span className="text-[10px] text-emerald-400">
            Low Glycemic Load
          </span>
        </div>
      </div>

      {/* Macro Donut Rings & Water Hydration Station */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MacroRing profile={profile} mealLogs={mealLogs} />
        </div>

        <div className="lg:col-span-1">
          <WaterTracker
            currentMl={waterMl}
            targetMl={profile.targetWaterMl}
            onAddWater={handleAddWater}
            onResetWater={handleResetWater}
          />
        </div>
      </div>

      {/* Today's Logged Meals Feed */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0d1117] border border-emerald-500/20 space-y-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base font-outfit">Today's Meal Diary</h3>
              <p className="text-xs text-slate-400">{mealLogs.length} verified meals logged today</p>
            </div>
          </div>

          <Link
            href="/scan"
            className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Scan Meal</span>
          </Link>
        </div>

        {/* Meals List */}
        {mealLogs.length === 0 ? (
          <div className="p-8 text-center space-y-3">
            <p className="text-sm text-slate-400">No meals logged yet today.</p>
            <Link
              href="/scan"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 text-black font-bold text-xs"
            >
              <Camera className="w-4 h-4" />
              <span>Scan Your First Meal</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {mealLogs.map((meal) => (
              <div
                key={meal.id}
                className="p-4 sm:p-5 rounded-2xl bg-[#161b22] border border-slate-800 hover:border-emerald-500/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md"
              >
                <div className="flex items-center gap-4">
                  {meal.imageSrc && (
                    <img
                      src={meal.imageSrc}
                      alt={meal.mealName}
                      className="w-16 h-16 rounded-xl object-cover border border-slate-700 shrink-0"
                    />
                  )}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-mono font-bold uppercase border border-emerald-500/20">
                        {meal.mealType}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {new Date(meal.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <h4 className="font-bold text-white text-sm font-outfit">{meal.mealName}</h4>
                    <p className="text-[11px] text-slate-400">
                      {meal.items.map((i) => i.name).join(', ')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800">
                  <div className="flex items-center gap-3 text-xs font-mono font-bold">
                    <span className="text-white">{meal.totals.calories} kcal</span>
                    <span className="text-emerald-400">{Math.round(meal.totals.protein)}g P</span>
                    <span className="text-cyan-400">{Math.round(meal.totals.carbs)}g C</span>
                    <span className="text-amber-400">{Math.round(meal.totals.fat)}g F</span>
                  </div>

                  <button
                    onClick={() => handleDeleteMeal(meal.id)}
                    className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                    title="Delete meal entry"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Micronutrient Longevity Radar */}
      <MicronutrientRadar mealLogs={mealLogs} />
    </div>
  );
}
