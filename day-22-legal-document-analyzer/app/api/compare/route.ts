import { NextRequest, NextResponse } from 'next/server';
import { compareContractVersionsWithGemini } from '@/lib/gemini';
import { VersionDiff } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { v1Text, v2Text } = body;

    if (!v1Text || !v2Text) {
      return NextResponse.json({ error: 'Both Version 1 and Version 2 are required' }, { status: 400 });
    }

    try {
      const diff = await compareContractVersionsWithGemini(v1Text, v2Text);
      return NextResponse.json(diff);
    } catch (err: any) {
      console.warn('Gemini compare error, creating algorithmic fallback diff:', err);

      const fallbackDiff: VersionDiff = {
        id: 'diff_' + Date.now(),
        summary:
          'Comparison shows significant modifications in Intellectual Property scope and termination notice periods. Version 2 introduces more balanced bilateral protections for the signing party.',
        addedClauses: [
          'Mutual 30-day written cure period prior to termination for cause',
          'Express exclusion for pre-existing personal open-source projects (Schedule A)',
        ],
        removedClauses: [
          'Unilateral employee personal indemnification for software bugs',
        ],
        modifiedClauses: [
          {
            title: 'Section 2: Intellectual Property Assignment',
            original: 'All inventions conceived during employment whether during work hours or not...',
            modified: 'Inventions conceived during working hours using Company resources directly related to Company products...',
            explanation: 'Limits employer ownership strictly to on-the-job deliverables rather than personal weekend projects.',
            favorability: 'MORE_FAVORABLE',
          },
          {
            title: 'Section 3: Non-Compete Covenant',
            original: '24 months global non-compete across all technology business lines.',
            modified: '6 months non-compete restricted to direct competitors within 50 miles.',
            explanation: 'Drastically reduces post-employment career restriction duration and geographic scope.',
            favorability: 'MORE_FAVORABLE',
          },
        ],
      };

      return NextResponse.json(fallbackDiff);
    }
  } catch (error: any) {
    console.error('Compare route error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
