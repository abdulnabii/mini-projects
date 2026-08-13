'use client';

import { EvaluationReport } from '@/types';
import { Sparkles, Trophy, ShieldCheck, Zap, CheckCircle2, ArrowRight, FileCode, Check, RefreshCcw, Download, BarChart2 } from 'lucide-react';
import { useState } from 'react';

interface Props {
  evaluation: EvaluationReport;
  onNewInterview: () => void;
}

export default function AssessmentReport({ evaluation, onNewInterview }: Props) {
  const [copiedOptimal, setCopiedOptimal] = useState(false);
  const [downloadedReport, setDownloadedReport] = useState(false);

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

  const handleDownloadReport = () => {
    setDownloadedReport(true);
    setTimeout(() => setDownloadedReport(false), 2000);

    const reportMd = `# 🤖 AlgoCoach.AI — Technical Interview Evaluation Report

## Candidate Overall Score: ${evaluation.overallScore}/100 (${g.grade} Grade)
**Assessment**: ${g.text}

### Score Breakdown
- **Correctness**: ${evaluation.correctnessScore}/100 (${evaluation.passedTestsCount}/${evaluation.totalTestsCount} Test Cases Passed)
- **Code Quality**: ${evaluation.codeQualityScore}/100
- **Communication**: ${evaluation.communicationScore}/100
- **Time Complexity**: ${evaluation.timeComplexity}
- **Space Complexity**: ${evaluation.spaceComplexity}

### Candidate Strengths
${evaluation.strengths.map((s) => `- ${s}`).join('\n')}

### Areas for Refactoring & Improvement
${evaluation.improvements.map((i) => `- ${i}`).join('\n')}

### Staff Engineer Optimal Solution
\`\`\`
${evaluation.optimalSolution}
\`\`\`
*Explanation*: ${evaluation.optimalExplanation}

### Recommended Next Topics
${evaluation.roadmapTopics.map((t) => `- ${t}`).join('\n')}
`;

    const blob = new Blob([reportMd], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Interview-Report-${evaluation.overallScore}pts.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Compute Radar Chart Points (5 axes)
  const correctnessNorm = evaluation.correctnessScore / 100;
  const qualityNorm = evaluation.codeQualityScore / 100;
  const commNorm = evaluation.communicationScore / 100;
  const overallNorm = evaluation.overallScore / 100;
  const efficiencyNorm = evaluation.timeComplexity.includes('O(1)') || evaluation.timeComplexity.includes('O(N)') ? 0.95 : 0.75;

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
            <button
              onClick={handleDownloadReport}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:text-white hover:border-emerald-500/40 text-xs font-bold transition-all"
            >
              {downloadedReport ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Downloaded Report!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-emerald-400" />
                  <span>Download Report (.MD)</span>
                </>
              )}
            </button>

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
            <p className="text-[10px] text-slate-500">Naming &amp; Readability</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-slate-400 text-[11px] font-bold">Communication</span>
            <p className="text-2xl font-black text-amber-400 font-outfit">{evaluation.communicationScore}/100</p>
            <p className="text-[10px] text-slate-500">Approach Explanation</p>
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

      {/* SVG Multi-Axis Skill Matrix Radar Chart */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0d1117] border border-emerald-500/20 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-white text-base font-outfit flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-emerald-400" />
            Multi-Axis Candidate Competency Matrix
          </h3>
          <span className="text-slate-500 text-[11px]">5-Point Skill Analysis</span>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-around gap-6 pt-2">
          {/* SVG Pentagonal Radar */}
          <div className="relative w-64 h-64 flex items-center justify-center shrink-0">
            <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-xl">
              {/* Outer Pentagons */}
              <polygon points="100,20 176,75 147,165 53,165 24,75" fill="none" stroke="#1e293b" strokeWidth="1.5" />
              <polygon points="100,45 152,82 133,145 67,145 48,82" fill="none" stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />
              <polygon points="100,70 128,90 119,125 81,125 72,90" fill="none" stroke="#1e293b" strokeWidth="1" strokeDasharray="2 2" />

              {/* Dynamic Candidate Skill Area Polygon */}
              <polygon
                points={`100,${100 - 80 * correctnessNorm} ${100 + 76 * qualityNorm},${100 - 25 * qualityNorm} ${100 + 47 * commNorm},${100 + 65 * commNorm} ${100 - 47 * efficiencyNorm},${100 + 65 * efficiencyNorm} ${100 - 76 * overallNorm},${100 - 25 * overallNorm}`}
                fill="rgba(16, 185, 129, 0.25)"
                stroke="#10b981"
                strokeWidth="2.5"
              />

              {/* Data Node Dots */}
              <circle cx="100" cy={100 - 80 * correctnessNorm} r="4" fill="#10b981" />
              <circle cx={100 + 76 * qualityNorm} cy={100 - 25 * qualityNorm} r="4" fill="#a855f7" />
              <circle cx={100 + 47 * commNorm} cy={100 + 65 * commNorm} r="4" fill="#f59e0b" />
              <circle cx={100 - 47 * efficiencyNorm} cy={100 + 65 * efficiencyNorm} r="4" fill="#06b6d4" />
              <circle cx={100 - 76 * overallNorm} cy={100 - 25 * overallNorm} r="4" fill="#3b82f6" />
            </svg>
          </div>

          {/* Legend */}
          <div className="space-y-3 font-mono text-xs w-full max-w-md">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Correctness &amp; Test Pass</span>
              <strong className="text-emerald-400 font-bold">{evaluation.correctnessScore}%</strong>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-purple-400" /> Code Quality &amp; Structure</span>
              <strong className="text-purple-400 font-bold">{evaluation.codeQualityScore}%</strong>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Verbal Communication</span>
              <strong className="text-amber-400 font-bold">{evaluation.communicationScore}%</strong>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> Algorithmic Efficiency</span>
              <strong className="text-cyan-400 font-bold">{Math.round(efficiencyNorm * 100)}%</strong>
            </div>
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
