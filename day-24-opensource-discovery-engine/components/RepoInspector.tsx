'use client';

import { useState } from 'react';
import { OpenSourceProject } from '@/types';
import HealthScoreBadge from './HealthScoreBadge';
import {
  Search,
  Loader2,
  Sparkles,
  ExternalLink,
  Star,
  GitFork,
  GitPullRequest,
  CheckCircle2,
  AlertCircle,
  FileCode,
  Terminal,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  onSelectProjectForGuide: (project: OpenSourceProject) => void;
  onSelectIssueForSolver: (repoName: string, issueTitle: string, language: string) => void;
}

export default function RepoInspector({
  onSelectProjectForGuide,
  onSelectIssueForSolver,
}: Props) {
  const [input, setInput] = useState('facebook/react');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inspectedProject, setInspectedProject] = useState<OpenSourceProject | null>(null);

  const handleInspect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/inspect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repoInput: input.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to inspect repository');
      }

      setInspectedProject(data.project);
      confetti({
        particleCount: 25,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#06b6d4', '#10b981'],
      });
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-[#0d1117] border border-cyan-500/30 shadow-2xl space-y-6 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base font-outfit">
              Live GitHub Repository Inspector
            </h3>
            <p className="text-xs text-slate-400">
              Audit ANY public open-source repository for health scores, maintainer velocity &amp; first PR feasibility
            </p>
          </div>
        </div>

        <span className="text-[10px] text-cyan-300 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 font-bold">
          Real-Time GitHub REST API v3
        </span>
      </div>

      {/* Input Form */}
      <form onSubmit={handleInspect} className="flex flex-col sm:flex-row items-center gap-2.5">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter repo URL or owner/repo (e.g. facebook/react, astral-sh/uv, flutter/flutter)..."
            className="w-full pl-4 pr-4 py-3 rounded-2xl bg-[#161b22] border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-400 via-teal-400 to-indigo-500 hover:from-cyan-300 hover:to-indigo-400 text-black font-extrabold text-xs transition-all shadow-md shadow-cyan-500/20 disabled:opacity-40 cursor-pointer flex items-center justify-center gap-2 shrink-0"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          <span>Audit Repository</span>
        </button>
      </form>

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Live Inspection Results Card */}
      {inspectedProject && (
        <div className="p-6 rounded-3xl bg-[#161b22] border border-cyan-500/40 space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold">
                  {inspectedProject.language}
                </span>
                <span className="text-[10px] text-slate-500">License: {inspectedProject.license}</span>
              </div>
              <h4 className="text-xl font-bold text-white font-outfit">
                {inspectedProject.fullName}
              </h4>
              <p className="text-xs text-slate-300 font-sans max-w-2xl">
                {inspectedProject.description}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => onSelectProjectForGuide(inspectedProject)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 text-black font-extrabold text-xs shadow-md hover:scale-105 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <GitPullRequest className="w-3.5 h-3.5" />
                <span>Generate PR Blueprint</span>
              </button>

              <a
                href={inspectedProject.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Metric Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-0.5">
              <span className="text-slate-500 text-[10px]">Total Stars</span>
              <div className="text-lg font-black text-amber-400 flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>{inspectedProject.stars.toLocaleString()}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-0.5">
              <span className="text-slate-500 text-[10px]">Forks</span>
              <div className="text-lg font-black text-slate-200 flex items-center gap-1">
                <GitFork className="w-3.5 h-3.5" />
                <span>{inspectedProject.forks.toLocaleString()}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-0.5">
              <span className="text-slate-500 text-[10px]">Open Good First Issues</span>
              <div className="text-lg font-black text-emerald-400">
                {inspectedProject.openGoodFirstIssues.length} Detected
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-0.5">
              <span className="text-slate-500 text-[10px]">Last Commit</span>
              <div className="text-lg font-black text-cyan-300">
                {inspectedProject.healthScore.daysSinceLastCommit}d ago
              </div>
            </div>
          </div>

          {/* Detailed Health Gauge */}
          <HealthScoreBadge health={inspectedProject.healthScore} showDetails={true} />

          {/* Open Issues with 1-Click AI Solver */}
          {inspectedProject.openGoodFirstIssues.length > 0 && (
            <div className="space-y-3 pt-2">
              <span className="text-[11px] text-slate-300 font-bold uppercase flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Beginner Issues Found (Click to Generate AI Solution Patch):</span>
              </span>

              <div className="space-y-2">
                {inspectedProject.openGoodFirstIssues.map((iss) => (
                  <div
                    key={iss.id}
                    className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-0.5">
                      <a
                        href={iss.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-bold text-white hover:text-cyan-300 transition-colors flex items-center gap-1.5"
                      >
                        <span className="text-emerald-400">#{iss.number}</span>
                        <span>{iss.title}</span>
                      </a>
                      <span className="text-[10px] text-slate-500">
                        {iss.comments} comments • {new Date(iss.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        onSelectIssueForSolver(inspectedProject.fullName, iss.title, inspectedProject.language)
                      }
                      className="px-3 py-1.5 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/30 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shrink-0"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Draft Fix with AI</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
