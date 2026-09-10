'use client';

import { useState } from 'react';
import { DatasetAnalysis, DetectedAnomaly } from '@/types';
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Bookmark,
  FileText,
  Compass,
  Sigma,
  Activity,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  analysis: DatasetAnalysis;
  onSelectAnomalyRow?: (rowIndex: number) => void;
  onSaveToGallery?: () => void;
}

export default function NarrativePanel({
  analysis,
  onSelectAnomalyRow,
  onSaveToGallery,
}: Props) {
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

  const detailedAnomalies = analysis.detailedAnomalies || [];
  const correlations = analysis.correlations || [];

  return (
    <div className="p-6 sm:p-8 rounded-2xl bg-[#0d1527] border border-[#1e293b] shadow-xl space-y-6 font-mono">
      {/* Header & Save Trigger */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#1e293b] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-white text-sm font-mono">
                Statistical Findings &amp; Grounded AI Narrative
              </h3>
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold font-mono">
                VERIFIED LOCAL ENGINE + GEMINI
              </span>
            </div>
            <p className="text-xs text-slate-400 prose-text">
              Multi-variable statistical profiling, IQR outlier fences, and correlation discovery
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="px-3.5 py-2 rounded-lg bg-[#111827] border border-[#1e293b] hover:border-emerald-500/40 text-slate-300 hover:text-white text-xs font-mono font-medium transition-all duration-150 flex items-center gap-1.5 cursor-pointer"
        >
          <Bookmark className={`w-3.5 h-3.5 ${saved ? 'text-amber-400 fill-amber-400' : ''}`} />
          <span>{saved ? 'Saved in Gallery!' : 'Bookmark to Gallery'}</span>
        </button>
      </div>

      {/* Axis Mapping Badges */}
      <div className="space-y-2">
        <span className="text-[10px] text-slate-400 font-bold uppercase font-mono flex items-center gap-1 tracking-wider">
          <Compass className="w-3.5 h-3.5 text-cyan-400" />
          <span>Active Spatial Dimension Mappings:</span>
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
          {Object.entries(analysis.axisMapping).map(([key, val]) => (
            <div
              key={key}
              className="p-3 rounded-xl bg-[#111827] border border-[#1e293b] space-y-0.5 hover:border-cyan-500/30 transition-colors duration-150"
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
      <div className="p-4 rounded-xl bg-[#111827] border border-[#1e293b] space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-white font-mono">
          <FileText className="w-3.5 h-3.5 text-emerald-400" />
          <span>Executive Spatial Synthesis:</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed prose-text">
          {analysis.narrative}
        </p>
      </div>

      {/* Statistical Details Grid (Correlations & Detected Anomalies) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Strongest Pearson Correlations */}
        <div className="p-4 rounded-xl bg-[#111827] border border-[#1e293b] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-purple-400 font-bold uppercase font-mono flex items-center gap-1.5 tracking-wider">
              <Sigma className="w-3.5 h-3.5" />
              <span>Strongest Numeric Correlations (r):</span>
            </span>
            <span className="text-[10px] text-slate-500 italic">Pearson r</span>
          </div>

          {correlations.length === 0 ? (
            <p className="text-xs text-slate-500">No paired numeric dimensions to compute correlation.</p>
          ) : (
            <div className="space-y-2 text-xs">
              {correlations.slice(0, 3).map((c, i) => (
                <div key={i} className="p-2.5 rounded-lg bg-[#0d1527] border border-[#1e293b] flex items-center justify-between">
                  <span className="text-slate-200 truncate max-w-[220px]">
                    {c.columnA} ↔ {c.columnB}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-500">n={c.sampleSize}</span>
                    <span className={`px-2 py-0.5 rounded font-bold font-mono text-[11px] ${
                      Math.abs(c.correlation) >= 0.7 ? 'bg-purple-500/20 text-purple-300' : 'bg-slate-800 text-slate-300'
                    }`}>
                      r = {c.correlation > 0 ? `+${c.correlation}` : c.correlation}
                    </span>
                  </div>
                </div>
              ))}
              <span className="text-[10px] text-slate-500 block pt-1">
                *Statistical association only. Correlation does not imply causation.
              </span>
            </div>
          )}
        </div>

        {/* Detailed Anomaly / Outlier Cards */}
        <div className="p-4 rounded-xl bg-[#111827] border border-amber-500/20 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-amber-400 font-bold uppercase font-mono flex items-center gap-1.5 tracking-wider">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Detected Statistical Outliers (IQR 1.5×):</span>
            </span>
            <span className="text-[10px] text-amber-400 font-bold">
              {detailedAnomalies.length} outliers
            </span>
          </div>

          {detailedAnomalies.length === 0 ? (
            <p className="text-xs text-slate-400">All data points reside within normal statistical fences.</p>
          ) : (
            <div className="space-y-2 text-xs">
              {detailedAnomalies.slice(0, 3).map((anom, i) => (
                <div
                  key={i}
                  onClick={() => onSelectAnomalyRow && onSelectAnomalyRow(anom.rowIndex)}
                  className="p-2.5 rounded-lg bg-[#0d1527] border border-[#1e293b] hover:border-amber-500/40 cursor-pointer transition-all flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold text-white block text-xs">{anom.rowIdentifier}</span>
                    <span className="text-[10px] text-slate-400">
                      {anom.column}: <strong className="text-amber-300">{anom.value}</strong> (Fence: [{anom.lowerFence}, {anom.upperFence}])
                    </span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    anom.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    {anom.severity}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
