'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { CanvasElement, DiagramSpec, DrawStyle, ToolType, GridStyle } from '@/types';
import { createId, STARTER_TEMPLATES } from '@/lib/shapes';
import Canvas from '@/components/Canvas';
import Toolbar from '@/components/Toolbar';
import Header from '@/components/Header';
import DiagramModal from '@/components/DiagramModal';
import Minimap from '@/components/Minimap';
import { Keyboard, HelpCircle, X, Sparkles, Check } from 'lucide-react';

interface Props {
  roomId: string;
}

const DEFAULT_STYLE: DrawStyle = {
  fill: 'rgba(99,102,241,0.12)',
  stroke: '#6366f1',
  strokeWidth: 2,
  opacity: 1,
  fontSize: 18,
  fontFamily: 'sans',
};

const SHORTCUTS = [
  ['V', 'Select & Lasso drag'],
  ['H', 'Pan canvas (or hold Space)'],
  ['P', 'Smooth Inking Pen'],
  ['M', 'Highlighter Marker'],
  ['L', 'Live Laser Pointer'],
  ['R', 'Rectangle (Sharp/Rounded)'],
  ['E', 'Ellipse / Circle'],
  ['D', 'Decision Diamond'],
  ['A', 'Arrow & Connector'],
  ['T', 'Text Label'],
  ['N', 'Sticky Note'],
  ['F', 'Component Group Frame'],
  ['Ctrl+D', 'Duplicate selected'],
  ['Ctrl+Z', 'Undo'],
  ['Ctrl+Y', 'Redo'],
  ['Delete', 'Delete selected'],
  ['Wheel', 'Zoom in / out'],
];

