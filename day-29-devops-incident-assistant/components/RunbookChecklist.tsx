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
  Flame,
  ShieldAlert,
  X,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  steps: RemediationStep[];
  serviceName: string;
  completedSteps: Record<number, boolean>;
  onToggleStep: (stepNumber: number) => void;
  onMarkStepComplete: (stepNumber: number) => void;
}

export default function RunbookChecklist({
  steps,
  serviceName,
  completedSteps,
  onToggleStep,
  onMarkStepComplete,
}: Props) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [executingIndex, setExecutingIndex] = useState<number | null>(null);

  // Safety Confirmation Modal State for Gated High/Medium Risk SRE Actions
  const [confirmStep, setConfirmStep] = useState<{ step: RemediationStep; idx: number } | null>(null);

  const handleCopyCommand = (cmd: string, idx: number) => {
    navigator.clipboard.writeText(cmd);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleInitiateRun = (step: RemediationStep, idx: number) => {
    // Gate MEDIUM, HIGH, and CRITICAL risk commands with a safety confirmation dialog
    if (step.risk === 'HIGH' || step.risk === 'MEDIUM' || step.risk === 'CRITICAL') {
      setConfirmStep({ step, idx });
    } else {
      executeRunSimulation(step.step, idx);
    }
  };

  const executeRunSimulation = (stepNumber: number, idx: number) => {
    setConfirmStep(null);
    setExecutingIndex(idx);

    setTimeout(() => {
      setExecutingIndex(null);
      onMarkStepComplete(stepNumber);
      confetti({
        particleCount: 25,
        spread: 50,
        origin: { y: 0.7 },
        colors: ['#10b981', '#06b6d4'],
      });
    }, 1400);
  };

  // Distinct risk color taxonomy with wide hue separation & unique iconography
  const getRiskDetails = (risk: string) => {
    switch (risk) {
      case 'CRITICAL':
        return {
          style: 'bg-rose-500/20 text-rose-400 border-rose-500/40',
          icon: <ShieldAlert className="w-3 h-3 text-rose-400" />,
          label: 'CRITICAL RISK',
        };
      case 'HIGH':
        return {
          style: 'bg-orange-500/20 text-orange-400 border-orange-500/40',
          icon: <Flame className="w-3 h-3 text-orange-400" />,
          label: 'HIGH RISK',
        };
      case 'MEDIUM':
        return {
          style: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          icon: <AlertTriangle className="w-3 h-3 text-amber-400" />,
          label: 'MEDIUM RISK',
        };
      default:
        return {
          style: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
          icon: <CheckCircle2 className="w-3 h-3 text-cyan-400" />,
          label: 'LOW RISK',
        };
    }
  };

  const completedCount = steps.filter((s) => completedSteps[s.step]).length;
  const progressPercent = Math.round((completedCount / Math.max(1, steps.length)) * 100);
  const isFullyRestored = progressPercent === 100 && steps.length > 0;

  return (
    <div className="bg-[#090d16] border border-white/[0.08] rounded-xl p-4 space-y-3.5 shadow-2xl font-mono text-xs text-slate-300 flex flex-col sre-card">
      {/* Header with Progress Metric */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-3">
        <div className="flex items-center gap-2">
          <div
            className={`w-6 h-6 rounded flex items-center justify-center ${
              isFullyRestored
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
            }`}
          >
            <ListChecks className="w-3.5 h-3.5" />
          </div>
          <h3 className="font-bold text-white text-xs font-mono uppercase tracking-wider">
            Remediation Runbook ({completedCount}/{steps.length} Applied)
          </h3>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="w-24 h-2 bg-[#04080e] rounded-full overflow-hidden border border-white/[0.08]">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isFullyRestored
                  ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50'
                  : 'bg-gradient-to-r from-amber-400 to-emerald-400'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span
            className={`font-bold text-xs ${
              isFullyRestored ? 'text-emerald-400 flex items-center gap-1 font-extrabold' : 'text-slate-300'
            }`}
          >
            {isFullyRestored && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
            <span>{progressPercent}% Restored</span>
          </span>
        </div>
      </div>

      {/* Steps List */}
      <div className="space-y-2.5">
        {steps.map((step, idx) => {
          const isDone = !!completedSteps[step.step];
          const isRunning = executingIndex === idx;
          const riskDetails = getRiskDetails(step.risk);

          return (
            <div
              key={idx}
              className={`p-3.5 rounded-lg border transition-all space-y-2 ${
                isDone
                  ? 'bg-emerald-950/25 border-emerald-500/50'
                  : 'bg-[#0f1422] border-white/[0.06] hover:border-white/[0.14]'
              }`}
            >
              {/* Step Header with Risk Badges & Icons */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isDone}
                    onChange={() => onToggleStep(step.step)}
                    className="w-4 h-4 rounded accent-emerald-500 cursor-pointer"
                  />
                  <span
                    className={`font-bold text-xs font-mono ${
                      isDone ? 'text-emerald-300 line-through opacity-80' : 'text-white'
                    }`}
                  >
                    Step #{step.step}: {step.action}
                  </span>
                </div>

                <span
                  className={`px-2 py-0.5 rounded text-[9px] font-bold border font-mono flex items-center gap-1 shrink-0 ${riskDetails.style}`}
                >
                  {riskDetails.icon}
                  <span>{riskDetails.label}</span>
                </span>
              </div>

              {/* CLI Command Box */}
              <div className="p-2 rounded bg-[#04060a] border border-white/[0.06] flex items-center justify-between gap-2 font-mono text-[11px]">
                <div className="flex items-center gap-1.5 overflow-x-auto select-all">
                  <span className="text-emerald-400 font-bold">$</span>
                  <code className="text-slate-200">{step.command}</code>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleCopyCommand(step.command, idx)}
                    className="p-1 rounded bg-[#0f1422] hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer border border-white/[0.06]"
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
                    onClick={() => handleInitiateRun(step, idx)}
                    disabled={isRunning || isDone}
                    className={`px-2.5 py-1 rounded font-bold text-[10px] transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50 font-mono ${
                      isDone
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : step.risk === 'HIGH' || step.risk === 'CRITICAL'
                        ? 'bg-orange-500 text-black hover:bg-orange-400 shadow-sm'
                        : 'bg-emerald-500 text-black hover:bg-emerald-400 shadow-sm'
                    }`}
                  >
                    <Play className={`w-2.5 h-2.5 ${isRunning ? 'animate-spin' : ''}`} />
                    <span>{isDone ? 'Applied' : isRunning ? 'Executing...' : step.risk === 'LOW' ? 'Run' : 'Gated Run'}</span>
                  </button>
                </div>
              </div>

              {/* Expected Outcome */}
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
                <span className="text-slate-500 font-bold">Outcome:</span>
                <span className="text-emerald-300/90">{step.expectedOutcome}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* SRE Gated Safety Confirmation Modal */}
      {confirmStep && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#090d16] border border-orange-500/50 rounded-xl p-5 max-w-lg w-full space-y-4 shadow-2xl font-mono text-xs text-slate-300">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-orange-400" />
                <h4 className="font-bold text-white text-sm font-mono">
                  Gated Production Action Gate
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setConfirmStep(null)}
                className="text-slate-500 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Target Cluster:</span>
                <strong className="text-white font-mono">production (k8s-us-east-1)</strong>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Service:</span>
                <strong className="text-cyan-400 font-mono">{serviceName}</strong>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Action Risk Classification:</span>
                <span className="px-2 py-0.2 rounded bg-orange-500/20 text-orange-400 border border-orange-500/40 text-[10px] font-bold">
                  {confirmStep.step.risk} RISK (DESTRUCTIVE POTENTIAL)
                </span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#04060a] border border-white/[0.06] space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Command Payload:</span>
              <pre className="text-emerald-400 text-[11px] whitespace-pre-wrap select-all font-mono">
                {confirmStep.step.command}
              </pre>
            </div>

            <div className="p-2.5 rounded-lg bg-orange-500/10 border border-orange-500/30 text-[10px] text-orange-300 space-y-0.5">
              <p className="font-bold">⚠️ SRE Impact Notice:</p>
              <p className="prose-text text-slate-300">
                This command terminates active backend sessions or reallocates live container limits. A confirmation record will be logged in the incident audit trail.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setConfirmStep(null)}
                className="px-3 py-1.5 rounded-lg bg-[#0f1422] text-slate-400 hover:text-white text-xs font-mono cursor-pointer"
              >
                Abort Action
              </button>
              <button
                type="button"
                onClick={() => executeRunSimulation(confirmStep.step.step, confirmStep.idx)}
                className="px-4 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-400 text-black font-extrabold text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-orange-500/20"
              >
                <Play className="w-3 h-3" />
                <span>Confirm &amp; Execute on Production</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
