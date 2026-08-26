'use client';

import { useState } from 'react';
import { AIUsageLog, Organization } from '@/types';
import {
  Zap,
  Sparkles,
  Code2,
  BarChart3,
  FileText,
  Copy,
  Check,
  Clock,
  Coins,
  Cpu,
  AlertTriangle,
  Lock,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  activeOrg: Organization;
  usageLogs: AIUsageLog[];
  onExecuteAIFeature: (
    feature: 'COPYWRITER' | 'CODE_GEN' | 'DATA_ANALYST',
    prompt: string
  ) => Promise<string>;
  isGenerating: boolean;
  onNavigateToBilling: () => void;
}

const PERSONA_TEMPLATES = {
  COPYWRITER: [
    'Write a high-converting landing page headline and 3 value pillars for an AI Customer Support SaaS.',
    'Draft a 1-click renewal discount email for a customer whose usage has declined by 40%.',
    'Generate 5 viral Twitter/LinkedIn launch hook variations for a developer productivity tool.',
  ],
  CODE_GEN: [
    'Write an Upstash Redis rate-limiting middleware in Next.js 16 with token bucket algorithm.',
    'Create a Drizzle ORM PostgreSQL schema for multi-tenant organizations and Stripe subscriptions.',
    'Write a robust Stripe webhook listener for subscription billing lifecycle events with idempotent handling.',
  ],
  DATA_ANALYST: [
    'Analyze an AI SaaS with $14.8k MRR, 1.8% churn, and $0.12 token cost ratio per $1 MRR.',
    'Formulate a pricing strategy to convert free tier users who consume 80% quota in under 7 days.',
    'Calculate expected Net Revenue Retention (NRR) and LTV/CAC payback period based on SaaS cohort telemetry.',
  ],
};

const FEATURE_COSTS = {
  COPYWRITER: 3,
  CODE_GEN: 5,
  DATA_ANALYST: 4,
};

