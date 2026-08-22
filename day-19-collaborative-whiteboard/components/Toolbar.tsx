'use client';

import { useState } from 'react';
import { ToolType, DrawStyle } from '@/types';
import {
  MousePointer2,
  Hand,
  PenLine,
  Highlighter,
  Flame,
  Square,
  Circle,
  Diamond,
  Database,
  Cloud,
  ArrowRight,
  GitCommit,
  Minus,
  Type,
  StickyNote,
  LayoutGrid,
  Sparkles,
  Undo2,
  Redo2,
  Trash2,
  Sliders,
  Palette,
  ChevronUp,
} from 'lucide-react';

interface Props {
  activeTool: ToolType;
  onToolChange: (tool: ToolType) => void;
  style: DrawStyle;
  onStyleChange: (updates: Partial<DrawStyle>) => void;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onOpenAI: () => void;
}

const STROKE_PALETTE = [
  '#ffffff',
  '#6366f1',
  '#38bdf8',
  '#10b981',
  '#f59e0b',
  '#ec4899',
  '#ef4444',
  '#8b5cf6',
];

const FILL_PALETTE = [
  'transparent',
  'rgba(99,102,241,0.15)',
  'rgba(56,189,248,0.15)',
  'rgba(16,185,129,0.15)',
  'rgba(245,158,11,0.15)',
  'rgba(236,72,153,0.15)',
  'rgba(239,68,68,0.15)',
];

