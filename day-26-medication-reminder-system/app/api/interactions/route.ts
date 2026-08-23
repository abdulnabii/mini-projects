import { NextRequest, NextResponse } from 'next/server';
import { checkDrugInteractionsWithGemini } from '@/lib/gemini';
import { Medication } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { medications } = body;

    if (!medications || !Array.isArray(medications) || medications.length === 0) {
      return NextResponse.json({ error: 'Medications list is required' }, { status: 400 });
    }

    const report = await checkDrugInteractionsWithGemini(medications as Medication[]);
    return NextResponse.json({ report });
  } catch (error: any) {
    console.error('Interactions API error:', error);
    return NextResponse.json({ error: error.message || 'Failed to check interactions' }, { status: 500 });
  }
}
