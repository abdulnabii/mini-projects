import { GoogleGenerativeAI } from '@google/generative-ai';
import { OptimizationResult, TargetModel } from '@/types';

export async function optimizePromptWithGemini(
  rawPrompt: string,
  targetModel: TargetModel
): Promise<OptimizationResult> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = `You are a world-class AI Prompt Engineer and System Instruction Architect.
Analyze and optimize the following raw prompt for target model: "${targetModel}".

Raw User Prompt:
"""
${rawPrompt}
"""

Return ONLY a valid JSON object matching this exact schema (no markdown formatting or extra text):
{
  "scorecard": {
    "totalScore": 72,
    "clarity": { "name": "Clarity & Intent", "score": 15, "maxScore": 20, "description": "Degree of explicit goal definition.", "feedback": "Clear intent but lacks precise scope." },
    "context": { "name": "Contextual Depth", "score": 12, "maxScore": 20, "description": "Sufficient background & persona specs.", "feedback": "Needs role assignment and domain context." },
    "constraints": { "name": "Constraints & Rules", "score": 14, "maxScore": 20, "description": "Explicit boundaries and negative rules.", "feedback": "Add length and output format limits." },
    "formatting": { "name": "Output Formatting", "score": 16, "maxScore": 20, "description": "Structured format requirements.", "feedback": "Specifying JSON or Markdown layout helps." },
    "guardrails": { "name": "Safety & Robustness", "score": 15, "maxScore": 20, "description": "Hallucination mitigation and edge case handling.", "feedback": "Include fallback rules for missing data." },
    "summaryFeedback": "Good foundational prompt. Adding role context, explicit output formatting, and guardrails elevates output consistency."
  },
  "variants": [
    {
      "id": "variant-strict",
      "title": "Strict Production System Prompt",
      "goalTag": "production",
      "description": "High precision, zero ambiguity, scoped system boundaries.",
      "systemInstruction": "You are an expert AI system. Act with maximum precision and adhere strictly to output constraints.",
      "userPrompt": "Refined user prompt with clear input parameters and step-by-step instructions...",
      "estimatedTokens": 180,
      "extractedVariables": ["topic", "target_audience"]
    },
    {
      "id": "variant-reasoning",
      "title": "Chain-of-Thought Deep Reasoning",
      "goalTag": "reasoning",
      "description": "Forces step-by-step analysis before outputting final answer.",
      "systemInstruction": "You are a analytical reasoning agent. Break down the task into logical components before providing your synthesized response.",
      "userPrompt": "First, analyze the key variables. Second, evaluate edge cases. Finally, output your response in structured markdown...",
      "estimatedTokens": 240,
      "extractedVariables": ["input_data"]
    },
    {
      "id": "variant-creative",
      "title": "Persona-Driven Creative Spark",
      "goalTag": "creative",
      "description": "Rich storytelling tone, engaging style, vivid metaphors.",
      "systemInstruction": "You are a master creative director. Craft engaging, memorable content that resonates deeply with readers.",
      "userPrompt": "Imbue the content with compelling narrative hooks while preserving accuracy...",
      "estimatedTokens": 210,
      "extractedVariables": ["tone_style"]
    }
  ]
}`;

      const result = await model.generateContent(prompt);
      const text = result.response.text().trim().replace(/^```json\n?/, '').replace(/\n?```$/, '');
      const parsed = JSON.parse(text);

      return {
        id: crypto.randomUUID(),
        rawPrompt,
        targetModel,
        scorecard: parsed.scorecard,
        variants: parsed.variants,
        createdAt: new Date().toISOString(),
      };
    } catch (err) {
      console.warn('Gemini optimization API error, using fallback optimization engine:', err);
    }
  }

  return generateFallbackOptimization(rawPrompt, targetModel);
}

