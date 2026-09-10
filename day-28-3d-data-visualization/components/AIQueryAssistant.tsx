'use client';

import { useState } from 'react';
import {
  Sparkles,
  Send,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  FileCheck,
  TrendingUp,
} from 'lucide-react';
import {
  StructuredAIResponse,
  ColumnProfile,
  DetectedAnomaly,
  CorrelationResult,
} from '@/types';

interface Props {
  datasetTitle: string;
  rows: Record<string, any>[];
  columnProfiles: ColumnProfile[];
  anomalies: DetectedAnomaly[];
  correlations: CorrelationResult[];
}

const PRESET_QUESTIONS = [
  'Which entries are statistical outliers?',
  'What are the strongest correlations?',
  'Which category or region has the highest value?',
  'Explain this visualization and recommended action.',
];

export default function AIQueryAssistant({
  datasetTitle,
  rows,
  columnProfiles,
  anomalies,
  correlations,
}: Props) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<StructuredAIResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAsk = async (questionText: string) => {
    if (!questionText.trim()) return;
    setLoading(true);
    setError(null);
    setQuery(questionText);

    try {
      const res = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: questionText,
          datasetTitle,
          rows: rows.slice(0, 100),
          columnProfiles,
          anomalies,
          correlations,
        }),
      });

      const data = await res.json();
      if (data.error) {
        setError(data.error);
        return;
      }
      setResponse(data.response);
    } catch (e: any) {
      console.error('AI Query failed:', e);
      setError('Unable to complete AI query. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 rounded-2xl bg-[#0d1527] border border-[#1e293b] shadow-xl space-y-4 font-mono">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#1e293b] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-white text-sm font-mono">
                Ask Your Data (Grounded AI Analyst)
              </h3>
              <span className="px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold font-mono">
                VERIFIED FACTS FIRST
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Deterministic calculations performed locally before natural language interpretation.
            </p>
          </div>
        </div>
      </div>

      {/* Suggested Prompt Chips */}
      <div className="flex items-center gap-2 flex-wrap text-xs">
        <span className="text-[10px] text-slate-400 uppercase font-bold">Suggested:</span>
        {PRESET_QUESTIONS.map((q, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleAsk(q)}
            className="px-2.5 py-1 rounded-lg bg-[#111827] border border-[#1e293b] hover:border-cyan-500/40 text-slate-300 hover:text-white text-[11px] transition-all cursor-pointer"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAsk(query);
        }}
        className="flex items-center gap-2"
      >
        <input
          type="text"
          placeholder="Ask a question about this dataset (e.g. 'Show outliers or highest region')..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 px-3.5 py-2 rounded-xl bg-[#111827] border border-[#1e293b] text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
        />
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="px-4 py-2 rounded-xl bg-cyan-500 text-black font-bold text-xs flex items-center gap-1.5 hover:bg-cyan-400 disabled:opacity-40 transition-all cursor-pointer shrink-0"
        >
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
          <span>Ask AI</span>
        </button>
      </form>

      {error && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
          {error}
        </div>
      )}

      {/* Structured AI Response Box */}
      {response && (
        <div className="p-4 rounded-xl bg-[#111827] border border-cyan-500/30 space-y-3 mt-4 text-xs animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-[#1e293b] pb-2">
            <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Grounded Finding:</span>
            </div>
            {response.isFallback && (
              <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                Verified Local Engine
              </span>
            )}
          </div>

          <p className="text-white font-medium leading-relaxed">
            {response.finding}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            <div className="p-3 rounded-lg bg-[#0d1527] border border-[#1e293b] space-y-1">
              <span className="text-[10px] text-emerald-400 font-bold uppercase flex items-center gap-1">
                <FileCheck className="w-3 h-3" />
                <span>Computed Evidence:</span>
              </span>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                {response.evidence}
              </p>
            </div>

            <div className="p-3 rounded-lg bg-[#0d1527] border border-[#1e293b] space-y-1">
              <span className="text-[10px] text-purple-400 font-bold uppercase flex items-center gap-1">
                <Lightbulb className="w-3 h-3" />
                <span>Suggested Action:</span>
              </span>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                {response.suggestedAction}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
