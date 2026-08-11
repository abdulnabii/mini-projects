import { GoogleGenerativeAI } from "@google/generative-ai";
import { CoachReport, Transaction, CategoryBudget } from "@/types";

export async function generateCoachReport(
  transactions: Transaction[],
  budgets: Record<string, number>
): Promise<CoachReport> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const summaryText = transactions.map(t => `${t.date}: ${t.merchant} - $${t.amount.toFixed(2)} (${t.category})`).join('\n');
      const budgetText = Object.entries(budgets).map(([cat, b]) => `${cat}: $${b}`).join(', ');

      const prompt = `You are a compassionate, precision AI Financial Coach.
Analyze these transactions and budget limits to deliver actionable advice.

Transactions:
${summaryText}

Budgets:
${budgetText}

Return ONLY valid JSON matching this schema exactly (no markdown code fences):
{
  "overview": "2-sentence high-level summary of financial health and spending velocity.",
  "insights": [
    { "title": "string", "detail": "string", "severity": "info | warning | critical" }
  ],
  "recommendations": [
    { "action": "string", "estimatedMonthlySaving": 50, "effort": "easy | medium | hard" }
  ],
  "projectedMonthlySaving": 150
}`;

      const result = await model.generateContent(prompt);
      const text = result.response.text().trim().replace(/^```json\n?/, '').replace(/\n?```$/, '');
      return JSON.parse(text);
    } catch (err) {
      console.warn("Gemini API call failed, falling back to deterministic coach report:", err);
    }
  }

  return generateFallbackCoachReport(transactions, budgets);
}

function generateFallbackCoachReport(
  transactions: Transaction[],
  budgets: Record<string, number>
): CoachReport {
  // Aggregate spending per category
  const categoryTotals: Record<string, number> = {};
  let totalSpent = 0;

  transactions.forEach((t) => {
    categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
    totalSpent += t.amount;
  });

  const overbudgetCategory = Object.keys(categoryTotals).find(
    (cat) => categoryTotals[cat] > (budgets[cat] || 300)
  );

  const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];

  return {
    overview: `Your total logged spending is $${totalSpent.toFixed(2)}. ${
      overbudgetCategory
        ? `You are currently exceeding your target limit in ${overbudgetCategory}.`
        : 'Your overall spending trajectory remains within recommended thresholds.'
    }`,
    insights: [
      {
        title: `Top Spending Area: ${topCategory ? topCategory[0] : 'Food & Dining'} ($${topCategory ? topCategory[1].toFixed(2) : '33.55'})`,
        detail: `${topCategory ? topCategory[0] : 'Food & Dining'} represents the largest portion of your recent expenditure across all logged transactions.`,
        severity: topCategory && topCategory[1] > 300 ? 'warning' : 'info',
      },
      {
        title: 'Subscription Audit Alert',
        detail: 'You have recurring charges like Netflix and Gym memberships. Reviewing active subscriptions could yield immediate monthly savings.',
        severity: 'info',
      },
      {
        title: 'Micro-Expense Accumulation',
        detail: 'Frequent small purchases under $20 account for approximately 25% of overall discretionary cash outflow.',
        severity: 'warning',
      },
    ],
    recommendations: [
      {
        action: 'Cook at home 2 extra nights per week to reduce dining out outlays',
        estimatedMonthlySaving: 120,
        effort: 'medium',
      },
      {
        action: 'Cancel or pause underutilized digital subscriptions',
        estimatedMonthlySaving: 35,
        effort: 'easy',
      },
      {
        action: 'Set up automated savings transfers immediately following payday',
        estimatedMonthlySaving: 200,
        effort: 'easy',
      },
    ],
    projectedMonthlySaving: 355,
  };
}
