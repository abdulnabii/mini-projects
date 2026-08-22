import { NextRequest, NextResponse } from 'next/server';
import { generateEnergyOptimizationInsightsWithGemini } from '@/lib/gemini';
import { Device } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { kwh, cost, devices } = body;

    const insights = await generateEnergyOptimizationInsightsWithGemini(
      kwh || 18.4,
      cost || 82.5,
      devices || []
    );

    return NextResponse.json(insights);
  } catch (error: any) {
    console.error('Energy API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
