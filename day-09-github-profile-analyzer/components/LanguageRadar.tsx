'use client';

import { LanguageStat } from '@/types';
import { Dna, Code2, Layers } from 'lucide-react';

interface Props {
  languages: LanguageStat[];
}

export default function LanguageRadar({ languages }: Props) {
  // Normalize top 5 languages into pentagonal chart
  const topLangs = languages.slice(0, 5);
  const angles = [0, 72, 144, 216, 288];

  const W = 220;
  const H = 220;
  const CX = W / 2;
  const CY = H / 2;
  const R = 75;

  const points = topLangs.map((l, i) => {
    const angleRad = ((angles[i] - 90) * Math.PI) / 180;
    const dist = R * (Math.max(l.percentage, 15) / 100);
    const x = CX + dist * Math.cos(angleRad);
    const y = CY + dist * Math.sin(angleRad);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const polygonPath = points.length >= 3 ? points.join(' ') : null;

  return (
    <div className="bg-[#161b22] border border-emerald-500/20 rounded-3xl p-6 space-y-5 font-mono">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Dna className="w-4 h-4 text-emerald-400" />
          Language DNA &amp; Skill Radar
        </h3>
        <span className="text-xs text-slate-400">{languages.length} Primary Languages</span>
      </div>

      {/* SVG Poly-Radar Chart */}
      {topLangs.length >= 3 && (
        <div className="flex items-center justify-center p-2">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-48 h-48 drop-shadow-xl">
            {/* Concentric Pentagons */}
            <polygon points="110,35 181,87 154,170 66,170 39,87" fill="none" stroke="#1e293b" strokeWidth="1.5" />
            <polygon points="110,60 157,94 139,150 81,150 63,94" fill="none" stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />
            <polygon points="110,85 133,102 124,130 96,130 87,102" fill="none" stroke="#1e293b" strokeWidth="1" strokeDasharray="2 2" />

            {/* Radar Polygon */}
            {polygonPath && (
              <polygon
                points={polygonPath}
                fill="rgba(16, 185, 129, 0.25)"
                stroke="#10b981"
                strokeWidth="2"
              />
            )}

            {/* Language Dots & Labels */}
            {topLangs.map((l, i) => {
              const angleRad = ((angles[i] - 90) * Math.PI) / 180;
              const dist = R * (Math.max(l.percentage, 15) / 100);
              const x = CX + dist * Math.cos(angleRad);
              const y = CY + dist * Math.sin(angleRad);
              return (
                <circle key={i} cx={x} cy={y} r="3.5" fill={l.color || '#10b981'} stroke="#fff" strokeWidth="1" />
              );
            })}
          </svg>
        </div>
      )}

      {/* Language Breakdown Bars */}
      <div className="space-y-3.5 pt-2">
        {languages.map((lang) => (
          <div key={lang.language} className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: lang.color }} />
                <span className="font-bold text-white">{lang.language}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-slate-400 text-[10px] tabular-nums">{(lang.bytes / 1000).toFixed(0)} KB</span>
                <span className="font-bold text-emerald-400 tabular-nums">{lang.percentage}%</span>
              </div>
            </div>

            <div className="w-full h-2 bg-[#0d1117] rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${lang.percentage}%`, backgroundColor: lang.color }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
