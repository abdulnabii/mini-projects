'use client';

import { useState } from 'react';
import { RoastIntensity, SamplePortfolioPreset } from '@/types';
import { SAMPLE_PORTFOLIOS } from '@/lib/samplePortfolios';
import IntensityPicker from './IntensityPicker';
import { Flame, Sparkles, Globe, User, BookOpen, Layers, Zap, ArrowRight } from 'lucide-react';

interface Props {
  onRoast: (
    name: string,
    portfolioUrl: string,
    bioText: string,
    projectsText: string,
    intensity: RoastIntensity
  ) => void;
  isLoading: boolean;
}

export default function PortfolioInput({ onRoast, isLoading }: Props) {
  const [name, setName] = useState<string>('Alex Rivera');
  const [portfolioUrl, setPortfolioUrl] = useState<string>('https://alex-rivera-portfolio.dev');
  const [bioText, setBioText] = useState<string>(
    'I am an aspiring, passionate software engineer who loves coding 24/7! Fast learner, team player, and always hungry for new tech challenges.'
  );
  const [projectsText, setProjectsText] = useState<string>(
    '1. Todo List App (React, LocalStorage)\n2. Weather App (OpenWeatherMap API)\n3. Basic Calculator (HTML, CSS, JS)\n4. Netflix Clone (Frontend only)'
  );
  const [intensity, setIntensity] = useState<RoastIntensity>('spicy');

  const handleSelectPreset = (p: SamplePortfolioPreset) => {
    setName(p.developerName);
    setPortfolioUrl(p.portfolioUrl);
    setBioText(p.bioSnippet);
    setProjectsText(p.projectsList.join('\n'));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() && !portfolioUrl.trim() && !bioText.trim()) return;
    onRoast(name, portfolioUrl, bioText, projectsText, intensity);
  };

  return (
    <div className="space-y-6 font-mono text-xs text-slate-300">
      {/* 1. Viral Archetype Presets */}
      <div className="space-y-2">
        <label className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          Or Test With a Viral Portfolio Archetype:
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {SAMPLE_PORTFOLIOS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleSelectPreset(preset)}
              className="p-3 rounded-2xl bg-slate-950/90 border border-slate-800 hover:border-orange-500/50 text-left transition-all group flex flex-col justify-between gap-2"
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">{preset.avatar}</span>
                <div>
                  <h4 className="font-bold text-white text-xs font-outfit group-hover:text-orange-400 transition-colors">
                    {preset.developerName}
                  </h4>
                  <p className="text-[10px] text-slate-500 line-clamp-1">{preset.archetype}</p>
                </div>
              </div>
              <span className="text-[9px] text-orange-400 font-bold flex items-center gap-1 self-end">
                <span>Load Sample</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Form Inputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name & URL */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-orange-400" />
                Developer / Designer Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Rivera"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-orange-400" />
                Portfolio Live URL / Domain
              </label>
              <input
                type="text"
                value={portfolioUrl}
                onChange={(e) => setPortfolioUrl(e.target.value)}
                placeholder="https://yourportfolio.dev"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 font-mono"
              />
            </div>
          </div>

          {/* Bio Snippet */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-orange-400" />
              Hero Tagline &amp; About Section Bio
            </label>
            <textarea
              rows={4}
              value={bioText}
              onChange={(e) => setBioText(e.target.value)}
              placeholder="Paste your current hero tagline or about section..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 font-mono leading-relaxed"
            />
          </div>
        </div>

        {/* Featured Projects Textarea */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-orange-400" />
            Featured Projects &amp; Tech Stack Summary (1 per line)
          </label>
          <textarea
            rows={3}
            value={projectsText}
            onChange={(e) => setProjectsText(e.target.value)}
            placeholder="List your top 3-4 projects and technologies used..."
            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 font-mono leading-relaxed"
          />
        </div>

        {/* Intensity Picker */}
        <IntensityPicker intensity={intensity} onChange={setIntensity} />

        {/* Submit Roast CTA */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-500 via-red-600 to-amber-500 text-black font-black text-sm tracking-wide font-outfit hover:opacity-95 transition-all shadow-xl shadow-orange-500/20 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Flame className={`w-5 h-5 fill-black ${isLoading ? 'animate-bounce' : ''}`} />
            <span>
              {isLoading
                ? 'AI IS BRUTALLY DISSECTING YOUR PORTFOLIO...'
                : `ROAST MY PORTFOLIO (${intensity.toUpperCase()} MODE)`}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}
