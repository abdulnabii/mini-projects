'use client';

import { useState } from 'react';
import { RoastIntensity, SamplePortfolioPreset } from '@/types';
import { SAMPLE_PORTFOLIOS } from '@/lib/samplePortfolios';
import IntensityPicker from './IntensityPicker';
import { Flame, Sparkles, Globe, User, BookOpen, Layers, Zap, ArrowRight, Check, AlertCircle } from 'lucide-react';

interface Props {
  onRoast: (
    name: string,
    portfolioUrl: string,
    bioText: string,
    projectsText: string,
    intensity: RoastIntensity,
    githubData?: any
  ) => void;
  isLoading: boolean;
}

const GithubIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12z" />
  </svg>
);

export default function PortfolioInput({ onRoast, isLoading }: Props) {
  const [githubUrlInput, setGithubUrlInput] = useState<string>('');
  const [isFetchingGithub, setIsFetchingGithub] = useState<boolean>(false);
  const [fetchedGithub, setFetchedGithub] = useState<any | null>(null);
  const [githubError, setGithubError] = useState<string | null>(null);

  const [name, setName] = useState<string>('Alex Rivera');
  const [portfolioUrl, setPortfolioUrl] = useState<string>('https://alex-rivera-portfolio.dev');
  const [bioText, setBioText] = useState<string>(
    'I am an aspiring, passionate software engineer who loves coding 24/7! Fast learner, team player, and always hungry for new tech challenges.'
  );
  const [projectsText, setProjectsText] = useState<string>(
    '1. Todo List App (React, LocalStorage)\n2. Weather App (OpenWeatherMap API)\n3. Basic Calculator (HTML, CSS, JS)\n4. Netflix Clone (Frontend only)'
  );
  const [intensity, setIntensity] = useState<RoastIntensity>('spicy');

  const handleFetchGithub = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!githubUrlInput.trim()) return;

    setIsFetchingGithub(true);
    setGithubError(null);

    try {
      const res = await fetch('/api/github-fetch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ githubInput: githubUrlInput }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setGithubError(data.error || 'Failed to fetch GitHub profile');
        return;
      }

      setFetchedGithub(data);
      setName(data.name);
      setPortfolioUrl(data.blog || `https://github.com/${data.username}`);
      setBioText(data.bio);
      setProjectsText(data.formattedProjectsText);
    } catch (err) {
      console.error('Error fetching GitHub:', err);
      setGithubError('Network error connecting to GitHub API');
    } finally {
      setIsFetchingGithub(false);
    }
  };

  const handleSelectPreset = (p: SamplePortfolioPreset) => {
    setFetchedGithub(null);
    setName(p.developerName);
    setPortfolioUrl(p.portfolioUrl);
    setBioText(p.bioSnippet);
    setProjectsText(p.projectsList.join('\n'));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() && !portfolioUrl.trim() && !bioText.trim()) return;
    onRoast(name, portfolioUrl, bioText, projectsText, intensity, fetchedGithub);
  };

  return (
    <div className="space-y-6 font-mono text-xs text-slate-300">
      {/* GitHub Live Profile Fetcher Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-950 via-[#0a0f1d] to-slate-950 border-2 border-orange-500/40 space-y-3 shadow-xl">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <label className="text-[11px] font-bold text-white flex items-center gap-2">
            <GithubIcon className="w-4 h-4 text-orange-400" />
            <span>Instant GitHub Profile &amp; Repository Analysis</span>
          </label>
          <span className="text-[10px] text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-full border border-orange-500/30 font-bold">
            Live GitHub API v3
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2">
          <div className="relative flex-1 w-full">
            <input
              type="text"
              value={githubUrlInput}
              onChange={(e) => setGithubUrlInput(e.target.value)}
              placeholder="Paste GitHub Profile (e.g. github.com/abdulnabii or username)"
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
            />
            <div className="absolute left-3 top-3 text-slate-500">
              <GithubIcon className="w-4 h-4" />
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleFetchGithub()}
            disabled={isFetchingGithub || !githubUrlInput.trim()}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black font-bold text-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50 shrink-0 shadow-lg shadow-orange-500/20 cursor-pointer"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isFetchingGithub ? 'animate-spin' : ''}`} />
            <span>{isFetchingGithub ? 'Analyzing GitHub...' : 'Fetch GitHub Profile'}</span>
          </button>
        </div>

        {/* Error message */}
        {githubError && (
          <div className="flex items-center gap-1.5 text-rose-400 text-[11px] pt-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{githubError}</span>
          </div>
        )}

        {/* Fetched GitHub Profile Card */}
        {fetchedGithub && (
          <div className="p-3.5 rounded-xl bg-[#080d17] border border-emerald-500/40 flex items-center justify-between flex-wrap gap-3 animate-in fade-in duration-300">
            <div className="flex items-center gap-3">
              <img
                src={fetchedGithub.avatarUrl}
                alt={fetchedGithub.name}
                className="w-10 h-10 rounded-full border border-emerald-500"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white font-outfit text-sm">{fetchedGithub.name}</span>
                  <span className="text-slate-400 text-[10px]">@{fetchedGithub.username}</span>
                </div>
                <p className="text-[10px] text-slate-400 line-clamp-1">{fetchedGithub.bio}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-[10px]">
              <span className="px-2 py-0.5 rounded-lg bg-slate-900 text-slate-300">
                📦 {fetchedGithub.publicRepos} Repos
              </span>
              <span className="px-2 py-0.5 rounded-lg bg-slate-900 text-slate-300">
                👥 {fetchedGithub.followers} Followers
              </span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Data Synced!
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 2. Viral Archetype Presets */}
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
              className="p-3 rounded-2xl bg-slate-950/90 border border-slate-800 hover:border-orange-500/50 text-left transition-all group flex flex-col justify-between gap-2 cursor-pointer"
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
                ? 'AI IS BRUTALLY DISSECTING YOUR PORTFOLIO & GITHUB...'
                : `ROAST MY PORTFOLIO (${intensity.toUpperCase()} MODE)`}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}
