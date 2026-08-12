import { NextResponse } from 'next/server';
import { optimizePromptWithGemini } from '@/lib/gemini';

export async function POST(req: Request) {
  try {
    const { rawPrompt, targetModel } = await req.json();

    if (!rawPrompt || typeof rawPrompt !== 'string') {
      return NextResponse.json({ error: 'Raw prompt string is required' }, { status: 400 });
    }

    const result = await optimizePromptWithGemini(rawPrompt, targetModel || 'Gemini 1.5 Pro/Flash');
    return NextResponse.json(result);
  } catch (err) {
    console.error('Optimization API route error:', err);
    return NextResponse.json({ error: 'Failed to optimize prompt' }, { status: 500 });
  }
}
