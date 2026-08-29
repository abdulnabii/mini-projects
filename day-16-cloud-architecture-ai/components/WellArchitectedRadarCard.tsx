'use client';

import { WellArchitectedScore } from '@/types';
import {
  ShieldCheck,
  RefreshCw,
  Zap,
  DollarSign,
  Cpu,
  Leaf,
  Award,
  CheckCircle2,
  AlertTriangle,
  Compass,
} from 'lucide-react';

interface Props {
  score: WellArchitectedScore;
  provider: string;
}

export default function WellArchitectedRadarCard({ score, provider }: Props) {
  const pillars = [
    {
      id: 'security',
      title: 'Security & Compliance',
      score: score.security,
      icon: ShieldCheck,
      color: 'emerald',
      detail: 'WAF L7 filters, TLS 1.3, KMS envelope encryption & IAM roles',
    },
    {
      id: 'reliability',
      title: 'Reliability & Multi-AZ Failover',
      score: score.reliability,
      icon: RefreshCw,
      color: 'cyan',
      detail: 'Cross-AZ auto-failover, health checks & automated self-healing',
    },
    {
      id: 'performance',
      title: 'Performance Efficiency',
      score: score.performance,
      icon: Zap,
      color: 'amber',
      detail: 'Sub-50ms P99 latency, Redis caching & horizontal auto-scaling',
    },
    {
      id: 'cost',
      title: 'Cost Optimization (FinOps)',
      score: score.costOptimization,
      icon: DollarSign,
      color: 'teal',
      detail: 'Right-sized compute tasks, reserved instances & zero idle waste',
    },
    {
      id: 'ops',
      title: 'Operational Excellence',
      score: score.operationalExcellence,
      icon: Cpu,
      color: 'indigo',
      detail: 'Automated Terraform/IaC blueprints & telemetry observability',
    },
    {
      id: 'sustainability',
      title: 'Environmental Sustainability',
      score: score.sustainability,
      icon: Leaf,
      color: 'lime',
      detail: 'ARM64 Graviton/Ampere silicon compute & optimal resource density',
    },
  ];

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-[#090d16] border border-cyan-500/30 space-y-6 font-mono text-xs text-slate-300 shadow-2xl sre-card">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/30 font-mono">
              CLOUD ARCHITECTURE AUDIT
            </span>
            <span className="text-[10px] text-slate-500">• {provider} Well-Architected Framework</span>
          </div>
          <h3 className="font-bold text-white text-base font-outfit">
            6-Pillar Well-Architected Framework Assessment
          </h3>
          <p className="text-xs text-slate-400 font-sans">
            Evaluates system design against enterprise cloud standards for security, resilience, and performance
          </p>
        </div>

        {/* Overall Scorecard Badge */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="px-5 py-3 rounded-2xl bg-[#04080e] border border-cyan-500/40 text-center space-y-0.5 shadow-lg shadow-cyan-500/10">
            <span className="text-3xl font-black font-outfit text-cyan-400 leading-none">
              {score.overallScore}
              <span className="text-xs font-normal text-slate-500 font-mono">/100</span>
            </span>
            <span className="block text-[8px] font-bold text-slate-400 uppercase tracking-wider">
              Architecture Health
            </span>
          </div>
        </div>
      </div>

      {/* 6-Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {pillars.map((p) => {
          const Icon = p.icon;
          return (
            <div
              key={p.id}
              className="p-4 rounded-2xl bg-[#04080e] border border-white/[0.06] hover:border-cyan-500/30 transition-all space-y-2.5 flex flex-col justify-between"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-[#0e1424] border border-white/[0.08] text-cyan-400">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-bold text-white text-xs font-outfit">{p.title}</span>
                  </div>
                  <span className="font-black text-cyan-400 font-mono text-sm">{p.score}%</span>
                </div>

                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
                    style={{ width: `${p.score}%` }}
                  />
                </div>
              </div>

              <p className="text-[10px] text-slate-400 font-sans leading-relaxed border-t border-white/[0.04] pt-2">
                {p.detail}
              </p>
            </div>
          );
        })}
      </div>

      {/* Framework Summary Banner */}
      <div className="p-4 rounded-2xl bg-[#04080e] border border-emerald-500/30 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          <p className="text-xs text-slate-200 font-sans leading-relaxed">
            <strong>Framework Conclusion:</strong> {score.frameworkSummary}
          </p>
        </div>
      </div>
    </div>
  );
}
