'use client';

import { useState } from 'react';
import { AdminMetrics } from '@/types';
import {
  BarChart3,
  DollarSign,
  Users,
  TrendingDown,
  Activity,
  Zap,
  Bell,
  CheckCircle2,
  AlertTriangle,
  Mail,
  Shield,
  Layers,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  metrics: AdminMetrics;
}

export default function AdminDashboard({ metrics }: Props) {
  const [alertSent, setAlertSent] = useState(false);
  const [selectedCohort, setSelectedCohort] = useState<'daily' | 'weekly' | 'monthly'>('monthly');

  const handleTriggerUsageAlert = () => {
    setAlertSent(true);
    setTimeout(() => setAlertSent(false), 3000);
    confetti({
      particleCount: 25,
      spread: 50,
      origin: { y: 0.7 },
      colors: ['#f59e0b', '#10b981'],
    });
  };

  return (
    <div className="space-y-6 font-mono text-xs text-slate-300">
      {/* 1. Top Executive Metric Cards (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* MRR */}
        <div className="p-4 rounded-xl bg-[#090d16] border border-emerald-500/30 space-y-1.5 shadow-xl sre-card">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">
              Monthly Recurring Revenue (MRR)
            </span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-white font-mono">
            ${metrics.mrr.toLocaleString()}
          </p>
          <div className="flex items-center gap-1 text-[10px] text-emerald-400 pt-1 border-t border-white/[0.06]">
            <span>+14.8% net expansion this month</span>
          </div>
        </div>

        {/* ARR */}
        <div className="p-4 rounded-xl bg-[#090d16] border border-white/[0.08] space-y-1.5 shadow-xl sre-card">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">
              Annualized Run Rate (ARR)
            </span>
            <BarChart3 className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-bold text-indigo-400 font-mono">
            ${metrics.arr.toLocaleString()}
          </p>
          <div className="flex items-center gap-1 text-[10px] text-slate-400 pt-1 border-t border-white/[0.06]">
            <span>Based on {metrics.totalOrganizations} organizations</span>
          </div>
        </div>

        {/* Active Users */}
        <div className="p-4 rounded-xl bg-[#090d16] border border-white/[0.08] space-y-1.5 shadow-xl sre-card">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">
              Total Active Developers
            </span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-bold text-cyan-400 font-mono">
            {metrics.activeUsers.toLocaleString()}
          </p>
          <div className="flex items-center gap-1 text-[10px] text-slate-400 pt-1 border-t border-white/[0.06]">
            <span>Churn Rate: <strong className="text-emerald-400">{metrics.churnRatePct}%</strong> (Top Tier)</span>
          </div>
        </div>

        {/* AI API Calls */}
        <div className="p-4 rounded-xl bg-[#090d16] border border-white/[0.08] space-y-1.5 shadow-xl sre-card">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">
              AI Invocations Today
            </span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-amber-400 font-mono">
            {metrics.totalAICallsToday.toLocaleString()}
          </p>
          <div className="flex items-center gap-1 text-[10px] text-slate-400 pt-1 border-t border-white/[0.06]">
            <span>Avg Latency: <strong className="text-white">412ms</strong> (Gemini 1.5)</span>
          </div>
        </div>
      </div>

      {/* 2. Plan Distribution & AI Feature Share Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Plan Tier Distribution */}
        <div className="p-5 rounded-xl bg-[#090d16] border border-white/[0.08] space-y-4 shadow-xl sre-card">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
            <h3 className="font-bold text-white text-xs font-mono uppercase tracking-wider">
              Subscription Tier Distribution
            </h3>
            <span className="text-[10px] text-slate-400">{metrics.totalOrganizations} Organizations</span>
          </div>

          <div className="space-y-3">
            {metrics.planDistribution.map((item) => (
              <div key={item.plan} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="capitalize font-bold text-white font-mono">{item.plan} Plan</span>
                  <span className="text-slate-400">
                    <strong className="text-white">{item.count}</strong> orgs ({item.percentage}%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#04080e] overflow-hidden border border-white/[0.04]">
                  <div
                    className={`h-full rounded-full ${
                      item.plan === 'enterprise'
                        ? 'bg-purple-500'
                        : item.plan === 'pro'
                        ? 'bg-emerald-500'
                        : 'bg-slate-500'
                    }`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top AI Feature Engine Usage Breakdown */}
        <div className="p-5 rounded-xl bg-[#090d16] border border-white/[0.08] space-y-4 shadow-xl sre-card">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
            <h3 className="font-bold text-white text-xs font-mono uppercase tracking-wider">
              AI Engine Utilization Share
            </h3>
            <span className="text-[10px] text-slate-400">Past 30 Days</span>
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white font-mono">1. AI Copywriter Engine</span>
                <span className="text-emerald-400 font-bold">35,368 calls (42%)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#04080e] overflow-hidden border border-white/[0.04]">
                <div className="h-full bg-emerald-400 rounded-full" style={{ width: '42%' }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white font-mono">2. AI Full-Stack Architect</span>
                <span className="text-indigo-400 font-bold">30,315 calls (36%)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#04080e] overflow-hidden border border-white/[0.04]">
                <div className="h-full bg-indigo-400 rounded-full" style={{ width: '36%' }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white font-mono">3. SaaS Metrics Analyst</span>
                <span className="text-amber-400 font-bold">18,527 calls (22%)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#04080e] overflow-hidden border border-white/[0.04]">
                <div className="h-full bg-amber-400 rounded-full" style={{ width: '22%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Automated Resend Usage Alert Simulator */}
      <div className="p-5 rounded-xl bg-[#090d16] border border-white/[0.08] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl sre-card">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-white text-xs font-mono uppercase">
              Automated Quota Alert Email Dispatcher (Resend Integration)
            </h4>
            <p className="text-[10px] text-slate-400 prose-text">
              Dispatches transactional emails when organizations cross 80% or 100% of their monthly AI credits.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleTriggerUsageAlert}
          className="px-4 py-2 rounded-lg bg-[#0f1422] border border-amber-500/40 text-amber-300 hover:text-white hover:bg-amber-500/20 transition-all flex items-center gap-1.5 cursor-pointer font-mono text-xs font-bold shrink-0"
        >
          {alertSent ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Mail className="w-3.5 h-3.5 text-amber-400" />}
          <span>{alertSent ? 'Transactional Email Dispatched!' : 'Simulate 80% Quota Email Alert'}</span>
        </button>
      </div>
    </div>
  );
}
