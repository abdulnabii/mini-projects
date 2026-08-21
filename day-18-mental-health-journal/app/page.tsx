'use client';

import { useState, useEffect } from 'react';
import { JournalEntry, MoodCategory, AIJournalAnalysis } from '@/types';
import { getStoredJournalEntries, saveJournalEntriesToStorage, calculateMoodStats } from '@/lib/storage';
import { generateClientFallbackAnalysis } from '@/lib/journalEngine';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import JournalEditor from '@/components/JournalEditor';
import AIReflectionCard from '@/components/AIReflectionCard';
import PastEntriesDrawer from '@/components/PastEntriesDrawer';
import BreathingExerciseModal from '@/components/BreathingExerciseModal';
import CopingTechniquesModal from '@/components/CopingTechniquesModal';
import ExportDataModal from '@/components/ExportDataModal';
import confetti from 'canvas-confetti';
import { Heart, Sparkles, Wind, BookOpen, Compass, ShieldCheck, Flame, Lock } from 'lucide-react';

export default function HomePage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [activeEntry, setActiveEntry] = useState<JournalEntry | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Modal states
  const [isBreathingOpen, setIsBreathingOpen] = useState(false);
  const [isCopingOpen, setIsCopingOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  useEffect(() => {
    const loaded = getStoredJournalEntries();
    setEntries(loaded);
    if (loaded.length > 0) {
      setActiveEntry(loaded[0]);
    }
  }, []);

  const handleAnalyzeAndSave = async (title: string, content: string, mood: MoodCategory) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: content, selectedMood: mood }),
      });

      const analysis: AIJournalAnalysis = await res.json();

      const newEntry: JournalEntry = {
        id: `entry_${Date.now()}`,
        title: title || 'Mindful Reflection',
        content,
        moodTag: mood,
        date: new Date().toISOString().split('T')[0],
        timestamp: new Date().toISOString(),
        analysis,
        wordCount: content.trim().split(/\s+/).filter(Boolean).length,
      };

      const updated = [newEntry, ...entries];
      setEntries(updated);
      setActiveEntry(newEntry);
      saveJournalEntriesToStorage(updated);

      if (analysis.sentimentScore >= 0.4) {
        try {
          confetti({ particleCount: 50, spread: 50, origin: { y: 0.6 } });
        } catch (e) {}
      }

      // Smooth scroll to AI reflection
      setTimeout(() => {
        document.getElementById('ai-reflection-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (e) {
      console.error('Analysis error:', e);
      const fallbackAnalysis = generateClientFallbackAnalysis(content, mood);
      const fallbackEntry: JournalEntry = {
        id: `entry_${Date.now()}`,
        title: title || 'Mindful Reflection',
        content,
        moodTag: mood,
        date: new Date().toISOString().split('T')[0],
        timestamp: new Date().toISOString(),
        analysis: fallbackAnalysis,
        wordCount: content.trim().split(/\s+/).filter(Boolean).length,
      };
      const updated = [fallbackEntry, ...entries];
      setEntries(updated);
      setActiveEntry(fallbackEntry);
      saveJournalEntriesToStorage(updated);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteEntry = (id: string) => {
    const updated = entries.filter((e) => e.id !== id);
    setEntries(updated);
    saveJournalEntriesToStorage(updated);
    if (activeEntry?.id === id) {
      setActiveEntry(updated[0] || null);
    }
  };

  const handleWipeAll = () => {
    setEntries([]);
    setActiveEntry(null);
    saveJournalEntriesToStorage([]);
  };

  const stats = calculateMoodStats(entries);

  return (
    <div className="min-h-screen flex flex-col bg-[#060a12] text-slate-200 selection:bg-emerald-500/30 selection:text-white">
      <Navbar
        onOpenBreathing={() => setIsBreathingOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        streakCount={stats.streakDays}
      />

      <main className="flex-1 space-y-10 py-8 px-4 sm:px-6 max-w-7xl mx-auto w-full">
        {/* Hero Section */}
        <section className="text-center space-y-4 max-w-3xl mx-auto pt-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
            <Heart className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400 animate-pulse" />
            <span>AI MENTAL HEALTH JOURNAL &amp; COGNITIVE WELLNESS COMPANION</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-outfit">
            A Safe, Private Space for <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-indigo-400 bg-clip-text text-transparent">
              Mindful Reflection &amp; Emotional Clarity
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-400 font-mono max-w-2xl mx-auto leading-relaxed">
            Write freely. Receive compassionate, trauma-informed AI reflections, detect subconscious cognitive distortions, track 30-day emotional patterns, and practice somatic grounding.
          </p>

          {/* Quick Streak Pill */}
          <div className="flex items-center justify-center gap-2 text-xs font-mono pt-1">
            <span className="px-3 py-1 rounded-full bg-[#0b1220] border border-slate-800 text-slate-300 flex items-center gap-1.5 shadow-sm">
              <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>
                Daily Journaling Streak: <strong className="text-amber-400">{stats.streakDays} Days</strong>
              </span>
            </span>

            <span className="px-3 py-1 rounded-full bg-[#0b1220] border border-slate-800 text-slate-400 flex items-center gap-1.5">
              <Lock className="w-3 h-3 text-emerald-400" />
              <span>100% Client-Side Privacy</span>
            </span>
          </div>
        </section>

        {/* 1. Daily Journal Editor Workbench */}
        <section>
          <JournalEditor onAnalyzeAndSave={handleAnalyzeAndSave} isLoading={isLoading} />
        </section>

        {/* 2. AI Empathetic Reflection & CBT Analysis */}
        {activeEntry && activeEntry.analysis && (
          <section id="ai-reflection-section" className="space-y-4 animate-in fade-in duration-300">
            <div className="flex items-center justify-between font-mono text-xs text-slate-400 px-1">
              <span>
                Active Entry: <strong className="text-white">{activeEntry.title || 'Journal Reflection'}</strong> ({activeEntry.date})
              </span>
              <span className="text-emerald-400 font-bold">✓ AI Emotional Telemetry Active</span>
            </div>

            <AIReflectionCard
              analysis={activeEntry.analysis}
              onOpenBreathing={() => setIsBreathingOpen(true)}
              onOpenCoping={() => setIsCopingOpen(true)}
            />
          </section>
        )}

        {/* 3. Past Entries Drawer */}
        {entries.length > 0 && (
          <section className="pt-4 border-t border-slate-800/80">
            <PastEntriesDrawer
              entries={entries}
              onSelectEntry={(entry) => {
                setActiveEntry(entry);
                document.getElementById('ai-reflection-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              onDeleteEntry={handleDeleteEntry}
              selectedEntryId={activeEntry?.id}
            />
          </section>
        )}
      </main>

      {/* Breathing Exercise Modal */}
      <BreathingExerciseModal
        isOpen={isBreathingOpen}
        onClose={() => setIsBreathingOpen(false)}
      />

      {/* Coping Techniques Modal */}
      <CopingTechniquesModal
        isOpen={isCopingOpen}
        onClose={() => setIsCopingOpen(false)}
        onLaunchBreathing={() => setIsBreathingOpen(true)}
      />

      {/* Export Data Modal */}
      <ExportDataModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        entries={entries}
        onWipeAllData={handleWipeAll}
      />

      <Footer />
    </div>
  );
}
