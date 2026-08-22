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

  return (
    <div className="space-y-8 font-sans">
      {/* Welcome Hero Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#091522] via-[#091b24] to-[#0a1820] border-2 border-emerald-500/30 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono text-xs font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Active Protocol: {profile.dietType.replace(/_/g, ' ').toUpperCase()}
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white font-outfit">
            Welcome Back, {profile.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Targeting <strong className="text-emerald-400">{profile.goal.replace(/_/g, ' ')}</strong> with{' '}
            <strong className="text-white">{profile.targetCalories} kcal</strong> and{' '}
            <strong className="text-emerald-400">{profile.targetProteinG}g protein</strong> daily.
          </p>
        </div>

        {/* Quick Launch Action CTAs */}
        <div className="flex items-center gap-3 flex-wrap">
          <Link
            href="/scan"
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-black font-black text-xs shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all flex items-center gap-2"
          >
            <Camera className="w-4 h-4" />
            <span>AI Food Photo Scan</span>
          </Link>

          <Link
            href="/plan"
            className="px-5 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold text-xs transition-all flex items-center gap-2"
          >
            <Calendar className="w-4 h-4 text-emerald-400" />
            <span>7-Day Meal Plan</span>
          </Link>
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
      <div className="p-6 sm:p-8 rounded-3xl bg-[#09121d] border-2 border-emerald-500/30 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-white text-base font-outfit">Today's Meal Diary</h3>
              <p className="text-xs text-slate-400">{mealLogs.length} meals logged today</p>
            </div>
          </div>

          <Link
            href="/scan"
            className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Log Meal</span>
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
                className="p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  {meal.imageSrc && (
                    <img
                      src={meal.imageSrc}
                      alt={meal.mealName}
                      className="w-16 h-16 rounded-xl object-cover border border-slate-800 shrink-0"
                    />
                  )}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-mono font-bold uppercase">
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
                    className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
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
