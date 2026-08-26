import { NextRequest, NextResponse } from 'next/server';
import { diagnoseIncidentWithAI } from '@/lib/gemini';
import { Deployment, LogEntry } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const { serviceName, logs, recentDeployments } = await req.json();

    if (!logs || !Array.isArray(logs)) {
      return NextResponse.json({ error: 'Valid logs array required' }, { status: 400 });
    }

    const diagnosis = await diagnoseIncidentWithAI(
      serviceName || 'production-service',
      logs as LogEntry[],
      (recentDeployments || []) as Deployment[]
    );

    return NextResponse.json({ diagnosis });
  } catch (error: any) {
    console.error('API /api/analyze error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to analyze incident' },
      { status: 500 }
    );
  }
}
