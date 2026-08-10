import { NextResponse } from 'next/server';
import { extractMeetingIntelligence } from '@/lib/gemini';

export async function POST(req: Request) {
  try {
    const { transcript } = await req.json();

    if (!transcript) {
      return NextResponse.json({ error: 'Transcript is required' }, { status: 400 });
    }

    const intelligence = await extractMeetingIntelligence(transcript);
    return NextResponse.json(intelligence);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to process transcript' }, { status: 500 });
  }
}
