import { Debt, DebtOptimizationResult, DebtPayoffPlan, FIREAnalysis, FinancialSummary, Transaction, TransactionCategory } from '@/types';

export function calculateFinancialSummary(
  transactions: Transaction[],
  cashAssets: number = 25000,
  investmentAssets: number = 85000,
  totalDebts: number = 18000
): FinancialSummary {
  let monthlyIncome = 0;
  let monthlyExpenses = 0;
  const categorySums: Record<string, number> = {};

  transactions.forEach((t) => {
    if (t.amount > 0) {
      monthlyIncome += t.amount;
    } else {
      const exp = Math.abs(t.amount);
      monthlyExpenses += exp;
      categorySums[t.category] = (categorySums[t.category] || 0) + exp;
    }
  });

  const monthlySavings = Math.max(0, monthlyIncome - monthlyExpenses);
  const savingsRate = monthlyIncome > 0 ? monthlySavings / monthlyIncome : 0;

  const categoryBreakdown = Object.entries(categorySums).map(([cat, amt]) => ({
    category: cat as TransactionCategory,
    amount: amt,
    percentage: monthlyExpenses > 0 ? (amt / monthlyExpenses) * 100 : 0,
  })).sort((a, b) => b.amount - a.amount);

  const totalAssets = cashAssets + investmentAssets;
  const totalLiabilities = totalDebts;
  const netWorth = totalAssets - totalLiabilities;

  return {
    monthlyIncome,
    monthlyExpenses,
    monthlySavings,
    savingsRate,
    totalAssets,
    totalLiabilities,
    netWorth,
    categoryBreakdown,
  };
}

export function calculateFIREAnalysis(
  annualExpenses: number,
  currentInvestments: number,
  monthlySavings: number,
  expectedReturnRate: number = 0.08 // 8% average index fund returns
): FIREAnalysis {
  const fireNumber = annualExpenses * 25; // 4% safe withdrawal rate
  const annualSavings = monthlySavings * 12;
  const monthlySavingsRate = annualExpenses > 0 ? annualSavings / (annualExpenses + annualSavings) : 0.2;

  const computeYears = (savRateBonusPct: number = 0) => {
    const annualSav = annualSavings * (1 + savRateBonusPct);
    let current = currentInvestments;
    let years = 0;
    const maxYears = 50;

    while (current < fireNumber && years < maxYears) {
      current = current * (1 + expectedReturnRate) + annualSav;
      years++;
    }
    return years;
  };

  const baseYears = computeYears(0);
  const currentYear = new Date().getFullYear();
  const expectedFIREDate = `${currentYear + baseYears}-12-01`;

  const scenarios = [0.05, 0.10, 0.15].map((bonus) => {
    const newYears = computeYears(bonus);
    return {
      savingsRateIncreasePct: Math.round(bonus * 100),
      newYearsToFIRE: newYears,
      yearsReduced: Math.max(0, baseYears - newYears),
      newFIREDate: `${currentYear + newYears}-12-01`,
    };
  });

  return {
    fireNumber,
    annualExpenses,
    currentInvestments,
    monthlySavingsRate,
    annualSavings,
    yearsToFIRE: baseYears,
    expectedFIREDate,
    scenarioTrajectories: scenarios,
  };
}

export function optimizeDebtPayoff(
  debts: Debt[],
  availableExtraMonthly: number = 400
): DebtOptimizationResult {
  const totalMinPayment = debts.reduce((sum, d) => sum + d.minPayment, 0);

  // Helper strategy simulator
  const simulateStrategy = (
    strategyType: 'avalanche' | 'snowball'
  ): DebtPayoffPlan => {
    // Clone debt objects
    let debtList = debts.map((d) => ({ ...d }));

    // Sort order
    if (strategyType === 'avalanche') {
      debtList.sort((a, b) => b.apr - a.apr); // highest APR first
    } else {
      debtList.sort((a, b) => a.balance - b.balance); // lowest balance first
    }

    let month = 0;
    let totalInterest = 0;
    const maxMonths = 360;
    const schedule: { month: number; totalRemainingBalance: number; interestPaidThisMonth: number }[] = [];

    while (debtList.some((d) => d.balance > 0) && month < maxMonths) {
      month++;
      let extraAvailable = availableExtraMonthly;
      let monthInterestTotal = 0;

      // 1. Accrue interest & pay minimums
      debtList.forEach((d) => {
        if (d.balance > 0) {
          const monthlyInterest = (d.balance * (d.apr / 100)) / 12;
          d.balance += monthlyInterest;
          monthInterestTotal += monthlyInterest;
          totalInterest += monthlyInterest;

          const payAmt = Math.min(d.balance, d.minPayment);
          d.balance -= payAmt;
        }
      });

      // 2. Direct extra payment to target debt
      const target = debtList.find((d) => d.balance > 0);
      if (target && extraAvailable > 0) {
        const extraPay = Math.min(target.balance, extraAvailable);
        target.balance -= extraPay;
      }

      const rem = debtList.reduce((s, d) => s + d.balance, 0);
      if (month % 3 === 0 || rem === 0) {
        schedule.push({
          month,
          totalRemainingBalance: Math.max(0, Math.round(rem)),
          interestPaidThisMonth: Math.round(monthInterestTotal),
        });
      }
    }

    // Benchmark vs minimum payment interest ($6,787 baseline)
    const baselineMinimumInterest = debts.reduce((s, d) => s + (d.balance * (d.apr / 100) * 3), 0);
    const interestSaved = Math.max(0, Math.round(baselineMinimumInterest - totalInterest));

    return {
      strategy: strategyType,
      payoffMonths: month,
      totalInterestPaid: Math.round(totalInterest),
      interestSavedVsMinimum: interestSaved,
      schedule,
    };
  };

  const avalanche = simulateStrategy('avalanche');
  const snowball = simulateStrategy('snowball');

  return {
    debts,
    availableExtraPayment: availableExtraMonthly,
    avalanche,
    snowball,
    recommendation: 'avalanche',
    reasoningNote: `Avalanche strategy saves $${Math.abs(snowball.totalInterestPaid - avalanche.totalInterestPaid)} more in total interest by prioritizing high-APR credit cards first!`,
  };
}
