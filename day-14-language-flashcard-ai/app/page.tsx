'use client';

import { useState, useEffect } from 'react';
import { CEFRLevel, Deck, Flashcard, GamificationState, SupportedLanguage } from '@/types';
import { getStoredDecks, saveDecksToStorage, getStoredGamification, saveGamificationToStorage } from '@/lib/storage';
import { calculateSM2Review } from '@/lib/sm2';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import GamificationHeader from '@/components/GamificationHeader';
import FlashcardViewer from '@/components/FlashcardViewer';
import DeckGenerator from '@/components/DeckGenerator';
import RetentionAnalytics from '@/components/RetentionAnalytics';
import confetti from 'canvas-confetti';
import { Sparkles, Layers, BookOpen, TrendingUp, RotateCcw, PlusCircle, CheckCircle2, Trophy, ArrowRight } from 'lucide-react';

export default function HomePage() {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [activeDeckId, setActiveDeckId] = useState<string>('');
  const [activeCardIndex, setActiveCardIndex] = useState<number>(0);
  const [gamification, setGamification] = useState<GamificationState | null>(null);
  const [activeTab, setActiveTab] = useState<'study' | 'generate' | 'decks' | 'analytics'>('study');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [sessionCompleted, setSessionCompleted] = useState<boolean>(false);

  useEffect(() => {
    const loadedDecks = getStoredDecks();
    const loadedGamification = getStoredGamification();
    setDecks(loadedDecks);
    setGamification(loadedGamification);
    if (loadedDecks.length > 0) {
      setActiveDeckId(loadedDecks[0].id);
    }
  }, []);

  const activeDeck = decks.find((d) => d.id === activeDeckId) || decks[0];
  const activeCard = activeDeck?.cards[activeCardIndex];

  const handleRateCard = (qualityScore: number) => {
    if (!activeCard || !activeDeck || !gamification) return;

    // 1. Calculate new SM-2 interval & ease factor
    const updatedCard = calculateSM2Review(activeCard, qualityScore);

    // 2. Update deck in state and storage
    const updatedCards = activeDeck.cards.map((c) => (c.id === updatedCard.id ? updatedCard : c));
    const updatedDecks = decks.map((d) => (d.id === activeDeck.id ? { ...d, cards: updatedCards } : d));
    setDecks(updatedDecks);
    saveDecksToStorage(updatedDecks);

    // 3. Update gamification XP & stats
    const xpEarned = qualityScore >= 3 ? 15 : 5;
    const newXP = gamification.xp + xpEarned;
    const newLevel = Math.floor(newXP / 300) + 1;
    const newCardsReviewed = gamification.cardsReviewedToday + 1;

    const updatedGamification: GamificationState = {
      ...gamification,
      xp: newXP,
      level: newLevel,
      cardsReviewedToday: newCardsReviewed,
    };
    setGamification(updatedGamification);
    saveGamificationToStorage(updatedGamification);

    // 4. Move to next card or complete session
    if (activeCardIndex + 1 < activeDeck.cards.length) {
      setActiveCardIndex(activeCardIndex + 1);
    } else {
      setSessionCompleted(true);
      try {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      } catch (e) {}
    }
  };

  const handleBonusXP = (bonus: number) => {
    if (!gamification) return;
    const updated: GamificationState = {
      ...gamification,
      xp: gamification.xp + bonus,
    };
    setGamification(updated);
    saveGamificationToStorage(updated);
  };

  const handleGenerateDeck = async (
    language: SupportedLanguage,
    topic: string,
    level: CEFRLevel,
    count: number
  ) => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/generate-deck', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language, topic, level, count }),
      });

      const data = await res.json();
      if (data.cards && data.cards.length > 0) {
        const newDeck: Deck = {
          id: `deck_${language}_${Date.now()}`,
          title: `${language.toUpperCase()}: ${topic}`,
          language,
          topic,
          level,
          createdAt: new Date().toISOString(),
          cards: data.cards,
        };

        const updatedDecks = [newDeck, ...decks];
        setDecks(updatedDecks);
        saveDecksToStorage(updatedDecks);
        setActiveDeckId(newDeck.id);
        setActiveCardIndex(0);
        setSessionCompleted(false);
        setActiveTab('study');

        handleBonusXP(50);
      }
    } catch (err) {
      console.error('Error generating deck:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0f19] text-slate-200">
      <Navbar
        streak={gamification?.streakDays || 4}
        xp={gamification?.xp || 450}
        level={gamification?.level || 3}
      />

      <main className="flex-1 space-y-8 py-8 px-4 sm:px-6 max-w-7xl mx-auto w-full">
        {/* Hero Header */}
        <section className="text-center space-y-4 max-w-3xl mx-auto pt-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SCIENTIFIC SM-2 SPACED REPETITION ENGINE</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-outfit">
            Master Languages with AI &amp; <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-indigo-400 bg-clip-text text-transparent">
              SuperMemo-2 Spaced Repetition
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-400 font-mono max-w-2xl mx-auto leading-relaxed">
            Scientifically scheduled vocabulary recall in Spanish, Arabic, Urdu, French, and German with 3D interactive flashcards, IPA phonetics, and Web Speech pronunciation feedback.
          </p>
        </section>

        {/* Gamification Progress Banner */}
        {gamification && <GamificationHeader state={gamification} />}

        {/* Navigation Tabs */}
        <div className="flex items-center justify-center gap-2 font-mono text-xs overflow-x-auto pb-2">
          <button
            type="button"
            onClick={() => setActiveTab('study')}
            className={`px-4 py-2.5 rounded-2xl border transition-all flex items-center gap-2 font-bold shrink-0 ${
              activeTab === 'study'
                ? 'bg-emerald-500/10 border-emerald-500 text-emerald-300 shadow-lg shadow-emerald-500/10'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <span>Active Study Session</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('generate')}
            className={`px-4 py-2.5 rounded-2xl border transition-all flex items-center gap-2 font-bold shrink-0 ${
              activeTab === 'generate'
                ? 'bg-emerald-500/10 border-emerald-500 text-emerald-300 shadow-lg shadow-emerald-500/10'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <PlusCircle className="w-4 h-4 text-emerald-400" />
            <span>Generate AI Deck</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('decks')}
            className={`px-4 py-2.5 rounded-2xl border transition-all flex items-center gap-2 font-bold shrink-0 ${
              activeTab === 'decks'
                ? 'bg-emerald-500/10 border-emerald-500 text-emerald-300 shadow-lg shadow-emerald-500/10'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4 text-emerald-400" />
            <span>My Decks ({decks.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2.5 rounded-2xl border transition-all flex items-center gap-2 font-bold shrink-0 ${
              activeTab === 'analytics'
                ? 'bg-emerald-500/10 border-emerald-500 text-emerald-300 shadow-lg shadow-emerald-500/10'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>Retention &amp; Leaderboard</span>
          </button>
        </div>

        {/* Tab 1: Active Study Session */}
        {activeTab === 'study' && (
          <section className="space-y-6">
            {/* Deck Selector Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-[#0e1424] border border-slate-800 font-mono text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-bold">Active Deck:</span>
                <span className="text-emerald-400 font-bold text-sm font-outfit">{activeDeck?.title}</span>
                {activeDeck?.language === 'arabic' || activeDeck?.language === 'urdu' ? (
                  <span className="text-[9px] font-bold text-amber-400 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30">
                    RTL Script
                  </span>
                ) : null}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setActiveCardIndex(0);
                    setSessionCompleted(false);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restart Deck</span>
                </button>
              </div>
            </div>

            {sessionCompleted ? (
              /* Session Completed Celebration Card */
              <div className="p-8 rounded-3xl bg-[#0e1424] border-2 border-emerald-500 text-center space-y-5 max-w-xl mx-auto shadow-2xl shadow-emerald-500/20 font-mono">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-3xl mx-auto shadow-xl">
                  🎉
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white font-outfit">Review Session Completed!</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    All {activeDeck?.cards.length} cards scheduled according to SM-2 scientific retention intervals.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-emerald-400 font-bold text-xs">
                  +100 XP Session Mastery Bonus Awarded!
                </div>
                <div className="flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveCardIndex(0);
                      setSessionCompleted(false);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white font-bold hover:border-emerald-500"
                  >
                    Review Again
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('generate')}
                    className="px-5 py-2.5 rounded-xl bg-emerald-500 text-black font-extrabold hover:opacity-95"
                  >
                    Build Another Deck
                  </button>
                </div>
              </div>
            ) : activeCard ? (
              /* Active 3D Flashcard Viewer */
              <FlashcardViewer
                card={activeCard}
                language={activeDeck.language}
                totalCards={activeDeck.cards.length}
                currentIndex={activeCardIndex}
                onRateCard={handleRateCard}
                onBonusXP={handleBonusXP}
              />
            ) : (
              <p className="text-center text-slate-500 py-12">No flashcards found in this deck.</p>
            )}
          </section>
        )}

        {/* Tab 2: AI Deck Generator */}
        {activeTab === 'generate' && (
          <DeckGenerator onGenerate={handleGenerateDeck} isLoading={isGenerating} />
        )}

        {/* Tab 3: Deck Browser */}
        {activeTab === 'decks' && (
          <section className="space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white font-outfit flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                Your Customized Flashcard Decks ({decks.length})
              </h3>
              <button
                type="button"
                onClick={() => setActiveTab('generate')}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-500 text-black font-bold flex items-center gap-1.5"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>New Deck</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {decks.map((deck) => (
                <div
                  key={deck.id}
                  onClick={() => {
                    setActiveDeckId(deck.id);
                    setActiveCardIndex(0);
                    setSessionCompleted(false);
                    setActiveTab('study');
                  }}
                  className={`p-5 rounded-3xl border text-left transition-all cursor-pointer group flex flex-col justify-between gap-4 ${
                    activeDeckId === deck.id
                      ? 'bg-emerald-500/10 border-emerald-500 text-white shadow-xl shadow-emerald-500/10'
                      : 'bg-[#0e1424] border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30">
                        {deck.language.toUpperCase()} • {deck.level}
                      </span>
                      <span className="text-[10px] text-slate-500">{deck.cards.length} cards</span>
                    </div>
                    <h4 className="font-bold text-white text-sm font-outfit group-hover:text-emerald-300 transition-colors">
                      {deck.title}
                    </h4>
                    <p className="text-[11px] text-slate-400">{deck.topic}</p>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-800/80 pt-3 text-[10px]">
                    <span className="text-slate-500">
                      {new Date(deck.createdAt).toLocaleDateString()}
                    </span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <span>Study Now</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Tab 4: Retention Analytics & Leaderboard */}
        {activeTab === 'analytics' && (
          <RetentionAnalytics decks={decks} userXP={gamification?.xp || 450} />
        )}
      </main>

      <Footer />
    </div>
  );
}
