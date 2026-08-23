import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, mode } = body;

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Text to rewrite is required' }, { status: 400 });
    }

    const rewriteMode = mode || 'punchy';
    const key = process.env.GEMINI_API_KEY || '';

    if (!key) {
      // Offline fallback rewrites
      let rewritten = text;
      if (rewriteMode === 'punchy') {
        rewritten = `Stop overcomplicating it.\n\n${text.split('.')[0]}.\n\nThat's the entire formula.`;
      } else if (rewriteMode === 'metrics') {
        rewritten = `We tested this on 45,000 requests:\n\n${text}\n\nResult: 74% faster execution and zero downtime.`;
      } else if (rewriteMode === 'simplify') {
        rewritten = `Here's the simplest way to think about it:\n\n${text.replace(/complex|architecture|infrastructure/gi, 'system')}`;
      } else if (rewriteMode === 'founder') {
        rewritten = `Shipped this today after 14 hours of debugging.\n\n${text}\n\nKeep building. 🚀`;
      } else if (rewriteMode === 'engagement') {
        rewritten = `${text}\n\nDo you agree with this approach, or is there a better pattern in 2026? Drop your thoughts below 👇`;
      }

      return NextResponse.json({ rewrittenText: rewritten });
    }

    const genAI = new GoogleGenerativeAI(key);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.4,
      },
    });

    const modePromptMap: Record<string, string> = {
      punchy: 'Rewrite this to be ultra-punchy, high-impact, short, and contrarian. Remove all fluff.',
      metrics: 'Rewrite this by adding specific realistic numbers, percentages (e.g. 74%, 2.4x), timeframes, and hard metrics.',
      simplify: 'Explain Like I am 5 (ELI5). Remove all jargon and make it effortless to understand in 10 seconds.',
      founder: 'Rewrite in an authentic, high-energy "Build in Public" developer/founder voice.',
      engagement: 'Rewrite this to spark intense debate, comments, and replies from developers on Twitter and LinkedIn.',
    };

    const instruction = modePromptMap[rewriteMode] || modePromptMap.punchy;

    const prompt = `
You are a viral social media ghostwriter.
INSTRUCTION: ${instruction}

ORIGINAL TEXT:
"${text}"

Provide ONLY the rewritten copy without quotation marks or conversational commentary.
`;

    const result = await model.generateContent(prompt);
    const rewrittenText = result.response.text().trim();

    return NextResponse.json({ rewrittenText });
  } catch (error: any) {
    console.error('Rewrite API error:', error);
    return NextResponse.json({ error: error.message || 'Failed to rewrite text' }, { status: 500 });
  }
}
