'use client';

import { useState, useCallback, useRef } from 'react';
import { CanvasElement, DiagramSpec, DrawStyle, ToolType } from '@/types';
import { createId } from '@/lib/shapes';
import Canvas from '@/components/Canvas';
import Toolbar from '@/components/Toolbar';
import Header from '@/components/Header';
import DiagramModal from '@/components/DiagramModal';
import Minimap from '@/components/Minimap';
import { Keyboard, HelpCircle, X } from 'lucide-react';

interface Props {
  roomId: string;
}

const DEFAULT_STYLE: DrawStyle = {
  fill: 'transparent',
  stroke: '#6366f1',
  strokeWidth: 2,
  opacity: 1,
  fontSize: 18,
};

const SHORTCUTS = [
  ['V', 'Select tool'],
  ['H', 'Pan tool'],
  ['P', 'Pencil / Draw'],
  ['R', 'Rectangle'],
  ['E', 'Ellipse'],
  ['A', 'Arrow'],
  ['T', 'Text'],
  ['N', 'Sticky note'],
  ['Ctrl+Z', 'Undo'],
  ['Ctrl+Y', 'Redo'],
  ['Delete', 'Delete selected'],
  ['Esc', 'Deselect'],
  ['Scroll', 'Zoom in / out'],
];

