import { NextRequest, NextResponse } from 'next/server';
import { searchCuratedProjects } from '@/lib/github';
import { TechSkill } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { skills, difficulty, search } = body;

    const selectedSkills: TechSkill[] = skills || [];
    const diff = difficulty || 'all';
    const query = search || '';

    const results = searchCuratedProjects(selectedSkills, diff, query);

    // Sort by matchFitPercent desc, then starVelocityMonth desc
    results.sort((a, b) => {
      const fitA = a.matchFitPercent || 0;
      const fitB = b.matchFitPercent || 0;
      if (fitB !== fitA) return fitB - fitA;
      return b.starVelocityMonth - a.starVelocityMonth;
    });

    return NextResponse.json({ projects: results });
  } catch (error: any) {
    console.error('Discover API error:', error);
    return NextResponse.json({ error: 'Failed to search projects' }, { status: 500 });
  }
}
