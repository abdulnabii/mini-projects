import { GoogleGenerativeAI } from '@google/generative-ai';
import { SentimentResult } from '@/types';

export async function analyzeNewsSentiment(
  ticker: string,
  headlines: string[]
): Promise<SentimentResult> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = `You are a professional financial sentiment analyst.
Analyze these news headlines for ${ticker} and return structured sentiment.

Headlines:
${headlines.map((h, i) => `${i + 1}. "${h}"`).join('\n')}

Return ONLY valid JSON:
{
  "ticker": "${ticker}",
  "sentiment": "bullish" | "bearish" | "neutral",
  "score": number between -1.0 and 1.0,
  "confidence": number between 0.0 and 1.0,
  "rationale": "One sentence explanation",
  "keySignals": ["signal1", "signal2", "signal3"]
}`;

      const result = await model.generateContent(prompt);
      const text = result.response.text().trim().replace(/```json/g, '').replace(/```/g, '');
      return JSON.parse(text);
    } catch (err) {
      console.warn('Gemini API failed, using fallback sentiment:', err);
    }
  }

  // Fallback heuristic sentiment
  const bullishWords = ['record', 'beats', 'growth', 'surge', 'gain', 'high', 'launch', 'expands', 'milestone'];
  const bearishWords = ['lawsuit', 'pressure', 'scrutiny', 'antitrust', 'cut', 'faces', 'decline', 'warning'];

  const allText = headlines.join(' ').toLowerCase();
  const bullishCount = bullishWords.filter((w) => allText.includes(w)).length;
  const bearishCount = bearishWords.filter((w) => allText.includes(w)).length;

  let sentiment: 'bullish' | 'bearish' | 'neutral' = 'neutral';
  let score = 0;
  if (bullishCount > bearishCount + 1) { sentiment = 'bullish'; score = Math.min(0.9, 0.3 + bullishCount * 0.15); }
  else if (bearishCount > bullishCount + 1) { sentiment = 'bearish'; score = Math.max(-0.9, -(0.3 + bearishCount * 0.15)); }

  return {
    ticker,
    sentiment,
    score: Number(score.toFixed(2)),
    confidence: 0.72,
    rationale: `${ticker} shows ${sentiment} signals based on recent headlines with ${bullishCount} positive and ${bearishCount} negative indicators.`,
    keySignals: headlines.slice(0, 3).map((h) => h.split(' ').slice(0, 4).join(' ')),
  };
}
