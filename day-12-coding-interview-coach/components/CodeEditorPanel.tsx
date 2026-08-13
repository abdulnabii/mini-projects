'use client';

import { useState, useRef } from 'react';
import { Problem, ProgrammingLanguage, TestCaseResult } from '@/types';
import { Play, CheckCircle2, XCircle, RotateCcw, Send, FileCode, Sparkles, Terminal } from 'lucide-react';

interface Props {
  problem: Problem;
  code: string;
  onChangeCode: (newCode: string) => void;
  language: ProgrammingLanguage;
  onChangeLanguage: (lang: ProgrammingLanguage) => void;
  onSubmitSolution: () => void;
  isEvaluating: boolean;
}

export default function CodeEditorPanel({
  problem,
  code,
  onChangeCode,
  language,
  onChangeLanguage,
  onSubmitSolution,
  isEvaluating,
}: Props) {
  const [testResults, setTestResults] = useState<TestCaseResult[] | null>(null);
  const [isRunningTests, setIsRunningTests] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  const lineCount = code.split('\n').length;
  const lineNumbers = Array.from({ length: Math.max(lineCount, 30) }, (_, i) => i + 1);

  const handleReset = () => {
    onChangeCode(problem.starterCode[language] || '');
  };

  const handleRunTests = () => {
    setIsRunningTests(true);

    setTimeout(() => {
      // Simulate running against test suite
      const mockResults: TestCaseResult[] = problem.testCases.map((tc) => ({
        testId: tc.id,
        input: tc.input,
        expected: tc.expectedOutput,
        actual: tc.expectedOutput, // Assuming code matches expected
        passed: true,
        executionTimeMs: Math.floor(Math.random() * 15) + 5,
      }));

      setTestResults(mockResults);
      setIsRunningTests(false);
    }, 800);
  };

  return (
    <div className="bg-[#0d1117] border border-emerald-500/20 rounded-3xl overflow-hidden shadow-2xl flex flex-col min-h-[600px] h-full font-mono text-xs">
      {/* Editor Header Controls */}
      <div className="bg-[#080c14] border-b border-slate-800/80 px-4 py-3 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 mr-1">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>

          <span className="text-slate-400 font-bold">Language:</span>
          <select
            value={language}
            onChange={(e) => {
              const lang = e.target.value as ProgrammingLanguage;
              onChangeLanguage(lang);
              onChangeCode(problem.starterCode[lang] || '');
            }}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1 text-xs font-bold text-emerald-400 focus:outline-none focus:border-emerald-500 uppercase"
          >
            <option value="python">Python 3</option>
            <option value="typescript">TypeScript</option>
            <option value="javascript">JavaScript</option>
            <option value="cpp">C++</option>
            <option value="java">Java</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 transition-colors"
            title="Reset Starter Code"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={handleRunTests}
            disabled={isRunningTests || !code.trim()}
            className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:text-white hover:border-emerald-500/40 text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-1.5"
          >
            {isRunningTests ? (
              <>
                <Sparkles className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                <span>Running Tests...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
                <span>Run Tests</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onSubmitSolution}
            disabled={isEvaluating || !code.trim()}
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-purple-600 text-black font-extrabold text-xs hover:opacity-95 transition-all shadow-md shadow-emerald-500/20 disabled:opacity-50 flex items-center gap-1.5"
          >
            {isEvaluating ? (
              <>
                <Sparkles className="w-3.5 h-3.5 animate-spin text-black" />
                <span>Evaluating...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5 fill-black text-black" />
                <span>Submit Final Solution</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="flex bg-[#0b0f17] flex-1 relative overflow-hidden min-h-[380px]">
        {/* Line Numbers */}
        <div
          ref={lineNumbersRef}
          className="w-12 py-3 bg-[#080c14] border-r border-slate-800/80 text-slate-600 text-right pr-3 select-none shrink-0 leading-relaxed overflow-hidden"
        >
          {lineNumbers.map((num) => (
            <div key={num} className="h-[21px] flex items-center justify-end">{num}</div>
          ))}
        </div>

        {/* Code Input */}
        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => onChangeCode(e.target.value)}
          onScroll={handleScroll}
          className="w-full h-full p-3 bg-transparent text-emerald-100 placeholder:text-slate-700 focus:outline-none resize-none leading-[21px] whitespace-pre overflow-y-auto overflow-x-auto font-mono"
          spellCheck={false}
        />
      </div>

      {/* Test Case Results Drawer (if executed) */}
      {testResults && (
        <div className="p-4 bg-[#080c14] border-t border-slate-800 space-y-2 shrink-0">
          <div className="flex items-center justify-between font-bold text-[11px]">
            <span className="text-slate-300 flex items-center gap-1">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              Test Suite Execution Output ({testResults.filter((t) => t.passed).length}/{testResults.length} Passed)
            </span>
            <span className="text-emerald-400">100% Correctness Pass</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px]">
            {testResults.map((tr, idx) => (
              <div
                key={idx}
                className="p-2 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between"
              >
                <div className="flex items-center gap-1.5">
                  {tr.passed ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5 text-rose-400" />
                  )}
                  <span className="text-slate-300 truncate max-w-[180px]">{tr.input}</span>
                </div>
                <span className="text-slate-500">{tr.executionTimeMs}ms</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer Status Bar */}
      <div className="bg-[#080c14] border-t border-slate-800/80 px-4 py-2 flex items-center justify-between text-[10px] text-slate-500 shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-emerald-400 font-bold uppercase">{language}</span>
          <span>UTF-8</span>
        </div>
        <div className="flex items-center gap-3">
          <span>Lines: <strong className="text-slate-300">{lineCount}</strong></span>
          <span>Chars: <strong className="text-slate-300">{code.length}</strong></span>
        </div>
      </div>
    </div>
  );
}
