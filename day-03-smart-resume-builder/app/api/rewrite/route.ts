import { NextResponse } from 'next/server';
import { rewriteBulletWithAI } from '@/lib/gemini';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { rawBullet, targetJobDescription, role } = body;

    if (!rawBullet || typeof rawBullet !== 'string') {
      return NextResponse.json(
        { error: 'rawBullet string parameter is required' },
        { status: 400 }
      );
    }

    const result = await rewriteBulletWithAI(rawBullet, targetJobDescription, role);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in AI Bullet Rewrite route:', error);
    return NextResponse.json(
      { error: 'Failed to rewrite bullet point' },
      { status: 500 }
    );
  }
}
