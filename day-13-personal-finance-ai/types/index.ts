export type Currency = 'USD' | 'EUR' | 'GBP' | 'PKR' | 'INR' | 'CAD';

export type TransactionCategory =
  | 'Income'
  | 'Housing'
  | 'Groceries'
  | 'Dining'
  | 'Transport'
  | 'Utilities'
  | 'Healthcare'
  | 'Entertainment'
  | 'Shopping'
  | 'Subscriptions'
  | 'Investments'
  | 'Debt Payment'
  | 'Other';

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number; // positive for income, negative for expense
  category: TransactionCategory;
  isFixed: boolean; // e.g. Rent, Subscriptions vs. Dining out
}

export interface Debt {
  id: string;
  name: string;
  balance: number;
  apr: number; // e.g. 22.9
  minPayment: number;
}

export interface DebtPayoffPlan {
  strategy: 'avalanche' | 'snowball';
  payoffMonths: number;
  totalInterestPaid: number;
  interestSavedVsMinimum: number;
  schedule: {
    month: number;
    totalRemainingBalance: number;
    interestPaidThisMonth: number;
    targetDebtName?: string;
  }[];
}

export interface DebtOptimizationResult {
  debts: Debt[];
  availableExtraPayment: number;
  avalanche: DebtPayoffPlan;
  snowball: DebtPayoffPlan;
  recommendation: 'avalanche' | 'snowball';
  reasoningNote: string;
}

export interface FIREAnalysis {
  fireNumber: number; // 25 * annual expenses (Traditional 4% rule)
  leanFIRENumber: number; // 75% of expenses
  fatFIRENumber: number; // 140% of expenses
  coastFIRENumber: number; // Required today to hit retirement age without new contributions
  annualExpenses: number;
  currentInvestments: number;
  monthlySavingsRate: number; // 0.0 to 1.0
  annualSavings: number;
  yearsToFIRE: number;
  expectedFIREDate: string;
  progressPercent: number;
  scenarioTrajectories: {
    savingsRateIncreasePct: number; // e.g. +5%
    newYearsToFIRE: number;
    yearsReduced: number;
    newFIREDate: string;
  }[];
}

export interface FinancialHealthGrade {
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  headline: string;
  summaryParagraphs: string[];
  urgentActions: { title: string; detail: string; priority: 'HIGH' | 'MEDIUM' | 'LOW' }[];
  burnRateMonths: number; // emergency fund runway in months
  savingsScore: number; // 0-100
  debtScore: number; // 0-100
  diversificationScore: number; // 0-100
}

export interface FinancialSummary {
  monthlyIncome: number;
  monthlyExpenses: number;
  monthlySavings: number;
  savingsRate: number;
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  cashAssets: number;
  investmentAssets: number;
  realEstateAssets?: number;
  categoryBreakdown: { category: TransactionCategory; amount: number; percentage: number }[];
  monthlyForecast: { month: string; projectedNetWorth: number; projectedSavings: number }[];
}
