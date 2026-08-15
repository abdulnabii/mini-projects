'use client';

import { useState } from 'react';
import { Flashcard, SupportedLanguage } from '@/types';
import { playAudioPronunciation } from '@/lib/speech';
import PronunciationPractice from './PronunciationPractice';
import SM2RatingBar from './SM2RatingBar';
import { Volume2, RotateCw, Lightbulb, Globe, Sparkles, BookOpen, Clock, Calendar } from 'lucide-react';

interface Props {
  card: Flashcard;
  language: SupportedLanguage;
  totalCards: number;
  currentIndex: number;
  onRateCard: (qualityScore: number) => void;
  onBonusXP: (xp: number) => void;
}

export default function FlashcardViewer({
  card,
  language,
  totalCards,
  currentIndex,
  onRateCard,
  onBonusXP,
}: Props) {
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const isRTL = language === 'arabic' || language === 'urdu';

  const handlePlayAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    playAudioPronunciation(card.word, language);
  };

  const handlePronunciationScore = (score: number) => {
    if (score >= 70) {
      onBonusXP(20);
    }
  };

  const handleRate = (score: number) => {
    setIsFlipped(false);
    onRateCard(score);
  };

  return (
    <div className="space-y-6 font-mono text-xs text-slate-300 max-w-3xl mx-auto w-full">
      {/* Progress & Card Counter */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-400">
          Card {currentIndex + 1} of {totalCards}
        </span>

        <div className="flex items-center gap-3 text-[10px] text-slate-400">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            Interval: <strong className="text-white">{card.interval}d</strong>
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-indigo-400" />
            Ease: <strong className="text-white">{card.easeFactor}</strong>
          </span>
        </div>
      </div>

      {/* 3D Flip Card Container */}
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        className="w-full min-h-[380px] cursor-pointer perspective-1000 group select-none"
      >
        <div
          className={`relative w-full min-h-[380px] rounded-3xl p-8 transition-transform duration-500 transform-style-3d border-2 shadow-2xl ${
            isFlipped
              ? 'bg-[#0f172a] border-indigo-500/50 shadow-indigo-500/10'
              : 'bg-[#0e1424] border-emerald-500/50 shadow-emerald-500/10'
          }`}
        >
          {/* Flip Hint Badge */}
          <div className="flex items-center justify-between mb-6">
            <span className="px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-[10px] text-slate-400 flex items-center gap-1.5">
              <RotateCw className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isFlipped ? 'Back (Translation & Context)' : 'Front (Target Word)'} — Tap to flip</span>
            </span>

            <button
              type="button"
              onClick={handlePlayAudio}
              className="p-2.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25 transition-all shadow-md"
              title="Listen to native pronunciation"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>

          {!isFlipped ? (
            /* FRONT OF CARD */
            <div className="flex flex-col items-center justify-center text-center space-y-4 py-8">
              <h2
                dir={isRTL ? 'rtl' : 'ltr'}
                className={`font-black text-white tracking-tight ${
                  isRTL ? 'text-4xl sm:text-5xl font-sans' : 'text-3xl sm:text-5xl font-outfit'
                }`}
              >
                {card.word}
              </h2>

              <p className="text-emerald-400 font-bold text-sm tracking-wider">{card.phonetic}</p>

              <span className="text-slate-500 text-[11px] uppercase tracking-widest">{card.partOfSpeech}</span>

              <p className="text-slate-400 text-xs pt-6">Tap anywhere to reveal English translation &amp; examples</p>
            </div>
          ) : (
            /* BACK OF CARD */
            <div className="space-y-4 text-left">
              <div>
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">
                  English Meaning:
                </span>
                <h3 className="text-2xl font-black text-white font-outfit mt-0.5">{card.translation}</h3>
              </div>

              {/* Example Sentences */}
              {card.exampleSentences && card.exampleSentences.length > 0 && (
                <div className="space-y-2 pt-1 border-t border-slate-800">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                    Conversational Context:
                  </label>
                  <div className="space-y-1.5">
                    {card.exampleSentences.map((ex, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
                        <p dir={isRTL ? 'rtl' : 'ltr'} className="font-bold text-emerald-300">
                          {ex.target}
                        </p>
                        <p className="text-slate-400 text-[11px] mt-0.5">{ex.english}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Cultural Context Note */}
              {card.culturalNote && (
                <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-200 text-[11px] flex items-start gap-2">
                  <Globe className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <p>
                    <strong>Cultural Nuance:</strong> {card.culturalNote}
                  </p>
                </div>
              )}

              {/* Memory Mnemonic Hook */}
              {card.memoryHook && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-[11px] flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <p>
                    <strong>Memory Hook:</strong> {card.memoryHook}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Voice Pronunciation Practice */}
      <PronunciationPractice
        targetWord={card.word}
        language={language}
        onScored={handlePronunciationScore}
      />

      {/* SM-2 Recall Rating Bar */}
      <SM2RatingBar onRate={handleRate} />
    </div>
  );
}
