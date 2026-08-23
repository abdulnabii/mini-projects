import { NextRequest, NextResponse } from 'next/server';
import { getMissedDoseGuidanceWithGemini } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { medicationName, dosage, hoursMissed } = body;

    if (!medicationName) {
      return NextResponse.json({ error: 'Medication name is required' }, { status: 400 });
    }

    const guidance = await getMissedDoseGuidanceWithGemini(
      medicationName,
      dosage || '',
      hoursMissed || 2
    );

    return NextResponse.json({ guidance });
  } catch (error: any) {
    console.error('Guidance API error:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate guidance' }, { status: 500 });
  }
}
