'use client';

import { useState, useMemo } from 'react';
import {
  DatasetAnalysis,
  VisualizationType,
  ColorScheme,
  WorkspaceTab,
  DimensionMapping,
  FilterRule,
  SavedVisualization,
} from '@/types';
import { SAMPLE_DATASETS } from '@/lib/sampleDatasets';
import { applyFilters, inferDefaultDimensionMapping } from '@/lib/dataEngine';
import { saveVisualization } from '@/lib/storage';

import DatasetUploader from '@/components/DatasetUploader';
import DatasetOverview from '@/components/DatasetOverview';
import DimensionMapper from '@/components/DimensionMapper';
import FilterPanel from '@/components/FilterPanel';
import DataTable2D from '@/components/DataTable2D';
import Chart2DFallback from '@/components/Chart2DFallback';
import AIQueryAssistant from '@/components/AIQueryAssistant';
import PerformanceMonitor from '@/components/PerformanceMonitor';
import MethodologyPanel from '@/components/MethodologyPanel';
import EngineeringHighlights from '@/components/EngineeringHighlights';
import Viewport3D from '@/components/Viewport3D';
import NarrativePanel from '@/components/NarrativePanel';
import AEOFAQSection from '@/components/AEOFAQSection';

import {
  Globe,
  Sparkles,
  Layers,
  Box,
  Share2,
  BarChart3,
  BookOpen,
  Table,
  Sliders,
  Filter,
  CheckCircle2,
  FileDown,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ThreeDataVizPage() {
  // 1. Central Application State
  const [activeDataset, setActiveDataset] = useState<DatasetAnalysis>(SAMPLE_DATASETS[0]);
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('3D_STUDIO');
  const [colorScheme, setColorScheme] = useState<ColorScheme>('EMERALD');
  const [isAutoRotate, setIsAutoRotate] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Filter & Search Engine State
  const [filters, setFilters] = useState<FilterRule[]>([]);
  const [globalSearch, setGlobalSearch] = useState<string>('');
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);

  // Dynamic Dimension Mapping State
  const [dimensionMapping, setDimensionMapping] = useState<DimensionMapping>(
    inferDefaultDimensionMapping(
      activeDataset.headers || Object.keys(activeDataset.rawRows?.[0] || {}),
      activeDataset.columnProfiles || [],
      activeDataset.chartType
    )
  );

  // 2. Computed Filtered Rows (Reactive Data Pipeline)
  const filteredRows = useMemo(() => {
    const baseRows = activeDataset.rawRows || [];
    if (baseRows.length === 0) return [];
    return applyFilters(baseRows, filters, globalSearch);
  }, [activeDataset.rawRows, filters, globalSearch]);

  // Handle Switching Preset Datasets
  const handleSelectDataset = (dataset: DatasetAnalysis) => {
    setActiveDataset(dataset);
    setColorScheme(dataset.colorScheme || 'EMERALD');
    setUploadError(null);
    setFilters([]);
    setGlobalSearch('');
    setSelectedRowIndex(null);

    const headers = dataset.headers || Object.keys(dataset.rawRows?.[0] || {});
    setDimensionMapping(
      inferDefaultDimensionMapping(headers, dataset.columnProfiles || [], dataset.chartType)
    );
  };

  // Handle Chart Projection Switch
  const handleChartTypeChange = (type: VisualizationType) => {
    const matchingPreset = SAMPLE_DATASETS.find((d) => d.chartType === type);
    if (matchingPreset) {
      handleSelectDataset(matchingPreset);
    } else {
      setActiveDataset((prev) => ({ ...prev, chartType: type }));
      const headers = activeDataset.headers || Object.keys(activeDataset.rawRows?.[0] || {});
      setDimensionMapping(
        inferDefaultDimensionMapping(headers, activeDataset.columnProfiles || [], type)
      );
    }
  };

  // Handle CSV Upload with Local Stats Engine profiling
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
        setFilters([]);
        setGlobalSearch('');
        setSelectedRowIndex(null);

        const headers = data.analysis.headers || Object.keys(data.analysis.rawRows?.[0] || {});
        setDimensionMapping(
          inferDefaultDimensionMapping(headers, data.analysis.columnProfiles || [], data.analysis.chartType)
        );
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
            <span>AI-POWERED VISUAL ANALYTICS STUDIO</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-mono">
            OmniData<span className="text-emerald-400">.3D</span> Visual Intelligence
          </h1>
          <p className="text-xs text-slate-400">
            Upload data. Explore it in 3D. Ask AI what it means.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs flex-wrap">
          <span className="px-2.5 py-1 rounded-lg bg-[#0d1117] border border-slate-800 text-slate-400 text-[11px]">
            Engine: <strong className="text-emerald-300">Three.js WebGL</strong>
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-[#0d1117] border border-slate-800 text-slate-400 text-[11px]">
            AI: <strong className="text-cyan-300">Gemini 1.5 Flash (Grounded)</strong>
          </span>
        </div>
      </div>

      {/* Dataset Uploader & Spatial Projection Bar */}
      <DatasetUploader
        activeDataset={activeDataset}
        onSelectDataset={handleSelectDataset}
        onUploadCSV={handleUploadCSV}
        onChartTypeChange={handleChartTypeChange}
        isLoading={isLoading}
        uploadError={uploadError}
        onClearError={() => setUploadError(null)}
      />

      {/* Data Inspection & Quality Overview */}
      <DatasetOverview
        rowCount={activeDataset.rowCount}
        columns={activeDataset.headers || Object.keys(activeDataset.rawRows?.[0] || {})}
        profiles={activeDataset.columnProfiles || []}
        quality={activeDataset.dataQuality}
        isSynthetic={activeDataset.isSynthetic}
      />

      {/* Dimension Mapper & Filter Engine (Collapsible / Stacked Controls) */}
      <div className="grid grid-cols-1 gap-4">
        <DimensionMapper
          chartType={activeDataset.chartType}
          columns={activeDataset.headers || Object.keys(activeDataset.rawRows?.[0] || {})}
          profiles={activeDataset.columnProfiles || []}
          mapping={dimensionMapping}
          onUpdateMapping={(newMap) => setDimensionMapping(newMap)}
        />

        <FilterPanel
          totalRows={activeDataset.rowCount}
          filteredCount={filteredRows.length}
          profiles={activeDataset.columnProfiles || []}
          filters={filters}
          globalSearch={globalSearch}
          onUpdateFilters={(f) => setFilters(f)}
          onUpdateSearch={(s) => setGlobalSearch(s)}
          onClearAll={() => {
            setFilters([]);
            setGlobalSearch('');
          }}
        />
      </div>

      {/* Multi-View Workspace Mode Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-2 rounded-2xl bg-[#0d1527] border border-[#1e293b]">
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => setActiveTab('3D_STUDIO')}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-medium flex items-center gap-2 cursor-pointer transition-all ${
              activeTab === '3D_STUDIO'
                ? 'bg-emerald-500 text-black font-bold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>3D Spatial Studio</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('2D_ANALYTICS')}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-medium flex items-center gap-2 cursor-pointer transition-all ${
              activeTab === '2D_ANALYTICS'
                ? 'bg-emerald-500 text-black font-bold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>2D Analytics</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('TABLE')}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-medium flex items-center gap-2 cursor-pointer transition-all ${
              activeTab === 'TABLE'
                ? 'bg-emerald-500 text-black font-bold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span>Data Table ({filteredRows.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('METHODOLOGY')}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-medium flex items-center gap-2 cursor-pointer transition-all ${
              activeTab === 'METHODOLOGY'
                ? 'bg-emerald-500 text-black font-bold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Methodology</span>
          </button>
        </div>

        {/* Real-time Performance HUD */}
        <PerformanceMonitor objectCount={filteredRows.length} />
      </div>

      {/* Main Workspace Render View */}
      {activeTab === '3D_STUDIO' && (
        <Viewport3D
          analysis={activeDataset}
          colorScheme={colorScheme}
          isAutoRotate={isAutoRotate}
          onToggleAutoRotate={() => setIsAutoRotate(!isAutoRotate)}
          onSaveToGallery={handleSaveToGallery}
        />
      )}

      {activeTab === '2D_ANALYTICS' && (
        <Chart2DFallback
          rows={filteredRows}
          headers={activeDataset.headers || Object.keys(activeDataset.rawRows?.[0] || {})}
          profiles={activeDataset.columnProfiles || []}
        />
      )}

      {activeTab === 'TABLE' && (
        <DataTable2D
          headers={activeDataset.headers || Object.keys(activeDataset.rawRows?.[0] || {})}
          rows={filteredRows}
          selectedRowIndex={selectedRowIndex}
          onSelectRow={(_, idx) => setSelectedRowIndex(idx)}
          datasetTitle={activeDataset.title}
        />
      )}

      {activeTab === 'METHODOLOGY' && <MethodologyPanel />}

      {/* Grounded AI Query Assistant ("Ask Your Data") */}
      <AIQueryAssistant
        datasetTitle={activeDataset.title}
        rows={filteredRows}
        columnProfiles={activeDataset.columnProfiles || []}
        anomalies={activeDataset.detailedAnomalies || []}
        correlations={activeDataset.correlations || []}
      />

      {/* AI Spatial Story Narrative & Statistical Evidence Panel */}
      <NarrativePanel
        analysis={activeDataset}
        onSelectAnomalyRow={(idx) => {
          setSelectedRowIndex(idx);
          setActiveTab('TABLE');
        }}
        onSaveToGallery={handleSaveToGallery}
      />

      {/* Engineering Highlights for Portfolio Reviewers */}
      <EngineeringHighlights />

      {/* Crawlable AEO/GEO Knowledge Hub & Architecture FAQ */}
      <AEOFAQSection />
    </div>
  );
}
