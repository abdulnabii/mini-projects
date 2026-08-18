import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { RoastIntensity, RoastResult } from '@/types';
import { generateClientFallbackRoast } from '@/lib/roastEngine';

export async function POST(req: Request) {
  try {
    const {
      name,
      portfolioUrl,
      bioText,
      projectsText,
      githubData,
      intensity = 'spicy',
    }: {
      name?: string;
      portfolioUrl?: string;
      bioText?: string;
      projectsText?: string;
      githubData?: any;
      intensity?: RoastIntensity;
    } = await req.json();

    const devName = name?.trim() || githubData?.name || 'Developer';

    let targetInfo = `Developer Name: ${devName}\nPortfolio URL: ${portfolioUrl || 'N/A'}\nBio: ${bioText || 'N/A'}\nProjects / Tech Stack:\n${projectsText || 'N/A'}`;

    if (githubData) {
      targetInfo += `\n\n[LIVE GITHUB VERIFIED STATS]:
GitHub Username: @${githubData.username}
Public Repos Count: ${githubData.publicRepos}
Followers Count: ${githubData.followers}
Top Repositories & Tech:
${githubData.formattedProjectsText}`;
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const toneInstruction =
          intensity === 'nuclear'
            ? 'Be unhinged, devastatingly savage, brutally funny, and ruthless like Gordon Ramsay reviewing an uncooked dish. Do not sugarcoat anything.'
            : intensity === 'spicy'
            ? 'Be witty, sarcastic, sharp-tongued, and bluntly honest with high comedic value.'
            : 'Be constructive, gentle with friendly banter, and focus primarily on professional growth.';

        const prompt = `You are the Lead Critic & Chief Roaster at PortfolioRoaster.AI.
Tone Setting: ${toneInstruction}

IMPORTANT RULES:
1. DO NOT use cliché generic phrases like "A todo app, weather app and calculator" UNLESS those exact words appear in the input!
2. Inspect the EXACT projects, repositories, bio words, and tech stack provided below and craft CUSTOM, highly personalized, specific roasts citing their actual tools, project names, or GitHub repo names.
3. Every critique must include a genuinely useful engineering refactor fix.

Input Data to Analyze:
${targetInfo}

Evaluate across 5 specific dimensions:
1. Design & Typography (visual aesthetics, color palette, spacing, layout)
2. Project Quality & Depth (are their projects and GitHub repos production-grade, deployed, or unmonetized experiments?)
3. About Section & Cringe Factor (generic buzzwords vs clear value proposition)
4. UX, Navigation & Speed (mobile usability, clarity, interactive friction, README quality)
5. Recruiter & ATS Hireability (would a FAANG or startup recruiter hire them in 5 seconds?)

Return ONLY valid JSON with this exact schema (no markdown wrap, no other text):
{
  "overallScore": 68,
  "overallVerdict": "One custom, memorable summary verdict citing their specific background",
  "topRoastPunchline": "The single funniest and most devastating truth tailored specifically to their input",
  "survivalBadge": "A custom badge title matching their score",
  "categories": {
    "design": { "score": 60, "grade": "C", "roast": "Specific roast text", "actionableTip": "Actionable fix", "keyIssues": ["Issue 1", "Issue 2"] },
    "projects": { "score": 70, "grade": "B", "roast": "Specific roast text citing their projects", "actionableTip": "Actionable fix", "keyIssues": ["Issue 1", "Issue 2"] },
    "aboutBio": { "score": 55, "grade": "C", "roast": "Specific roast text citing their bio", "actionableTip": "Actionable fix", "keyIssues": ["Issue 1", "Issue 2"] },
    "uxAndSpeed": { "score": 75, "grade": "B", "roast": "Specific roast text", "actionableTip": "Actionable fix", "keyIssues": ["Issue 1", "Issue 2"] },
    "recruiterAppeal": { "score": 65, "grade": "C", "roast": "Specific roast text", "actionableTip": "Actionable fix", "keyIssues": ["Issue 1", "Issue 2"] }
  },
  "rewrittenHeroBio": {
    "beforeBio": "${bioText ? bioText.slice(0, 120) : 'Software developer'}",
    "afterBio": "Compelling 2-sentence high-converting bio tailored to their actual skills",
    "improvedTagline": "Sharp 1-sentence hero headline",
    "targetKeywords": ["Keyword 1", "Keyword 2", "Keyword 3", "Keyword 4"]
  },
  "actionRoadmap": [
    { "priority": 1, "title": "Immediate Priority 1", "description": "Specific action step", "impact": "CRITICAL" },
    { "priority": 2, "title": "Priority 2", "description": "Specific action step", "impact": "HIGH" },
    { "priority": 3, "title": "Priority 3", "description": "Specific action step", "impact": "HIGH" },
    { "priority": 4, "title": "Priority 4", "description": "Specific action step", "impact": "MEDIUM" }
  ]
}`;

        const res = await model.generateContent(prompt);
        const text = res.response.text().trim().replace(/^```json\n?/, '').replace(/\n?```$/, '');
        const parsed = JSON.parse(text);

        const roastResult: RoastResult = {
          id: `roast_${Date.now()}`,
          developerName: devName,
          targetUrlOrTitle: portfolioUrl || (githubData ? `github.com/${githubData.username}` : devName),
          intensity,
          ...parsed,
          createdAt: new Date().toISOString(),
        };

        return NextResponse.json(roastResult);
      } catch (err) {
        console.warn('Gemini roasting failed, using dynamic fallback engine:', err);
      }
    }

    // High quality dynamic fallback
    const fallback = generateClientFallbackRoast(
      devName,
      portfolioUrl || bioText || 'Portfolio',
      intensity,
      projectsText,
      githubData
    );
    return NextResponse.json(fallback);
  } catch (err) {
    console.error('Roast API error:', err);
    return NextResponse.json({ error: 'Failed to roast portfolio' }, { status: 500 });
  }
}
