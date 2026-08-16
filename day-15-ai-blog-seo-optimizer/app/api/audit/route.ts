import { NextResponse } from 'next/server';
import { runFullSEOAudit } from '@/lib/seoEngine';

export async function POST(req: Request) {
  try {
    const { title, targetKeyword, metaDescription, content, secondaryKeywords } = await req.json();

    const audit = runFullSEOAudit(
      content || '',
      targetKeyword || 'keyword',
      title || 'Article Title',
      metaDescription || '',
      secondaryKeywords || []
    );

    return NextResponse.json(audit);
  } catch (err) {
    console.error('Error running SEO audit:', err);
    return NextResponse.json({ error: 'Failed to process SEO audit' }, { status: 500 });
  }
}
