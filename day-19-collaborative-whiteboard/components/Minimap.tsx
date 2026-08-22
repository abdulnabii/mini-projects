'use client';

import { CanvasElement } from '@/types';
import { useEffect, useRef } from 'react';

interface Props {
  elements: CanvasElement[];
  viewOffset: { x: number; y: number };
  scale: number;
}

const MINIMAP_W = 180;
const MINIMAP_H = 120;
const CANVAS_W = 3000;
const CANVAS_H = 2000;

export default function Minimap({ elements, viewOffset, scale }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, MINIMAP_W, MINIMAP_H);

    // Background
    ctx.fillStyle = '#080c14';
    ctx.fillRect(0, 0, MINIMAP_W, MINIMAP_H);

    const scaleX = MINIMAP_W / CANVAS_W;
    const scaleY = MINIMAP_H / CANVAS_H;

    // Draw elements as dots
    elements.forEach((el) => {
      const x = (el.x + 1500) * scaleX;
      const y = (el.y + 1000) * scaleY;
      const w = ((el.width ?? 60) * scaleX) || 6;
      const h = ((el.height ?? 40) * scaleY) || 6;

      ctx.fillStyle = el.stroke ?? el.fill ?? '#6366f1';
      ctx.globalAlpha = 0.7;

      if (el.type === 'sticky') {
        ctx.fillStyle = el.stickyColor ?? '#fef08a';
      }

      ctx.beginPath();
      ctx.roundRect(Math.max(0, x), Math.max(0, y), Math.max(4, w), Math.max(4, h), 1);
      ctx.fill();
      ctx.globalAlpha = 1;
    });

    // Viewport indicator
    const vpW = (window.innerWidth / scale) * scaleX;
    const vpH = (window.innerHeight / scale) * scaleY;
    const vpX = ((-viewOffset.x / scale) + 1500) * scaleX;
    const vpY = ((-viewOffset.y / scale) + 1000) * scaleY;

    ctx.strokeStyle = 'rgba(99, 102, 241, 0.8)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(vpX, vpY, vpW, vpH);

    // Viewport fill
    ctx.fillStyle = 'rgba(99, 102, 241, 0.06)';
    ctx.fillRect(vpX, vpY, vpW, vpH);
  }, [elements, viewOffset, scale]);

  return (
    <div className="fixed bottom-6 right-6 z-20 rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/60 bg-[#080c14]">
      <div className="px-3 py-1.5 bg-[#111827] border-b border-white/8 flex items-center justify-between">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Minimap</span>
        <span className="text-[10px] text-slate-500 font-mono">{Math.round(scale * 100)}%</span>
      </div>
      <canvas
        ref={canvasRef}
        width={MINIMAP_W}
        height={MINIMAP_H}
        className="block"
      />
    </div>
  );
}
