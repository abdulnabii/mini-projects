import { Debt, Transaction } from '@/types';

export const DEMO_PRESETS: { name: string; bank: string; description: string; transactions: Transaction[]; debts: Debt[]; cashAssets: number; investmentAssets: number }[] = [
  {
    name: 'Tech Senior Engineer Profile',
    bank: 'Chase Sapphire & Checking',
    description: 'Income $8,500/mo, High savings rate, 1 Credit Card debt balance',
    cashAssets: 22500,
    investmentAssets: 94000,
    debts: [
      { id: 'd1', name: 'Chase Sapphire Reserve', balance: 3400, apr: 22.9, minPayment: 110 },
      { id: 'd2', name: 'Federal Student Loan', balance: 14500, apr: 5.5, minPayment: 180 },
    ],
    transactions: [
      { id: 't1', date: '2026-08-01', description: 'Tech Corp Direct Deposit Salary', amount: 8500, category: 'Income', isFixed: true },
      { id: 't2', date: '2026-08-02', description: 'Apex Apartments Monthly Rent', amount: -2400, category: 'Housing', isFixed: true },
      { id: 't3', date: '2026-08-03', description: 'Whole Foods Market Groceries', amount: -380, category: 'Groceries', isFixed: false },
      { id: 't4', date: '2026-08-05', description: 'Vanguard S&P 500 Index Fund Auto-Buy', amount: -2000, category: 'Investments', isFixed: true },
      { id: 't5', date: '2026-08-07', description: 'Nobu Restaurant Omakase Dinner', amount: -240, category: 'Dining', isFixed: false },
      { id: 't6', date: '2026-08-10', description: 'ConEd Power & Gas Utility', amount: -145, category: 'Utilities', isFixed: true },
      { id: 't7', date: '2026-08-12', description: 'Netflix & Spotify Premium Bundle', amount: -35, category: 'Subscriptions', isFixed: true },
      { id: 't8', date: '2026-08-14', description: 'Equinox Gym Monthly Membership', amount: -220, category: 'Healthcare', isFixed: true },
      { id: 't9', date: '2026-08-15', description: 'Uber Rides & Transit Pass', amount: -160, category: 'Transport', isFixed: false },
      { id: 't10', date: '2026-08-18', description: 'Blue Bottle Coffee Roasters', amount: -85, category: 'Dining', isFixed: false },
    ],
  },
  {
    name: 'Product Leader & Homeowner',
    bank: 'Bank of America Preferred',
    description: 'Income $11,500/mo, Mortgage $3,400, Auto Loan, 401(k) Maxed',
    cashAssets: 45000,
    investmentAssets: 185000,
    debts: [
      { id: 'd10', name: 'Auto Loan (Tesla Model Y)', balance: 18500, apr: 6.2, minPayment: 420 },
      { id: 'd11', name: 'Amex Platinum Balance', balance: 5200, apr: 24.5, minPayment: 150 },
    ],
    transactions: [
      { id: 't20', date: '2026-08-01', description: 'Enterprise Tech Payroll Direct Deposit', amount: 11500, category: 'Income', isFixed: true },
      { id: 't21', date: '2026-08-01', description: 'First National Mortgage Payment', amount: -3400, category: 'Housing', isFixed: true },
      { id: 't22', date: '2026-08-03', description: 'Trader Joe & Costco Bulk Groceries', amount: -650, category: 'Groceries', isFixed: false },
      { id: 't23', date: '2026-08-05', description: 'Fidelity Total Market Index Fund', amount: -3000, category: 'Investments', isFixed: true },
      { id: 't24', date: '2026-08-08', description: 'Tesla Supercharging & Auto Insurance', amount: -210, category: 'Transport', isFixed: true },
      { id: 't25', date: '2026-08-12', description: 'Michelin Star Dining & Cocktail Bar', amount: -480, category: 'Dining', isFixed: false },
      { id: 't26', date: '2026-08-15', description: 'High-Speed Fiber Internet & Cable', amount: -110, category: 'Utilities', isFixed: true },
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