export default function BoardClient({ roomId }: Props) {
  const [boardTitle, setBoardTitle] = useState('Architecture & System Canvas');
  const [elements, setElements] = useState<CanvasElement[]>(() => {
    // Default initial starter elements
    return STARTER_TEMPLATES[0].spec.elements.map((el) => ({
      id: el.id,
      type: 'diagram_shape',
      x: el.x,
      y: el.y,
      width: el.width || 160,
      height: el.height || 75,
      text: el.label,
      label: el.subLabel,
      fill: el.color + '20',
      stroke: el.color,
      strokeWidth: 2,
    }));
  });

  const [history, setHistory] = useState<CanvasElement[][]>([elements]);
  const [historyIdx, setHistoryIdx] = useState(0);

  const [activeTool, setActiveTool] = useState<ToolType>('select');
  const [style, setStyle] = useState<DrawStyle>(DEFAULT_STYLE);
  const [gridStyle, setGridStyle] = useState<GridStyle>('dots');
  const [showCollaborators, setShowCollaborators] = useState(true);

  const [isDiagramModalOpen, setIsDiagramModalOpen] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);

  const [canvasOffset, setCanvasOffset] = useState({ x: 40, y: 60 });
  const [canvasScale, setCanvasScale] = useState(1);

  const pushHistory = (newElements: CanvasElement[]) => {
    const newHistory = history.slice(0, historyIdx + 1);
    newHistory.push(newElements);
    setHistory(newHistory);
    setHistoryIdx(newHistory.length - 1);
    setElements(newElements);
  };

  const handleAddElement = useCallback(
    (el: CanvasElement) => {
      pushHistory([...elements, el]);
    },
    [elements, history, historyIdx]
  );

  const handleUpdateElement = useCallback(
    (id: string, updates: Partial<CanvasElement>) => {
      const updated = elements.map((el) => (el.id === id ? { ...el, ...updates } : el));
      setElements(updated);
    },
    [elements]
  );

  const handleDeleteElement = useCallback(
    (id: string) => {
      pushHistory(elements.filter((el) => el.id !== id));
    },
    [elements, history, historyIdx]
  );

  const handleDuplicateElement = useCallback(
    (id: string) => {
      const target = elements.find((el) => el.id === id);
      if (!target) return;
      const dup: CanvasElement = {
        ...target,
        id: createId(),
        x: target.x + 30,
        y: target.y + 30,
      };
      pushHistory([...elements, dup]);
    },
    [elements, history, historyIdx]
  );

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
    if (window.confirm('Clear all objects from canvas?')) {
      pushHistory([]);
    }
  };

  // Place AI or Template Diagram
  const handlePlaceDiagram = (spec: DiagramSpec) => {
    const newElements: CanvasElement[] = [];

    // Place Nodes
    spec.elements.forEach((el) => {
      newElements.push({
        id: el.id || createId(),
        type: 'diagram_shape',
        x: el.x + 20,
        y: el.y + 20,
        width: el.width || 160,
        height: el.height || 75,
        text: el.label,
        label: el.subLabel,
        fill: el.color + '20',
        stroke: el.color,
        strokeWidth: 2,
      });
    });

    // Place Connections / Arrows
    spec.connections.forEach((conn) => {
      const fromEl = spec.elements.find((e) => e.id === conn.from);
      const toEl = spec.elements.find((e) => e.id === conn.to);
      if (!fromEl || !toEl) return;

      const fx = fromEl.x + 20 + (fromEl.width || 160);
      const fy = fromEl.y + 20 + (fromEl.height || 75) / 2;
      const tx = toEl.x + 20;
      const ty = toEl.y + 20 + (toEl.height || 75) / 2;

      newElements.push({
        id: createId(),
        type: 'arrow',
        x: fx,
        y: fy,
        points: [0, 0, tx - fx, ty - fy],
        stroke: '#38bdf8',
        strokeWidth: 2,
        label: conn.label,
        fill: 'transparent',
      });
    });

    pushHistory([...elements, ...newElements]);
    if (spec.title) {
      setBoardTitle(spec.title);
    }
  };

  // Export Hub (PNG, SVG, JSON)
  const handleExport = (format: 'svg' | 'png' | 'json') => {
    if (format === 'json') {
      const jsonStr = JSON.stringify({ boardTitle, roomId, elements }, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${boardTitle.toLowerCase().replace(/\s+/g, '-')}-${roomId}.json`;
      a.click();
      URL.revokeObjectURL(url);
      return;
    }

    const svgEl = document.querySelector('svg');
    if (!svgEl) return;

    if (format === 'svg') {
      const serializer = new XMLSerializer();
      const svgStr = serializer.serializeToString(svgEl);
      const blob = new Blob([svgStr], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${boardTitle.toLowerCase().replace(/\s+/g, '-')}-${roomId}.svg`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      const canvas = document.createElement('canvas');
      canvas.width = 2560;
      canvas.height = 1440;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.fillStyle = '#060911';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const serializer = new XMLSerializer();
      const svgStr = serializer.serializeToString(svgEl);
      const blob = new Blob([svgStr], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const a = document.createElement('a');
        a.href = canvas.toDataURL('image/png', 1.0);
        a.download = `${boardTitle.toLowerCase().replace(/\s+/g, '-')}-${roomId}.png`;
        a.click();
        URL.revokeObjectURL(url);
      };
      img.src = url;
    }
  };

  // Keyboard Shortcuts Trigger
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName || '')) return;

      const keyMap: Record<string, ToolType> = {
        v: 'select',
        h: 'pan',
        p: 'pencil',
        m: 'highlighter',
        l: 'laser',
        r: 'rectangle',
        e: 'ellipse',
        d: 'diamond',
        a: 'arrow',
        t: 'text',
        n: 'sticky',
        f: 'frame',
      };

      const k = e.key.toLowerCase();
      if (keyMap[k]) {
        setActiveTool(keyMap[k]);
      }
      if ((e.ctrlKey || e.metaKey) && k === 'z') {
        e.preventDefault();
        handleUndo();
      }
      if ((e.ctrlKey || e.metaKey) && k === 'y') {
        e.preventDefault();
        handleRedo();
      }
      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        setShowShortcuts((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [historyIdx, history]);

  return (
    <div className="fixed inset-0 bg-[#060911] overflow-hidden select-none">
      {/* Floating Top Header Bar */}
      <Header
        roomId={roomId}
        boardTitle={boardTitle}
        onTitleChange={setBoardTitle}
        elementCount={elements.length}
        onExport={handleExport}
        onLoadTemplate={handlePlaceDiagram}
        onZoomIn={() => setCanvasScale((s) => Math.min(s * 1.2, 5.0))}
        onZoomOut={() => setCanvasScale((s) => Math.max(s * 0.8, 0.2))}
        onResetView={() => {
          setCanvasScale(1);
          setCanvasOffset({ x: 40, y: 60 });
        }}
        scale={canvasScale}
        gridStyle={gridStyle}
        onGridStyleChange={setGridStyle}
        showCollaborators={showCollaborators}
        onToggleCollaborators={() => setShowCollaborators(!showCollaborators)}
      />

      {/* Infinite Canvas */}
      <Canvas
        elements={elements}
        onAddElement={handleAddElement}
        onUpdateElement={handleUpdateElement}
        onDeleteElement={handleDeleteElement}
        onDuplicateElement={handleDuplicateElement}
        activeTool={activeTool}
        style={style}
        gridStyle={gridStyle}
        showCollaborators={showCollaborators}
        scale={canvasScale}
        offset={canvasOffset}
        onOffsetChange={setCanvasOffset}
        onScaleChange={setCanvasScale}
      />

      {/* Floating Bottom Island Dock */}
      <Toolbar
        activeTool={activeTool}
        onToolChange={setActiveTool}
        style={style}
        onStyleChange={(updates) => setStyle({ ...style, ...updates })}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onClear={handleClear}
        canUndo={historyIdx > 0}
        canRedo={historyIdx < history.length - 1}
        onOpenAI={() => setIsDiagramModalOpen(true)}
      />

      {/* Minimap */}
      <Minimap elements={elements} viewOffset={canvasOffset} scale={canvasScale} />

      {/* Shortcuts Trigger Button */}
      <button
        onClick={() => setShowShortcuts(true)}
        className="fixed bottom-6 left-6 z-30 p-3 rounded-2xl bg-[#0a0f1d]/90 border border-cyan-500/30 text-slate-400 hover:text-cyan-400 hover:border-cyan-400 backdrop-blur-xl shadow-2xl transition-all cursor-pointer"
        title="Keyboard Shortcuts (?)"
      >
        <Keyboard className="w-4 h-4" />
      </button>

      {/* Keyboard Shortcuts Modal */}
      {showShortcuts && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150"
          onClick={() => setShowShortcuts(false)}
        >
          <div
            className="w-full max-w-lg p-6 rounded-3xl bg-[#0a0f1d] border-2 border-cyan-500/30 shadow-2xl space-y-4 font-sans"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Keyboard className="w-5 h-5 text-cyan-400" />
                Pro Keyboard Shortcuts
              </h3>
              <button
                onClick={() => setShowShortcuts(false)}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {SHORTCUTS.map(([key, desc]) => (
                <div
                  key={key}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/80 border border-slate-900 text-xs"
                >
                  <kbd className="px-2 py-0.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono font-bold">
                    {key}
                  </kbd>
                  <span className="text-slate-400 text-right">{desc}</span>
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
