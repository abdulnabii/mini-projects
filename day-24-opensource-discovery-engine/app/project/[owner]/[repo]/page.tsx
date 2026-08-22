'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { CURATED_PROJECTS } from '@/lib/curatedProjects';
import HealthScoreBadge from '@/components/HealthScoreBadge';
import {
  GitPullRequest,
  Star,
  GitFork,
  ArrowLeft,
  Terminal,
  Clock,
  Sparkles,
  ExternalLink,
  BookOpen,
  CheckCircle2,
  Copy,
  Check,
} from 'lucide-react';

interface Props {
  params: Promise<{ owner: string; repo: string }>;
}

export default function ProjectDetailPage({ params }: Props) {
  const resolvedParams = use(params);
  const { owner, repo } = resolvedParams;

  const fullName = `${owner}/${repo}`;
  const project = CURATED_PROJECTS.find(
    (p) => p.fullName.toLowerCase() === fullName.toLowerCase()
  ) || CURATED_PROJECTS[0];

  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const guide = project.defaultGuide || {
    setupSteps: [
      `Fork https://github.com/${project.fullName}`,
      `git clone https://github.com/YOUR_USER/${project.repo}.git`,
      `cd ${project.repo} && pnpm install (or npm install)`,
    ],
    recommendedFirstIssue:
      'Look for open issues with the "good first issue" label or docs improvements.',
    codingConventions: ['Strict TypeScript checks', 'Run linter before committing'],
    prTemplate: '## What Changed\n\nCloses #[issue]',
    estimatedTime: '1 - 2 hours',
  };

  const copyToClipboard = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-8 font-mono w-full min-w-0">
      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Discovery Feed</span>
      </Link>

      {/* Main Project Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0d1117] border border-emerald-500/30 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 text-[10px] font-bold border border-emerald-500/30 uppercase">
              {project.language} • {project.difficulty}
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-white font-outfit">
              {project.fullName}
            </h1>
            <p className="text-xs text-slate-400 font-sans max-w-2xl">
              {project.description}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 text-black font-extrabold text-xs transition-all shadow-md shadow-emerald-500/20 hover:scale-105 flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              <span>View on GitHub</span>
            </a>
          </div>
        </div>

        {/* Health Details */}
        <HealthScoreBadge health={project.healthScore} showDetails={true} />
      </div>

      {/* 2-Column Split: First PR Blueprint & Good First Issues */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Setup Steps & Conventions (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Setup Steps */}
          <div className="p-6 rounded-3xl bg-[#0d1117] border border-slate-800 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span>Local Dev Environment Setup</span>
            </h3>

            <div className="space-y-2">
              {guide.setupSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-[#161b22] border border-slate-800 flex items-center justify-between text-xs text-slate-200"
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <span className="text-cyan-400 font-bold">0{idx + 1}.</span>
                    <code className="text-emerald-300 font-mono text-[11px] truncate">
                      {step}
                    </code>
                  </div>

                  <button
                    type="button"
                    onClick={() => copyToClipboard(step, idx)}
                    className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0 ml-2"
                  >
                    {copiedIndex === idx ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Conventions */}
          <div className="p-6 rounded-3xl bg-[#0d1117] border border-slate-800 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Repository Coding Conventions</span>
            </h3>

            <div className="space-y-2 text-xs text-slate-300">
              {guide.codingConventions.map((c, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-[#161b22] border border-slate-800 flex items-center gap-2"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>{c}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Good First Issues & PR Template (1 col) */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-[#0d1117] border border-emerald-500/30 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Recommended Target</span>
            </h3>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              {guide.recommendedFirstIssue}
            </p>
          </div>

          {/* PR Template */}
          <div className="p-6 rounded-3xl bg-[#0d1117] border border-slate-800 space-y-3 shadow-xl">
            <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-400" />
              <span>PR Description Template</span>
            </h3>
            <pre className="p-3.5 rounded-2xl bg-[#04080e] border border-slate-800 text-[10px] text-emerald-300 overflow-x-auto whitespace-pre-wrap">
              {guide.prTemplate}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
