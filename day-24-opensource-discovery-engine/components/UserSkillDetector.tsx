'use client';

import { useState } from 'react';
import { TechSkill } from '@/types';
import {
  Sparkles,
  X,
  Loader2,
  Check,
  Code2,
  GitBranch,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onApplySkills: (skills: TechSkill[]) => void;
}

export default function UserSkillDetector({ isOpen, onClose, onApplySkills }: Props) {
  const [username, setUsername] = useState('abdulnabii');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    detectedSkills: TechSkill[];
    topLanguages: { language: string; count: number }[];
    publicRepoCount: number;
    avatarUrl: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    setIsLoading(true);
    try {
      const res = await fetch(`/api/user-skills?username=${encodeURIComponent(username.trim())}`);
      const data = await res.json();
      setResult(data);
    } catch (e) {
      console.error('Scan failed:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = () => {
    if (result && result.detectedSkills.length > 0) {
      onApplySkills(result.detectedSkills);
      confetti({
        particleCount: 25,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#34d399', '#22d3ee'],
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150 font-mono">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#0d1117] border-2 border-emerald-500/40 p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base font-outfit">
                Auto-Detect GitHub Skills
              </h3>
              <p className="text-xs text-slate-400">
                Scan any public GitHub profile to extract top languages &amp; frameworks
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Username Input Form */}
        <form onSubmit={handleScan} className="flex items-center gap-2">
          <div className="relative flex-1">
            <svg
              className="w-4 h-4 fill-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2"
              viewBox="0 0 24 24"
            >
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12z" />
            </svg>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter GitHub username (e.g. abdulnabii)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#161b22] border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !username.trim()}
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs transition-all disabled:opacity-40 cursor-pointer flex items-center gap-1.5 shadow-md"
          >
            {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            <span>Analyze</span>
          </button>
        </form>

        {/* Scan Result Card */}
        {result && (
          <div className="p-4 rounded-2xl bg-[#161b22] border border-emerald-500/30 space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center gap-3">
              <img
                src={result.avatarUrl}
                alt={username}
                className="w-12 h-12 rounded-2xl border border-slate-700 object-cover"
              />
              <div>
                <h4 className="font-bold text-white text-sm font-outfit">@{username}</h4>
                <p className="text-[11px] text-slate-400">
                  {result.publicRepoCount} public repositories analyzed
                </p>
              </div>
            </div>

            {/* Detected Skills */}
            <div className="space-y-1.5">
              <span className="text-[10px] text-slate-400 font-bold uppercase">
                Detected Core Skills:
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {result.detectedSkills.map((s) => (
                  <span
                    key={s}
                    className="px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Top Languages */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase">
                Language Frequency:
              </span>
              <div className="space-y-1 text-xs">
                {result.topLanguages.slice(0, 3).map((l) => (
                  <div key={l.language} className="flex justify-between text-slate-300">
                    <span>{l.language}</span>
                    <span className="text-cyan-400 font-bold">{l.count} repos</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Action Footer */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleApply}
            disabled={!result}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-black font-extrabold text-xs transition-all disabled:opacity-40 cursor-pointer shadow-md"
          >
            Apply Detected Skills
          </button>
        </div>
      </div>
    </div>
  );
}
