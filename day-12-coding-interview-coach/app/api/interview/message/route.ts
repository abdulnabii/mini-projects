import { NextResponse } from 'next/server';
import { PROBLEM_LIBRARY } from '@/lib/problems';
import { respondAsInterviewer } from '@/lib/gemini';

export async function POST(req: Request) {
  try {
    const { problemId, chatHistory, candidateMessage } = await req.json();

    const problem = PROBLEM_LIBRARY.find((p) => p.id === problemId) || PROBLEM_LIBRARY[0];

    const replyText = await respondAsInterviewer(problem, chatHistory || [], candidateMessage);

    return NextResponse.json({ text: replyText });
  } catch (err) {
    console.error('Error handling interviewer chat message:', err);
    return NextResponse.json({ error: 'Failed to process message' }, { status: 500 });
  }
}
