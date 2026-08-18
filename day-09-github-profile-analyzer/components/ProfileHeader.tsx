'use client';

import { GitHubProfileData } from '@/types';
import { MapPin, Building, Users, Flame, GitCommit, ExternalLink, Award, Sparkles, Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface Props {
  profile: GitHubProfileData;
}

export default function ProfileHeader({ profile }: Props) {
  const [copied, setCopied] = useState(false);

  // Compute Overall Developer Tier
  const totalStars = profile.repos.reduce((acc, r) => acc + r.stars, 0);
  const getDeveloperTier = () => {
    if (totalStars > 100 || profile.totalCommitsPastYear > 500) return { tier: 'S-TIER', label: 'High-Impact Core Builder', color: 'bg-amber-500/10 border-amber-500 text-amber-400' };
    if (profile.totalCommitsPastYear > 150) return { tier: 'A-TIER', label: 'Consistent Production Engineer', color: 'bg-emerald-500/10 border-emerald-500 text-emerald-400' };
    return { tier: 'B-TIER', label: 'Active Developer', color: 'bg-sky-500/10 border-sky-500 text-sky-400' };
  };

  const devTier = getDeveloperTier();

  const handleCopyProfile = () => {
    navigator.clipboard.writeText(`https://github.com/${profile.username}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#161b22] border border-emerald-500/20 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl font-mono">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <img
            src={profile.avatarUrl}
            alt={profile.username}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-2 border-emerald-500/40 shadow-xl object-cover"
          />
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-outfit">{profile.name}</h2>
              <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold ${devTier.color}`}>
                {devTier.tier} • {devTier.label}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-emerald-400 text-sm font-bold block">@{profile.username}</span>
              <a
                href={`https://github.com/${profile.username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-emerald-400 transition-colors p-1"
                title="Open GitHub Profile"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                type="button"
                onClick={handleCopyProfile}
                className="text-slate-500 hover:text-slate-300 transition-colors p-1"
                title="Copy GitHub Link"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <p className="text-slate-300 text-xs max-w-xl leading-relaxed font-sans">{profile.bio}</p>

            <div className="flex flex-wrap gap-4 pt-1 text-xs text-slate-400">
              {profile.company && (
                <span className="flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-slate-500" />
                  {profile.company}
                </span>
              )}
              {profile.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  {profile.location}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Streak & Commit Badges */}
        <div className="flex flex-wrap md:flex-col gap-3 w-full md:w-auto">
          <div className="flex-1 md:flex-initial px-4 py-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center gap-3">
            <Flame className="w-6 h-6 shrink-0 fill-amber-400" />
            <div>
              <span className="text-lg font-bold block tabular-nums">{profile.currentStreakDays}🔥 Days</span>
              <span className="text-[10px] text-slate-400 uppercase block">Current Commit Streak</span>
            </div>
          </div>

          <div className="flex-1 md:flex-initial px-4 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-3">
            <GitCommit className="w-6 h-6 shrink-0" />
            <div>
              <span className="text-lg font-bold block tabular-nums">{profile.totalCommitsPastYear}</span>
              <span className="text-[10px] text-slate-400 uppercase block">Commits Past Year</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800 text-xs">
        <div className="p-3 rounded-xl bg-[#0d1117] border border-slate-800">
          <span className="text-slate-500 text-[10px] uppercase block">Public Repos</span>
          <span className="text-white font-bold text-base tabular-nums">{profile.publicRepos}</span>
        </div>
        <div className="p-3 rounded-xl bg-[#0d1117] border border-slate-800">
          <span className="text-slate-500 text-[10px] uppercase block">Followers</span>
          <span className="text-white font-bold text-base tabular-nums">{profile.followers}</span>
        </div>
        <div className="p-3 rounded-xl bg-[#0d1117] border border-slate-800">
          <span className="text-slate-500 text-[10px] uppercase block">Night Owl Ratio</span>
          <span className="text-emerald-400 font-bold text-base tabular-nums">{profile.nightOwlPercentage}%</span>
        </div>
        <div className="p-3 rounded-xl bg-[#0d1117] border border-slate-800">
          <span className="text-slate-500 text-[10px] uppercase block">Unique Collaborators</span>
          <span className="text-sky-400 font-bold text-base tabular-nums">{profile.uniqueCollaborators}</span>
        </div>
      </div>
    </div>
  );
}
