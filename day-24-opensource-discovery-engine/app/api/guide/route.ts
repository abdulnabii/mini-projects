import { NextRequest, NextResponse } from 'next/server';
import { generateFirstPrGuideWithGemini } from '@/lib/gemini';
import { OpenSourceProject, TechSkill } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { project, userSkills } = body;

    if (!project) {
      return NextResponse.json({ error: 'Project is required' }, { status: 400 });
    }

    const skills: TechSkill[] = userSkills || ['TypeScript', 'React'];
    const guide = await generateFirstPrGuideWithGemini(project as OpenSourceProject, skills);

    return NextResponse.json({ guide });
  } catch (error: any) {
    console.error('Guide API error:', error);
    return NextResponse.json({ error: 'Failed to generate guide' }, { status: 500 });
  }
}
