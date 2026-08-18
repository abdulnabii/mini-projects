'use client';

import { useState, useEffect } from 'react';
import { Flashcard, SupportedLanguage } from '@/types';
import { playAudioPronunciation } from '@/lib/speech';
import PronunciationPractice from './PronunciationPractice';
import SM2RatingBar from './SM2RatingBar';
import { Volume2, RotateCw, Sparkles, MessageCircle, BookOpen, Layers, CheckCircle2 } from 'lucide-react';

interface Props {
  card: Flashcard;
  language: SupportedLanguage;
  totalCards: number;
  currentIndex: number;
  onRateCard: (score: number) => void;
  onBonusXP: (amount: number) => void;
}

interface DialogueScenario {
  scenarioTitle: string;
  dialogue: { speaker: string; targetText: string; translation: string }[];
  culturalTip: string;
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
  const [dialogue, setDialogue] = useState<DialogueScenario | null>(null);
  const [isLoadingDialogue, setIsLoadingDialogue] = useState<boolean>(false);

  // Reset flipped state and dialogue when card changes
  useEffect(() => {
    setIsFlipped(false);
    setDialogue(null);
  }, [card.id]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (isFlipped) {
        if (e.key === '1') onRateCard(1);
        else if (e.key === '2') onRateCard(2);
        else if (e.key === '3') onRateCard(3);
        else if (e.key === '4') onRateCard(4);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFlipped, onRateCard]);

  const handlePlayAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    playAudioPronunciation(card.word, language);
  };

  const handleGenerateDialogue = async () => {
    setIsLoadingDialogue(true);
    try {
      const res = await fetch('/api/dialogue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          word: card.word,
          meaning: card.translation,
          language,
        }),
      });
      const data: DialogueScenario = await res.json();
      setDialogue(data);
      onBonusXP(25);
    } catch (err) {
      console.error('Failed to generate dialogue:', err);
    } finally {
      setIsLoadingDialogue(false);
    }
  };

  const isRTL = language === 'arabic' || language === 'urdu';
  const primaryExample = card.exampleSentences?.[0];

  return (
    <div className="space-y-6 max-w-2xl mx-auto font-mono text-xs text-slate-300">
      {/* Progress & Card Counter */}
      <div className="flex items-center justify-between font-bold text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-400" />
          <span>
            Card {currentIndex + 1} of {totalCards}
          </span>
        </div>
        <span className="text-[11px] text-slate-500">Press [Space] to flip</span>
      </div>

      {/* 3D Interactive Flip Card */}
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        className="relative w-full min-h-[320px] rounded-3xl cursor-pointer select-none transition-all duration-500 [perspective:1000px] group"
      >
        <div
          className={`relative w-full h-full min-h-[320px] rounded-3xl p-8 border-2 transition-all duration-500 flex flex-col justify-between shadow-2xl ${
            isFlipped
              ? 'bg-[#0f172a] border-indigo-500/60 shadow-indigo-500/10'
              : 'bg-[#0e1424] border-emerald-500/40 shadow-emerald-500/10 hover:border-emerald-400'
          }`}
        >
          {/* Top Tag & Audio Icon */}
          <div className="flex items-center justify-between">
            <span
              className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                isFlipped
                  ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/30'
                  : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
              }`}
            >
              {isFlipped ? 'Meaning & Grammar' : `${language.toUpperCase()} Vocabulary`}
            </span>

            <button
              type="button"
              onClick={handlePlayAudio}
              className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500 text-emerald-400 hover:text-white transition-all shadow-md"
              title="Listen to Native Audio"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>

          {/* Card Center Content */}
          <div className="py-6 text-center space-y-3">
            {!isFlipped ? (
              /* Front: Target Word + Phonetics */
              <div className="space-y-2">
                <h2
                  className={`text-4xl sm:text-5xl font-black text-white tracking-tight ${
                    isRTL ? 'font-serif' : 'font-outfit'
                  }`}
                  dir={isRTL ? 'rtl' : 'ltr'}
                >
                  {card.word}
                </h2>
                {card.phonetic && (
                  <span className="inline-block text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                    /{card.phonetic}/
                  </span>
                )}
                {card.partOfSpeech && (
                  <span className="block text-[11px] text-slate-500 italic font-serif">
                    ({card.partOfSpeech})
                  </span>
                )}
              </div>
            ) : (
              /* Back: English Translation + Example Sentence */
              <div className="space-y-3">
                <h3 className="text-3xl font-black text-white font-outfit">{card.translation}</h3>
                {primaryExample && (
                  <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-left space-y-1">
                    <p className={`text-xs text-slate-200 font-bold ${isRTL ? 'text-right font-serif text-sm' : ''}`}>
                      {primaryExample.target}
                    </p>
                    <p className="text-[11px] text-slate-400 italic">
                      &quot;{primaryExample.english}&quot;
                    </p>
                  </div>
                )}
                {card.memoryHook && (
                  <p className="text-[11px] text-amber-300/90 italic bg-amber-500/10 p-2 rounded-xl border border-amber-500/20">
                    🧠 Mnemonic: {card.memoryHook}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Bottom Flip Hint */}
          <div className="flex items-center justify-between text-[10px] text-slate-500 border-t border-slate-800/80 pt-3">
            <span className="flex items-center gap-1">
              <RotateCw className="w-3 h-3 text-emerald-400 group-hover:rotate-180 transition-transform duration-500" />
              <span>Click to {isFlipped ? 'see target word' : 'reveal meaning'}</span>
            </span>
            <span>SM-2 Interval: {card.interval || 1}d</span>
          </div>
        </div>
      </div>

      {/* SM-2 Recall Rating Bar (Active when flipped) */}
      {isFlipped && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <SM2RatingBar onRate={onRateCard} />

          {/* Real-Life Dialogue Generator Trigger */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleGenerateDialogue}
              disabled={isLoadingDialogue}
              className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center gap-1.5 transition-all disabled:opacity-50"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isLoadingDialogue ? 'animate-spin' : ''}`} />
              <span>
                {isLoadingDialogue ? 'Generating Scenario...' : 'Generate 3-Turn Dialogue Scenario (+25 XP)'}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Dialogue Scenario Drawer (if generated) */}
      {dialogue && (
        <div className="p-5 rounded-3xl bg-[#0e1424] border border-indigo-500/30 space-y-4 shadow-xl animate-in fade-in duration-300">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="font-bold text-white text-xs font-outfit flex items-center gap-1.5">
              <MessageCircle className="w-4 h-4 text-indigo-400" />
              {dialogue.scenarioTitle}
            </span>
            <span className="text-[10px] text-indigo-400 font-bold">AI Native Scenario</span>
          </div>

          <div className="space-y-2.5">
            {dialogue.dialogue.map((d, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-indigo-400 uppercase">{d.speaker}:</span>
                <p className={`text-xs text-white font-bold ${isRTL ? 'text-right font-serif' : ''}`}>
                  {d.targetText}
                </p>
                <p className="text-[10px] text-slate-400 italic">&quot;{d.translation}&quot;</p>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-indigo-200 border-t border-slate-800 pt-2 leading-relaxed">
            💡 <strong>Cultural Context:</strong> {dialogue.culturalTip}
          </p>
        </div>
      )}

      {/* Voice Pronunciation Practice Drawer */}
      <PronunciationPractice
        targetWord={card.word}
        language={language}
        onScored={(score) => {
          if (score >= 70) onBonusXP(20);
        }}
      />
    </div>
  );
}
