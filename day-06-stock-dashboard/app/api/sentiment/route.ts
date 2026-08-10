import { NextResponse } from 'next/server';
import { analyzeNewsSentiment } from '@/lib/gemini';

export async function POST(req: Request) {
  try {
    const { ticker, headlines } = await req.json();
    if (!ticker || !headlines?.length) {
      return NextResponse.json({ error: 'ticker and headlines required' }, { status: 400 });
    }
    const result = await analyzeNewsSentiment(ticker, headlines);
    return NextResponse.json(result);
  } catch (err) {
    console.error('Sentiment API error:', err);
    return NextResponse.json({ error: 'Failed to analyze sentiment' }, { status: 500 });
  }
}
