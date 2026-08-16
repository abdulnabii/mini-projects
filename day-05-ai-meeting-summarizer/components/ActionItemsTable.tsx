'use client';

import { useState } from 'react';
import { ActionItem } from '@/types';
import { CheckSquare, Square } from 'lucide-react';

interface Props {
  items: ActionItem[];
}

export default function ActionItemsTable({ items }: Props) {
  const [filter, setFilter] = useState<'ALL' | 'HIGH' | 'MEDIUM' | 'LOW'>('ALL');
  const [completedMap, setCompletedMap] = useState<Record<string, boolean>>({});

  if (!items.length) {
    return <p className="text-slate-500 text-xs py-4 text-center">No action items detected in transcript.</p>;
  }

  const toggleComplete = (id: string) => {
    setCompletedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredItems = items.filter((item) => {
    if (filter === 'ALL') return true;
    return item.priority === filter;
  });

  const completedCount = Object.values(completedMap).filter(Boolean).length;

  return (
    <div className="space-y-4 font-mono text-xs text-slate-300">
      {/* Header & Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <span className="font-bold text-white text-xs">Action Roadmap</span>
          <span className="text-[10px] text-purple-400 font-bold bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/30">
            {completedCount} / {items.length} Completed
          </span>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
          {(['ALL', 'HIGH', 'MEDIUM', 'LOW'] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setFilter(p)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                filter === p ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Action Items List */}
      <div className="space-y-2">
        {filteredItems.map((item, idx) => {
          const isDone = completedMap[item.id || idx];
          return (
            <div
              key={item.id || idx}
              onClick={() => toggleComplete(item.id || `${idx}`)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                isDone
                  ? 'bg-slate-950/40 border-slate-800/80 opacity-60'
                  : 'bg-slate-950 border-slate-800 hover:border-purple-500/40'
              }`}
            >
              <div className="flex items-start gap-3">
                <button type="button" className="mt-0.5 text-purple-400 hover:text-purple-300">
                  {isDone ? (
                    <CheckSquare className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-500" />
                  )}
                </button>

                <div className="space-y-0.5">
                  <p className={`text-xs font-bold ${isDone ? 'line-through text-slate-500' : 'text-white'}`}>
                    {item.task}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Assignee: <strong className="text-purple-300">{item.assignee || 'Unassigned'}</strong>
                    {item.deadline && (
                      <span> • Due: <strong className="text-slate-300">{item.deadline}</strong></span>
                    )}
                  </p>
                </div>
              </div>

              <span
                className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase shrink-0 ${
                  item.priority === 'HIGH'
                    ? 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
                    : item.priority === 'MEDIUM'
                    ? 'bg-amber-500/10 border border-amber-500/30 text-amber-400'
                    : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                }`}
              >
                {item.priority}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
