'use client';

import { useState } from 'react';
import { Organization } from '@/types';
import {
  Sliders,
  Shield,
  Check,
  X,
  Lock,
  Zap,
  Globe,
  Radio,
  Key,
  Users,
  Sparkles,
} from 'lucide-react';

interface Props {
  activeOrg: Organization;
}

const FLAGS = [
  {
    id: 'flag_metered_ai',
    name: 'Gemini 1.5 Flash AI Engine',
    description: 'Core LLM inference access with per-token atomic metering.',
    minPlan: 'free',
    icon: Zap,
  },
  {
    id: 'flag_multi_seat',
    name: 'Multi-Tenant Seat Management (RBAC)',
    description: 'Invite team members with Admin, Member, and Billing roles.',
    minPlan: 'pro',
    icon: Users,
  },
  {
    id: 'flag_priority_gpu',
    name: 'Sub-Second Priority GPU Inference',
    description: 'Guaranteed sub-400ms inference queue with zero cold-starts.',
    minPlan: 'pro',
    icon: Sparkles,
  },
  {
    id: 'flag_custom_domain',
    name: 'Custom Domain White-Labeling',
    description: 'Host customer-facing AI applications under your custom CNAME.',
    minPlan: 'pro',
    icon: Globe,
  },
  {
    id: 'flag_slack_bridge',
    name: 'Real-Time Slack War-Room Bridge',
    description: 'Automated usage and quota alerts dispatched into Slack channels.',
    minPlan: 'pro',
    icon: Radio,
  },
  {
    id: 'flag_sso_saml',
    name: 'Enterprise SSO / SAML & Okta Integration',
    description: 'Single Sign-On authentication for enterprise compliance.',
    minPlan: 'enterprise',
    icon: Lock,
  },
  {
    id: 'flag_zero_retention',
    name: 'Zero Data Retention & Custom Fine-Tuning',
    description: 'No LLM training on customer prompts + dedicated fine-tuned checkpoints.',
    minPlan: 'enterprise',
    icon: Key,
  },
];

export default function FeatureFlagsPanel({ activeOrg }: Props) {
  const isEnabled = (minPlan: string) => {
    if (minPlan === 'free') return true;
    if (minPlan === 'pro') return activeOrg.plan === 'pro' || activeOrg.plan === 'enterprise';
    if (minPlan === 'enterprise') return activeOrg.plan === 'enterprise';
    return false;
  };

  return (
    <div className="space-y-6 font-mono text-xs text-slate-300">
      {/* 1. Header */}
      <div className="p-5 rounded-xl bg-[#090d16] border border-white/[0.08] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xl sre-card">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-white text-xs font-mono uppercase tracking-wider">
              Feature Flags &amp; Plan Entitlements Engine
            </h3>
            <p className="text-[10px] text-slate-400 font-mono">
              Workspace: <strong className="text-white">{activeOrg.name}</strong> • Active Tier: <strong className="text-emerald-400 uppercase">{activeOrg.plan}</strong>
            </p>
          </div>
        </div>

        <span className="px-2.5 py-1 rounded bg-[#0f1422] border border-white/[0.08] text-slate-300 text-[10px] font-bold uppercase">
          Dynamic Gating: Active
        </span>
      </div>

      {/* 2. Feature Flags List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {FLAGS.map((flag) => {
          const enabled = isEnabled(flag.minPlan);
          const Icon = flag.icon;

          return (
            <div
              key={flag.id}
              className={`p-4 rounded-xl border transition-all space-y-2 flex flex-col justify-between ${
                enabled
                  ? 'bg-[#090d16] border-white/[0.08] hover:border-emerald-500/40'
                  : 'bg-[#06080e] border-white/[0.04] opacity-60'
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-6 h-6 rounded flex items-center justify-center ${
                        enabled
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-bold text-white text-xs font-mono">{flag.name}</span>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[9px] font-bold border uppercase font-mono ${
                      enabled
                        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400 border-white/[0.06]'
                    }`}
                  >
                    {enabled ? 'UNLOCKED' : `REQUIRES ${flag.minPlan.toUpperCase()}`}
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 prose-text leading-relaxed pl-8">
                  {flag.description}
                </p>
              </div>

              <div className="flex items-center justify-between text-[10px] pt-2 border-t border-white/[0.04] pl-8">
                <span className="text-slate-500">Tier: {flag.minPlan.toUpperCase()}</span>
                <span className={`font-bold ${enabled ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {enabled ? 'Active for this Org' : 'Upgrade Required'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
