import { NextResponse } from 'next/server';
import { askMeetingAssistant } from '@/lib/gemini';

export async function POST(req: Request) {
  try {
    const { transcript, intelligence, question } = await req.json();

    if (!question || !transcript) {
      return NextResponse.json({ error: 'Missing transcript or question' }, { status: 400 });
    }

    const answer = await askMeetingAssistant(transcript, intelligence, question);
    return NextResponse.json({ answer });
  } catch (error) {
    console.error('Error answering meeting question:', error);
    return NextResponse.json({ error: 'Failed to process question' }, { status: 500 });
  }
}
