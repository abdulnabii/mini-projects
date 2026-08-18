'use client';

import { useState } from 'react';
import { INITIAL_HALL_OF_FAME } from '@/lib/storage';
import { Trophy, Skull, Flame, ExternalLink, Award, ArrowUpRight } from 'lucide-react';

export default function HallGallery() {
  const [filter, setFilter] = useState<'all' | 'fame' | 'shame'>('all');

  const filteredItems = INITIAL_HALL_OF_FAME.filter((item) => {
    if (filter === 'fame') return !item.isShame;
    if (filter === 'shame') return item.isShame;
    return true;
  });

  return (
    <div className="space-y-6 font-mono text-xs text-slate-300">
      {/* Filter Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base font-outfit">Hall of Fame &amp; Hall of Shame</h3>
            <p className="text-xs text-slate-400">Community showcase of pristine developer portfolios vs. hilarious roast survivors</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-xl border font-bold transition-all ${
              filter === 'all'
                ? 'bg-orange-500/10 border-orange-500 text-orange-300'
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            All Submissions
          </button>
          <button
            type="button"
            onClick={() => setFilter('fame')}
            className={`px-3 py-1.5 rounded-xl border font-bold transition-all flex items-center gap-1 ${
              filter === 'fame'
                ? 'bg-emerald-500/10 border-emerald-500 text-emerald-300'
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Hall of Fame</span>
          </button>
          <button
            type="button"
            onClick={() => setFilter('shame')}
            className={`px-3 py-1.5 rounded-xl border font-bold transition-all flex items-center gap-1 ${
              filter === 'shame'
                ? 'bg-rose-500/10 border-rose-500 text-rose-300'
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            <Skull className="w-3.5 h-3.5 text-rose-400" />
            <span>Hall of Shame</span>
          </button>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className={`p-6 rounded-3xl border transition-all flex flex-col justify-between gap-4 shadow-xl ${
              item.isShame
                ? 'bg-[#0f1420] border-rose-500/30 hover:border-rose-500/60'
                : 'bg-[#0f1420] border-emerald-500/30 hover:border-emerald-500/60'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                    item.isShame
                      ? 'bg-rose-500/10 text-rose-300 border border-rose-500/30'
                      : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                  }`}
                >
                  {item.isShame ? <Skull className="w-3.5 h-3.5 text-rose-400" /> : <Trophy className="w-3.5 h-3.5 text-amber-400" />}
                  <span>{item.badge}</span>
                </span>

                <div className="flex items-center gap-1">
                  <span className="text-xl font-black font-outfit text-white">{item.score}</span>
                  <span className="text-slate-500 text-[10px]">/100</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-white text-base font-outfit">{item.name}</h4>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-slate-500 hover:text-orange-400 flex items-center gap-1 mt-0.5"
                >
                  <span>{item.url}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <p className="text-xs text-slate-300 font-sans leading-relaxed italic bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
                &quot;{item.verdict}&quot;
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
