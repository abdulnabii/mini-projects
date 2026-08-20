import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { CoverLetterTone } from '@/types';
import { generateClientFallbackCoverLetter } from '@/lib/matchEngine';

export async function POST(req: Request) {
  try {
    const {
      companyName,
      roleTitle,
      candidateName = 'Candidate',
      jobDescription = '',
      resumeText = '',
      tone = 'executive',
    }: {
      companyName: string;
      roleTitle: string;
      candidateName?: string;
      jobDescription?: string;
      resumeText?: string;
      tone?: CoverLetterTone;
    } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const toneInstruction =
          tone === 'enthusiastic'
            ? 'Enthusiastic, high-energy, mission-driven, and excited about the startup/company vision.'
            : tone === 'metric'
            ? 'Direct, data-driven, highlighting quantified impact, metrics, and technical benchmarks.'
            : tone === 'creative'
            ? 'Engaging storytelling angle that hooks the reader with a personal engineering story.'
            : 'Polished, professional, respectful, and authoritative executive tone.';

        const prompt = `You are an Executive Career Coach and Technical Recruiter.
Write a standout, highly tailored cover letter for:
Candidate Name: ${candidateName}
Company: ${companyName}
Role: ${roleTitle}
Tone Style: ${toneInstruction}

Job Description Context:
${jobDescription || 'Full stack software engineering role'}

Candidate Background:
${resumeText || 'Experienced full-stack engineer building production web applications.'}

Format guidelines:
- Include date, company header, formal address, 3-4 compelling structured paragraphs, and professional sign-off.
- DO NOT use generic filler clichés. Tie candidate's skills directly to the company's product requirements.
- Return ONLY the clean cover letter text.`;

        const res = await model.generateContent(prompt);
        const letter = res.response.text().trim();
        return NextResponse.json({ coverLetter: letter });
      } catch (err) {
        console.warn('Gemini cover letter generation failed, using fallback engine:', err);
      }
    }

    const fallback = generateClientFallbackCoverLetter(companyName, roleTitle, candidateName, jobDescription, tone);
    return NextResponse.json({ coverLetter: fallback });
  } catch (err) {
    console.error('Cover letter API error:', err);
    return NextResponse.json({ error: 'Failed to generate cover letter' }, { status: 500 });
  }
}
