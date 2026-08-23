import { NextRequest, NextResponse } from 'next/server';
import { generateLinkedInPostWithGemini } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { topic, format, voiceProfile } = body;

    if (!topic || typeof topic !== 'string') {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }

    const post = await generateLinkedInPostWithGemini(topic, format, voiceProfile);
    return NextResponse.json({ post });
  } catch (error: any) {
    console.error('LinkedIn API error:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate LinkedIn post' }, { status: 500 });
  }
}
