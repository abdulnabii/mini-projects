import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { CODE_REVIEW_SYSTEM_PROMPT, generateMockReview } from '@/lib/gemini';
import { ReviewResult } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, language }: { code: string; language: string } = body;

    if (!code || !code.trim()) {
      return NextResponse.json({ error: 'Code content cannot be empty' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // Use intelligent fallback if GEMINI_API_KEY is absent
    if (!apiKey) {
      console.log('No GEMINI_API_KEY detected. Utilizing static analysis fallback engine.');
      const mockResult = generateMockReview(code, language);
      return NextResponse.json(mockResult);
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: CODE_REVIEW_SYSTEM_PROMPT,
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.1,
      },
    });

    const userPrompt = `Target Language: ${language || 'autodetect'}\n\nCode snippet to review:\n\`\`\`${language}\n${code}\n\`\`\``;

    const result = await model.generateContent(userPrompt);

    const responseText = result.response.text();
    const parsedData: ReviewResult = JSON.parse(responseText);

    return NextResponse.json(parsedData);
  } catch (error) {
    console.error('Error in Code Review API route:', error);
    // Graceful fallback on failure
    const { code, language } = await req.json().catch(() => ({ code: '', language: 'javascript' }));
    const fallback = generateMockReview(code || '', language || 'javascript');
    return NextResponse.json({
      ...fallback,
      summary: fallback.summary + " (Evaluated via fallback static analyzer engine)."
    });
  }
}
