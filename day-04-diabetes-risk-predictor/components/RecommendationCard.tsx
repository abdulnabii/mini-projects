'use client';

import React from 'react';
import { RecommendationItem } from '@/types';
import { HeartPulse, CheckCircle2, AlertCircle } from 'lucide-react';

interface RecommendationCardProps {
  recommendations: RecommendationItem[];
  isLoading?: boolean;
}

export default function RecommendationCard({ recommendations, isLoading }: RecommendationCardProps) {
  const getBadgeStyle = (priority: 'HIGH' | 'MEDIUM' | 'LOW') => {
    if (priority === 'HIGH') return 'bg-rose-950/80 text-rose-300 border-rose-800';
    if (priority === 'MEDIUM') return 'bg-amber-950/80 text-amber-300 border-amber-800';
    return 'bg-emerald-950/80 text-emerald-300 border-emerald-800';
  };

  return (
    <div className="bg-[#0b1724] border border-teal-500/20 rounded-3xl p-6 space-y-4 shadow-xl font-mono">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <HeartPulse className="w-5 h-5 text-teal-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Personalized Clinical Recommendations
          </h3>
        </div>
        <span className="text-[10px] font-mono text-teal-300 bg-teal-950/80 px-2 py-0.5 rounded border border-teal-800/60">
          AI Lifestyle Guidance
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className="bg-[#07101a] p-4 rounded-2xl border border-slate-800 space-y-2 hover:border-teal-500/30 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-teal-300 flex items-center gap-1.5 font-sans">
                <span className="text-base">{rec.icon}</span> {rec.category}
              </span>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${getBadgeStyle(rec.priority)}`}>
                {rec.priority} PRIORITY
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {rec.advice}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
