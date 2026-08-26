import { NextRequest, NextResponse } from 'next/server';
import { executeMeteredAIFeature } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const { feature, prompt, plan, creditsRemaining } = await req.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Valid prompt string required' }, { status: 400 });
    }

    if (creditsRemaining !== undefined && creditsRemaining <= 0 && plan === 'free') {
      return NextResponse.json(
        {
          error: 'Rate Limit Exceeded: Monthly AI credit quota exhausted. Upgrade to Pro for 750 credits.',
        },
        { status: 429 }
      );
    }

    const result = await executeMeteredAIFeature(
      feature || 'COPYWRITER',
      prompt,
      plan || 'pro'
    );

    return NextResponse.json({ result });
  } catch (error: any) {
    console.error('API /api/ai error:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal AI Server Error' },
      { status: 500 }
    );
  }
}
