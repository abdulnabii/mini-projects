import { NextResponse } from 'next/server';
import { executeTestRun } from '@/lib/gemini';

export async function POST(req: Request) {
  try {
    const { systemInstruction, userPrompt } = await req.json();

    if (!userPrompt || typeof userPrompt !== 'string') {
      return NextResponse.json({ error: 'User prompt is required for test execution' }, { status: 400 });
    }

    const output = await executeTestRun(systemInstruction || '', userPrompt);
    return NextResponse.json({ output });
  } catch (err) {
    console.error('Test run API route error:', err);
    return NextResponse.json({ error: 'Failed to execute test run' }, { status: 500 });
  }
}
