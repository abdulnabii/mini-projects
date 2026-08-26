import {
  Debt,
  DebtOptimizationResult,
  DebtPayoffPlan,
  FIREAnalysis,
  FinancialSummary,
  Transaction,
  TransactionCategory,
} from '@/types';

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

  const categoryBreakdown = Object.entries(categorySums)
    .map(([cat, amt]) => ({
      category: cat as TransactionCategory,
      amount: amt,
      percentage: monthlyExpenses > 0 ? (amt / monthlyExpenses) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  const totalAssets = cashAssets + investmentAssets;
  const totalLiabilities = totalDebts;
  const netWorth = totalAssets - totalLiabilities;

  // 12-Month Forward Forecast (Compound Growth + Monthly Additions)
  const monthlyForecast = [];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonthIdx = new Date().getMonth();

  let projectedNW = netWorth;
  let accumulatedSavings = 0;
  const monthlyGrowthRate = Math.pow(1 + 0.08, 1 / 12) - 1; // 8% annualized

  for (let i = 1; i <= 12; i++) {
    const monthLabel = monthNames[(currentMonthIdx + i) % 12];
    projectedNW = (projectedNW + monthlySavings) * (1 + monthlyGrowthRate);
    accumulatedSavings += monthlySavings;

    monthlyForecast.push({
      month: monthLabel,
      projectedNetWorth: Math.round(projectedNW),
      projectedSavings: Math.round(accumulatedSavings),
    });
  }

  return {
    monthlyIncome,
    monthlyExpenses,
    monthlySavings,
    savingsRate,
    totalAssets,
    totalLiabilities,
    netWorth,
    cashAssets,
    investmentAssets,
    categoryBreakdown,
    monthlyForecast,
  };
}

export function calculateFIREAnalysis(
  annualExpenses: number,
  currentInvestments: number,
  monthlySavings: number,
  expectedReturnRate: number = 0.08 // 8% average index fund returns
): FIREAnalysis {
  // Safe withdrawal rate formulas
  const fireNumber = Math.round(annualExpenses * 25); // Traditional (4% SWR)
  const leanFIRENumber = Math.round(annualExpenses * 0.75 * 25); // Lean FIRE (75% expenses)
  const fatFIRENumber = Math.round(annualExpenses * 1.4 * 25); // Fat FIRE (140% expenses)

  // Coast FIRE: Required now at 8% compounding assuming 20 years to retirement age
  const yearsToRetireAge = 20;
  const coastFIRENumber = Math.round(fireNumber / Math.pow(1 + expectedReturnRate, yearsToRetireAge));

  const annualSavings = monthlySavings * 12;
  const monthlySavingsRate =
    annualExpenses + annualSavings > 0 ? annualSavings / (annualExpenses + annualSavings) : 0.25;

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
  const progressPercent = Math.min(100, Math.round((currentInvestments / Math.max(1, fireNumber)) * 100));

  const scenarios = [0.05, 0.1, 0.15].map((bonus) => {
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
    leanFIRENumber,
    fatFIRENumber,
    coastFIRENumber,
    annualExpenses,
    currentInvestments,
    monthlySavingsRate,
    annualSavings,
    yearsToFIRE: baseYears,
    expectedFIREDate,
    progressPercent,
    scenarioTrajectories: scenarios,
  };
}

export function optimizeDebtPayoff(
  debts: Debt[],
  availableExtraMonthly: number = 400
): DebtOptimizationResult {
  const simulateStrategy = (strategyType: 'avalanche' | 'snowball'): DebtPayoffPlan => {
    const debtList = debts.map((d) => ({ ...d }));

    if (strategyType === 'avalanche') {
      debtList.sort((a, b) => b.apr - a.apr); // highest APR first
    } else {
      debtList.sort((a, b) => a.balance - b.balance); // lowest balance first
    }

    let month = 0;
    let totalInterest = 0;
    const maxMonths = 360;
    const schedule: DebtPayoffPlan['schedule'] = [];

    while (debtList.some((d) => d.balance > 0) && month < maxMonths) {
      month++;
      let extraAvailable = availableExtraMonthly;
      let monthInterestTotal = 0;

      // 1. Accrue monthly interest & pay minimums
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
          targetDebtName: target?.name || 'All Paid Off!',
        });
      }
    }

    // Baseline minimum-only interest estimate
    const baselineMinimumInterest = debts.reduce(
      (s, d) => s + d.balance * (d.apr / 100) * 3,
      0
    );
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
    reasoningNote: `Avalanche saves $${Math.abs(
      snowball.totalInterestPaid - avalanche.totalInterestPaid
    ).toLocaleString()} more in total interest by prioritizing high-APR balances first!`,
  };
}
