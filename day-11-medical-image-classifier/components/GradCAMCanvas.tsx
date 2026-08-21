'use client';

import { useState, useRef, useEffect } from 'react';
import { getColormapColor, ColormapType } from '@/lib/medicalEngine';
import { Eye, Sliders, Layers, Crosshair, SplitSquareVertical, Palette, Contrast, Sun, Moon, Sparkles } from 'lucide-react';

interface Props {
  imageSrc: string;
  heatmapGrid: number[][];
  modelType: 'xray' | 'dermatology';
  predictedClass: string;
}

type WindowingPreset = 'standard' | 'invert' | 'bone' | 'soft_tissue';

export default function GradCAMCanvas({ imageSrc, heatmapGrid, modelType, predictedClass }: Props) {
  const [opacity, setOpacity] = useState<number>(0.65);
  const [showHeatmap, setShowHeatmap] = useState<boolean>(true);
  const [colormap, setColormap] = useState<ColormapType>('jet');
  const [isSplitMode, setIsSplitMode] = useState<boolean>(false);
  const [windowPreset, setWindowPreset] = useState<WindowingPreset>('standard');
  const [hoverCoord, setHoverCoord] = useState<{ x: number; y: number; val: number } | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageObjRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    // Preload actual image element
    if (imageSrc) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = imageSrc;
      img.onload = () => {
        imageObjRef.current = img;
        renderCanvas();
      };
    }
  }, [imageSrc]);

  const renderCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 440;
    const height = 440;
    canvas.width = width;
    canvas.height = height;

    // Apply Windowing Filters
    ctx.filter = 'none';
    if (windowPreset === 'invert') {
      ctx.filter = 'invert(100%)';
    } else if (windowPreset === 'bone') {
      ctx.filter = 'contrast(200%) brightness(120%) grayscale(100%)';
    } else if (windowPreset === 'soft_tissue') {
      ctx.filter = 'contrast(140%) brightness(90%)';
    }

    // 1. Draw Image or High-Fidelity Anatomical Silhouette
    if (imageObjRef.current) {
      ctx.drawImage(imageObjRef.current, 0, 0, width, height);
    } else {
      ctx.fillStyle = modelType === 'xray' ? '#04070d' : '#1e1418';
      ctx.fillRect(0, 0, width, height);

      if (modelType === 'xray') {
        // High-Fidelity Ribcage & Lungs
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.ellipse(140, 220, 75, 140, 0, 0, Math.PI * 2);
        ctx.ellipse(300, 220, 75, 140, 0, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 3;
        for (let i = 0; i < 6; i++) {
          const y = 120 + i * 38;
          ctx.beginPath();
          ctx.arc(140, y, 65, Math.PI * 0.8, Math.PI * 0.2, true);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(300, y, 65, Math.PI * 0.8, Math.PI * 0.2, true);
          ctx.stroke();
        }

        ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.beginPath();
        ctx.ellipse(220, 260, 50, 70, -0.2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle = '#c88c78';
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = predictedClass.includes('Malignant') ? '#2a1a1f' : '#6b4337';
        ctx.beginPath();
        ctx.ellipse(220, 220, 100, 80, 0.3, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Reset filter for heatmap blending
    ctx.filter = 'none';

    // 2. Draw GradCAM Heatmap Overlay
    if (showHeatmap && heatmapGrid && heatmapGrid.length > 0) {
      const rows = heatmapGrid.length;
      const cols = heatmapGrid[0].length;
      const cellW = width / cols;
      const cellH = height / rows;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (isSplitMode && c < cols / 2) {
            // Split mode: left side is un-overlayed baseline scan
            continue;
          }

          const val = heatmapGrid[r][c];
          if (val > 0.05) {
            ctx.fillStyle = getColormapColor(val, opacity * val, colormap);
            ctx.fillRect(c * cellW, r * cellH, cellW, cellH);
          }
        }
      }

      if (isSplitMode) {
        // Draw split separator line
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(width / 2, 0);
        ctx.lineTo(width / 2, height);
        ctx.stroke();
      }
    }
  };

  useEffect(() => {
    renderCanvas();
  }, [imageSrc, heatmapGrid, opacity, showHeatmap, modelType, predictedClass, colormap, isSplitMode, windowPreset]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !heatmapGrid || heatmapGrid.length === 0) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rows = heatmapGrid.length;
    const cols = heatmapGrid[0].length;
    const colIdx = Math.floor((x / rect.width) * cols);
    const rowIdx = Math.floor((y / rect.height) * rows);

    if (rowIdx >= 0 && rowIdx < rows && colIdx >= 0 && colIdx < cols) {
      setHoverCoord({
        x: Math.round(x),
        y: Math.round(y),
        val: heatmapGrid[rowIdx][colIdx],
      });
    }
  };

  return (
    <div className="bg-[#090d16] border border-cyan-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl shadow-cyan-500/10 font-mono text-xs text-slate-300">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base font-outfit">GradCAM Activation Map Compositor</h3>
            <p className="text-xs text-slate-400">Multi-Spectral Neural Activation &amp; Diagnostic Windowing</p>
          </div>
        </div>

        {/* View Mode Switches */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setIsSplitMode(!isSplitMode)}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all text-xs flex items-center gap-1.5 cursor-pointer ${
              isSplitMode
                ? 'bg-cyan-500 text-black shadow-md'
                : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <SplitSquareVertical className="w-3.5 h-3.5" />
            <span>Split Compare</span>
          </button>

          <button
            type="button"
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all text-xs flex items-center gap-1.5 cursor-pointer ${
              showHeatmap
                ? 'bg-cyan-500 text-black shadow-md'
                : 'bg-slate-950 border border-slate-800 text-slate-400'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Heatmap: {showHeatmap ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </div>

      {/* Main Canvas View & Controls */}
      <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
        {/* HTML5 Canvas Container with Crosshair Probe */}
        <div className="relative rounded-2xl overflow-hidden border-2 border-cyan-500/40 shadow-2xl bg-black max-w-[440px] w-full aspect-square flex items-center justify-center shrink-0">
          <canvas
            ref={canvasRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHoverCoord(null)}
            className="w-full h-full object-cover cursor-crosshair"
          />

          <div className="absolute top-3 left-3 bg-slate-950/80 border border-slate-800 px-3 py-1 rounded-full text-[10px] text-cyan-400 font-bold backdrop-blur-sm">
            Layer: {modelType === 'xray' ? 'conv5_block3_out (DenseNet-121)' : 'top_conv (EfficientNet-B0)'}
          </div>

          {hoverCoord && (
            <div className="absolute bottom-3 right-3 bg-slate-950/90 border border-cyan-500/40 px-3 py-1.5 rounded-xl text-[10px] text-white font-bold backdrop-blur-md flex items-center gap-2">
              <Crosshair className="w-3 h-3 text-cyan-400" />
              <span>
                ({hoverCoord.x}px, {hoverCoord.y}px) → Focus: {(hoverCoord.val * 100).toFixed(0)}%
              </span>
            </div>
          )}
        </div>

        {/* Controls & Spectrum Sidebar */}
        <div className="space-y-4 flex-1 w-full">
          {/* Clinical Windowing Presets */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <Contrast className="w-4 h-4 text-cyan-400" />
              Radiological Windowing &amp; Contrast Presets
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'standard', label: 'Native View' },
                { id: 'invert', label: 'Invert Film' },
                { id: 'bone', label: 'Bone Window' },
                { id: 'soft_tissue', label: 'Soft Tissue' },
              ].map((w) => (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => setWindowPreset(w.id as WindowingPreset)}
                  className={`p-2 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                    windowPreset === w.id
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {w.label}
                </button>
              ))}
            </div>
          </div>

          {/* Colormap Selector */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <Palette className="w-4 h-4 text-cyan-400" />
              Multi-Spectral Colormap Palette
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['jet', 'turbo', 'viridis', 'hot'] as ColormapType[]).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColormap(c)}
                  className={`p-2 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer ${
                    colormap === c
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Opacity Slider */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-cyan-400" />
                Heatmap Blending Opacity
              </label>
              <span className="text-cyan-400 font-bold">{Math.round(opacity * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={opacity}
              onChange={(e) => setOpacity(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          {/* Scale Legend */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              GradCAM Activation Intensity Scale ({colormap.toUpperCase()})
            </label>
            <div className="h-3.5 rounded-full bg-gradient-to-r from-blue-600 via-emerald-400 to-red-600 w-full" />
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span>0.0 (Baseline Background)</span>
              <span>0.5 (Intermediate Region)</span>
              <span className="text-rose-400 font-bold">1.0 (Peak Attention)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
