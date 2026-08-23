'use client';

import { useState } from 'react';
import { LinkedInCarousel, CarouselSlide } from '@/types';
import {
  Layers,
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  Calendar,
  Sparkles,
  Download,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  carousel: LinkedInCarousel;
  onSaveToSchedule: (carousel: LinkedInCarousel) => void;
}

export default function CarouselStudio({ carousel, onSaveToSchedule }: Props) {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [copiedSlide, setCopiedSlide] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);

  const activeSlide = carousel.slides[activeSlideIndex] || carousel.slides[0];

  const copyCurrentSlide = () => {
    if (!activeSlide) return;
    const text = `${activeSlide.title}\n${activeSlide.subtitle || ''}\n\n${activeSlide.bulletPoints.join('\n')}`;
    navigator.clipboard.writeText(text);
    setCopiedSlide(true);
    setTimeout(() => setCopiedSlide(false), 2000);
  };

  const copyFullCarouselMarkdown = () => {
    const formatted = carousel.slides
      .map(
        (s) =>
          `[SLIDE ${s.slideNumber}/${carousel.slides.length}]\nTITLE: ${s.title}\nSUBTITLE: ${s.subtitle || ''}\nPOINTS:\n${s.bulletPoints.map((p) => `- ${p}`).join('\n')}`
      )
      .join('\n\n====================\n\n');
    navigator.clipboard.writeText(formatted);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <div className="space-y-6 font-mono">
      {/* Studio Header & Global Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#0d1117] border border-slate-800 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30 text-[10px] font-bold uppercase">
              VISUAL CAROUSEL SLIDE STUDIO
            </span>
            <span className="text-xs text-slate-500">{carousel.slides.length} Slides Total</span>
          </div>
          <h3 className="text-lg font-bold text-white font-outfit truncate max-w-xl">
            {carousel.topic}
          </h3>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={copyFullCarouselMarkdown}
            className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedAll ? 'Deck Copied!' : 'Copy Slide Deck'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onSaveToSchedule(carousel);
              confetti({
                particleCount: 25,
                spread: 60,
                origin: { y: 0.7 },
                colors: ['#a855f7', '#10b981'],
              });
            }}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 text-black font-extrabold text-xs transition-all shadow-md shadow-emerald-500/20 flex items-center gap-1.5 cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Save to Queue</span>
          </button>
        </div>
      </div>

      {/* Slide Navigation Buttons */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {carousel.slides.map((s, idx) => {
          const isSelected = activeSlideIndex === idx;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveSlideIndex(idx)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                isSelected
                  ? 'bg-purple-500 text-black font-black shadow-md'
                  : 'bg-[#0d1117] border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <span>Slide {s.slideNumber}</span>
              <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-black' : 'bg-purple-400'}`} />
            </button>
          );
        })}
      </div>

      {/* Main Active Slide Visual Card Preview */}
      {activeSlide && (
        <div className="max-w-2xl mx-auto p-8 sm:p-10 rounded-3xl bg-gradient-to-b from-[#111827] to-[#0b0f19] border-2 border-purple-500/30 shadow-2xl space-y-6 flex flex-col justify-between min-h-[380px] relative overflow-hidden">
          {/* Accent glow corner */}
          <div
            className="absolute top-0 right-0 w-36 h-36 rounded-full blur-3xl opacity-20"
            style={{ backgroundColor: activeSlide.accentColor || '#8b5cf6' }}
          />

          <div className="space-y-4 relative z-10">
            {/* Top Slide Meta */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-[10px] text-purple-400 uppercase font-bold tracking-widest">
                {activeSlide.visualCue || `Slide ${activeSlide.slideNumber} of ${carousel.slides.length}`}
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                {activeSlide.slideNumber} / {carousel.slides.length}
              </span>
            </div>

            {/* Slide Title & Subtitle */}
            <div className="space-y-1">
              <h3 className="text-xl sm:text-2xl font-black text-white font-outfit leading-snug">
                {activeSlide.title}
              </h3>
              {activeSlide.subtitle && (
                <p className="text-xs text-purple-300 font-sans font-semibold">
                  {activeSlide.subtitle}
                </p>
              )}
            </div>

            {/* Slide Bullet Points */}
            <div className="space-y-3 pt-2">
              {activeSlide.bulletPoints.map((pt, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs sm:text-sm text-slate-200 font-sans flex items-start gap-2.5"
                >
                  <span
                    className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                    style={{ backgroundColor: activeSlide.accentColor || '#a855f7' }}
                  />
                  <span>{pt}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Slide Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800 relative z-10">
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={activeSlideIndex === 0}
                onClick={() => setActiveSlideIndex((prev) => Math.max(0, prev - 1))}
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white disabled:opacity-30 cursor-pointer flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Prev</span>
              </button>

              <button
                type="button"
                disabled={activeSlideIndex === carousel.slides.length - 1}
                onClick={() =>
                  setActiveSlideIndex((prev) => Math.min(carousel.slides.length - 1, prev + 1))
                }
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white disabled:opacity-30 cursor-pointer flex items-center gap-1"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={copyCurrentSlide}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              {copiedSlide ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSlide ? 'Copied' : 'Copy Slide'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
