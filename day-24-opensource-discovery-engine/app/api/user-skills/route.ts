import { NextRequest, NextResponse } from 'next/server';
import { detectUserSkillsFromGitHub } from '@/lib/github';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get('username') || 'abdulnabii';

    const data = await detectUserSkillsFromGitHub(username);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('User skills API error:', error);
    return NextResponse.json({ error: 'Failed to detect skills' }, { status: 500 });
  }
}