export default function AIPlayground({
  activeOrg,
  usageLogs,
  onExecuteAIFeature,
  isGenerating,
  onNavigateToBilling,
}: Props) {
  const [selectedFeature, setSelectedFeature] = useState<'COPYWRITER' | 'CODE_GEN' | 'DATA_ANALYST'>(
    'COPYWRITER'
  );
  const [promptInput, setPromptInput] = useState(PERSONA_TEMPLATES.COPYWRITER[0]);
  const [outputResult, setOutputResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const [lastTelemetry, setLastTelemetry] = useState<{
    inputTokens: number;
    outputTokens: number;
    creditsUsed: number;
    latencyMs: number;
  } | null>(null);

  const requiredCredits = FEATURE_COSTS[selectedFeature];
  const isZeroCredits = activeOrg.creditsRemaining <= 0;
  const isInsufficientCredits = activeOrg.creditsRemaining < requiredCredits;
  const isLowCredits = activeOrg.creditsRemaining > 0 && activeOrg.creditsRemaining < 10;

  const handleSelectPersona = (feature: 'COPYWRITER' | 'CODE_GEN' | 'DATA_ANALYST') => {
    setSelectedFeature(feature);
    setPromptInput(PERSONA_TEMPLATES[feature][0]);
  };

  const handleRun = async () => {
    if (!promptInput.trim() || isGenerating || isInsufficientCredits) return;

    try {
      const startTime = Date.now();
      const text = await onExecuteAIFeature(selectedFeature, promptInput);
      const latencyMs = Date.now() - startTime;

      setOutputResult(text);
      setLastTelemetry({
        inputTokens: Math.max(12, Math.round(promptInput.length / 3.8)),
        outputTokens: Math.max(30, Math.round(text.length / 3.8)),
        creditsUsed: requiredCredits,
        latencyMs,
      });

      confetti({
        particleCount: 25,
        spread: 50,
        origin: { y: 0.7 },
        colors: ['#10b981', '#6366f1'],
      });
    } catch (err) {
      console.error('Execution error:', err);
    }
  };

  const handleCopy = () => {
    if (!outputResult) return;
    navigator.clipboard.writeText(outputResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const creditPercentage = Math.round(
    (activeOrg.creditsRemaining / Math.max(1, activeOrg.creditsTotal)) * 100
  );

  return (
    <div className="space-y-6 font-mono text-xs text-slate-300">
      {/* Visual Proof Point Badge */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>INTERACTIVE PROOF POINT • LIVE METERED AI FEATURE STUDIO</span>
        </div>
        <span className="text-slate-500 text-[10px]">
          Target Architecture: Gemini 1.5 Flash + Upstash Redis Token Bucket
        </span>
      </div>

      {/* Low Credits Warning Banner */}
      {isLowCredits && (
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-between gap-3 text-amber-300 animate-pulse">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="font-bold text-xs">
              Low AI Credit Allocation: Only {activeOrg.creditsRemaining} credits remaining in your {activeOrg.plan.toUpperCase()} tier quota.
            </span>
          </div>
          <button
            type="button"
            onClick={onNavigateToBilling}
            className="px-3 py-1 rounded-lg bg-amber-500 text-black font-extrabold hover:bg-amber-400 transition-colors cursor-pointer shrink-0 font-mono text-[11px]"
          >
            Upgrade Plan →
          </button>
        </div>
      )}

      {/* Insufficient / Blocked Credits Alert Banner */}
      {isZeroCredits && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/40 flex items-center justify-between gap-3 text-rose-300">
          <div className="flex items-center gap-2.5">
            <Lock className="w-5 h-5 text-rose-400 shrink-0" />
            <div className="space-y-0.5">
              <span className="font-bold text-xs text-white">
                Monthly AI Credit Quota Exhausted (0 Credits Remaining)
              </span>
              <p className="text-[10px] text-slate-400 prose-text">
                All AI inference requests are currently blocked. Upgrade to Pro ($19/mo) to unlock 750 credits instantly.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onNavigateToBilling}
            className="px-4 py-2 rounded-lg bg-emerald-500 text-black font-extrabold hover:bg-emerald-400 transition-all cursor-pointer shrink-0 font-mono text-xs shadow-lg shadow-emerald-500/20"
          >
            Upgrade to Pro (750 Credits) →
          </button>
        </div>
      )}

      {/* 1. Credit Quota & Telemetry Header */}
      <div className="p-4 rounded-xl bg-[#090d16] border border-white/[0.08] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl sre-card">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-white text-xs font-mono uppercase tracking-wider">
              {activeOrg.name} — Quota Telemetry
            </h3>
            <p className="text-[10px] text-slate-400 font-mono">
              Plan: <strong className="text-white uppercase">{activeOrg.plan}</strong> • Resets on {new Date(activeOrg.currentPeriodEnd).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <div className="text-right space-y-1">
            <div className="flex items-center justify-end gap-1.5 font-bold text-xs">
              <span className={isLowCredits ? 'text-amber-400' : 'text-emerald-400'}>
                {activeOrg.creditsRemaining}
              </span>
              <span className="text-slate-500">/ {activeOrg.creditsTotal} Credits</span>
            </div>
            <div className="w-32 h-1.5 bg-[#04080e] rounded-full overflow-hidden border border-white/[0.08]">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  isLowCredits
                    ? 'bg-amber-400'
                    : 'bg-gradient-to-r from-amber-400 to-emerald-400'
                }`}
                style={{ width: `${creditPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Studio Grid (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Feature Selector & Prompt Editor (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 rounded-xl bg-[#090d16] border border-emerald-500/30 space-y-4 shadow-2xl shadow-emerald-500/5">
            {/* Feature Persona Tabs */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">
                Select AI Engine Persona:
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleSelectPersona('COPYWRITER')}
                  className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer space-y-1 ${
                    selectedFeature === 'COPYWRITER'
                      ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300 font-bold'
                      : 'bg-[#0f1422] border-white/[0.06] text-slate-400 hover:text-white'
                  }`}
                >
                  <FileText className="w-4 h-4 mx-auto text-emerald-400" />
                  <span className="block text-[10px] font-mono">AI Copywriter</span>
                  <span className="block text-[9px] text-slate-500">3 cred/call</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectPersona('CODE_GEN')}
                  className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer space-y-1 ${
                    selectedFeature === 'CODE_GEN'
                      ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300 font-bold'
                      : 'bg-[#0f1422] border-white/[0.06] text-slate-400 hover:text-white'
                  }`}
                >
                  <Code2 className="w-4 h-4 mx-auto text-indigo-400" />
                  <span className="block text-[10px] font-mono">AI Architect</span>
                  <span className="block text-[9px] text-slate-500">5 cred/call</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectPersona('DATA_ANALYST')}
                  className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer space-y-1 ${
                    selectedFeature === 'DATA_ANALYST'
                      ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300 font-bold'
                      : 'bg-[#0f1422] border-white/[0.06] text-slate-400 hover:text-white'
                  }`}
                >
                  <BarChart3 className="w-4 h-4 mx-auto text-amber-400" />
                  <span className="block text-[10px] font-mono">SaaS Analyst</span>
                  <span className="block text-[9px] text-slate-500">4 cred/call</span>
                </button>
              </div>
            </div>

            {/* Prompt Textarea */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                  Prompt Input:
                </label>
                <span className="text-[10px] text-slate-500">{promptInput.length} chars</span>
              </div>
              <textarea
                rows={4}
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                placeholder="Enter prompt instruction for the AI engine..."
                className="w-full p-3 rounded-lg bg-[#04060a] border border-white/[0.08] text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            {/* Dynamic Persona-Specific Preset Templates */}
            <div className="space-y-1.5">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">
                {selectedFeature === 'COPYWRITER'
                  ? 'Growth & Copywriting Templates:'
                  : selectedFeature === 'CODE_GEN'
                  ? 'Engineering & Architecture Templates:'
                  : 'SaaS Telemetry & Cohort Templates:'}
              </span>
              <div className="space-y-1">
                {PERSONA_TEMPLATES[selectedFeature].map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setPromptInput(p)}
                    className="w-full text-left p-2 rounded bg-[#0f1422] border border-white/[0.04] hover:border-white/[0.12] text-[10px] text-slate-300 hover:text-white transition-colors truncate cursor-pointer font-mono"
                  >
                    › {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Execution / Blocked Button */}
            {isInsufficientCredits ? (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-center space-y-2">
                <p className="text-rose-400 font-bold text-[11px]">
                  Requires {requiredCredits} credits ({activeOrg.creditsRemaining} available)
                </p>
                <button
                  type="button"
                  onClick={onNavigateToBilling}
                  className="w-full py-2 rounded-lg bg-emerald-500 text-black font-extrabold hover:bg-emerald-400 transition-all flex items-center justify-center gap-1.5 cursor-pointer font-mono text-xs shadow-md shadow-emerald-500/20"
                >
                  <span>Upgrade Plan in Stripe Billing</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleRun}
                disabled={isGenerating || !promptInput.trim()}
                className="w-full py-2.5 rounded-lg bg-emerald-500 text-black font-extrabold hover:bg-emerald-400 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-500/20 disabled:opacity-50 font-mono text-xs"
              >
                <Zap className={`w-3.5 h-3.5 fill-black ${isGenerating ? 'animate-spin' : ''}`} />
                <span>
                  {isGenerating
                    ? 'Inference in Progress...'
                    : `Execute Metered AI Call (-${requiredCredits} Credits)`}
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Output Stream & Telemetry (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 rounded-xl bg-[#090d16] border border-white/[0.08] space-y-3.5 shadow-xl sre-card">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-white text-xs font-mono uppercase tracking-wider">
                  Engine Output &amp; Telemetry
                </h3>
              </div>

              {outputResult && (
                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-2.5 py-1 rounded bg-[#0f1422] hover:bg-slate-800 text-emerald-400 font-bold transition-all flex items-center gap-1 cursor-pointer text-[10px] font-mono border border-white/[0.06]"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              )}
            </div>

            {/* Output Viewport */}
            <div className="p-4 rounded-lg bg-[#04060a] border border-white/[0.06] min-h-[190px] max-h-[300px] overflow-y-auto font-mono text-xs leading-relaxed text-slate-200">
              {isGenerating ? (
                <div className="flex items-center justify-center gap-2 py-12 text-slate-500">
                  <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" />
                  <span>Generating metered AI output with Gemini 1.5 Flash...</span>
                </div>
              ) : outputResult ? (
                <div className="whitespace-pre-wrap select-all">{outputResult}</div>
              ) : (
                <div className="py-12 text-center text-slate-600 font-mono">
                  Select a template on the left and click "Execute Metered AI Call".
                </div>
              )}
            </div>

            {/* Telemetry Chips */}
            {lastTelemetry && (
              <div className="grid grid-cols-4 gap-2 pt-1 text-center font-mono">
                <div className="p-2 rounded bg-[#04080e] border border-white/[0.04]">
                  <span className="text-[9px] text-slate-500 block uppercase">Input</span>
                  <strong className="text-white text-xs">{lastTelemetry.inputTokens} tok</strong>
                </div>
                <div className="p-2 rounded bg-[#04080e] border border-white/[0.04]">
                  <span className="text-[9px] text-slate-500 block uppercase">Output</span>
                  <strong className="text-white text-xs">{lastTelemetry.outputTokens} tok</strong>
                </div>
                <div className="p-2 rounded bg-[#04080e] border border-white/[0.04]">
                  <span className="text-[9px] text-slate-500 block uppercase">Latency</span>
                  <strong className="text-emerald-400 text-xs">{lastTelemetry.latencyMs} ms</strong>
                </div>
                <div className="p-2 rounded bg-[#04080e] border border-white/[0.04]">
                  <span className="text-[9px] text-slate-500 block uppercase">Deducted</span>
                  <strong className="text-amber-400 text-xs">-{lastTelemetry.creditsUsed} cred</strong>
                </div>
              </div>
            )}
          </div>

          {/* Recent Usage Audit Logs */}
          <div className="p-4 rounded-xl bg-[#090d16] border border-white/[0.08] space-y-2.5 shadow-xl sre-card">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                Organization Metering Audit Log
              </span>
              <span className="text-[10px] text-slate-500">{usageLogs.length} Records</span>
            </div>

            {usageLogs.length === 0 ? (
              <div className="py-4 text-center text-slate-600 font-mono text-[11px]">
                No usage logs recorded in this session yet.
              </div>
            ) : (
              <div className="space-y-1.5 max-h-[140px] overflow-y-auto font-mono text-[10px]">
                {usageLogs.slice(0, 5).map((log) => (
                  <div
                    key={log.id}
                    className="p-2 rounded bg-[#04060a] border border-white/[0.04] flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-300 font-bold border border-emerald-500/30">
                        {log.feature}
                      </span>
                      <span className="text-slate-300 truncate">{log.promptSnippet}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-amber-400 font-bold">-{log.creditsUsed} cred</span>
                      <span className="text-slate-500">{log.latencyMs}ms</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
