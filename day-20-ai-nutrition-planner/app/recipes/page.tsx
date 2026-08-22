'use client';

import { useState, useEffect } from 'react';
import { PlannedMeal, MealType } from '@/types';
import { getSavedRecipes, saveCustomRecipe } from '@/lib/storage';
import RecipeDetailModal from '@/components/RecipeDetailModal';
import {
  ChefHat,
  Sparkles,
  Plus,
  X,
  Clock,
  Flame,
  Dumbbell,
  Check,
  Bookmark,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import confetti from 'canvas-confetti';

const POPULAR_INGREDIENTS = [
  'Eggs',
  'Chicken Breast',
  'Salmon Fillet',
  'Avocado',
  'Baby Spinach',
  'Quinoa',
  'Greek Yogurt',
  'Feta Cheese',
  'Sweet Potato',
  'Olive Oil',
  'Garlic',
  'Cherry Tomatoes',
  'Almonds',
  'Oats',
  'Chia Seeds',
];

export default function RecipesPage() {
  const [ingredients, setIngredients] = useState<string[]>(['Eggs', 'Baby Spinach', 'Greek Feta Cheese', 'Olive Oil']);
  const [customInput, setCustomInput] = useState('');
  const [mealType, setMealType] = useState<MealType>('lunch');
  const [goal, setGoal] = useState('High Protein / Fat Loss');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedRecipe, setGeneratedRecipe] = useState<PlannedMeal | null>(null);
  const [savedRecipes, setSavedRecipes] = useState<PlannedMeal[]>([]);
  const [selectedRecipeModal, setSelectedRecipeModal] = useState<PlannedMeal | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setSavedRecipes(getSavedRecipes());
  }, []);

  const addIngredient = (ing: string) => {
    const trimmed = ing.trim();
    if (trimmed && !ingredients.includes(trimmed)) {
      setIngredients([...ingredients, trimmed]);
    }
  };

  const removeIngredient = (ing: string) => {
    setIngredients(ingredients.filter((i) => i !== ing));
  };

  const handleGenerate = async () => {
    if (ingredients.length === 0) return;
    setIsLoading(true);
    setGeneratedRecipe(null);
    setSavedSuccess(false);

    try {
      const res = await fetch('/api/generate-recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients, goal, mealType }),
      });

      if (!res.ok) throw new Error('Recipe generation failed');

      const recipe: PlannedMeal = await res.json();
      setGeneratedRecipe(recipe);
    } catch (err) {
      console.warn('Error generating recipe:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveRecipe = () => {
    if (!generatedRecipe) return;
    const updated = saveCustomRecipe(generatedRecipe);
    setSavedRecipes(updated);
    setSavedSuccess(true);

    confetti({
      particleCount: 70,
      spread: 50,
      origin: { y: 0.7 },
      colors: ['#10b981', '#06b6d4'],
    });

    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#09121d] border-2 border-emerald-500/30 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] font-bold">
              AI Culinary Synthesizer
            </span>
          </div>
          <h2 className="text-xl sm:text-3xl font-black text-white font-outfit">
            "Fridge to Feast" Recipe Studio
          </h2>
          <p className="text-xs text-slate-400">
            Tell Gemini what ingredients you have in your kitchen → get a gourmet, macro-optimized recipe
          </p>
        </div>
      </div>

      {/* Ingredient Tagging Studio */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#09121d] border-2 border-slate-800 space-y-6">
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono block">
            1. Select Your Available Ingredients ({ingredients.length} selected)
          </label>

          {/* Active Chips */}
          <div className="flex flex-wrap gap-2 min-h-[44px] p-3 rounded-2xl bg-slate-950 border border-slate-800">
            {ingredients.map((ing) => (
              <span
                key={ing}
                className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5 animate-in fade-in duration-150"
              >
                <span>{ing}</span>
                <button
                  onClick={() => removeIngredient(ing)}
                  className="hover:text-white cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}

            <input
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addIngredient(customInput);
                  setCustomInput('');
                }
              }}
              placeholder="+ Type custom ingredient & press Enter..."
              className="bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none flex-1 min-w-[200px]"
            />
          </div>

          {/* Popular Ingredient Quick Add */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[10px] text-slate-500 font-mono uppercase font-bold">
              Quick Add Common Staples:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {POPULAR_INGREDIENTS.map((pop) => (
                <button
                  key={pop}
                  onClick={() => addIngredient(pop)}
                  disabled={ingredients.includes(pop)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    ingredients.includes(pop)
                      ? 'bg-slate-900 text-slate-600 border border-slate-800 cursor-not-allowed'
                      : 'bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:border-emerald-500/40'
                  }`}
                >
                  + {pop}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Meal Type & Goal Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
              Target Meal Slot
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {(['breakfast', 'lunch', 'dinner', 'snack'] as MealType[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setMealType(t)}
                  className={`p-2 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                    mealType === t
                      ? 'bg-emerald-500 text-black shadow-md'
                      : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
              Nutritional Focus
            </label>
            <select
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-bold focus:outline-none"
            >
              <option value="High Protein / Fat Loss">High Protein / Fat Loss (Max Satiety)</option>
              <option value="Hypertrophy Muscle Fuel">Hypertrophy Muscle Fuel (+Carbs)</option>
              <option value="Keto High Healthy Fats">Keto / Low-Carb High Healthy Fats</option>
              <option value="Gut Microbiome & Fiber">Gut Microbiome &amp; High Prebiotic Fiber</option>
            </select>
          </div>
        </div>

        {/* Generate Button */}
        <div className="pt-2">
          <button
            onClick={handleGenerate}
            disabled={isLoading || ingredients.length === 0}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 hover:from-emerald-300 hover:to-cyan-400 text-black font-black text-sm shadow-xl shadow-emerald-500/20 hover:scale-[1.01] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>{isLoading ? 'Creating Gourmet Macro Recipe...' : 'Synthesize Custom Recipe with Gemini AI'}</span>
          </button>
        </div>
      </div>

      {/* Generated Recipe Card */}
      {generatedRecipe && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#09121d] border-2 border-emerald-500/40 shadow-2xl space-y-6 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <span className="text-[10px] font-bold text-emerald-400 uppercase font-mono tracking-wider block">
                AI Created Recipe ({generatedRecipe.mealType.toUpperCase()})
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white font-outfit">
                {generatedRecipe.title}
              </h3>
              <p className="text-xs text-slate-400">{generatedRecipe.description}</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleSaveRecipe}
                className="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 text-xs font-bold text-white transition-all cursor-pointer flex items-center gap-1.5"
              >
                {savedSuccess ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Bookmark className="w-3.5 h-3.5" />}
                <span>{savedSuccess ? 'Saved to Vault!' : 'Save Recipe'}</span>
              </button>

              <button
                onClick={() => setSelectedRecipeModal(generatedRecipe)}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs shadow-md transition-all cursor-pointer"
              >
                Open Full Cook View
              </button>
            </div>
          </div>

          {/* Macro Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-center">
              <span className="text-lg font-black font-mono text-white block">{generatedRecipe.calories} kcal</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Energy</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-center">
              <span className="text-lg font-black font-mono text-emerald-400 block">{generatedRecipe.protein}g</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Protein</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-center">
              <span className="text-lg font-black font-mono text-cyan-400 block">{generatedRecipe.carbs}g</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Carbs</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-center">
              <span className="text-lg font-black font-mono text-amber-400 block">{generatedRecipe.fat}g</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Fat</span>
            </div>
          </div>
        </div>
      )}

      {/* Saved Recipe Vault */}
      {savedRecipes.length > 0 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#09121d] border-2 border-slate-800 space-y-4">
          <h3 className="text-base font-black text-white font-outfit flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-emerald-400" />
            My Saved Recipe Vault ({savedRecipes.length})
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedRecipes.map((r) => (
              <div
                key={r.id}
                onClick={() => setSelectedRecipeModal(r)}
                className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-emerald-500/40 transition-all cursor-pointer group space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 font-mono text-[9px] font-bold uppercase">
                    {r.mealType}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {r.prepTimeMinutes + r.cookTimeMinutes}m cook
                  </span>
                </div>
                <h4 className="font-bold text-white text-sm font-outfit group-hover:text-emerald-300 transition-colors">
                  {r.title}
                </h4>
                <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                  <span>{r.calories} kcal</span>
                  <span>•</span>
                  <span className="text-emerald-400">{r.protein}g P</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal */}
      <RecipeDetailModal
        recipe={selectedRecipeModal}
        isOpen={!!selectedRecipeModal}
        onClose={() => setSelectedRecipeModal(null)}
      />
    </div>
  );
}
