import { Currency, Debt, Transaction } from '@/types';

export function formatCurrency(amount: number, currency: Currency = 'USD'): string {
  const symbols: Record<Currency, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    PKR: 'Rs. ',
    INR: '₹',
    CAD: 'CA$',
  };

  const symbol = symbols[currency] || '$';
  return `${symbol}${Math.round(amount).toLocaleString()}`;
}

export const DEMO_PRESETS: {
  name: string;
  bank: string;
  currency: Currency;
  description: string;
  transactions: Transaction[];
  debts: Debt[];
  cashAssets: number;
  investmentAssets: number;
}[] = [
  {
    name: 'Silicon Valley Senior Tech Lead (USD)',
    bank: 'Chase Premier & Morgan Stanley',
    currency: 'USD',
    description: 'Income $14,500/mo, 48% Savings Rate, Vanguard Index Funds & High-APR Card',
    cashAssets: 35000,
    investmentAssets: 185000,
    debts: [
      { id: 'd1', name: 'Chase Sapphire Reserve', balance: 5400, apr: 22.9, minPayment: 160 },
      { id: 'd2', name: 'Federal Student Loan', balance: 22000, apr: 5.4, minPayment: 240 },
      { id: 'd3', name: 'Tesla Model Y Auto Loan', balance: 14200, apr: 6.8, minPayment: 380 },
    ],
    transactions: [
      { id: 't1', date: '2026-08-01', description: 'Google Payroll Direct Deposit', amount: 14500, category: 'Income', isFixed: true },
      { id: 't2', date: '2026-08-02', description: 'San Francisco Apartment Rent', amount: -3600, category: 'Housing', isFixed: true },
      { id: 't3', date: '2026-08-03', description: 'Whole Foods Market Organic Groceries', amount: -750, category: 'Groceries', isFixed: false },
      { id: 't4', date: '2026-08-05', description: 'Vanguard VOO / VTI ETF Auto-Invest', amount: -4500, category: 'Investments', isFixed: true },
      { id: 't5', date: '2026-08-07', description: 'Michelin Star Dining & Weekend Social', amount: -680, category: 'Dining', isFixed: false },
      { id: 't6', date: '2026-08-10', description: 'PG&E Power, Water & Utilities', amount: -280, category: 'Utilities', isFixed: true },
      { id: 't7', date: '2026-08-12', description: 'ChatGPT Plus, Spotify & Fiber Internet', amount: -145, category: 'Subscriptions', isFixed: true },
      { id: 't8', date: '2026-08-14', description: 'Equinox Gym Monthly Pass', amount: -290, category: 'Healthcare', isFixed: true },
      { id: 't9', date: '2026-08-15', description: 'Uber Rides & Supercharging', amount: -320, category: 'Transport', isFixed: false },
      { id: 't10', date: '2026-08-18', description: 'Blue Bottle Coffee & Snacks', amount: -180, category: 'Dining', isFixed: false },
    ],
  },
  {
    name: 'Executive Tech Director (PKR)',
    bank: 'Meezan Bank & Standard Chartered',
    currency: 'PKR',
    description: 'Income Rs. 850,000/mo, Mutual Fund Portfolio & Auto Financing',
    cashAssets: 2800000,
    investmentAssets: 14500000,
    debts: [
      { id: 'dp1', name: 'Auto Financing (Civic RS)', balance: 1450000, apr: 15.2, minPayment: 48000 },
      { id: 'dp2', name: 'SCB World MasterCard', balance: 280000, apr: 24.0, minPayment: 25000 },
    ],
    transactions: [
      { id: 'tp1', date: '2026-08-01', description: 'Executive Director Monthly Salary', amount: 850000, category: 'Income', isFixed: true },
      { id: 'tp2', date: '2026-08-01', description: 'DHA Phase 6 Villa Mortgage Installment', amount: -220000, category: 'Housing', isFixed: true },
      { id: 'tp3', date: '2026-08-03', description: 'Al-Fatah & Carrefour Bulk Supplies', amount: -75000, category: 'Groceries', isFixed: false },
      { id: 'tp4', date: '2026-08-05', description: 'Meezan Islamic Sovereign Fund Auto-Invest', amount: -250000, category: 'Investments', isFixed: true },
      { id: 'tp5', date: '2026-08-08', description: 'Shell Petrol & Vehicle Care', amount: -32000, category: 'Transport', isFixed: true },
      { id: 'tp6', date: '2026-08-12', description: 'Kolachi & Aylanto Fine Dining', amount: -45000, category: 'Dining', isFixed: false },
      { id: 'tp7', date: '2026-08-15', description: 'K-Electric & StormFiber Utilities', amount: -38000, category: 'Utilities', isFixed: true },
    ],
  },
  {
    name: 'London Product Manager (GBP)',
    bank: 'Monzo & Barclays Premier',
    currency: 'GBP',
    description: 'Income £6,800/mo, Vanguard LifeStrategy 80%, Student Debt',
    cashAssets: 18500,
    investmentAssets: 78000,
    debts: [
      { id: 'dg1', name: 'Plan 2 Student Loan', balance: 18500, apr: 6.9, minPayment: 195 },
      { id: 'dg2', name: 'Amex Gold Preferred', balance: 1800, apr: 28.2, minPayment: 90 },
    ],
    transactions: [
      { id: 'tg1', date: '2026-08-01', description: 'Fintech PM Monthly Salary', amount: 6800, category: 'Income', isFixed: true },
      { id: 'tg2', date: '2026-08-01', description: 'Canary Wharf Flat Rent', amount: -2100, category: 'Housing', isFixed: true },
      { id: 'tg3', date: '2026-08-03', description: 'Waitrose & M&S Food Shopping', amount: -480, category: 'Groceries', isFixed: false },
      { id: 'tg4', date: '2026-08-05', description: 'Vanguard ISA Index Auto-Deposit', amount: -1666, category: 'Investments', isFixed: true },
      { id: 'tg5', date: '2026-08-07', description: 'London Tube & Transport for London', amount: -160, category: 'Transport', isFixed: true },
      { id: 'tg6', date: '2026-08-10', description: 'Pub Dinners & Socializing', amount: -390, category: 'Dining', isFixed: false },
    ],
  },
  {
    name: 'Berlin Remote Tech Founder (EUR)',
    bank: 'N26 & Trade Republic',
    currency: 'EUR',
    description: 'Income €8,200/mo, MSCI World ETF DCA, High Savings Rate',
    cashAssets: 22000,
    investmentAssets: 95000,
    debts: [
      { id: 'de1', name: 'KfW Entrepreneur Loan', balance: 8400, apr: 4.2, minPayment: 180 },
    ],
    transactions: [
      { id: 'te1', date: '2026-08-01', description: 'SaaS Founder Monthly Draw', amount: 8200, category: 'Income', isFixed: true },
      { id: 'te2', date: '2026-08-01', description: 'Mitte Loft Apartment Rent', amount: -1850, category: 'Housing', isFixed: true },
      { id: 'te3', date: '2026-08-03', description: 'Bio Company & Rewe Groceries', amount: -520, category: 'Groceries', isFixed: false },
      { id: 'te4', date: '2026-08-05', description: 'iShares Core MSCI World ETF Sparplan', amount: -3000, category: 'Investments', isFixed: true },
      { id: 'te5', date: '2026-08-10', description: 'BVG Berlin Public Transit & Gym', amount: -120, category: 'Transport', isFixed: true },
      { id: 'te6', date: '2026-08-14', description: 'Berlin Specialty Coffee & Dinners', amount: -380, category: 'Dining', isFixed: false },
    ],
  },
];

const STORAGE_KEY = 'wealthpulse_statement_v2';

export function getStoredTransactions(): Transaction[] {
  if (typeof window === 'undefined') return DEMO_PRESETS[0].transactions;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : DEMO_PRESETS[0].transactions;
  } catch (e) {
    return DEMO_PRESETS[0].transactions;
  }
}

export function saveTransactionsToStorage(txs: Transaction[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(txs));
  } catch (e) {
    console.error('Failed to save transactions:', e);
  }
}
