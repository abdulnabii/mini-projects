import { GoogleGenerativeAI } from '@google/generative-ai';
import { LegalAnalysis, DocType, SupportedLanguage, VersionDiff } from '@/types';

export async function generateLegalAnalysisWithGemini(
  text: string,
  docType: DocType,
  docTitle: string,
  language: SupportedLanguage = 'English',
  apiKey?: string
): Promise<LegalAnalysis> {
  const key = apiKey || process.env.GEMINI_API_KEY || '';
  if (!key) {
    throw new Error('GEMINI_API_KEY is not configured.');
  }

  const genAI = new GoogleGenerativeAI(key);
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-pro',
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.2,
    },
  });

  const prompt = `
You are an expert corporate legal analyst specializing in contract review, risk mitigation, and plain-English translation for non-lawyers.
Analyze the following legal document (${docType}) in ${language}.

Analyze the text and produce a thorough structured JSON object with the following fields:
{
  "riskScore": number (0-100, where 0=completely safe, 100=catastrophically one-sided and predatory),
  "riskVerdict": "SAFE — Standard Balanced Terms" | "MODERATE RISK — Minor Adjustments Advised" | "HIGH RISK — Negotiate Before Signing" | "CRITICAL RISK — Severely One-Sided / Do Not Sign",
  "executiveSummary": "A clear, plain-English 3-sentence summary of what this document actually does to the signing party (Grade 8 reading level)",
  "overallPros": ["string array of positive/balanced provisions"],
  "overallCons": ["string array of negative/one-sided traps"],
  "dangerousClauses": [
    {
      "id": "dc_1",
      "severity": "SEVERE" | "MODERATE" | "MILD",
      "category": "Intellectual Property" | "Non-Compete" | "Indemnification & Liability" | "Termination & Severance" | "Jurisdiction & Dispute" | "Payment Terms" | "General",
      "title": "Concise title of the risk (e.g. Broad IP Ownership Grab)",
      "exactText": "Exact quote excerpt from the document",
      "plainEnglish": "Plain English breakdown: what this actually means in real life",
      "counterProposal": "Specific, legally sound substitute wording to propose to the counterparty",
      "legalImplication": "Practical consequence if signed as-is"
    }
  ],
  "missingClauses": [
    {
      "id": "mc_1",
      "clause": "Name of omitted standard clause (e.g. 30-Day Notice Period)",
      "risk": "What danger exists because this protection is absent",
      "standardRecommendation": "Standard industry benchmark recommendation",
      "importance": "CRITICAL" | "IMPORTANT" | "RECOMMENDED"
    }
  ],
  "sections": [
    {
      "id": "sec_1",
      "title": "Section number and heading",
      "plainEnglish": "Simple explanation of this section",
      "riskLevel": "LOW" | "MEDIUM" | "HIGH",
      "keyTakeaway": "1 sentence key takeaway"
    }
  ]
}

DOCUMENT TEXT:
${text.slice(0, 80000)}
`;

  const result = await model.generateContent(prompt);
  const responseText = result.response.text();
  const parsed = JSON.parse(responseText);

  const finalAnalysis: LegalAnalysis = {
    id: 'analysis_' + Date.now(),
    docTitle: docTitle || `${docType} Analysis`,
    docType,
    language,
    createdAt: new Date().toISOString(),
    riskScore: parsed.riskScore || 50,
    riskVerdict: parsed.riskVerdict || 'MODERATE RISK — Minor Adjustments Advised',
    executiveSummary: parsed.executiveSummary || 'Legal document analysis completed.',
    overallPros: parsed.overallPros || [],
    overallCons: parsed.overallCons || [],
    dangerousClauses: (parsed.dangerousClauses || []).map((dc: any, idx: number) => ({
      ...dc,
      id: dc.id || `dc_${idx + 1}`,
    })),
    missingClauses: (parsed.missingClauses || []).map((mc: any, idx: number) => ({
      ...mc,
      id: mc.id || `mc_${idx + 1}`,
    })),
    sections: (parsed.sections || []).map((sec: any, idx: number) => ({
      ...sec,
      id: sec.id || `sec_${idx + 1}`,
    })),
    rawText: text,
  };

  return finalAnalysis;
}

export async function chatWithContractDocument(
  question: string,
  docText: string,
  chatHistory: { role: string; content: string }[],
  apiKey?: string
): Promise<string> {
  const key = apiKey || process.env.GEMINI_API_KEY || '';
  if (!key) {
    return 'Gemini API key is not configured. Please set GEMINI_API_KEY in your environment.';
  }

  const genAI = new GoogleGenerativeAI(key);
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: {
      temperature: 0.3,
    },
  });

  const conversation = chatHistory
    .map((m) => `${m.role === 'user' ? 'USER' : 'ASSISTANT'}: ${m.content}`)
    .join('\n');

  const prompt = `
You are ClauseWise AI, a specialized legal document assistant.
Answer the user's question accurately and objectively, grounded STRICTLY in the contract text provided below.
Cite specific sections or clause terms whenever applicable. Keep your tone professional, concise, and helpful for non-lawyers.
Include an explicit disclaimer that this is educational analysis, not formal legal counsel.

DOCUMENT CONTEXT:
${docText.slice(0, 60000)}

CONVERSATION HISTORY:
${conversation}

USER QUESTION:
${question}
`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}

export async function compareContractVersionsWithGemini(
  v1Text: string,
  v2Text: string,
  apiKey?: string
): Promise<VersionDiff> {
  const key = apiKey || process.env.GEMINI_API_KEY || '';
  if (!key) {
    throw new Error('GEMINI_API_KEY is not configured.');
  }

  const genAI = new GoogleGenerativeAI(key);
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-pro',
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.2,
    },
  });

  const prompt = `
You are a legal redlining and contract comparison expert. Compare Document Version 1 (Original / Draft) against Document Version 2 (Revised / Counterparty Proposal).
Produce a structured JSON diff report:
{
  "summary": "Plain English summary of the major shifts between v1 and v2 and who benefited most.",
  "addedClauses": ["List of completely new clauses introduced in v2"],
  "removedClauses": ["List of clauses deleted in v2 that were present in v1"],
  "modifiedClauses": [
    {
      "title": "Clause heading or topic",
      "original": "Text in v1",
      "modified": "Text in v2",
      "explanation": "What changed legally and practically",
      "favorability": "MORE_FAVORABLE" | "LESS_FAVORABLE" | "NEUTRAL"
    }
  ]
}

VERSION 1 (Original):
${v1Text.slice(0, 35000)}

VERSION 2 (Revised):
${v2Text.slice(0, 35000)}
`;

  const result = await model.generateContent(prompt);
  const parsed = JSON.parse(result.response.text());

  return {
    id: 'diff_' + Date.now(),
    summary: parsed.summary || 'Comparison completed.',
    addedClauses: parsed.addedClauses || [],
    removedClauses: parsed.removedClauses || [],
    modifiedClauses: parsed.modifiedClauses || [],
  };
}
