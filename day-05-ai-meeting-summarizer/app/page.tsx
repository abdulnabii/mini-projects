"use client";

import { useState } from 'react';
import TranscriptInput from '@/components/TranscriptInput';
import MeetingResults from '@/components/MeetingResults';
import { MeetingIntelligence, MeetingSession } from '@/types';
import { saveSession } from '@/lib/storage';
import { Sparkles, ArrowLeft } from 'lucide-react';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<MeetingIntelligence | null>(null);
  const [currentTranscript, setCurrentTranscript] = useState<string>('');
  const [error, setError] = useState('');

  const handleAnalyze = async (transcript: string) => {
    setIsLoading(true);
    setError('');
    setResult(null);
    setCurrentTranscript(transcript);

    try {
      const res = await fetch('/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript }),
      });

      if (!res.ok) throw new Error('Meeting analysis failed');

      const data: MeetingIntelligence = await res.json();
      setResult(data);

      const session: MeetingSession = {
        id: crypto.randomUUID(),
        title: `Meeting ${new Date().toLocaleDateString()} - ${data.attendees[0]?.name || 'Team'} Sync`,
        createdAt: new Date().toISOString(),
        transcriptSnippet: transcript.slice(0, 120) + '...',
        intelligence: data,
      };
      saveSession(session);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong while analyzing transcript.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 font-mono text-xs text-slate-300">
      {/* Hero Section */}
      <div className="text-center space-y-4 max-w-3xl mx-auto pt-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-mono font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI-POWERED MEETING INTELLIGENCE &amp; ACTION SYNTHESIS</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-outfit">
          Transform Raw Meeting Audio &amp; Text into <br />
          <span className="bg-gradient-to-r from-purple-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent">
            Executive Action Intelligence
          </span>
        </h1>

        <p className="text-xs sm:text-sm text-slate-400 font-mono max-w-2xl mx-auto leading-relaxed">
          Instantly extract decisions, assignable action items, speaker talk-time breakdown, operational blockers, and ask ad-hoc questions to your meeting AI assistant.
        </p>
      </div>

      {!result && (
        <div className="space-y-6">
          <TranscriptInput onAnalyze={handleAnalyze} isLoading={isLoading} />
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-center max-w-2xl mx-auto font-bold">
          {error}
        </div>
      )}

      {result && (
        <div className="space-y-6">
          <div className="flex justify-center">
            <button
              onClick={() => setResult(null)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-purple-400 hover:text-white hover:border-purple-500/40 transition-all font-bold shadow-md"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Analyze Another Transcript</span>
            </button>
          </div>

          <MeetingResults data={result} transcript={currentTranscript} />
        </div>
      )}
    </div>
  );
}
