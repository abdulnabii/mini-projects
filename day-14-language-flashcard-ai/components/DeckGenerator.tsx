'use client';

import { useState } from 'react';
import { CEFRLevel, SupportedLanguage } from '@/types';
import { Sparkles, Languages, BookOpen, Layers, Zap, Loader2 } from 'lucide-react';

interface Props {
  onGenerate: (language: SupportedLanguage, topic: string, level: CEFRLevel, count: number) => Promise<void>;
  isLoading: boolean;
}

const LANGUAGES: { id: SupportedLanguage; name: string; flag: string; rtl?: boolean }[] = [
  { id: 'spanish', name: 'Spanish (Español)', flag: '🇪🇸' },
  { id: 'french', name: 'French (Français)', flag: '🇫🇷' },
  { id: 'german', name: 'German (Deutsch)', flag: '🇩🇪' },
  { id: 'arabic', name: 'Arabic (العربية)', flag: '🇸🇦', rtl: true },
  { id: 'urdu', name: 'Urdu (اردو)', flag: '🇵🇰', rtl: true },
];

const TOPIC_PRESETS = [
  'Business & Tech Negotiations',
  'Travel, Airports & Hospitality',
  'Everyday Street Conversation',
  'Emergency, Pharmacy & Medical',
  'Food, Dining & Culinary Culture',
];

const CEFR_LEVELS: { id: CEFRLevel; title: string; desc: string }[] = [
  { id: 'A1', title: 'A1 Beginner', desc: 'Core foundational vocabulary' },
  { id: 'A2', title: 'A2 Elementary', desc: 'Daily functional phrases' },
  { id: 'B1', title: 'B1 Intermediate', desc: 'Workplace & conversational fluency' },
  { id: 'B2', title: 'B2 Upper-Intermediate', desc: 'Complex idioms & nuances' },
];

export default function DeckGenerator({ onGenerate, isLoading }: Props) {
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>('spanish');
  const [selectedTopic, setSelectedTopic] = useState<string>(TOPIC_PRESETS[0]);
  const [customTopic, setCustomTopic] = useState<string>('');
  const [selectedLevel, setSelectedLevel] = useState<CEFRLevel>('B1');
  const [cardCount, setCardCount] = useState<number>(4);

  const activeTopic = customTopic.trim() || selectedTopic;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(selectedLanguage, activeTopic, selectedLevel, cardCount);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[#0e1424] border border-emerald-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl shadow-emerald-500/10 font-mono text-xs text-slate-300">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base font-outfit">AI Spaced Repetition Deck Architect</h3>
            <p className="text-xs text-slate-400">Generates contextual flashcards with IPA phonetics, cultural notes &amp; mnemonics</p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-[10px]">
          Gemini 1.5 Flash
        </span>
      </div>

      {/* 1. Language Selection */}
      <div className="space-y-2">
        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          1. Select Target Language
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.id}
              type="button"
              onClick={() => setSelectedLanguage(lang.id)}
              className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                selectedLanguage === lang.id
                  ? 'bg-emerald-500/15 border-emerald-500 text-white shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <span className="text-xl">{lang.flag}</span>
              <span className="font-bold text-[11px]">{lang.name}</span>
              {lang.rtl && (
                <span className="text-[9px] font-extrabold text-amber-400 px-1.5 py-0.2 rounded bg-amber-500/10 border border-amber-500/20">
                  RTL
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Topic Selection */}
      <div className="space-y-2">
        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          2. Topic Domain &amp; Context
        </label>
        <div className="flex flex-wrap gap-2">
          {TOPIC_PRESETS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => {
                setSelectedTopic(t);
                setCustomTopic('');
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                selectedTopic === t && !customTopic
                  ? 'bg-indigo-500/20 border-indigo-500 text-indigo-200 shadow-md'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <input
          type="text"
          value={customTopic}
          onChange={(e) => setCustomTopic(e.target.value)}
          placeholder="Or type a custom topic (e.g., Tech Startup Pitching, Medical Emergency)..."
          className="w-full mt-2 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono"
        />
      </div>

      {/* 3. CEFR Level & Count */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* CEFR Level */}
        <div className="space-y-2">
          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            3. CEFR Proficiency Level
          </label>
          <div className="grid grid-cols-2 gap-2">
            {CEFR_LEVELS.map((lvl) => (
              <button
                key={lvl.id}
                type="button"
                onClick={() => setSelectedLevel(lvl.id)}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  selectedLevel === lvl.id
                    ? 'bg-emerald-500/15 border-emerald-500 text-emerald-200'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="font-bold block text-xs">{lvl.title}</span>
                <span className="text-[10px] text-slate-500">{lvl.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Card Count */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              4. Cards per Deck ({cardCount})
            </label>
            <span className="text-emerald-400 font-bold">{cardCount} Flashcards</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <input
              type="range"
              min="2"
              max="8"
              step="1"
              value={cardCount}
              onChange={(e) => setCardCount(Number(e.target.value))}
              className="w-full accent-emerald-400 cursor-pointer"
            />
            <div className="flex items-center justify-between text-[10px] text-slate-500">
              <span>2 Cards (Quick review)</span>
              <span>8 Cards (Full deep-dive)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Generate CTA Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-500 to-indigo-500 text-black font-extrabold text-xs font-outfit uppercase tracking-wider hover:opacity-95 transition-all shadow-xl shadow-emerald-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-black" />
            <span>Architecting Contextual Deck with Gemini AI...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 text-black" />
            <span>Generate Contextual Flashcard Deck (+50 XP)</span>
          </>
        )}
      </button>
    </form>
  );
}
