import { NextResponse } from 'next/server';
import { generateLifestyleRecommendations } from '@/lib/gemini';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { vitals, riskPercent } = body;

    if (!vitals) {
      return NextResponse.json({ error: 'vitals object is required' }, { status: 400 });
    }

    const recs = await generateLifestyleRecommendations(vitals, riskPercent || 50);
    return NextResponse.json(recs);
  } catch (error) {
    console.error('Error in recommendations API route:', error);
    return NextResponse.json({ error: 'Failed to generate recommendations' }, { status: 500 });
  }
}
