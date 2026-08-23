import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { generateTwitterThreadWithGemini, generateLinkedInPostWithGemini, generateCarouselWithGemini } from '@/lib/gemini';
import { VoiceProfile } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { rawContent, voiceProfile } = body;

    if (!rawContent || typeof rawContent !== 'string') {
      return NextResponse.json({ error: 'Raw content or article text is required' }, { status: 400 });
    }

    const key = process.env.GEMINI_API_KEY || '';

    // First generate Twitter thread, LinkedIn post, and Carousel from the raw content
    const [thread, post, carousel] = await Promise.all([
      generateTwitterThreadWithGemini(rawContent.slice(0, 1000), voiceProfile),
      generateLinkedInPostWithGemini(rawContent.slice(0, 1000), 'story', voiceProfile),
      generateCarouselWithGemini(rawContent.slice(0, 1000), voiceProfile),
    ]);

    return NextResponse.json({
      thread,
      post,
      carousel,
    });
  } catch (error: any) {
    console.error('Repurpose API error:', error);
    return NextResponse.json({ error: error.message || 'Failed to repurpose content' }, { status: 500 });
  }
}
