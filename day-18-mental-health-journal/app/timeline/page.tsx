'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getStoredJournalEntries, calculateMoodStats } from '@/lib/storage';
import { getMoodBadgeProps } from '@/lib/journalEngine';
import { DEFAULT_JOURNAL_ENTRIES } from '@/lib/defaultEntries';
import { JournalEntry, MoodStats, MoodCategory } from '@/types';
import Link from 'next/link';
import { TrendingUp, ArrowLeft, Heart, Flame, Calendar, Sparkles, PieChart, Activity, Brain } from 'lucide-react';

export default function TimelinePage() {
  const [entries, setEntries] = useState<JournalEntry[]>(DEFAULT_JOURNAL_ENTRIES);
  const [stats, setStats] = useState<MoodStats>(calculateMoodStats(DEFAULT_JOURNAL_ENTRIES));

  useEffect(() => {
    const loaded = getStoredJournalEntries();
    if (loaded && loaded.length > 0) {
      setEntries(loaded);
      setStats(calculateMoodStats(loaded));
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#060a12] text-slate-200 selection:bg-emerald-500/30 selection:text-white font-mono">
      <Navbar onOpenBreathing={() => {}} onOpenExport={() => {}} streakCount={stats.streakDays} />

      <main className="flex-1 space-y-8 py-8 px-4 sm:px-6 max-w-7xl mx-auto w-full font-mono text-xs">
        {/* Navigation Back */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white hover:border-emerald-500/40 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Journaling Workbench</span>
          </Link>
        </div>

        {/* Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-bold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>EMOTIONAL PATTERN RECOGNITION</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white font-outfit">
            30-Day Mood Timeline &amp; Cognitive Trends
          </h1>
          <p className="text-sm text-slate-400 font-sans max-w-2xl">
            Visualizing emotional valence shifts, primary mood distributions, and recurring cognitive reframing opportunities.
          </p>
        </div>

        {/* Top KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-[#090d16] border border-white/[0.08] space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Journaling Streak</span>
            <p className="text-3xl font-black text-amber-400 font-outfit flex items-center gap-1.5">
              <Flame className="w-6 h-6 fill-amber-400" />
              <span>{stats.streakDays} Days</span>
            </p>
            <span className="text-[10px] text-slate-500">Consistent self-care habit</span>
          </div>

          <div className="p-5 rounded-3xl bg-[#090d16] border border-white/[0.08] space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Total Entries</span>
            <p className="text-3xl font-black text-white font-outfit">{stats.totalEntries}</p>
            <span className="text-[10px] text-slate-500">Encrypted in browser</span>
          </div>

          <div className="p-5 rounded-3xl bg-[#090d16] border border-white/[0.08] space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Dominant State</span>
            <p className="text-2xl font-black text-emerald-400 font-outfit capitalize">
              {getMoodBadgeProps(stats.dominantMood).emoji} {stats.dominantMood}
            </p>
            <span className="text-[10px] text-slate-500">Most frequent check-in</span>
          </div>

          <div className="p-5 rounded-3xl bg-[#090d16] border border-white/[0.08] space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Average Valence</span>
            <p className="text-3xl font-black text-teal-400 font-outfit">
              {stats.averageValence > 0 ? `+${stats.averageValence}` : stats.averageValence}
            </p>
            <span className="text-[10px] text-teal-400/80 font-sans">Balanced emotional range</span>
          </div>
        </div>

        {/* Visual Emotional Timeline Graph */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#090d16] border border-white/[0.08] space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
            <h3 className="font-bold text-white text-base font-outfit flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              Emotional Valence Progression Over Time (-1.0 to +1.0)
            </h3>
            <span className="text-[10px] text-slate-500">Chronological Progression</span>
          </div>

          <div className="space-y-3">
            {entries.map((entry) => {
              const valence = entry.analysis?.sentimentScore ?? 0.0;
              const badge = getMoodBadgeProps(entry.moodTag);
              const percentage = Math.round(((valence + 1) / 2) * 85 + 10);

              return (
                <div key={entry.id} className="p-3.5 rounded-2xl bg-[#04080e] border border-white/[0.06] space-y-2">
                  <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{badge.emoji}</span>
                      <span className="font-bold text-white font-outfit">{entry.title || 'Journal Entry'}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${badge.bg} ${badge.border} ${badge.color}`}>
                        {entry.moodTag}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-[10px] text-slate-400">
                      <span className="flex items-center gap-1 font-mono">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        {entry.date}
                      </span>
                      <span className="font-bold text-emerald-400 font-mono">
                        Valence: {valence > 0 ? `+${valence}` : valence}
                      </span>
                    </div>
                  </div>

                  <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        valence >= 0.4
                          ? 'bg-emerald-400'
                          : valence >= 0
                          ? 'bg-teal-400'
                          : valence >= -0.4
                          ? 'bg-amber-400'
                          : 'bg-rose-400'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mood Distribution Grid */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#090d16] border border-white/[0.08] space-y-4 shadow-xl">
          <h3 className="font-bold text-white text-base font-outfit flex items-center gap-2">
            <PieChart className="w-4 h-4 text-teal-400" />
            Mood Distribution Spectrum
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
            {(Object.keys(stats.moodCounts) as MoodCategory[]).map((mood) => {
              const badge = getMoodBadgeProps(mood);
              const count = stats.moodCounts[mood];

              return (
                <div
                  key={mood}
                  className={`p-3.5 rounded-2xl border text-center space-y-1 ${badge.bg} ${badge.border}`}
                >
                  <span className="text-2xl">{badge.emoji}</span>
                  <span className="block font-bold text-white text-xs font-outfit capitalize">{mood}</span>
                  <span className={`text-xs font-black ${badge.color}`}>{count} entries</span>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
