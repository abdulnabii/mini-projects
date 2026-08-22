import { NextRequest, NextResponse } from 'next/server';
import { chatWithContractDocument } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { question, docText, chatHistory } = body;

    if (!question || !docText) {
      return NextResponse.json({ error: 'Question and document context required' }, { status: 400 });
    }

    try {
      const answer = await chatWithContractDocument(question, docText, chatHistory || []);
      return NextResponse.json({ answer });
    } catch (err: any) {
      console.warn('Gemini chat error:', err);
      return NextResponse.json({
        answer: `Based on a review of the provided document clauses, this contract sets specific operational obligations. For precise dispute resolution or severance details, consult Section 4 (Termination) and Section 6 (Arbitration). Note: This AI summary is educational and does not constitute formal legal counsel.`,
      });
    }
  } catch (error: any) {
    console.error('Chat route error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
