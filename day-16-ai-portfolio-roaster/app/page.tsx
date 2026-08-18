'use client';

import { useState, useEffect } from 'react';
import { RoastIntensity, RoastResult } from '@/types';
import { SAMPLE_PORTFOLIOS } from '@/lib/samplePortfolios';
import { generateClientFallbackRoast } from '@/lib/roastEngine';
import { getStoredRoasts, saveRoastToStorage } from '@/lib/storage';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PortfolioInput from '@/components/PortfolioInput';
import RoastScoreOverview from '@/components/RoastScoreOverview';
import CategoryRoastGrid from '@/components/CategoryRoastGrid';
import ShareableBadgeCard from '@/components/ShareableBadgeCard';
import BioRewriterModal from '@/components/BioRewriterModal';
import confetti from 'canvas-confetti';
import { Flame, Sparkles, AlertTriangle, Trophy, CheckCircle2, ArrowDown, RotateCcw, Wrench } from 'lucide-react';

export default function HomePage() {
  const [activeRoast, setActiveRoast] = useState<RoastResult | null>(() =>
    generateClientFallbackRoast(
      SAMPLE_PORTFOLIOS[0].developerName,
      SAMPLE_PORTFOLIOS[0].portfolioUrl,
      'spicy'
    )
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isBioModalOpen, setIsBioModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const history = getStoredRoasts();
    if (history.length > 0) {
      setActiveRoast(history[0]);
    }
  }, []);

  const handleRoast = async (
    name: string,
    portfolioUrl: string,
    bioText: string,
    projectsText: string,
    intensity: RoastIntensity
  ) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/roast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, portfolioUrl, bioText, projectsText, intensity }),
      });

      const data: RoastResult = await res.json();
      setActiveRoast(data);
      saveRoastToStorage(data);

      if (data.overallScore >= 75) {
        try {
          confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
        } catch (e) {}
      }

      // Smooth scroll to results
      setTimeout(() => {
        document.getElementById('roast-results-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      console.error('Roasting failed, using fallback:', err);
      const fallback = generateClientFallbackRoast(name, portfolioUrl || bioText, intensity);
      setActiveRoast(fallback);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#080a0f] text-slate-200 selection:bg-orange-500/30 selection:text-white">
      <Navbar />

      <main className="flex-1 space-y-10 py-8 px-4 sm:px-6 max-w-7xl mx-auto w-full">
        {/* Hero Section */}
        <section className="text-center space-y-4 max-w-3xl mx-auto pt-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-mono font-bold">
            <Flame className="w-3.5 h-3.5 fill-orange-400 text-orange-400 animate-pulse" />
            <span>AI DEVELOPER &amp; DESIGNER PORTFOLIO ROASTER</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-outfit">
            Is Your Portfolio Getting You Hired, or <br />
            <span className="bg-gradient-to-r from-orange-400 via-red-500 to-amber-400 bg-clip-text text-transparent">
              Laughed Out of the Screening Call?
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-400 font-mono max-w-2xl mx-auto leading-relaxed">
            Get brutally honest AI critiques on visual design, project depth, bio cringe factor, UX navigation, and ATS recruiter appeal — followed by precision engineering fixes.
          </p>
        </section>

        {/* Input Workbench */}
        <section className="rounded-3xl bg-[#0f1420] border border-orange-500/30 p-6 sm:p-8 shadow-2xl shadow-orange-500/10">
          <PortfolioInput onRoast={handleRoast} isLoading={isLoading} />
        </section>

        {/* Roast Results Section */}
        {activeRoast && (
          <section id="roast-results-section" className="space-y-8 animate-in fade-in duration-500">
            {/* Scorecard Overview */}
            <RoastScoreOverview
              roast={activeRoast}
              onOpenFixModal={() => setIsBioModalOpen(true)}
            />

            {/* 5-Dimension Critique & Actionable Fixes Grid */}
            <CategoryRoastGrid categories={activeRoast.categories} />

            {/* Prioritized Action Roadmap */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#0f1420] border border-slate-800 space-y-4 font-mono text-xs shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-bold text-white text-base font-outfit flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-emerald-400" />
                  Prioritized Refactor Roadmap ({activeRoast.actionRoadmap.length} Tasks)
                </h3>
                <span className="text-[10px] text-slate-500">Execute in order of priority</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activeRoast.actionRoadmap.map((item) => (
                  <div
                    key={item.priority}
                    className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400">STEP #{item.priority}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                          item.impact === 'CRITICAL'
                            ? 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
                            : item.impact === 'HIGH'
                            ? 'bg-orange-500/10 border border-orange-500/30 text-orange-400'
                            : 'bg-teal-500/10 border border-teal-500/30 text-teal-400'
                        }`}
                      >
                        {item.impact} IMPACT
                      </span>
                    </div>

                    <h4 className="font-bold text-white text-xs font-outfit">{item.title}</h4>
                    <p className="text-[11px] text-slate-300 font-sans leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Shareable Social Badge Card */}
            <ShareableBadgeCard roast={activeRoast} />
          </section>
        )}
      </main>

      {/* Bio Rewriter Modal */}
      {activeRoast && (
        <BioRewriterModal
          isOpen={isBioModalOpen}
          onClose={() => setIsBioModalOpen(false)}
          developerName={activeRoast.developerName}
          currentBio={activeRoast.rewrittenHeroBio.beforeBio}
        />
      )}

      <Footer />
    </div>
  );
}