export default function Toolbar({
  activeTool,
  onToolChange,
  style,
  onStyleChange,
  onUndo,
  onRedo,
  onClear,
  canUndo,
  canRedo,
  onOpenAI,
}: Props) {
  const [showShapeMenu, setShowShapeMenu] = useState(false);
  const [showConnectorMenu, setShowConnectorMenu] = useState(false);
  const [showStylePanel, setShowStylePanel] = useState(false);

  const isShapeActive = ['rectangle', 'rounded_rect', 'ellipse', 'diamond', 'cylinder', 'cloud'].includes(
    activeTool
  );
  const isConnectorActive = ['arrow', 'step_arrow', 'line'].includes(activeTool);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-3 select-none">
      {/* Floating Style Panel Popover */}
      {showStylePanel && (
        <div className="p-4 rounded-3xl bg-[#0b1222]/95 border border-cyan-500/30 backdrop-blur-2xl shadow-2xl shadow-black/80 flex flex-col gap-3.5 text-xs animate-in slide-in-from-bottom-3 duration-200">
          {/* Stroke Palette */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Stroke Color
            </span>
            <div className="flex items-center gap-1.5">
              {STROKE_PALETTE.map((c) => (
                <button
                  key={c}
                  onClick={() => onStyleChange({ stroke: c })}
                  className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 cursor-pointer ${
                    style.stroke === c ? 'border-white scale-110 shadow-md' : 'border-transparent'
                  }`}
                  style={{ background: c }}
                />
              ))}
            </div>
          </div>

          {/* Fill Palette */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Fill Tint
            </span>
            <div className="flex items-center gap-1.5">
              {FILL_PALETTE.map((c, i) => (
                <button
                  key={i}
                  onClick={() => onStyleChange({ fill: c })}
                  className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 cursor-pointer flex items-center justify-center ${
                    style.fill === c ? 'border-white scale-110 shadow-md' : 'border-white/20'
                  }`}
                  style={{ background: c === 'transparent' ? '#1e293b' : c }}
                >
                  {c === 'transparent' && <span className="text-[9px] text-slate-400">∅</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Stroke Width Slider */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase">
              <span>Stroke Thickness</span>
              <span className="text-cyan-400">{style.strokeWidth}px</span>
            </div>
            <div className="flex items-center gap-2">
              {[1, 2, 4, 6, 8].map((w) => (
                <button
                  key={w}
                  onClick={() => onStyleChange({ strokeWidth: w })}
                  className={`flex-1 py-1.5 rounded-xl font-mono text-[11px] font-bold transition-all cursor-pointer ${
                    style.strokeWidth === w
                      ? 'bg-cyan-500 text-black shadow-md'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {w}px
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Shapes Dropup Menu */}
      {showShapeMenu && (
        <div className="p-2 rounded-2xl bg-[#0b1222]/95 border border-cyan-500/30 backdrop-blur-2xl shadow-2xl flex items-center gap-1.5 animate-in slide-in-from-bottom-2 duration-150">
          {[
            { id: 'rectangle' as ToolType, icon: Square, label: 'Sharp Rect' },
            { id: 'rounded_rect' as ToolType, icon: LayoutGrid, label: 'Rounded Rect' },
            { id: 'ellipse' as ToolType, icon: Circle, label: 'Circle' },
            { id: 'diamond' as ToolType, icon: Diamond, label: 'Decision Diamond' },
            { id: 'cylinder' as ToolType, icon: Database, label: 'DB Cylinder' },
            { id: 'cloud' as ToolType, icon: Cloud, label: 'Cloud' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onToolChange(item.id);
                setShowShapeMenu(false);
              }}
              title={item.label}
              className={`p-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold ${
                activeTool === item.id
                  ? 'bg-cyan-500 text-black shadow-md'
                  : 'text-slate-300 hover:bg-white/10'
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{item.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Connectors Dropup Menu */}
      {showConnectorMenu && (
        <div className="p-2 rounded-2xl bg-[#0b1222]/95 border border-cyan-500/30 backdrop-blur-2xl shadow-2xl flex items-center gap-1.5 animate-in slide-in-from-bottom-2 duration-150">
          {[
            { id: 'arrow' as ToolType, icon: ArrowRight, label: 'Straight Arrow' },
            { id: 'step_arrow' as ToolType, icon: GitCommit, label: 'Step / Elbow Arrow' },
            { id: 'line' as ToolType, icon: Minus, label: 'Straight Line' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onToolChange(item.id);
                setShowConnectorMenu(false);
              }}
              title={item.label}
              className={`p-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold ${
                activeTool === item.id
                  ? 'bg-cyan-500 text-black shadow-md'
                  : 'text-slate-300 hover:bg-white/10'
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Main Floating Island Dock */}
      <div className="flex items-center gap-1.5 p-2 rounded-3xl bg-[#0a101f]/95 border-2 border-cyan-500/30 backdrop-blur-2xl shadow-2xl shadow-black/80">
        {/* Select */}
        <button
          onClick={() => {
            onToolChange('select');
            setShowShapeMenu(false);
            setShowConnectorMenu(false);
          }}
          title="Select & Multi-Drag (V)"
          className={`p-3 rounded-2xl transition-all cursor-pointer ${
            activeTool === 'select'
              ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/30'
              : 'text-slate-400 hover:text-white hover:bg-white/8'
          }`}
        >
          <MousePointer2 className="w-4 h-4" />
        </button>

        {/* Pan */}
        <button
          onClick={() => {
            onToolChange('pan');
            setShowShapeMenu(false);
            setShowConnectorMenu(false);
          }}
          title="Pan Canvas (H or Hold Space)"
          className={`p-3 rounded-2xl transition-all cursor-pointer ${
            activeTool === 'pan'
              ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/30'
              : 'text-slate-400 hover:text-white hover:bg-white/8'
          }`}
        >
          <Hand className="w-4 h-4" />
        </button>

        {/* Separator */}
        <div className="w-px h-6 bg-white/10 mx-0.5" />

        {/* Pen */}
        <button
          onClick={() => {
            onToolChange('pencil');
            setShowShapeMenu(false);
            setShowConnectorMenu(false);
          }}
          title="Ink Pen (P)"
          className={`p-3 rounded-2xl transition-all cursor-pointer ${
            activeTool === 'pencil'
              ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/30'
              : 'text-slate-400 hover:text-white hover:bg-white/8'
          }`}
        >
          <PenLine className="w-4 h-4" />
        </button>

        {/* Highlighter */}
        <button
          onClick={() => {
            onToolChange('highlighter');
            setShowShapeMenu(false);
            setShowConnectorMenu(false);
          }}
          title="Translucent Highlighter (M)"
          className={`p-3 rounded-2xl transition-all cursor-pointer ${
            activeTool === 'highlighter'
              ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/30'
              : 'text-slate-400 hover:text-white hover:bg-white/8'
          }`}
        >
          <Highlighter className="w-4 h-4" />
        </button>

        {/* Laser Pointer */}
        <button
          onClick={() => {
            onToolChange('laser');
            setShowShapeMenu(false);
            setShowConnectorMenu(false);
          }}
          title="Live Presentation Laser Pointer (L)"
          className={`p-3 rounded-2xl transition-all cursor-pointer ${
            activeTool === 'laser'
              ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30 animate-pulse'
              : 'text-slate-400 hover:text-white hover:bg-white/8'
          }`}
        >
          <Flame className="w-4 h-4" />
        </button>

        {/* Separator */}
        <div className="w-px h-6 bg-white/10 mx-0.5" />

        {/* Shapes Menu Button */}
        <button
          onClick={() => {
            setShowShapeMenu(!showShapeMenu);
            setShowConnectorMenu(false);
          }}
          title="Geometric Shapes (R, E, D)"
          className={`px-3 py-3 rounded-2xl transition-all cursor-pointer flex items-center gap-1 ${
            isShapeActive
              ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/30'
              : 'text-slate-400 hover:text-white hover:bg-white/8'
          }`}
        >
          <Square className="w-4 h-4" />
          <ChevronUp className="w-3 h-3" />
        </button>

        {/* Connectors Menu Button */}
        <button
          onClick={() => {
            setShowConnectorMenu(!showConnectorMenu);
            setShowShapeMenu(false);
          }}
          title="Connectors & Arrows (A)"
          className={`px-3 py-3 rounded-2xl transition-all cursor-pointer flex items-center gap-1 ${
            isConnectorActive
              ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/30'
              : 'text-slate-400 hover:text-white hover:bg-white/8'
          }`}
        >
          <ArrowRight className="w-4 h-4" />
          <ChevronUp className="w-3 h-3" />
        </button>

        {/* Separator */}
        <div className="w-px h-6 bg-white/10 mx-0.5" />

        {/* Text */}
        <button
          onClick={() => {
            onToolChange('text');
            setShowShapeMenu(false);
            setShowConnectorMenu(false);
          }}
          title="Text Label (T)"
          className={`p-3 rounded-2xl transition-all cursor-pointer ${
            activeTool === 'text'
              ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/30'
              : 'text-slate-400 hover:text-white hover:bg-white/8'
          }`}
        >
          <Type className="w-4 h-4" />
        </button>

        {/* Sticky Note */}
        <button
          onClick={() => {
            onToolChange('sticky');
            setShowShapeMenu(false);
            setShowConnectorMenu(false);
          }}
          title="Sticky Note (N)"
          className={`p-3 rounded-2xl transition-all cursor-pointer ${
            activeTool === 'sticky'
              ? 'bg-amber-300 text-black shadow-lg shadow-amber-300/40'
              : 'text-amber-400 hover:bg-amber-400/10'
          }`}
        >
          <StickyNote className="w-4 h-4" />
        </button>

        {/* Section Frame */}
        <button
          onClick={() => {
            onToolChange('frame');
            setShowShapeMenu(false);
            setShowConnectorMenu(false);
          }}
          title="Component Cluster Frame (F)"
          className={`p-3 rounded-2xl transition-all cursor-pointer ${
            activeTool === 'frame'
              ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/30'
              : 'text-slate-400 hover:text-white hover:bg-white/8'
          }`}
        >
          <LayoutGrid className="w-4 h-4" />
        </button>

        {/* Separator */}
        <div className="w-px h-6 bg-white/10 mx-0.5" />

        {/* Style Panel Toggle */}
        <button
          onClick={() => setShowStylePanel(!showStylePanel)}
          title="Color & Stroke Panel"
          className={`p-3 rounded-2xl transition-all cursor-pointer ${
            showStylePanel ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white hover:bg-white/8'
          }`}
        >
          <Sliders className="w-4 h-4" />
        </button>

        {/* AI Diagram Studio */}
        <button
          onClick={onOpenAI}
          title="AI Diagram & Architecture Studio (Gemini)"
          className="px-3.5 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold transition-all shadow-lg shadow-violet-600/30 flex items-center gap-1.5 cursor-pointer text-xs"
        >
          <Sparkles className="w-4 h-4 animate-spin" />
          <span className="hidden sm:inline font-sans">AI Studio</span>
        </button>

        {/* Separator */}
        <div className="w-px h-6 bg-white/10 mx-0.5" />

        {/* Undo / Redo */}
        <button
          onClick={onUndo}
          disabled={!canUndo}
          title="Undo (Ctrl+Z)"
          className="p-3 rounded-2xl text-slate-400 hover:text-white hover:bg-white/8 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        >
          <Undo2 className="w-4 h-4" />
        </button>

        <button
          onClick={onRedo}
          disabled={!canRedo}
          title="Redo (Ctrl+Y)"
          className="p-3 rounded-2xl text-slate-400 hover:text-white hover:bg-white/8 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        >
          <Redo2 className="w-4 h-4" />
        </button>

        <button
          onClick={onClear}
          title="Clear Canvas"
          className="p-3 rounded-2xl text-rose-400 hover:bg-rose-500/10 cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
