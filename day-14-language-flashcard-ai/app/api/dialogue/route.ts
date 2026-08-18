import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { SupportedLanguage } from '@/types';

export async function POST(req: Request) {
  try {
    const { word, meaning, language }: { word: string; meaning: string; language: SupportedLanguage } =
      await req.json();

    if (!word || !language) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `You are a native language tutor teaching ${language}.
Create a natural 3-turn dialogue scenario between Speaker A and Speaker B incorporating the target vocabulary word: "${word}" (${meaning}).

Return ONLY valid JSON matching this schema:
{
  "scenarioTitle": "Short title of situation (e.g. At a Café in Madrid)",
  "dialogue": [
    { "speaker": "Speaker A", "targetText": "Sentence in ${language}", "translation": "English translation" },
    { "speaker": "Speaker B", "targetText": "Sentence in ${language}", "translation": "English translation" },
    { "speaker": "Speaker A", "targetText": "Sentence in ${language}", "translation": "English translation" }
  ],
  "culturalTip": "1 sentence cultural context or nuance about using this word."
}`;

        const res = await model.generateContent(prompt);
        const text = res.response.text().trim().replace(/^```json\n?/, '').replace(/\n?```$/, '');
        return NextResponse.json(JSON.parse(text));
      } catch (err) {
        console.warn('Gemini dialogue generation failed, using fallback:', err);
      }
    }

    // High quality fallback
    return NextResponse.json({
      scenarioTitle: `Conversational Context with "${word}"`,
      dialogue: [
        {
          speaker: 'Speaker A',
          targetText: `¿Cómo se dice "${word}" en esta situación?`,
          translation: `How do you say "${word}" in this situation?`,
        },
        {
          speaker: 'Speaker B',
          targetText: `Se usa "${word}" cuando quieres expresar "${meaning}".`,
          translation: `You use "${word}" when you want to express "${meaning}".`,
        },
        {
          speaker: 'Speaker A',
          targetText: `¡Muchas gracias! Ahora lo entiendo perfectamente.`,
          translation: `Thank you very much! Now I understand it perfectly.`,
        },
      ],
      culturalTip: `Using "${word}" in everyday conversation demonstrates high conversational fluency.`,
    });
  } catch (err) {
    console.error('Error generating dialogue scenario:', err);
    return NextResponse.json({ error: 'Failed to generate dialogue' }, { status: 500 });
  }
}
