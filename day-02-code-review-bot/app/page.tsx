'use client';

import React, { useState } from 'react';
import { SAMPLE_PRESETS, detectLanguage } from '@/lib/language-detect';
import { ReviewResult, ReviewSession } from '@/types';
import { saveReview } from '@/lib/storage';
import CodeEditor from '@/components/CodeEditor';
import ScoreGauge from '@/components/ScoreGauge';
import ReviewPanel from '@/components/ReviewPanel';
import DiffViewer from '@/components/DiffViewer';
import {
  Terminal,
  Sparkles,
  Copy,
  Check,
  ShieldAlert,
  Zap,
  FileCheck,
  Cpu,
} from 'lucide-react';

export default function HomePage() {
  const [code, setCode] = useState(SAMPLE_PRESETS[0].code);
  const [language, setLanguage] = useState(SAMPLE_PRESETS[0].language);
  const [isLoading, setIsLoading] = useState(false);
  const [reviewResult, setReviewResult] = useState<ReviewResult | null>(null);
  const [copiedMd, setCopiedMd] = useState(false);
  const [activeTab, setActiveTab] = useState<'review' | 'diff'>('review');

  const handleRunReview = async () => {
    if (!code.trim() || isLoading) return;

    setIsLoading(true);
    const activeLang = language || detectLanguage(code);

    try {
      const response = await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language: activeLang }),
      });

      const data: ReviewResult = await response.json();
      setReviewResult(data);

      // Save to localStorage history
      const session: ReviewSession = {
        id: `review_${Date.now()}`,
        title: `${activeLang.toUpperCase()} Review - Score ${data.score}/100`,
        createdAt: new Date().toISOString(),
        language: activeLang,
        originalCode: code,
        reviewResult: data,
      };
      saveReview(session);
    } catch (err) {
      console.error('Failed to analyze code:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyMarkdown = () => {
    if (!reviewResult) return;

    const issuesMd = reviewResult.issues
      .map(
        (iss) =>
          `### ${iss.severity === 'CRITICAL' ? '🔴' : iss.severity === 'MAJOR' ? '🟠' : '🟡'} Line ${iss.line}: ${iss.title}\n**Category**: ${iss.category}\n${iss.description}\n\n\`\`\`${language}\n// Recommended Fix:\n${iss.fix}\n\`\`\``
      )
      .join('\n\n');

    const fullMd = [
      `## 🤖 Senior AI Code Review Report`,
      `**Quality Score**: ${reviewResult.score}/100 | **Language**: ${reviewResult.language.toUpperCase()}`,
      `\n> **Summary**: ${reviewResult.summary}\n`,
      `### Detected Issues (${reviewResult.issues.length}):`,
      issuesMd,
      `\n### 💡 Refactored Production Code:\n\`\`\`${language}\n${reviewResult.fixedCode}\n\`\`\``,
    ].join('\n');

    navigator.clipboard.writeText(fullMd);
    setCopiedMd(true);
    setTimeout(() => setCopiedMd(false), 2000);
  };

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-emerald-500/20 pb-6 font-mono">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-semibold uppercase tracking-wider mb-2">
            <Terminal className="w-3.5 h-3.5" />
            <span>Developer IDE • AI Static Code Reviewer</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>Real-Time Code Review Bot</span>
            <span className="text-purple-400 font-mono text-sm">v2.0</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 font-sans">
            Paste code in 13+ languages for instant senior engineer security, performance, and O(n²) analysis.
          </p>
        </div>

        {reviewResult && (
          <button
            onClick={handleCopyMarkdown}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0d1117] hover:bg-zinc-900 text-emerald-400 text-xs font-mono font-bold border border-emerald-500/30 transition-all self-start md:self-auto shadow-lg"
          >
            {copiedMd ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">Copied PR Markdown!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-emerald-400" />
                <span>Copy PR Review Markdown</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Main Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 6 Columns: Code Editor */}
        <div className="lg:col-span-6 space-y-4">
          <CodeEditor
            code={code}
            onChange={setCode}
            language={language}
            onLanguageChange={setLanguage}
            onReview={handleRunReview}
            isLoading={isLoading}
          />
        </div>

        {/* Right 6 Columns: Inspection Dashboard */}
        <div className="lg:col-span-6 space-y-6">
          {reviewResult ? (
            <div className="space-y-6 animate-in fade-in zoom-in duration-300">
              {/* Score Gauge */}
              <ScoreGauge score={reviewResult.score} />

              {/* View Switcher Tabs */}
              <div className="flex bg-[#0d1117] p-1 rounded-2xl border border-zinc-800 text-xs font-mono">
                <button
                  onClick={() => setActiveTab('review')}
                  className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-2 ${
                    activeTab === 'review'
                      ? 'bg-zinc-800 text-emerald-400 font-bold shadow-md'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <FileCheck className="w-4 h-4" />
                  <span>Issues ({reviewResult.issues.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('diff')}
                  className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-2 ${
                    activeTab === 'diff'
                      ? 'bg-zinc-800 text-purple-400 font-bold shadow-md'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <Terminal className="w-4 h-4" />
                  <span>Side-by-Side Code Diff</span>
                </button>
              </div>

              {/* Tab Content */}
              {activeTab === 'review' ? (
                <ReviewPanel result={reviewResult} />
              ) : (
                <DiffViewer
                  originalCode={code}
                  fixedCode={reviewResult.fixedCode}
                  language={language}
                />
              )}
            </div>
          ) : (
            <div className="bg-[#0d1117] border border-emerald-500/20 rounded-3xl p-8 text-center space-y-5 backdrop-blur-xl min-h-[450px] flex flex-col items-center justify-center font-mono terminal-glow">
              <div className="w-16 h-16 rounded-3xl bg-[#080c14] border border-zinc-800 flex items-center justify-center text-emerald-400 shadow-xl">
                <Terminal className="w-8 h-8" />
              </div>
              <div className="max-w-sm space-y-2">
                <h3 className="text-base font-bold text-white">Cyber-IDE Code Inspector Active</h3>
                <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                  Paste code on the left or select a preset to launch static AST analysis, vulnerability scans, and line-by-line fixes.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 max-w-sm w-full text-[11px] font-mono text-zinc-400 pt-2">
                <div className="bg-[#080c14] p-2.5 rounded-xl border border-zinc-800 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>SQLi & Memory Leaks</span>
                </div>
                <div className="bg-[#080c14] p-2.5 rounded-xl border border-zinc-800 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>O(n²) Loop Detection</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
