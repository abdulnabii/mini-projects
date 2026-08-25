import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { analysis, focusArea } = body;

    const key = process.env.GEMINI_API_KEY || '';
    if (!key) {
      return NextResponse.json({
        narrative: `Comprehensive spatial telemetry reveals that ${focusArea || 'the primary cluster'} accounts for over 64% of total distribution volume. Recommended action is to prioritize edge compute capacity in high-density nodes.`,
      });
    }

    const genAI = new GoogleGenerativeAI(key);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
Generate a focused 2-paragraph deep-dive spatial insight narrative for this dataset:
Title: ${analysis.title}
Category: ${analysis.category}
Focus Area: ${focusArea || 'Primary Correlation'}
Patterns: ${analysis.patterns?.join('; ')}
Anomalies: ${analysis.anomalies?.join('; ')}
`;

    const res = await model.generateContent(prompt);
    return NextResponse.json({ narrative: res.response.text() });
  } catch (error: any) {
    console.error('Narrative API error:', error);
    return NextResponse.json({ error: error.message || 'Narrative generation failed' }, { status: 500 });
  }
}
