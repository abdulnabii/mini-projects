import { NextRequest, NextResponse } from 'next/server';
import { parsePrescriptionWithGemini } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prescriptionText } = body;

    const result = await parsePrescriptionWithGemini(prescriptionText || '');
    return NextResponse.json({ result });
  } catch (error: any) {
    console.error('Scan API error:', error);
    return NextResponse.json({ error: error.message || 'Failed to scan prescription' }, { status: 500 });
  }
}
