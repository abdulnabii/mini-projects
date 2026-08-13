import { NextResponse } from 'next/server';
import { PROBLEM_LIBRARY } from '@/lib/problems';
import { generateProgressiveHint } from '@/lib/gemini';

export async function POST(req: Request) {
  try {
    const { problemId, currentCode, hintsGivenCount } = await req.json();

    const problem = PROBLEM_LIBRARY.find((p) => p.id === problemId) || PROBLEM_LIBRARY[0];

    const hint = await generateProgressiveHint(problem, currentCode || '', hintsGivenCount || 0);

    return NextResponse.json(hint);
  } catch (err) {
    console.error('Error generating progressive hint:', err);
    return NextResponse.json({ error: 'Failed to generate hint' }, { status: 500 });
  }
}
