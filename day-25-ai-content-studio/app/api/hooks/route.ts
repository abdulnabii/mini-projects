import { NextRequest, NextResponse } from 'next/server';
import { generateHookVariantsWithGemini } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { topic } = body;

    if (!topic || typeof topic !== 'string') {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }

    const hooks = await generateHookVariantsWithGemini(topic);
    return NextResponse.json({ hooks });
  } catch (error: any) {
    console.error('Hooks API error:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate hooks' }, { status: 500 });
  }
}
