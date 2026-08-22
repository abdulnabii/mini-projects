import { UserProfile, DietaryGoal, DietType } from '@/types';

// Default User Profile
export const DEFAULT_USER_PROFILE: UserProfile = {
  name: 'Alex Johnson',
  age: 28,
  gender: 'male',
  weightKg: 78,
  heightCm: 180,
  activityLevel: 'moderate',
  goal: 'fat_loss',
  dietType: 'balanced_high_protein',
  targetCalories: 2200,
  targetProteinG: 165,
  targetCarbsG: 210,
  targetFatG: 65,
  targetFiberG: 35,
  targetWaterMl: 3000,
  allergies: [],
  dislikedFoods: [],
};

// Calculate Basal Metabolic Rate (Mifflin-St Jeor Equation)
export function calculateBMR(weightKg: number, heightCm: number, age: number, gender: 'male' | 'female' | 'other'): number {
  if (gender === 'female') {
    return Math.round(10 * weightKg + 6.25 * heightCm - 5 * age - 161);
  }
  return Math.round(10 * weightKg + 6.25 * heightCm - 5 * age + 5);
}

// Activity Multipliers
export const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2, // Desk job, little exercise
  light: 1.375, // 1-3 days exercise/week
  moderate: 1.55, // 3-5 days moderate exercise/week
  very_active: 1.725, // 6-7 days hard exercise/week
  athlete: 1.9, // 2x daily training / physical labor
};

// Calculate Total Daily Energy Expenditure (TDEE)
export function calculateTDEE(
  weightKg: number,
  heightCm: number,
  age: number,
  gender: 'male' | 'female' | 'other',
  activityLevel: UserProfile['activityLevel']
): number {
  const bmr = calculateBMR(weightKg, heightCm, age, gender);
  const mult = ACTIVITY_MULTIPLIERS[activityLevel] || 1.55;
  return Math.round(bmr * mult);
}

// Calculate Auto Targets based on Goal & Diet Type
export function calculateAutoTargets(
  tdee: number,
  weightKg: number,
  goal: DietaryGoal,
  dietType: DietType
): { calories: number; protein: number; carbs: number; fat: number; fiber: number; water: number } {
  let targetCalories = tdee;

  // Caloric Adjustments
  if (goal === 'fat_loss') {
    targetCalories = Math.round(tdee * 0.8); // 20% deficit
  } else if (goal === 'muscle_gain') {
    targetCalories = Math.round(tdee * 1.12); // 12% surplus
  } else if (goal === 'metabolic_health') {
    targetCalories = Math.round(tdee * 0.95);
  }

  let proteinRatio = 0.3;
  let carbsRatio = 0.45;
  let fatRatio = 0.25;

  if (dietType === 'keto_low_carb') {
    proteinRatio = 0.25;
    carbsRatio = 0.05;
    fatRatio = 0.7;
  } else if (dietType === 'balanced_high_protein') {
    proteinRatio = 0.35;
    carbsRatio = 0.4;
    fatRatio = 0.25;
  } else if (dietType === 'mediterranean') {
    proteinRatio = 0.25;
    carbsRatio = 0.45;
    fatRatio = 0.3;
  } else if (dietType === 'vegan' || dietType === 'vegetarian') {
    proteinRatio = 0.25;
    carbsRatio = 0.55;
    fatRatio = 0.2;
  }

  const proteinG = Math.round((targetCalories * proteinRatio) / 4);
  const carbsG = Math.round((targetCalories * carbsRatio) / 4);
  const fatG = Math.round((targetCalories * fatRatio) / 9);
  const fiberG = Math.max(28, Math.round((targetCalories / 1000) * 14));
  const waterMl = Math.round(weightKg * 38);

  return {
    calories: targetCalories,
    protein: proteinG,
    carbs: carbsG,
    fat: fatG,
    fiber: fiberG,
    water: waterMl,
  };
}

// Recommended Daily Allowances (RDA) for Key Micronutrients
export const MICRONUTRIENT_RDA = {
  vitaminA_mcg: { rda: 900, unit: 'µg', name: 'Vitamin A (Vision & Immunity)' },
  vitaminC_mg: { rda: 90, unit: 'mg', name: 'Vitamin C (Antioxidant & Collagen)' },
  vitaminD_IU: { rda: 800, unit: 'IU', name: 'Vitamin D3 (Bone & Hormone Health)' },
  vitaminB12_mcg: { rda: 2.4, unit: 'µg', name: 'Vitamin B12 (Energy & Nerve Cells)' },
  iron_mg: { rda: 14, unit: 'mg', name: 'Iron (Oxygen Transport)' },
  calcium_mg: { rda: 1000, unit: 'mg', name: 'Calcium (Bone Density & Muscle)' },
  potassium_mg: { rda: 3400, unit: 'mg', name: 'Potassium (Electrolyte Balance)' },
  magnesium_mg: { rda: 420, unit: 'mg', name: 'Magnesium (Sleep & Recovery)' },
  zinc_mg: { rda: 11, unit: 'mg', name: 'Zinc (Immunity & Protein Synthesis)' },
};
