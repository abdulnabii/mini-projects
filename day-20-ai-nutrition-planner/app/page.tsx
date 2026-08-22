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
    <div className="space-y-8 font-sans">
      {/* Welcome Hero Banner */}
      <div className="p-6 sm:p-10 rounded-3xl glass-card relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Glow ambient background mesh */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono text-xs font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Active Protocol: {profile.dietType.replace(/_/g, ' ').toUpperCase()}
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white font-outfit tracking-tight">
            Welcome Back, <span className="gradient-text-emerald">{profile.name}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            Targeting <strong className="text-emerald-400">{profile.goal.replace(/_/g, ' ')}</strong> with{' '}
            <strong className="text-white">{profile.targetCalories.toLocaleString()} kcal</strong> and{' '}
            <strong className="text-emerald-400">{profile.targetProteinG}g protein</strong> daily energy expenditure.
          </p>
        </div>

        {/* Quick Launch Action CTAs */}
        <div className="relative z-10 flex items-center gap-3 flex-wrap">
          <Link
            href="/scan"
            className="px-6 py-4 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-500 hover:from-emerald-300 hover:to-cyan-400 text-black font-black text-xs shadow-xl shadow-emerald-500/20 hover:scale-105 transition-all flex items-center gap-2"
          >
            <Camera className="w-4 h-4" />
            <span>AI Food Photo Scanner</span>
          </Link>

          <Link
            href="/plan"
            className="px-5 py-4 rounded-2xl bg-slate-950/80 hover:bg-slate-900 border border-white/10 text-white font-bold text-xs transition-all flex items-center gap-2"
          >
            <Calendar className="w-4 h-4 text-emerald-400" />
            <span>7-Day Meal Plan</span>
          </Link>
        </div>
      </div>

      {/* 4 Stat Metric Strips */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl glass-card space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase font-mono flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-rose-400" /> Energy Budget
          </span>
          <div className="text-2xl font-black font-mono text-white">
            {totalCaloriesConsumed} <span className="text-xs text-slate-400 font-normal">/ {profile.targetCalories} kcal</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-mono">
            {Math.max(0, profile.targetCalories - totalCaloriesConsumed)} kcal remaining
          </span>
        </div>

        <div className="p-5 rounded-2xl glass-card space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase font-mono flex items-center gap-1">
            <Dumbbell className="w-3.5 h-3.5 text-emerald-400" /> Protein Target
          </span>
          <div className="text-2xl font-black font-mono text-emerald-400">
            {Math.round(totalProteinConsumed)}g <span className="text-xs text-slate-400 font-normal">/ {profile.targetProteinG}g</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            {Math.round((totalProteinConsumed / profile.targetProteinG) * 100)}% target reached
          </span>
        </div>

        <div className="p-5 rounded-2xl glass-card space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase font-mono flex items-center gap-1">
            <Droplet className="w-3.5 h-3.5 text-cyan-400" /> Hydration Level
          </span>
          <div className="text-2xl font-black font-mono text-cyan-400">
            {(waterMl / 1000).toFixed(2)}L <span className="text-xs text-slate-400 font-normal">/ {(profile.targetWaterMl / 1000).toFixed(1)}L</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            {Math.round((waterMl / profile.targetWaterMl) * 100)}% hydration
          </span>
        </div>

        <div className="p-5 rounded-2xl glass-card space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase font-mono flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" /> Dietary Satiety
          </span>
          <div className="text-2xl font-black font-mono text-purple-400">
            94/100
          </div>
          <span className="text-[10px] text-emerald-400 font-mono">
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
      <div className="p-6 sm:p-8 rounded-3xl glass-card space-y-6">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-white text-base font-outfit">Today's Meal Diary</h3>
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
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 text-black font-bold text-xs"
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
                className="p-4 sm:p-5 rounded-2xl bg-slate-950/60 border border-white/5 hover:border-emerald-500/30 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  {meal.imageSrc && (
                    <img
                      src={meal.imageSrc}
                      alt={meal.mealName}
                      className="w-16 h-16 rounded-xl object-cover border border-white/10 shrink-0"
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
                    className="p-2 rounded-lg bg-slate-900 border border-white/10 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
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
