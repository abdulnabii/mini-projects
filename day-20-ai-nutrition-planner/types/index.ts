export type DietaryGoal =
  | 'fat_loss'
  | 'muscle_gain'
  | 'maintenance'
  | 'metabolic_health'
  | 'longevity_endurance';

export type DietType =
  | 'balanced_high_protein'
  | 'mediterranean'
  | 'keto_low_carb'
  | 'vegetarian'
  | 'vegan'
  | 'halal'
  | 'gluten_free'
  | 'diabetic_friendly';

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface UserProfile {
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  weightKg: number;
  heightCm: number;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'very_active' | 'athlete';
  goal: DietaryGoal;
  dietType: DietType;
  targetCalories: number;
  targetProteinG: number;
  targetCarbsG: number;
  targetFatG: number;
  targetFiberG: number;
  targetWaterMl: number;
  allergies: string[];
  dislikedFoods: string[];
}

export interface FoodItemAnalysis {
  name: string;
  category: 'protein' | 'carbohydrate' | 'vegetable' | 'fruit' | 'fat_oil' | 'dairy' | 'beverage';
  estimatedGrams: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodiumMg: number;
  confidence: number;
  glycemicIndex: 'low' | 'medium' | 'high';
}

export interface MicronutrientEstimate {
  vitaminA_mcg: number;
  vitaminC_mg: number;
  vitaminD_IU: number;
  vitaminB12_mcg: number;
  iron_mg: number;
  calcium_mg: number;
  potassium_mg: number;
  magnesium_mg: number;
  zinc_mg: number;
}

export interface MealAnalysisResult {
  id: string;
  mealName: string;
  mealType: MealType;
  timestamp: string;
  imageSrc?: string;
  items: FoodItemAnalysis[];
  totals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    sodiumMg: number;
  };
  micros?: MicronutrientEstimate;
  healthScore: number; // 0-100
  satietyRating: 'High' | 'Moderate' | 'Low';
  clinicalDietitianAdvice: string;
  optimizationSuggestions: string[];
  warnings?: string[];
}

export interface PlannedMeal {
  id: string;
  title: string;
  mealType: MealType;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  ingredients: { name: string; amount: string; category: string }[];
  instructions: string[];
  tips: string;
  tags: string[];
}

export interface DayPlan {
  dayNumber: number;
  dayName: string;
  targetCalories: number;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  meals: PlannedMeal[];
}

export interface WeeklyMealPlan {
  id: string;
  title: string;
  goal: DietaryGoal;
  dietType: DietType;
  generatedAt: string;
  days: DayPlan[];
  weeklyGroceryList?: GroceryCategory[];
}

export interface GroceryItem {
  id: string;
  name: string;
  amount: string;
  checked: boolean;
  inPantry: boolean;
  estimatedPrice?: number;
}

export interface GroceryCategory {
  categoryName: string;
  icon: string;
  items: GroceryItem[];
}

export interface DailyFoodLog {
  date: string; // YYYY-MM-DD
  waterConsumedMl: number;
  meals: MealAnalysisResult[];
}
