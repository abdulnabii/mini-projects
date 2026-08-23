'use client';

import { Flame, TrendingUp, Sparkles, ArrowRight, Zap, Layers } from 'lucide-react';
import { TwitterIcon, LinkedInIcon } from './PlatformIcons';

export interface TrendingTopic {
  id: string;
  category: string;
  title: string;
  topicPrompt: string;
  velocity: string;
  viralScore: number;
  bestPlatform: 'twitter' | 'linkedin' | 'carousel';
}

export const TRENDING_TOPICS: TrendingTopic[] = [
  {
    id: 'trend_1',
    category: 'AI & Full-Stack',
    title: 'Autonomous Coding Agents vs Senior Devs in 2026',
    topicPrompt: 'Why AI coding agents won’t replace Senior Engineers, but will turn 1-person teams into 10-person startups. Here is the new developer skill tree:',
    velocity: '+14.2k shares',
    viralScore: 96,
    bestPlatform: 'twitter',
  },
  {
    id: 'trend_2',
    category: 'System Architecture',
    title: 'Edge Replicas & Local SQLite vs Heavy RDS Cloud DBs',
    topicPrompt: 'Why we dropped AWS RDS and moved our entire production database to Turso SQLite edge replicas: 78% lower bills and 14ms global latency.',
    velocity: '+9.8k shares',
    viralScore: 94,
    bestPlatform: 'linkedin',
  },
  {
    id: 'trend_3',
    category: 'Engineering Best Practices',
    title: '7 Code Smells Every Junior Ignores Until Outages Occur',
    topicPrompt: '7 subtle code smells that look clean in code reviews but cause massive production memory leaks at scale (Swipe to fix ➡️)',
    velocity: '+18.5k shares',
    viralScore: 98,
    bestPlatform: 'carousel',
  },
  {
    id: 'trend_4',
    category: 'Bootstrapping & SaaS',
    title: 'How I Hit $10k MRR with Zero Employees and Next.js',
    topicPrompt: 'The raw breakdown of my solo SaaS reaching $10,000 MRR in 6 months: Stack, pricing psychology, customer acquisition channels, and failed experiments.',
    velocity: '+12.1k shares',
    viralScore: 93,
    bestPlatform: 'twitter',
  },
  {
    id: 'trend_5',
    category: 'Backend & High-Performance',
    title: 'Rust vs Go in 2026: When to Pick Which',
    topicPrompt: 'We benchmarked Rust and Go under 100,000 concurrent websocket connections. Here are the throughput results and developer velocity trade-offs:',
    velocity: '+8.4k shares',
    viralScore: 91,
    bestPlatform: 'linkedin',
  },
];

interface Props {
  onSelectTopic: (topic: TrendingTopic) => void;
}

export default function TrendingTopicsRadar({ onSelectTopic }: Props) {
  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-[#0d1117] border border-orange-500/30 shadow-2xl space-y-6 font-mono">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base font-outfit">
              Trending Tech Topics &amp; Viral Angle Radar
            </h3>
            <p className="text-xs text-slate-400">
              High-engagement developer discussions with proven algorithmic traction
            </p>
          </div>
        </div>

        <span className="text-[10px] text-orange-300 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 font-bold flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5" />
          <span>Curated Weekly Algorithmic Triggers</span>
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {TRENDING_TOPICS.map((topic) => {
          return (
            <div
              key={topic.id}
              className="p-5 rounded-2xl bg-[#161b22] border border-slate-800 hover:border-orange-500/40 transition-all space-y-3 flex flex-col justify-between group shadow-lg"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[10px] text-orange-400 font-bold">
                    {topic.category}
                  </span>

                  <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>{topic.velocity}</span>
                  </span>
                </div>

                <h4 className="font-bold text-white text-sm font-outfit group-hover:text-orange-300 transition-colors">
                  {topic.title}
                </h4>

                <p className="text-xs text-slate-300 font-sans line-clamp-3 leading-relaxed">
                  "{topic.topicPrompt}"
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                <span className="text-[10px] text-slate-400 font-mono">
                  Viral Score: <strong className="text-emerald-400">{topic.viralScore}/100</strong>
                </span>

                <button
                  type="button"
                  onClick={() => onSelectTopic(topic)}
                  className="px-3 py-1.5 rounded-xl bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <span>Write on This</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
