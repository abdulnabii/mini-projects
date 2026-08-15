import { NextResponse } from 'next/server';
import { generateFlashcardsWithGemini } from '@/lib/gemini';
import { CEFRLevel, SupportedLanguage } from '@/types';

export async function POST(req: Request) {
  try {
    const { language, topic, level, count } = await req.json();

    const targetLang: SupportedLanguage = language || 'spanish';
    const targetTopic: string = topic || 'Business';
    const targetLevel: CEFRLevel = level || 'B1';
    const targetCount: number = count || 4;

    const cards = await generateFlashcardsWithGemini(
      targetLang,
      targetTopic,
      targetLevel,
      targetCount
    );

    return NextResponse.json({ cards });
  } catch (err) {
    console.error('Error in deck generator route:', err);
    return NextResponse.json({ error: 'Failed to generate flashcard deck' }, { status: 500 });
  }
}
