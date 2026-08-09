'use client';

import React from 'react';
import { ATSAnalysisResult } from '@/types';
import { Award, CheckCircle2, AlertTriangle, Lightbulb, Target } from 'lucide-react';

interface ATSGaugeProps {
  result: ATSAnalysisResult;
}

export default function ATSScoreGauge({ result }: ATSGaugeProps) {
  const { score, grade, summary, matchedKeywords, missingKeywords, suggestions, keywordDensity } = result;

  const getScoreColor = (s: number) => {
    if (s >= 85) return { text: 'text-emerald-400', border: 'border-emerald-500/40', bg: 'bg-emerald-950/40', ring: 'stroke-emerald-400' };
    if (s >= 70) return { text: 'text-indigo-400', border: 'border-indigo-500/40', bg: 'bg-indigo-950/40', ring: 'stroke-indigo-400' };
    if (s >= 55) return { text: 'text-amber-400', border: 'border-amber-500/40', bg: 'bg-amber-950/40', ring: 'stroke-amber-400' };
    return { text: 'text-rose-400', border: 'border-rose-500/40', bg: 'bg-rose-950/40', ring: 'stroke-rose-500' };
  };

  const colors = getScoreColor(score);
  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className={`p-5 rounded-2xl border ${colors.border} ${colors.bg} backdrop-blur-xl space-y-4 font-sans`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" className="stroke-slate-800" strokeWidth="8" fill="transparent" />
              <circle
                cx="50"
                cy="50"
                r="40"
                className={`transition-all duration-1000 ease-out ${colors.ring}`}
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute text-center">
              <span className={`text-xl font-extrabold font-mono block ${colors.text}`}>{score}%</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Grade {grade}</span>
            </div>
          </div>

          <div>
            <div className="text-[10px] uppercase font-mono tracking-widest text-indigo-400 mb-1 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-indigo-400" />
              <span>ATS Keyword Match Engine</span>
            </div>
            <h4 className="text-sm font-bold text-white leading-snug">{summary}</h4>
            <p className="text-xs text-slate-400 mt-1">
              Keyword Density: <strong className="text-slate-200">{keywordDensity}%</strong> (Optimal: 2.0% – 3.5%)
            </p>
          </div>
        </div>

        <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase font-mono">Target Threshold</span>
          <span className="text-xs font-bold font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800/60">
            ≥ 80% Pass Score
          </span>
        </div>
      </div>

      {/* Matched & Missing Chips */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800/80 text-xs">
        {/* Matched Keywords */}
        <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 space-y-1.5">
          <span className="font-mono text-[11px] text-emerald-400 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Matched Keywords ({matchedKeywords.length}):
          </span>
          <div className="flex flex-wrap gap-1">
            {matchedKeywords.length === 0 ? (
              <span className="text-[11px] text-slate-500 italic">No target keywords matched yet</span>
            ) : (
              matchedKeywords.map((kw, idx) => (
                <span key={idx} className="bg-emerald-950/80 text-emerald-300 px-2 py-0.5 rounded text-[10px] font-mono border border-emerald-800/40">
                  ✓ {kw}
                </span>
              ))
            )}
          </div>
        </div>

        {/* Missing Keywords */}
        <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 space-y-1.5">
          <span className="font-mono text-[11px] text-rose-400 font-bold flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" /> Missing High-Value Terms ({missingKeywords.length}):
          </span>
          <div className="flex flex-wrap gap-1">
            {missingKeywords.length === 0 ? (
              <span className="text-[11px] text-emerald-400 italic">Perfect! All target keywords included.</span>
            ) : (
              missingKeywords.slice(0, 8).map((kw, idx) => (
                <span key={idx} className="bg-rose-950/80 text-rose-300 px-2 py-0.5 rounded text-[10px] font-mono border border-rose-800/40">
                  + {kw}
                </span>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="bg-indigo-950/20 p-3 rounded-xl border border-indigo-800/40 text-xs space-y-1">
          <span className="text-indigo-400 font-bold font-mono flex items-center gap-1">
            <Lightbulb className="w-3.5 h-3.5" /> AI Optimization Tips:
          </span>
          <ul className="list-disc list-inside text-slate-300 space-y-0.5">
            {suggestions.map((sug, idx) => (
              <li key={idx}>{sug}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
