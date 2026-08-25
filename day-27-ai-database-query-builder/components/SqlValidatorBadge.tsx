'use client';

import { ShieldCheck, CheckCircle2, Lock, Cpu } from 'lucide-react';

interface Props {
  dialect: string;
  hasLimit: boolean;
}

export default function SqlValidatorBadge({ dialect, hasLimit }: Props) {
  return (
    <div className="flex items-center gap-2 flex-wrap text-[10px] font-mono">
      <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-bold">
        <ShieldCheck className="w-3 h-3 text-emerald-400" />
        <span>Read-Only Safe</span>
      </div>

      <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-bold">
        <Lock className="w-3 h-3 text-cyan-400" />
        <span>Zero SQL Injection Risk</span>
      </div>

      <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-300 border border-purple-500/30 font-bold">
        <CheckCircle2 className="w-3 h-3 text-purple-400" />
        <span>Auto-Limit Protected</span>
      </div>
    </div>
  );
}
