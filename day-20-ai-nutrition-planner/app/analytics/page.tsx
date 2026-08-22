'use client';

import { useState, useEffect } from 'react';
import { MealAnalysisResult } from '@/types';
import { getTodayMealLogs } from '@/lib/storage';
import MicronutrientRadar from '@/components/MicronutrientRadar';
import Link from 'next/link';
import { ArrowLeft, HeartPulse, Sparkles, ShieldCheck, Leaf, Zap } from 'lucide-react';

const REPLENISHMENT_GUIDE = [
  {
    nutrient: 'Vitamin D3 & Omega-3 EPA/DHA',
    role: 'Hormone regulation, immune resilience, anti-inflammatory signaling.',
    sources: ['Wild Alaskan Salmon', 'Pasture Egg Yolks', 'Sardines', 'Shiitake Mushrooms'],
  },
  {
    nutrient: 'Magnesium Glycinate/Citrate',
    role: 'Cellular ATP energy, deep delta-wave sleep, muscle recovery & cramping prevention.',
    sources: ['Raw Cacao / Dark Chocolate 85%', 'California Almonds', 'Organic Baby Spinach', 'Pumpkin Seeds'],
  },
  {
    nutrient: 'Bioavailable Iron & Folate',
    role: 'Hemoglobin oxygenation, red blood cell synthesis, mental focus & stamina.',
    sources: ['Organic Lentils', 'Grass-Fed Beef', 'Steamed Asparagus', 'Chia Seeds'],
  },
  {
    nutrient: 'Potassium Electrolytes',
    role: 'Sodium balance, arterial blood pressure regulation, cellular hydration.',
    sources: ['Haas Avocados', 'Coconut Water', 'Wild Salmon', 'Sweet Potatoes'],
  },
];

export default function AnalyticsPage() {
  const [mealLogs, setMealLogs] = useState<MealAnalysisResult[]>([]);

  useEffect(() => {
    setMealLogs(getTodayMealLogs());
  }, []);

  return (
    <div className="space-y-8 font-sans">
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>

        <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" />
          Longevity &amp; Micronutrient Intelligence
        </span>
      </div>

      {/* Main Radar */}
      <MicronutrientRadar mealLogs={mealLogs} />

      {/* Whole Food Replenishment Matrix */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#09121d] border-2 border-slate-800 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Leaf className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-black text-white text-base font-outfit">
              Whole-Food Micronutrient Replenishment Matrix
            </h3>
            <p className="text-xs text-slate-400">
              Natural bioavailable food sources for closing nutritional gaps
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {REPLENISHMENT_GUIDE.map((guide, i) => (
            <div key={i} className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
              <h4 className="font-extrabold text-white text-sm font-outfit flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-400" />
                {guide.nutrient}
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">{guide.role}</p>

              <div className="space-y-1 pt-1">
                <span className="text-[10px] text-slate-500 font-mono uppercase font-bold">
                  Optimal Whole-Food Sources:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {guide.sources.map((src) => (
                    <span
                      key={src}
                      className="px-2.5 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px] font-bold"
                    >
                      {src}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
