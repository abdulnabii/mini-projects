'use client';

import { useState } from 'react';
import { PlanConfig, PlanTier } from '@/types';
import { PLAN_CONFIGS } from '@/lib/sampleData';
import {
  Sparkles,
  Zap,
  ShieldCheck,
  CreditCard,
  Building2,
  Sliders,
  CheckCircle2,
  ArrowRight,
  Terminal,
  Code2,
  Rocket,
  Lock,
  Layers,
  Flame,
} from 'lucide-react';

interface Props {
  currentPlan: PlanTier;
  onSelectPlan: (plan: PlanTier, cycle: 'monthly' | 'yearly') => void;
  onLaunchPlayground: () => void;
  onOpenDevModal: () => void;
}

export default function HeroMarketing({
  currentPlan,
  onSelectPlan,
  onLaunchPlayground,
  onOpenDevModal,
}: Props) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <div className="space-y-12 font-mono text-xs text-slate-300">
      {/* 1. Hero Banner */}
      <section className="text-center space-y-4 max-w-4xl mx-auto pt-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-emerald-500/10 via-indigo-500/10 to-purple-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>PRODUCTION-READY FULL-STACK AI SAAS STARTER KIT</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-tight font-mono leading-tight">
          Ship Any AI Micro-SaaS in <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-indigo-400">
            Hours, Not Weeks.
          </span>
        </h1>

        <p className="text-xs sm:text-sm text-slate-400 font-mono max-w-2xl mx-auto leading-relaxed prose-text">
          Complete production architecture with Clerk multi-tenant RBAC, Stripe subscription billing, Gemini 1.5 Flash token metering, Upstash rate limits, and executive SRE admin telemetry.
        </p>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-3 pt-2 flex-wrap">
          <button
            type="button"
            onClick={onLaunchPlayground}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 text-black font-extrabold hover:bg-emerald-400 transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20 font-mono text-xs"
          >
            <Zap className="w-4 h-4 fill-black" />
            <span>Launch Live AI Feature Studio</span>
          </button>

          <button
            type="button"
            onClick={onOpenDevModal}
            className="px-5 py-2.5 rounded-xl bg-[#0d121d] border border-white/[0.08] hover:border-white/[0.2] text-slate-200 hover:text-white transition-all flex items-center gap-2 cursor-pointer font-mono text-xs font-bold"
          >
            <Terminal className="w-4 h-4 text-indigo-400" />
            <span>View CLI `setup.sh` &amp; Schema</span>
          </button>
        </div>
      </section>

      {/* 2. Interactive Proof Point Elevation Callout */}
      <div
        onClick={onLaunchPlayground}
        className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/30 via-[#0b101d] to-indigo-950/30 border border-emerald-500/40 shadow-2xl shadow-emerald-500/10 cursor-pointer hover:border-emerald-400 transition-all group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500 text-black flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/30 group-hover:scale-105 transition-transform">
            <Zap className="w-5 h-5 fill-black" />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-sm font-mono">
                Interactive AI Feature Studio (Live Demo)
              </span>
              <span className="px-2 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[9px] font-bold uppercase animate-pulse">
                Try It Live
              </span>
            </div>
            <p className="text-xs text-slate-400 prose-text">
              Test real-time Gemini 1.5 Flash token metering with AI Copywriter, Full-Stack Architect, and SaaS Analyst personas.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs group-hover:translate-x-1 transition-transform shrink-0 font-mono">
          <span>Launch AI Playground</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>

      {/* 3. Feature Capability Matrix (4 Pillars) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-xl bg-[#090d16] border border-white/[0.08] space-y-2 sre-card">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Zap className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-white text-xs font-mono uppercase">AI Credit Metering</h3>
          <p className="text-[11px] text-slate-400 prose-text leading-relaxed">
            Atomic token bucket rate limiter via Upstash Redis. Deducts credits per input/output token automatically.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#090d16] border border-white/[0.08] space-y-2 sre-card">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <CreditCard className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-white text-xs font-mono uppercase">Stripe Billing Engine</h3>
          <p className="text-[11px] text-slate-400 prose-text leading-relaxed">
            Pre-built Checkout sessions, Customer Portal, webhooks, and metered usage overage charges.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#090d16] border border-white/[0.08] space-y-2 sre-card">
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Building2 className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-white text-xs font-mono uppercase">Multi-Tenant RBAC</h3>
          <p className="text-[11px] text-slate-400 prose-text leading-relaxed">
            Workspace organization switcher with Owner, Admin, Member, and Billing roles powered by Supabase RLS.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#090d16] border border-white/[0.08] space-y-2 sre-card">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Sliders className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-white text-xs font-mono uppercase">Dynamic Feature Flags</h3>
          <p className="text-[11px] text-slate-400 prose-text leading-relaxed">
            Toggle features dynamically by subscription tier (Custom Model weights, Slack Bridge, SSO/SAML).
          </p>
        </div>
      </div>

      {/* 4. Interactive Pricing Matrix with Clear Status Hierarchy */}
      <div className="space-y-6 pt-4">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-white font-mono">
            Transparent, Usage-Tiered Subscription Plans
          </h2>
          <p className="text-xs text-slate-400 prose-text">
            Choose your billing cadence and test subscription tier upgrading in real-time.
          </p>

          {/* Monthly / Yearly Toggle */}
          <div className="inline-flex items-center gap-1.5 p-1 rounded-xl bg-[#0d121d] border border-white/[0.08] mt-2">
            <button
              type="button"
              onClick={() => setBillingCycle('monthly')}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                billingCycle === 'monthly'
                  ? 'bg-emerald-500 text-black font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Monthly Billing
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle('yearly')}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                billingCycle === 'yearly'
                  ? 'bg-emerald-500 text-black font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Annual Billing</span>
              <span className="px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 text-[9px] font-bold">
                SAVE 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards with Single Status Rule */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {PLAN_CONFIGS.map((plan) => {
            const isCurrent = currentPlan === plan.id;
            const price = billingCycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;

            // Target badge logic: Never show both "Current Active Plan" and "Most Popular" on the same card!
            const showMostPopularBadge = !isCurrent && ((currentPlan === 'free' && plan.id === 'pro') || (currentPlan === 'pro' && plan.id === 'enterprise'));

            return (
              <div
                key={plan.id}
                className={`p-6 rounded-2xl border transition-all flex flex-col justify-between space-y-5 relative ${
                  isCurrent
                    ? 'bg-[#0f1524] border-emerald-500/60 shadow-2xl shadow-emerald-500/10 ring-1 ring-emerald-500/30'
                    : showMostPopularBadge
                    ? 'bg-[#0b101c] border-indigo-500/50 shadow-xl'
                    : 'bg-[#090d16] border-white/[0.08] hover:border-white/[0.15]'
                }`}
              >
                {/* Single Status Badge */}
                {isCurrent ? (
                  <span className="absolute -top-2.5 right-6 px-2.5 py-0.5 rounded-full bg-emerald-500 text-black font-extrabold text-[9px] font-mono shadow-md">
                    CURRENT ACTIVE PLAN
                  </span>
                ) : showMostPopularBadge ? (
                  <span className="absolute -top-2.5 right-6 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 text-black font-extrabold text-[9px] font-mono shadow-md">
                    {currentPlan === 'free' ? 'MOST POPULAR' : 'RECOMMENDED UPGRADE'}
                  </span>
                ) : null}

                <div className="space-y-3">
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-white font-mono">{plan.name}</h3>
                    <p className="text-[11px] text-slate-400 prose-text leading-relaxed">
                      {plan.description}
                    </p>
                  </div>

                  <div className="flex items-baseline gap-1 pt-1">
                    <span className="text-3xl font-bold text-white font-mono">
                      ${price}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      /{billingCycle === 'yearly' ? 'year' : 'month'}
                    </span>
                  </div>

                  <div className="p-2 rounded-lg bg-[#04060a] border border-white/[0.06] flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Monthly AI Quota:</span>
                    <strong className="text-emerald-400 font-mono">{plan.creditsPerMonth} Credits</strong>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-white/[0.06]">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      Included Capabilities:
                    </span>
                    {plan.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-[11px] text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  disabled={isCurrent}
                  onClick={() => onSelectPlan(plan.id, billingCycle)}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs font-mono transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    isCurrent
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 cursor-default'
                      : showMostPopularBadge
                      ? 'bg-emerald-500 text-black hover:bg-emerald-400 shadow-md shadow-emerald-500/20'
                      : 'bg-[#0f1422] text-white hover:bg-[#161f33] border border-white/[0.08]'
                  }`}
                >
                  <span>{isCurrent ? 'Active Plan' : `Upgrade to ${plan.name}`}</span>
                  {!isCurrent && <ArrowRight className="w-3.5 h-3.5" />}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
