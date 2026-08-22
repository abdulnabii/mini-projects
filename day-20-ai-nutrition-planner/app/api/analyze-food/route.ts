import { NextRequest, NextResponse } from 'next/server';
import { analyzeFoodImageWithGemini } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { imageBase64, mealType } = body;

    if (!imageBase64) {
      return NextResponse.json({ error: 'Image data is required.' }, { status: 400 });
    }

    const result = await analyzeFoodImageWithGemini(imageBase64, mealType || 'lunch');
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error analyzing food image:', error);
    return NextResponse.json({ error: 'Failed to analyze food photo.' }, { status: 500 });
  }
}
