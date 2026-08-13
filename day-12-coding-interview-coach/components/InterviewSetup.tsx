'use client';

import { useState } from 'react';
import { PROBLEM_LIBRARY } from '@/lib/problems';
import { Problem, ProgrammingLanguage } from '@/types';
import { Play, Sparkles, Code2, ShieldAlert, Cpu, Layers } from 'lucide-react';

interface Props {
  onStartSession: (problem: Problem, language: ProgrammingLanguage) => void;
  isLoading: boolean;
}

const LANGUAGES: { id: ProgrammingLanguage; name: string; icon: string }[] = [
  { id: 'python', name: 'Python 3', icon: '🐍' },
  { id: 'typescript', name: 'TypeScript', icon: '🟦' },
  { id: 'javascript', name: 'JavaScript', icon: '🟨' },
  { id: 'cpp', name: 'C++', icon: '⚡' },
  { id: 'java', name: 'Java', icon: '☕' },
];

export default function InterviewSetup({ onStartSession, isLoading }: Props) {
  const [selectedProblemId, setSelectedProblemId] = useState<string>(PROBLEM_LIBRARY[0].id);
  const [selectedLanguage, setSelectedLanguage] = useState<ProgrammingLanguage>('python');

  const selectedProblem = PROBLEM_LIBRARY.find((p) => p.id === selectedProblemId) || PROBLEM_LIBRARY[0];

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    onStartSession(selectedProblem, selectedLanguage);
  };

  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case 'Easy':
        return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
      case 'Medium':
        return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
      case 'Hard':
        return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
      default:
        return 'text-slate-400 border-slate-700 bg-slate-800';
    }
  };

  return (
    <form onSubmit={handleStart} className="space-y-8 font-mono">
      {/* 1. Select Problem Benchmark */}
      <div className="space-y-3">
        <label className="block text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
          1. Select Technical Interview Problem Benchmark
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {PROBLEM_LIBRARY.map((prob) => (
            <button
              key={prob.id}
              type="button"
              onClick={() => setSelectedProblemId(prob.id)}
              className={`p-5 rounded-2xl border text-left transition-all flex flex-col justify-between gap-3 ${
                selectedProblemId === prob.id
                  ? 'bg-emerald-500/10 border-emerald-500 text-white shadow-xl shadow-emerald-500/10 ring-1 ring-emerald-500'
                  : 'bg-[#0d1117] border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${getDifficultyBadge(prob.difficulty)}`}>
                  {prob.difficulty}
                </span>
                <span className="text-[11px] text-slate-500">{prob.category}</span>
              </div>

              <div>
                <h4 className="font-bold text-slate-100 text-sm font-outfit">{prob.title}</h4>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">{prob.description}</p>
              </div>

              <div className="text-[10px] text-slate-500 border-t border-slate-800/80 pt-2 flex items-center justify-between">
                <span>Time Limit: {prob.timeLimitMinutes} mins</span>
                <span className="text-emerald-400 font-bold">5 Test Cases</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Select Language */}
      <div className="space-y-3">
        <label className="block text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
          2. Select Coding Language
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.id}
              type="button"
              onClick={() => setSelectedLanguage(lang.id)}
              className={`p-3.5 rounded-2xl border text-center transition-all flex items-center justify-center gap-2 ${
                selectedLanguage === lang.id
                  ? 'bg-emerald-500/10 border-emerald-500 text-emerald-300 font-bold shadow-lg shadow-emerald-500/10'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <span className="text-base">{lang.icon}</span>
              <span className="text-xs font-outfit">{lang.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Launch CTA */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-purple-600 font-outfit font-extrabold text-black hover:opacity-95 transition-all shadow-xl shadow-emerald-500/20 disabled:opacity-50 flex items-center justify-center gap-2 text-base"
      >
        {isLoading ? (
          <>
            <Sparkles className="w-5 h-5 animate-spin text-black" />
            <span>Connecting to Alex (AI Staff Engineer)...</span>
          </>
        ) : (
          <>
            <Play className="w-5 h-5 fill-black text-black" />
            <span>Launch Live AI Technical Interview Session</span>
          </>
        )}
      </button>
    </form>
  );
}
