import { Transaction, CategoryBudget, ExtractedReceipt, ExpenseCategory } from '@/types';

export const CATEGORIES: ExpenseCategory[] = [
  'Food & Dining',
  'Transport',
  'Housing & Utilities',
  'Shopping',
  'Entertainment',
  'Health & Wellness',
  'Subscriptions',
  'Travel',
  'Education',
  'Groceries',
  'Bills & Services',
  'Other',
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1',
    merchant: 'Starbucks Coffee',
    date: '2026-08-10',
    amount: 14.80,
    category: 'Food & Dining',
    lineItems: [
      { description: 'Iced Caramel Macchiato', amount: 6.50 },
      { description: 'Avocado Toast', amount: 8.30 }
    ],
    paymentMethod: 'Apple Pay'
  },
  {
    id: 'tx-2',
    merchant: 'Uber Technologies',
    date: '2026-08-09',
    amount: 32.50,
    category: 'Transport',
    lineItems: [{ description: 'UberX Trip', amount: 32.50 }],
    paymentMethod: 'Credit Card'
  },
  {
    id: 'tx-3',
    merchant: 'Whole Foods Market',
    date: '2026-08-08',
    amount: 142.30,
    category: 'Groceries',
    lineItems: [
      { description: 'Organic Produce', amount: 45.00 },
      { description: 'Almond Milk & Dairy', amount: 18.30 },
      { description: 'Wild Salmon Fillet', amount: 79.00 }
    ],
    paymentMethod: 'Debit Card'
  },
  {
    id: 'tx-4',
    merchant: 'Apple Store',
    date: '2026-08-07',
    amount: 199.00,
    category: 'Shopping',
    lineItems: [{ description: 'AirPods Pro 2', amount: 199.00 }],
    paymentMethod: 'Credit Card'
  },
  {
    id: 'tx-5',
    merchant: 'Netflix Subscription',
    date: '2026-08-05',
    amount: 22.99,
    category: 'Subscriptions',
    lineItems: [{ description: 'Premium 4K Monthly Plan', amount: 22.99 }],
    paymentMethod: 'Credit Card'
  },
  {
    id: 'tx-6',
    merchant: 'Equinox Gym',
    date: '2026-08-01',
    amount: 280.00,
    category: 'Health & Wellness',
    lineItems: [{ description: 'Monthly All-Access Membership', amount: 280.00 }],
    paymentMethod: 'Credit Card'
  },
  {
    id: 'tx-7',
    merchant: 'Chipotle Mexican Grill',
    date: '2026-08-04',
    amount: 18.75,
    category: 'Food & Dining',
    lineItems: [{ description: 'Steak Burrito Bowl', amount: 18.75 }],
    paymentMethod: 'Apple Pay'
  },
  {
    id: 'tx-8',
    merchant: 'Amazon.com',
    date: '2026-08-03',
    amount: 84.50,
    category: 'Shopping',
    lineItems: [{ description: 'Wireless Ergonomic Mouse', amount: 84.50 }],
    paymentMethod: 'Credit Card'
  }
];

export const INITIAL_BUDGETS: Record<ExpenseCategory, number> = {
  'Food & Dining': 450,
  'Transport': 250,
  'Housing & Utilities': 1500,
  'Shopping': 350,
  'Entertainment': 200,
  'Health & Wellness': 300,
  'Subscriptions': 100,
  'Travel': 400,
  'Education': 150,
  'Groceries': 500,
  'Bills & Services': 300,
  'Other': 150,
};

export const PRESET_RECEIPTS: Record<string, ExtractedReceipt> = {
  starbucks: {
    merchant: 'Starbucks Coffee',
    date: new Date().toISOString().split('T')[0],
    totalAmount: 14.80,
    category: 'Food & Dining',
    lineItems: [
      { description: 'Iced Caramel Macchiato', amount: 6.50 },
      { description: 'Avocado Toast', amount: 8.30 }
    ],
    confidence: 0.98
  },
  uber: {
    merchant: 'Uber Rides',
    date: new Date().toISOString().split('T')[0],
    totalAmount: 28.40,
    category: 'Transport',
    lineItems: [
      { description: 'Downtown Ride - 4.2 miles', amount: 24.00 },
      { description: 'Tip', amount: 4.40 }
    ],
    confidence: 0.96
  },
  apple: {
    merchant: 'Apple Retail Store',
    date: new Date().toISOString().split('T')[0],
    totalAmount: 129.00,
    category: 'Shopping',
    lineItems: [
      { description: 'MagSafe Battery Pack', amount: 99.00 },
      { description: 'USB-C Cable (2m)', amount: 30.00 }
    ],
    confidence: 0.99
  },
  wholefoods: {
    merchant: 'Whole Foods Market',
    date: new Date().toISOString().split('T')[0],
    totalAmount: 87.60,
    category: 'Groceries',
    lineItems: [
      { description: 'Organic Honey Crispy Apples', amount: 12.40 },
      { description: 'Grass-Fed Ground Beef', amount: 24.50 },
      { description: 'Artisan Sourdough Bread', amount: 8.70 },
      { description: 'Sparkling Mineral Water 6-pack', amount: 42.00 }
    ],
    confidence: 0.95
  }
};
