'use client';

import { EvaluationReport } from '@/types';
import { Sparkles, Trophy, ShieldCheck, Zap, CheckCircle2, ArrowRight, FileCode, Check, RefreshCcw } from 'lucide-react';
import { useState } from 'react';

interface Props {
  evaluation: EvaluationReport;
  onNewInterview: () => void;
}

export default function AssessmentReport({ evaluation, onNewInterview }: Props) {
  const [copiedOptimal, setCopiedOptimal] = useState(false);

  const getGrade = (score: number) => {
    if (score >= 90) return { grade: 'A+', text: 'Exceptional FAANG Senior Level', color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' };
    if (score >= 80) return { grade: 'A', text: 'Strong Hire — Meets Benchmark', color: 'text-teal-400 border-teal-500/30 bg-teal-500/10' };
    if (score >= 70) return { grade: 'B', text: 'Pass with Minor Refactoring Notes', color: 'text-amber-400 border-amber-500/30 bg-amber-500/10' };
    return { grade: 'C', text: 'Needs Improvement on Edge Cases', color: 'text-rose-400 border-rose-500/30 bg-rose-500/10' };
  };

  const g = getGrade(evaluation.overallScore);

  const handleCopyOptimal = () => {
    navigator.clipboard.writeText(evaluation.optimalSolution);
    setCopiedOptimal(true);
    setTimeout(() => setCopiedOptimal(false), 2000);
  };

  return (
    <div className="space-y-8 font-mono text-xs text-slate-300 max-w-5xl mx-auto">
      {/* Top Banner Grade Scorecard */}
      <div className="rounded-3xl bg-[#0d1117] border border-emerald-500/30 p-6 sm:p-8 space-y-6 shadow-2xl shadow-emerald-500/10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <h2 className="text-xl font-bold text-white font-outfit">Technical Interview Assessment Report</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Candidate Evaluation Grade: <strong className="text-emerald-400 font-bold">{g.text}</strong>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className={`px-5 py-3 rounded-2xl border flex items-center gap-3 ${g.color}`}>
              <span className="text-3xl font-black font-outfit">{evaluation.overallScore}</span>
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-wider">Overall Score</span>
                <span className="text-xs font-bold">{g.grade} Grade</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Column Score Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-slate-400 text-[11px] font-bold">Correctness</span>
            <p className="text-2xl font-black text-emerald-400 font-outfit">{evaluation.correctnessScore}/100</p>
            <p className="text-[10px] text-slate-500">{evaluation.passedTestsCount}/{evaluation.totalTestsCount} Test Cases Passed</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-slate-400 text-[11px] font-bold">Code Quality &amp; Style</span>
            <p className="text-2xl font-black text-purple-400 font-outfit">{evaluation.codeQualityScore}/100</p>
            <p className="text-[10px] text-slate-500">Naming &amp; Structural Readability</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-slate-400 text-[11px] font-bold">Communication</span>
            <p className="text-2xl font-black text-amber-400 font-outfit">{evaluation.communicationScore}/100</p>
            <p className="text-[10px] text-slate-500">Approach Explanation Quality</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-slate-400 text-[11px] font-bold">Big-O Complexity</span>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold">{evaluation.timeComplexity}</span>
              <span className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-bold">{evaluation.spaceComplexity}</span>
            </div>
            <p className="text-[10px] text-slate-500">Time &amp; Space Efficiency</p>
          </div>
        </div>
      </div>

      {/* Strengths & Improvements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-[#0d1117] border border-emerald-500/20 space-y-4">
          <h3 className="font-bold text-white text-sm font-outfit flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Demonstrated Strengths
          </h3>
          <ul className="space-y-2 text-slate-300 text-xs">
            {evaluation.strengths.map((str, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-6 rounded-3xl bg-[#0d1117] border border-amber-500/20 space-y-4">
          <h3 className="font-bold text-white text-sm font-outfit flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            Areas for Refactoring &amp; Growth
          </h3>
          <ul className="space-y-2 text-slate-300 text-xs">
            {evaluation.improvements.map((imp, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span>{imp}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Optimal Solution Comparison */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0d1117] border border-slate-800 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="font-bold text-white text-base font-outfit flex items-center gap-2">
              <FileCode className="w-4 h-4 text-emerald-400" />
              Optimal Staff Engineer Solution Walkthrough
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">{evaluation.optimalExplanation}</p>
          </div>

          <button
            onClick={handleCopyOptimal}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:text-white hover:border-emerald-500/40 text-xs font-bold transition-all"
          >
            {copiedOptimal ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <span>Copy Solution</span>
            )}
          </button>
        </div>

        <pre className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-emerald-300 whitespace-pre-wrap max-h-[300px] overflow-y-auto leading-relaxed">
          {evaluation.optimalSolution}
        </pre>
      </div>

      {/* Personalized Roadmap & CTA */}
      <div className="p-6 rounded-3xl bg-slate-950 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-white text-sm font-outfit">Recommended Topics for Next Interview</h4>
          <div className="flex flex-wrap gap-2 mt-2">
            {evaluation.roadmapTopics.map((topic, idx) => (
              <span key={idx} className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-emerald-400 font-bold text-[11px]">
                {topic}
              </span>
            ))}
          </div>
        </div>

        <button
          onClick={onNewInterview}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-purple-600 text-black font-extrabold text-xs hover:opacity-95 transition-all shadow-xl shadow-emerald-500/20 shrink-0 flex items-center gap-2"
        >
          <RefreshCcw className="w-4 h-4 fill-black text-black" />
          <span>Start New Interview Session</span>
        </button>
      </div>
    </div>
  );
}
