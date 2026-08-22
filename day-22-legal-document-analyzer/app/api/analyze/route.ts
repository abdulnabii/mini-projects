import { NextRequest, NextResponse } from 'next/server';
import { generateLegalAnalysisWithGemini } from '@/lib/gemini';
import { analyzeDocumentWithHeuristics } from '@/lib/heuristicAnalyzer';
import { DocType, SupportedLanguage } from '@/types';
import { SAMPLE_CONTRACTS } from '@/lib/sampleContracts';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, docType, docTitle, language, sampleId } = body;

    // Check if sample preset requested
    if (sampleId) {
      const match = SAMPLE_CONTRACTS.find((s) => s.id === sampleId);
      if (match) {
        return NextResponse.json(match.analysis);
      }
    }

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: 'Document text is required' }, { status: 400 });
    }

    const cleanDocType = (docType as DocType) || 'General Legal Contract';
    const cleanDocTitle = docTitle || `${cleanDocType} Review`;
    const cleanLanguage = (language as SupportedLanguage) || 'English';

    try {
      const analysis = await generateLegalAnalysisWithGemini(
        text,
        cleanDocType,
        cleanDocTitle,
        cleanLanguage
      );
      return NextResponse.json(analysis);
    } catch (geminiError: any) {
      console.warn('Gemini API call failed, falling back to intelligent heuristic analysis:', geminiError);

      // Perform accurate heuristic analysis grounded in user's exact uploaded text
      const heuristicAnalysis = analyzeDocumentWithHeuristics(
        text,
        cleanDocType,
        cleanDocTitle,
        cleanLanguage
      );
      return NextResponse.json(heuristicAnalysis);
    }
  } catch (error: any) {
    console.error('Analysis route error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
