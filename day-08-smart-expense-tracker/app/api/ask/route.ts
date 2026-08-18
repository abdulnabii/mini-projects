import { NextResponse } from 'next/server';
import { askFinancialCoach } from '@/lib/gemini';

export async function POST(req: Request) {
  try {
    const { question, transactions, budgets } = await req.json();

    if (!question) {
      return NextResponse.json({ error: 'Missing question parameter' }, { status: 400 });
    }

    const answer = await askFinancialCoach(question, transactions || [], budgets || {});
    return NextResponse.json({ answer });
  } catch (err) {
    console.error('Error answering financial coach question:', err);
    return NextResponse.json({ error: 'Failed to process question' }, { status: 500 });
  }
}
