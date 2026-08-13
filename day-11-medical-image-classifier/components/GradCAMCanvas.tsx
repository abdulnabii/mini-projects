'use client';

import { useState, useRef, useEffect } from 'react';
import { getJetColor } from '@/lib/medicalEngine';
import { Eye, Sliders, Layers, Sparkles } from 'lucide-react';

interface Props {
  imageSrc: string;
  heatmapGrid: number[][];
  modelType: 'xray' | 'dermatology';
  predictedClass: string;
}

export default function GradCAMCanvas({ imageSrc, heatmapGrid, modelType, predictedClass }: Props) {
  const [opacity, setOpacity] = useState<number>(0.65); // Default 65% opacity
  const [showHeatmap, setShowHeatmap] = useState<boolean>(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 400;
    const height = 400;
    canvas.width = width;
    canvas.height = height;

    // Draw background medical graphic simulation
    ctx.fillStyle = modelType === 'xray' ? '#04070d' : '#1e1418';
    ctx.fillRect(0, 0, width, height);

    // Draw base anatomical structure simulation
    if (modelType === 'xray') {
      // Draw Ribcage & Lungs
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      // Left lung outline
      ctx.ellipse(130, 200, 70, 130, 0, 0, Math.PI * 2);
      // Right lung outline
      ctx.ellipse(270, 200, 70, 130, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Ribs lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 3;
      for (let i = 0; i < 6; i++) {
        const y = 110 + i * 35;
        ctx.beginPath();
        ctx.arc(130, y, 60, Math.PI * 0.8, Math.PI * 0.2, true);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(270, y, 60, Math.PI * 0.8, Math.PI * 0.2, true);
        ctx.stroke();
      }
    } else {
      // Dermatology Lesion Simulation
      ctx.fillStyle = '#c88c78';
      ctx.fillRect(0, 0, width, height);

      // Irregular lesion core
      ctx.fillStyle = predictedClass.includes('Malignant') ? '#2a1a1f' : '#6b4337';
      ctx.beginPath();
      ctx.ellipse(200, 200, 90, 70, 0.3, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw GradCAM Heatmap Overlay (if enabled)
    if (showHeatmap && heatmapGrid && heatmapGrid.length > 0) {
      const rows = heatmapGrid.length;
      const cols = heatmapGrid[0].length;
      const cellW = width / cols;
      const cellH = height / rows;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const val = heatmapGrid[r][c];
          if (val > 0.05) {
            ctx.fillStyle = getJetColor(val, opacity * val);
            ctx.fillRect(c * cellW, r * cellH, cellW, cellH);
          }
        }
      }
    }
  }, [imageSrc, heatmapGrid, opacity, showHeatmap, modelType, predictedClass]);

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
            <p className="text-xs text-slate-400">Gradient-weighted Class Activation Visualizer Layer</p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-slate-950 p-2.5 rounded-2xl border border-slate-800">
          <button
            type="button"
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all text-xs flex items-center gap-1.5 ${
              showHeatmap
                ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
                : 'bg-slate-900 border border-slate-800 text-slate-400'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Heatmap Overlay: {showHeatmap ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </div>

      {/* Main Canvas View & Controls */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-8">
        {/* HTML5 Canvas Container */}
        <div ref={containerRef} className="relative rounded-2xl overflow-hidden border-2 border-cyan-500/40 shadow-2xl bg-black max-w-[400px] w-full aspect-square flex items-center justify-center shrink-0">
          <canvas ref={canvasRef} className="w-full h-full object-cover" />
          <div className="absolute top-3 left-3 bg-slate-950/80 border border-slate-800 px-3 py-1 rounded-full text-[10px] text-cyan-400 font-bold backdrop-blur-sm">
            Layer: {modelType === 'xray' ? 'conv5_block3_out' : 'top_conv'}
          </div>
        </div>

        {/* Controls & Legend Sidebar */}
        <div className="space-y-6 flex-1 w-full">
          {/* Opacity Slider */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-cyan-400" />
                Heatmap Blending Opacity ({Math.round(opacity * 100)}%)
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

          {/* Jet Colormap Scale Legend */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              GradCAM Activation Intensity Scale Legend
            </label>
            <div className="h-4 rounded-full bg-gradient-to-r from-blue-600 via-emerald-400 to-red-600 w-full" />
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span>0.0 (Baseline irrelevant)</span>
              <span>0.5 (Moderate Attention)</span>
              <span className="text-rose-400 font-bold">1.0 (Primary Neural Focus)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
