'use client';

import { ToolType } from '@/types';
import {
  MousePointer2, Hand, PenLine, Square, Circle, ArrowRight, Type,
  StickyNote, Undo2, Redo2, Trash2, Minus, Plus, Sparkles
} from 'lucide-react';

interface Props {
  activeTool: ToolType;
  onToolChange: (tool: ToolType) => void;
  strokeColor: string;
  fillColor: string;
  strokeWidth: number;
  onStrokeColorChange: (c: string) => void;
  onFillColorChange: (c: string) => void;
  onStrokeWidthChange: (w: number) => void;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onOpenAI: () => void;
}

const TOOLS: { id: ToolType; icon: React.ElementType; label: string; shortcut: string }[] = [
  { id: 'select', icon: MousePointer2, label: 'Select', shortcut: 'V' },
  { id: 'pan', icon: Hand, label: 'Pan', shortcut: 'H' },
  { id: 'pencil', icon: PenLine, label: 'Draw', shortcut: 'P' },
  { id: 'rectangle', icon: Square, label: 'Rectangle', shortcut: 'R' },
  { id: 'ellipse', icon: Circle, label: 'Ellipse', shortcut: 'E' },
  { id: 'arrow', icon: ArrowRight, label: 'Arrow', shortcut: 'A' },
  { id: 'text', icon: Type, label: 'Text', shortcut: 'T' },
  { id: 'sticky', icon: StickyNote, label: 'Sticky Note', shortcut: 'N' },
];

const STROKE_COLORS = ['#ffffff', '#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#8b5cf6'];
const FILL_COLORS = ['transparent', 'rgba(99,102,241,0.15)', 'rgba(6,182,212,0.15)', 'rgba(16,185,129,0.15)', 'rgba(245,158,11,0.15)', 'rgba(239,68,68,0.15)', 'rgba(236,72,153,0.15)', 'rgba(139,92,246,0.15)'];

export default function Toolbar({
  activeTool, onToolChange, strokeColor, fillColor, strokeWidth,
  onStrokeColorChange, onFillColorChange, onStrokeWidthChange,
  onUndo, onRedo, onClear, canUndo, canRedo, onOpenAI,
}: Props) {
  return (
    <div className="fixed left-4 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-2">
      <div className="flex flex-col gap-1 p-2 rounded-2xl bg-[#0d1424]/95 border border-white/10 backdrop-blur-xl shadow-2xl shadow-black/40">
        {/* Tool Buttons */}
        {TOOLS.map((tool) => (
          <button
            key={tool.id}
            onClick={() => onToolChange(tool.id)}
            title={`${tool.label} (${tool.shortcut})`}
            className={`group relative w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
              activeTool === tool.id
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                : 'text-slate-400 hover:text-white hover:bg-white/8'
            }`}
          >
            <tool.icon className="w-4 h-4" />
            {/* Tooltip */}
            <div className="absolute left-12 px-2 py-1 rounded-lg bg-slate-900 border border-white/10 text-white text-xs whitespace-nowrap font-medium opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
              {tool.label}
              <kbd className="ml-2 px-1 py-0.5 rounded bg-white/10 text-slate-400 text-[9px] font-mono">{tool.shortcut}</kbd>
            </div>
          </button>
        ))}

        {/* Separator */}
        <div className="w-full h-px bg-white/10 my-1" />

        {/* AI Diagram Button */}
        <button
          onClick={onOpenAI}
          title="AI Diagram Generator"
          className="group relative w-10 h-10 rounded-xl flex items-center justify-center text-violet-400 hover:text-violet-300 hover:bg-violet-500/10 transition-all cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <div className="absolute left-12 px-2 py-1 rounded-lg bg-slate-900 border border-white/10 text-white text-xs whitespace-nowrap font-medium opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
            AI Diagram Generator
          </div>
        </button>

        {/* Separator */}
        <div className="w-full h-px bg-white/10 my-1" />

        {/* Undo / Redo */}
        <button
          onClick={onUndo}
          disabled={!canUndo}
          title="Undo (Ctrl+Z)"
          className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/8 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
        >
          <Undo2 className="w-4 h-4" />
        </button>
        <button
          onClick={onRedo}
          disabled={!canRedo}
          title="Redo (Ctrl+Y)"
          className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/8 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
        >
          <Redo2 className="w-4 h-4" />
        </button>
        <button
          onClick={onClear}
          title="Clear Canvas"
          className="w-10 h-10 rounded-xl flex items-center justify-center text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Style Panel */}
      {['pencil', 'rectangle', 'ellipse', 'arrow'].includes(activeTool) && (
        <div className="flex flex-col gap-3 p-3 rounded-2xl bg-[#0d1424]/95 border border-white/10 backdrop-blur-xl shadow-2xl shadow-black/40 w-14">
          {/* Stroke Colors */}
          <div className="space-y-1">
            <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider block text-center">Stroke</span>
            <div className="grid grid-cols-2 gap-1">
              {STROKE_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => onStrokeColorChange(c)}
                  className={`w-4 h-4 rounded-md border cursor-pointer transition-transform hover:scale-125 ${
                    strokeColor === c ? 'border-white scale-125' : 'border-transparent'
                  }`}
                  style={{ background: c === '#ffffff' ? '#ffffff' : c }}
                />
              ))}
            </div>
          </div>

          {/* Fill Colors */}
          {['rectangle', 'ellipse'].includes(activeTool) && (
            <div className="space-y-1">
              <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider block text-center">Fill</span>
              <div className="grid grid-cols-2 gap-1">
                {FILL_COLORS.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => onFillColorChange(c)}
                    className={`w-4 h-4 rounded-md border cursor-pointer transition-transform hover:scale-125 ${
                      fillColor === c ? 'border-white scale-125' : 'border-white/20'
                    }`}
                    style={{ background: c === 'transparent' ? 'transparent' : c }}
                    title={c === 'transparent' ? 'No fill' : ''}
                  >
                    {c === 'transparent' && (
                      <span className="text-[8px] text-slate-500">∅</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stroke Width */}
          <div className="space-y-1">
            <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider block text-center">{strokeWidth}px</span>
            <div className="flex flex-col gap-1">
              {[1, 2, 4, 6].map((w) => (
                <button
                  key={w}
                  onClick={() => onStrokeWidthChange(w)}
                  className={`w-full h-4 flex items-center justify-center rounded cursor-pointer transition-all ${
                    strokeWidth === w ? 'bg-indigo-500/30' : 'hover:bg-white/5'
                  }`}
                >
                  <div
                    className="rounded-full bg-white"
                    style={{ width: '80%', height: `${Math.min(w, 4)}px` }}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
