import { Transaction, ExpenseCategory } from '@/types';
import { INITIAL_TRANSACTIONS, INITIAL_BUDGETS } from './mock-data';

const TRANSACTIONS_KEY = 'expensemind_transactions_v1';
const BUDGETS_KEY = 'expensemind_budgets_v1';

export function getStoredTransactions(): Transaction[] {
  if (typeof window === 'undefined') return INITIAL_TRANSACTIONS;
  try {
    const data = localStorage.getItem(TRANSACTIONS_KEY);
    return data ? JSON.parse(data) : INITIAL_TRANSACTIONS;
  } catch (err) {
    console.error('Failed to read transactions from storage:', err);
    return INITIAL_TRANSACTIONS;
  }
}

export function saveTransaction(t: Transaction): Transaction[] {
  if (typeof window === 'undefined') return INITIAL_TRANSACTIONS;
  const current = getStoredTransactions();
  const updated = [t, ...current];
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(updated));
  return updated;
}

export function deleteTransaction(id: string): Transaction[] {
  if (typeof window === 'undefined') return INITIAL_TRANSACTIONS;
  const current = getStoredTransactions();
  const updated = current.filter((t) => t.id !== id);
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(updated));
  return updated;
}

export function getStoredBudgets(): Record<ExpenseCategory, number> {
  if (typeof window === 'undefined') return INITIAL_BUDGETS;
  try {
    const data = localStorage.getItem(BUDGETS_KEY);
    return data ? JSON.parse(data) : INITIAL_BUDGETS;
  } catch (err) {
    console.error('Failed to read budgets from storage:', err);
    return INITIAL_BUDGETS;
  }
}

export function saveBudget(category: ExpenseCategory, amount: number): Record<ExpenseCategory, number> {
  if (typeof window === 'undefined') return INITIAL_BUDGETS;
  const current = getStoredBudgets();
  const updated = { ...current, [category]: amount };
  localStorage.setItem(BUDGETS_KEY, JSON.stringify(updated));
  return updated;
}
