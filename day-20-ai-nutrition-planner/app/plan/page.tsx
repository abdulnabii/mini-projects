'use client';

import { useState, useEffect } from 'react';
import { WeeklyMealPlan, UserProfile, DietaryGoal, DietType } from '@/types';
import {
  getStoredProfile,
  saveStoredProfile,
  getSavedMealPlan,
  saveMealPlan,
  saveGroceryList,
} from '@/lib/storage';
import { calculateTDEE, calculateAutoTargets } from '@/lib/nutritionCalc';
import MealPlanGrid from '@/components/MealPlanGrid';
import {
  Calendar,
  Sparkles,
  RefreshCw,
  Sliders,
  Flame,
  Dumbbell,
  Check,
  Zap,
} from 'lucide-react';

const GOAL_OPTIONS: { id: DietaryGoal; label: string }[] = [
  { id: 'fat_loss', label: 'Fat Loss (20% Deficit)' },
  { id: 'muscle_gain', label: 'Lean Muscle Hypertrophy (+12%)' },
  { id: 'metabolic_health', label: 'Metabolic & Insulin Health' },
  { id: 'longevity_endurance', label: 'Longevity & Cardiovascular' },
];

const DIET_OPTIONS: { id: DietType; label: string }[] = [
  { id: 'balanced_high_protein', label: 'Balanced High Protein' },
  { id: 'mediterranean', label: 'Longevity Mediterranean' },
  { id: 'keto_low_carb', label: 'Keto / Clean Low Carb' },
  { id: 'halal', label: 'Halal Certified Clean' },
  { id: 'vegetarian', label: 'Plant-Rich Vegetarian' },
  { id: 'vegan', label: 'Whole Food Vegan' },
  { id: 'gluten_free', label: 'Gluten-Free Celiac Safe' },
  { id: 'diabetic_friendly', label: 'Diabetic Low-GI Management' },
];

export default function MealPlanPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [mealPlan, setMealPlan] = useState<WeeklyMealPlan | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showConfig, setShowConfig] = useState(false);

  useEffect(() => {
    const prof = getStoredProfile();
    setProfile(prof);
    const plan = getSavedMealPlan();
    if (plan) {
      setMealPlan(plan);
    } else {
      generatePlan(prof);
    }
  }, []);

  const generatePlan = async (userProf: UserProfile) => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile: userProf }),
      });

      if (!res.ok) throw new Error('Plan generation failed');

      const plan: WeeklyMealPlan = await res.json();
      setMealPlan(plan);
      saveMealPlan(plan);
      if (plan.weeklyGroceryList) {
        saveGroceryList(plan.weeklyGroceryList);
      }
    } catch (err) {
      console.warn('Fallback generating meal plan:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUpdateProtocol = (goal: DietaryGoal, diet: DietType) => {
    if (!profile) return;
    const tdee = calculateTDEE(
      profile.weightKg,
      profile.heightCm,
      profile.age,
      profile.gender,
      profile.activityLevel
    );
    const targets = calculateAutoTargets(tdee, profile.weightKg, goal, diet);

    const updatedProfile: UserProfile = {
      ...profile,
      goal,
      dietType: diet,
      targetCalories: targets.calories,
      targetProteinG: targets.protein,
      targetCarbsG: targets.carbs,
      targetFatG: targets.fat,
      targetFiberG: targets.fiber,
      targetWaterMl: targets.water,
    };

    setProfile(updatedProfile);
    saveStoredProfile(updatedProfile);
    generatePlan(updatedProfile);
  };

  if (!profile) return null;

  return (
    <div className="space-y-8 font-sans">
      {/* Configuration Hub Toggle */}
      <div className="p-6 rounded-3xl bg-[#09121d] border-2 border-emerald-500/30 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-white text-base font-outfit">
                Dietary Goal &amp; Protocol Customizer
              </h3>
              <p className="text-xs text-slate-400">
                Switch diet types or goals to instantly re-architect your 7-day schedule
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowConfig(!showConfig)}
            className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            {showConfig ? 'Hide Settings' : 'Customize Targets'}
          </button>
        </div>

        {showConfig && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800 animate-in fade-in duration-200">
            {/* Fitness Goals */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase font-mono tracking-wider block">
                Primary Metabolic Goal
              </label>
              <div className="grid grid-cols-1 gap-2">
                {GOAL_OPTIONS.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => handleUpdateProtocol(g.id, profile.dietType)}
                    className={`p-3 rounded-2xl border text-left text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                      profile.goal === g.id
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400'
                        : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>{g.label}</span>
                    {profile.goal === g.id && <Check className="w-4 h-4 text-emerald-400" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Diet Protocols */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase font-mono tracking-wider block">
                Dietary Pattern / Philosophy
              </label>
              <div className="grid grid-cols-2 gap-2">
                {DIET_OPTIONS.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => handleUpdateProtocol(profile.goal, d.id)}
                    className={`p-3 rounded-2xl border text-left text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                      profile.dietType === d.id
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400'
                        : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>{d.label}</span>
                    {profile.dietType === d.id && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Meal Plan Grid */}
      {mealPlan ? (
        <MealPlanGrid
          plan={mealPlan}
          profile={profile}
          onRegeneratePlan={() => generatePlan(profile)}
          isRegenerating={isGenerating}
        />
      ) : (
        <div className="p-16 rounded-3xl bg-[#09121d] border-2 border-emerald-500/30 text-center space-y-4">
          <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
          <h3 className="font-bold text-white text-lg">Architecting Your 7-Day Performance Plan...</h3>
          <p className="text-xs text-slate-400">Gemini AI is calculating macro splits and balancing meals.</p>
        </div>
      )}
    </div>
  );
}
