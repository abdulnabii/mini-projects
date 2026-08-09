'use client';

import React, { useState } from 'react';
import { ReviewResult, Severity } from '@/types';
import IssueBadge from './IssueBadge';
import { Check, Copy, AlertCircle, Wrench, Lightbulb, ChevronRight, FileCode } from 'lucide-react';

interface ReviewPanelProps {
  result: ReviewResult;
}

export default function ReviewPanel({ result }: ReviewPanelProps) {
  const [copiedIssueId, setCopiedIssueId] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');

  const { issues, summary, refactoringTips, criticalCount, majorCount, minorCount, infoCount } = result;

  const handleCopyFix = (id: string, fixText: string) => {
    navigator.clipboard.writeText(fixText);
    setCopiedIssueId(id);
    setTimeout(() => setCopiedIssueId(null), 2000);
  };

  const filteredIssues = issues.filter((issue) => {
    if (selectedFilter === 'ALL') return true;
    return issue.severity === selectedFilter;
  });

  return (
    <div className="space-y-6">
      {/* Summary Box */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl space-y-3">
        <h4 className="text-xs uppercase font-mono tracking-wider text-slate-400 flex items-center gap-2">
          <FileCode className="w-4 h-4 text-cyan-400" />
          <span>Senior Engineer Assessment Summary</span>
        </h4>
        <p className="text-sm text-slate-200 leading-relaxed font-normal">{summary}</p>

        {/* Severity Metrics Bar */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80">
          <button
            onClick={() => setSelectedFilter('ALL')}
            className={`text-xs px-3 py-1 rounded-lg border font-mono font-semibold transition-all ${
              selectedFilter === 'ALL'
                ? 'bg-slate-800 text-white border-slate-700'
                : 'text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            All Issues ({issues.length})
          </button>
          <button
            onClick={() => setSelectedFilter('CRITICAL')}
            className={`text-xs px-3 py-1 rounded-lg border font-mono font-semibold transition-all ${
              selectedFilter === 'CRITICAL'
                ? 'bg-red-950 text-red-300 border-red-800'
                : 'text-red-400 border-red-950/60 hover:bg-red-950/30'
            }`}
          >
            🔴 Critical ({criticalCount})
          </button>
          <button
            onClick={() => setSelectedFilter('MAJOR')}
            className={`text-xs px-3 py-1 rounded-lg border font-mono font-semibold transition-all ${
              selectedFilter === 'MAJOR'
                ? 'bg-orange-950 text-orange-300 border-orange-800'
                : 'text-orange-400 border-orange-950/60 hover:bg-orange-950/30'
            }`}
          >
            🟠 Major ({majorCount})
          </button>
          <button
            onClick={() => setSelectedFilter('MINOR')}
            className={`text-xs px-3 py-1 rounded-lg border font-mono font-semibold transition-all ${
              selectedFilter === 'MINOR'
                ? 'bg-amber-950 text-amber-300 border-amber-800'
                : 'text-amber-400 border-amber-950/60 hover:bg-amber-950/30'
            }`}
          >
            🟡 Minor ({minorCount})
          </button>
        </div>
      </div>

      {/* Issues List */}
      <div className="space-y-4">
        {filteredIssues.length === 0 ? (
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 text-center text-slate-400 text-xs">
            No issues match the selected severity filter.
          </div>
        ) : (
          filteredIssues.map((issue) => (
            <div
              key={issue.id}
              className="bg-slate-900/80 border border-slate-800/90 hover:border-slate-700 rounded-2xl p-5 space-y-3 transition-colors shadow-lg"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2.5">
                  <IssueBadge severity={issue.severity} size="sm" />
                  <span className="text-xs font-mono text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/40">
                    Line {issue.line}
                  </span>
                  <span className="text-xs font-mono text-slate-400">{issue.category}</span>
                </div>

                <h3 className="font-bold text-white text-sm sm:text-base">{issue.title}</h3>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {issue.description}
              </p>

              {/* Recommended Fix */}
              <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5">
                    <Wrench className="w-3.5 h-3.5" /> Recommended Fix:
                  </span>
                  <button
                    onClick={() => handleCopyFix(issue.id, issue.fix)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-[11px] font-mono border border-slate-800 transition-colors"
                  >
                    {copiedIssueId === issue.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Fix</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="text-xs font-mono text-emerald-300/90 whitespace-pre-wrap bg-slate-900/60 p-2.5 rounded-lg overflow-x-auto border border-slate-800">
                  {issue.fix}
                </pre>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Architecture & Refactoring Recommendations */}
      {refactoringTips && refactoringTips.length > 0 && (
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-3">
          <h4 className="text-xs uppercase font-mono tracking-wider text-amber-400 flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            <span>Senior Engineer Refactoring Guidance</span>
          </h4>
          <ul className="space-y-2 text-xs text-slate-300">
            {refactoringTips.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-2 bg-slate-950/40 p-2 rounded-lg border border-slate-800/40">
                <ChevronRight className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
