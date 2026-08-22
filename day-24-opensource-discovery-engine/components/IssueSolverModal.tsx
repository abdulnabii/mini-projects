'use client';

import { useState, useEffect } from 'react';
import {
  Sparkles,
  X,
  Loader2,
  Check,
  Copy,
  Terminal,
  FileCode,
  CheckCircle2,
  GitPullRequest,
  BookOpen,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  repoName: string;
  issueTitle: string;
  language: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function IssueSolverModal({
  repoName,
  issueTitle,
  language,
  isOpen,
  onClose,
}: Props) {
  const [solution, setSolution] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedPr, setCopiedPr] = useState(false);
  const [copiedCommit, setCopiedCommit] = useState(false);

  useEffect(() => {
    if (isOpen && issueTitle) {
      handleGenerateSolution();
    }
  }, [isOpen, issueTitle]);

  const handleGenerateSolution = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/solve-issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          repoName,
          issueTitle,
          language,
        }),
      });

      const data = await res.json();
      setSolution(data.solution);
      confetti({
        particleCount: 30,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#34d399', '#38bdf8', '#ffaa44'],
      });
    } catch (e) {
      console.error('Failed to solve issue:', e);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150 font-mono">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0d1117] border-2 border-emerald-500/40 p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold uppercase">
                AI ISSUE SOLVER &amp; PR DRAFTER
              </span>
              <span className="text-xs text-slate-500">{repoName}</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white font-outfit">
              {issueTitle}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isLoading ? (
          <div className="py-16 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
            <p className="text-xs text-slate-400">
              Gemini 1.5 Flash analyzing issue context, drafting code patch &amp; PR checklist...
            </p>
          </div>
        ) : solution ? (
          <div className="space-y-6 text-xs">
            {/* Root Cause Analysis */}
            <div className="p-4 rounded-2xl bg-[#161b22] border border-slate-800 space-y-1.5">
              <span className="text-[10px] text-emerald-400 font-bold uppercase flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Root Cause Breakdown:
              </span>
              <p className="text-slate-300 font-sans leading-relaxed">
                {solution.rootCause}
              </p>
            </div>

            {/* Target Files to Inspect */}
            {solution.filesToModify && solution.filesToModify.length > 0 && (
              <div className="space-y-2">
                <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1.5">
                  <FileCode className="w-3.5 h-3.5 text-cyan-400" /> Files Likely Requiring Edits:
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  {solution.filesToModify.map((file: string, i: number) => (
                    <code
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-emerald-300 text-[11px]"
                    >
                      {file}
                    </code>
                  ))}
                </div>
              </div>
            )}

            {/* Proposed Fix Strategy */}
            <div className="space-y-2">
              <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" /> Proposed Fix Implementation Strategy:
              </span>
              <p className="p-4 rounded-2xl bg-[#161b22] border border-slate-800 text-slate-300 whitespace-pre-line font-sans leading-relaxed">
                {solution.fixStrategy}
              </p>
            </div>

            {/* Code Patch Snippet */}
            {solution.codeSnippet && (
              <div className="space-y-2">
                <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" /> Code Patch Snippet:
                </span>
                <pre className="p-4 rounded-2xl bg-[#04080e] border border-slate-800 text-emerald-300 overflow-x-auto text-[11px]">
                  {solution.codeSnippet}
                </pre>
              </div>
            )}

            {/* Verification Unit Test */}
            {solution.unitTestSnippet && (
              <div className="space-y-2">
                <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> Validation Unit Test:
                </span>
                <pre className="p-4 rounded-2xl bg-[#04080e] border border-slate-800 text-cyan-300 overflow-x-auto text-[11px]">
                  {solution.unitTestSnippet}
                </pre>
              </div>
            )}

            {/* Git Commit & PR Template */}
            <div className="space-y-3 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1.5">
                  <GitPullRequest className="w-3.5 h-3.5 text-amber-400" /> PR Title &amp; Commit Command:
                </span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(solution.gitCommitCommand || '');
                    setCopiedCommit(true);
                    setTimeout(() => setCopiedCommit(false), 2000);
                  }}
                  className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  {copiedCommit ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedCommit ? 'Copied!' : 'Copy Commit'}</span>
                </button>
              </div>

              <code className="block p-3 rounded-xl bg-[#161b22] border border-slate-800 text-amber-300 text-xs">
                {solution.gitCommitCommand || `git commit -m "${solution.prTitle}"`}
              </code>
            </div>

            {/* Copyable PR Description Markdown */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-purple-400" /> Complete PR Description:
                </span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(solution.prDescriptionMarkdown || '');
                    setCopiedPr(true);
                    setTimeout(() => setCopiedPr(false), 2000);
                  }}
                  className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  {copiedPr ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedPr ? 'Copied Markdown!' : 'Copy PR Markdown'}</span>
                </button>
              </div>

              <pre className="p-4 rounded-2xl bg-[#04080e] border border-slate-800 text-emerald-300 overflow-x-auto text-[10px] whitespace-pre-wrap">
                {solution.prDescriptionMarkdown}
              </pre>
            </div>
          </div>
        ) : null}

        {/* Footer */}
        <div className="flex items-center justify-end pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 text-black font-extrabold text-xs hover:from-emerald-300 cursor-pointer shadow-md"
          >
            Close Studio
          </button>
        </div>
      </div>
    </div>
  );
}
