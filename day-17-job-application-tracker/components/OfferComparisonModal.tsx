'use client';

import { useState } from 'react';
import { JobApplication } from '@/types';
import { X, DollarSign, Award, TrendingUp, Sparkles, Scale, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  offerJobs: JobApplication[];
}

export default function OfferComparisonModal({ isOpen, onClose, offerJobs }: Props) {
  const [offerA, setOfferA] = useState({
    company: offerJobs[0]?.companyName || 'TechCorp Inc.',
    role: offerJobs[0]?.roleTitle || 'Senior Full-Stack Engineer',
    baseSalary: 165000,
    annualBonus: 20000,
    equityPerYear: 35000,
    benefits401k: 9000,
    remoteStipend: 3000,
  });

  const [offerB, setOfferB] = useState({
    company: offerJobs[1]?.companyName || 'CloudScale AI',
    role: offerJobs[1]?.roleTitle || 'Staff Infrastructure Engineer',
    baseSalary: 180000,
    annualBonus: 15000,
    equityPerYear: 50000,
    benefits401k: 6000,
    remoteStipend: 4000,
  });

  if (!isOpen) return null;

  const totalA = offerA.baseSalary + offerA.annualBonus + offerA.equityPerYear + offerA.benefits401k + offerA.remoteStipend;
  const totalB = offerB.baseSalary + offerB.annualBonus + offerB.equityPerYear + offerB.benefits401k + offerB.remoteStipend;
  const delta = Math.abs(totalB - totalA);
  const winner = totalB >= totalA ? offerB.company : offerA.company;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 font-mono text-xs text-slate-300">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#090d16] border-2 border-emerald-500/40 p-6 sm:p-8 space-y-6 shadow-2xl shadow-emerald-500/20 sre-card">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base font-outfit">
                Total Compensation (TC) &amp; Offer Comparison Matrix
              </h3>
              <p className="text-xs text-slate-400 font-sans">
                Side-by-side financial breakdown calculating base, bonus, annualized equity, and 401(k) matching
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#04080e] border border-white/[0.08] text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Winner Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-[#04080e] to-cyan-950/40 border border-emerald-500/40 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2.5">
            <Award className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="text-xs text-emerald-200 font-sans">
              <strong>Higher Total Compensation Package:</strong> <span className="text-white font-bold">{winner}</span> leads by <strong>+${delta.toLocaleString()}/year</strong> in total annualized value.
            </span>
          </div>
          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
            TC Leader
          </span>
        </div>

        {/* Side-by-Side Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Offer A */}
          <div className="p-5 rounded-2xl bg-[#04080e] border border-white/[0.08] space-y-4 shadow-lg">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <div className="space-y-0.5">
                <input
                  type="text"
                  value={offerA.company}
                  onChange={(e) => setOfferA({ ...offerA, company: e.target.value })}
                  className="font-bold text-white text-sm font-outfit bg-transparent border-b border-slate-700 focus:outline-none focus:border-emerald-500"
                />
                <input
                  type="text"
                  value={offerA.role}
                  onChange={(e) => setOfferA({ ...offerA, role: e.target.value })}
                  className="text-[11px] text-slate-400 bg-transparent focus:outline-none"
                />
              </div>
              <div className="text-right">
                <span className="text-xl font-black text-emerald-400 font-outfit">
                  ${totalA.toLocaleString()}
                </span>
                <span className="block text-[8px] font-bold text-slate-500 uppercase">Annual TC</span>
              </div>
            </div>

            <div className="space-y-2.5 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Base Salary ($):</span>
                <input
                  type="number"
                  value={offerA.baseSalary}
                  onChange={(e) => setOfferA({ ...offerA, baseSalary: Number(e.target.value) })}
                  className="w-28 px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-right text-white font-mono"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Annual Target Bonus ($):</span>
                <input
                  type="number"
                  value={offerA.annualBonus}
                  onChange={(e) => setOfferA({ ...offerA, annualBonus: Number(e.target.value) })}
                  className="w-28 px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-right text-white font-mono"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Annual Equity / RSU ($):</span>
                <input
                  type="number"
                  value={offerA.equityPerYear}
                  onChange={(e) => setOfferA({ ...offerA, equityPerYear: Number(e.target.value) })}
                  className="w-28 px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-right text-white font-mono"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">401(k) Company Match ($):</span>
                <input
                  type="number"
                  value={offerA.benefits401k}
                  onChange={(e) => setOfferA({ ...offerA, benefits401k: Number(e.target.value) })}
                  className="w-28 px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-right text-white font-mono"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Remote / Wellness Stipend ($):</span>
                <input
                  type="number"
                  value={offerA.remoteStipend}
                  onChange={(e) => setOfferA({ ...offerA, remoteStipend: Number(e.target.value) })}
                  className="w-28 px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-right text-white font-mono"
                />
              </div>
            </div>
          </div>

          {/* Offer B */}
          <div className="p-5 rounded-2xl bg-[#04080e] border border-white/[0.08] space-y-4 shadow-lg">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <div className="space-y-0.5">
                <input
                  type="text"
                  value={offerB.company}
                  onChange={(e) => setOfferB({ ...offerB, company: e.target.value })}
                  className="font-bold text-white text-sm font-outfit bg-transparent border-b border-slate-700 focus:outline-none focus:border-cyan-500"
                />
                <input
                  type="text"
                  value={offerB.role}
                  onChange={(e) => setOfferB({ ...offerB, role: e.target.value })}
                  className="text-[11px] text-slate-400 bg-transparent focus:outline-none"
                />
              </div>
              <div className="text-right">
                <span className="text-xl font-black text-cyan-400 font-outfit">
                  ${totalB.toLocaleString()}
                </span>
                <span className="block text-[8px] font-bold text-slate-500 uppercase">Annual TC</span>
              </div>
            </div>

            <div className="space-y-2.5 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Base Salary ($):</span>
                <input
                  type="number"
                  value={offerB.baseSalary}
                  onChange={(e) => setOfferB({ ...offerB, baseSalary: Number(e.target.value) })}
                  className="w-28 px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-right text-white font-mono"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Annual Target Bonus ($):</span>
                <input
                  type="number"
                  value={offerB.annualBonus}
                  onChange={(e) => setOfferB({ ...offerB, annualBonus: Number(e.target.value) })}
                  className="w-28 px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-right text-white font-mono"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Annual Equity / RSU ($):</span>
                <input
                  type="number"
                  value={offerB.equityPerYear}
                  onChange={(e) => setOfferB({ ...offerB, equityPerYear: Number(e.target.value) })}
                  className="w-28 px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-right text-white font-mono"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">401(k) Company Match ($):</span>
                <input
                  type="number"
                  value={offerB.benefits401k}
                  onChange={(e) => setOfferB({ ...offerB, benefits401k: Number(e.target.value) })}
                  className="w-28 px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-right text-white font-mono"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Remote / Wellness Stipend ($):</span>
                <input
                  type="number"
                  value={offerB.remoteStipend}
                  onChange={(e) => setOfferB({ ...offerB, remoteStipend: Number(e.target.value) })}
                  className="w-28 px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-right text-white font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Negotiation Leverage Callout */}
        <div className="p-4 rounded-2xl bg-[#04080e] border border-cyan-500/30 space-y-1.5">
          <span className="font-bold text-cyan-400 uppercase text-[10px] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> High-Leverage Counter-Offer Strategy:
          </span>
          <p className="text-xs text-slate-300 font-sans leading-relaxed">
            You can politely share with <strong>{offerA.company}</strong> that you have a competing offer with <strong>${totalB.toLocaleString()}</strong> Total Compensation. Ask if they can increase base to <strong>${Math.round(offerB.baseSalary * 0.95).toLocaleString()}</strong> or bridge the gap with an additional sign-on bonus.
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-bold hover:text-white cursor-pointer"
          >
            Done Comparing
          </button>
        </div>
      </div>
    </div>
  );
}
