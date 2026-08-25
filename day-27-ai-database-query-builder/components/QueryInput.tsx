'use client';

import { useState } from 'react';
import { DatabaseDialect, DatabaseSchema } from '@/types';
import {
  Sparkles,
  Zap,
  Terminal,
  Layers,
  ArrowRight,
  Loader2,
  HelpCircle,
  Mic,
  MicOff,
  Flame,
  DollarSign,
  Users,
  AlertTriangle,
  Clock,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  schema: DatabaseSchema;
  dialect: DatabaseDialect;
  onDialectChange: (dialect: DatabaseDialect) => void;
  onGenerate: (question: string) => void;
  isLoading: boolean;
}

const DIALECT_OPTIONS: { id: DatabaseDialect; label: string; icon: string }[] = [
  { id: 'postgres', label: 'PostgreSQL', icon: '🐘' },
  { id: 'mysql', label: 'MySQL', icon: '🐬' },
  { id: 'mongodb', label: 'MongoDB Pipeline', icon: '🍃' },
  { id: 'sqlite', label: 'SQLite', icon: '🗄️' },
  { id: 'prisma', label: 'Prisma ORM', icon: '🔷' },
  { id: 'drizzle', label: 'Drizzle ORM', icon: '💧' },
];

const CATEGORIZED_PROMPTS = [
  {
    category: '💰 Revenue & Sales',
    icon: DollarSign,
    prompts: [
      'Show me the top 10 customers by total revenue in Q1 2026, only from Pakistan with completed orders',
      'Calculate month-over-month revenue growth rate for the past 6 months',
      'Which product categories generate more than $20,000 in monthly sales with average rating > 4.5?',
    ],
  },
  {
    category: '👥 Users & Retention',
    icon: Users,
    prompts: [
      'Find all registered users who created an account in the last 30 days but never placed an order',
      'Calculate 30-day user retention rate grouped by sign-up country',
      'List top 5 power users who completed more than 15 transactions this week',
    ],
  },
  {
    category: '🚨 Risk & Audit',
    icon: AlertTriangle,
    prompts: [
      'Find all flagged transactions over $5,000 in the past 7 days with user full name and wallet currency',
      'List suspicious orders where checkout total exceeds $1,000 and billing country differs from shipping country',
    ],
  },
  {
    category: '⚡ Performance Audit',
    icon: Clock,
    prompts: [
      'Show the 5 slowest API endpoints with average latency > 500ms and request volume > 10,000',
      'Find tenant organizations consuming more than 1,000,000 tokens per week',
    ],
  },
];

export default function QueryInput({
  schema,
  dialect,
  onDialectChange,
  onGenerate,
  isLoading,
}: Props) {
  const [question, setQuestion] = useState(
    'Show me the top 10 customers by total revenue in Q1 2026, only from Pakistan with completed orders'
  );
  const [isListening, setIsListening] = useState(false);
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || isLoading) return;
    onGenerate(question.trim());
  };

  const handleSelectSample = (sample: string) => {
    setQuestion(sample);
    onGenerate(sample);
  };

  // Web Speech recognition for voice queries
  const handleVoiceInput = () => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported on this browser. Please type your query.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setQuestion(transcript);
      setIsListening(false);
      onGenerate(transcript);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-[#0d1117] border border-emerald-500/30 shadow-2xl space-y-6 font-mono">
      {/* Header & Dialect Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base font-outfit">
              Natural Language Query Generator
            </h3>
            <p className="text-xs text-slate-400">
              Active Schema: <strong className="text-cyan-400">{schema.name}</strong> ({schema.tables.length} tables)
            </p>
          </div>
        </div>

        {/* Dialect Selector Chips */}
        <div className="flex items-center gap-1.5 flex-wrap p-1 rounded-2xl bg-[#161b22] border border-slate-800">
          {DIALECT_OPTIONS.map((d) => {
            const isSelected = dialect === d.id;
            return (
              <button
                key={d.id}
                type="button"
                onClick={() => onDialectChange(d.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-500 text-black font-black shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>{d.icon}</span>
                <span>{d.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Query Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Ask in Plain English:</span>
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleVoiceInput}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  isListening
                    ? 'bg-rose-500 text-white animate-pulse'
                    : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-emerald-400'
                }`}
                title="Voice Dictation: Speak your query"
              >
                {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                <span>{isListening ? 'Listening...' : 'Voice Input'}</span>
              </button>
              <span className="text-[10px] text-slate-500">{question.length} chars</span>
            </div>
          </div>

          <textarea
            rows={3}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g. Find all customers who ordered more than $500 in electronics this month..."
            className="w-full p-4 rounded-2xl bg-[#161b22] border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 font-sans leading-relaxed"
          />
        </div>

        {/* Categorized Prompt Explorer Matrix */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {CATEGORIZED_PROMPTS.map((cat, idx) => {
              const isSelected = activeCategoryIndex === idx;
              return (
                <button
                  key={cat.category}
                  type="button"
                  onClick={() => setActiveCategoryIndex(idx)}
                  className={`px-3 py-1 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-800 text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {cat.category}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {CATEGORIZED_PROMPTS[activeCategoryIndex].prompts.map((sq, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSelectSample(sq)}
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 text-slate-300 hover:text-white text-[11px] transition-all flex items-center gap-1.5 cursor-pointer text-left"
              >
                <span className="truncate max-w-xs sm:max-w-md">{sq}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <span className="text-[10px] text-slate-500 hidden sm:inline">
            Translates natural language to typed {dialect.toUpperCase()} queries via Gemini 1.5 Flash
          </span>

          <button
            type="submit"
            disabled={isLoading || !question.trim()}
            className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-500 hover:from-emerald-300 hover:to-cyan-400 text-black font-extrabold text-xs transition-all shadow-lg shadow-emerald-500/20 hover:scale-105 disabled:opacity-40 cursor-pointer flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4 fill-black" />
            )}
            <span>Generate {dialect.toUpperCase()} Query</span>
          </button>
        </div>
      </form>
    </div>
  );
}
