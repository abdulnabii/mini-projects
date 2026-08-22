'use client';

import { useMemo } from 'react';
import { ShieldCheck, AlertTriangle, XCircle, AlertOctagon } from 'lucide-react';
import { RiskVerdict } from '@/types';

interface Props {
  score: number; // 0 to 100
  verdict: RiskVerdict;
}

export default function RiskMeter({ score, verdict }: Props) {
  const { color, strokeClass, bgZone, icon: Icon, label } = useMemo(() => {
    if (score < 30) {
      return {
        color: '#10b981',
        strokeClass: 'stroke-emerald-400',
        bgZone: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
        icon: ShieldCheck,
        label: 'LOW RISK',
      };
    }
    if (score < 60) {
      return {
        color: '#f59e0b',
        strokeClass: 'stroke-amber-400',
        bgZone: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
        icon: AlertTriangle,
        label: 'MODERATE RISK',
      };
    }
    if (score < 80) {
      return {
        color: '#f97316',
        strokeClass: 'stroke-orange-400',
        bgZone: 'bg-orange-500/10 text-orange-300 border-orange-500/30',
        icon: AlertOctagon,
        label: 'HIGH RISK',
      };
    }
    return {
      color: '#ef4444',
      strokeClass: 'stroke-rose-500',
      bgZone: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
      icon: XCircle,
      label: 'CRITICAL RISK',
    };
  }, [score]);

  // Circle radius and circumference calculations
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-6 rounded-3xl bg-[#0d1117] border border-slate-800 space-y-4 font-mono shadow-xl text-center">
      <div className="relative w-40 h-40 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
          {/* Background Track */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="currentColor"
            strokeWidth="10"
            className="text-slate-800 fill-none"
          />
          {/* Animated Value Arc */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke={color}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="fill-none transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Score Display */}
        <div className="absolute flex flex-col items-center justify-center space-y-0.5">
          <span className="text-3xl sm:text-4xl font-black font-outfit text-white leading-none">
            {score}
          </span>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            Risk Index
          </span>
        </div>
      </div>

      <div className="space-y-1">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${bgZone}`}>
          <Icon className="w-3.5 h-3.5" />
          <span>{label}</span>
        </span>
        <p className="text-xs text-slate-300 font-sans max-w-xs pt-1 font-medium">{verdict}</p>
      </div>
    </div>
  );
}
