import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { JobMatchResult } from '@/types';
import { calculateClientFallbackMatch } from '@/lib/matchEngine';

export async function POST(req: Request) {
  try {
    const {
      jobDescription,
      resumeText,
      skills = [],
      roleTitle,
      companyName,
    }: {
      jobDescription: string;
      resumeText: string;
      skills?: string[];
      roleTitle?: string;
      companyName?: string;
    } = await req.json();

    if (!jobDescription || !jobDescription.trim()) {
      return NextResponse.json({ error: 'Job description is required.' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `You are a Principal Technical Recruiter and Career Coach.
Compare the candidate's background and resume against the target job description.

Company: ${companyName || 'Target Company'}
Role: ${roleTitle || 'Target Role'}

Candidate Resume / Profile:
${resumeText || 'Full-stack software developer with production experience.'}
Candidate Skills: ${skills.join(', ')}

Target Job Description:
${jobDescription}

Perform a rigorous match analysis.
Return ONLY valid JSON matching this exact schema (no markdown wrap, no backticks, no other text):
{
  "matchScore": 88,
  "verdict": "Clear verdict summary string",
  "matchedSkills": ["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5"],
  "missingSkills": ["Missing Skill 1", "Missing Skill 2"],
  "resumeStrengths": ["Strength 1", "Strength 2", "Strength 3"],
  "gapRecommendations": ["Actionable tip 1", "Actionable tip 2", "Actionable tip 3"],
  "tailoredSummary": "2-sentence tailored resume summary optimized for this exact role"
}`;

        const res = await model.generateContent(prompt);
        const text = res.response.text().trim().replace(/^```json\n?/, '').replace(/\n?```$/, '');
        const parsed: JobMatchResult = JSON.parse(text);

        return NextResponse.json(parsed);
      } catch (err) {
        console.warn('Gemini match analysis failed, using fallback engine:', err);
      }
    }

    const fallback = calculateClientFallbackMatch(jobDescription, resumeText, skills);
    return NextResponse.json(fallback);
  } catch (err) {
    console.error('Match API error:', err);
    return NextResponse.json({ error: 'Failed to analyze job match' }, { status: 500 });
  }
}
