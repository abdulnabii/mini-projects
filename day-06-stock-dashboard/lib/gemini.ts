import { GoogleGenerativeAI } from '@google/generative-ai';
import { SentimentResult } from '@/types';
import { getCurrentPrices } from './mock-prices';

export async function analyzeNewsSentiment(
  ticker: string,
  headlines: string[]
): Promise<SentimentResult> {
  const currentPrice = getCurrentPrices()[ticker] || 200;
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = `You are a Wall Street quantitative analyst and financial sentiment model.
Analyze the following catalyst headlines for ${ticker} (Current Price: $${currentPrice.toFixed(2)}) and generate technical & sentiment intelligence.

Headlines:
${headlines.map((h, i) => `${i + 1}. "${h}"`).join('\n')}

Return ONLY valid JSON matching this schema (no markdown fences):
{
  "ticker": "${ticker}",
  "sentiment": "bullish" | "bearish" | "neutral",
  "tradeSignal": "STRONG BUY" | "ACCUMULATE" | "HOLD" | "TAKE PROFIT" | "STRONG SELL",
  "score": number between -1.0 and 1.0,
  "confidence": number between 0.0 and 1.0,
  "supportLevel": number (support price near $${(currentPrice * 0.96).toFixed(2)}),
  "resistanceLevel": number (resistance price near $${(currentPrice * 1.05).toFixed(2)}),
  "rationale": "2 sentence institutional trading rationale",
  "keySignals": ["signal 1", "signal 2", "signal 3"]
}`;

      const result = await model.generateContent(prompt);
      const text = result.response.text().trim().replace(/```json/g, '').replace(/```/g, '');
      return JSON.parse(text);
    } catch (err) {
      console.warn('Gemini API failed, using procedural intelligence engine:', err);
    }
  }

  // Fallback heuristic sentiment & technical levels
  const bullishWords = ['record', 'beats', 'growth', 'surge', 'gain', 'high', 'launch', 'expands', 'milestone', 'inflows'];
  const bearishWords = ['lawsuit', 'pressure', 'scrutiny', 'antitrust', 'cut', 'faces', 'decline', 'warning'];

  const allText = headlines.join(' ').toLowerCase();
  const bullishCount = bullishWords.filter((w) => allText.includes(w)).length;
  const bearishCount = bearishWords.filter((w) => allText.includes(w)).length;

  let sentiment: 'bullish' | 'bearish' | 'neutral' = 'neutral';
  let tradeSignal: SentimentResult['tradeSignal'] = 'HOLD';
  let score = 0.15;

  if (bullishCount > bearishCount + 1) {
    sentiment = 'bullish';
    tradeSignal = bullishCount >= 3 ? 'STRONG BUY' : 'ACCUMULATE';
    score = Math.min(0.92, 0.45 + bullishCount * 0.12);
  } else if (bearishCount > bullishCount + 1) {
    sentiment = 'bearish';
    tradeSignal = bearishCount >= 3 ? 'STRONG SELL' : 'TAKE PROFIT';
    score = Math.max(-0.88, -(0.4 + bearishCount * 0.12));
  }

  return {
    ticker,
    sentiment,
    tradeSignal,
    score: Number(score.toFixed(2)),
    confidence: 0.88,
    supportLevel: Number((currentPrice * 0.955).toFixed(2)),
    resistanceLevel: Number((currentPrice * 1.045).toFixed(2)),
    rationale: `${ticker} presents strong institutional momentum driven by recent earnings beats and secular AI catalyst expansion. Upside resistance is targeted at $${(currentPrice * 1.045).toFixed(2)}.`,
    keySignals: headlines.slice(0, 3).map((h) => h.split(' ').slice(0, 5).join(' ') + '...'),
  };
}
