import { Debt, Transaction } from '@/types';

export function formatCurrency(amount: number, currency: 'PKR' | 'USD' = 'PKR'): string {
  const symbol = currency === 'PKR' ? 'Rs. ' : '$';
  return `${symbol}${Math.round(amount).toLocaleString()}`;
}

export const DEMO_PRESETS: { name: string; bank: string; description: string; transactions: Transaction[]; debts: Debt[]; cashAssets: number; investmentAssets: number }[] = [
  {
    name: 'Senior Tech Engineer Profile (PKR)',
    bank: 'Meezan Bank & HBL',
    description: 'Income Rs. 450,000/mo, High savings rate, Mutual Fund investments',
    cashAssets: 1250000,
    investmentAssets: 4500000,
    debts: [
      { id: 'd1', name: 'Car Loan (Bank Alfalah)', balance: 650000, apr: 14.5, minPayment: 22000 },
      { id: 'd2', name: 'Meezan Credit Card', balance: 120000, apr: 21.0, minPayment: 15000 },
    ],
    transactions: [
      { id: 't1', date: '2026-08-01', description: 'Tech Salary Direct Deposit', amount: 450000, category: 'Income', isFixed: true },
      { id: 't2', date: '2026-08-02', description: 'DHA Apartment Monthly Rent', amount: -85000, category: 'Housing', isFixed: true },
      { id: 't3', date: '2026-08-03', description: 'Imtiaz Super Market Groceries', amount: -45000, category: 'Groceries', isFixed: false },
      { id: 't4', date: '2026-08-05', description: 'Meezan Islamic Mutual Fund Auto-Invest', amount: -150000, category: 'Investments', isFixed: true },
      { id: 't5', date: '2026-08-07', description: 'Kolachi Restaurant Family Dinner', amount: -22000, category: 'Dining', isFixed: false },
      { id: 't6', date: '2026-08-10', description: 'K-Electric Power & Gas Utility Bill', amount: -28000, category: 'Utilities', isFixed: true },
      { id: 't7', date: '2026-08-12', description: 'Netflix & Fiber Internet Bundle', amount: -6500, category: 'Subscriptions', isFixed: true },
      { id: 't8', date: '2026-08-14', description: 'Structure Gym Monthly Membership', amount: -12000, category: 'Healthcare', isFixed: true },
      { id: 't9', date: '2026-08-15', description: 'Fuel Station & Careem Rides', amount: -18000, category: 'Transport', isFixed: false },
      { id: 't10', date: '2026-08-18', description: 'Espresso Coffee & Work Snacks', amount: -8500, category: 'Dining', isFixed: false },
    ],
  },
  {
    name: 'Product Leader & Homeowner (PKR)',
    bank: 'Standard Chartered Preferred',
    description: 'Income Rs. 850,000/mo, House Installment Rs. 220,000, KSE-100 Stocks',
    cashAssets: 2800000,
    investmentAssets: 12500000,
    debts: [
      { id: 'd10', name: 'Auto Financing (Civic RS)', balance: 1450000, apr: 15.2, minPayment: 48000 },
      { id: 'd11', name: 'SCB World MasterCard', balance: 280000, apr: 24.0, minPayment: 25000 },
    ],
    transactions: [
      { id: 't20', date: '2026-08-01', description: 'Executive Director Monthly Salary', amount: 850000, category: 'Income', isFixed: true },
      { id: 't21', date: '2026-08-01', description: 'Bahria Town House Mortgage Installment', amount: -220000, category: 'Housing', isFixed: true },
      { id: 't22', date: '2026-08-03', description: 'Al-Fatah & Carrefour Bulk Supplies', amount: -75000, category: 'Groceries', isFixed: false },
      { id: 't23', date: '2026-08-05', description: 'PSX KSE-100 Blue Chip Stocks Buy', amount: -250000, category: 'Investments', isFixed: true },
      { id: 't24', date: '2026-08-08', description: 'Shell Petrol & Car Maintenance', amount: -32000, category: 'Transport', isFixed: true },
      { id: 't25', date: '2026-08-12', description: 'Aylanto Fine Dining & Executive Club', amount: -45000, category: 'Dining', isFixed: false },
      { id: 't26', date: '2026-08-15', description: 'StormFiber Gigabit Internet & Utilities', amount: -16000, category: 'Utilities', isFixed: true },
    ],
  },
];

const STORAGE_KEY = 'wealthpulse_statement_v1';

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
