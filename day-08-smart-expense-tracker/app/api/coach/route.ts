import { NextResponse } from 'next/server';
import { generateCoachReport } from '@/lib/gemini';
import { Transaction } from '@/types';

export async function POST(req: Request) {
  try {
    const { transactions, budgets } = await req.json();
    const report = await generateCoachReport(transactions || [], budgets || {});
    return NextResponse.json(report);
  } catch (err) {
    console.error('Coach API error:', err);
    return NextResponse.json({ error: 'Failed to generate coach advice' }, { status: 500 });
  }
}
