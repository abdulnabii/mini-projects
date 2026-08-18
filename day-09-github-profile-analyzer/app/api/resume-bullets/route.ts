import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GitHubProfileData } from '@/types';

export async function POST(req: Request) {
  try {
    const { profile }: { profile: GitHubProfileData } = await req.json();

    if (!profile) {
      return NextResponse.json({ error: 'Profile data missing' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `You are a FAANG Senior Technical Recruiter and Staff Engineer.
Convert this GitHub developer's real repository portfolio and stats into high-impact, quantified ATS resume bullet points and professional summaries:

Developer Info:
- Name: ${profile.name} (@${profile.username})
- Bio: ${profile.bio}
- Archetype: ${profile.persona.archetype}
- Top Languages: ${profile.languages.map((l) => l.language).join(', ')}
- Repos: ${profile.repos.map((r) => `${r.name} (${r.stars} stars, ${r.primaryLanguage}) - ${r.description}`).join('; ')}
- Annual Commits: ${profile.totalCommitsPastYear}

Return ONLY valid JSON matching this schema:
{
  "linkedInHeadline": "Compelling 1-line headline (e.g. Senior Full-Stack Engineer | React, TypeScript & AI Systems)",
  "executiveSummary": "2-3 sentences summarizing core domain expertise, engineering velocity, and open-source contributions.",
  "bulletPoints": [
    "Action verb + technical architecture + quantified metric / impact for top project 1",
    "Action verb + technical architecture + quantified metric / impact for top project 2",
    "Action verb + technical architecture + quantified metric / impact for top project 3",
    "Action verb + open-source contribution & git workflow efficiency"
  ],
  "recommendedRoles": ["Role 1", "Role 2", "Role 3"]
}`;

        const res = await model.generateContent(prompt);
        const text = res.response.text().trim().replace(/^```json\n?/, '').replace(/\n?```$/, '');
        return NextResponse.json(JSON.parse(text));
      } catch (err) {
        console.warn('Gemini API resume call failed, using fallback:', err);
      }
    }

    // High quality fallback
    return NextResponse.json({
      linkedInHeadline: `Full-Stack Software Engineer | ${profile.languages.slice(0, 3).map((l) => l.language).join(' • ')} | Open-Source Contributor`,
      executiveSummary: `Versatile software engineer with ${profile.totalCommitsPastYear}+ annual GitHub contributions across ${profile.repos.length} repositories. Specialized in high-performance ${profile.languages[0]?.language || 'TypeScript'} applications and modern distributed architectures.`,
      bulletPoints: profile.repos.slice(0, 4).map(
        (r) =>
          `Architected and deployed ${r.name} using ${r.primaryLanguage || 'modern frameworks'}, delivering scalable performance and earning ${r.stars} GitHub stars.`
      ),
      recommendedRoles: ['Senior Full-Stack Engineer', 'Frontend Platform Architect', 'Open-Source Core Contributor'],
    });
  } catch (err) {
    console.error('Error generating resume bullets:', err);
    return NextResponse.json({ error: 'Failed to generate resume bullets' }, { status: 500 });
  }
}
