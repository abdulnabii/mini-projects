'use client';

import { useState, useEffect, useRef } from 'react';
import { RemediationStep } from '@/types';
import {
  Terminal,
  Play,
  CheckCircle2,
  AlertTriangle,
  X,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  CornerDownLeft,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  step: RemediationStep | null;
  serviceName: string;
  onStepFinished: (stepNumber: number) => void;
}

export default function RunbookTerminalDrawer({
  isOpen,
  onClose,
  step,
  serviceName,
  onStepFinished,
}: Props) {
  const [outputLines, setOutputLines] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [customCommand, setCustomCommand] = useState('');
  const terminalBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && step) {
      runRemediationSequence(step);
    }
  }, [isOpen, step]);

  useEffect(() => {
    terminalBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [outputLines]);

  if (!isOpen || !step) return null;

  const runRemediationSequence = (currentStep: RemediationStep) => {
    setIsRunning(true);
    setIsCompleted(false);
    setOutputLines([
      `[OpsPulse-SRE-Runner] Target cluster: production-k8s-us-east-1`,
      `[OpsPulse-SRE-Runner] Authorizing privileged SRE service-account token...`,
      `[OpsPulse-SRE-Runner] Executing Step ${currentStep.step}: ${currentStep.action}`,
      `$ ${currentStep.command}`,
    ]);

    // Simulated terminal streaming outputs tailored to SRE commands
    const outputs = generateOutputsForCommand(currentStep.command, serviceName);

    outputs.forEach((line, index) => {
      setTimeout(() => {
        setOutputLines((prev) => [...prev, line]);
        if (index === outputs.length - 1) {
          setIsRunning(false);
          setIsCompleted(true);
          onStepFinished(currentStep.step);
        }
      }, (index + 1) * 450);
    });
  };

  const handleRunCustomCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customCommand.trim()) return;

    const cmd = customCommand.trim();
    setCustomCommand('');
    setOutputLines((prev) => [...prev, `$ ${cmd}`]);

    setTimeout(() => {
      if (cmd.startsWith('kubectl get pods') || cmd.startsWith('kubectl get po')) {
        setOutputLines((prev) => [
          ...prev,
          `NAME                                READY   STATUS    RESTARTS   AGE`,
          `${serviceName}-7f89d4b-9k21a        1/1     Running   0          42s`,
          `${serviceName}-7f89d4b-mnk44        1/1     Running   0          40s`,
          `${serviceName}-7f89d4b-q9x12        1/1     Running   0          38s`,
        ]);
      } else if (cmd.startsWith('kubectl logs') || cmd.startsWith('kubectl log')) {
        setOutputLines((prev) => [
          ...prev,
          `[INFO] [${new Date().toISOString()}] Server listening on port 8080`,
          `[INFO] [${new Date().toISOString()}] HikariCP-1 - Pool initialized (active: 12/100, idle: 88)`,
          `[INFO] [${new Date().toISOString()}] Health probe /healthz responded 200 OK (latency: 1.2ms)`,
        ]);
      } else if (cmd.startsWith('curl') || cmd.startsWith('http')) {
        setOutputLines((prev) => [
          ...prev,
          `HTTP/1.1 200 OK`,
          `content-type: application/json`,
          `{"status":"UP","healthy":true,"service":"${serviceName}","active_connections":14,"error_rate":"0.00%"}`,
        ]);
      } else {
        setOutputLines((prev) => [
          ...prev,
          `[stdout] Command completed successfully with exit code 0.`,
          `[verification] Cluster state is stable.`,
        ]);
      }
    }, 400);
  };

  const handleCopyCommand = () => {
    navigator.clipboard.writeText(step.command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto font-mono text-xs">
      <div className="bg-[#060a12] border border-emerald-500/40 rounded-2xl max-w-3xl w-full space-y-3 p-5 shadow-2xl my-8 flex flex-col max-h-[85vh]">
        {/* Terminal Window Chrome */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 shrink-0">
          <div className="flex items-center gap-2.5">
            {/* macOS / Unix Style Terminal Buttons */}
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            </div>
            <div className="flex items-center gap-2 pl-2 border-l border-white/[0.08]">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-white text-xs">
                SRE Shell Runner: Step {step.step} / {step.action}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyCommand}
              className="px-2.5 py-1 rounded bg-[#0d1424] border border-white/[0.08] hover:border-white/[0.2] text-slate-300 text-[11px] flex items-center gap-1 cursor-pointer"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              type="button"
              onClick={() => runRemediationSequence(step)}
              disabled={isRunning}
              className="px-2.5 py-1 rounded bg-emerald-500/15 border border-emerald-500/30 hover:border-emerald-400 text-emerald-400 text-[11px] font-bold flex items-center gap-1 cursor-pointer disabled:opacity-50"
            >
              <RotateCcw className={`w-3 h-3 ${isRunning ? 'animate-spin' : ''}`} />
              <span>Rerun</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded bg-[#0f1422] text-slate-400 hover:text-white transition-colors cursor-pointer border border-white/[0.08]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Command Badge Header */}
        <div className="p-3 rounded-xl bg-[#04060c] border border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px]">
          <div className="space-y-0.5">
            <span className="text-slate-400 uppercase text-[9px] font-bold tracking-wider">
              Executing SRE Remediation Command:
            </span>
            <code className="text-emerald-400 font-bold block select-all break-all">
              {step.command}
            </code>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            {isRunning ? (
              <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-bold flex items-center gap-1.5 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                <span>EXECUTING...</span>
              </span>
            ) : isCompleted ? (
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>EXIT CODE 0 (SUCCESS)</span>
              </span>
            ) : null}
          </div>
        </div>

        {/* Terminal Output Screen */}
        <div className="flex-1 overflow-y-auto p-4 rounded-xl bg-[#020408] border border-white/[0.06] text-slate-200 font-mono text-[11px] leading-relaxed space-y-1 select-all min-h-[260px] max-h-[380px]">
          {outputLines.map((line, idx) => {
            const isPrompt = line.startsWith('$');
            const isSuccess = line.includes('successfully') || line.includes('HTTP 200') || line.includes('rolled back');
            const isWarning = line.includes('waiting') || line.includes('restarting');
            const isMeta = line.startsWith('[OpsPulse-SRE-Runner]');

            return (
              <div
                key={idx}
                className={`break-words ${
                  isPrompt
                    ? 'text-cyan-300 font-bold pt-1'
                    : isSuccess
                    ? 'text-emerald-400 font-medium'
                    : isWarning
                    ? 'text-amber-300'
                    : isMeta
                    ? 'text-slate-500'
                    : 'text-slate-300'
                }`}
              >
                {line}
              </div>
            );
          })}
          {isRunning && (
            <div className="flex items-center gap-2 text-emerald-400 pt-1">
              <span className="w-2 h-3.5 bg-emerald-400 animate-pulse" />
            </div>
          )}
          <div ref={terminalBottomRef} />
        </div>

        {/* Interactive Custom CLI Prompt Bar */}
        <form onSubmit={handleRunCustomCommand} className="flex items-center gap-2 shrink-0 pt-1">
          <div className="relative flex-1">
            <span className="absolute left-3 top-2.5 text-emerald-400 font-bold">$</span>
            <input
              type="text"
              value={customCommand}
              onChange={(e) => setCustomCommand(e.target.value)}
              placeholder="Run ad-hoc probe (e.g., 'kubectl get pods', 'curl -s ...', 'kubectl logs')"
              className="w-full pl-7 pr-4 py-2 rounded-xl bg-[#04060c] border border-white/[0.08] text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 font-mono"
            />
          </div>
          <button
            type="submit"
            className="px-3.5 py-2 rounded-xl bg-emerald-500 text-black font-extrabold text-xs transition-all hover:bg-emerald-400 flex items-center gap-1 cursor-pointer"
          >
            <CornerDownLeft className="w-3.5 h-3.5" />
            <span>Send</span>
          </button>
        </form>
      </div>
    </div>
  );
}

function generateOutputsForCommand(command: string, service: string): string[] {
  if (command.includes('rollout undo')) {
    return [
      `deployment.apps/${service} rollback triggered to revision 1 (stable)`,
      `waiting for rollout to finish: 1 of 3 updated replicas are available...`,
      `waiting for rollout to finish: 2 of 3 updated replicas are available...`,
      `waiting for rollout to finish: 3 of 3 updated replicas are available...`,
      `deployment.apps/${service} successfully rolled back (Revision 1)`,
      `[HEALTH CHECK] GET http://${service}:8080/healthz => HTTP 200 OK (1.4ms)`,
      `[VERIFICATION] Active connection pool checkout wait: 0ms (0 queued)`,
    ];
  }

  if (command.includes('pg_terminate_backend')) {
    return [
      `Connecting to PostgreSQL primary instance (sslmode=require)...`,
      `Executing query: SELECT pg_terminate_backend(pid)...`,
      `Terminated 84 orphaned idle client backend processes (SIGTERM)`,
      `Connection pool capacity freed: 84 / 100 slots reclaimed`,
      `[VERIFICATION] SELECT count(*) FROM pg_stat_activity => 16 connections active`,
    ];
  }

  if (command.includes('set resources') || command.includes('limits=memory')) {
    return [
      `deployment.apps/${service} resource limits updated: memory=2Gi, cpu=1000m`,
      `Triggering rolling update for container spec patch...`,
      `pod/${service}-new-alloc-01 created with 2048Mi ceiling`,
      `cgroup memory pressure drops from 98.4% to 24.1%`,
      `OOMKill cycling stopped (exit code 0)`,
    ];
  }

  if (command.includes('CONFIG SET maxmemory') || command.includes('redis-cli')) {
    return [
      `Connecting to redis-cluster.internal:6379...`,
      `CONFIG SET maxmemory 16gb => OK`,
      `Eviction engine volatile-lru deactivated (memory buffer: 7.8GB available)`,
      `[VERIFICATION] redis-cli info memory => used_memory: 8.12G, maxmemory: 16.00G`,
    ];
  }

  if (command.includes('patch configmap') || command.includes('ssl-session-tickets')) {
    return [
      `configmap/nginx-configuration patched successfully`,
      `Ingress controller reloading configuration without connection drop (HUP)`,
      `TLS 1.3 0-RTT session tickets active across EU edge clusters`,
      `[VERIFICATION] Handshake latency normalized to 32ms`,
    ];
  }

  return [
    `Executing command in production namespace...`,
    `Command executed successfully with status 0`,
    `[VERIFICATION] Target service returned HTTP 200 OK`,
  ];
}
