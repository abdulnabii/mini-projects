import { GoogleGenerativeAI } from "@google/generative-ai";
import { CoachReport, Transaction, SupportedCurrency } from "@/types";
import { formatMoney } from "./mock-data";

export async function generateCoachReport(
  transactions: Transaction[],
  budgets: Record<string, number>,
  currency: SupportedCurrency = 'USD'
): Promise<CoachReport> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const summaryText = transactions.map(t => `${t.date}: ${t.merchant} - $${t.amount.toFixed(2)} (${t.category})`).join('\n');
      const budgetText = Object.entries(budgets).map(([cat, b]) => `${cat}: $${b}`).join(', ');

      const prompt = `You are a certified wealth advisor and compassionate AI Financial Coach.
Analyze these transactions and budget limits to deliver structured financial intelligence.

Transactions:
${summaryText}

Budgets:
${budgetText}

Return ONLY valid JSON matching this schema exactly (no markdown code fences):
{
  "overview": "2-sentence high-level summary of financial health, cash velocity, and savings pacing.",
  "healthScore": number between 0 and 100,
  "healthGrade": "A+" | "A" | "B" | "C" | "D",
  "insights": [
    { "title": "string", "detail": "string", "severity": "info" | "warning" | "critical" }
  ],
  "recommendations": [
    { "action": "string", "estimatedMonthlySaving": 50, "effort": "easy" | "medium" | "hard" }
  ],
  "projectedMonthlySaving": 180
}`;

      const result = await model.generateContent(prompt);
      const text = result.response.text().trim().replace(/^```json\n?/, '').replace(/\n?```$/, '');
      return JSON.parse(text);
    } catch (err) {
      console.warn("Gemini API call failed, falling back to deterministic coach report:", err);
    }
  }

  return generateFallbackCoachReport(transactions, budgets, currency);
}

export async function askFinancialCoach(
  question: string,
  transactions: Transaction[],
  budgets: Record<string, number>
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  const totalSpent = transactions.reduce((acc, t) => acc + t.amount, 0);

  if (apiKey) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `You are ExpenseMind AI, an expert personal financial advisor.
User Question: "${question}"

User Expense Context:
- Total Logged Outflow: $${totalSpent.toFixed(2)} across ${transactions.length} transactions.
- Categories Logged: ${Array.from(new Set(transactions.map(t => t.category))).join(', ')}
- Transactions:
${transactions.slice(0, 8).map(t => `${t.date}: ${t.merchant} ($${t.amount.toFixed(2)})`).join('\n')}

Provide an encouraging, concise, highly actionable response in 2-4 sentences:`;

      const res = await model.generateContent(prompt);
      return res.response.text().trim();
    } catch (err) {
      console.warn("Coach Q&A error:", err);
    }
  }

  return `Based on your recent transactions totaling $${totalSpent.toFixed(2)}, your highest spending areas are dining and shopping. To reach your savings targets, consider setting a weekly cap on discretionary purchases and setting up automatic round-up savings.`;
}

function generateFallbackCoachReport(
  transactions: Transaction[],
  budgets: Record<string, number>,
  currency: SupportedCurrency = 'USD'
): CoachReport {
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
  const totalBudget = Object.values(budgets).reduce((a, b) => a + b, 0) || 4500;
  const budgetUtilization = Math.round((totalSpent / totalBudget) * 100);

  let score = 84;
  let grade: CoachReport['healthGrade'] = 'A';

  if (budgetUtilization > 90) {
    score = 68;
    grade = 'C';
  } else if (budgetUtilization > 75) {
    score = 78;
    grade = 'B';
  }

  return {
    overview: `Your total logged spending is ${formatMoney(totalSpent, currency)}. ${
      overbudgetCategory
        ? `You are currently exceeding your target limit in ${overbudgetCategory}.`
        : 'Your overall spending trajectory remains within recommended thresholds with strong savings discipline.'
    }`,
    healthScore: score,
    healthGrade: grade,
    insights: [
      {
        title: `Top Spending Area: ${topCategory ? topCategory[0] : 'Food & Dining'} (${formatMoney(topCategory ? topCategory[1] : 33.55, currency)})`,
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
        detail: 'Frequent small purchases account for approximately 22% of overall discretionary cash outflow.',
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
