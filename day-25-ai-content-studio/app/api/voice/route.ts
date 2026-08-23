import { NextRequest, NextResponse } from 'next/server';
import { calibrateVoiceWithGemini } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { samplePosts } = body;

    if (!samplePosts || !Array.isArray(samplePosts) || samplePosts.length === 0) {
      return NextResponse.json({ error: 'At least 1 sample post is required' }, { status: 400 });
    }

    const voiceProfile = await calibrateVoiceWithGemini(samplePosts);
    return NextResponse.json({ voiceProfile });
  } catch (error: any) {
    console.error('Voice API error:', error);
    return NextResponse.json({ error: error.message || 'Failed to calibrate voice' }, { status: 500 });
  }
}
