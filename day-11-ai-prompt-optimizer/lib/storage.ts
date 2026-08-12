import { OptimizationResult, PresetPrompt } from '@/types';

const HISTORY_KEY = 'promptcraft_history_v1';

export const PRESET_PROMPTS: PresetPrompt[] = [
  {
    id: 'preset-code-auditor',
    title: 'Security Code Auditor & Refactoring',
    category: 'DevTools & Code',
    targetModel: 'Gemini 1.5 Pro/Flash',
    description: 'Finds security vulnerabilities, memory leaks, and performance bottlenecks in code snippets.',
    rawPrompt: 'Review this code snippet for vulnerabilities and fix them: {{code_snippet}}',
  },
  {
    id: 'preset-copywriting',
    title: 'SaaS Landing Page Copywriter',
    category: 'Marketing & Copy',
    targetModel: 'Claude 3.5 Sonnet',
    description: 'Generates high-converting hero headlines, subheaders, value propositions, and CTA buttons.',
    rawPrompt: 'Write landing page copy for a SaaS product called {{product_name}} targeting {{target_audience}}',
  },
  {
    id: 'preset-system-architect',
    title: 'Cloud System Architecture Plan',
    category: 'System Design',
    targetModel: 'GPT-4o / GPT-4',
    description: 'Designs scalable serverless microservices architectures with DB schemas and caching strategies.',
    rawPrompt: 'Create a scalable AWS system architecture for {{app_type}} supporting {{user_scale}} daily active users.',
  },
  {
    id: 'preset-midjourney',
    title: 'Midjourney Photorealistic Art Prompt',
    category: 'Generative Media',
    targetModel: 'Midjourney v6',
    description: 'Optimizes raw ideas into 8K cinematic, lighting-focused Midjourney visual prompts.',
    rawPrompt: 'Cyberpunk samurai standing in neon rain in futuristic Tokyo, octane render 8k --ar 16:9',
  },
  {
    id: 'preset-data-extractor',
    title: 'Structured JSON Data Extractor',
    category: 'Data Science',
    targetModel: 'Gemini 1.5 Pro/Flash',
    description: 'Extracts entities, dates, financial figures, and sentiment into validated JSON format.',
    rawPrompt: 'Extract all dates, invoice numbers, company names, and total amounts from this text: {{raw_text}}',
  },
  {
    id: 'preset-medical-guardrail',
    title: 'Clinical Triage & Patient Safety',
    category: 'Healthcare & Safety',
    targetModel: 'Claude 3.5 Sonnet',
    description: 'Strict medical advice disclaimers with evidence-based symptom triage formatting.',
    rawPrompt: 'Explain the potential causes of {{symptoms}} and recommend next steps without diagnosing.',
  },
];

export function getPromptHistory(): OptimizationResult[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Error reading prompt history:', e);
    return [];
  }
}

export function saveOptimizationToHistory(result: OptimizationResult): OptimizationResult[] {
  if (typeof window === 'undefined') return [];
  try {
    const history = getPromptHistory();
    const updated = [result, ...history.filter((h) => h.id !== result.id)].slice(0, 20);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Error saving prompt history:', e);
    return [];
  }
}

export function deleteOptimizationFromHistory(id: string): OptimizationResult[] {
  if (typeof window === 'undefined') return [];
  try {
    const history = getPromptHistory();
    const updated = history.filter((h) => h.id !== id);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Error deleting prompt history:', e);
    return [];
  }
}
