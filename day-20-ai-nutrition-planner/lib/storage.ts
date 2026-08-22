import { UserProfile, MealAnalysisResult, WeeklyMealPlan, GroceryCategory, PlannedMeal } from '@/types';
import { DEFAULT_USER_PROFILE } from './nutritionCalc';
import { SAMPLE_MEALS } from './sampleFoods';

const STORAGE_KEYS = {
  PROFILE: 'nutrigenius_profile',
  TODAY_LOGS: 'nutrigenius_today_logs',
  WATER_ML: 'nutrigenius_water_ml',
  SAVED_PLAN: 'nutrigenius_saved_plan',
  GROCERY_LIST: 'nutrigenius_grocery_list',
  SAVED_RECIPES: 'nutrigenius_saved_recipes',
};

// Safe LocalStorage Get
function getItem<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.warn(`Error reading ${key} from localStorage:`, e);
    return defaultValue;
  }
}

// Safe LocalStorage Set
function setItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`Error writing ${key} to localStorage:`, e);
  }
}

// User Profile
export function getStoredProfile(): UserProfile {
  return getItem<UserProfile>(STORAGE_KEYS.PROFILE, DEFAULT_USER_PROFILE);
}

export function saveStoredProfile(profile: UserProfile): void {
  setItem(STORAGE_KEYS.PROFILE, profile);
}

// Daily Meal Logs
export function getTodayMealLogs(): MealAnalysisResult[] {
  return getItem<MealAnalysisResult[]>(STORAGE_KEYS.TODAY_LOGS, [
    SAMPLE_MEALS[0].mockAnalysis,
    SAMPLE_MEALS[2].mockAnalysis,
  ]);
}

export function addMealLog(meal: MealAnalysisResult): MealAnalysisResult[] {
  const current = getTodayMealLogs();
  const updated = [meal, ...current];
  setItem(STORAGE_KEYS.TODAY_LOGS, updated);
  return updated;
}

export function deleteMealLog(id: string): MealAnalysisResult[] {
  const current = getTodayMealLogs();
  const updated = current.filter((m) => m.id !== id);
  setItem(STORAGE_KEYS.TODAY_LOGS, updated);
  return updated;
}

// Daily Water Intake
export function getWaterIntakeMl(): number {
  return getItem<number>(STORAGE_KEYS.WATER_ML, 1750);
}

export function addWaterIntakeMl(amountMl: number): number {
  const current = getWaterIntakeMl();
  const updated = Math.max(0, current + amountMl);
  setItem(STORAGE_KEYS.WATER_ML, updated);
  return updated;
}

export function resetWaterIntake(): number {
  setItem(STORAGE_KEYS.WATER_ML, 0);
  return 0;
}

// Weekly Meal Plan
export function getSavedMealPlan(): WeeklyMealPlan | null {
  return getItem<WeeklyMealPlan | null>(STORAGE_KEYS.SAVED_PLAN, null);
}

export function saveMealPlan(plan: WeeklyMealPlan): void {
  setItem(STORAGE_KEYS.SAVED_PLAN, plan);
}

// Grocery List
export function getSavedGroceryList(): GroceryCategory[] {
  return getItem<GroceryCategory[]>(STORAGE_KEYS.GROCERY_LIST, []);
}

export function saveGroceryList(list: GroceryCategory[]): void {
  setItem(STORAGE_KEYS.GROCERY_LIST, list);
}

// Custom Recipes
export function getSavedRecipes(): PlannedMeal[] {
  return getItem<PlannedMeal[]>(STORAGE_KEYS.SAVED_RECIPES, []);
}

export function saveCustomRecipe(recipe: PlannedMeal): PlannedMeal[] {
  const current = getSavedRecipes();
  const updated = [recipe, ...current.filter((r) => r.id !== recipe.id)];
  setItem(STORAGE_KEYS.SAVED_RECIPES, updated);
  return updated;
}
