'use client';

import { PenTool, Share2, Download, Users, ZoomIn, ZoomOut, RotateCcw, ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface Props {
  roomId: string;
  elementCount: number;
  onExport: (format: 'svg' | 'png') => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  scale: number;
}

const USER_COLORS = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];

// Simulated live presence (in a real app, this would come from Liveblocks)
const DEMO_USERS = [
  { name: 'You', color: '#6366f1', active: true },
  { name: 'Fatima', color: '#06b6d4', active: Math.random() > 0.5 },
  { name: 'Ali', color: '#10b981', active: Math.random() > 0.7 },
];

export default function Header({ roomId, elementCount, onExport, onZoomIn, onZoomOut, onResetView, scale }: Props) {
  const [copied, setCopied] = useState(false);
  const [showExport, setShowExport] = useState(false);

  const shareLink = typeof window !== 'undefined' ? `${window.location.origin}/board/${roomId}` : '';

  const handleCopy = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-30 h-14 flex items-center justify-between px-4 bg-[#080c14]/90 backdrop-blur-xl border-b border-white/8">
      {/* Left: Logo + Room ID */}
      <div className="flex items-center gap-4">
        <a href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center">
            <PenTool className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-black text-sm hidden sm:block">CanvasFlow<span className="text-indigo-400">.AI</span></span>
        </a>
        <div className="h-4 w-px bg-white/10 hidden sm:block" />
        <button
          onClick={handleCopy}
          title="Click to copy board link"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/8 hover:border-indigo-500/40 transition-all cursor-pointer group"
        >
          <span className="text-xs font-mono text-slate-400 group-hover:text-indigo-300 transition-colors max-w-[120px] sm:max-w-[200px] truncate">
            {copied ? '✓ Link Copied!' : roomId}
          </span>
          <Share2 className="w-3 h-3 text-slate-500 shrink-0" />
        </button>
      </div>

      {/* Center: Zoom Controls */}
      <div className="flex items-center gap-1 px-2 py-1 rounded-xl bg-white/5 border border-white/8">
        <button
          onClick={onZoomOut}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/8 transition-all cursor-pointer"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={onResetView}
          className="px-2 py-1 text-xs font-mono text-slate-300 hover:text-indigo-300 transition-colors cursor-pointer min-w-[48px] text-center"
        >
          {Math.round(scale * 100)}%
        </button>
        <button
          onClick={onZoomIn}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/8 transition-all cursor-pointer"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={onResetView}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/8 transition-all cursor-pointer"
          title="Reset view"
        >
          <RotateCcw className="w-3 h-3" />
        </button>
      </div>

      {/* Right: Users + Export + Share */}
      <div className="flex items-center gap-2">
        {/* Live Users */}
        <div className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/5 border border-white/8">
          <Users className="w-3.5 h-3.5 text-slate-400 mr-1" />
          {DEMO_USERS.filter(u => u.active).map((user, i) => (
            <div
              key={i}
              className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-black text-white border-2 border-[#080c14] -ml-1 first:ml-0"
              style={{ background: user.color }}
              title={user.name}
            >
              {user.name[0]}
            </div>
          ))}
          <span className="text-xs text-slate-500 ml-1 font-mono">{DEMO_USERS.filter(u => u.active).length}</span>
        </div>

        {/* Element counter */}
        <div className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/5 border border-white/8 text-xs text-slate-400 font-mono">
          <span>{elementCount} objects</span>
        </div>

        {/* Export */}
        <div className="relative">
          <button
            onClick={() => setShowExport(!showExport)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all cursor-pointer shadow-lg shadow-indigo-500/20"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:block">Export</span>
            <ChevronDown className="w-3 h-3" />
          </button>
          {showExport && (
            <div className="absolute top-10 right-0 min-w-[140px] bg-[#111827] border border-white/10 rounded-xl overflow-hidden shadow-xl z-50">
              {[
                { label: 'Export as SVG', format: 'svg' as const },
                { label: 'Export as PNG', format: 'png' as const },
              ].map((item) => (
                <button
                  key={item.format}
                  onClick={() => { onExport(item.format); setShowExport(false); }}
                  className="w-full px-4 py-2.5 text-left text-sm text-slate-300 hover:bg-white/8 hover:text-white transition-all cursor-pointer"
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
