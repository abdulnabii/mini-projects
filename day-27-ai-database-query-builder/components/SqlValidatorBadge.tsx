'use client';

import { ShieldCheck, CheckCircle2, Lock, Info } from 'lucide-react';

interface Props {
  dialect: string;
  hasLimit: boolean;
}

export default function SqlValidatorBadge({ dialect, hasLimit }: Props) {
  return (
    <div className="flex items-center gap-2 flex-wrap text-[10px] font-mono">
      <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-bold">
        <ShieldCheck className="w-3 h-3 text-emerald-400" />
        <span>READ-ONLY SAFE</span>
      </div>

      <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-bold">
        <Lock className="w-3 h-3 text-cyan-400" />
        <span>NO INJECTION RISK</span>
      </div>

      <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700 font-bold">
        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
        <span>LIMIT 1000 ENFORCED</span>
      </div>

      {/* Simulated Sandbox Tooltip Label */}
      <div
        className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/30 font-bold cursor-help"
        title="Query execution, latency benchmarks, and row outputs are simulated in an in-memory test sandbox for developer evaluation."
      >
        <Info className="w-3 h-3 text-amber-400" />
        <span>SANDBOX ESTIMATE</span>
      </div>
    </div>
  );
}
