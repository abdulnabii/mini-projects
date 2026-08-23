import { NextRequest, NextResponse } from 'next/server';
import { generateCarouselWithGemini } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { topic, voiceProfile } = body;

    if (!topic || typeof topic !== 'string') {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }

    const carousel = await generateCarouselWithGemini(topic, voiceProfile);
    return NextResponse.json({ carousel });
  } catch (error: any) {
    console.error('Carousel API error:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate Carousel' }, { status: 500 });
  }
}
