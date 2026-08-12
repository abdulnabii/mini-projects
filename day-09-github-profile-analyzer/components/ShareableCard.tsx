'use client';

import { GitHubProfileData } from '@/types';
import { Download, Share2, Check, Sparkles } from 'lucide-react';
import { useState } from 'react';

interface Props {
  profile: GitHubProfileData;
}

export default function ShareableCard({ profile }: Props) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [downloadingCard, setDownloadingCard] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleDownloadCard = () => {
    setDownloadingCard(true);
    setTimeout(() => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(profile, null, 2));
      const anchor = document.createElement('a');
      anchor.setAttribute("href", dataStr);
      anchor.setAttribute("download", `gitpulse-${profile.username}-profile.json`);
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      setDownloadingCard(false);
    }, 1000);
  };

  return (
    <div className="bg-[#161b22] border border-emerald-500/20 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl font-mono">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Share2 className="w-5 h-5 text-emerald-400" />
            Shareable Developer Card &amp; Export
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Export developer profile insights card or share directly with your network.
          </p>
        </div>
      </div>

      {/* Shareable Card Container */}
      <div className="p-6 rounded-2xl bg-[#0d1117] border border-emerald-500/30 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={profile.avatarUrl} alt={profile.username} className="w-12 h-12 rounded-xl object-cover border border-emerald-500/40" />
            <div>
              <span className="font-bold text-white text-base block">{profile.name}</span>
              <span className="text-emerald-400 text-xs block">@{profile.username} • {profile.persona.archetype}</span>
            </div>
          </div>
          <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold tabular-nums">
            {profile.currentStreakDays}🔥 Streak
          </div>
        </div>

        <p className="text-xs text-slate-300 italic leading-relaxed border-l-2 border-emerald-500 pl-3">
          &quot;{profile.persona.summary}&quot;
        </p>

        <div className="flex flex-wrap gap-2 text-[10px]">
          {profile.languages.slice(0, 4).map((lang) => (
            <span key={lang.language} className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300">
              {lang.language}: {lang.percentage}%
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleDownloadCard}
          disabled={downloadingCard}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          <span>{downloadingCard ? 'Exporting Profile Card...' : 'Download Profile JSON / Card'}</span>
        </button>

        <button
          onClick={handleCopyLink}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-emerald-500/50 text-xs transition-all"
        >
          {copiedLink ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400">Link Copied!</span>
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4" />
              <span>Copy Shareable URL</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
