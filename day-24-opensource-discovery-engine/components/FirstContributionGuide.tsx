'use client';

import { useState } from 'react';
import { OpenSourceProject, ContributionGuide, TechSkill } from '@/types';
import HealthScoreBadge from './HealthScoreBadge';
import {
  X,
  GitPullRequest,
  Terminal,
  CheckCircle2,
  Copy,
  Check,
  Clock,
  Sparkles,
  ExternalLink,
  BookOpen,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  project: OpenSourceProject | null;
  userSkills: TechSkill[];
  isOpen: boolean;
  onClose: () => void;
}

export default function FirstContributionGuide({
  project,
  userSkills,
  isOpen,
  onClose,
}: Props) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedTemplate, setCopiedTemplate] = useState(false);

  if (!isOpen || !project) return null;

  const guide = project.defaultGuide || {
    setupSteps: [
      `Fork repository: https://github.com/${project.fullName}`,
      `git clone https://github.com/YOUR_USER/${project.repo}.git`,
      `cd ${project.repo} && npm install (or pnpm/cargo/pip)`,
      `git checkout -b feat/initial-contribution`,
    ],
    recommendedFirstIssue:
      'Look for documentation fixes, typo resolutions, or adding missing TypeScript prop annotations.',
    codingConventions: [
      'Strict type checking enabled',
      'Follow existing linter rules before opening PR',
      'Keep commit messages descriptive',
    ],
    prTemplate: `## What Changed\n\nCloses #[issue]\n\n- [Detailed summary of fix]\n- [ ] Automated tests pass\n- [ ] Accessibility validated`,
    estimatedTime: '1 - 2 hours',
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const copyPrTemplate = () => {
    navigator.clipboard.writeText(guide.prTemplate);
    setCopiedTemplate(true);
    setTimeout(() => setCopiedTemplate(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150 font-mono">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0d1117] border-2 border-emerald-500/40 p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold uppercase">
                AI FIRST PR BLUEPRINT
              </span>
              <span className="text-xs text-slate-500">Gemini 1.5 Flash</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white font-outfit">
              {project.fullName}
            </h3>
            <p className="text-xs text-slate-400">
              Personalized contribution roadmap calibrated to your skills ({userSkills.join(', ')})
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Health Score Banner */}
        <HealthScoreBadge health={project.healthScore} showDetails={true} />

        {/* Estimated Time Badge */}
        <div className="p-3.5 rounded-2xl bg-[#06140e] border border-emerald-500/30 text-xs text-slate-300 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-400" />
            <span>Estimated First Contribution Effort:</span>
          </span>
          <strong className="text-emerald-400 font-bold">
            {guide.estimatedTime}
          </strong>
        </div>

        {/* 1. Local Environment Setup Bash Commands */}
        <div className="space-y-3">
          <h4 className="font-bold text-white text-xs uppercase flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span>1. Local Setup Instructions:</span>
          </h4>

          <div className="space-y-2">
            {guide.setupSteps.map((step, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-[#161b22] border border-slate-800 flex items-center justify-between text-xs text-slate-200"
              >
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <span className="text-cyan-400 font-bold">0{idx + 1}.</span>
                  <code className="text-emerald-300 truncate font-mono text-[11px]">
                    {step}
                  </code>
                </div>

                <button
                  type="button"
                  onClick={() => copyToClipboard(step, idx)}
                  className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0 ml-2"
                  title="Copy command"
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

        {/* 2. Recommended First Issue Targets */}
        <div className="space-y-2">
          <h4 className="font-bold text-white text-xs uppercase flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>2. Recommended Starting Issue:</span>
          </h4>
          <p className="p-4 rounded-2xl bg-[#161b22] border border-slate-800 text-xs text-slate-300 font-sans leading-relaxed">
            {guide.recommendedFirstIssue}
          </p>
        </div>

        {/* 3. Coding Conventions Checklist */}
        <div className="space-y-2">
          <h4 className="font-bold text-white text-xs uppercase flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>3. Key Conventions to Follow:</span>
          </h4>
          <div className="space-y-1.5">
            {guide.codingConventions.map((conv, i) => (
              <div
                key={i}
                className="p-2.5 rounded-xl bg-[#161b22] border border-slate-800 text-xs text-slate-300 flex items-center gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>{conv}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Ready-to-use PR Template */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-white text-xs uppercase flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-400" />
              <span>4. Copy-Paste GitHub PR Template:</span>
            </h4>
            <button
              type="button"
              onClick={copyPrTemplate}
              className="text-xs text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              {copiedTemplate ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedTemplate ? 'Copied!' : 'Copy PR Markdown'}</span>
            </button>
          </div>

          <pre className="p-4 rounded-2xl bg-[#04080e] border border-slate-800 text-[11px] text-emerald-300 overflow-x-auto whitespace-pre-wrap font-mono">
            {guide.prTemplate}
          </pre>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open Repository on GitHub</span>
          </a>

          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 text-black font-extrabold text-xs hover:from-emerald-300 cursor-pointer shadow-md"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
