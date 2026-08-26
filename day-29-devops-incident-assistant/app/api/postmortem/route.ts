import { NextRequest, NextResponse } from 'next/server';
import { generatePostMortemWithAI } from '@/lib/gemini';
import { RootCauseDiagnosis, Severity } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const { incidentId, title, service, severity, diagnosis } = await req.json();

    if (!diagnosis) {
      return NextResponse.json({ error: 'Diagnosis payload required' }, { status: 400 });
    }

    const postMortem = await generatePostMortemWithAI(
      incidentId || 'inc-001',
      title || 'Production Outage',
      service || 'service',
      (severity || 'P1') as Severity,
      diagnosis as RootCauseDiagnosis
    );

    return NextResponse.json({ postMortem });
  } catch (error: any) {
    console.error('API /api/postmortem error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to generate post-mortem' },
      { status: 500 }
    );
  }
}
