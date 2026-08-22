'use client';

import { ContributionTarget, ContributionStatus } from '@/types';
import {
  GitPullRequest,
  GitMerge,
  GitFork,
  Target,
  Trash2,
  ExternalLink,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  targets: ContributionTarget[];
  onUpdateStatus: (id: string, newStatus: ContributionStatus) => void;
  onRemoveTarget: (id: string) => void;
}

const STATUS_COLUMNS: { status: ContributionStatus; label: string; icon: any; color: string }[] = [
  { status: 'targeted', label: '1. Targeted / Saved', icon: Target, color: 'text-slate-300' },
  { status: 'forked', label: '2. Forked & In Progress', icon: GitFork, color: 'text-cyan-400' },
  { status: 'pr_submitted', label: '3. PR Submitted', icon: GitPullRequest, color: 'text-amber-400' },
  { status: 'merged', label: '4. Merged! 🎉', icon: GitMerge, color: 'text-emerald-400' },
];

export default function ContributionPipeline({
  targets,
  onUpdateStatus,
  onRemoveTarget,
}: Props) {
  const handleStatusChange = (id: string, newStatus: ContributionStatus) => {
    onUpdateStatus(id, newStatus);
    if (newStatus === 'merged') {
      confetti({
        particleCount: 50,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#10b981', '#38bdf8', '#ffaa44'],
      });
    }
  };

  return (
    <div className="space-y-8 font-mono w-full min-w-0">
      {/* 4 Pipeline Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATUS_COLUMNS.map((col) => {
          const Icon = col.icon;
          const colItems = targets.filter((t) => t.status === col.status);

          return (
            <div
              key={col.status}
              className="p-5 rounded-3xl bg-[#0d1117] border border-slate-800 space-y-4 shadow-xl flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Column Header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${col.color}`} />
                    <h4 className="font-bold text-white text-xs font-outfit">{col.label}</h4>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-slate-900 text-[10px] text-slate-400 border border-slate-800 font-bold">
                    {colItems.length}
                  </span>
                </div>

                {/* Cards in Column */}
                <div className="space-y-3 min-h-[140px]">
                  {colItems.length === 0 ? (
                    <div className="p-4 rounded-2xl bg-[#161b22]/40 border border-dashed border-slate-800/80 text-center text-[11px] text-slate-500">
                      No repositories in this stage
                    </div>
                  ) : (
                    colItems.map((item) => (
                      <div
                        key={item.id}
                        className="p-3.5 rounded-2xl bg-[#161b22] border border-slate-800 hover:border-emerald-500/40 transition-all space-y-2.5 shadow-md"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h5 className="font-bold text-white text-xs font-outfit truncate">
                            {item.projectFullName}
                          </h5>

                          <button
                            type="button"
                            onClick={() => onRemoveTarget(item.id)}
                            className="text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                            title="Remove"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Status Select Switcher */}
                        <div className="space-y-1 text-[10px]">
                          <label className="text-slate-500">Stage:</label>
                          <select
                            value={item.status}
                            onChange={(e) =>
                              handleStatusChange(item.id, e.target.value as ContributionStatus)
                            }
                            className="w-full p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-[11px] focus:outline-none cursor-pointer"
                          >
                            <option value="targeted">Targeted</option>
                            <option value="forked">Forked / In Progress</option>
                            <option value="pr_submitted">PR Submitted</option>
                            <option value="merged">Merged! 🎉</option>
                          </select>
                        </div>

                        <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[10px]">
                          <span className="text-slate-500">
                            {new Date(item.addedAt).toLocaleDateString()}
                          </span>
                          <a
                            href={item.projectUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-emerald-400 hover:underline flex items-center gap-1"
                          >
                            <span>Repo</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
