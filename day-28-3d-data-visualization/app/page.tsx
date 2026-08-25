'use client';

import { useState } from 'react';
import { DatasetAnalysis, VisualizationType, ColorScheme, SavedVisualization } from '@/types';
import { SAMPLE_DATASETS } from '@/lib/sampleDatasets';
import { saveVisualization } from '@/lib/storage';
import DatasetUploader from '@/components/DatasetUploader';
import Viewport3D from '@/components/Viewport3D';
import NarrativePanel from '@/components/NarrativePanel';
import {
  Globe,
  Sparkles,
  Layers,
  Box,
  Share2,
  BarChart3,
  Video,
  Camera,
  RotateCw,
  Palette,
  CheckCircle2,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ThreeDataVizPage() {
  const [activeDataset, setActiveDataset] = useState<DatasetAnalysis>(SAMPLE_DATASETS[0]);
  const [colorScheme, setColorScheme] = useState<ColorScheme>('EMERALD');
  const [isAutoRotate, setIsAutoRotate] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectDataset = (dataset: DatasetAnalysis) => {
    setActiveDataset(dataset);
    setColorScheme(dataset.colorScheme || 'EMERALD');
  };

  const handleChartTypeChange = (type: VisualizationType) => {
    // Switch to corresponding dataset preset or update chart type
    const matchingPreset = SAMPLE_DATASETS.find((d) => d.chartType === type);
    if (matchingPreset) {
      setActiveDataset(matchingPreset);
      setColorScheme(matchingPreset.colorScheme || 'EMERALD');
    } else {
      setActiveDataset((prev) => ({ ...prev, chartType: type }));
    }
  };

  const handleUploadCSV = async (csvText: string, title: string) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ csvText, title }),
      });
      const data = await res.json();
      if (data.analysis) {
        setActiveDataset(data.analysis);
        setColorScheme(data.analysis.colorScheme || 'EMERALD');
      }
    } catch (e) {
      console.error('Failed to analyze CSV:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveToGallery = () => {
    const newSaved: SavedVisualization = {
      id: 'vis_' + Date.now(),
      title: activeDataset.title,
      datasetName: activeDataset.category,
      chartType: activeDataset.chartType,
      narrative: activeDataset.narrative.slice(0, 140) + '...',
      createdAt: new Date().toISOString(),
    };
    saveVisualization(newSaved);
  };

  return (
    <div className="space-y-8 font-mono w-full min-w-0">
      {/* Centered Hero Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
          <Globe className="w-3.5 h-3.5" />
          <span>3D WEBGL DATA VISUALIZATION &amp; SPATIAL NARRATIVE ENGINE</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-tight font-mono">
          Transform Raw Datasets into{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400">
            Living 3D Worlds
          </span>
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm font-mono max-w-2xl mx-auto leading-relaxed prose-text">
          Interactive Three.js 3D Earth globes, force-directed network graphs, animated isometric bar matrices, and particle scatter clouds powered by Gemini 1.5 Flash spatial storytelling.
        </p>
      </div>

      {/* 4 Stat Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-5xl mx-auto font-mono text-left">
        <div className="p-3.5 rounded-xl bg-[#0d1117] border border-slate-800 space-y-1 hover:border-emerald-500/30 transition-colors">
          <span className="text-[10px] text-emerald-400 font-bold uppercase flex items-center gap-1 font-mono">
            <Box className="w-3.5 h-3.5" /> 3D Projections
          </span>
          <div className="text-base font-bold text-white font-mono">4 WebGL Types</div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#0d1117] border border-slate-800 space-y-1 hover:border-cyan-500/30 transition-colors">
          <span className="text-[10px] text-cyan-400 font-bold uppercase flex items-center gap-1 font-mono">
            <Globe className="w-3.5 h-3.5" /> Active Projection
          </span>
          <div className="text-base font-bold text-cyan-300 truncate font-mono">
            {activeDataset.chartType.replace('_', ' ')}
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#0d1117] border border-slate-800 space-y-1 hover:border-purple-500/30 transition-colors">
          <span className="text-[10px] text-purple-400 font-bold uppercase flex items-center gap-1 font-mono">
            <Sparkles className="w-3.5 h-3.5" /> AI Storyteller
          </span>
          <div className="text-base font-bold text-purple-300 font-mono">Gemini 1.5 Flash</div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#0d1117] border border-slate-800 space-y-1 hover:border-amber-500/30 transition-colors">
          <span className="text-[10px] text-amber-400 font-bold uppercase flex items-center gap-1 font-mono">
            <Video className="w-3.5 h-3.5" /> Video Export
          </span>
          <div className="text-base font-bold text-amber-300 font-mono">4K Canvas Capture</div>
        </div>
      </div>

      {/* Dataset Uploader & Preset Switcher */}
      <DatasetUploader
        activeDataset={activeDataset}
        onSelectDataset={handleSelectDataset}
        onUploadCSV={handleUploadCSV}
        onChartTypeChange={handleChartTypeChange}
        isLoading={isLoading}
      />

      {/* 3D WebGL Canvas Viewport */}
      <Viewport3D
        analysis={activeDataset}
        colorScheme={colorScheme}
        isAutoRotate={isAutoRotate}
        onToggleAutoRotate={() => setIsAutoRotate(!isAutoRotate)}
        onSaveToGallery={handleSaveToGallery}
      />

      {/* AI Spatial Story Narrative & Anomaly Panel */}
      <NarrativePanel
        analysis={activeDataset}
        onSaveToGallery={handleSaveToGallery}
      />
    </div>
  );
}
