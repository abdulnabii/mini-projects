'use client';

import { useState } from 'react';
import { DatasetAnalysis, VisualizationType } from '@/types';
import { SAMPLE_DATASETS } from '@/lib/sampleDatasets';
import {
  Upload,
  FileSpreadsheet,
  Globe,
  Share2,
  BarChart3,
  Sparkles,
  Layers,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  activeDataset: DatasetAnalysis;
  onSelectDataset: (dataset: DatasetAnalysis) => void;
  onUploadCSV: (csvText: string, title: string) => void;
  onChartTypeChange: (type: VisualizationType) => void;
  isLoading: boolean;
}

const VIS_TYPES: { id: VisualizationType; label: string; icon: any }[] = [
  { id: 'GLOBE_3D', label: '3D Earth Globe', icon: Globe },
  { id: 'NETWORK_GRAPH', label: '3D Network Graph', icon: Share2 },
  { id: 'BAR_3D', label: '3D Isometric Bars', icon: BarChart3 },
  { id: 'SCATTER_3D', label: '3D Particle Swarm', icon: Sparkles },
];

export default function DatasetUploader({
  activeDataset,
  onSelectDataset,
  onUploadCSV,
  onChartTypeChange,
  isLoading,
}: Props) {
  const [customCsv, setCustomCsv] = useState('');
  const [customTitle, setCustomTitle] = useState('Custom Enterprise Dataset');
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const handleCustomUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customCsv.trim()) return;
    onUploadCSV(customCsv.trim(), customTitle);
    setIsUploadOpen(false);
    confetti({
      particleCount: 25,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#10b981', '#06b6d4'],
    });
  };

  return (
    <div className="p-6 rounded-2xl bg-[#0d1117] border border-slate-800 shadow-xl space-y-5 font-mono">
      {/* Header & Chart Type Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm font-mono">
              3D Spatial Data Engine &amp; Visual Type Selector
            </h3>
            <p className="text-xs text-slate-400 prose-text">
              Switch 3D WebGL projections or upload custom multi-variable CSVs
            </p>
          </div>
        </div>

        {/* 3D Visualization Type Switcher */}
        <div className="flex items-center gap-1.5 flex-wrap p-1 rounded-xl bg-[#161b22] border border-slate-800">
          {VIS_TYPES.map((vt) => {
            const Icon = vt.icon;
            const isSelected = activeDataset.chartType === vt.id;
            return (
              <button
                key={vt.id}
                type="button"
                onClick={() => onChartTypeChange(vt.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-500 text-black font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{vt.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dataset Preset Buttons */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-slate-400 font-bold uppercase font-mono">
            Preset Spatial Datasets:
          </span>
          <button
            type="button"
            onClick={() => setIsUploadOpen(!isUploadOpen)}
            className="text-xs text-emerald-400 hover:underline flex items-center gap-1 font-mono font-medium cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>{isUploadOpen ? 'Close CSV Uploader' : 'Upload Custom CSV'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {SAMPLE_DATASETS.map((ds) => {
            const isSelected = activeDataset.id === ds.id;
            return (
              <button
                key={ds.id}
                type="button"
                onClick={() => onSelectDataset(ds)}
                className={`p-3.5 rounded-xl border text-left transition-all space-y-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-[#161b22] border-emerald-500/50 shadow-md shadow-emerald-500/10'
                    : 'bg-[#04080e] border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="px-1.5 py-0.2 rounded-md bg-slate-900 text-cyan-300 text-[9px] font-bold font-mono">
                    {ds.chartType.replace('_', ' ')}
                  </span>
                  <span className="text-[9px] text-slate-500 font-mono">
                    {ds.rowCount} rows
                  </span>
                </div>
                <h4 className="font-bold text-white text-xs font-mono line-clamp-1">
                  {ds.title}
                </h4>
                <p className="text-[10px] text-slate-400 prose-text line-clamp-1">
                  {ds.category}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Upload Custom CSV Dropdown Form */}
      {isUploadOpen && (
        <form onSubmit={handleCustomUpload} className="p-4 rounded-xl bg-[#04080e] border border-slate-800 space-y-3 animate-in fade-in duration-150">
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 font-bold uppercase font-mono">
              Dataset Name:
            </label>
            <input
              type="text"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              placeholder="e.g. Q4 Global Logistics Flow"
              className="w-full p-2.5 rounded-lg bg-[#161b22] border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 font-bold uppercase font-mono">
              Paste CSV Text Data:
            </label>
            <textarea
              rows={4}
              value={customCsv}
              onChange={(e) => setCustomCsv(e.target.value)}
              placeholder="country,latitude,longitude,cases,vaccinations&#10;United States,37.09,-95.71,95000,74000&#10;Germany,51.16,10.45,68000,79000"
              className="w-full p-2.5 rounded-lg bg-[#161b22] border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 font-mono leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsUploadOpen(false)}
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-400 hover:text-white cursor-pointer font-mono"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !customCsv.trim()}
              className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-bold text-xs shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
            >
              {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              <span>Analyze &amp; Project in 3D</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
