import { NextResponse } from 'next/server';
import { PROBLEM_LIBRARY } from '@/lib/problems';
import { generateInterviewerGreeting } from '@/lib/gemini';
import { InterviewMessage, ProgrammingLanguage } from '@/types';

export async function POST(req: Request) {
  try {
    const { problemId, language } = await req.json();

    const problem = PROBLEM_LIBRARY.find((p) => p.id === problemId) || PROBLEM_LIBRARY[0];
    const targetLang: ProgrammingLanguage = language || 'python';

    const greetingText = await generateInterviewerGreeting(problem, targetLang);

    const initialMessage: InterviewMessage = {
      id: `msg_0`,
      sender: 'interviewer',
      text: greetingText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    return NextResponse.json({
      problem,
      language: targetLang,
      messages: [initialMessage],
    });
  } catch (err) {
    console.error('Error starting interview session:', err);
    return NextResponse.json({ error: 'Failed to initialize interview' }, { status: 500 });
  }
}