export async function executeTestRun(systemInstruction: string, userPrompt: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return `[SIMULATED GEMINI RESPONSE]\n\nHello! Executing test run for optimized prompt:\n\nSystem Instruction: ${systemInstruction || 'Default AI Assistant'}\n\nProcessed Output:\nYour optimized prompt executed cleanly. To run live AI calls, add GEMINI_API_KEY to your environment.`;
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: systemInstruction || undefined,
    });

    const result = await model.generateContent(userPrompt);
    return result.response.text();
  } catch (err: any) {
    return `Execution Error: ${err.message || 'Failed to execute prompt with Gemini API'}`;
  }
}

function generateFallbackOptimization(rawPrompt: string, targetModel: TargetModel): OptimizationResult {
  const vars = extractVars(rawPrompt);

  return {
    id: crypto.randomUUID(),
    rawPrompt,
    targetModel,
    scorecard: {
      totalScore: 78,
      clarity: { name: 'Clarity & Intent', score: 16, maxScore: 20, description: 'Degree of explicit goal definition.', feedback: 'Core task is clear.' },
      context: { name: 'Contextual Depth', score: 14, maxScore: 20, description: 'Sufficient background & persona specs.', feedback: 'Adding domain persona enhances depth.' },
      constraints: { name: 'Constraints & Rules', score: 15, maxScore: 20, description: 'Explicit boundaries and negative rules.', feedback: 'Explicit token & style bounds recommended.' },
      formatting: { name: 'Output Formatting', score: 17, maxScore: 20, description: 'Structured format requirements.', feedback: 'Markdown layout recommended.' },
      guardrails: { name: 'Safety & Robustness', score: 16, maxScore: 20, description: 'Hallucination mitigation.', feedback: 'Fallback instructions included.' },
      summaryFeedback: 'Solid prompt foundation. Structuring system instructions and explicit output tags improves consistency.',
    },
    variants: [
      {
        id: 'var-1',
        title: 'Production-Grade System Prompt',
        goalTag: 'production',
        description: 'Optimized for high accuracy and reliable JSON/Markdown execution.',
        systemInstruction: `You are an expert specialist optimized for ${targetModel}. Follow instructions strictly, adhere to boundaries, and avoid fluff.`,
        userPrompt: `### TASK\n${rawPrompt}\n\n### CONSTRAINTS\n- Provide concise, actionable output.\n- Structure response with clear Markdown headers.\n- If data is ambiguous, ask for clarification.`,
        estimatedTokens: Math.round(rawPrompt.length / 4) + 120,
        extractedVariables: vars.length > 0 ? vars : ['input_query'],
      },
      {
        id: 'var-2',
        title: 'Chain-of-Thought Deep Reasoning',
        goalTag: 'reasoning',
        description: 'Enforces step-by-step thinking for complex multi-stage tasks.',
        systemInstruction: 'Act as a senior analytical agent. Break problems into logical sub-tasks prior to synthesizing answers.',
        userPrompt: `### STEP 1: ANALYZE\nReview input requirements: ${rawPrompt}\n\n### STEP 2: EVALUATE\nIdentify key constraints and potential edge cases.\n\n### STEP 3: EXECUTE\nProvide final authoritative answer.`,
        estimatedTokens: Math.round(rawPrompt.length / 4) + 180,
        extractedVariables: vars.length > 0 ? vars : ['context_data'],
      },
      {
        id: 'var-3',
        title: 'High-Impact Persona Engine',
        goalTag: 'creative',
        description: 'Engaging, creative, and customer-facing communication style.',
        systemInstruction: 'You are an award-winning creative copywriter and strategist.',
        userPrompt: `Craft an engaging response based on: "${rawPrompt}". Use compelling metaphors, clear bullet points, and a motivating call-to-action.`,
        estimatedTokens: Math.round(rawPrompt.length / 4) + 140,
        extractedVariables: vars.length > 0 ? vars : ['target_audience'],
      },
    ],
    createdAt: new Date().toISOString(),
  };
}

function extractVars(text: string): string[] {
  const matches = text.match(/\{\{([^}]+)\}\}/g);
  if (!matches) return [];
  return Array.from(new Set(matches.map((m) => m.replace(/[\{\}]/g, '').trim())));
}
