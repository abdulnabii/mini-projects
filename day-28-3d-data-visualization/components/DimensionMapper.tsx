'use client';

import { useState } from 'react';
import { DimensionMapping, VisualizationType, ColumnProfile } from '@/types';
import { Sliders, RefreshCw, Check, AlertCircle } from 'lucide-react';

interface Props {
  chartType: VisualizationType;
  columns: string[];
  profiles: ColumnProfile[];
  mapping: DimensionMapping;
  onUpdateMapping: (mapping: DimensionMapping) => void;
}

export default function DimensionMapper({
  chartType,
  columns,
  profiles,
  mapping,
  onUpdateMapping,
}: Props) {
  const [localMap, setLocalMap] = useState<DimensionMapping>(mapping);
  const [applied, setApplied] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const numericCols = profiles.filter((p) => p.dataType === 'numeric').map((p) => p.name);
  const allCols = columns;

  const handleChange = (key: keyof DimensionMapping, value: string) => {
    setLocalMap((prev) => ({
      ...prev,
      [key]: value === '' ? undefined : value,
    }));
    setValidationError(null);
  };

  const handleApply = () => {
    // Validate mapping requirements per chart type
    if (chartType === 'GLOBE_3D') {
      if (!localMap.heightField) {
        setValidationError('Globe projection requires a numeric Height/Value column.');
        return;
      }
    } else if (chartType === 'BAR_3D') {
      if (!localMap.barHeightField) {
        setValidationError('3D Bars require a numeric Column Height metric.');
        return;
      }
    } else if (chartType === 'SCATTER_3D') {
      if (!localMap.xField || !localMap.yField || !localMap.zField) {
        setValidationError('Scatter 3D requires X, Y, and Z numeric coordinate mappings.');
        return;
      }
    }

    onUpdateMapping(localMap);
    setApplied(true);
    setTimeout(() => setApplied(false), 2000);
  };

  return (
    <div className="p-4 rounded-2xl bg-[#0d1527] border border-[#1e293b] shadow-xl space-y-4 font-mono">
      <div className="flex items-center justify-between border-b border-[#1e293b] pb-3">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-cyan-400" />
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">
            Dimension Mapping &amp; Spatial Attribute Builder
          </h4>
        </div>
        <button
          type="button"
          onClick={handleApply}
          className="px-3 py-1.5 rounded-lg bg-emerald-500 text-black font-bold text-xs flex items-center gap-1.5 hover:bg-emerald-400 transition-all cursor-pointer"
        >
          {applied ? <Check className="w-3.5 h-3.5" /> : <RefreshCw className="w-3.5 h-3.5" />}
          <span>{applied ? 'Applied' : 'Apply Mapping'}</span>
        </button>
      </div>

      {validationError && (
        <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Dynamic mapping fields based on Visualization Type */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        {chartType === 'GLOBE_3D' && (
          <>
            <div>
              <label className="block text-[10px] text-slate-400 uppercase mb-1">
                Geo Entity / Location
              </label>
              <select
                value={localMap.geoField || ''}
                onChange={(e) => handleChange('geoField', e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-[#111827] border border-[#1e293b] text-white text-xs"
              >
                <option value="">Auto-detect</option>
                {allCols.map((col) => (
                  <option key={col} value={col}>{col}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] text-slate-400 uppercase mb-1">
                Spike Height (Primary Metric) *
              </label>
              <select
                value={localMap.heightField || ''}
                onChange={(e) => handleChange('heightField', e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-[#111827] border border-[#1e293b] text-white text-xs"
              >
                <option value="">Select numeric metric</option>
                {numericCols.map((col) => (
                  <option key={col} value={col}>{col}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] text-slate-400 uppercase mb-1">
                Secondary Metric (Color Scale)
              </label>
              <select
                value={localMap.secondaryValueField || ''}
                onChange={(e) => handleChange('secondaryValueField', e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-[#111827] border border-[#1e293b] text-white text-xs"
              >
                <option value="">None / Default</option>
                {numericCols.map((col) => (
                  <option key={col} value={col}>{col}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] text-slate-400 uppercase mb-1">
                Category / Region Tag
              </label>
              <select
                value={localMap.categoryField || ''}
                onChange={(e) => handleChange('categoryField', e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-[#111827] border border-[#1e293b] text-white text-xs"
              >
                <option value="">None</option>
                {allCols.map((col) => (
                  <option key={col} value={col}>{col}</option>
                ))}
              </select>
            </div>
          </>
        )}

        {chartType === 'NETWORK_GRAPH' && (
          <>
            <div>
              <label className="block text-[10px] text-slate-400 uppercase mb-1">
                Entity / Node Name
              </label>
              <select
                value={localMap.sourceField || ''}
                onChange={(e) => handleChange('sourceField', e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-[#111827] border border-[#1e293b] text-white text-xs"
              >
                <option value="">Select column</option>
                {allCols.map((col) => (
                  <option key={col} value={col}>{col}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] text-slate-400 uppercase mb-1">
                Node Weight / Valuation
              </label>
              <select
                value={localMap.weightField || ''}
                onChange={(e) => handleChange('weightField', e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-[#111827] border border-[#1e293b] text-white text-xs"
              >
                <option value="">Select metric</option>
                {numericCols.map((col) => (
                  <option key={col} value={col}>{col}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] text-slate-400 uppercase mb-1">
                Cluster Group / Type
              </label>
              <select
                value={localMap.categoryField || ''}
                onChange={(e) => handleChange('categoryField', e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-[#111827] border border-[#1e293b] text-white text-xs"
              >
                <option value="">Select group column</option>
                {allCols.map((col) => (
                  <option key={col} value={col}>{col}</option>
                ))}
              </select>
            </div>
          </>
        )}

        {chartType === 'BAR_3D' && (
          <>
            <div>
              <label className="block text-[10px] text-slate-400 uppercase mb-1">
                X-Axis Dimension (e.g. Region)
              </label>
              <select
                value={localMap.xCategoryField || ''}
                onChange={(e) => handleChange('xCategoryField', e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-[#111827] border border-[#1e293b] text-white text-xs"
              >
                <option value="">Select category</option>
                {allCols.map((col) => (
                  <option key={col} value={col}>{col}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] text-slate-400 uppercase mb-1">
                Z-Axis Dimension (e.g. Quarter/Time)
              </label>
              <select
                value={localMap.zCategoryField || ''}
                onChange={(e) => handleChange('zCategoryField', e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-[#111827] border border-[#1e293b] text-white text-xs"
              >
                <option value="">Select category</option>
                {allCols.map((col) => (
                  <option key={col} value={col}>{col}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] text-slate-400 uppercase mb-1">
                Voxel Elevation (Height Metric) *
              </label>
              <select
                value={localMap.barHeightField || ''}
                onChange={(e) => handleChange('barHeightField', e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-[#111827] border border-[#1e293b] text-white text-xs"
              >
                <option value="">Select metric</option>
                {numericCols.map((col) => (
                  <option key={col} value={col}>{col}</option>
                ))}
              </select>
            </div>
          </>
        )}

        {chartType === 'SCATTER_3D' && (
          <>
            <div>
              <label className="block text-[10px] text-slate-400 uppercase mb-1">
                X-Axis Metric *
              </label>
              <select
                value={localMap.xField || ''}
                onChange={(e) => handleChange('xField', e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-[#111827] border border-[#1e293b] text-white text-xs"
              >
                <option value="">Select metric</option>
                {numericCols.map((col) => (
                  <option key={col} value={col}>{col}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] text-slate-400 uppercase mb-1">
                Y-Axis Metric *
              </label>
              <select
                value={localMap.yField || ''}
                onChange={(e) => handleChange('yField', e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-[#111827] border border-[#1e293b] text-white text-xs"
              >
                <option value="">Select metric</option>
                {numericCols.map((col) => (
                  <option key={col} value={col}>{col}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] text-slate-400 uppercase mb-1">
                Z-Axis Metric *
              </label>
              <select
                value={localMap.zField || ''}
                onChange={(e) => handleChange('zField', e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-[#111827] border border-[#1e293b] text-white text-xs"
              >
                <option value="">Select metric</option>
                {numericCols.map((col) => (
                  <option key={col} value={col}>{col}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] text-slate-400 uppercase mb-1">
                Particle Size Metric
              </label>
              <select
                value={localMap.sizeField || ''}
                onChange={(e) => handleChange('sizeField', e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-[#111827] border border-[#1e293b] text-white text-xs"
              >
                <option value="">Fixed size</option>
                {numericCols.map((col) => (
                  <option key={col} value={col}>{col}</option>
                ))}
              </select>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
