'use client';

import { useState } from 'react';
import { WeeklyMealPlan, PlannedMeal, DayPlan, UserProfile } from '@/types';
import RecipeDetailModal from './RecipeDetailModal';
import {
  Calendar,
  Sparkles,
  Flame,
  Dumbbell,
  Wheat,
  Droplet,
  Clock,
  ChefHat,
  ChevronRight,
  RefreshCw,
  ShoppingCart,
} from 'lucide-react';
import Link from 'next/link';

interface Props {
  plan: WeeklyMealPlan;
  profile: UserProfile;
  onRegeneratePlan?: () => void;
  isRegenerating?: boolean;
}

export default function MealPlanGrid({ plan, profile, onRegeneratePlan, isRegenerating }: Props) {
  const [selectedDayIdx, setSelectedDayIdx] = useState(0);
  const [selectedRecipe, setSelectedRecipe] = useState<PlannedMeal | null>(null);

  const activeDay: DayPlan = plan.days[selectedDayIdx] || plan.days[0];

  return (
    <div className="space-y-6 font-sans">
      {/* Plan Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#09121d] border-2 border-emerald-500/30 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-500/30">
              {plan.dietType.replace(/_/g, ' ').toUpperCase()}
            </span>
            <span className="text-xs text-slate-400 font-mono">7-Day Protocol</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-outfit">
            {plan.title}
          </h2>
          <p className="text-xs text-slate-400">
            Tailored for {profile.goal.replace('_', ' ')} • Target: {profile.targetCalories} kcal/day
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/grocery"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 text-xs font-bold text-slate-200 transition-all"
          >
            <ShoppingCart className="w-4 h-4 text-emerald-400" />
            <span>View Grocery List</span>
          </Link>

          {onRegeneratePlan && (
            <button
              onClick={onRegeneratePlan}
              disabled={isRegenerating}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-black font-extrabold text-xs shadow-md shadow-emerald-500/20 hover:scale-105 transition-all cursor-pointer disabled:opacity-40"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
              <span>{isRegenerating ? 'Regenerating...' : 'Regenerate Plan'}</span>
            </button>
          )}
        </div>
      </div>

      {/* 7-Day Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {plan.days.map((day, idx) => {
          const isSelected = selectedDayIdx === idx;
          return (
            <button
              key={day.dayNumber}
              onClick={() => setSelectedDayIdx(idx)}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-1 ${
                isSelected
                  ? 'bg-emerald-500/20 border-emerald-400 shadow-lg shadow-emerald-500/10 text-white'
                  : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              <span className="text-[10px] font-bold uppercase font-mono tracking-wider block">
                Day 0{day.dayNumber}
              </span>
              <span className="text-xs font-black font-outfit text-white block">
                {day.dayName}
              </span>
              <span className="text-[10px] font-mono text-emerald-400 block mt-0.5">
                {day.totalCalories} kcal
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Day Meals Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-white font-outfit flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-400" />
            {activeDay.dayName} Meals &amp; Recipes ({activeDay.meals.length} meals)
          </h3>

          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="text-white font-bold">{activeDay.totalCalories} kcal</span>
            <span className="text-emerald-400 font-bold">{activeDay.totalProtein}g P</span>
            <span className="text-cyan-400 font-bold">{activeDay.totalCarbs}g C</span>
            <span className="text-amber-400 font-bold">{activeDay.totalFat}g F</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeDay.meals.map((meal) => (
            <div
              key={meal.id}
              onClick={() => setSelectedRecipe(meal)}
              className="p-5 rounded-3xl bg-[#09121d] border-2 border-slate-800/90 hover:border-emerald-500/50 transition-all cursor-pointer group flex flex-col justify-between space-y-4 shadow-xl hover:-translate-y-0.5"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-950 text-emerald-400 font-mono text-[9px] font-bold uppercase border border-slate-800">
                    {meal.mealType}
                  </span>

                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
                    <Clock className="w-3 h-3 text-cyan-400" />
                    <span>{meal.prepTimeMinutes + meal.cookTimeMinutes} mins</span>
                  </div>
                </div>

                <h4 className="font-extrabold text-white text-base font-outfit group-hover:text-emerald-300 transition-colors">
                  {meal.title}
                </h4>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {meal.description}
                </p>
              </div>

              {/* Macro Chips & View Recipe Action */}
              <div className="flex items-center justify-between border-t border-slate-800/80 pt-3">
                <div className="flex items-center gap-2.5 text-[11px] font-mono font-bold">
                  <span className="text-white">{meal.calories} kcal</span>
                  <span className="text-emerald-400">{meal.protein}g P</span>
                  <span className="text-cyan-400">{meal.carbs}g C</span>
                  <span className="text-amber-400">{meal.fat}g F</span>
                </div>

                <span className="text-xs font-bold text-emerald-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                  <span>Recipe</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recipe Detail Modal */}
      <RecipeDetailModal
        recipe={selectedRecipe}
        isOpen={!!selectedRecipe}
        onClose={() => setSelectedRecipe(null)}
      />
    </div>
  );
}
