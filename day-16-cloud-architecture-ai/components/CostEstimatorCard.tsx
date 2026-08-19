'use client';

import { CostBreakdownItem } from '@/types';
import { DollarSign, TrendingDown, Server, Database, Zap, Globe, MessageSquare, AlertCircle } from 'lucide-react';

interface Props {
  costBreakdown: {
    totalMonthlyUSD: number;
    items: CostBreakdownItem[];
  };
  provider: string;
}

export default function CostEstimatorCard({ costBreakdown, provider }: Props) {
  const totalMonthly = costBreakdown.totalMonthlyUSD;
  const annualRunRate = totalMonthly * 12;

  const getCategoryIcon = (cat: CostBreakdownItem['category']) => {
    switch (cat) {
      case 'Compute':
        return Server;
      case 'Database':
        return Database;
      case 'Cache':
        return Zap;
      case 'Networking':
        return Globe;
      case 'Messaging':
        return MessageSquare;
      default:
        return Server;
    }
  };

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-[#0b1220] border border-slate-800 space-y-6 font-mono text-xs text-slate-300 shadow-xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/30">
              FINANCIAL TELEMETRY
            </span>
            <span className="text-[10px] text-slate-500">• {provider} Pricing Tier</span>
          </div>
          <h3 className="font-bold text-white text-base font-outfit">
            Projected Monthly Cloud Infrastructure Bill
          </h3>
          <p className="text-xs text-slate-400">
            Granular itemized cost breakdown modeled on standard on-demand and reserved instances
          </p>
        </div>

        {/* Bill Summary Pill */}
        <div className="flex items-center gap-3">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-0.5 shadow-xl">
            <span className="text-2xl sm:text-3xl font-black text-amber-400 font-outfit">
              ${totalMonthly.toLocaleString()}
              <span className="text-xs text-slate-500 font-normal">/mo</span>
            </span>
            <span className="block text-[9px] font-bold text-slate-400 uppercase">
              ~${annualRunRate.toLocaleString()}/yr Run-Rate
            </span>
          </div>
        </div>
      </div>

      {/* Itemized Service Breakdown Table */}
      <div className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {costBreakdown.items.map((item, idx) => {
            const Icon = getCategoryIcon(item.category);
            const percentOfTotal = Math.round((item.estimatedMonthlyUSD / (totalMonthly || 1)) * 100);

            return (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800/80 space-y-2 flex flex-col justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-amber-400">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-bold text-white text-xs font-outfit">{item.serviceName}</span>
                    </div>

                    <span className="text-xs font-black text-amber-300 font-outfit">
                      ${item.estimatedMonthlyUSD}/mo
                    </span>
                  </div>

                  <p className="text-[10px] text-slate-400 font-sans">{item.specs}</p>
                </div>

                <div className="space-y-1 border-t border-slate-900 pt-2 text-[9px] text-slate-500 flex items-center justify-between">
                  <span>Driver: {item.costDriver}</span>
                  <span className="text-amber-400/80 font-bold">{percentOfTotal}% of bill</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cost Optimization Recommendation Callout */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/30 via-slate-950 to-slate-950 border border-emerald-500/30 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2.5">
          <TrendingDown className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-[11px] text-emerald-200">
            <strong>FinOps Pro Tip:</strong> Switching from On-Demand compute to 1-Year Compute Savings Plans &amp; Graviton instances can reduce this monthly bill by <strong>~32% (${Math.round(totalMonthly * 0.32)}/mo savings)</strong>.
          </span>
        </div>
      </div>
    </div>
  );
}
