import { NextRequest, NextResponse } from 'next/server';
import { generateTwitterThreadWithGemini } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { topic, voiceProfile } = body;

    if (!topic || typeof topic !== 'string') {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }

    const thread = await generateTwitterThreadWithGemini(topic, voiceProfile);
    return NextResponse.json({ thread });
  } catch (error: any) {
    console.error('Thread API error:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate Twitter thread' }, { status: 500 });
  }
}
