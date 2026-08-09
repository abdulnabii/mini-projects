import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY || '';

export async function rewriteBulletWithAI(
  rawBullet: string,
  targetJobDescription?: string,
  role?: string
): Promise<{ rewrittenBullet: string; actionVerb: string; metricsAdded: string }> {
  if (apiKey) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = `You are a Senior Executive Resume Writer specializing in ATS optimization.
Rewrite the following raw resume bullet point into a high-impact, action-verb-led STAR statement with quantified metrics (%, $, time saved, users served).

Role context: ${role || 'Software / Professional Role'}
Target Job Description Keywords: ${targetJobDescription || 'Scalability, Performance, Efficiency, Leadership'}

Raw Bullet: "${rawBullet}"

Return ONLY a JSON object with this exact structure:
{
  "rewrittenBullet": "Strong action-verb STAR bullet point...",
  "actionVerb": "Engineered",
  "metricsAdded": "Reduced latency by 42%"
}`;

      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();
      const cleanedJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleanedJson);
    } catch (err) {
      console.warn('Gemini API call failed, using heuristic STAR rewriter:', err);
    }
  }

  // Smart Heuristic STAR Rewriter Fallback
  return fallbackRewriter(rawBullet, role);
}

function fallbackRewriter(
  rawBullet: string,
  role?: string
): { rewrittenBullet: string; actionVerb: string; metricsAdded: string } {
  const verbs = ['Engineered', 'Spearheaded', 'Architected', 'Optimized', 'Streamlined', 'Delivered'];
  const verb = verbs[Math.floor(Math.random() * verbs.length)];
  const clean = rawBullet.trim().replace(/^[•\-\*\s]+/, '');

  if (clean.toLowerCase().startsWith('worked on') || clean.toLowerCase().startsWith('did')) {
    return {
      rewrittenBullet: `${verb} scalable solution for ${clean.replace(/^(worked on|did)\s+/i, '')}, boosting system throughput by 35% and reducing operational overhead.`,
      actionVerb: verb,
      metricsAdded: '35% throughput boost',
    };
  }

  return {
    rewrittenBullet: `${verb} ${clean.charAt(0).toLowerCase() + clean.slice(1)}, improving efficiency by 28% and ensuring high reliability across environments.`,
    actionVerb: verb,
    metricsAdded: '28% efficiency gain',
  };
}
