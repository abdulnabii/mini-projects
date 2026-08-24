import { ExecutionResult, DatabaseDialect } from '@/types';

export function executeMockQuery(
  query: string,
  dialect: DatabaseDialect,
  schemaName: string
): ExecutionResult {
  const startTime = performance.now();

  const isEcommerce = schemaName.toLowerCase().includes('commerce');
  const isFintech = schemaName.toLowerCase().includes('fintech') || schemaName.toLowerCase().includes('wallet');
  const isSaas = schemaName.toLowerCase().includes('saas') || schemaName.toLowerCase().includes('billing');

  let columns: string[] = [];
  let rows: Record<string, any>[] = [];

  if (isFintech) {
    columns = ['user_name', 'tier', 'currency', 'total_amount', 'transaction_count', 'status'];
    rows = [
      { user_name: 'Zainab Ahmed', tier: 'business', currency: 'USD', total_amount: 48500.00, transaction_count: 142, status: 'verified' },
      { user_name: 'Tariq Mahmood', tier: 'business', currency: 'USD', total_amount: 36200.50, transaction_count: 98, status: 'verified' },
      { user_name: 'Hamza Khan', tier: 'premium', currency: 'PKR', total_amount: 28400.00, transaction_count: 67, status: 'verified' },
      { user_name: 'Sara Siddiqui', tier: 'business', currency: 'EUR', total_amount: 21900.00, transaction_count: 53, status: 'verified' },
      { user_name: 'Bilal Hussain', tier: 'premium', currency: 'USD', total_amount: 17850.25, transaction_count: 41, status: 'verified' },
      { user_name: 'Ayesha Malik', tier: 'standard', currency: 'USD', total_amount: 12400.00, transaction_count: 29, status: 'verified' },
    ];
  } else if (isSaas) {
    columns = ['company_name', 'plan_tier', 'seat_count', 'mrr_usd', 'tokens_consumed', 'status'];
    rows = [
      { company_name: 'NovaScale Systems', plan_tier: 'enterprise', seat_count: 120, mrr_usd: 12500.00, tokens_consumed: 14200000, status: 'active' },
      { company_name: 'Apex AI Labs', plan_tier: 'enterprise', seat_count: 85, mrr_usd: 8900.00, tokens_consumed: 9850000, status: 'active' },
      { company_name: 'Vortex Cloud', plan_tier: 'growth', seat_count: 45, mrr_usd: 4500.00, tokens_consumed: 4200000, status: 'active' },
      { company_name: 'PulseFlow Tech', plan_tier: 'growth', seat_count: 30, mrr_usd: 3000.00, tokens_consumed: 2800000, status: 'active' },
      { company_name: 'HyperDrive Media', plan_tier: 'starter', seat_count: 12, mrr_usd: 1200.00, tokens_consumed: 1100000, status: 'active' },
      { company_name: 'Cognitive Engine', plan_tier: 'starter', seat_count: 8, mrr_usd: 800.00, tokens_consumed: 650000, status: 'active' },
    ];
  } else {
    // Default E-Commerce
    columns = ['customer_name', 'email', 'country', 'total_revenue', 'order_count'];
    rows = [
      { customer_name: 'Ali Raza', email: 'ali.raza@techpk.com', country: 'Pakistan', total_revenue: 4890.50, order_count: 14 },
      { customer_name: 'Fatima Noor', email: 'fatima.n@karachidev.org', country: 'Pakistan', total_revenue: 3720.00, order_count: 11 },
      { customer_name: 'Usman Qureshi', email: 'usman.q@lahore.io', country: 'Pakistan', total_revenue: 3150.25, order_count: 9 },
      { customer_name: 'Hina Javed', email: 'hina.j@islamabad.net', country: 'Pakistan', total_revenue: 2840.00, order_count: 8 },
      { customer_name: 'Omer Farooq', email: 'omer.f@peshawar.co', country: 'Pakistan', total_revenue: 2410.75, order_count: 7 },
      { customer_name: 'Mahnoor Shah', email: 'mahnoor@rawalpindi.ai', country: 'Pakistan', total_revenue: 1980.00, order_count: 6 },
      { customer_name: 'Bilal Tariq', email: 'bilal.t@multan.dev', country: 'Pakistan', total_revenue: 1650.00, order_count: 5 },
    ];
  }

  const endTime = performance.now();
  const executionTimeMs = Math.max(12, Math.round(endTime - startTime + Math.random() * 20));

  return {
    columns,
    rows,
    totalRows: rows.length,
    executionTimeMs,
  };
}
