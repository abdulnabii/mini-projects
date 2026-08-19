'use client';

import { SPOFItem } from '@/types';
import { ShieldAlert, ShieldCheck, AlertTriangle, Activity, RefreshCw, CheckCircle2 } from 'lucide-react';

interface Props {
  spofAudit: {
    overallReliabilityScore: number;
    rpoMinutes: number;
    rtoMinutes: number;
    risks: SPOFItem[];
  };
}

export default function SPOFAuditCard({ spofAudit }: Props) {
  const score = spofAudit.overallReliabilityScore;

  const getScoreColor = (s: number) => {
    if (s >= 90) return 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10 shadow-emerald-500/20';
    if (s >= 75) return 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10 shadow-cyan-500/20';
    if (s >= 60) return 'text-amber-400 border-amber-500/40 bg-amber-500/10 shadow-amber-500/20';
    return 'text-rose-500 border-rose-500/40 bg-rose-500/10 shadow-rose-500/20';
  };

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-[#0b1220] border border-slate-800 space-y-6 font-mono text-xs text-slate-300 shadow-xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
              HIGH AVAILABILITY AUDIT
            </span>
            <span className="text-[10px] text-slate-500">• Multi-AZ Failover Analysis</span>
          </div>
          <h3 className="font-bold text-white text-base font-outfit">
            Reliability &amp; Single Point of Failure (SPOF) Security Matrix
          </h3>
          <p className="text-xs text-slate-400">
            Identifies bottlenecks, database master failover windows, and disaster recovery metrics
          </p>
        </div>

        {/* Reliability Scorecard */}
        <div className="flex items-center gap-3">
          <div
            className={`px-4 py-3 rounded-2xl border-2 flex items-center gap-3 shadow-xl ${getScoreColor(
              score
            )}`}
          >
            <ShieldCheck className="w-6 h-6" />
            <div>
              <span className="text-2xl font-black font-outfit leading-none">{score}%</span>
              <span className="block text-[8px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">
                Reliability Index
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* DR Objectives Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-0.5">
          <span className="text-[9px] text-slate-500 uppercase font-bold">Target SLA</span>
          <p className="text-lg font-black text-emerald-400 font-outfit">99.99%</p>
          <span className="text-[9px] text-slate-500">&lt; 4.3m downtime/mo</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-0.5">
          <span className="text-[9px] text-slate-500 uppercase font-bold">Recovery Point (RPO)</span>
          <p className="text-lg font-black text-cyan-400 font-outfit">&le; {spofAudit.rpoMinutes} Min</p>
          <span className="text-[9px] text-slate-500">Max allowable data loss</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-0.5">
          <span className="text-[9px] text-slate-500 uppercase font-bold">Recovery Time (RTO)</span>
          <p className="text-lg font-black text-amber-400 font-outfit">&le; {spofAudit.rtoMinutes} Min</p>
          <span className="text-[9px] text-slate-500">Auto-failover duration</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-0.5">
          <span className="text-[9px] text-slate-500 uppercase font-bold">AZ Redundancy</span>
          <p className="text-lg font-black text-indigo-300 font-outfit">3 Availability Zones</p>
          <span className="text-[9px] text-slate-500">Cross-AZ mesh network</span>
        </div>
      </div>

      {/* SPOF Identified Vulnerabilities & Mitigations */}
      <div className="space-y-3">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          Detected Single Points of Failure &amp; Failover Mitigations:
        </label>

        <div className="space-y-3">
          {spofAudit.risks.map((risk, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                      risk.severity === 'CRITICAL'
                        ? 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
                        : risk.severity === 'HIGH'
                        ? 'bg-amber-500/10 border border-amber-500/30 text-amber-400'
                        : 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-400'
                    }`}
                  >
                    {risk.severity} RISK
                  </span>
                  <h4 className="font-bold text-white text-xs font-outfit">{risk.componentName}</h4>
                </div>
              </div>

              <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                <strong>Vulnerability:</strong> {risk.riskDescription}
              </p>

              <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-emerald-200 text-[10px] space-y-0.5">
                <span className="font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Failover Mitigation Protocol:
                </span>
                <p className="font-sans leading-relaxed">{risk.failoverMitigation}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
