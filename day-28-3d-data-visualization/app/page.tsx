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
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleSelectDataset = (dataset: DatasetAnalysis) => {
    setActiveDataset(dataset);
    setColorScheme(dataset.colorScheme || 'EMERALD');
    setUploadError(null);
  };

  const handleChartTypeChange = (type: VisualizationType) => {
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
    setUploadError(null);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ csvText, title }),
      });
      const data = await res.json();
      if (data.error) {
        setUploadError(data.error);
        return;
      }
      if (data.analysis) {
        setActiveDataset(data.analysis);
        setColorScheme(data.analysis.colorScheme || 'EMERALD');
      }
    } catch (e: any) {
      console.error('Failed to analyze CSV:', e);
      setUploadError('Failed to parse CSV dataset. Please verify format and headers.');
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
    <div className="space-y-6 font-mono w-full min-w-0">
      {/* Streamlined Hero Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold font-mono">
            <Globe className="w-3 h-3" />
            <span>3D WEBGL SPATIAL DATA PLATFORM</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-mono">
            OmniData<span className="text-emerald-400">.3D</span> Visual Intelligence
          </h1>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-lg bg-[#0d1117] border border-slate-800 text-slate-400 text-[11px]">
            Engine: <strong className="text-emerald-300">Three.js WebGL</strong>
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-[#0d1117] border border-slate-800 text-slate-400 text-[11px]">
            AI: <strong className="text-cyan-300">Gemini 1.5 Flash</strong>
          </span>
        </div>
      </div>

      {/* Dataset Uploader & Spatial Projection Toolbar (Above Viewport) */}
      <DatasetUploader
        activeDataset={activeDataset}
        onSelectDataset={handleSelectDataset}
        onUploadCSV={handleUploadCSV}
        onChartTypeChange={handleChartTypeChange}
        isLoading={isLoading}
        uploadError={uploadError}
        onClearError={() => setUploadError(null)}
      />

      {/* 3D WebGL Canvas Viewport (PRIMARY HERO ELEMENT) */}
      <Viewport3D
        analysis={activeDataset}
        colorScheme={colorScheme}
        isAutoRotate={isAutoRotate}
        onToggleAutoRotate={() => setIsAutoRotate(!isAutoRotate)}
        onSaveToGallery={handleSaveToGallery}
      />

      {/* AI Spatial Story Narrative & Anomaly Intelligence Panel */}
      <NarrativePanel
        analysis={activeDataset}
        onSaveToGallery={handleSaveToGallery}
      />
    </div>
  );
}
