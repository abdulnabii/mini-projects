'use client';

import {
  Code,
  ShieldCheck,
  Cpu,
  Layers,
  Sparkles,
  Database,
  BarChart2,
} from 'lucide-react';

export default function EngineeringHighlights() {
  const highlights = [
    {
      number: '01',
      title: 'Statistical Engine',
      icon: BarChart2,
      color: 'emerald',
      description:
        'Built a pure TypeScript client-side statistical profiling engine with IQR anomaly detection (lower/upper fences) and Pearson correlation coefficient calculation. Zero dependency on black-box heuristics.',
    },
    {
      number: '02',
      title: 'AI Grounding Architecture',
      icon: ShieldCheck,
      color: 'cyan',
      description:
        'AI insights and Q&A operate on pre-computed local statistical facts and aggregations. The LLM acts as an executive interpreter rather than a hallucinated source of numerical truth.',
    },
    {
      number: '03',
      title: 'WebGL Performance',
      icon: Cpu,
      color: 'purple',
      description:
        'Optimized Three.js rendering using instanced geometries, memoized vector coordinates, throttled raycasting, and strict lifecycle disposal to prevent memory leaks.',
    },
    {
      number: '04',
      title: 'Multi-Modal Analytics',
      icon: Layers,
      color: 'amber',
      description:
        'Seamlessly transition between 3D spatial exploration, 2D analytical charts, and exact tabular data with synchronized filtering and dimension mapping.',
    },
  ];

  return (
    <div className="p-6 rounded-2xl bg-[#0d1527] border border-[#1e293b] shadow-xl space-y-4 font-mono">
      <div className="flex items-center gap-2 border-b border-[#1e293b] pb-3">
        <Code className="w-4 h-4 text-emerald-400" />
        <h3 className="text-xs font-bold text-white uppercase tracking-wider">
          Engineering Highlights &amp; System Architecture
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {highlights.map((h) => {
          const Icon = h.icon;
          return (
            <div
              key={h.number}
              className="p-4 rounded-xl bg-[#111827] border border-[#1e293b] hover:border-slate-700 transition-all space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 font-mono">
                  {h.number}
                </span>
                <Icon className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
              </div>
              <h4 className="text-xs font-bold text-white font-mono">
                {h.title}
              </h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {h.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
