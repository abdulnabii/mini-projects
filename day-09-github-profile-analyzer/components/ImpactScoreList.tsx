'use client';

import { RankedRepository } from '@/types';
import { Trophy, Star, GitFork, TrendingUp, ExternalLink, CheckCircle2 } from 'lucide-react';

interface Props {
  repos: RankedRepository[];
}

export default function ImpactScoreList({ repos }: Props) {
  return (
    <div className="bg-[#161b22] border border-emerald-500/20 rounded-3xl p-6 sm:p-8 space-y-6 font-mono">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            Impact Score Repository Rankings
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Ranked by composite metric: stars, forks, issues, readme docs, and growth momentum.
          </p>
        </div>
        <span className="text-xs text-emerald-400 font-bold">Top {repos.length} Repos</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {repos.map((repo, idx) => {
          let scoreBadge = 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10';
          if (repo.impactScore >= 90) scoreBadge = 'border-amber-500/40 text-amber-400 bg-amber-500/10';

          return (
            <div
              key={repo.name}
              className="bg-[#0d1117] border border-slate-800 rounded-2xl p-5 space-y-4 group hover:border-emerald-500/40 transition-all flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-slate-500 uppercase font-bold">Rank #{idx + 1}</span>
                    <a
                      href={repo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                    >
                      <span>{repo.name}</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                    </a>
                  </div>

                  <div className={`px-3 py-1 rounded-xl border text-xs font-bold font-mono tabular-nums ${scoreBadge}`}>
                    Score: {repo.impactScore}/100
                  </div>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{repo.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1 text-amber-400 font-bold tabular-nums">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    {repo.stars}
                  </span>
                  <span className="flex items-center gap-1 text-slate-300 tabular-nums">
                    <GitFork className="w-3.5 h-3.5" />
                    {repo.forks}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-sky-400">
                    {repo.primaryLanguage}
                  </span>
                </div>

                {repo.momentum === 'rising' && (
                  <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30">
                    <TrendingUp className="w-3 h-3" />
                    🚀 Rising
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
