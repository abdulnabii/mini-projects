import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { AIJournalAnalysis, MoodCategory } from '@/types';
import { generateClientFallbackAnalysis } from '@/lib/journalEngine';
import { EVIDENCE_BASED_TECHNIQUES } from '@/lib/defaultEntries';

export async function POST(req: Request) {
  try {
    const {
      text,
      selectedMood,
    }: {
      text: string;
      selectedMood?: MoodCategory;
    } = await req.json();

    if (!text || !text.trim()) {
      return NextResponse.json({ error: 'Journal text cannot be empty.' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `You are MindSanctuary AI, a compassionate, trauma-informed journaling companion and Cognitive Behavioral Therapy (CBT) reflection assistant.
Your goal is to validate feelings, foster self-awareness, recognize cognitive distortions gently, and provide evidence-based coping exercises.

RULES:
1. Never diagnose or suggest medical/clinical conditions.
2. Always validate the user's feelings first with warm empathy before offering gentle perspective.
3. Ask ONE soft, thought-provoking question to help them reflect deeper.
4. Detect cognitive distortion patterns (e.g., Catastrophizing, All-or-Nothing Thinking, Mind Reading, Emotional Reasoning, Overgeneralization) and provide a balanced reframing thought.
5. If crisis language (self-harm, suicide) is detected, set "crisisFlag": true.

User Selected Mood Tag: ${selectedMood || 'Unspecified'}
Journal Entry Content:
"${text}"

Return ONLY valid JSON matching this exact schema (no markdown wrap, no backticks, no other text):
{
  "primaryEmotion": "Primary emotion phrase (e.g. Performance Anxiety, Serenity)",
  "secondaryEmotions": ["Secondary Emotion 1", "Secondary Emotion 2"],
  "sentimentScore": -0.45,
  "empathyReflection": "Warm 2-3 sentence empathetic response acknowledging and validating their experience",
  "gentlePromptQuestion": "One compassionate question to encourage deeper reflection",
  "detectedPatterns": [
    {
      "name": "Pattern Name (e.g. Catastrophizing)",
      "description": "Brief description of the pattern",
      "reframingThought": "A balanced, realistic alternative thought"
    }
  ],
  "dailyAffirmation": "One specific, non-cheesy encouragement tailored to this entry",
  "crisisFlag": false
}`;

        const res = await model.generateContent(prompt);
        const rawText = res.response.text().trim().replace(/^```json\n?/, '').replace(/\n?```$/, '');
        const parsed = JSON.parse(rawText);

        const result: AIJournalAnalysis = {
          primaryEmotion: parsed.primaryEmotion || 'Reflective Thought',
          secondaryEmotions: parsed.secondaryEmotions || ['Mindful'],
          sentimentScore: typeof parsed.sentimentScore === 'number' ? parsed.sentimentScore : 0.0,
          empathyReflection: parsed.empathyReflection,
          gentlePromptQuestion: parsed.gentlePromptQuestion,
          detectedPatterns: parsed.detectedPatterns || [],
          suggestedTechniques: [EVIDENCE_BASED_TECHNIQUES[0], EVIDENCE_BASED_TECHNIQUES[1]],
          dailyAffirmation: parsed.dailyAffirmation || 'Your awareness and vulnerability are strengths.',
          crisisFlag: !!parsed.crisisFlag,
        };

        return NextResponse.json(result);
      } catch (err) {
        console.warn('Gemini mental health analysis failed, using fallback engine:', err);
      }
    }

    const fallback = generateClientFallbackAnalysis(text, selectedMood);
    return NextResponse.json(fallback);
  } catch (err) {
    console.error('Analyze API error:', err);
    return NextResponse.json({ error: 'Failed to analyze journal entry' }, { status: 500 });
  }
}
