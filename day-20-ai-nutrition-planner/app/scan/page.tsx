'use client';

import FoodScanner from '@/components/FoodScanner';
import { addMealLog } from '@/lib/storage';
import { MealAnalysisResult } from '@/types';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function ScanPage() {
  const router = useRouter();

  const handleMealLogged = (meal: MealAnalysisResult) => {
    addMealLog(meal);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Back Button & Title */}
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
          Gemini 1.5 Flash Vision Active
        </span>
      </div>

      <FoodScanner onMealLogged={handleMealLogged} />
    </div>
  );
}
