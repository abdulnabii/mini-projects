import { NextResponse } from 'next/server';
import { generateEmailPackage } from '@/lib/gemini';
import { EmailConfig } from '@/types';

export async function POST(req: Request) {
  try {
    const config: EmailConfig = await req.json();

    if (!config || !config.bullets || config.bullets.length === 0) {
      return NextResponse.json({ error: 'At least one bullet point is required' }, { status: 400 });
    }

    const emailPackage = await generateEmailPackage(config);
    return NextResponse.json(emailPackage);
  } catch (err) {
    console.error('Email Generator API error:', err);
    return NextResponse.json({ error: 'Failed to generate email package' }, { status: 500 });
  }
}
