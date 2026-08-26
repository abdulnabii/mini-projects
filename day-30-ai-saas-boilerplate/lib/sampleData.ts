import { AdminMetrics, Invoice, Organization, PlanConfig } from '@/types';

export const PLAN_CONFIGS: PlanConfig[] = [
  {
    id: 'free',
    name: 'Starter / Free',
    description: 'Essential AI capabilities for indie hackers and developers experimenting with prototypes.',
    monthlyPrice: 0,
    yearlyPrice: 0,
    creditsPerMonth: 50,
    features: [
      '50 AI Credits / month',
      'Google Gemini 1.5 Flash API',
      '1 Workspace Member',
      'Standard Inference Speed',
      'Community Discord Support',
    ],
  },
  {
    id: 'pro',
    name: 'Pro Builder',
    description: 'Designed for scaling startups and engineering teams shipping AI features into production.',
    monthlyPrice: 19,
    yearlyPrice: 190,
    creditsPerMonth: 750,
    highlighted: true,
    features: [
      '750 AI Credits / month ($0.02 / extra)',
      'High-Speed Priority GPU Inference',
      'Up to 10 Team Members (RBAC)',
      'Stripe Usage-Based Metering',
      'Custom System Prompts & Rate Limits',
      'Email & Slack Priority Support',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise Scale',
    description: 'Dedicated infrastructure, custom model routing, SLA guarantees, and enterprise SSO.',
    monthlyPrice: 99,
    yearlyPrice: 990,
    creditsPerMonth: 5000,
    features: [
      '5,000 AI Credits / month (Custom Pools)',
      'Dedicated Sub-Second AI Latency Tier',
      'Unlimited Workspace Seats & SSO/SAML',
      'Fine-Tuned Model Weights Support',
      'Custom Data Retention & Zero-Data-Logging',
      'Dedicated Solutions Architect & 99.99% SLA',
    ],
  },
];

export const INITIAL_ORGS: Organization[] = [
  {
    id: 'org-hyperscale',
    name: 'HyperScale AI Labs',
    slug: 'hyperscale-ai',
    plan: 'pro',
    billingCycle: 'monthly',
    creditsRemaining: 685,
    creditsTotal: 750,
    currentPeriodEnd: '2026-09-26T00:00:00Z',
    cancelAtPeriodEnd: false,
    stripeCustomerId: 'cus_N8x9P149qL',
    stripeSubscriptionId: 'sub_1P8xKaL',
    members: [
      {
        id: 'm1',
        userId: 'user_abdul',
        name: 'Abdul Nabi',
        email: 'abdul@hyperscalelabs.io',
        role: 'owner',
        joinedAt: '2026-01-10T00:00:00Z',
      },
      {
        id: 'm2',
        userId: 'user_sarah',
        name: 'Sarah Chen (Lead Engineer)',
        email: 'sarah@hyperscalelabs.io',
        role: 'admin',
        joinedAt: '2026-02-15T00:00:00Z',
      },
      {
        id: 'm3',
        userId: 'user_david',
        name: 'David Miller (Product)',
        email: 'david@hyperscalelabs.io',
        role: 'member',
        joinedAt: '2026-04-01T00:00:00Z',
      },
    ],
  },
  {
    id: 'org-acme',
    name: 'Acme SaaS Corp',
    slug: 'acme-corp',
    plan: 'free',
    billingCycle: 'monthly',
    creditsRemaining: 24,
    creditsTotal: 50,
    currentPeriodEnd: '2026-09-15T00:00:00Z',
    cancelAtPeriodEnd: false,
    members: [
      {
        id: 'm4',
        userId: 'user_alex',
        name: 'Alex Vance',
        email: 'alex@acme.dev',
        role: 'owner',
        joinedAt: '2026-08-01T00:00:00Z',
      },
    ],
  },
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'inv_10482',
    number: 'INV-2026-001',
    date: '2026-08-01',
    amount: 19.0,
    status: 'paid',
    planName: 'Pro Builder (Monthly)',
  },
  {
    id: 'inv_10391',
    number: 'INV-2026-000',
    date: '2026-07-01',
    amount: 19.0,
    status: 'paid',
    planName: 'Pro Builder (Monthly)',
  },
  {
    id: 'inv_10274',
    number: 'INV-2026-00X',
    date: '2026-06-01',
    amount: 19.0,
    status: 'paid',
    planName: 'Pro Builder (Monthly)',
  },
];

export const INITIAL_ADMIN_METRICS: AdminMetrics = {
  mrr: 14850,
  arr: 178200,
  activeUsers: 2420,
  totalOrganizations: 418,
  churnRatePct: 1.8,
  totalAICallsToday: 84210,
  planDistribution: [
    { plan: 'free', count: 284, percentage: 68 },
    { plan: 'pro', count: 109, percentage: 26 },
    { plan: 'enterprise', count: 25, percentage: 6 },
  ],
  usageAlertsSent: 14,
};
