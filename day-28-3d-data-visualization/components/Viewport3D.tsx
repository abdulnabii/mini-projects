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
  Maximize2,
  Minimize2,
  Sparkles,
  Layers,
  RotateCw,
  Download,
  Share2,
  Check,
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

  // Take high-res snapshot of WebGL canvas
  const handleTakeSnapshot = () => {
    const canvas = containerRef.current?.querySelector('canvas');
    if (!canvas) return;

    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `omnidata_3d_snapshot_${Date.now()}.png`;
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
        a.download = `omnidata_3d_rotation_${Date.now()}.webm`;
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
    <div className="space-y-4 font-mono">
      {/* 3D Viewport Controls Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#0d1117] border border-slate-800 shadow-xl">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
            {analysis.chartType.replace('_', ' ')}
          </span>
          <span className="text-xs text-white font-bold truncate max-w-xs sm:max-w-md">
            {analysis.title}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap text-xs">
          {/* Auto Rotate Toggle */}
          <button
            type="button"
            onClick={onToggleAutoRotate}
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
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
            className="px-3 py-1.5 rounded-lg bg-[#161b22] border border-slate-800 text-slate-300 hover:text-white font-medium transition-all flex items-center gap-1.5 cursor-pointer"
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
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              isRecording
                ? 'bg-rose-500 text-white animate-pulse border-rose-400 font-bold'
                : 'bg-[#161b22] border-slate-800 text-slate-300 hover:text-white'
            }`}
            title="Record 5-second 3D rotation video"
          >
            <Video className="w-3.5 h-3.5 text-purple-400" />
            <span>{isRecording ? 'Recording (5s)...' : 'Record MP4'}</span>
          </button>

          {/* Share Link */}
          <button
            type="button"
            onClick={copyShareLink}
            className="px-3 py-1.5 rounded-lg bg-[#161b22] border border-slate-800 text-slate-300 hover:text-white font-medium transition-all flex items-center gap-1.5 cursor-pointer"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Copied' : 'Share'}</span>
          </button>
        </div>
      </div>

      {/* 3D WebGL Canvas Viewport */}
      <div ref={containerRef} className="w-full relative shadow-2xl rounded-2xl overflow-hidden">
        {analysis.chartType === 'GLOBE_3D' && (
          <Globe3D
            points={analysis.data.globePoints}
            arcs={analysis.data.globeArcs}
            colorScheme={colorScheme}
            isAutoRotate={isAutoRotate}
          />
        )}

        {analysis.chartType === 'NETWORK_GRAPH' && (
          <NetworkGraph3D
            nodes={analysis.data.nodes}
            links={analysis.data.links}
            colorScheme={colorScheme}
            isAutoRotate={isAutoRotate}
          />
        )}

        {analysis.chartType === 'BAR_3D' && (
          <BarChart3D
            bars={analysis.data.bars}
            colorScheme={colorScheme}
            isAutoRotate={isAutoRotate}
          />
        )}

        {analysis.chartType === 'SCATTER_3D' && (
          <ScatterPlot3D
            points={analysis.data.scatter}
            colorScheme={colorScheme}
            isAutoRotate={isAutoRotate}
          />
        )}
      </div>
    </div>
  );
}
