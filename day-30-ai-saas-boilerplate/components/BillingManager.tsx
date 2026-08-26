'use client';

import { useState } from 'react';
import { Invoice, Organization, PlanTier } from '@/types';
import { PLAN_CONFIGS } from '@/lib/sampleData';
import {
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Download,
  ExternalLink,
  Zap,
  Building2,
  Calendar,
  AlertCircle,
  FileText,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  activeOrg: Organization;
  invoices: Invoice[];
  onUpgradePlan: (plan: PlanTier, cycle: 'monthly' | 'yearly') => void;
}

export default function BillingManager({ activeOrg, invoices, onUpgradePlan }: Props) {
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [selectedTargetPlan, setSelectedTargetPlan] = useState<PlanTier>('pro');
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);

  const currentPlanConfig =
    PLAN_CONFIGS.find((p) => p.id === activeOrg.plan) || PLAN_CONFIGS[0];

  const handleOpenCheckout = (plan: PlanTier) => {
    setSelectedTargetPlan(plan);
    setShowCheckoutModal(true);
  };

  const handleCompleteCheckout = () => {
    setIsProcessingCheckout(true);
    setTimeout(() => {
      onUpgradePlan(selectedTargetPlan, activeOrg.billingCycle);
      setIsProcessingCheckout(false);
      setShowCheckoutModal(false);
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#10b981', '#6366f1'],
      });
    }, 1200);
  };

  const handleDownloadInvoice = (inv: Invoice) => {
    const text = `=========================================
          STRIPE TAX INVOICE RECEIPT
=========================================
Invoice Number: ${inv.number}
Date:           ${inv.date}
Customer:       ${activeOrg.name} (${activeOrg.stripeCustomerId || 'cus_N8x9P149qL'})
Subscription:   ${inv.planName}
Amount Paid:    $${inv.amount.toFixed(2)} USD
Status:         PAID (Card: •••• 4242)

Thank you for building with SaaSForge.AI!
Built by Abdul Nabi
=========================================`;

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${inv.number}.txt`;
    a.click();
  };

  return (
    <div className="space-y-6 font-mono text-xs text-slate-300">
      {/* 1. Subscription & Payment Method Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Current Active Plan */}
        <div className="p-5 rounded-xl bg-[#090d16] border border-white/[0.08] space-y-3 shadow-xl sre-card">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Current Subscription
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold uppercase text-[9px]">
              ACTIVE
            </span>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white font-mono">{currentPlanConfig.name}</h3>
            <p className="text-sm font-bold text-emerald-400 font-mono">
              ${activeOrg.billingCycle === 'yearly' ? currentPlanConfig.yearlyPrice : currentPlanConfig.monthlyPrice}
              <span className="text-xs text-slate-500 font-normal"> /{activeOrg.billingCycle}</span>
            </p>
          </div>

          <div className="text-[10px] text-slate-400 pt-1 border-t border-white/[0.06] space-y-1">
            <p>Next billing renewal: {new Date(activeOrg.currentPeriodEnd).toLocaleDateString()}</p>
            <p>
              Credits:{' '}
              <strong className="text-white">
                {Math.min(activeOrg.creditsTotal, Math.max(0, activeOrg.creditsRemaining))} /{' '}
                {activeOrg.creditsTotal}
              </strong>
            </p>
          </div>
        </div>

        {/* Payment Method */}
        <div className="p-5 rounded-xl bg-[#090d16] border border-white/[0.08] space-y-3 shadow-xl sre-card">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Primary Payment Method
            </span>
            <CreditCard className="w-4 h-4 text-indigo-400" />
          </div>

          <div className="flex items-center gap-3">
            <div className="px-2.5 py-1.5 rounded bg-white text-black font-extrabold text-[10px] font-mono">
              VISA
            </div>
            <div>
              <p className="font-bold text-white text-xs font-mono">•••• •••• •••• 4242</p>
              <p className="text-[10px] text-slate-500">Expires 12/28 • Default</p>
            </div>
          </div>

          <div className="pt-2 border-t border-white/[0.06]">
            <a
              href="https://billing.stripe.com"
              target="_blank"
              rel="noreferrer"
              className="text-[11px] text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1"
            >
              <span>Manage in Stripe Customer Portal</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Quick Upgrade Callout */}
        <div className="p-5 rounded-xl bg-gradient-to-br from-indigo-950/40 via-purple-950/20 to-[#090d16] border border-indigo-500/30 space-y-3 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-indigo-400 font-bold text-[10px] uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Scale Capacity</span>
            </div>
            <h4 className="font-bold text-white text-sm mt-1">Need More AI Quota?</h4>
            <p className="text-[10px] text-slate-400 mt-1 prose-text leading-relaxed">
              Unlock 5,000 monthly credits, custom models, and dedicated SLA with Enterprise Scale.
            </p>
          </div>

          <button
            type="button"
            onClick={() => handleOpenCheckout(activeOrg.plan === 'enterprise' ? 'pro' : 'enterprise')}
            className="w-full py-2 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-xs transition-colors cursor-pointer text-center font-mono shadow-md"
          >
            {activeOrg.plan === 'enterprise' ? 'Modify Tier' : 'Upgrade to Enterprise →'}
          </button>
        </div>
      </div>

      {/* 2. Plan Comparison & Change Actions */}
      <div className="p-5 rounded-xl bg-[#090d16] border border-white/[0.08] space-y-4 shadow-xl sre-card">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
          <h3 className="font-bold text-white text-xs font-mono uppercase tracking-wider">
            Tier Management &amp; Upgrade Actions
          </h3>
          <span className="text-[10px] text-slate-400">Organization: {activeOrg.name}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {PLAN_CONFIGS.map((plan) => {
            const isCurrent = activeOrg.plan === plan.id;
            return (
              <div
                key={plan.id}
                className={`p-4 rounded-lg border transition-all flex flex-col justify-between space-y-3 ${
                  isCurrent
                    ? 'bg-[#0f1422] border-emerald-500/50'
                    : 'bg-[#04060a] border-white/[0.06] hover:border-white/[0.12]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs font-mono">{plan.name}</span>
                    {isCurrent && (
                      <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-bold">
                        CURRENT
                      </span>
                    )}
                  </div>
                  <p className="text-base font-bold text-emerald-400 font-mono mt-1">
                    ${plan.monthlyPrice}/mo
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">{plan.creditsPerMonth} Credits included</p>
                </div>

                <button
                  type="button"
                  disabled={isCurrent}
                  onClick={() => handleOpenCheckout(plan.id)}
                  className={`w-full py-1.5 rounded text-xs font-bold font-mono transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-slate-800 text-slate-500 cursor-default'
                      : 'bg-emerald-500 text-black hover:bg-emerald-400'
                  }`}
                >
                  {isCurrent ? 'Current Plan' : `Switch to ${plan.name}`}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Invoices & Billing History */}
      <div className="p-5 rounded-xl bg-[#090d16] border border-white/[0.08] space-y-3.5 shadow-xl sre-card">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-slate-400" />
            <h3 className="font-bold text-white text-xs font-mono uppercase tracking-wider">
              Stripe Invoices &amp; Tax Receipts ({invoices.length})
            </h3>
          </div>
          <span className="text-slate-400 text-[10px]">Currency: USD ($)</span>
        </div>

        <div className="divide-y divide-white/[0.04]">
          {invoices.map((inv) => (
            <div key={inv.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white font-mono">{inv.number}</span>
                  <span className="px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-[9px] font-bold uppercase">
                    {inv.status}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500">
                  {inv.date} • {inv.planName}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <span className="font-bold text-white font-mono">${inv.amount.toFixed(2)}</span>
                <button
                  type="button"
                  onClick={() => handleDownloadInvoice(inv)}
                  className="p-1.5 rounded bg-[#0f1422] hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title="Download receipt"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Simulated Stripe Checkout Modal */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#090d16] border border-emerald-500/40 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl font-mono text-xs">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-400" />
                <h4 className="font-bold text-white text-sm font-mono">
                  Stripe Checkout Simulator
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setShowCheckoutModal(false)}
                className="text-slate-500 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-[#04060a] border border-white/[0.06] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Upgrading Workspace:</span>
                <strong className="text-white">{activeOrg.name}</strong>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Target Plan:</span>
                <strong className="text-emerald-400 uppercase">{selectedTargetPlan} TIER</strong>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Billing Cycle:</span>
                <strong className="text-white uppercase">{activeOrg.billingCycle}</strong>
              </div>
              <div className="flex items-center justify-between text-xs pt-2 border-t border-white/[0.06]">
                <span className="text-slate-400 font-bold">Total Due Today:</span>
                <strong className="text-emerald-400 text-sm font-mono">
                  ${selectedTargetPlan === 'enterprise' ? '99.00' : selectedTargetPlan === 'pro' ? '19.00' : '0.00'} USD
                </strong>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 prose-text leading-relaxed">
              In production, this initiates Stripe Checkout (`https://checkout.stripe.com/pay/...`) and handles webhook verification to provision Supabase RLS database records.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCheckoutModal(false)}
                className="px-3.5 py-1.5 rounded-lg bg-[#0f1422] text-slate-400 text-xs font-mono"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCompleteCheckout}
                disabled={isProcessingCheckout}
                className="px-4 py-2 rounded-lg bg-emerald-500 text-black font-extrabold text-xs font-mono hover:bg-emerald-400 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isProcessingCheckout ? 'animate-spin' : ''}`} />
                <span>{isProcessingCheckout ? 'Verifying with Stripe...' : 'Confirm Subscription Upgrade'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
