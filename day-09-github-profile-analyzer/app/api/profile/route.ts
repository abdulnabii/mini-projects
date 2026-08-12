import { NextResponse } from 'next/server';
import { generateGenericProfile } from '@/lib/mock-profiles';
import { generatePersonaWithGemini } from '@/lib/gemini';

export async function POST(req: Request) {
  try {
    const { username } = await req.json();

    if (!username || typeof username !== 'string') {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    const baseProfile = generateGenericProfile(username);
    const dynamicPersona = await generatePersonaWithGemini(baseProfile);

    return NextResponse.json({
      ...baseProfile,
      persona: dynamicPersona,
    });
  } catch (err) {
    console.error('Profile API error:', err);
    return NextResponse.json({ error: 'Failed to fetch GitHub profile' }, { status: 500 });
  }
}
