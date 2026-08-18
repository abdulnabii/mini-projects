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
      intensity = 'spicy',
    }: {
      name?: string;
      portfolioUrl?: string;
      bioText?: string;
      projectsText?: string;
      intensity?: RoastIntensity;
    } = await req.json();

    const devName = name?.trim() || 'Developer';
    const targetInfo = `Name: ${devName}\nPortfolio URL: ${portfolioUrl || 'N/A'}\nBio: ${bioText || 'N/A'}\nProjects: ${projectsText || 'N/A'}`;

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

Analyze this developer's portfolio submission:
${targetInfo}

Evaluate across 5 specific dimensions:
1. Design & Typography (visual aesthetics, color palette, spacing, layout)
2. Project Quality & Depth (are they generic tutorial clones or real-world apps?)
3. About Section & Cringe Factor (generic buzzwords vs clear value proposition)
4. UX, Navigation & Speed (mobile usability, clarity, interactive friction)
5. Recruiter & ATS Hireability (would a FAANG or startup recruiter hire them in 5 seconds?)

Return ONLY valid JSON with this exact schema (no markdown wrap, no other text):
{
  "overallScore": 42,
  "overallVerdict": "One punchy, memorable summary verdict",
  "topRoastPunchline": "The single funniest and most devastating truth about this portfolio",
  "survivalBadge": "A badge title (e.g. Survived the Roast - Barely)",
  "categories": {
    "design": { "score": 38, "grade": "D", "roast": "Detailed roast text", "actionableTip": "Actionable fix", "keyIssues": ["Issue 1", "Issue 2"] },
    "projects": { "score": 45, "grade": "C", "roast": "Detailed roast text", "actionableTip": "Actionable fix", "keyIssues": ["Issue 1", "Issue 2"] },
    "aboutBio": { "score": 30, "grade": "F", "roast": "Detailed roast text", "actionableTip": "Actionable fix", "keyIssues": ["Issue 1", "Issue 2"] },
    "uxAndSpeed": { "score": 52, "grade": "C", "roast": "Detailed roast text", "actionableTip": "Actionable fix", "keyIssues": ["Issue 1", "Issue 2"] },
    "recruiterAppeal": { "score": 35, "grade": "D", "roast": "Detailed roast text", "actionableTip": "Actionable fix", "keyIssues": ["Issue 1", "Issue 2"] }
  },
  "rewrittenHeroBio": {
    "beforeBio": "${bioText ? bioText.slice(0, 120) : 'Passionate developer'}",
    "afterBio": "Compelling 2-sentence high-converting bio",
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
          targetUrlOrTitle: portfolioUrl || devName,
          intensity,
          ...parsed,
          createdAt: new Date().toISOString(),
        };

        return NextResponse.json(roastResult);
      } catch (err) {
        console.warn('Gemini roasting failed, using fallback engine:', err);
      }
    }

    // High quality client fallback
    const fallback = generateClientFallbackRoast(devName, portfolioUrl || bioText || 'Portfolio', intensity);
    return NextResponse.json(fallback);
  } catch (err) {
    console.error('Roast API error:', err);
    return NextResponse.json({ error: 'Failed to roast portfolio' }, { status: 500 });
  }
}
