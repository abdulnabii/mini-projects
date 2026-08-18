export type ExpenseCategory =
  | 'Food & Dining'
  | 'Transport'
  | 'Housing & Utilities'
  | 'Shopping'
  | 'Entertainment'
  | 'Health & Wellness'
  | 'Subscriptions'
  | 'Travel'
  | 'Education'
  | 'Groceries'
  | 'Bills & Services'
  | 'Other';

export type SupportedCurrency = 'USD' | 'PKR';

export interface LineItem {
  description: string;
  amount: number;
}

export interface Transaction {
  id: string;
  merchant: string;
  date: string;
  amount: number;
  category: ExpenseCategory;
  lineItems?: LineItem[];
  receiptUrl?: string;
  notes?: string;
  paymentMethod: 'Credit Card' | 'Debit Card' | 'Apple Pay' | 'Cash' | 'Bank Transfer';
}

export interface CategoryBudget {
  category: ExpenseCategory;
  budget: number;
  spent: number;
}

export interface CoachInsight {
  title: string;
  detail: string;
  severity: 'info' | 'warning' | 'critical';
}

export interface CoachRecommendation {
  action: string;
  estimatedMonthlySaving: number;
  effort: 'easy' | 'medium' | 'hard';
}

export interface CoachReport {
  overview: string;
  healthScore: number;
  healthGrade: 'A+' | 'A' | 'B' | 'C' | 'D';
  insights: CoachInsight[];
  recommendations: CoachRecommendation[];
  projectedMonthlySaving: number;
}

export interface ExtractedReceipt {
  merchant: string;
  date: string;
  totalAmount: number;
  category: ExpenseCategory;
  lineItems: LineItem[];
  confidence: number;
}
