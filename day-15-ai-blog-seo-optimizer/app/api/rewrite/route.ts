import { NextResponse } from 'next/server';
import { rewriteParagraphWithAI } from '@/lib/gemini';

export async function POST(req: Request) {
  try {
    const { paragraph, targetKeyword, goal } = await req.json();

    const result = await rewriteParagraphWithAI(
      paragraph || '',
      targetKeyword || '',
      goal || 'Improve readability, sentence brevity, and keyword placement'
    );

    return NextResponse.json(result);
  } catch (err) {
    console.error('Error in section rewrite API:', err);
    return NextResponse.json({ error: 'Failed to rewrite section' }, { status: 500 });
  }
}
