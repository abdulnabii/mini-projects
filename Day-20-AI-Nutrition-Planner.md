# Day 20 — AI-Powered Nutrition & Meal Planner

## 🗓️ Day: 20 of 30
## 🏷️ Category: Healthcare AI / Lifestyle Tech
## ⚡ Difficulty: Intermediate
## 🕐 Estimated Build Time: 6–8 hours

---

## 📌 Project Overview

A comprehensive nutrition app where users snap a photo of any meal and the AI instantly identifies all food items, estimates portions, and calculates complete nutritional breakdown (calories, macros, micros). The AI then generates personalized weekly meal plans based on dietary goals (weight loss, muscle gain, diabetes management), restrictions (vegetarian, halal, gluten-free), and cuisine preferences. Integrates with grocery APIs to auto-generate shopping lists.

---

## 🎯 Core Features

| Feature | Description |
|---|---|
| Photo Food Recognition | Snap meal photo → instant nutrition breakdown |
| Macro Tracking | Daily calories, protein, carbs, fats dashboard |
| Personalized Meal Plans | 7-day plans based on goals and restrictions |
| Recipe Generation | AI creates recipes from available ingredients |
| Grocery List Builder | Auto-generates shopping list from meal plan |
| Water Intake Tracker | Hydration goal with reminder notifications |
| Nutritional Deficit Alerts | Warns about missing vitamins/minerals |
| Progress Dashboard | Weight, measurements, energy level trends |
| Halal/Dietary Filters | Full halal, vegan, keto, diabetic-friendly options |
| Barcode Scanner | Scan packaged food for instant nutrition data |

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, Tailwind CSS, Recharts
- **AI Vision**: Google Gemini 1.5 Pro Vision (food recognition)
- **AI Planning**: Google Gemini 1.5 Pro (meal planning)
- **Camera**: React webcam / file upload
- **Database**: Supabase (meal logs, user profiles)
- **Nutrition DB**: Open Food Facts API (barcode scanning)
- **Deployment**: Vercel

---

## 🔧 Key Functions

### `analyzeFoodPhoto(imageBase64: string): Promise<NutritionResult>`
Sends food image to Gemini Vision with detailed nutrition extraction prompt. Returns array of identified food items with estimated portion weights and full nutritional data per item plus total.

### `generateMealPlan(profile: UserProfile, preferences: Preferences): Promise<WeeklyPlan>`
Creates a 7-day meal plan (breakfast, lunch, dinner, 2 snacks) optimized for the user's caloric goal, macro split, dietary restrictions, and cuisine preferences.

### `generateRecipe(availableIngredients: string[], mealType: MealType, goal: Goal): Promise<Recipe>`
Creates a detailed recipe using only the specified available ingredients, formatted for the user's dietary goal and nutritional requirements.

### `buildGroceryList(weeklyPlan: WeeklyPlan, pantryItems: string[]): GroceryList`
Aggregates all ingredients from a weekly meal plan, subtracts pantry items already on hand, groups by supermarket aisle category, and estimates total cost.

### `calculateNutritionalGap(dailyLog: FoodLog[], goals: Goals): NutrientGap[]`
Compares actual micronutrient intake against daily recommended values (RDA) and flags deficiencies in iron, vitamin D, calcium, B12, etc.

---

## 📁 File Structure

```
nutrition-planner/
├── app/
│   ├── page.tsx              # Dashboard + today's summary
│   ├── scan/page.tsx         # Photo/barcode scanning
│   ├── plan/page.tsx         # Weekly meal plan view
│   ├── log/page.tsx          # Daily food log
│   └── api/
│       ├── analyze/route.ts  # Food photo analysis
│       └── plan/route.ts     # Meal plan generation
├── components/
│   ├── FoodScanner.tsx       # Camera + upload UI
│   ├── MacroRing.tsx         # Macro donut chart
│   ├── MealPlanGrid.tsx      # 7-day plan grid
│   ├── RecipeCard.tsx        # Recipe detail card
│   └── GroceryList.tsx       # Shopping list UI
└── lib/
    ├── gemini-vision.ts
    ├── nutrition-calc.ts
    └── grocery.ts
```

---

## 💡 AI Prompt Used

```
SYSTEM PROMPT:
You are a certified nutritionist and food recognition AI. Analyze the food image
and identify every visible food item with precise nutritional estimates.

Rules:
- Estimate portion sizes visually (use standard serving sizes as reference)
- Account for cooking method (fried vs grilled vs boiled affects calories)
- Include macro AND key micronutrients
- Flag high-sodium, high-sugar, or allergen items

Output JSON only:
{
  "items": [
    {
      "name": "Grilled Chicken Breast",
      "estimatedGrams": 150,
      "calories": 248,
      "protein": 46.5,
      "carbs": 0,
      "fat": 5.4,
      "fiber": 0,
      "sodium": 74,
      "confidence": 0.92
    }
  ],
  "totals": { "calories": 620, "protein": 58, "carbs": 45, "fat": 22 },
  "mealType": "lunch",
  "healthScore": 78,
  "notes": "High protein meal, low in vegetables — consider adding greens"
}

IMAGE: [base64 encoded meal photo]
```

---

## 📤 Expected Output (Result)

```json
{
  "items": [
    {
      "name": "Grilled Chicken Breast",
      "estimatedGrams": 150,
      "calories": 248,
      "protein": 46.5,
      "carbs": 0,
      "fat": 5.4,
      "confidence": 0.94
    },
    {
      "name": "Basmati Rice (cooked)",
      "estimatedGrams": 180,
      "calories": 234,
      "protein": 4.3,
      "carbs": 51.8,
      "fat": 0.4,
      "confidence": 0.89
    },
    {
      "name": "Mixed Salad (no dressing)",
      "estimatedGrams": 80,
      "calories": 24,
      "protein": 1.8,
      "carbs": 4.2,
      "fat": 0.3,
      "confidence": 0.85
    }
  ],
  "totals": {
    "calories": 506,
    "protein": 52.6,
    "carbs": 56.0,
    "fat": 6.1
  },
  "healthScore": 84,
  "notes": "Excellent protein-to-calorie ratio. Well-balanced meal. Add olive oil to salad for healthy fats."
}
```

**UI Display:**
```
📸 Meal Analysis Complete

🍽️ Identified Items:
  Grilled Chicken Breast   150g  →  248 kcal  🟢 94% confident
  Basmati Rice (cooked)    180g  →  234 kcal  🟢 89% confident
  Mixed Salad              80g   →  24 kcal   🟢 85% confident

📊 Total: 506 kcal
  Protein: 52.6g  ████████████░  (Goal: 130g | 40% done)
  Carbs:   56.0g  ████░░░░░░░░░  (Goal: 200g | 28% done)
  Fat:     6.1g   ██░░░░░░░░░░░  (Goal: 60g  | 10% done)

Health Score: 84/100 ✅
"Excellent protein-to-calorie ratio."

[Log This Meal] [Generate Similar Recipes] [View Full Nutrition]
```

---

## 🚀 Stretch Goals

- [ ] Apple Watch integration for calorie burn sync
- [ ] Restaurant menu AI analyzer (photo of menu → best choice for your goals)
- [ ] Family meal planning mode (multi-person household)
- [ ] Integration with Instacart for one-click grocery ordering
