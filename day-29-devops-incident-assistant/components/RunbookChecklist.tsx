'use client';

import { useState } from 'react';
import { RemediationStep } from '@/types';
import {
  ListChecks,
  CheckCircle2,
  Copy,
  Check,
  Play,
  AlertTriangle,
  Terminal,
  ShieldAlert,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  steps: RemediationStep[];
  serviceName: string;
}

export default function RunbookChecklist({ steps, serviceName }: Props) {
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [executingIndex, setExecutingIndex] = useState<number | null>(null);

  const toggleStep = (stepNumber: number) => {
    const next = { ...completedSteps, [stepNumber]: !completedSteps[stepNumber] };
    setCompletedSteps(next);

    const allDone = steps.every((s) => next[s.step]);
    if (allDone) {
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#10b981', '#f59e0b', '#06b6d4'],
      });
    }
  };

  const handleCopyCommand = (cmd: string, idx: number) => {
    navigator.clipboard.writeText(cmd);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleSimulateExecution = (stepNumber: number, idx: number) => {
    setExecutingIndex(idx);
    setTimeout(() => {
      setExecutingIndex(null);
      setCompletedSteps((prev) => ({ ...prev, [stepNumber]: true }));
      confetti({
        particleCount: 20,
        spread: 50,
        origin: { y: 0.7 },
        colors: ['#10b981', '#06b6d4'],
      });
    }, 1500);
  };

  const getRiskStyle = (risk: string) => {
    switch (risk) {
      case 'CRITICAL':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/40';
      case 'HIGH':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      case 'MEDIUM':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40';
      default:
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
    }
  };

  const completedCount = steps.filter((s) => completedSteps[s.step]).length;
  const progressPercent = Math.round((completedCount / Math.max(1, steps.length)) * 100);

  return (
    <div className="bg-[#090d16] border border-white/[0.08] rounded-xl p-4 space-y-3.5 shadow-2xl font-mono text-xs text-slate-300 flex flex-col sre-card">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <ListChecks className="w-3.5 h-3.5" />
          </div>
          <h3 className="font-bold text-white text-xs font-mono uppercase tracking-wider">
            Automated Remediation Runbook ({completedCount}/{steps.length} Applied)
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-20 h-1.5 bg-[#04080e] rounded-full overflow-hidden border border-white/[0.08]">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-emerald-400 font-bold text-xs">{progressPercent}% Restored</span>
        </div>
      </div>

      {/* Steps List */}
      <div className="space-y-2.5">
        {steps.map((step, idx) => {
          const isDone = !!completedSteps[step.step];
          const isRunning = executingIndex === idx;

          return (
            <div
              key={idx}
              className={`p-3.5 rounded-lg border transition-all space-y-2 ${
                isDone
                  ? 'bg-emerald-950/20 border-emerald-500/40'
                  : 'bg-[#0f1422] border-white/[0.06] hover:border-white/[0.12]'
              }`}
            >
              {/* Step Header */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isDone}
                    onChange={() => toggleStep(step.step)}
                    className="w-3.5 h-3.5 rounded accent-emerald-500 cursor-pointer"
                  />
                  <span className="font-bold text-white text-xs font-mono">
                    Step #{step.step}: {step.action}
                  </span>
                </div>

                <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold border font-mono ${getRiskStyle(step.risk)}`}>
                  {step.risk} RISK
                </span>
              </div>

              {/* CLI Command Box */}
              <div className="p-2 rounded bg-[#04060a] border border-white/[0.06] flex items-center justify-between gap-2 font-mono text-[11px]">
                <div className="flex items-center gap-1.5 overflow-x-auto select-all">
                  <span className="text-emerald-400 font-bold">$</span>
                  <code className="text-slate-200">{step.command}</code>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleCopyCommand(step.command, idx)}
                    className="p-1 rounded bg-[#0f1422] hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
                    title="Copy CLI command"
                  >
                    {copiedIndex === idx ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSimulateExecution(step.step, idx)}
                    disabled={isRunning || isDone}
                    className="px-2 py-0.8 rounded bg-emerald-500 text-black hover:bg-emerald-400 font-bold text-[10px] transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50"
                  >
                    <Play className={`w-2.5 h-2.5 ${isRunning ? 'animate-spin' : ''}`} />
                    <span>{isDone ? 'Applied' : isRunning ? 'Running...' : 'Run'}</span>
                  </button>
                </div>
              </div>

              {/* Expected Outcome */}
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
                <span className="text-slate-500 font-bold">Outcome:</span>
                <span className="text-emerald-300">{step.expectedOutcome}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
