'use client';

import { GamificationState } from '@/types';
import { Flame, Zap, Award, Target, Trophy, Sparkles } from 'lucide-react';

interface Props {
  state: GamificationState;
}

export default function GamificationHeader({ state }: Props) {
  const currentLevelXP = (state.level - 1) * 300;
  const nextLevelXP = state.level * 300;
  const progressPercent = Math.min(
    100,
    Math.max(0, ((state.xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100)
  );

  return (
    <div className="bg-[#0e1424] border border-emerald-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl font-mono text-xs text-slate-300">
      {/* 4 Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Daily Streak */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Learning Streak</span>
            <Flame className="w-4 h-4 fill-amber-400 text-amber-400" />
          </div>
          <p className="text-2xl font-black text-amber-400 font-outfit">{state.streakDays} Days</p>
          <p className="text-[10px] text-slate-500">Active review cadence</p>
        </div>

        {/* Total XP */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Total Mastery XP</span>
            <Zap className="w-4 h-4 fill-indigo-400 text-indigo-400" />
          </div>
          <p className="text-2xl font-black text-indigo-300 font-outfit">{state.xp} XP</p>
          <p className="text-[10px] text-slate-500">Earned through recalls &amp; voice</p>
        </div>

        {/* Level */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Polyglot Rank</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-emerald-400 font-outfit">Level {state.level}</p>
          <p className="text-[10px] text-slate-500">Intermediate Polyglot</p>
        </div>

        {/* Daily Goal */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Today's Target</span>
            <Target className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-black text-cyan-300 font-outfit">
            {state.cardsReviewedToday}/{state.dailyGoal}
          </p>
          <p className="text-[10px] text-slate-500">Cards reviewed today</p>
        </div>
      </div>

      {/* Level Progress Bar */}
      <div className="space-y-2 pt-1 border-t border-slate-800">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-slate-400 font-bold">Level {state.level} Progress</span>
          <span className="text-emerald-400 font-bold">
            {state.xp} / {nextLevelXP} XP ({progressPercent.toFixed(0)}%)
          </span>
        </div>
        <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-emerald-400 via-teal-400 to-indigo-500 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Unlocked Badges Row */}
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
          Unlocked Mastery Badges ({state.badges.filter((b) => b.unlocked).length}/{state.badges.length})
        </label>
        <div className="flex flex-wrap gap-2">
          {state.badges.map((badge) => (
            <div
              key={badge.id}
              className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                badge.unlocked
                  ? 'bg-slate-950 border-emerald-500/30 text-slate-200'
                  : 'bg-slate-950/40 border-slate-800 text-slate-600 opacity-60'
              }`}
            >
              <span className="text-base">{badge.icon}</span>
              <div>
                <strong className="block text-[11px] text-white font-bold">{badge.name}</strong>
                <span className="text-[9px] text-slate-400">{badge.description}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
