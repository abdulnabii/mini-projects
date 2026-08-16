'use client';

import { SpeakerStat } from '@/types';
import { Users } from 'lucide-react';

interface Props {
  speakerStats?: SpeakerStat[];
}

export default function SpeakerStatsCard({ speakerStats }: Props) {
  if (!speakerStats || speakerStats.length === 0) return null;

  return (
    <div className="p-6 rounded-3xl bg-slate-950 border border-purple-500/20 space-y-4 font-mono text-xs text-slate-300">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="font-bold text-white text-sm font-outfit flex items-center gap-2">
          <Users className="w-4 h-4 text-purple-400" />
          Speaker Participation &amp; Talk-Time Distribution
        </h3>
        <span className="text-[10px] text-slate-500">{speakerStats.length} Speakers</span>
      </div>

      {/* Multi-color Progress Distribution Bar */}
      <div className="w-full h-3 rounded-full overflow-hidden flex bg-slate-900 border border-slate-800">
        {speakerStats.map((stat, idx) => (
          <div
            key={idx}
            style={{ width: `${Math.max(4, stat.percentage)}%`, backgroundColor: stat.color }}
            title={`${stat.name}: ${stat.percentage}% (${stat.wordCount} words)`}
            className="h-full transition-all duration-500 hover:opacity-80"
          />
        ))}
      </div>

      {/* Speaker Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
        {speakerStats.map((stat, idx) => (
          <div
            key={idx}
            className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between"
          >
            <div className="flex items-center gap-2.5 truncate">
              <div
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: stat.color }}
              />
              <span className="font-bold text-white text-xs truncate">{stat.name}</span>
            </div>
            <div className="text-right shrink-0">
              <span className="font-bold text-purple-300 text-xs">{stat.percentage}%</span>
              <span className="block text-[9px] text-slate-500">{stat.wordCount}w</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
