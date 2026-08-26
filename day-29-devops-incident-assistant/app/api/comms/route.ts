import { NextRequest, NextResponse } from 'next/server';
import { generateStakeholderCommsWithAI } from '@/lib/gemini';
import { RootCauseDiagnosis, Severity } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const { serviceName, severity, diagnosis } = await req.json();

    if (!diagnosis) {
      return NextResponse.json({ error: 'Diagnosis payload required' }, { status: 400 });
    }

    const comms = await generateStakeholderCommsWithAI(
      serviceName || 'production-service',
      (severity || 'P1') as Severity,
      diagnosis as RootCauseDiagnosis
    );

    return NextResponse.json({ comms });
  } catch (error: any) {
    console.error('API /api/comms error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to generate comms' },
      { status: 500 }
    );
  }
}
