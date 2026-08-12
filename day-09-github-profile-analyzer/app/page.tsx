'use client';

import { useEffect, useState } from 'react';
import { GitHubProfileData } from '@/types';
import ProfileHeader from '@/components/ProfileHeader';
import LanguageRadar from '@/components/LanguageRadar';
import ImpactScoreList from '@/components/ImpactScoreList';
import ContributionHeatmap from '@/components/ContributionHeatmap';
import PersonaCard from '@/components/PersonaCard';
import ShareableCard from '@/components/ShareableCard';
import { Search, Sparkles, Loader2, GitBranch, ArrowRight } from 'lucide-react';

const PRESET_USERS = [
  { username: 'abdulnabii', label: 'Abdul Nabi (AI Dev)' },
  { username: 'torvalds', label: 'Linus Torvalds (Linux)' },
  { username: 'gaearon', label: 'Dan Abramov (React)' },
];

export default function Home() {
  const [searchUsername, setSearchUsername] = useState('');
  const [profile, setProfile] = useState<GitHubProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Load default profile on initial mount
    fetchProfile('abdulnabii');
  }, []);

  const fetchProfile = async (targetUser: string) => {
    if (!targetUser.trim()) return;
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: targetUser.trim() }),
      });

      if (!res.ok) throw new Error('Failed to analyze profile');

      const data: GitHubProfileData = await res.json();
      setProfile(data);
      setSearchUsername(targetUser);
    } catch (err: unknown) {
      console.error('Fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch GitHub profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProfile(searchUsername);
  };

  return (
    <div className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full space-y-10 font-mono">
      {/* Header Title */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Developer Portfolio &amp; Impact Engine</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          Analyze Any <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-sky-400">GitHub Profile</span>
        </h1>
        <p className="text-slate-400 text-sm sm:text-base">
          Repository impact scores, language DNA radar, 52-week contribution heatmap, and AI developer persona synthesis.
        </p>
      </div>

      {/* Search Bar & Preset Quick-Select */}
      <div className="max-w-3xl mx-auto space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-500 absolute left-4 top-3.5" />
            <input
              type="text"
              value={searchUsername}
              onChange={(e) => setSearchUsername(e.target.value)}
              placeholder="Enter public GitHub username (e.g. torvalds or abdulnabii)..."
              className="w-full bg-[#161b22] border border-emerald-500/30 rounded-2xl pl-12 pr-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-400 transition-colors shadow-xl"
            />
          </div>
          <button
            type="submit"
            disabled={!searchUsername.trim() || isLoading}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-black font-bold text-sm transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <span>Analyze Profile</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
          <span className="text-[10px] uppercase text-slate-500 font-bold">Try Preset Profiles:</span>
          {PRESET_USERS.map((preset) => (
            <button
              key={preset.username}
              onClick={() => fetchProfile(preset.username)}
              disabled={isLoading}
              className="px-3 py-1 rounded-full bg-[#161b22] border border-slate-800 text-emerald-400 hover:border-emerald-500/50 hover:text-white transition-all text-xs"
            >
              ⚡ {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading Indicator */}
      {isLoading && (
        <div className="max-w-md mx-auto bg-[#161b22] border border-emerald-500/20 rounded-3xl p-8 text-center space-y-4 animate-pulse">
          <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white">Fetching GitHub Data &amp; Synthesizing Persona...</h3>
            <p className="text-xs text-slate-400">Evaluating repository impact metrics and language distribution.</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="max-w-2xl mx-auto p-4 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-rose-400 text-center text-xs">
          {error}
        </div>
      )}

      {/* Profile Dashboard Results */}
      {profile && !isLoading && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <ProfileHeader profile={profile} />

          <PersonaCard persona={profile.persona} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <ImpactScoreList repos={profile.repos} />
            </div>
            <div>
              <LanguageRadar languages={profile.languages} />
            </div>
          </div>

          <ContributionHeatmap
            contributions={profile.contributions}
            totalCommits={profile.totalCommitsPastYear}
          />

          <ShareableCard profile={profile} />
        </div>
      )}
    </div>
  );
}
