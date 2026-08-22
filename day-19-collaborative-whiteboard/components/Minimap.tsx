'use client';

import { useEffect, useRef } from 'react';
import { CanvasElement } from '@/types';
import { MapPin } from 'lucide-react';

interface Props {
  elements: CanvasElement[];
  viewOffset: { x: number; y: number };
  scale: number;
  onNavigateTo?: (x: number, y: number) => void;
}

const MINIMAP_W = 190;
const MINIMAP_H = 130;
const CANVAS_BOUNDS = 3000;

export default function Minimap({ elements, viewOffset, scale, onNavigateTo }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, MINIMAP_W, MINIMAP_H);

    // Background Fill
    ctx.fillStyle = '#060911';
    ctx.fillRect(0, 0, MINIMAP_W, MINIMAP_H);

    // Subtle Grid on Minimap
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let x = 0; x < MINIMAP_W; x += 20) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, MINIMAP_H);
      ctx.stroke();
    }
    for (let y = 0; y < MINIMAP_H; y += 20) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(MINIMAP_W, y);
      ctx.stroke();
    }

    const scaleFactor = MINIMAP_W / CANVAS_BOUNDS;

    // Draw Elements
    elements.forEach((el) => {
      const x = (el.x + 800) * scaleFactor;
      const y = (el.y + 600) * scaleFactor;
      const w = ((el.width ?? 60) * scaleFactor) || 5;
      const h = ((el.height ?? 40) * scaleFactor) || 5;

      ctx.fillStyle = el.stroke ?? el.fill ?? '#38bdf8';
      ctx.globalAlpha = 0.8;

      if (el.type === 'sticky') {
        ctx.fillStyle = el.stickyColor ?? '#fef08a';
      }

      ctx.beginPath();
      ctx.roundRect(Math.max(0, x), Math.max(0, y), Math.max(4, w), Math.max(4, h), 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    });

    // Viewport Bounding Indicator
    if (typeof window !== 'undefined') {
      const vpW = (window.innerWidth / scale) * scaleFactor;
      const vpH = (window.innerHeight / scale) * scaleFactor;
      const vpX = (-viewOffset.x / scale + 800) * scaleFactor;
      const vpY = (-viewOffset.y / scale + 600) * scaleFactor;

      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(vpX, vpY, vpW, vpH);

      ctx.fillStyle = 'rgba(56, 189, 248, 0.12)';
      ctx.fillRect(vpX, vpY, vpW, vpH);
    }
  }, [elements, viewOffset, scale]);

  return (
    <div className="fixed bottom-6 right-6 z-30 rounded-2xl overflow-hidden border border-cyan-500/30 shadow-2xl shadow-black/80 bg-[#090e1c]/90 backdrop-blur-xl font-mono select-none">
      <div className="px-3 py-1.5 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between text-[10px]">
        <span className="font-bold text-slate-300 flex items-center gap-1">
          <MapPin className="w-3 h-3 text-cyan-400" />
          Minimap
        </span>
        <span className="text-cyan-400 font-bold">{Math.round(scale * 100)}%</span>
      </div>
      <canvas ref={canvasRef} width={MINIMAP_W} height={MINIMAP_H} className="block" />
    </div>
  );
}
