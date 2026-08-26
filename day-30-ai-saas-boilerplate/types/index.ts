export type PlanTier = 'free' | 'pro' | 'enterprise';

export type BillingCycle = 'monthly' | 'yearly';

export type UserRole = 'owner' | 'admin' | 'member' | 'billing';

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface OrganizationMember {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: UserRole;
  joinedAt: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  plan: PlanTier;
  billingCycle: BillingCycle;
  creditsRemaining: number;
  creditsTotal: number;
  members: OrganizationMember[];
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
}

export interface AIUsageLog {
  id: string;
  orgId: string;
  userId: string;
  feature: 'COPYWRITER' | 'CODE_GEN' | 'DATA_ANALYST';
  promptSnippet: string;
  creditsUsed: number;
  inputTokens: number;
  outputTokens: number;
  latencyMs: number;
  timestamp: string;
}

export interface PlanFeature {
  name: string;
  included: boolean;
  limit?: string;
}

export interface PlanConfig {
  id: PlanTier;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  creditsPerMonth: number;
  highlighted?: boolean;
  features: string[];
}

export interface Invoice {
  id: string;
  number: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  planName: string;
  pdfUrl?: string;
}

export interface AdminMetrics {
  mrr: number;
  arr: number;
  activeUsers: number;
  totalOrganizations: number;
  churnRatePct: number;
  totalAICallsToday: number;
  planDistribution: { plan: PlanTier; count: number; percentage: number }[];
  usageAlertsSent: number;
}
