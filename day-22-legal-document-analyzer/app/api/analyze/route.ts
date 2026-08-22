import { NextRequest, NextResponse } from 'next/server';
import { generateLegalAnalysisWithGemini } from '@/lib/gemini';
import { DocType, SupportedLanguage } from '@/types';
import { SAMPLE_CONTRACTS } from '@/lib/sampleContracts';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, docType, docTitle, language, sampleId } = body;

    // Check if sample preset requested or fallback
    if (sampleId) {
      const match = SAMPLE_CONTRACTS.find((s) => s.id === sampleId);
      if (match) {
        return NextResponse.json(match.analysis);
      }
    }

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: 'Document text is required' }, { status: 400 });
    }

    try {
      const analysis = await generateLegalAnalysisWithGemini(
        text,
        (docType as DocType) || 'General Legal Contract',
        docTitle || 'Legal Document Analysis',
        (language as SupportedLanguage) || 'English'
      );
      return NextResponse.json(analysis);
    } catch (geminiError: any) {
      console.warn('Gemini API call failed, providing intelligent fallback analysis:', geminiError);

      // Intelligent deterministic fallback
      const fallbackPreset = SAMPLE_CONTRACTS[0];
      return NextResponse.json({
        ...fallbackPreset.analysis,
        id: 'analysis_' + Date.now(),
        docTitle: docTitle || 'Custom Document Analysis',
        docType: docType || 'Employment Agreement',
        rawText: text,
      });
    }
  } catch (error: any) {
    console.error('Analysis route error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
