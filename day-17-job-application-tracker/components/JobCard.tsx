'use client';

import { JobApplication, PipelineStage } from '@/types';
import {
  Sparkles,
  FileText,
  MessageSquare,
  ArrowRight,
  ArrowLeft,
  Trash2,
  ExternalLink,
  MapPin,
  DollarSign,
  Briefcase,
  Mail,
  TrendingUp,
} from 'lucide-react';

interface Props {
  job: JobApplication;
  onOpenMatch: (job: JobApplication) => void;
  onOpenCoverLetter: (job: JobApplication) => void;
  onOpenInterviewPrep: (job: JobApplication) => void;
  onOpenFollowUp: (job: JobApplication) => void;
  onOpenNegotiator: (job: JobApplication) => void;
  onMoveStage: (jobId: string, targetStage: PipelineStage) => void;
  onDeleteJob: (jobId: string) => void;
}

const STAGES: PipelineStage[] = ['wishlist', 'applied', 'screening', 'technical', 'final', 'offer', 'archived'];

export default function JobCard({
  job,
  onOpenMatch,
  onOpenCoverLetter,
  onOpenInterviewPrep,
  onOpenFollowUp,
  onOpenNegotiator,
  onMoveStage,
  onDeleteJob,
}: Props) {
  const currentStageIndex = STAGES.indexOf(job.stage);

  const handleNextStage = () => {
    if (currentStageIndex < STAGES.length - 1) {
      onMoveStage(job.id, STAGES[currentStageIndex + 1]);
    }
  };

  const handlePrevStage = () => {
    if (currentStageIndex > 0) {
      onMoveStage(job.id, STAGES[currentStageIndex - 1]);
    }
  };

  const matchScore = job.matchResult?.matchScore;

  // Company avatar gradient
  const getCompanyGradient = (name: string) => {
    const charCode = name.charCodeAt(0) % 4;
    if (charCode === 0) return 'from-emerald-500 to-teal-700';
    if (charCode === 1) return 'from-indigo-500 to-purple-700';
    if (charCode === 2) return 'from-cyan-500 to-blue-700';
    return 'from-amber-500 to-orange-700';
  };

  return (
    <div className="p-4 rounded-2xl bg-[#090e18]/95 border border-slate-800/90 hover:border-emerald-500/40 transition-all space-y-3 font-mono text-xs text-slate-300 shadow-md group relative">
      {/* Top Meta Bar */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {/* Company Avatar */}
          <div
            className={`w-7 h-7 rounded-xl bg-gradient-to-br ${getCompanyGradient(
              job.companyName
            )} flex items-center justify-center font-bold text-white text-xs shadow-sm`}
          >
            {job.companyName.slice(0, 2).toUpperCase()}
          </div>

          <span
            className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase ${
              job.priority === 'HIGH'
                ? 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
                : job.priority === 'MEDIUM'
                ? 'bg-amber-500/10 border border-amber-500/30 text-amber-400'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            {job.priority}
          </span>
        </div>

        {matchScore !== undefined ? (
          <span
            className={`px-2 py-0.5 rounded-md text-[10px] font-bold border flex items-center gap-1 shadow-sm ${
              matchScore >= 85
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                : matchScore >= 70
                ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400'
                : 'bg-amber-500/10 border-amber-500/40 text-amber-400'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span>{matchScore}% Fit</span>
          </span>
        ) : (
          <button
            type="button"
            onClick={() => onOpenMatch(job)}
            className="text-[9px] text-emerald-400 hover:underline flex items-center gap-0.5 font-bold cursor-pointer"
          >
            <Sparkles className="w-2.5 h-2.5" />
            <span>Calc Fit</span>
          </button>
        )}
      </div>

      {/* Role & Company */}
      <div className="space-y-0.5">
        <h4 className="font-bold text-white text-xs font-outfit line-clamp-1 group-hover:text-emerald-300 transition-colors">
          {job.roleTitle}
        </h4>
        <div className="flex items-center justify-between text-[11px]">
          <span className="font-bold text-slate-300">{job.companyName}</span>
          <span className="text-[10px] text-slate-500">{job.workplaceType}</span>
        </div>
      </div>

      {/* Salary & Location Badges */}
      <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-slate-400">
        <span className="flex items-center gap-1 bg-slate-900 px-2 py-0.5 rounded-md border border-slate-800/80">
          <MapPin className="w-2.5 h-2.5 text-slate-500" />
          <span className="truncate max-w-[110px]">{job.location}</span>
        </span>

        {job.salaryRange && (
          <span className="flex items-center gap-1 bg-slate-900 px-2 py-0.5 rounded-md border border-slate-800/80 text-emerald-300 font-bold">
            <DollarSign className="w-2.5 h-2.5" />
            <span>{job.salaryRange}</span>
          </span>
        )}
      </div>

      {/* Tags */}
      {job.tags && job.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {job.tags.slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              className="text-[9px] px-1.5 py-0.5 rounded bg-slate-900/80 text-slate-400 border border-slate-800"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* AI Super-Actions Grid */}
      <div className="grid grid-cols-4 gap-1 pt-1 border-t border-slate-900">
        <button
          type="button"
          onClick={() => onOpenMatch(job)}
          className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-emerald-500/50 hover:text-emerald-300 text-slate-400 text-[10px] font-bold flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer"
          title="Analyze Resume Fit & Skills Gap"
        >
          <Sparkles className="w-3 h-3 text-emerald-400" />
          <span className="text-[8px]">Fit AI</span>
        </button>

        <button
          type="button"
          onClick={() => onOpenCoverLetter(job)}
          className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-500/50 hover:text-cyan-300 text-slate-400 text-[10px] font-bold flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer"
          title="Generate Tailored Cover Letter"
        >
          <FileText className="w-3 h-3 text-cyan-400" />
          <span className="text-[8px]">Cover</span>
        </button>

        <button
          type="button"
          onClick={() => onOpenInterviewPrep(job)}
          className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-purple-500/50 hover:text-purple-300 text-slate-400 text-[10px] font-bold flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer"
          title="Generate Predicted Interview Questions"
        >
          <MessageSquare className="w-3 h-3 text-purple-400" />
          <span className="text-[8px]">Prep</span>
        </button>

        <button
          type="button"
          onClick={() => (job.stage === 'offer' ? onOpenNegotiator(job) : onOpenFollowUp(job))}
          className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-amber-500/50 hover:text-amber-300 text-slate-400 text-[10px] font-bold flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer"
          title={job.stage === 'offer' ? 'Salary Negotiation Counter-Offer' : 'Generate Follow-Up Email'}
        >
          {job.stage === 'offer' ? (
            <>
              <DollarSign className="w-3 h-3 text-amber-400" />
              <span className="text-[8px] text-amber-300">Offer</span>
            </>
          ) : (
            <>
              <Mail className="w-3 h-3 text-sky-400" />
              <span className="text-[8px]">Nudge</span>
            </>
          )}
        </button>
      </div>

      {/* Stage Progression Controls */}
      <div className="flex items-center justify-between border-t border-slate-900 pt-2 text-[10px]">
        <button
          type="button"
          onClick={handlePrevStage}
          disabled={currentStageIndex === 0}
          className="p-1 rounded bg-slate-900 border border-slate-800 text-slate-500 hover:text-white disabled:opacity-30 cursor-pointer"
          title="Move to previous stage"
        >
          <ArrowLeft className="w-3 h-3" />
        </button>

        <span className="text-[9px] text-slate-500 truncate max-w-[90px]">
          {job.appliedDate || 'Pending'}
        </span>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onDeleteJob(job.id)}
            className="p-1 rounded bg-slate-900 border border-slate-800 text-slate-600 hover:text-rose-400 cursor-pointer"
            title="Delete application"
          >
            <Trash2 className="w-3 h-3" />
          </button>

          <button
            type="button"
            onClick={handleNextStage}
            disabled={currentStageIndex === STAGES.length - 1}
            className="p-1 rounded bg-slate-900 border border-slate-800 text-emerald-400 hover:text-white disabled:opacity-30 cursor-pointer"
            title="Advance to next stage"
          >
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
