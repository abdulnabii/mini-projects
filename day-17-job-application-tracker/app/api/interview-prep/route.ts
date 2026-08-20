import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { InterviewQuestion } from '@/types';
import { generateClientFallbackInterviewPrep } from '@/lib/matchEngine';

export async function POST(req: Request) {
  try {
    const {
      companyName,
      roleTitle,
      jobDescription = '',
    }: {
      companyName: string;
      roleTitle: string;
      jobDescription?: string;
    } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `You are a Principal Engineering Hiring Manager at top tech companies.
Predict 4 high-probability interview questions for this specific role and company:
Company: ${companyName}
Role: ${roleTitle}
Job Description:
${jobDescription || 'Full stack engineering role'}

Generate:
1. One Technical Deep Dive question
2. One System Design / Architecture question
3. One Behavioral / Leadership question
4. One Company / Culture Specific question

For each question, provide:
- Why interviewers ask it
- A structured STAR framework answer outline (Situation, Task, Action, Result)

Return ONLY valid JSON matching this exact schema (no markdown wrap, no backticks, no other text):
[
  {
    "id": "q1",
    "type": "Technical",
    "question": "Question text",
    "whyTheyAsk": "Explanation of what interviewers evaluate",
    "starOutline": {
      "situation": "Context",
      "task": "Objective",
      "action": "Specific engineering actions taken",
      "result": "Quantifiable outcome"
    }
  },
  {
    "id": "q2",
    "type": "System Design",
    "question": "Question text",
    "whyTheyAsk": "Explanation",
    "starOutline": { "situation": "Context", "task": "Objective", "action": "Action", "result": "Result" }
  },
  {
    "id": "q3",
    "type": "Behavioral",
    "question": "Question text",
    "whyTheyAsk": "Explanation",
    "starOutline": { "situation": "Context", "task": "Objective", "action": "Action", "result": "Result" }
  },
  {
    "id": "q4",
    "type": "Company Specific",
    "question": "Question text",
    "whyTheyAsk": "Explanation",
    "starOutline": { "situation": "Context", "task": "Objective", "action": "Action", "result": "Result" }
  }
]`;

        const res = await model.generateContent(prompt);
        const text = res.response.text().trim().replace(/^```json\n?/, '').replace(/\n?```$/, '');
        const questions: InterviewQuestion[] = JSON.parse(text);

        return NextResponse.json({ questions });
      } catch (err) {
        console.warn('Gemini interview prep generation failed, using fallback engine:', err);
      }
    }

    const fallback = generateClientFallbackInterviewPrep(companyName, roleTitle, jobDescription);
    return NextResponse.json({ questions: fallback });
  } catch (err) {
    console.error('Interview prep API error:', err);
    return NextResponse.json({ error: 'Failed to generate interview questions' }, { status: 500 });
  }
}