export default function BoardClient({ roomId }: Props) {
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [history, setHistory] = useState<CanvasElement[][]>([[]]);
  const [historyIdx, setHistoryIdx] = useState(0);
  const [activeTool, setActiveTool] = useState<ToolType>('select');
  const [style, setStyle] = useState<DrawStyle>(DEFAULT_STYLE);
  const [isDiagramModalOpen, setIsDiagramModalOpen] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });
  const [canvasScale, setCanvasScale] = useState(1);
  const svgContainerRef = useRef<SVGSVGElement | null>(null);

  const pushHistory = (newElements: CanvasElement[]) => {
    const newHistory = history.slice(0, historyIdx + 1);
    newHistory.push(newElements);
    setHistory(newHistory);
    setHistoryIdx(newHistory.length - 1);
    setElements(newElements);
  };

  const handleAddElement = useCallback((el: CanvasElement) => {
    pushHistory([...elements, el]);
  }, [elements, history, historyIdx]);

  const handleUpdateElement = useCallback((id: string, updates: Partial<CanvasElement>) => {
    const updated = elements.map((el) => (el.id === id ? { ...el, ...updates } : el));
    setElements(updated);
  }, [elements]);

  const handleDeleteElement = useCallback((id: string) => {
    pushHistory(elements.filter((el) => el.id !== id));
  }, [elements, history, historyIdx]);

  const handleUndo = () => {
    if (historyIdx > 0) {
      const idx = historyIdx - 1;
      setHistoryIdx(idx);
      setElements(history[idx]);
    }
  };

  const handleRedo = () => {
    if (historyIdx < history.length - 1) {
      const idx = historyIdx + 1;
      setHistoryIdx(idx);
      setElements(history[idx]);
    }
  };

  const handleClear = () => {
    if (elements.length === 0) return;
    if (window.confirm('Clear the entire canvas?')) {
      pushHistory([]);
    }
  };

  const handlePlaceDiagram = (spec: DiagramSpec) => {
    const newElements: CanvasElement[] = [];

    // Create element nodes
    spec.elements.forEach((el) => {
      const w = el.width ?? 130;
      const h = el.height ?? 60;
      newElements.push({
        id: el.id,
        type: 'diagram_shape',
        x: el.x,
        y: el.y,
        width: w,
        height: h,
        text: el.label,
        fill: el.color + '22',
        stroke: el.color,
        strokeWidth: 2,
      });
    });

    // Create connections
    spec.connections.forEach((conn) => {
      const fromEl = spec.elements.find((e) => e.id === conn.from);
      const toEl = spec.elements.find((e) => e.id === conn.to);
      if (!fromEl || !toEl) return;

      const fx = fromEl.x + (fromEl.width ?? 130);
      const fy = fromEl.y + (fromEl.height ?? 60) / 2;
      const tx = toEl.x;
      const ty = toEl.y + (toEl.height ?? 60) / 2;

      newElements.push({
        id: createId(),
        type: 'arrow',
        x: fx,
        y: fy,
        points: [0, 0, tx - fx, ty - fy],
        stroke: '#6366f1',
        strokeWidth: 1.5,
        fill: 'transparent',
      });
    });

    pushHistory([...elements, ...newElements]);
  };

  const handleExport = (format: 'svg' | 'png') => {
    const svgEl = document.querySelector('.board-canvas-container svg');
    if (!svgEl) return;

    if (format === 'svg') {
      const serializer = new XMLSerializer();
      const svgStr = serializer.serializeToString(svgEl);
      const blob = new Blob([svgStr], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `canvasflow-${roomId}.svg`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      const canvas = document.createElement('canvas');
      canvas.width = 1920;
      canvas.height = 1080;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.fillStyle = '#080c14';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      // Basic raster export - in production use html2canvas
      const img = new Image();
      const svgStr = new XMLSerializer().serializeToString(svgEl);
      const blob = new Blob([svgStr], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const a = document.createElement('a');
        a.href = canvas.toDataURL('image/png');
        a.download = `canvasflow-${roomId}.png`;
        a.click();
        URL.revokeObjectURL(url);
      };
      img.src = url;
    }
  };

  // Keyboard shortcuts
  const handleToolFromKey = useCallback((e: KeyboardEvent) => {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
    const map: Record<string, ToolType> = { v: 'select', h: 'pan', p: 'pencil', r: 'rectangle', e: 'ellipse', a: 'arrow', t: 'text', n: 'sticky' };
    if (map[e.key.toLowerCase()]) setActiveTool(map[e.key.toLowerCase()]);
    if ((e.ctrlKey || e.metaKey) && e.key === 'z') handleUndo();
    if ((e.ctrlKey || e.metaKey) && e.key === 'y') handleRedo();
  }, []);

  return (
    <div className="fixed inset-0 bg-[#080c14] overflow-hidden">
      <Header
        roomId={roomId}
        elementCount={elements.length}
        onExport={handleExport}
        onZoomIn={() => setCanvasScale(s => Math.min(s * 1.2, 8))}
        onZoomOut={() => setCanvasScale(s => Math.max(s * 0.8, 0.1))}
        onResetView={() => { setCanvasScale(1); setCanvasOffset({ x: 0, y: 0 }); }}
        scale={canvasScale}
      />

      {/* Toolbar */}
      <div className="pt-14">
        <Toolbar
          activeTool={activeTool}
          onToolChange={setActiveTool}
          strokeColor={style.stroke}
          fillColor={style.fill}
          strokeWidth={style.strokeWidth}
          onStrokeColorChange={(c) => setStyle({ ...style, stroke: c })}
          onFillColorChange={(c) => setStyle({ ...style, fill: c })}
          onStrokeWidthChange={(w) => setStyle({ ...style, strokeWidth: w })}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onClear={handleClear}
          canUndo={historyIdx > 0}
          canRedo={historyIdx < history.length - 1}
          onOpenAI={() => setIsDiagramModalOpen(true)}
        />
      </div>

      {/* Canvas */}
      <div className="board-canvas-container absolute inset-0 pt-14">
        <Canvas
          elements={elements}
          onAddElement={handleAddElement}
          onUpdateElement={handleUpdateElement}
          onDeleteElement={handleDeleteElement}
          activeTool={activeTool}
          style={style}
        />
      </div>

      {/* Minimap */}
      <Minimap elements={elements} viewOffset={canvasOffset} scale={canvasScale} />

      {/* Shortcuts Help Button */}
      <button
        onClick={() => setShowShortcuts(true)}
        className="fixed bottom-6 left-20 z-20 w-8 h-8 rounded-xl bg-[#0d1424] border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all cursor-pointer"
        title="Keyboard shortcuts"
      >
        <Keyboard className="w-3.5 h-3.5" />
      </button>

      {/* Shortcuts Modal */}
      {showShortcuts && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 modal-backdrop" onClick={() => setShowShortcuts(false)}>
          <div className="bg-[#0d1424] border border-white/10 rounded-3xl p-6 min-w-[320px] shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-white flex items-center gap-2">
                <Keyboard className="w-4 h-4 text-indigo-400" />
                Keyboard Shortcuts
              </h3>
              <button onClick={() => setShowShortcuts(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {SHORTCUTS.map(([key, label]) => (
                <div key={key} className="flex items-center justify-between gap-2 text-xs">
                  <kbd className="px-2 py-1 rounded-lg bg-white/8 border border-white/10 text-indigo-300 font-mono font-bold whitespace-nowrap">{key}</kbd>
                  <span className="text-slate-400 text-right">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* AI Diagram Modal */}
      <DiagramModal
        isOpen={isDiagramModalOpen}
        onClose={() => setIsDiagramModalOpen(false)}
        onPlaceDiagram={handlePlaceDiagram}
      />
    </div>
  );
}
