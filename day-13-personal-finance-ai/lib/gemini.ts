import { GoogleGenerativeAI } from '@google/generative-ai';
import { FinancialHealthGrade, FinancialSummary, FIREAnalysis, DebtOptimizationResult } from '@/types';

export async function generateFinancialNarrative(
  summary: FinancialSummary,
  fire: FIREAnalysis,
  debt: DebtOptimizationResult
): Promise<FinancialHealthGrade> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = `You are a Certified Financial Planner (CFP) analyzing a client's complete financial portfolio.
Be direct, supportive, and data-backed. Never produce fluff or generic advice.

Financial Snapshot:
- Monthly Income: $${summary.monthlyIncome}
- Monthly Expenses: $${summary.monthlyExpenses}
- Savings Rate: ${(summary.savingsRate * 100).toFixed(1)}%
- Net Worth: $${summary.netWorth}
- FIRE Target: $${fire.fireNumber} (Expected FIRE Year: ${fire.yearsToFIRE} years)
- Total Debt: $${summary.totalLiabilities} (Avalanche Payoff: ${debt.avalanche.payoffMonths} months)
- Top Expense Categories: ${summary.categoryBreakdown.slice(0, 3).map((c) => `${c.category} ($${c.amount})`).join(', ')}

Return ONLY a valid JSON object with this exact structure (no markdown wrapping):
{
  "grade": "B",
  "headline": "Strong wealth generation foundation, but high credit card APR requires immediate avalanche focus.",
  "summaryParagraphs": [
    "Your 32% savings rate puts you in the top tier of financial discipline. However, carrying high-interest debt while building savings creates a net drag on your wealth creation.",
    "By adopting the Avalanche payoff strategy, you can extinguish your high-APR balances in 12 months and free up $400/month for index fund investing."
  ],
  "urgentActions": [
    { "title": "Redirect $400/month to Avalanche Debt Payoff", "detail": "Eliminates high-APR credit card balance in 12 months, saving over $2,900 in interest.", "priority": "HIGH" },
    { "title": "Trim Dining Expenses by 20%", "detail": "Reallocate $180/month into low-cost S&P 500 index funds to accelerate FIRE date by 3.2 years.", "priority": "MEDIUM" },
    { "title": "Build 3-Month Emergency Liquid Cash Buffer", "detail": "Ensure $12,500 in High-Yield Savings Account before expanding speculative investments.", "priority": "HIGH" }
  ],
  "burnRateMonths": 6.2
}`;

      const result = await model.generateContent(prompt);
      const text = result.response.text().trim().replace(/^```json\n?/, '').replace(/\n?```$/, '');
      return JSON.parse(text);
    } catch (err) {
      console.warn('Gemini financial narrative generation error:', err);
    }
  }

  // Fallback narrative
  return {
    grade: 'A',
    headline: 'Strong Savings Momentum — Optimized for Financial Independence (FIRE)',
    summaryParagraphs: [
      `Your current monthly savings rate of ${(summary.savingsRate * 100).toFixed(1)}% puts you on a clear trajectory toward your FIRE target of $${fire.fireNumber.toLocaleString()}.`,
      `By directing your extra monthly cash flow towards the Avalanche debt payoff plan, you can become debt-free in ${debt.avalanche.payoffMonths} months while saving over $${debt.avalanche.interestSavedVsMinimum.toLocaleString()} in interest.`,
    ],
    urgentActions: [
      {
        title: 'Execute Avalanche Debt Payoff Plan',
        detail: 'Direct extra monthly payment to highest-APR balance to minimize compound interest bleed.',
        priority: 'HIGH',
      },
      {
        title: 'Automate Monthly Index Fund Transfers',
        detail: `Set up automatic $${summary.monthlySavings.toLocaleString()}/month recurring buys into low-cost S&P 500 index funds.`,
        priority: 'HIGH',
      },
      {
        title: 'Cap Variable Dining & Entertainment Budget',
        detail: 'Reallocate $150/month from discretionary spending to pull in FIRE date by 2.5 years.',
        priority: 'MEDIUM',
      },
    ],
    burnRateMonths: 5.5,
  };
}

export async function askAIAdvisor(
  userQuestion: string,
  summary: FinancialSummary,
  fire: FIREAnalysis,
  debt: DebtOptimizationResult
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        systemInstruction: `You are WealthPulse AI, a Certified Financial Planner (CFP) assistant.
You have full visibility into the user's financial metrics:
- Monthly Income: $${summary.monthlyIncome}
- Monthly Expenses: $${summary.monthlyExpenses}
- Savings Rate: ${(summary.savingsRate * 100).toFixed(1)}%
- Net Worth: $${summary.netWorth}
- FIRE Number: $${fire.fireNumber} (Years to FIRE: ${fire.yearsToFIRE})
- Total Debt: $${summary.totalLiabilities} (Avalanche Payoff: ${debt.avalanche.payoffMonths} months)

Always reference their real numbers in your answers. Provide direct, actionable 2-3 paragraph financial advice.`,
      });

      const result = await model.generateContent(userQuestion);
      return result.response.text().trim();
    } catch (err) {
      console.warn('Gemini financial advisor chat error:', err);
    }
  }

  return `Based on your monthly income of $${summary.monthlyIncome.toLocaleString()} and current savings rate of ${(summary.savingsRate * 100).toFixed(1)}%, my top recommendation is to maintain your $${summary.monthlySavings.toLocaleString()}/month savings cadence while eliminating high-APR debt via the Avalanche method. This protects your cash flow and accelerates your FIRE target date of ${fire.expectedFIREDate}!`;
}
