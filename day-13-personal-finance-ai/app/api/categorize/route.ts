import { NextResponse } from 'next/server';
import { generateFinancialNarrative } from '@/lib/gemini';
import { calculateFinancialSummary, calculateFIREAnalysis, optimizeDebtPayoff } from '@/lib/finance';
import { Debt, Transaction } from '@/types';

export async function POST(req: Request) {
  try {
    const { transactions, debts, cashAssets, investmentAssets } = await req.json();

    const txs: Transaction[] = transactions || [];
    const activeDebts: Debt[] = debts || [
      { id: 'd1', name: 'Chase Sapphire Reserve', balance: 3400, apr: 22.9, minPayment: 110 },
      { id: 'd2', name: 'Federal Student Loan', balance: 14500, apr: 5.5, minPayment: 180 },
    ];

    const summary = calculateFinancialSummary(
      txs,
      cashAssets || 22500,
      investmentAssets || 94000,
      activeDebts.reduce((s, d) => s + d.balance, 0)
    );

    const fire = calculateFIREAnalysis(
      summary.monthlyExpenses * 12,
      investmentAssets || 94000,
      summary.monthlySavings
    );

    const debtOptimization = optimizeDebtPayoff(activeDebts, 400);

    const narrative = await generateFinancialNarrative(summary, fire, debtOptimization);

    return NextResponse.json({
      summary,
      fire,
      debtOptimization,
      narrative,
    });
  } catch (err) {
    console.error('Error generating financial review:', err);
    return NextResponse.json({ error: 'Failed to process financial summary' }, { status: 500 });
  }
}
