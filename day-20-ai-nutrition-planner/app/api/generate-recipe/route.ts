import { NextRequest, NextResponse } from 'next/server';
import { generateRecipeFromIngredients } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { ingredients, goal, mealType } = body;

    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return NextResponse.json({ error: 'Ingredients array is required.' }, { status: 400 });
    }

    const recipe = await generateRecipeFromIngredients(
      ingredients,
      goal || 'fat_loss',
      mealType || 'lunch'
    );
    return NextResponse.json(recipe);
  } catch (error) {
    console.error('Error generating recipe:', error);
    return NextResponse.json({ error: 'Failed to generate recipe.' }, { status: 500 });
  }
}
