import { NextResponse } from 'next/server';
import { generateBrandKit } from '@/lib/gemini';
import { BrandConfig } from '@/types';

export async function POST(req: Request) {
  try {
    const config: BrandConfig = await req.json();

    if (!config || !config.companyName) {
      return NextResponse.json({ error: 'Company Name is required' }, { status: 400 });
    }

    const kit = await generateBrandKit(config);
    return NextResponse.json(kit);
  } catch (err) {
    console.error('Brand Generator API error:', err);
    return NextResponse.json({ error: 'Failed to generate brand kit' }, { status: 500 });
  }
}
