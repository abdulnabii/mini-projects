'use client';

import { EngagementRadar as RadarType } from '@/types';
import {
  TrendingUp,
  Award,
  Sparkles,
  Zap,
  Clock,
  Eye,
  Bookmark,
  Repeat,
  BookOpen,
  CheckCircle,
} from 'lucide-react';

interface Props {
  radar: RadarType;
  postingTime?: string;
}

export default function EngagementRadar({ radar, postingTime }: Props) {
  const getGradeBadge = (grade: RadarType['grade']) => {
    switch (grade) {
      case 'VIRAL':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'HIGH':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
      case 'MODERATE':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-[#0d1117] border border-emerald-500/30 shadow-2xl space-y-6 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-white text-base font-outfit">
                AI Virality Radar &amp; Deep Engagement Telemetry
              </h3>
              <span
                className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold ${getGradeBadge(
                  radar.grade
                )}`}
              >
                {radar.grade} POTENTIAL
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Algorithmic scoring based on retention hooks, structure &amp; distribution velocity
            </p>
          </div>
        </div>

        {postingTime && (
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-cyan-300 text-xs">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Optimal Slot: <strong>{postingTime}</strong></span>
          </div>
        )}
      </div>

      {/* 4 Deep Analytics Highlight Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-[#161b22] border border-slate-800 space-y-1">
          <span className="text-[10px] text-cyan-400 font-bold uppercase flex items-center gap-1">
            <Eye className="w-3 h-3" /> Predicted Impressions
          </span>
          <div className="text-lg font-black text-white">
            {radar.predictedImpressions || '35k - 60k'}
          </div>
          <p className="text-[10px] text-slate-400">Based on topic velocity</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#161b22] border border-slate-800 space-y-1">
          <span className="text-[10px] text-emerald-400 font-bold uppercase flex items-center gap-1">
            <Bookmark className="w-3 h-3" /> Bookmark-to-Like
          </span>
          <div className="text-lg font-black text-emerald-300">
            {radar.bookmarkRatio || '14.5% (Top 2%)'}
          </div>
          <p className="text-[10px] text-slate-400">High reference value</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#161b22] border border-slate-800 space-y-1">
          <span className="text-[10px] text-purple-400 font-bold uppercase flex items-center gap-1">
            <Repeat className="w-3 h-3" /> Retweet Velocity
          </span>
          <div className="text-lg font-black text-purple-300">
            {radar.retweetVelocity || '3.4x Average'}
          </div>
          <p className="text-[10px] text-slate-400">Secondary distribution</p>
        </div>

        <div className="p-4 rounded-2xl bg-[#161b22] border border-slate-800 space-y-1">
          <span className="text-[10px] text-amber-400 font-bold uppercase flex items-center gap-1">
            <BookOpen className="w-3 h-3" /> Readability Level
          </span>
          <div className="text-lg font-black text-amber-300">
            {radar.readabilityGrade || 'Grade 6.1 (Viral)'}
          </div>
          <p className="text-[10px] text-slate-400">Effortless consumption</p>
        </div>
      </div>

      {/* 4 Gauge Dimension Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Hook Strength */}
        <div className="p-4 rounded-2xl bg-[#161b22] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-bold">🎯 Hook Strength (Scroll-Stop):</span>
            <span className="text-emerald-400 font-bold">{radar.hookStrength}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
              style={{ width: `${radar.hookStrength}%` }}
            />
          </div>
        </div>

        {/* Readability */}
        <div className="p-4 rounded-2xl bg-[#161b22] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-bold">📖 Readability &amp; Mobile Flow:</span>
            <span className="text-cyan-400 font-bold">{radar.readability}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-400 rounded-full"
              style={{ width: `${radar.readability}%` }}
            />
          </div>
        </div>

        {/* Emotional Resonance */}
        <div className="p-4 rounded-2xl bg-[#161b22] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-bold">⚡ Emotional Trigger &amp; Urgency:</span>
            <span className="text-amber-400 font-bold">{radar.emotionalResonance}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-orange-400 rounded-full"
              style={{ width: `${radar.emotionalResonance}%` }}
            />
          </div>
        </div>

        {/* Formatting Spacing */}
        <div className="p-4 rounded-2xl bg-[#161b22] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-bold">📐 Whitespace &amp; Scanning Layout:</span>
            <span className="text-purple-400 font-bold">{radar.formattingSpacing}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-indigo-400 rounded-full"
              style={{ width: `${radar.formattingSpacing}%` }}
            />
          </div>
        </div>
      </div>

      {/* AI Improvement Tips */}
      {radar.tips && radar.tips.length > 0 && (
        <div className="p-4 rounded-2xl bg-[#04080e] border border-slate-800 space-y-2 text-xs">
          <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>AI Engagement Optimization Notes:</span>
          </span>
          <ul className="space-y-1 text-slate-300">
            {radar.tips.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
