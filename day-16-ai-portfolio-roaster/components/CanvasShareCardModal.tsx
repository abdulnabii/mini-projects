'use client';

import { useEffect, useRef, useState } from 'react';
import { RoastResult } from '@/types';
import { Download, X, Image as ImageIcon, Flame, Check } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  roast: RoastResult;
}

export default function CanvasShareCardModal({ isOpen, onClose, roast }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [downloaded, setDownloaded] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Canvas dimensions (1200x630 Social Card)
    const W = 1200;
    const H = 630;
    canvas.width = W;
    canvas.height = H;

    // Background
    const bgGradient = ctx.createLinearGradient(0, 0, W, H);
    bgGradient.addColorStop(0, '#080a0f');
    bgGradient.addColorStop(0.5, '#0f1422');
    bgGradient.addColorStop(1, '#080a0f');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, W, H);

    // Glowing Flame Orbs in corners
    const glow1 = ctx.createRadialGradient(W - 100, 100, 10, W - 100, 100, 350);
    glow1.addColorStop(0, 'rgba(249, 115, 22, 0.25)');
    glow1.addColorStop(1, 'rgba(249, 115, 22, 0)');
    ctx.fillStyle = glow1;
    ctx.fillRect(0, 0, W, H);

    const glow2 = ctx.createRadialGradient(100, H - 100, 10, 100, H - 100, 300);
    glow2.addColorStop(0, 'rgba(239, 68, 68, 0.2)');
    glow2.addColorStop(1, 'rgba(239, 68, 68, 0)');
    ctx.fillStyle = glow2;
    ctx.fillRect(0, 0, W, H);

    // Outer Card Border
    ctx.strokeStyle = 'rgba(249, 115, 22, 0.4)';
    ctx.lineWidth = 3;
    ctx.strokeRect(30, 30, W - 60, H - 60);

    // Header Tag
    ctx.fillStyle = '#f97316';
    ctx.font = 'bold 20px monospace';
    ctx.fillText('🔥 PORTFOLIOROASTER.AI • OFFICIAL CRITIQUE REPORT', 60, 85);

    // Candidate Name
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 44px sans-serif';
    ctx.fillText(`${roast.developerName}'s Portfolio`, 60, 145);

    // URL or Handle
    ctx.fillStyle = '#94a3b8';
    ctx.font = '22px monospace';
    ctx.fillText(`Target: ${roast.targetUrlOrTitle}`, 60, 185);

    // Score Circle Box (Right Side)
    const scoreX = W - 280;
    const scoreY = 70;
    ctx.fillStyle = '#0a0e1a';
    ctx.strokeStyle = '#f97316';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(scoreX, scoreY, 200, 140, 20);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 64px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${roast.overallScore}`, scoreX + 100, scoreY + 80);

    ctx.fillStyle = '#f97316';
    ctx.font = 'bold 16px monospace';
    ctx.fillText('OVERALL SCORE', scoreX + 100, scoreY + 115);

    ctx.textAlign = 'left';

    // Top Roast Punchline Box
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.strokeStyle = 'rgba(249, 115, 22, 0.6)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(60, 240, W - 120, 240, 24);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#f97316';
    ctx.font = 'bold 18px monospace';
    ctx.fillText('SAVAGE CHIEF CRITIC VERDICT:', 90, 285);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'italic bold 28px serif';
    const quote = `"${roast.topRoastPunchline}"`;

    // Word wrap the quote
    const words = quote.split(' ');
    let line = '';
    let y = 335;
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > W - 220 && n > 0) {
        ctx.fillText(line, 90, y);
        line = words[n] + ' ';
        y += 40;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, 90, y);

    // Footer Watermark & Survival Badge
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 20px monospace';
    ctx.fillText(`🛡️ ${roast.survivalBadge}`, 60, 550);

    ctx.fillStyle = '#64748b';
    ctx.font = '16px monospace';
    ctx.fillText('Roast your own portfolio at: day-16-ai-portfolio-roaster.vercel.app', 60, 580);
  }, [isOpen, roast]);

  if (!isOpen) return null;

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `${roast.developerName.toLowerCase().replace(/\s+/g, '-')}-portfolio-roast.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 font-mono text-xs text-slate-300">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0f1420] border-2 border-orange-500/40 p-6 sm:p-8 space-y-6 shadow-2xl shadow-orange-500/20">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base font-outfit">Downloadable 1200×630px Social Roast Card</h3>
              <p className="text-xs text-slate-400">High-resolution PNG ready for X (Twitter), LinkedIn, and Discord</p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Canvas Display */}
        <div className="overflow-hidden rounded-2xl border-2 border-slate-800 bg-black flex justify-center shadow-2xl">
          <canvas ref={canvasRef} className="w-full h-auto max-h-[420px] object-contain" />
        </div>

        {/* Download Action Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-bold hover:text-white"
          >
            Close
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 via-red-600 to-amber-500 text-black font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-orange-500/20 hover:scale-105 transition-all cursor-pointer"
          >
            {downloaded ? <Check className="w-4 h-4" /> : <Download className="w-4 h-4" />}
            <span>{downloaded ? 'Downloaded PNG!' : 'Download 1200x630 PNG'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
