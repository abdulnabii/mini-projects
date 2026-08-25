'use client';

import { useState } from 'react';
import { DatasetAnalysis } from '@/types';
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Bookmark,
  Check,
  Compass,
  FileText,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  analysis: DatasetAnalysis;
  onSaveToGallery?: () => void;
}

export default function NarrativePanel({ analysis, onSaveToGallery }: Props) {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (onSaveToGallery) onSaveToGallery();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    confetti({
      particleCount: 25,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#10b981', '#06b6d4'],
    });
  };

  return (
    <div className="p-6 sm:p-8 rounded-2xl bg-[#0d1117] border border-slate-800 shadow-xl space-y-6 font-mono">
      {/* Header & Save Trigger */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-white text-sm font-mono">
                AI Spatial Narrative &amp; Anomaly Intelligence
              </h3>
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold font-mono">
                GEMINI 1.5 FLASH
              </span>
            </div>
            <p className="text-xs text-slate-400 prose-text">
              Automated multi-variable pattern discovery and anomaly interpretation
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="px-3.5 py-2 rounded-lg bg-[#161b22] border border-slate-800 hover:border-emerald-500/40 text-slate-300 hover:text-white text-xs font-mono font-medium transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Bookmark className={`w-3.5 h-3.5 ${saved ? 'text-amber-400 fill-amber-400' : ''}`} />
          <span>{saved ? 'Saved in Gallery!' : 'Bookmark to Gallery'}</span>
        </button>
      </div>

      {/* Axis Mapping Badges */}
      <div className="space-y-2">
        <span className="text-[10px] text-slate-400 font-bold uppercase font-mono flex items-center gap-1">
          <Compass className="w-3.5 h-3.5 text-cyan-400" />
          <span>Spatial Axis Dimensions:</span>
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
          {Object.entries(analysis.axisMapping).map(([key, val]) => (
            <div
              key={key}
              className="p-3 rounded-xl bg-[#161b22] border border-slate-800 space-y-0.5"
            >
              <span className="text-[10px] text-cyan-400 font-bold uppercase font-mono block">
                {key.toUpperCase()}
              </span>
              <span className="text-slate-200 text-xs font-mono truncate block">
                {val}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Executive Narrative Story Card */}
      <div className="p-4 rounded-xl bg-[#161b22] border border-slate-800 space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-white font-mono">
          <FileText className="w-3.5 h-3.5 text-emerald-400" />
          <span>Executive Spatial Synthesis:</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed prose-text">
          {analysis.narrative}
        </p>
      </div>

      {/* Key Patterns & Anomalies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Patterns */}
        <div className="p-4 rounded-xl bg-[#161b22] border border-slate-800 space-y-2.5">
          <span className="text-[10px] text-emerald-400 font-bold uppercase font-mono flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Key Statistical Patterns:</span>
          </span>
          <ul className="space-y-2 text-xs text-slate-300 prose-text">
            {analysis.patterns.map((p, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-emerald-400 font-mono font-bold">→</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Anomalies */}
        <div className="p-4 rounded-xl bg-[#161b22] border border-amber-500/20 space-y-2.5">
          <span className="text-[10px] text-amber-400 font-bold uppercase font-mono flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Anomalies &amp; Outliers:</span>
          </span>
          <ul className="space-y-2 text-xs text-slate-300 prose-text">
            {analysis.anomalies.map((a, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-amber-400 font-mono font-bold">!</span>
                <span>{a}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
