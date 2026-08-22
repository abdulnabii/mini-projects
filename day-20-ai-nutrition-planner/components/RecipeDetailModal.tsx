'use client';

import { useState, useEffect } from 'react';
import { PlannedMeal } from '@/types';
import {
  X,
  Clock,
  Flame,
  Dumbbell,
  Wheat,
  Droplet,
  CheckCircle2,
  ChefHat,
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  Tag,
} from 'lucide-react';

interface Props {
  recipe: PlannedMeal | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function RecipeDetailModal({ recipe, isOpen, onClose }: Props) {
  const [checkedIngredients, setCheckedIngredients] = useState<Record<string, boolean>>({});
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  if (!isOpen || !recipe) return null;

  const startTimer = (minutes: number) => {
    setTimerSeconds(minutes * 60);
    setIsTimerRunning(true);
  };

  const toggleIngredient = (name: string) => {
    setCheckedIngredients((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 font-sans">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#09121d] border-2 border-emerald-500/40 p-6 sm:p-8 space-y-6 shadow-2xl shadow-emerald-500/10">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-emerald-400 uppercase font-mono tracking-wider">
              {recipe.mealType.toUpperCase()} RECIPE
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white font-outfit">
              {recipe.title}
            </h3>
            <p className="text-xs text-slate-400">{recipe.description}</p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Macro & Time Summary Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center">
            <span className="text-lg font-black font-mono text-white block">
              {recipe.calories} kcal
            </span>
            <span className="text-[10px] text-slate-400 uppercase font-bold">Calories</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center">
            <span className="text-lg font-black font-mono text-emerald-400 block">
              {recipe.protein}g
            </span>
            <span className="text-[10px] text-slate-400 uppercase font-bold">Protein</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center">
            <span className="text-lg font-black font-mono text-cyan-400 block">
              {recipe.carbs}g
            </span>
            <span className="text-[10px] text-slate-400 uppercase font-bold">Carbs</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center">
            <span className="text-lg font-black font-mono text-amber-400 block">
              {recipe.fat}g
            </span>
            <span className="text-[10px] text-slate-400 uppercase font-bold">Fats</span>
          </div>
        </div>

        {/* Cooking Timer Tool */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-white font-outfit block">Smart Cooking Timer</span>
              <span className="text-[10px] text-slate-400">Prep: {recipe.prepTimeMinutes}m • Cook: {recipe.cookTimeMinutes}m</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {timerSeconds > 0 ? (
              <div className="flex items-center gap-2">
                <span className="text-lg font-mono font-black text-emerald-400">
                  {formatTimer(timerSeconds)}
                </span>
                <button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-white cursor-pointer"
                >
                  {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => { setTimerSeconds(0); setIsTimerRunning(false); }}
                  className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => startTimer(recipe.cookTimeMinutes || 10)}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-xs hover:bg-emerald-500/30 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Play className="w-3 h-3" />
                <span>Start {recipe.cookTimeMinutes || 10}m Timer</span>
              </button>
            )}
          </div>
        </div>

        {/* Ingredients Checklist */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
            Ingredients Checklist ({recipe.ingredients.length} items)
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {recipe.ingredients.map((ing, idx) => {
              const isChecked = !!checkedIngredients[ing.name];
              return (
                <div
                  key={idx}
                  onClick={() => toggleIngredient(ing.name)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between text-xs ${
                    isChecked
                      ? 'bg-emerald-950/30 border-emerald-500/40 text-slate-400 line-through'
                      : 'bg-slate-950 border-slate-800 text-white'
                  }`}
                >
                  <span>{ing.name}</span>
                  <span className="font-mono text-[11px] font-bold text-emerald-400">{ing.amount}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step-by-Step Instructions */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
            <ChefHat className="w-3.5 h-3.5 text-emerald-400" />
            Step-by-Step Directions
          </h4>

          <div className="space-y-2">
            {recipe.instructions.map((step, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-start gap-3">
                <span className="w-6 h-6 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <p className="text-xs text-slate-200 leading-relaxed pt-0.5">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Chef Tip */}
        {recipe.tips && (
          <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 text-xs text-emerald-300 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="text-white">Nutritionist Tip:</strong> {recipe.tips}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
