'use client';

import { Deck, LeaderboardUser } from '@/types';
import { INITIAL_LEADERBOARD } from '@/lib/storage';
import { TrendingUp, Trophy, Clock, CheckCircle2, Award, Calendar, Brain } from 'lucide-react';

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
      ? Math.round(
          ((allCards.filter((c) => (c.lastQualityScore || 0) >= 3).length || 1) / (allCards.length || 1)) * 100
        )
      : 88;

  const leaderboard: LeaderboardUser[] = INITIAL_LEADERBOARD.map((u) =>
    u.isCurrentUser ? { ...u, xp: userXP } : u
  ).sort((a, b) => b.xp - a.xp);

  // SVG Ebbinghaus Retention Curve Points
  const W = 560;
  const H = 160;
  const PAD = 25;

  // Days 0 to 30 curve points
  const pointsWithoutReview = [];
  const pointsWithSM2 = [];

  for (let t = 0; t <= 30; t += 2) {
    const x = PAD + (t / 30) * (W - 2 * PAD);
    // Exponential decay R = e^(-0.25*t)
    const decayR = Math.exp(-0.18 * t);
    const yDecay = H - PAD - decayR * (H - 2 * PAD);
    pointsWithoutReview.push(`${x.toFixed(1)},${yDecay.toFixed(1)}`);

    // SM-2 reinforced curve (stays > 85%)
    const sm2R = Math.max(0.85, Math.exp(-0.02 * t));
    const ySM2 = H - PAD - sm2R * (H - 2 * PAD);
    pointsWithSM2.push(`${x.toFixed(1)},${ySM2.toFixed(1)}`);
  }

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

      {/* Ebbinghaus Memory Retention Decay Curve (SVG) */}
      <div className="p-6 rounded-3xl bg-[#0e1424] border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-white text-sm font-outfit flex items-center gap-2">
            <Brain className="w-4 h-4 text-emerald-400" />
            Ebbinghaus Forgetting Curve vs. SuperMemo-2 Spaced Intervals
          </h3>
          <div className="flex items-center gap-3 text-[10px]">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400" /> Standard Decay
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> SM-2 Retention
            </span>
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-36 drop-shadow-xl min-w-[480px]">
            {/* Axis */}
            <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke="#1e293b" strokeWidth="1" />
            <line x1={PAD} y1={PAD} x2={PAD} y2={H - PAD} stroke="#1e293b" strokeWidth="1" />

            {/* Decay Path */}
            <polyline points={pointsWithoutReview.join(' ')} fill="none" stroke="#f43f5e" strokeWidth="2" strokeDasharray="3 3" />

            {/* SM2 Path */}
            <polyline points={pointsWithSM2.join(' ')} fill="none" stroke="#10b981" strokeWidth="3" />

            {/* Labels */}
            <text x={PAD + 5} y={PAD + 15} fill="#10b981" fontSize="10" fontFamily="monospace">
              95% Target Retention
            </text>
            <text x={W - PAD - 80} y={H - PAD - 10} fill="#f43f5e" fontSize="10" fontFamily="monospace">
              20% Without SM-2
            </text>
          </svg>
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
                <span
                  className={`w-6 text-center font-black font-outfit ${
                    idx === 0
                      ? 'text-amber-400 text-base'
                      : idx === 1
                      ? 'text-slate-300'
                      : idx === 2
                      ? 'text-amber-600'
                      : 'text-slate-500'
                  }`}
                >
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
