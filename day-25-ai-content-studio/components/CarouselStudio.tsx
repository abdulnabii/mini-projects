'use client';

import { useState } from 'react';
import { LinkedInCarousel, CarouselSlide, CarouselTheme } from '@/types';
import {
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Sparkles,
  Download,
  Palette,
  Layers,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  carousel: LinkedInCarousel;
  onSaveToSchedule: (carousel: LinkedInCarousel) => void;
}

const THEME_OPTIONS: { id: CarouselTheme; label: string; bg: string; border: string; accent: string }[] = [
  { id: 'midnight_obsidian', label: 'Obsidian Emerald', bg: 'bg-[#060e14]', border: 'border-emerald-500/40', accent: 'text-emerald-400' },
  { id: 'cyberpunk_neon', label: 'Cyberpunk Cyan', bg: 'bg-[#0b0c16]', border: 'border-cyan-500/40', accent: 'text-cyan-400' },
  { id: 'clean_minimal', label: 'Clean Slate Minimal', bg: 'bg-[#111827]', border: 'border-slate-600', accent: 'text-white' },
  { id: 'deep_ocean', label: 'Deep Ocean Blue', bg: 'bg-[#081325]', border: 'border-blue-500/40', accent: 'text-blue-400' },
];

export default function CarouselStudio({ carousel, onSaveToSchedule }: Props) {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [selectedTheme, setSelectedTheme] = useState<CarouselTheme>(carousel.theme || 'midnight_obsidian');
  const [copiedAll, setCopiedAll] = useState(false);

  const activeSlide = carousel.slides[activeSlideIndex] || carousel.slides[0];
  const themeObj = THEME_OPTIONS.find((t) => t.id === selectedTheme) || THEME_OPTIONS[0];

  const copyCarouselMarkdown = () => {
    const formatted = carousel.slides
      .map(
        (s) =>
          `📑 Slide ${s.slideNumber}/${carousel.slides.length}: ${s.title}\n${
            s.subtitle ? s.subtitle + '\n' : ''
          }${s.statNumber ? `📊 ${s.statNumber}: ${s.statLabel}\n` : ''}${s.bulletPoints
            .map((b) => `• ${b}`)
            .join('\n')}`
      )
      .join('\n\n---\n\n');

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
              VISUAL CAROUSEL STUDIO
            </span>
            <span className="text-xs text-slate-500">
              {carousel.slides.length} Slides • Ready for PDF Export
            </span>
          </div>
          <h3 className="text-lg font-bold text-white font-outfit truncate max-w-xl">
            {carousel.topic}
          </h3>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={copyCarouselMarkdown}
            className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedAll ? 'Deck Copied!' : 'Copy Slide Deck'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onSaveToSchedule({ ...carousel, theme: selectedTheme });
              confetti({
                particleCount: 25,
                spread: 60,
                origin: { y: 0.7 },
                colors: ['#a855f7', '#06b6d4'],
              });
            }}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-500 hover:from-purple-400 text-black font-extrabold text-xs transition-all shadow-md shadow-purple-500/20 flex items-center gap-1.5 cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Save to Queue</span>
          </button>
        </div>
      </div>

      {/* Theme Picker Strip */}
      <div className="p-4 rounded-2xl bg-[#0d1117] border border-slate-800 space-y-2">
        <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1.5">
          <Palette className="w-3.5 h-3.5 text-purple-400" />
          <span>Carousel Visual Design Theme:</span>
        </span>
        <div className="flex items-center gap-2 flex-wrap">
          {THEME_OPTIONS.map((th) => (
            <button
              key={th.id}
              type="button"
              onClick={() => setSelectedTheme(th.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedTheme === th.id
                  ? 'bg-purple-600 text-white font-black shadow-md'
                  : 'bg-[#161b22] border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <span>{th.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Slide Thumbnails Navigator */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {carousel.slides.map((s, idx) => {
          const isSelected = activeSlideIndex === idx;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveSlideIndex(idx)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                isSelected
                  ? 'bg-purple-500 text-black font-black shadow-md'
                  : 'bg-[#0d1117] border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <span>{s.visualCue || '📑'}</span>
              <span>Slide #{s.slideNumber}</span>
            </button>
          );
        })}
      </div>

      {/* Interactive Visual Canvas Card Preview */}
      {activeSlide && (
        <div
          className={`aspect-[4/3] max-w-2xl mx-auto p-8 sm:p-12 rounded-3xl border shadow-2xl flex flex-col justify-between transition-all duration-300 ${themeObj.bg} ${themeObj.border}`}
        >
          {/* Slide Header */}
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{activeSlide.visualCue || '⚡'}</span>
              <span className="text-xs font-mono font-bold uppercase text-slate-400">
                Slide {activeSlide.slideNumber} of {carousel.slides.length}
              </span>
            </div>

            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-black font-black text-xs font-mono">
              AN
            </div>
          </div>

          {/* Center Content / Layout Variation */}
          <div className="space-y-4 my-auto py-4">
            <h3 className="text-2xl sm:text-3xl font-black text-white font-outfit tracking-tight leading-tight">
              {activeSlide.title}
            </h3>

            {activeSlide.subtitle && (
              <p className="text-sm sm:text-base text-slate-300 font-sans leading-relaxed">
                {activeSlide.subtitle}
              </p>
            )}

            {/* Big Stat Callout Layout */}
            {activeSlide.statNumber && (
              <div className="p-4 rounded-2xl bg-black/40 border border-slate-800 space-y-1">
                <div className="text-4xl font-black text-rose-400 font-outfit">
                  {activeSlide.statNumber}
                </div>
                <p className="text-xs text-slate-300 font-sans">{activeSlide.statLabel}</p>
              </div>
            )}

            {/* Bullet points */}
            {activeSlide.bulletPoints && activeSlide.bulletPoints.length > 0 && (
              <div className="space-y-2 pt-2">
                {activeSlide.bulletPoints.map((pt, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm font-sans text-slate-200">
                    <span className={`${themeObj.accent} font-bold`}>→</span>
                    <span className="leading-relaxed">{pt}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Slide Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800/80 text-xs">
            <span className="text-[11px] text-slate-500 font-mono">
              ThreadGenius.AI • @abdulnabi
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={activeSlideIndex === 0}
                onClick={() => setActiveSlideIndex((p) => Math.max(0, p - 1))}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-30 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                disabled={activeSlideIndex === carousel.slides.length - 1}
                onClick={() => setActiveSlideIndex((p) => Math.min(carousel.slides.length - 1, p + 1))}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-30 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
