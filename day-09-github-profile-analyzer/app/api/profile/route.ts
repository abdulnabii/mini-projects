import { NextResponse } from 'next/server';
import { fetchRealGitHubProfile } from '@/lib/github';
import { generatePersonaWithGemini } from '@/lib/gemini';
import { generateGenericProfile } from '@/lib/mock-profiles';

export async function POST(req: Request) {
  try {
    const { username } = await req.json();

    if (!username || typeof username !== 'string') {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    const cleanUsername = username.trim();

    // 1. Fetch real live GitHub profile data from GitHub API
    let baseProfile = await fetchRealGitHubProfile(cleanUsername);

    // 2. Fallback to generic structure if rate-limited or offline
    if (!baseProfile) {
      baseProfile = generateGenericProfile(cleanUsername);
    }

    // 3. Generate dynamic AI persona using Gemini based on real live data
    const dynamicPersona = await generatePersonaWithGemini(baseProfile);

    return NextResponse.json({
      ...baseProfile,
      persona: dynamicPersona,
    });
  } catch (err) {
    console.error('Profile API error:', err);
    return NextResponse.json({ error: 'Failed to analyze GitHub profile' }, { status: 500 });
  }
}
