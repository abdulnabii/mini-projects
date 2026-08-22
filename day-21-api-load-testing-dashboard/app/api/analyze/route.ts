import { NextRequest, NextResponse } from 'next/server';
import { analyzeTestResultsWithGemini } from '@/lib/gemini';
import { TestResult } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { testResult } = body as { testResult: TestResult };

    if (!testResult) {
      return NextResponse.json({ error: 'Test result telemetry is required.' }, { status: 400 });
    }

    const analysis = await analyzeTestResultsWithGemini(testResult);
    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Error analyzing load test results:', error);
    return NextResponse.json({ error: 'Failed to analyze load test results.' }, { status: 500 });
  }
}
