'use client';

import { MealAnalysisResult } from '@/types';
import { MICRONUTRIENT_RDA } from '@/lib/nutritionCalc';
import { Activity, ShieldCheck, AlertTriangle, Sparkles, HeartPulse } from 'lucide-react';

interface Props {
  mealLogs: MealAnalysisResult[];
}

export default function MicronutrientRadar({ mealLogs }: Props) {
  // Aggregate today's micronutrients
  const totals = mealLogs.reduce(
    (acc, meal) => {
      if (!meal.micros) return acc;
      return {
        vitaminA_mcg: acc.vitaminA_mcg + (meal.micros.vitaminA_mcg || 0),
        vitaminC_mg: acc.vitaminC_mg + (meal.micros.vitaminC_mg || 0),
        vitaminD_IU: acc.vitaminD_IU + (meal.micros.vitaminD_IU || 0),
        vitaminB12_mcg: acc.vitaminB12_mcg + (meal.micros.vitaminB12_mcg || 0),
        iron_mg: acc.iron_mg + (meal.micros.iron_mg || 0),
        calcium_mg: acc.calcium_mg + (meal.micros.calcium_mg || 0),
        potassium_mg: acc.potassium_mg + (meal.micros.potassium_mg || 0),
        magnesium_mg: acc.magnesium_mg + (meal.micros.magnesium_mg || 0),
        zinc_mg: acc.zinc_mg + (meal.micros.zinc_mg || 0),
      };
    },
    {
      vitaminA_mcg: 0,
      vitaminC_mg: 0,
      vitaminD_IU: 0,
      vitaminB12_mcg: 0,
      iron_mg: 0,
      calcium_mg: 0,
      potassium_mg: 0,
      magnesium_mg: 0,
      zinc_mg: 0,
    }
  );

  const getStatusBadge = (percent: number) => {
    if (percent >= 90) return { label: 'Optimal', color: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' };
    if (percent >= 50) return { label: 'Moderate', color: 'bg-amber-500/10 border-amber-500/30 text-amber-400' };
    return { label: 'Deficit Alert', color: 'bg-rose-500/10 border-rose-500/30 text-rose-400' };
  };

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-[#09121d] border-2 border-emerald-500/30 shadow-2xl space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <HeartPulse className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-black text-white text-base font-outfit">
              Longevity &amp; Micronutrient RDA Radar
            </h3>
            <p className="text-xs text-slate-400">
              Essential vitamins, trace minerals &amp; cellular electrolyte sufficiency
            </p>
          </div>
        </div>

        <span className="text-xs text-slate-400 font-mono">
          Based on Clinical National Academy of Medicine RDA
        </span>
      </div>

      {/* Grid of Micronutrients */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(MICRONUTRIENT_RDA).map(([key, info]) => {
          const currentVal = totals[key as keyof typeof totals] || 0;
          const percent = Math.min(150, Math.round((currentVal / info.rda) * 100));
          const status = getStatusBadge(percent);

          return (
            <div
              key={key}
              className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2.5 shadow-md"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-bold text-white text-xs font-outfit">{info.name}</h4>
                  <span className="text-[10px] text-slate-400 font-mono">
                    RDA Target: {info.rda} {info.unit}
                  </span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold border ${status.color}`}>
                  {status.label}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-mono font-bold">
                  <span className="text-emerald-400">
                    {Math.round(currentVal * 10) / 10} {info.unit}
                  </span>
                  <span className="text-slate-400">{percent}%</span>
                </div>

                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      percent >= 90
                        ? 'bg-emerald-400'
                        : percent >= 50
                        ? 'bg-amber-400'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${Math.min(100, percent)}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
