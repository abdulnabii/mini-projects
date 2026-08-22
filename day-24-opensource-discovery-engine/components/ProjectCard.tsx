'use client';

import Link from 'next/link';
import { OpenSourceProject } from '@/types';
import HealthScoreBadge from './HealthScoreBadge';
import {
  Star,
  GitFork,
  TrendingUp,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  ArrowRight,
  Sparkles,
  GitPullRequest,
  CheckCircle2,
  Tag,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  project: OpenSourceProject;
  isBookmarked: boolean;
  onToggleBookmark: (project: OpenSourceProject) => void;
  onOpenGuide: (project: OpenSourceProject) => void;
}

export default function ProjectCard({
  project,
  isBookmarked,
  onToggleBookmark,
  onOpenGuide,
}: Props) {
  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleBookmark(project);
    if (!isBookmarked) {
      confetti({
        particleCount: 20,
        spread: 50,
        origin: { y: 0.7 },
        colors: ['#34d399', '#38bdf8'],
      });
    }
  };

  return (
    <div className="p-6 rounded-3xl bg-[#0d1117] border border-slate-800 hover:border-emerald-500/50 transition-all space-y-5 font-mono shadow-xl flex flex-col justify-between group">
      <div className="space-y-4">
        {/* Top Header: Match Fit % + Bookmark + Stars */}
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              {project.matchFitPercent && (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                  {project.matchFitPercent}% Skill Fit
                </span>
              )}
              <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-400 text-[10px] uppercase font-bold">
                {project.difficulty.replace('_', ' ')}
              </span>
            </div>

            <h3 className="text-lg font-black text-white font-outfit group-hover:text-emerald-300 transition-colors">
              <Link href={`/project/${project.owner}/${project.repo}`} className="hover:underline">
                {project.fullName}
              </Link>
            </h3>
          </div>

          <button
            type="button"
            onClick={handleBookmarkClick}
            className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
              isBookmarked
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-sm'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
            title={isBookmarked ? 'Saved to PR Pipeline' : 'Save to Pipeline'}
          >
            {isBookmarked ? (
              <BookmarkCheck className="w-4 h-4 text-emerald-400" />
            ) : (
              <Bookmark className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Star & Velocity Metrics Strip */}
        <div className="flex items-center gap-4 text-xs text-slate-400">
          <span className="flex items-center gap-1 font-bold text-amber-400">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span>{project.stars.toLocaleString()}</span>
          </span>

          <span className="flex items-center gap-1 text-emerald-400 font-bold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+{project.starVelocityMonth.toLocaleString()} / mo</span>
          </span>

          <span className="flex items-center gap-1 text-slate-500">
            <GitFork className="w-3.5 h-3.5" />
            <span>{project.forks.toLocaleString()}</span>
          </span>
        </div>

        {/* Health Score Gauge */}
        <HealthScoreBadge health={project.healthScore} showDetails={false} />

        {/* AI Plain-English Project Breakdown */}
        <div className="p-3.5 rounded-2xl bg-[#161b22] border border-slate-800 space-y-1">
          <span className="text-[9px] text-emerald-400 font-bold uppercase flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Plain-English Summary:
          </span>
          <p className="text-xs text-slate-300 font-sans leading-relaxed">
            {project.aiSummary}
          </p>
        </div>

        {/* Topic Badges */}
        <div className="flex items-center gap-1.5 flex-wrap pt-1">
          {project.topics.map((t) => (
            <span
              key={t}
              className="px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-800 text-[10px] text-slate-400"
            >
              #{t}
            </span>
          ))}
        </div>

        {/* Good First Issues Preview */}
        {project.openGoodFirstIssues.length > 0 && (
          <div className="space-y-1.5 pt-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase">
              🔥 Open "Good First Issue" Targets:
            </span>
            <div className="space-y-1">
              {project.openGoodFirstIssues.slice(0, 2).map((issue) => (
                <a
                  key={issue.id}
                  href={issue.url}
                  target="_blank"
                  rel="noreferrer"
                  className="block p-2 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-cyan-500/40 text-xs text-slate-300 hover:text-cyan-300 transition-colors truncate"
                >
                  <span className="text-emerald-400 font-bold">#{issue.number}</span> {issue.title}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between gap-2 pt-4 border-t border-slate-800">
        <button
          type="button"
          onClick={() => onOpenGuide(project)}
          className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-500 hover:from-emerald-300 hover:to-cyan-400 text-black font-extrabold text-xs transition-all shadow-md shadow-emerald-500/20 hover:scale-[1.02] flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <GitPullRequest className="w-3.5 h-3.5" />
          <span>View First PR Guide</span>
        </button>

        <a
          href={project.githubUrl}
          target="_blank"
          rel="noreferrer"
          className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
          title="Open repository on GitHub"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}
