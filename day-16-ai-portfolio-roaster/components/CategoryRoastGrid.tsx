'use client';

import { CategoryRoast, RoastResult } from '@/types';
import { Palette, Layers, UserCheck, Smartphone, Briefcase, AlertTriangle, CheckCircle2, Wrench } from 'lucide-react';

interface Props {
  categories: RoastResult['categories'];
}

export default function CategoryRoastGrid({ categories }: Props) {
  const categoryConfig: {
    key: keyof RoastResult['categories'];
    title: string;
    icon: any;
    color: string;
    barColor: string;
  }[] = [
    {
      key: 'design',
      title: '1. Visual Design & Typography Hierarchy',
      icon: Palette,
      color: 'text-orange-400',
      barColor: 'bg-orange-500',
    },
    {
      key: 'projects',
      title: '2. Project Impressiveness & Architectural Depth',
      icon: Layers,
      color: 'text-amber-400',
      barColor: 'bg-amber-500',
    },
    {
      key: 'aboutBio',
      title: '3. About Section Bio & Cringe-Factor Analysis',
      icon: UserCheck,
      color: 'text-rose-400',
      barColor: 'bg-rose-500',
    },
    {
      key: 'uxAndSpeed',
      title: '4. UX Usability, Navigation & Performance',
      icon: Smartphone,
      color: 'text-teal-400',
      barColor: 'bg-teal-500',
    },
    {
      key: 'recruiterAppeal',
      title: '5. Recruiter Appeal & ATS Hireability Benchmark',
      icon: Briefcase,
      color: 'text-indigo-400',
      barColor: 'bg-indigo-500',
    },
  ];

  return (
    <div className="space-y-6 font-mono text-xs text-slate-300">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-white font-outfit flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-orange-400" />
          5-Dimension Savage Critique &amp; Refactor Blueprints
        </h3>
        <span className="text-[10px] text-slate-500">Every roast includes an engineering fix</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categoryConfig.map((item) => {
          const cat = categories[item.key] as CategoryRoast;
          const Icon = item.icon;

          return (
            <div
              key={item.key}
              className="p-6 rounded-3xl bg-[#0f1420] border border-slate-800 hover:border-slate-700 transition-all space-y-4 shadow-xl flex flex-col justify-between"
            >
              {/* Header */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">
                      <Icon className={`w-4 h-4 ${item.color}`} />
                    </div>
                    <h4 className="font-bold text-white text-xs font-outfit">{item.title}</h4>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black font-outfit text-white">
                      {cat.score}
                      <span className="text-slate-500 text-[10px]">/100</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-lg bg-slate-950 border border-slate-800 text-[10px] font-bold text-orange-400">
                      {cat.grade}
                    </span>
                  </div>
                </div>

                {/* Score Bar */}
                <div className="w-full h-1.5 rounded-full bg-slate-950 overflow-hidden">
                  <div
                    className={`h-full ${item.barColor} transition-all duration-500`}
                    style={{ width: `${cat.score}%` }}
                  />
                </div>

                {/* The Savage Roast Text */}
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1">
                  <span className="text-[9px] font-bold uppercase text-orange-400 flex items-center gap-1">
                    <span>🔥 The Roast:</span>
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed font-sans font-medium">{cat.roast}</p>
                </div>

                {/* Key Detected Issues */}
                {cat.keyIssues && cat.keyIssues.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[9px] font-bold uppercase text-slate-500">Detected Sins:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {cat.keyIssues.map((issue, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-[10px]"
                        >
                          ⚠️ {issue}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Actionable Engineering Fix Blueprint */}
              <div className="p-3.5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-1.5 mt-2">
                <span className="text-[9px] font-bold uppercase text-emerald-400 flex items-center gap-1">
                  <Wrench className="w-3 h-3" />
                  <span>Actionable Refactor Fix:</span>
                </span>
                <p className="text-[11px] text-emerald-100/90 leading-relaxed font-sans">{cat.actionableTip}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
