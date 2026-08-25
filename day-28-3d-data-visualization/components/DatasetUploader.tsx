'use client';

import { useState } from 'react';
import { DatasetAnalysis, VisualizationType } from '@/types';
import { SAMPLE_DATASETS } from '@/lib/sampleDatasets';
import {
  Upload,
  Globe,
  Share2,
  BarChart3,
  Sparkles,
  Layers,
  Loader2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  activeDataset: DatasetAnalysis;
  onSelectDataset: (dataset: DatasetAnalysis) => void;
  onUploadCSV: (csvText: string, title: string) => void;
  onChartTypeChange: (type: VisualizationType) => void;
  isLoading: boolean;
  uploadError?: string | null;
  onClearError?: () => void;
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
  uploadError,
  onClearError,
}: Props) {
  const [customCsv, setCustomCsv] = useState('');
  const [customTitle, setCustomTitle] = useState('Custom Enterprise Dataset');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [localValidationWarning, setLocalValidationWarning] = useState<string | null>(null);

  const handleCustomUpload = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalValidationWarning(null);

    const clean = customCsv.trim();
    if (!clean) {
      setLocalValidationWarning('Please paste CSV text or select one of the pre-loaded global datasets.');
      return;
    }

    const lines = clean.split('\n').filter((l) => l.trim().length > 0);
    if (lines.length < 2) {
      setLocalValidationWarning('CSV must contain a header row and at least 1 data row.');
      return;
    }

    onUploadCSV(clean, customTitle);
    setIsUploadOpen(false);
    confetti({
      particleCount: 25,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#10b981', '#06b6d4'],
    });
  };

  const loadSampleCSV = () => {
    setCustomCsv(
      'country,lat,lng,value,category\nUnited States,37.09,-95.71,95,North America\nGermany,51.16,10.45,68,Europe\nJapan,36.20,138.25,52,Asia\nBrazil,-14.23,-51.92,84,South America\nAustralia,-25.27,133.77,34,Oceania'
    );
    setLocalValidationWarning(null);
  };

  return (
    <div className="space-y-3 font-mono">
      {/* Compact Header & Chart Type Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#0d1117] border border-slate-800 shadow-xl">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] text-slate-400 font-bold uppercase font-mono">
            Spatial Projection:
          </span>
          <div className="flex items-center gap-1.5 flex-wrap p-0.5 rounded-xl bg-[#161b22] border border-slate-800">
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

        {/* Upload Toggle */}
        <button
          type="button"
          onClick={() => setIsUploadOpen(!isUploadOpen)}
          className="text-xs text-emerald-400 hover:underline flex items-center gap-1 font-mono font-medium cursor-pointer"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>{isUploadOpen ? 'Close CSV Form' : 'Upload Custom CSV'}</span>
        </button>
      </div>

      {/* Preset Dataset Badges Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-[10px] text-slate-500 font-bold uppercase shrink-0 font-mono">
          Datasets:
        </span>
        {SAMPLE_DATASETS.map((ds) => {
          const isSelected = activeDataset.id === ds.id;
          return (
            <button
              key={ds.id}
              type="button"
              onClick={() => onSelectDataset(ds)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium whitespace-nowrap transition-all border cursor-pointer ${
                isSelected
                  ? 'bg-[#161b22] border-emerald-500 text-emerald-300 font-bold shadow-sm'
                  : 'bg-[#0d1117] border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <span>{ds.title.split('&')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* Validation or API Upload Error State */}
      {(uploadError || localValidationWarning) && (
        <div className="p-3.5 rounded-xl bg-rose-950/30 border border-rose-500/50 flex items-start justify-between gap-3 text-xs font-mono text-rose-200">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold text-white">CSV Parsing Notice:</span>
              <p className="text-[11px] text-rose-300">
                {uploadError || localValidationWarning}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={loadSampleCSV}
            className="px-2.5 py-1 rounded bg-rose-900/60 border border-rose-700 text-[10px] font-bold text-white hover:bg-rose-800 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Load Valid Sample</span>
          </button>
        </div>
      )}

      {/* Upload Custom CSV Dropdown Form */}
      {isUploadOpen && (
        <form onSubmit={handleCustomUpload} className="p-4 rounded-xl bg-[#0d1117] border border-slate-800 space-y-3 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <label className="text-[10px] text-slate-400 font-bold uppercase font-mono">
              Dataset Name:
            </label>
            <button
              type="button"
              onClick={loadSampleCSV}
              className="text-[10px] text-emerald-400 hover:underline"
            >
              Insert Sample CSV
            </button>
          </div>

          <input
            type="text"
            value={customTitle}
            onChange={(e) => setCustomTitle(e.target.value)}
            placeholder="e.g. Q4 Global Logistics Flow"
            className="w-full p-2 rounded-lg bg-[#161b22] border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 font-mono"
          />

          <textarea
            rows={4}
            value={customCsv}
            onChange={(e) => setCustomCsv(e.target.value)}
            placeholder="country,lat,lng,value,category&#10;United States,37.09,-95.71,95,North America&#10;Germany,51.16,10.45,68,Europe"
            className="w-full p-2 rounded-lg bg-[#161b22] border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 font-mono leading-relaxed"
          />

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
              <span>Render 3D Space</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
