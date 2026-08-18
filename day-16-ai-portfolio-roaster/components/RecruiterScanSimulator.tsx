'use client';

import { useState } from 'react';
import { RoastResult } from '@/types';
import { Clock, Eye, AlertOctagon, CheckCircle2, UserCheck, Play, RotateCcw } from 'lucide-react';

interface Props {
  roast: RoastResult;
}

export default function RecruiterScanSimulator({ roast }: Props) {
  const [activeSecond, setActiveSecond] = useState<number>(5);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  const steps = [
    {
      sec: 1,
      name: '0.0s – 1.0s: Hero Visual & Specialty Scan',
      question: 'Does the candidate clearly define their primary stack in 3 words?',
      passed: roast.overallScore >= 50,
      feedback:
        roast.overallScore >= 50
          ? 'Clear job title and core stack detected in first fold.'
          : 'Vague "passionate coder" tagline caused 40% initial hesitation.',
    },
    {
      sec: 2,
      name: '1.0s – 2.0s: 1-Click ATS Resume Check',
      question: 'Is there a prominent PDF resume download button?',
      passed: roast.overallScore >= 65,
      feedback:
        roast.overallScore >= 65
          ? 'Direct resume action visible. Recruiter downloads PDF.'
          : 'Missing direct resume link. Recruiter forced to hunt through footer.',
    },
    {
      sec: 3,
      name: '2.0s – 3.5s: Project Impressiveness & Live Demos',
      question: 'Are there functional live URLs or only raw code repositories?',
      passed: roast.categories.projects.score >= 60,
      feedback:
        roast.categories.projects.score >= 60
          ? 'Live application demos with real user utility confirmed.'
          : 'Generic beginner clones or missing live URLs detected.',
    },
    {
      sec: 4,
      name: '3.5s – 4.5s: GitHub Verified Activity & Code Quality',
      question: 'Does GitHub show consistent commit cadence and clean READMEs?',
      passed: roast.overallScore >= 70,
      feedback:
        roast.overallScore >= 70
          ? 'Active repository commits and structured documentation verified.'
          : 'Sporadic commits or generic commit messages ("fix bug") noticed.',
    },
    {
      sec: 5,
      name: '5.0s: Final Screening Decision',
      question: 'Does the recruiter forward profile to Engineering Manager?',
      passed: roast.overallScore >= 70,
      feedback:
        roast.overallScore >= 70
          ? '🎉 PASSED SCREENING — Candidate shortlisted for Initial Technical Interview!'
          : '❌ DROPPED AT STAGE 1 — Candidate passed over due to generic presentation.',
    },
  ];

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setActiveSecond(1);

    let current = 1;
    const interval = setInterval(() => {
      current += 1;
      if (current <= 5) {
        setActiveSecond(current);
      } else {
        clearInterval(interval);
        setIsSimulating(false);
      }
    }, 1000);
  };

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-[#0f1420] border border-slate-800 space-y-6 font-mono text-xs text-slate-300 shadow-xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base font-outfit">
              Recruiter 5-Second Attention Scan Simulator
            </h3>
            <p className="text-xs text-slate-400">
              Second-by-second eye-tracking simulation of what FAANG &amp; startup recruiters notice
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleRunSimulation}
          disabled={isSimulating}
          className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-amber-500 text-amber-400 font-bold text-xs flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
        >
          {isSimulating ? <RotateCcw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
          <span>{isSimulating ? 'Scanning Portfolio...' : 'Replay 5s Scan'}</span>
        </button>
      </div>

      {/* 5-Step Timeline Grid */}
      <div className="space-y-3">
        {steps.map((step) => {
          const isCurrentOrPassed = activeSecond >= step.sec;
          if (!isCurrentOrPassed && isSimulating) return null;

          return (
            <div
              key={step.sec}
              className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                step.sec === activeSecond && isSimulating
                  ? 'bg-amber-500/10 border-amber-500 text-white shadow-lg shadow-amber-500/10 animate-in fade-in duration-200'
                  : step.passed
                  ? 'bg-slate-950/90 border-emerald-500/30 text-slate-300'
                  : 'bg-slate-950/90 border-rose-500/30 text-slate-300'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">{step.name}</span>
                  {step.passed ? (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[9px] font-bold">
                      ✓ PASS
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[9px] font-bold">
                      ⚠️ RISK
                    </span>
                  )}
                </div>
                <p className="font-bold text-white text-xs font-outfit">{step.question}</p>
                <p className="text-[11px] text-slate-400 font-sans">{step.feedback}</p>
              </div>

              <div className="shrink-0 flex items-center gap-2">
                {step.passed ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : (
                  <AlertOctagon className="w-5 h-5 text-rose-400" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
