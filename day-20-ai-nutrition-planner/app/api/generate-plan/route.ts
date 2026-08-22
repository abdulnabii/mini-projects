import { NextRequest, NextResponse } from 'next/server';
import { generateWeeklyPlanWithGemini } from '@/lib/gemini';
import { UserProfile } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { profile } = body as { profile: UserProfile };

    if (!profile) {
      return NextResponse.json({ error: 'User profile is required.' }, { status: 400 });
    }

    const plan = await generateWeeklyPlanWithGemini(profile);
    return NextResponse.json(plan);
  } catch (error) {
    console.error('Error generating meal plan:', error);
    return NextResponse.json({ error: 'Failed to generate weekly meal plan.' }, { status: 500 });
  }
}
