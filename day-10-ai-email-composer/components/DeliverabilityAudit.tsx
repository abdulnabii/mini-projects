'use client';

import { DeliverabilityMetrics } from '@/types';
import { ShieldCheck, Sparkles, Inbox, BookOpen, Clock, CheckCircle2 } from 'lucide-react';

interface Props {
  deliverability: DeliverabilityMetrics;
}

export default function DeliverabilityAudit({ deliverability }: Props) {
  return (
    <div className="bg-[#131b2e] border border-indigo-500/20 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl font-mono text-xs text-slate-300">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <h3 className="text-sm sm:text-base font-bold text-white font-outfit">
            AI Deliverability &amp; Spam Trigger Audit
          </h3>
        </div>
        <span className="text-emerald-400 font-bold text-[10px] bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
          SPAM-FILTER SAFE
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-[#0b0f19] border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-500 uppercase font-bold flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400" /> Deliverability
          </span>
          <div className="text-xl font-black text-emerald-400 font-outfit">
            {deliverability.score}%
          </div>
          <span className="text-[9px] text-slate-500">Low bounce risk</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#0b0f19] border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-500 uppercase font-bold flex items-center gap-1">
            <Inbox className="w-3 h-3 text-indigo-400" /> Placement
          </span>
          <div className="text-xs font-bold text-white truncate font-outfit">
            {deliverability.inboxPlacement}
          </div>
          <span className="text-[9px] text-slate-500">Bypasses Promotions tab</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#0b0f19] border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-500 uppercase font-bold flex items-center gap-1">
            <BookOpen className="w-3 h-3 text-violet-400" /> Readability
          </span>
          <div className="text-xs font-bold text-white truncate font-outfit">
            {deliverability.readingGrade}
          </div>
          <span className="text-[9px] text-slate-500">Flesch-Kincaid index</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#0b0f19] border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-500 uppercase font-bold flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-400" /> Avg Reading
          </span>
          <div className="text-xl font-black text-white font-outfit">
            ~{deliverability.readingTimeSeconds}s
          </div>
          <span className="text-[9px] text-slate-500">Optimal skimmability</span>
        </div>
      </div>
    </div>
  );
}
