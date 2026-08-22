'use client';

import { useMemo } from 'react';
import { LoadProfileType } from '@/types';

interface Props {
  vus: number;
  duration: number;
  profile: LoadProfileType;
}

export default function InteractiveWaveformPreview({ vus, duration, profile }: Props) {
  const points = useMemo(() => {
    const width = 340;
    const height = 90;
    const padding = 10;
    const usableWidth = width - padding * 2;
    const usableHeight = height - padding * 2;

    const coords: { x: number; y: number }[] = [];
    const steps = 30;

    for (let i = 0; i <= steps; i++) {
      const progress = i / steps;
      const x = padding + progress * usableWidth;
      let vuRatio = 0;

      if (profile === 'ramping_spike') {
        if (progress < 0.25) {
          vuRatio = progress / 0.25;
        } else if (progress < 0.75) {
          vuRatio = 1;
        } else {
          vuRatio = 1 - (progress - 0.75) / 0.25;
        }
      } else if (profile === 'constant') {
        vuRatio = 1;
      } else if (profile === 'stress') {
        if (progress < 0.33) vuRatio = 0.33;
        else if (progress < 0.66) vuRatio = 0.66;
        else vuRatio = 1.0;
      } else if (profile === 'soak') {
        vuRatio = 0.8;
      }

      // Invert y because SVG y goes downwards
      const y = height - padding - vuRatio * usableHeight;
      coords.push({ x, y });
    }

    const pathData = coords.reduce((acc, pt, idx) => {
      return idx === 0 ? `M ${pt.x},${pt.y}` : `${acc} L ${pt.x},${pt.y}`;
    }, '');

    const areaData = `${pathData} L ${coords[coords.length - 1].x},${height - padding} L ${coords[0].x},${height - padding} Z`;

    return { pathData, areaData, maxVus: vus };
  }, [vus, duration, profile]);

  return (
    <div className="p-4 rounded-2xl bg-[#060b13] border border-cyan-500/20 space-y-2 font-mono">
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-400 font-bold flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          Live Traffic Curve Model
        </span>
        <span className="text-cyan-400 font-black">
          {vus} VUs • {duration}s
        </span>
      </div>

      <div className="relative w-full h-24 flex items-center justify-center overflow-hidden rounded-xl bg-[#09101c]/80 border border-white/5">
        <svg
          viewBox="0 0 340 90"
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1="10" y1="20" x2="330" y2="20" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
          <line x1="10" y1="50" x2="330" y2="50" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
          <line x1="10" y1="80" x2="330" y2="80" stroke="rgba(255,255,255,0.1)" />

          {/* Area Fill */}
          <path d={points.areaData} fill="url(#waveGradient)" />

          {/* Line Stroke */}
          <path
            d={points.pathData}
            fill="none"
            stroke="#22d3ee"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {/* Floating peak indicator */}
        <div className="absolute top-2 right-3 text-[10px] text-cyan-300 font-bold bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
          Peak: {vus} Concurrent VUs
        </div>
      </div>
    </div>
  );
}
