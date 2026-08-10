"use client";

import { useState } from 'react';
import TranscriptInput from '@/components/TranscriptInput';
import MeetingResults from '@/components/MeetingResults';
import { MeetingIntelligence, MeetingSession } from '@/types';
import { saveSession } from '@/lib/storage';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<MeetingIntelligence | null>(null);
  const [error, setError] = useState('');

  const handleAnalyze = async (transcript: string) => {
    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript })
      });

      if (!res.ok) throw new Error('Analysis failed');
      
      const data: MeetingIntelligence = await res.json();
      setResult(data);

      const session: MeetingSession = {
        id: crypto.randomUUID(),
        title: `Meeting ${new Date().toLocaleDateString()}`,
        createdAt: new Date().toISOString(),
        transcriptSnippet: transcript.slice(0, 100) + '...',
        intelligence: data
      };
      saveSession(session);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
          Transform meetings into <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600">intelligence</span>
        </h2>
        <p className="text-lg text-slate-400">
          Paste your raw transcript and let AI instantly extract action items, decisions, and key insights.
        </p>
      </div>

      {!result && (
        <TranscriptInput onAnalyze={handleAnalyze} isLoading={isLoading} />
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-950/50 border border-red-500/20 text-red-400 text-center max-w-2xl mx-auto">
          {error}
        </div>
      )}

      {result && (
        <div className="space-y-8">
          <div className="flex justify-center">
             <button onClick={() => setResult(null)} className="text-sm text-purple-400 hover:text-white transition-colors underline-offset-4 hover:underline">
               ← Analyze another transcript
             </button>
          </div>
          <MeetingResults data={result} />
        </div>
      )}
    </div>
  );
}
