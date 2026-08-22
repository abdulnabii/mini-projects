'use client';

import { TechSkill, DifficultyLevel } from '@/types';
import {
  Filter,
  Search,
  Check,
  Sparkles,
  Layers,
  Code2,
  SlidersHorizontal,
} from 'lucide-react';

interface Props {
  availableSkills: TechSkill[];
  selectedSkills: TechSkill[];
  onToggleSkill: (skill: TechSkill) => void;
  onClearSkills: () => void;
  selectedDifficulty: DifficultyLevel;
  onSelectDifficulty: (diff: DifficultyLevel) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onAutoDetectClick: () => void;
}

const DIFFICULTY_OPTIONS: { level: DifficultyLevel; label: string }[] = [
  { level: 'all', label: 'All Difficulties' },
  { level: 'first_timers', label: '🌟 First-Timer Friendly' },
  { level: 'beginner', label: '🌱 Beginner' },
  { level: 'intermediate', label: '⚡ Intermediate' },
  { level: 'advanced', label: '🔥 Advanced' },
];

export default function SkillFilterBar({
  availableSkills,
  selectedSkills,
  onToggleSkill,
  onClearSkills,
  selectedDifficulty,
  onSelectDifficulty,
  searchQuery,
  onSearchChange,
  onAutoDetectClick,
}: Props) {
  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-[#0d1117] border border-emerald-500/30 shadow-2xl space-y-6 font-mono">
      {/* Top Search & GitHub Scanner Trigger */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search open-source repositories (e.g. shadcn, tldraw, fastapi, rust)..."
            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#161b22] border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
          />
        </div>

        {/* Auto-Detect Skills Trigger */}
        <button
          type="button"
          onClick={onAutoDetectClick}
          className="px-4 py-3 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-500 hover:from-emerald-300 hover:to-cyan-400 text-black font-black text-xs transition-all shadow-md shadow-emerald-500/20 hover:scale-105 flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          <Sparkles className="w-4 h-4 fill-black" />
          <span>Auto-Detect from GitHub Profile</span>
        </button>
      </div>

      {/* Tech Stack Multi-Select Filter Chips */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider flex items-center gap-1.5">
            <Code2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Select Your Tech Skills ({selectedSkills.length} selected):</span>
          </span>

          {selectedSkills.length > 0 && (
            <button
              type="button"
              onClick={onClearSkills}
              className="text-[10px] text-emerald-400 hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {availableSkills.map((skill) => {
            const isSelected = selectedSkills.includes(skill);
            return (
              <button
                key={skill}
                type="button"
                onClick={() => onToggleSkill(skill)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-500 text-black font-black shadow-md shadow-emerald-500/20 scale-105'
                    : 'bg-[#161b22] border border-slate-800 text-slate-300 hover:text-white hover:border-emerald-500/40'
                }`}
              >
                {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                <span>{skill}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Difficulty Level Selector */}
      <div className="space-y-2 pt-1 border-t border-slate-800/80">
        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider flex items-center gap-1.5">
          <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
          <span>Contribution Difficulty Target:</span>
        </span>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {DIFFICULTY_OPTIONS.map((opt) => {
            const isSelected = selectedDifficulty === opt.level;
            return (
              <button
                key={opt.level}
                type="button"
                onClick={() => onSelectDifficulty(opt.level)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-500 text-black font-black shadow-md'
                    : 'bg-[#161b22] border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
