import { NextRequest, NextResponse } from 'next/server';
import { analyzeDatasetWithGemini } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { csvText, title } = body;

    if (!csvText) {
      return NextResponse.json({ error: 'CSV dataset text is required' }, { status: 400 });
    }

    const analysis = await analyzeDatasetWithGemini(csvText, title || 'Uploaded Dataset');
    return NextResponse.json({ analysis });
  } catch (error: any) {
    console.error('Dataset analysis API error:', error);
    return NextResponse.json({ error: error.message || 'Analysis failed' }, { status: 500 });
  }
}
