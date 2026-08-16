'use client';

import { ActionPlanItem } from '@/types';
import { CheckSquare, ArrowUpRight, Zap, Award, Layers } from 'lucide-react';

interface Props {
  actionPlan: ActionPlanItem[];
}

export default function ActionPlanCard({ actionPlan }: Props) {
  const getImpactBadge = (impact: ActionPlanItem['impact']) => {
    if (impact === 'HIGH')
      return <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 text-[9px]">HIGH IMPACT</span>;
    if (impact === 'MEDIUM')
      return <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 text-[9px]">MEDIUM IMPACT</span>;
    return <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 font-bold text-[9px]">LOW IMPACT</span>;
  };

  const getEffortBadge = (effort: ActionPlanItem['effort']) => {
    if (effort === 'LOW')
      return <span className="text-[10px] text-emerald-400 font-bold">⚡ Quick Fix</span>;
    if (effort === 'MEDIUM')
      return <span className="text-[10px] text-amber-400 font-bold">⏱️ Moderate Effort</span>;
    return <span className="text-[10px] text-indigo-300 font-bold">🛠️ Deep Work</span>;
  };

  return (
    <div className="bg-[#0e1424] border border-emerald-500/30 rounded-3xl p-6 sm:p-8 space-y-6 font-mono text-xs text-slate-300 shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <CheckSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base font-outfit">Prioritized SEO Action Plan</h3>
            <p className="text-xs text-slate-400">Ranked step-by-step roadmap to maximize organic search rank</p>
          </div>
        </div>

        <span className="text-emerald-400 font-bold">{actionPlan.length} Tasks Scheduled</span>
      </div>

      <div className="space-y-3">
        {actionPlan.map((item) => (
          <div
            key={item.priority}
            className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 hover:border-slate-700 transition-colors"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-black font-outfit flex items-center justify-center text-xs">
                  #{item.priority}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {item.category}
                </span>
              </div>

              <div className="flex items-center gap-3">
                {getImpactBadge(item.impact)}
                {getEffortBadge(item.effort)}
              </div>
            </div>

            <p className="text-slate-200 text-xs font-mono font-medium leading-relaxed pl-8">
              {item.action}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
