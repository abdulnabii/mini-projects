'use client';

import { useState, useEffect } from 'react';
import { GroceryCategory } from '@/types';
import { getSavedGroceryList, saveGroceryList, getSavedMealPlan } from '@/lib/storage';
import GroceryListBuilder from '@/components/GroceryListBuilder';
import Link from 'next/link';
import { ArrowLeft, ShoppingCart, Sparkles } from 'lucide-react';

export default function GroceryPage() {
  const [categories, setCategories] = useState<GroceryCategory[]>([]);

  useEffect(() => {
    const list = getSavedGroceryList();
    if (list && list.length > 0) {
      setCategories(list);
    } else {
      const plan = getSavedMealPlan();
      if (plan?.weeklyGroceryList) {
        setCategories(plan.weeklyGroceryList);
        saveGroceryList(plan.weeklyGroceryList);
      }
    }
  }, []);

  const handleUpdate = (updated: GroceryCategory[]) => {
    setCategories(updated);
    saveGroceryList(updated);
  };

  return (
    <div className="space-y-6 font-sans">
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
          Aggregated from 7-Day Meal Plan
        </span>
      </div>

      <GroceryListBuilder categories={categories} onUpdateCategories={handleUpdate} />
    </div>
  );
}
