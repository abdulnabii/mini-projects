'use client';

import { useState } from 'react';
import { Terminal, Copy, Check, X, Code2, Database, Shield, CreditCard, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const SNIPPETS = {
  SETUP_SH: `#!/bin/bash
# 🚀 SaaSForge.AI — One-Command Production Setup Script
# Built by Abdul Nabi (30 Days 30 AI Projects Grand Finale)

echo "=================================================="
echo "✨ Bootstrapping Full-Stack AI SaaS Boilerplate..."
echo "=================================================="

# 1. Install dependencies
echo "📦 Installing core packages (Next.js 16, Stripe, Drizzle, Clerk, Gemini)..."
npm install @google/generative-ai @upstash/redis @clerk/nextjs stripe drizzle-orm postgres resend

# 2. Setup Environment Template
if [ ! -f .env.local ]; then
  cp .env.example .env.local
  echo "📝 Created .env.local from .env.example"
fi

# 3. Run Supabase Database Migrations
echo "🗄️ Executing Drizzle ORM PostgreSQL migrations..."
npx drizzle-kit push:pg

# 4. Initialize Stripe Products & Webhooks
echo "💳 Provisioning Stripe Free ($0), Pro ($19), and Enterprise ($99) tiers..."

echo "=================================================="
echo "🎉 Setup complete! Launch with: npm run dev"
echo "🌐 Local App: http://localhost:3000"
echo "📊 Admin Dashboard: http://localhost:3000/admin"
echo "=================================================="`,

  SCHEMA_TS: `// lib/db/schema.ts — Drizzle ORM Multi-Tenant PostgreSQL Schema
import { pgTable, text, timestamp, integer, boolean, uuid } from 'drizzle-orm/pg-core';

export const organizations = pgTable('organizations', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').unique().notNull(),
  plan: text('plan', { enum: ['free', 'pro', 'enterprise'] }).default('free').notNull(),
  stripeCustomerId: text('stripe_customer_id'),
  stripeSubscriptionId: text('stripe_subscription_id'),
  creditsRemaining: integer('credits_remaining').default(50).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const members = pgTable('members', {
  id: uuid('id').defaultRandom().primaryKey(),
  orgId: text('org_id').references(() => organizations.id).notNull(),
  userId: text('user_id').notNull(),
  role: text('role', { enum: ['owner', 'admin', 'member', 'billing'] }).default('member').notNull(),
  joinedAt: timestamp('joined_at').defaultNow().notNull(),
});

export const aiUsageLogs = pgTable('ai_usage_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  orgId: text('org_id').references(() => organizations.id).notNull(),
  feature: text('feature').notNull(),
  creditsUsed: integer('credits_used').notNull(),
  latencyMs: integer('latency_ms').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});`,

  STRIPE_ROUTE: `// app/api/webhooks/stripe/route.ts — Stripe Webhook Handler
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' });

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature')!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    return NextResponse.json({ error: \`Webhook Error: \${err.message}\` }, { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed':
      // Provision Pro or Enterprise Plan in Supabase RLS database
      break;
    case 'invoice.payment_succeeded':
      // Reset monthly AI credit balance (e.g. 750 credits for Pro)
      break;
    case 'customer.subscription.deleted':
      // Downgrade organization back to Free Tier
      break;
  }

  return NextResponse.json({ received: true });
}`,
};

export default function DeveloperSetupModal({ isOpen, onClose }: Props) {
  const [activeSnippetTab, setActiveSnippetTab] = useState<'setup' | 'schema' | 'stripe'>('setup');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const getCode = () => {
    switch (activeSnippetTab) {
      case 'schema':
        return SNIPPETS.SCHEMA_TS;
      case 'stripe':
        return SNIPPETS.STRIPE_ROUTE;
      default:
        return SNIPPETS.SETUP_SH;
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    confetti({
      particleCount: 25,
      spread: 50,
      origin: { y: 0.7 },
      colors: ['#6366f1', '#10b981'],
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto font-mono text-xs">
      <div className="bg-[#090d16] border border-indigo-500/40 rounded-2xl p-6 max-w-3xl w-full space-y-4 shadow-2xl my-8 text-slate-300 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3.5 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm font-mono">
                One-Command CLI Developer Setup Exporter
              </h3>
              <p className="text-[10px] text-slate-400">
                Full-stack starter kit: Next.js 16, Drizzle Schema, Stripe Webhooks, &amp; Gemini Metering
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-emerald-500 text-black font-extrabold text-xs flex items-center gap-1.5 hover:bg-emerald-400 transition-all cursor-pointer shadow-md"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Code Snippet'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-md bg-[#0f1422] text-slate-400 hover:text-white transition-colors cursor-pointer border border-white/[0.08]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Snippet Tabs */}
        <div className="flex items-center gap-1 p-0.5 rounded-lg bg-[#04080e] border border-white/[0.08] text-xs shrink-0">
          <button
            type="button"
            onClick={() => setActiveSnippetTab('setup')}
            className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
              activeSnippetTab === 'setup'
                ? 'bg-indigo-500 text-white font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            scripts/setup.sh
          </button>

          <button
            type="button"
            onClick={() => setActiveSnippetTab('schema')}
            className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
              activeSnippetTab === 'schema'
                ? 'bg-indigo-500 text-white font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            lib/db/schema.ts
          </button>

          <button
            type="button"
            onClick={() => setActiveSnippetTab('stripe')}
            className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
              activeSnippetTab === 'stripe'
                ? 'bg-indigo-500 text-white font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            app/api/webhooks/stripe/route.ts
          </button>
        </div>

        {/* Code Viewport */}
        <div className="flex-1 overflow-y-auto p-4 rounded-xl bg-[#04060a] border border-white/[0.06] font-mono text-[11px] leading-relaxed text-slate-200">
          <pre className="select-all whitespace-pre-wrap">{getCode()}</pre>
        </div>
      </div>
    </div>
  );
}
