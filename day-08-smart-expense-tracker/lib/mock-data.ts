import { Transaction, ExtractedReceipt, ExpenseCategory, SupportedCurrency } from '@/types';

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

export function formatMoney(amount: number, currency: SupportedCurrency = 'USD'): string {
  if (currency === 'PKR') {
    // 1 USD = approx 280 PKR for conversion display if needed, or straight amount formatting
    return `Rs. ${Math.round(amount).toLocaleString()}`;
  }
  return `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1',
    merchant: 'Starbucks Reserve',
    date: '2026-08-16',
    amount: 14.80,
    category: 'Food & Dining',
    lineItems: [
      { description: 'Iced Caramel Macchiato', amount: 6.50 },
      { description: 'Avocado Artisan Sourdough', amount: 8.30 }
    ],
    paymentMethod: 'Apple Pay'
  },
  {
    id: 'tx-2',
    merchant: 'Uber Black Ride',
    date: '2026-08-15',
    amount: 32.50,
    category: 'Transport',
    lineItems: [{ description: 'Airport Transfer - 14 miles', amount: 32.50 }],
    paymentMethod: 'Credit Card'
  },
  {
    id: 'tx-3',
    merchant: 'Whole Foods Organic',
    date: '2026-08-14',
    amount: 142.30,
    category: 'Groceries',
    lineItems: [
      { description: 'Organic Produce & Greens', amount: 45.00 },
      { description: 'Almond Milk & Kefir', amount: 18.30 },
      { description: 'Wild Alaskan Salmon', amount: 79.00 }
    ],
    paymentMethod: 'Debit Card'
  },
  {
    id: 'tx-4',
    merchant: 'Apple Store NYC',
    date: '2026-08-12',
    amount: 199.00,
    category: 'Shopping',
    lineItems: [{ description: 'AirPods Pro 2 USB-C', amount: 199.00 }],
    paymentMethod: 'Credit Card'
  },
  {
    id: 'tx-5',
    merchant: 'Netflix 4K Ultra',
    date: '2026-08-10',
    amount: 22.99,
    category: 'Subscriptions',
    lineItems: [{ description: 'Premium Family Plan', amount: 22.99 }],
    paymentMethod: 'Credit Card'
  },
  {
    id: 'tx-6',
    merchant: 'Equinox Fitness Club',
    date: '2026-08-08',
    amount: 280.00,
    category: 'Health & Wellness',
    lineItems: [{ description: 'Executive All-Access Monthly', amount: 280.00 }],
    paymentMethod: 'Credit Card'
  },
  {
    id: 'tx-7',
    merchant: 'Chipotle Mexican Grill',
    date: '2026-08-06',
    amount: 18.75,
    category: 'Food & Dining',
    lineItems: [{ description: 'Double Steak Burrito Bowl', amount: 18.75 }],
    paymentMethod: 'Apple Pay'
  },
  {
    id: 'tx-8',
    merchant: 'Amazon Prime Hardware',
    date: '2026-08-04',
    amount: 84.50,
    category: 'Shopping',
    lineItems: [{ description: 'Logitech MX Master 3S', amount: 84.50 }],
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
    merchant: 'Starbucks Coffee Reserve',
    date: new Date().toISOString().split('T')[0],
    totalAmount: 14.80,
    category: 'Food & Dining',
    lineItems: [
      { description: 'Iced Caramel Cloud Macchiato', amount: 6.50 },
      { description: 'Avocado Brioche Toast', amount: 8.30 }
    ],
    confidence: 0.99
  },
  uber: {
    merchant: 'Uber Technologies Inc',
    date: new Date().toISOString().split('T')[0],
    totalAmount: 34.50,
    category: 'Transport',
    lineItems: [
      { description: 'Downtown Ride - 5.8 miles', amount: 29.50 },
      { description: 'Driver Gratuity', amount: 5.00 }
    ],
    confidence: 0.98
  },
  apple: {
    merchant: 'Apple Retail Store',
    date: new Date().toISOString().split('T')[0],
    totalAmount: 129.00,
    category: 'Shopping',
    lineItems: [
      { description: 'MagSafe Wireless Battery Pack', amount: 99.00 },
      { description: 'Braided USB-C Cable (2m)', amount: 30.00 }
    ],
    confidence: 0.99
  },
  wholefoods: {
    merchant: 'Whole Foods Market',
    date: new Date().toISOString().split('T')[0],
    totalAmount: 94.60,
    category: 'Groceries',
    lineItems: [
      { description: 'Organic Honeycrisp Apples', amount: 14.40 },
      { description: 'Grass-Fed Ground Sirloin', amount: 28.50 },
      { description: 'San Pellegrino Sparkling 12-Pack', amount: 32.00 },
      { description: 'Artisan Sourdough Loaf', amount: 19.70 }
    ],
    confidence: 0.97
  },
  imtiaz: {
    merchant: 'Imtiaz Super Market',
    date: new Date().toISOString().split('T')[0],
    totalAmount: 48.00,
    category: 'Groceries',
    lineItems: [
      { description: 'Basmati Rice Premium 5kg', amount: 18.00 },
      { description: 'Cooking Oil Pure 5L', amount: 20.00 },
      { description: 'Fresh Dairy Milk & Yogurt', amount: 10.00 }
    ],
    confidence: 0.98
  }
};
