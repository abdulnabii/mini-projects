'use client';

import { useState, useRef } from 'react';
import { DatasetAnalysis, VisualizationType, ColorScheme } from '@/types';
import Globe3D from './Globe3D';
import NetworkGraph3D from './NetworkGraph3D';
import BarChart3D from './BarChart3D';
import ScatterPlot3D from './ScatterPlot3D';
import {
  Camera,
  Video,
  Sparkles,
  Layers,
  RotateCw,
  Share2,
  Check,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Info,
  Compass,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  analysis: DatasetAnalysis;
  colorScheme: ColorScheme;
  isAutoRotate: boolean;
  onToggleAutoRotate: () => void;
  onSaveToGallery?: () => void;
}

export default function Viewport3D({
  analysis,
  colorScheme,
  isAutoRotate,
  onToggleAutoRotate,
  onSaveToGallery,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Camera UX States
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [resetViewTrigger, setResetViewTrigger] = useState<number>(0);

  const handleZoomIn = () => setZoomLevel((z) => Math.min(180, z + 15));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(50, z - 15));
  const handleResetView = () => {
    setZoomLevel(100);
    setResetViewTrigger((t) => t + 1);
  };

  // High-res snapshot of WebGL canvas
  const handleTakeSnapshot = () => {
    const canvas = containerRef.current?.querySelector('canvas');
    if (!canvas) return;

    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `omnidata_3d_${analysis.chartType.toLowerCase()}_${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();

    confetti({
      particleCount: 25,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#10b981', '#06b6d4'],
    });
  };

  // Record 5-second rotating WebM video via Canvas Stream
  const handleRecordVideo = () => {
    const canvas = containerRef.current?.querySelector('canvas');
    if (!canvas || isRecording) return;

    try {
      const stream = canvas.captureStream(30);
      const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `omnidata_3d_${analysis.chartType.toLowerCase()}_${Date.now()}.webm`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setIsRecording(false);

        confetti({
          particleCount: 30,
          spread: 70,
          origin: { y: 0.7 },
          colors: ['#a855f7', '#10b981'],
        });
      };

      setIsRecording(true);
      recorder.start();

      setTimeout(() => {
        if (recorder.state === 'recording') {
          recorder.stop();
        }
      }, 5000);
    } catch (e) {
      console.error('Video recording failed:', e);
      setIsRecording(false);
    }
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="space-y-3 font-mono">
      {/* 3D Viewport Toolbar with Camera UX Controls */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#0d1117] border border-slate-800 shadow-xl">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
            {analysis.chartType.replace('_', ' ')}
          </span>
          <span className="text-xs text-white font-bold truncate max-w-xs sm:max-w-md font-mono">
            {analysis.title}
          </span>
        </div>

        {/* Camera UX and Media Export Affordances */}
        <div className="flex items-center gap-1.5 flex-wrap text-xs">
          {/* Zoom Controls */}
          <div className="flex items-center p-0.5 rounded-lg bg-[#161b22] border border-slate-800 text-[11px]">
            <button
              type="button"
              onClick={handleZoomOut}
              className="p-1 rounded text-slate-400 hover:text-white cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 text-slate-300 font-mono text-[10px] font-bold">
              {zoomLevel}%
            </span>
            <button
              type="button"
              onClick={handleZoomIn}
              className="p-1 rounded text-slate-400 hover:text-white cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Reset View Button */}
          <button
            type="button"
            onClick={handleResetView}
            className="px-2.5 py-1.5 rounded-lg bg-[#161b22] border border-slate-800 text-slate-300 hover:text-white font-medium transition-all flex items-center gap-1 cursor-pointer"
            title="Reset Camera Orientation & Zoom"
          >
            <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
            <span>Reset View</span>
          </button>

          {/* Auto Rotate Toggle */}
          <button
            type="button"
            onClick={onToggleAutoRotate}
            className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all flex items-center gap-1 cursor-pointer ${
              isAutoRotate
                ? 'bg-emerald-500 text-black font-bold border-emerald-400 shadow-sm'
                : 'bg-[#161b22] border-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <RotateCw className={`w-3.5 h-3.5 ${isAutoRotate ? 'animate-spin' : ''}`} />
            <span>{isAutoRotate ? 'Rotating' : 'Static'}</span>
          </button>

          {/* Snapshot Button */}
          <button
            type="button"
            onClick={handleTakeSnapshot}
            className="px-2.5 py-1.5 rounded-lg bg-[#161b22] border border-slate-800 text-slate-300 hover:text-white font-medium transition-all flex items-center gap-1 cursor-pointer"
            title="Export high-resolution PNG snapshot"
          >
            <Camera className="w-3.5 h-3.5 text-cyan-400" />
            <span>Snapshot</span>
          </button>

          {/* Video Record Button */}
          <button
            type="button"
            onClick={handleRecordVideo}
            disabled={isRecording}
            className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all flex items-center gap-1 cursor-pointer ${
              isRecording
                ? 'bg-rose-500 text-white animate-pulse border-rose-400 font-bold'
                : 'bg-[#161b22] border-slate-800 text-slate-300 hover:text-white'
            }`}
            title="Record 5-second rotating 3D video"
          >
            <Video className="w-3.5 h-3.5 text-purple-400" />
            <span>{isRecording ? 'Recording (5s)...' : 'Record MP4'}</span>
          </button>

          {/* Share Link */}
          <button
            type="button"
            onClick={copyShareLink}
            className="px-2.5 py-1.5 rounded-lg bg-[#161b22] border border-slate-800 text-slate-300 hover:text-white font-medium transition-all flex items-center gap-1 cursor-pointer"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Copied' : 'Share'}</span>
          </button>
        </div>
      </div>

      {/* 3D WebGL Canvas Viewport with Persistent HUD Legend Overlay */}
      <div ref={containerRef} className="w-full relative shadow-2xl rounded-2xl overflow-hidden border border-slate-800">
        {analysis.chartType === 'GLOBE_3D' && (
          <Globe3D
            points={analysis.data.globePoints}
            arcs={analysis.data.globeArcs}
            colorScheme={colorScheme}
            isAutoRotate={isAutoRotate}
            zoomLevel={zoomLevel}
            resetViewTrigger={resetViewTrigger}
          />
        )}

        {analysis.chartType === 'NETWORK_GRAPH' && (
          <NetworkGraph3D
            nodes={analysis.data.nodes}
            links={analysis.data.links}
            colorScheme={colorScheme}
            isAutoRotate={isAutoRotate}
            zoomLevel={zoomLevel}
            resetViewTrigger={resetViewTrigger}
          />
        )}

        {analysis.chartType === 'BAR_3D' && (
          <BarChart3D
            bars={analysis.data.bars}
            colorScheme={colorScheme}
            isAutoRotate={isAutoRotate}
            zoomLevel={zoomLevel}
            resetViewTrigger={resetViewTrigger}
          />
        )}

        {analysis.chartType === 'SCATTER_3D' && (
          <ScatterPlot3D
            points={analysis.data.scatter}
            colorScheme={colorScheme}
            isAutoRotate={isAutoRotate}
            zoomLevel={zoomLevel}
            resetViewTrigger={resetViewTrigger}
          />
        )}

        {/* PERSISTENT FLOATING HUD LEGEND OVERLAY */}
        <div className="absolute top-4 right-4 p-3 rounded-xl bg-[#060e14]/90 backdrop-blur-md border border-slate-800 text-[10px] font-mono text-slate-300 space-y-2 shadow-2xl max-w-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
            <span className="text-[10px] text-emerald-400 font-bold uppercase flex items-center gap-1">
              <Compass className="w-3 h-3 text-cyan-400" />
              <span>Spatial Legend &amp; Encoding</span>
            </span>
            <span className="text-[9px] text-slate-500 font-mono">LIVE HUD</span>
          </div>

          <div className="space-y-1.5 text-[10px]">
            <div className="flex items-center justify-between gap-2">
              <span className="text-slate-400">Marker Height / Size:</span>
              <span className="text-white font-bold">Metric Magnitude</span>
            </div>

            <div className="flex items-center justify-between gap-2">
              <span className="text-slate-400">Connecting Arcs / Lines:</span>
              <span className="text-cyan-300 font-bold">Relational Flow</span>
            </div>

            {/* Categorical Color Encoding Chips */}
            <div className="pt-1 border-t border-slate-800/80 space-y-1">
              <span className="text-slate-400 text-[9px] block">Category Color Encoding:</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Americas / VC
                </span>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[9px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" /> Europe / AI
                </span>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[9px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400" /> Asia / Infra
                </span>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[9px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Middle East
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Orbit Drag Hint (Bottom-Left) */}
        <div className="absolute bottom-4 left-4 p-2.5 rounded-xl bg-[#060e14]/80 backdrop-blur-md border border-slate-800 text-[10px] font-mono text-slate-400 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Click &amp; Drag Canvas to Orbit 3D Space</span>
        </div>
      </div>
    </div>
  );
}
