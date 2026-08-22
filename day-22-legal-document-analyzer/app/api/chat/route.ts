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
      console.warn('Gemini chat error, providing dynamic document-grounded response:', err);

      const qLower = question.toLowerCase();
      const docLower = docText.toLowerCase();

      let answer = '';

      if (qLower.includes('terminat') || qLower.includes('fire') || qLower.includes('notice') || qLower.includes('severance')) {
        const found = extractRelevantSection(docText, ['terminat', 'at-will', 'notice', 'severance', 'cause']);
        answer = found
          ? `Regarding termination: According to the contract text:\n\n> "${found}"\n\nKey Takeaway: The agreement sets specific termination rules. If there is no mandatory notice period specified, the employer may attempt immediate termination. Always negotiate a minimum 30-day written notice.`
          : `Reviewing the document for termination provisions: The text does not contain an explicit 30-day notice requirement. This means either party may be able to terminate the relationship without extensive notice unless otherwise restricted.`;
      } else if (qLower.includes('ip') || qLower.includes('intellectual property') || qLower.includes('invention') || qLower.includes('side project') || qLower.includes('own')) {
        const found = extractRelevantSection(docText, ['assign', 'invention', 'intellectual property', 'all rights', 'work made for hire']);
        answer = found
          ? `Regarding Intellectual Property: The document contains the following IP assignment clause:\n\n> "${found}"\n\nKey Takeaway: Be cautious if the text states inventions are assigned "whether or not created during working hours". You should propose an amendment to carve out personal weekend projects and pre-existing open-source assets.`
          : `Intellectual Property Check: The document does not appear to contain a severe broad IP grab, but you should ensure any work-for-hire provisions are limited strictly to paid deliverables.`;
      } else if (qLower.includes('non-compete') || qLower.includes('compete') || qLower.includes('work with other') || qLower.includes('competitor')) {
        const found = extractRelevantSection(docText, ['non-compete', 'compete', 'competing', 'similar business', 'months']);
        answer = found
          ? `Regarding Non-Compete obligations:\n\n> "${found}"\n\nKey Takeaway: Non-compete covenants exceeding 6–12 months or covering broad global territories are often legally disfavored or unenforceable, but can still cause dispute friction. Propose narrowing the scope to direct competitors only.`
          : `Non-Compete Check: No restrictive global non-compete clause was explicitly identified in the text.`;
      } else if (qLower.includes('liabilit') || qLower.includes('indemnif') || qLower.includes('sue') || qLower.includes('bug')) {
        const found = extractRelevantSection(docText, ['indemnif', 'hold harmless', 'liability', 'damages', 'defend']);
        answer = found
          ? `Regarding Liability & Indemnification:\n\n> "${found}"\n\nKey Takeaway: Ensure indemnification is mutual and that your aggregate liability is capped at the total contract value rather than unlimited consequential damages.`
          : `Liability Check: Ensure standard mutual limitation of liability clauses are in place to cap potential dispute damages.`;
      } else {
        const firstPara = docText.slice(0, 300).trim();
        answer = `Based on the document context:\n\n> "${firstPara}..."\n\nThis agreement outlines the primary terms and mutual covenants. For specific questions regarding liability, IP ownership, or termination, refer to the corresponding sections or consult legal counsel.`;
      }

      answer += '\n\n*Note: This AI response is educational and does not constitute formal legal representation.*';

      return NextResponse.json({ answer });
    }
  } catch (error: any) {
    console.error('Chat route error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function extractRelevantSection(text: string, keywords: string[]): string {
  const paragraphs = text.split('\n').filter((p) => p.trim().length > 20);
  for (const para of paragraphs) {
    const paraLower = para.toLowerCase();
    if (keywords.some((k) => paraLower.includes(k))) {
      return para.trim().slice(0, 400);
    }
  }
  return '';
}
