import { NextResponse } from 'next/server';
import { PRESET_RECEIPTS } from '@/lib/mock-data';

export async function POST(req: Request) {
  try {
    const { presetKey } = await req.json();
    const receipt = PRESET_RECEIPTS[presetKey] || PRESET_RECEIPTS.starbucks;
    return NextResponse.json(receipt);
  } catch (err) {
    return NextResponse.json({ error: 'OCR processing failed' }, { status: 500 });
  }
}
