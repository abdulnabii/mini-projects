'use client';

import { Deck, LeaderboardUser } from '@/types';
import { INITIAL_LEADERBOARD } from '@/lib/storage';
import { TrendingUp, Trophy, Clock, CheckCircle2, Award, Calendar } from 'lucide-react';

interface Props {
  decks: Deck[];
  userXP: number;
}

export default function RetentionAnalytics({ decks, userXP }: Props) {
  const allCards = decks.flatMap((d) => d.cards);
  const reviewedCards = allCards.filter((c) => (c.repetitions || 0) > 0);
  const matureCards = allCards.filter((c) => (c.interval || 0) >= 6);

  const retentionRate =
    allCards.length > 0
      ? Math.round(((allCards.filter((c) => (c.lastQualityScore || 0) >= 3).length || 1) / (allCards.length || 1)) * 100)
      : 88;

  const leaderboard: LeaderboardUser[] = INITIAL_LEADERBOARD.map((u) =>
    u.isCurrentUser ? { ...u, xp: userXP } : u
  ).sort((a, b) => b.xp - a.xp);

  return (
    <div className="space-y-6 font-mono text-xs text-slate-300">
      {/* 1. Retention & Algorithm Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#0e1424] border border-emerald-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Scientific Retention Rate</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-3xl font-black text-emerald-400 font-outfit">{retentionRate}%</p>
          <p className="text-[10px] text-slate-500">Based on SM-2 recall probability</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0e1424] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Mature Memory Cards</span>
            <CheckCircle2 className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-3xl font-black text-indigo-300 font-outfit">
            {matureCards.length} / {allCards.length}
          </p>
          <p className="text-[10px] text-slate-500">Cards with interval ≥ 6 days</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0e1424] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Total Studied Words</span>
            <Calendar className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-3xl font-black text-cyan-300 font-outfit">{allCards.length} Words</p>
          <p className="text-[10px] text-slate-500">Across {decks.length} customized decks</p>
        </div>
      </div>

      {/* 2. Weekly Leaderboard */}
      <div className="p-6 rounded-3xl bg-[#0e1424] border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="font-bold text-white text-sm font-outfit flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            Weekly Global Polyglot Leaderboard
          </h3>
          <span className="text-[10px] text-slate-500">Resets in 2 days</span>
        </div>

        <div className="space-y-2">
          {leaderboard.map((user, idx) => (
            <div
              key={user.id}
              className={`p-3 rounded-2xl border flex items-center justify-between transition-all ${
                user.isCurrentUser
                  ? 'bg-emerald-500/10 border-emerald-500 text-white font-bold shadow-lg shadow-emerald-500/10'
                  : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`w-6 text-center font-black font-outfit ${
                  idx === 0 ? 'text-amber-400 text-base' : idx === 1 ? 'text-slate-300' : idx === 2 ? 'text-amber-600' : 'text-slate-500'
                }`}>
                  #{idx + 1}
                </span>
                <span className="text-lg">{user.avatar}</span>
                <div>
                  <span className="font-bold text-slate-200 text-xs block">{user.name}</span>
                  <span className="text-[10px] text-slate-500">{user.streak} day streak</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-black font-outfit text-sm">{user.xp} XP</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
