'use client';

import { useState } from 'react';
import { GridStyle, DiagramSpec } from '@/types';
import { STARTER_TEMPLATES } from '@/lib/shapes';
import {
  PenTool,
  Share2,
  Download,
  Users,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ChevronDown,
  LayoutTemplate,
  Grid,
  Check,
  FileCode,
  Image as ImageIcon,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

interface Props {
  roomId: string;
  boardTitle: string;
  onTitleChange: (title: string) => void;
  elementCount: number;
  onExport: (format: 'svg' | 'png' | 'json') => void;
  onLoadTemplate: (spec: DiagramSpec) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  scale: number;
  gridStyle: GridStyle;
  onGridStyleChange: (grid: GridStyle) => void;
  showCollaborators: boolean;
  onToggleCollaborators: () => void;
}

const DEMO_USERS = [
  { name: 'You', color: '#6366f1', role: 'Architect (Host)' },
  { name: 'Fatima R.', color: '#ec4899', role: 'Lead Frontend' },
  { name: 'Ali K.', color: '#06b6d4', role: 'Backend Engineer' },
  { name: 'Devon M.', color: '#10b981', role: 'DevOps / SRE' },
];

export default function Header({
  roomId,
  boardTitle,
  onTitleChange,
  elementCount,
  onExport,
  onLoadTemplate,
  onZoomIn,
  onZoomOut,
  onResetView,
  scale,
  gridStyle,
  onGridStyleChange,
  showCollaborators,
  onToggleCollaborators,
}: Props) {
  const [copied, setCopied] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showTemplateMenu, setShowTemplateMenu] = useState(false);
  const [showGridMenu, setShowGridMenu] = useState(false);
  const [showUsersModal, setShowUsersModal] = useState(false);

  const shareLink = typeof window !== 'undefined' ? `${window.location.origin}/board/${roomId}` : '';

  const handleCopy = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="fixed top-3 left-4 right-4 z-40 h-14 flex items-center justify-between px-4 bg-[#0a0f1d]/90 backdrop-blur-2xl border border-cyan-500/30 rounded-2xl shadow-2xl shadow-black/80 font-sans select-none">
      {/* Left: Brand + Board Title */}
      <div className="flex items-center gap-3">
        <a href="/" className="flex items-center gap-2 shrink-0 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <PenTool className="w-4 h-4 text-white" />
          </div>
          <span className="font-black text-sm text-white hidden md:inline tracking-tight">
            CanvasFlow<span className="text-cyan-400">.AI</span>
          </span>
        </a>

        <div className="h-5 w-px bg-slate-800 hidden sm:block" />

        {/* Editable Title */}
        <input
          value={boardTitle}
          onChange={(e) => onTitleChange(e.target.value)}
          className="bg-transparent text-sm font-bold text-white hover:bg-white/5 focus:bg-slate-900 px-2.5 py-1 rounded-xl border border-transparent focus:border-cyan-500/50 outline-none transition-all max-w-[150px] sm:max-w-[240px] truncate"
          title="Click to rename board"
        />

        {/* Room Code Badge */}
        <button
          onClick={handleCopy}
          className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 text-[11px] font-mono text-slate-300 transition-all cursor-pointer group"
          title="Copy shareable link"
        >
          <span>{copied ? '✓ Copied!' : roomId}</span>
          <Share2 className="w-3 h-3 text-cyan-400 group-hover:scale-110 transition-transform" />
        </button>
      </div>

      {/* Center: Zoom & View Controls */}
      <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-950/80 border border-slate-800">
        <button
          onClick={onZoomOut}
          title="Zoom Out (-)"
          className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={onResetView}
          title="Click to reset 100% view"
          className="px-2 py-1 text-xs font-mono text-cyan-300 font-bold hover:text-white cursor-pointer min-w-[44px] text-center"
        >
          {Math.round(scale * 100)}%
        </button>

        <button
          onClick={onZoomIn}
          title="Zoom In (+)"
          className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={onResetView}
          title="Reset Canvas Center"
          className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
        </button>
      </div>

      {/* Right: Starters, Grid Switcher, Live Presence, Export */}
      <div className="flex items-center gap-2">
        {/* Templates Starter Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowTemplateMenu(!showTemplateMenu)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-xs font-bold text-slate-200 transition-all cursor-pointer"
          >
            <LayoutTemplate className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Templates</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {showTemplateMenu && (
            <div className="absolute top-11 right-0 w-72 p-2 rounded-2xl bg-[#0b1222]/95 border border-cyan-500/30 backdrop-blur-2xl shadow-2xl z-50 space-y-1.5 animate-in fade-in-50 duration-150">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block px-2 pt-1">
                Starter Visual Architectures
              </span>
              {STARTER_TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.id}
                  onClick={() => {
                    onLoadTemplate(tmpl.spec);
                    setShowTemplateMenu(false);
                  }}
                  className="w-full p-2.5 rounded-xl hover:bg-white/10 text-left transition-all cursor-pointer flex items-start gap-2.5 group"
                >
                  <span className="text-lg">{tmpl.icon}</span>
                  <div>
                    <h5 className="font-bold text-xs text-white group-hover:text-cyan-300">
                      {tmpl.name}
                    </h5>
                    <p className="text-[10px] text-slate-400 leading-tight mt-0.5">{tmpl.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Grid Background Switcher */}
        <div className="relative">
          <button
            onClick={() => setShowGridMenu(!showGridMenu)}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-slate-300 transition-all cursor-pointer"
            title="Canvas Grid Layout"
          >
            <Grid className="w-3.5 h-3.5 text-cyan-400" />
          </button>

          {showGridMenu && (
            <div className="absolute top-11 right-0 w-44 p-1.5 rounded-2xl bg-[#0b1222]/95 border border-cyan-500/30 backdrop-blur-2xl shadow-2xl z-50 space-y-1 animate-in fade-in-50 duration-150">
              {[
                { id: 'dots' as GridStyle, label: 'Dots Matrix' },
                { id: 'grid' as GridStyle, label: 'Graph Lines' },
                { id: 'blueprint' as GridStyle, label: 'Blueprint Grid' },
                { id: 'blank' as GridStyle, label: 'Clean Blank' },
              ].map((g) => (
                <button
                  key={g.id}
                  onClick={() => {
                    onGridStyleChange(g.id);
                    setShowGridMenu(false);
                  }}
                  className={`w-full px-3 py-2 rounded-xl text-xs font-bold text-left transition-all cursor-pointer flex items-center justify-between ${
                    gridStyle === g.id
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <span>{g.label}</span>
                  {gridStyle === g.id && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Live Collaborators Presence Stack */}
        <button
          onClick={onToggleCollaborators}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
            showCollaborators
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-slate-900 border-slate-800 text-slate-400'
          }`}
          title="Toggle live collaborator cursors"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <Users className="w-3.5 h-3.5 ml-1" />
          <div className="flex -space-x-1.5 ml-1">
            {DEMO_USERS.slice(0, 3).map((u, i) => (
              <div
                key={i}
                className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-black text-white border border-[#0a0f1d]"
                style={{ background: u.color }}
              >
                {u.name[0]}
              </div>
            ))}
          </div>
          <span className="text-[11px] font-bold font-mono ml-1">{DEMO_USERS.length}</span>
        </button>

        {/* Export Hub Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-xs shadow-md shadow-cyan-500/20 hover:scale-105 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span>
            <ChevronDown className="w-3 h-3" />
          </button>

          {showExportMenu && (
            <div className="absolute top-11 right-0 w-52 p-1.5 rounded-2xl bg-[#0b1222]/95 border border-cyan-500/30 backdrop-blur-2xl shadow-2xl z-50 space-y-1 animate-in fade-in-50 duration-150">
              <button
                onClick={() => {
                  onExport('png');
                  setShowExportMenu(false);
                }}
                className="w-full px-3 py-2.5 rounded-xl hover:bg-white/10 text-left text-xs font-bold text-slate-200 transition-all cursor-pointer flex items-center gap-2"
              >
                <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                <span>Export High-Res PNG (Retina)</span>
              </button>

              <button
                onClick={() => {
                  onExport('svg');
                  setShowExportMenu(false);
                }}
                className="w-full px-3 py-2.5 rounded-xl hover:bg-white/10 text-left text-xs font-bold text-slate-200 transition-all cursor-pointer flex items-center gap-2"
              >
                <FileCode className="w-3.5 h-3.5 text-indigo-400" />
                <span>Export Vector SVG</span>
              </button>

              <button
                onClick={() => {
                  onExport('json');
                  setShowExportMenu(false);
                }}
                className="w-full px-3 py-2.5 rounded-xl hover:bg-white/10 text-left text-xs font-bold text-slate-200 transition-all cursor-pointer flex items-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Export JSON Project File</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
