'use client';

import { useState } from 'react';
import { JobApplication, PipelineStage, JobPriority } from '@/types';
import JobCard from './JobCard';
import { Plus, Search, Filter, Layers, Briefcase, CheckCircle2, Flame, Sparkles } from 'lucide-react';

interface Props {
  jobs: JobApplication[];
  onOpenMatch: (job: JobApplication) => void;
  onOpenCoverLetter: (job: JobApplication) => void;
  onOpenInterviewPrep: (job: JobApplication) => void;
  onOpenFollowUp: (job: JobApplication) => void;
  onOpenNegotiator: (job: JobApplication) => void;
  onMoveStage: (jobId: string, targetStage: PipelineStage) => void;
  onDeleteJob: (jobId: string) => void;
  onOpenAddModal: (defaultStage?: PipelineStage) => void;
}

interface ColumnConfig {
  id: PipelineStage;
  title: string;
  badgeColor: string;
  borderAccent: string;
  icon: string;
  glow: string;
}

const COLUMNS: ColumnConfig[] = [
  { id: 'wishlist', title: 'Wishlist', badgeColor: 'text-slate-400 bg-slate-800/80', borderAccent: 'border-slate-800', icon: '💡', glow: '' },
  { id: 'applied', title: 'Applied', badgeColor: 'text-sky-400 bg-sky-500/10', borderAccent: 'border-sky-500/30', icon: '📨', glow: 'shadow-sky-500/5' },
  { id: 'screening', title: 'Phone Screen', badgeColor: 'text-cyan-400 bg-cyan-500/10', borderAccent: 'border-cyan-500/30', icon: '📞', glow: 'shadow-cyan-500/5' },
  { id: 'technical', title: 'Technical Round', badgeColor: 'text-purple-400 bg-purple-500/10', borderAccent: 'border-purple-500/30', icon: '💻', glow: 'shadow-purple-500/5' },
  { id: 'final', title: 'Final Round', badgeColor: 'text-amber-400 bg-amber-500/10', borderAccent: 'border-amber-500/30', icon: '🏆', glow: 'shadow-amber-500/5' },
  { id: 'offer', title: 'Offer Received', badgeColor: 'text-emerald-400 bg-emerald-500/10', borderAccent: 'border-emerald-500/40', icon: '🎉', glow: 'shadow-emerald-500/10' },
  { id: 'archived', title: 'Archived', badgeColor: 'text-slate-500 bg-slate-900', borderAccent: 'border-slate-900', icon: '📁', glow: '' },
];

export default function KanbanBoard({
  jobs,
  onOpenMatch,
  onOpenCoverLetter,
  onOpenInterviewPrep,
  onOpenFollowUp,
  onOpenNegotiator,
  onMoveStage,
  onDeleteJob,
  onOpenAddModal,
}: Props) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPriority, setSelectedPriority] = useState<string>('ALL');

  // Filter jobs
  const filteredJobs = jobs.filter((j) => {
    const matchesSearch =
      j.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.roleTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (j.tags && j.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));

    const matchesPriority = selectedPriority === 'ALL' || j.priority === selectedPriority;

    return matchesSearch && matchesPriority;
  });

  return (
    <div className="space-y-6 font-mono text-xs text-slate-300">
      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#0b1220] border border-slate-800 shadow-md">
        <div className="flex items-center gap-2.5 flex-1 w-full sm:w-auto">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search companies, roles, or tags..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>

          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-950 border border-slate-800">
            {['ALL', 'HIGH', 'MEDIUM'].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setSelectedPriority(p)}
                className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${
                  selectedPriority === p
                    ? 'bg-emerald-500 text-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto text-[11px] text-slate-400">
          <span>
            Showing <strong className="text-white">{filteredJobs.length}</strong> of {jobs.length} applications
          </span>
        </div>
      </div>

      {/* 7-Column Horizontal Kanban Board */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-[1450px]">
          {COLUMNS.map((col) => {
            const columnJobs = filteredJobs.filter((j) => j.stage === col.id);

            return (
              <div
                key={col.id}
                className={`w-80 shrink-0 rounded-3xl bg-[#0b1220]/90 border border-slate-800/90 flex flex-col max-h-[750px] shadow-xl ${col.glow}`}
              >
                {/* Column Header */}
                <div className="p-3.5 border-b border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span>{col.icon}</span>
                    <span className="font-bold text-white text-xs font-outfit">{col.title}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${col.badgeColor}`}>
                      {columnJobs.length}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onOpenAddModal(col.id)}
                    className="p-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-emerald-500 text-slate-400 hover:text-white transition-all cursor-pointer"
                    title={`Add application to ${col.title}`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Column Cards List */}
                <div className="p-3 space-y-3 overflow-y-auto flex-1">
                  {columnJobs.length > 0 ? (
                    columnJobs.map((job) => (
                      <JobCard
                        key={job.id}
                        job={job}
                        onOpenMatch={onOpenMatch}
                        onOpenCoverLetter={onOpenCoverLetter}
                        onOpenInterviewPrep={onOpenInterviewPrep}
                        onOpenFollowUp={onOpenFollowUp}
                        onOpenNegotiator={onOpenNegotiator}
                        onMoveStage={onMoveStage}
                        onDeleteJob={onDeleteJob}
                      />
                    ))
                  ) : (
                    <div className="py-12 px-4 rounded-2xl border border-dashed border-slate-800/80 text-center space-y-2">
                      <p className="text-[11px] text-slate-600">No applications in this stage</p>
                      <button
                        type="button"
                        onClick={() => onOpenAddModal(col.id)}
                        className="text-[10px] text-emerald-400/80 hover:underline font-bold"
                      >
                        + Add Application
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
