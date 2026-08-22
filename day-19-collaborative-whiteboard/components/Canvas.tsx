'use client';

import { useEffect, useRef, useState } from 'react';
import { CanvasElement, DrawStyle, ToolType, GridStyle, LaserPoint, UserPresence } from '@/types';
import { createShape, getSmoothStrokePoints, createId, STICKY_COLORS } from '@/lib/shapes';
import { Sparkles, Smile, Tag, User, Trash2, Copy, Move } from 'lucide-react';

interface Props {
  elements: CanvasElement[];
  onAddElement: (el: CanvasElement) => void;
  onUpdateElement: (id: string, updates: Partial<CanvasElement>) => void;
  onDeleteElement: (id: string) => void;
  onDuplicateElement?: (id: string) => void;
  activeTool: ToolType;
  style: DrawStyle;
  gridStyle: GridStyle;
  showCollaborators: boolean;
  scale: number;
  offset: { x: number; y: number };
  onOffsetChange: (offset: { x: number; y: number }) => void;
  onScaleChange: (scale: number) => void;
}

const EMOJI_OPTIONS = ['💡', '🚀', '🔥', '👍', '⚠️', '🎯', '❤️', '⭐'];

export default function Canvas({
  elements,
  onAddElement,
  onUpdateElement,
  onDeleteElement,
  onDuplicateElement,
  activeTool,
  style,
  gridStyle,
  showCollaborators,
  scale,
  offset,
  onOffsetChange,
  onScaleChange,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [isSpacePressed, setIsSpacePressed] = useState(false);

  const [drawing, setDrawing] = useState(false);
  const [currentEl, setCurrentEl] = useState<CanvasElement | null>(null);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [strokePoints, setStrokePoints] = useState<number[]>([]);

  // Selection & Transform State
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, elX: 0, elY: 0 });

  // Marquee Selection Box
  const [marquee, setMarquee] = useState<{ x1: number; y1: number; x2: number; y2: number } | null>(null);

  // In-place text editing
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  // Laser Pointer Trail
  const [laserPoints, setLaserPoints] = useState<LaserPoint[]>([]);

  // Sticky Color Cycle Index
  const stickyColorIdx = useRef(0);

  // Simulated Live Collaborators
  const [collaborators, setCollaborators] = useState<UserPresence[]>([
    {
      id: 'c1',
      name: 'Fatima R.',
      color: '#ec4899',
      cursor: { x: 380, y: 220 },
      activeTool: 'Pencil',
      activity: 'Drawing auth boundary...',
      lastActive: Date.now(),
    },
    {
      id: 'c2',
      name: 'Ali K.',
      color: '#06b6d4',
      cursor: { x: 740, y: 320 },
      activeTool: 'Sticky',
      activity: 'Adding performance note',
      lastActive: Date.now(),
    },
    {
      id: 'c3',
      name: 'Devon M.',
      color: '#10b981',
      cursor: { x: 920, y: 160 },
      activeTool: 'Select',
      activity: 'Reviewing API Gateway',
      lastActive: Date.now(),
    },
  ]);

  // Animate Collaborators gently
  useEffect(() => {
    if (!showCollaborators) return;
    const interval = setInterval(() => {
      setCollaborators((prev) =>
        prev.map((c, i) => {
          const angle = Date.now() / 1200 + i * 2;
          const radius = 35 + i * 15;
          const basePos = [
            { x: 420, y: 260 },
            { x: 760, y: 350 },
            { x: 940, y: 180 },
          ][i] || { x: 500, y: 300 };

          return {
            ...c,
            cursor: {
              x: basePos.x + Math.cos(angle) * radius,
              y: basePos.y + Math.sin(angle) * radius,
            },
          };
        })
      );
    }, 50);
    return () => clearInterval(interval);
  }, [showCollaborators]);

  // Clean up laser trail
  useEffect(() => {
    if (laserPoints.length === 0) return;
    const timer = setInterval(() => {
      const now = Date.now();
      setLaserPoints((prev) => prev.filter((p) => now - p.timestamp < 1200));
    }, 50);
    return () => clearInterval(timer);
  }, [laserPoints]);

  // Keyboard Listeners (Space to Pan, Delete, Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName || '')) {
        setIsSpacePressed(true);
      }
      if ((e.key === 'Delete' || e.key === 'Backspace') && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName || '')) {
        if (selectedIds.length > 0) {
          selectedIds.forEach((id) => onDeleteElement(id));
          setSelectedIds([]);
        }
      }
      if (e.key === 'Escape') {
        setSelectedIds([]);
        setEditingId(null);
        setMarquee(null);
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        if (selectedIds.length > 0 && onDuplicateElement) {
          selectedIds.forEach((id) => onDuplicateElement(id));
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setIsSpacePressed(false);
        setIsPanning(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [selectedIds, onDeleteElement, onDuplicateElement]);

  // Keep latest scale and offset in refs for event listeners
  const scaleRef = useRef(scale);
  const offsetRef = useRef(offset);
  scaleRef.current = scale;
  offsetRef.current = offset;

  // Touch gesture state for multi-touch pinch & pan
  const touchStateRef = useRef<{
    initialDistance: number | null;
    initialScale: number;
    initialMidpoint: { x: number; y: number } | null;
    initialOffset: { x: number; y: number };
  }>({
    initialDistance: null,
    initialScale: 1,
    initialMidpoint: null,
    initialOffset: { x: 0, y: 0 },
  });

  const getCanvasPos = (clientX: number, clientY: number) => {
    const rect = containerRef.current!.getBoundingClientRect();
    return {
      x: (clientX - rect.left - offsetRef.current.x) / scaleRef.current,
      y: (clientY - rect.top - offsetRef.current.y) / scaleRef.current,
    };
  };

  // High-Precision Trackpad Pinch-to-Zoom & Two-Finger Pan
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheelEvent = (e: WheelEvent) => {
      e.preventDefault();

      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // 1. Pinch-to-Zoom on Trackpad (Browsers emit ctrlKey=true on pinch gesture) or Ctrl/Cmd + Wheel
      if (e.ctrlKey || e.metaKey) {
        // Continuous smooth exponential zoom proportional to pinch speed
        const zoomDelta = -e.deltaY;
        const zoomSpeed = 0.008;
        const zoomFactor = Math.exp(zoomDelta * zoomSpeed);
        const currentScale = scaleRef.current;
        const newScale = Math.min(Math.max(currentScale * zoomFactor, 0.1), 8.0);

        if (newScale !== currentScale) {
          const newOffsetX = mouseX - (mouseX - offsetRef.current.x) * (newScale / currentScale);
          const newOffsetY = mouseY - (mouseY - offsetRef.current.y) * (newScale / currentScale);

          onScaleChange(newScale);
          onOffsetChange({ x: newOffsetX, y: newOffsetY });
        }
        return;
      }

      // 2. Shift + Wheel for pure horizontal scroll
      if (e.shiftKey) {
        const delta = e.deltaX !== 0 ? e.deltaX : e.deltaY;
        onOffsetChange({
          x: offsetRef.current.x - delta,
          y: offsetRef.current.y,
        });
        return;
      }

      // 3. Two-Finger Pan on Trackpad / Standard 2D Scroll
      onOffsetChange({
        x: offsetRef.current.x - e.deltaX,
        y: offsetRef.current.y - e.deltaY,
      });
    };

    // Touchscreen / Multi-Touch Pinch to Zoom & Pan
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const t1 = e.touches[0];
        const t2 = e.touches[1];
        const dist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
        const midX = (t1.clientX + t2.clientX) / 2;
        const midY = (t1.clientY + t2.clientY) / 2;

        touchStateRef.current = {
          initialDistance: dist,
          initialScale: scaleRef.current,
          initialMidpoint: { x: midX, y: midY },
          initialOffset: { ...offsetRef.current },
        };
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && touchStateRef.current.initialDistance && touchStateRef.current.initialMidpoint) {
        e.preventDefault();
        const t1 = e.touches[0];
        const t2 = e.touches[1];
        const currentDist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
        const currentMidX = (t1.clientX + t2.clientX) / 2;
        const currentMidY = (t1.clientY + t2.clientY) / 2;

        const scaleRatio = currentDist / touchStateRef.current.initialDistance;
        const newScale = Math.min(
          Math.max(touchStateRef.current.initialScale * scaleRatio, 0.1),
          8.0
        );

        const rect = container.getBoundingClientRect();
        const initialMidXInContainer = touchStateRef.current.initialMidpoint.x - rect.left;
        const initialMidYInContainer = touchStateRef.current.initialMidpoint.y - rect.top;

        const panDeltaX = currentMidX - touchStateRef.current.initialMidpoint.x;
        const panDeltaY = currentMidY - touchStateRef.current.initialMidpoint.y;

        const newOffsetX =
          initialMidXInContainer -
          (initialMidXInContainer - touchStateRef.current.initialOffset.x) *
            (newScale / touchStateRef.current.initialScale) +
          panDeltaX;

        const newOffsetY =
          initialMidYInContainer -
          (initialMidYInContainer - touchStateRef.current.initialOffset.y) *
            (newScale / touchStateRef.current.initialScale) +
          panDeltaY;

        onScaleChange(newScale);
        onOffsetChange({ x: newOffsetX, y: newOffsetY });
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (e.touches.length < 2) {
        touchStateRef.current.initialDistance = null;
        touchStateRef.current.initialMidpoint = null;
      }
    };

    container.addEventListener('wheel', handleWheelEvent, { passive: false });
    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      container.removeEventListener('wheel', handleWheelEvent);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onOffsetChange, onScaleChange]);

  // Pointer Down
  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.target !== svgRef.current && (e.target as Element).tagName !== 'svg') return;
    const pos = getCanvasPos(e.clientX, e.clientY);

    // Pan Mode or Space pressed or Middle mouse button
    if (activeTool === 'pan' || isSpacePressed || e.button === 1) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
      return;
    }

    // Laser pointer mode
    if (activeTool === 'laser') {
      setDrawing(true);
      setLaserPoints((prev) => [...prev, { x: pos.x, y: pos.y, timestamp: Date.now() }]);
      return;
    }

    // Selection mode -> start marquee box
    if (activeTool === 'select') {
      setSelectedIds([]);
      setMarquee({ x1: pos.x, y1: pos.y, x2: pos.x, y2: pos.y });
      return;
    }

    setDrawing(true);
    setStartPos(pos);

    if (activeTool === 'pencil' || activeTool === 'highlighter') {
      const newEl = createShape(activeTool, pos.x, pos.y, style);
      setCurrentEl(newEl);
      setStrokePoints([pos.x, pos.y]);
    } else if (activeTool === 'sticky') {
      const newEl = createShape('sticky', pos.x - 110, pos.y - 90, style, stickyColorIdx.current++);
      onAddElement(newEl);
      setDrawing(false);
      setSelectedIds([newEl.id]);
    } else if (activeTool === 'frame') {
      const newEl = createShape('frame', pos.x - 240, pos.y - 160, style);
      onAddElement(newEl);
      setDrawing(false);
      setSelectedIds([newEl.id]);
    } else if (activeTool === 'cylinder') {
      const newEl = createShape('cylinder', pos.x - 60, pos.y - 40, style);
      onAddElement(newEl);
      setDrawing(false);
      setSelectedIds([newEl.id]);
    } else if (activeTool === 'cloud') {
      const newEl = createShape('cloud', pos.x - 70, pos.y - 45, style);
      onAddElement(newEl);
      setDrawing(false);
      setSelectedIds([newEl.id]);
    } else if (activeTool !== 'text') {
      const newEl = createShape(activeTool, pos.x, pos.y, style);
      setCurrentEl(newEl);
    }
  };

  // Pointer Move
  const handlePointerMove = (e: React.PointerEvent) => {
    const pos = getCanvasPos(e.clientX, e.clientY);

    if (isPanning) {
      onOffsetChange({ x: e.clientX - panStart.x, y: e.clientY - panStart.y });
      return;
    }

    if (activeTool === 'laser' && drawing) {
      setLaserPoints((prev) => [...prev, { x: pos.x, y: pos.y, timestamp: Date.now() }]);
      return;
    }

    // Marquee Selection Box
    if (marquee) {
      setMarquee((prev) => (prev ? { ...prev, x2: pos.x, y2: pos.y } : null));
      // Detect collisions
      const minX = Math.min(marquee.x1, pos.x);
      const maxX = Math.max(marquee.x1, pos.x);
      const minY = Math.min(marquee.y1, pos.y);
      const maxY = Math.max(marquee.y1, pos.y);

      const found = elements
        .filter((el) => el.x >= minX && el.x <= maxX && el.y >= minY && el.y <= maxY)
        .map((el) => el.id);
      setSelectedIds(found);
      return;
    }

    // Dragging selected element(s)
    if (draggingId) {
      const dx = pos.x - dragStart.x;
      const dy = pos.y - dragStart.y;
      onUpdateElement(draggingId, { x: dragStart.elX + dx, y: dragStart.elY + dy });
      return;
    }

    if (!drawing || !currentEl) return;

    if (activeTool === 'pencil' || activeTool === 'highlighter') {
      const newPts = [...strokePoints, pos.x, pos.y];
      setStrokePoints(newPts);
      setCurrentEl({ ...currentEl, points: newPts });
    } else if (
      activeTool === 'rectangle' ||
      activeTool === 'rounded_rect' ||
      activeTool === 'ellipse' ||
      activeTool === 'diamond'
    ) {
      setCurrentEl({
        ...currentEl,
        width: pos.x - startPos.x,
        height: pos.y - startPos.y,
      });
    } else if (activeTool === 'arrow' || activeTool === 'step_arrow' || activeTool === 'line') {
      setCurrentEl({
        ...currentEl,
        points: [0, 0, pos.x - currentEl.x, pos.y - currentEl.y],
      });
    }
  };

  // Pointer Up
  const handlePointerUp = (e: React.PointerEvent) => {
    setIsPanning(false);
    setDraggingId(null);
    setMarquee(null);

    if (!drawing) return;
    setDrawing(false);

    if (activeTool === 'text') {
      const pos = getCanvasPos(e.clientX, e.clientY);
      const newEl = createShape('text', pos.x, pos.y, style);
      onAddElement(newEl);
      setEditingId(newEl.id);
      setEditText('');
      setSelectedIds([newEl.id]);
      return;
    }

    if (currentEl) {
      if ((activeTool === 'pencil' || activeTool === 'highlighter') && strokePoints.length < 4) {
        setCurrentEl(null);
        return;
      }
      if (
        ['rectangle', 'rounded_rect', 'ellipse', 'diamond'].includes(activeTool) &&
        (Math.abs(currentEl.width ?? 0) < 6 || Math.abs(currentEl.height ?? 0) < 6)
      ) {
        setCurrentEl(null);
        return;
      }
      onAddElement(currentEl);
      setSelectedIds([currentEl.id]);
      setCurrentEl(null);
      setStrokePoints([]);
    }
  };

  const handleElementMouseDown = (el: CanvasElement, e: React.MouseEvent) => {
    if (activeTool !== 'select') return;
    e.stopPropagation();
    const pos = getCanvasPos(e.clientX, e.clientY);
    setSelectedIds([el.id]);
    setDraggingId(el.id);
    setDragStart({ x: pos.x, y: pos.y, elX: el.x, elY: el.y });
  };

  const handleElementDoubleClick = (el: CanvasElement, e: React.MouseEvent) => {
    e.stopPropagation();
    if (['text', 'sticky', 'frame', 'diagram_shape'].includes(el.type)) {
      setEditingId(el.id);
      setEditText(el.text || el.frameTitle || el.label || '');
    }
  };

  const commitTextEdit = () => {
    if (editingId) {
      const target = elements.find((e) => e.id === editingId);
      if (target?.type === 'frame') {
        onUpdateElement(editingId, { frameTitle: editText });
      } else {
        onUpdateElement(editingId, { text: editText });
      }
      setEditingId(null);
    }
  };

  const toggleStickyEmoji = (id: string, emoji: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdateElement(id, { stickyEmoji: emoji });
  };

  // Render Individual Element
  const renderElement = (el: CanvasElement, isPreview = false) => {
    const isSelected = !isPreview && selectedIds.includes(el.id);
    const selectionGlow = isSelected ? 'stroke-[#38bdf8] stroke-[2.5px] filter drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]' : '';

    switch (el.type) {
      case 'pencil': {
        const path = getSmoothStrokePoints(el.points ?? [], el.strokeWidth || 4);
        return (
          <path
            key={el.id}
            d={path}
            fill={el.stroke ?? '#ffffff'}
            stroke="none"
            opacity={el.opacity ?? 1}
            transform={`translate(${el.x}, ${el.y})`}
            onMouseDown={(e) => handleElementMouseDown(el, e)}
            className={activeTool === 'select' ? 'cursor-move' : ''}
          />
        );
      }

      case 'highlighter': {
        const path = getSmoothStrokePoints(el.points ?? [], el.strokeWidth || 24);
        return (
          <path
            key={el.id}
            d={path}
            fill={el.stroke ?? '#fef08a'}
            stroke="none"
            opacity={el.opacity ?? 0.45}
            style={{ mixBlendMode: 'screen' }}
            transform={`translate(${el.x}, ${el.y})`}
            onMouseDown={(e) => handleElementMouseDown(el, e)}
            className={activeTool === 'select' ? 'cursor-move' : ''}
          />
        );
      }

      case 'rectangle': {
        const w = el.width ?? 120;
        const h = el.height ?? 80;
        const rx = w < 0 ? el.x + w : el.x;
        const ry = h < 0 ? el.y + h : el.y;
        return (
          <rect
            key={el.id}
            x={rx}
            y={ry}
            width={Math.abs(w)}
            height={Math.abs(h)}
            fill={el.fill ?? 'rgba(99,102,241,0.1)'}
            stroke={el.stroke ?? '#6366f1'}
            strokeWidth={el.strokeWidth ?? 2}
            className={`${selectionGlow} ${activeTool === 'select' ? 'cursor-move' : ''}`}
            onMouseDown={(e) => handleElementMouseDown(el, e)}
          />
        );
      }

      case 'rounded_rect': {
        const w = el.width ?? 120;
        const h = el.height ?? 80;
        const rx = w < 0 ? el.x + w : el.x;
        const ry = h < 0 ? el.y + h : el.y;
        return (
          <rect
            key={el.id}
            x={rx}
            y={ry}
            width={Math.abs(w)}
            height={Math.abs(h)}
            rx={14}
            fill={el.fill ?? 'rgba(99,102,241,0.12)'}
            stroke={el.stroke ?? '#6366f1'}
            strokeWidth={el.strokeWidth ?? 2}
            className={`${selectionGlow} ${activeTool === 'select' ? 'cursor-move' : ''}`}
            onMouseDown={(e) => handleElementMouseDown(el, e)}
          />
        );
      }

      case 'ellipse': {
        const w = el.width ?? 120;
        const h = el.height ?? 80;
        const cx = el.x + w / 2;
        const cy = el.y + h / 2;
        return (
          <ellipse
            key={el.id}
            cx={cx}
            cy={cy}
            rx={Math.abs(w / 2)}
            ry={Math.abs(h / 2)}
            fill={el.fill ?? 'rgba(6,182,212,0.1)'}
            stroke={el.stroke ?? '#06b6d4'}
            strokeWidth={el.strokeWidth ?? 2}
            className={`${selectionGlow} ${activeTool === 'select' ? 'cursor-move' : ''}`}
            onMouseDown={(e) => handleElementMouseDown(el, e)}
          />
        );
      }

      case 'diamond': {
        const w = el.width ?? 120;
        const h = el.height ?? 100;
        const cx = el.x + w / 2;
        const cy = el.y + h / 2;
        const pts = `${cx},${el.y} ${el.x + w},${cy} ${cx},${el.y + h} ${el.x},${cy}`;
        return (
          <g key={el.id} onMouseDown={(e) => handleElementMouseDown(el, e)} className={activeTool === 'select' ? 'cursor-move' : ''}>
            <polygon
              points={pts}
              fill={el.fill ?? 'rgba(245,158,11,0.12)'}
              stroke={el.stroke ?? '#f59e0b'}
              strokeWidth={el.strokeWidth ?? 2}
              className={selectionGlow}
            />
          </g>
        );
      }

      case 'cylinder': {
        const w = el.width ?? 140;
        const h = el.height ?? 80;
        const ry = 14;
        return (
          <g key={el.id} onMouseDown={(e) => handleElementMouseDown(el, e)} className={activeTool === 'select' ? 'cursor-move' : ''}>
            {/* Body */}
            <path
              d={`M ${el.x} ${el.y + ry} L ${el.x} ${el.y + h - ry} A ${w / 2} ${ry} 0 0 0 ${el.x + w} ${el.y + h - ry} L ${el.x + w} ${el.y + ry} Z`}
              fill={el.fill ?? 'rgba(59,130,246,0.15)'}
              stroke={el.stroke ?? '#3b82f6'}
              strokeWidth={el.strokeWidth ?? 2}
            />
            {/* Bottom rim */}
            <path
              d={`M ${el.x} ${el.y + h - ry} A ${w / 2} ${ry} 0 0 0 ${el.x + w} ${el.y + h - ry}`}
              fill="none"
              stroke={el.stroke ?? '#3b82f6'}
              strokeWidth={el.strokeWidth ?? 2}
            />
            {/* Top Lid */}
            <ellipse
              cx={el.x + w / 2}
              cy={el.y + ry}
              rx={w / 2}
              ry={ry}
              fill={el.fill ?? 'rgba(59,130,246,0.25)'}
              stroke={el.stroke ?? '#3b82f6'}
              strokeWidth={el.strokeWidth ?? 2}
              className={selectionGlow}
            />
            <text
              x={el.x + w / 2}
              y={el.y + h / 2 + 6}
              textAnchor="middle"
              fill="#93c5fd"
              fontSize={12}
              fontWeight={700}
              fontFamily="monospace"
            >
              {el.text || 'Database'}
            </text>
          </g>
        );
      }

      case 'cloud': {
        const w = el.width ?? 150;
        const h = el.height ?? 90;
        return (
          <g key={el.id} onMouseDown={(e) => handleElementMouseDown(el, e)} className={activeTool === 'select' ? 'cursor-move' : ''}>
            <rect
              x={el.x}
              y={el.y}
              width={w}
              height={h}
              rx={24}
              fill={el.fill ?? 'rgba(245,158,11,0.12)'}
              stroke={el.stroke ?? '#f59e0b'}
              strokeWidth={el.strokeWidth ?? 2}
              strokeDasharray="6 4"
              className={selectionGlow}
            />
            <text
              x={el.x + w / 2}
              y={el.y + h / 2 + 4}
              textAnchor="middle"
              fill="#fde68a"
              fontSize={12}
              fontWeight={700}
            >
              ☁️ {el.text || 'Cloud Service'}
            </text>
          </g>
        );
      }

      case 'arrow':
      case 'line': {
        const pts = el.points ?? [0, 0, 120, 0];
        const x2 = el.x + pts[2];
        const y2 = el.y + pts[3];
        const ang = Math.atan2(pts[3], pts[2]);
        const arrowLen = 14;
        const arrowAng = 0.45;
        const ax1 = x2 - arrowLen * Math.cos(ang - arrowAng);
        const ay1 = y2 - arrowLen * Math.sin(ang - arrowAng);
        const ax2 = x2 - arrowLen * Math.cos(ang + arrowAng);
        const ay2 = y2 - arrowLen * Math.sin(ang + arrowAng);

        return (
          <g key={el.id} onMouseDown={(e) => handleElementMouseDown(el, e)} className={activeTool === 'select' ? 'cursor-move' : ''}>
            <line
              x1={el.x}
              y1={el.y}
              x2={x2}
              y2={y2}
              stroke={el.stroke ?? '#6366f1'}
              strokeWidth={el.strokeWidth ?? 2.5}
              strokeLinecap="round"
              className={selectionGlow}
            />
            {el.type === 'arrow' && (
              <polygon
                points={`${x2},${y2} ${ax1},${ay1} ${ax2},${ay2}`}
                fill={el.stroke ?? '#6366f1'}
              />
            )}
            {el.label && (
              <text
                x={(el.x + x2) / 2}
                y={(el.y + y2) / 2 - 8}
                textAnchor="middle"
                fill="#cbd5e1"
                fontSize={10}
                fontFamily="monospace"
                fontWeight={700}
                className="bg-black/80 px-1"
              >
                {el.label}
              </text>
            )}
          </g>
        );
      }

      case 'step_arrow': {
        const pts = el.points ?? [0, 0, 140, 60];
        const x1 = el.x;
        const y1 = el.y;
        const x2 = el.x + pts[2];
        const y2 = el.y + pts[3];
        const midX = (x1 + x2) / 2;

        return (
          <g key={el.id} onMouseDown={(e) => handleElementMouseDown(el, e)} className={activeTool === 'select' ? 'cursor-move' : ''}>
            <path
              d={`M ${x1} ${y1} L ${midX} ${y1} L ${midX} ${y2} L ${x2} ${y2}`}
              fill="none"
              stroke={el.stroke ?? '#38bdf8'}
              strokeWidth={el.strokeWidth ?? 2}
              strokeDasharray="5 3"
              className={selectionGlow}
            />
            <polygon
              points={`${x2},${y2} ${x2 - 10},${y2 - 5} ${x2 - 10},${y2 + 5}`}
              fill={el.stroke ?? '#38bdf8'}
            />
          </g>
        );
      }

      case 'diagram_shape': {
        const w = el.width ?? 160;
        const h = el.height ?? 70;
        return (
          <g
            key={el.id}
            onMouseDown={(e) => handleElementMouseDown(el, e)}
            onDoubleClick={(e) => handleElementDoubleClick(el, e)}
            className={activeTool === 'select' ? 'cursor-move group' : ''}
          >
            {/* Ambient Shadow glow */}
            <rect
              x={el.x}
              y={el.y}
              width={w}
              height={h}
              rx={16}
              fill={el.fill ?? 'rgba(15,23,42,0.9)'}
              stroke={el.stroke ?? '#6366f1'}
              strokeWidth={2}
              className={`${selectionGlow} filter drop-shadow-xl`}
            />
            {/* Header Accent Bar */}
            <rect
              x={el.x + 1}
              y={el.y + 1}
              width={w - 2}
              height={4}
              rx={2}
              fill={el.stroke ?? '#6366f1'}
            />
            {/* Text Title */}
            <text
              x={el.x + w / 2}
              y={el.y + h / 2 - 4}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#ffffff"
              fontSize={13}
              fontWeight={800}
              fontFamily="sans-serif"
            >
              {el.text}
            </text>
            {/* SubLabel / Technology Tag */}
            {el.label && (
              <text
                x={el.x + w / 2}
                y={el.y + h / 2 + 16}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#94a3b8"
                fontSize={10}
                fontFamily="monospace"
              >
                {el.label}
              </text>
            )}
          </g>
        );
      }

      case 'frame': {
        const w = el.width ?? 480;
        const h = el.height ?? 320;
        return (
          <g
            key={el.id}
            onMouseDown={(e) => handleElementMouseDown(el, e)}
            onDoubleClick={(e) => handleElementDoubleClick(el, e)}
            className={activeTool === 'select' ? 'cursor-move' : ''}
          >
            {/* Container */}
            <rect
              x={el.x}
              y={el.y}
              width={w}
              height={h}
              rx={20}
              fill={el.fill ?? 'rgba(99,102,241,0.03)'}
              stroke={el.stroke ?? 'rgba(99,102,241,0.4)'}
              strokeWidth={2}
              strokeDasharray="8 6"
              className={selectionGlow}
            />
            {/* Title Header Badge */}
            <rect
              x={el.x + 16}
              y={el.y - 14}
              width={160}
              height={26}
              rx={8}
              fill="#1e1b4b"
              stroke="#6366f1"
              strokeWidth={1}
            />
            <text
              x={el.x + 28}
              y={el.y + 4}
              fill="#c7d2fe"
              fontSize={11}
              fontWeight={800}
              fontFamily="sans-serif"
            >
              📦 {el.frameTitle || 'Component Cluster'}
            </text>
          </g>
        );
      }

      case 'sticky': {
        const w = el.width ?? 220;
        const h = el.height ?? 180;
        const col = el.stickyColor ?? '#fef08a';
        const isDark = col === '#1e293b';

        return (
          <g
            key={el.id}
            onMouseDown={(e) => handleElementMouseDown(el, e)}
            onDoubleClick={(e) => handleElementDoubleClick(el, e)}
            className={activeTool === 'select' ? 'cursor-move group' : ''}
          >
            {/* Realistic Paper Shadow */}
            <rect
              x={el.x + 4}
              y={el.y + 6}
              width={w}
              height={h}
              rx={16}
              fill="rgba(0,0,0,0.4)"
              filter="blur(6px)"
            />
            {/* Main Sticky Card */}
            <rect
              x={el.x}
              y={el.y}
              width={w}
              height={h}
              rx={16}
              fill={col}
              stroke={isSelected ? '#38bdf8' : 'rgba(0,0,0,0.1)'}
              strokeWidth={isSelected ? 3 : 1}
              className={selectionGlow}
            />
            {/* Top Tape Accent */}
            <rect
              x={el.x + w / 2 - 30}
              y={el.y - 6}
              width={60}
              height={14}
              rx={4}
              fill="rgba(255,255,255,0.45)"
            />
            {/* Author and Emoji Stamp Header */}
            <text
              x={el.x + 16}
              y={el.y + 24}
              fill={isDark ? '#94a3b8' : 'rgba(0,0,0,0.5)'}
              fontSize={11}
              fontWeight={700}
              fontFamily="sans-serif"
            >
              {el.stickyEmoji || '💡'} {el.stickyAuthor || 'Collaborator'}
            </text>

            {/* Note Content Text */}
            <foreignObject x={el.x + 16} y={el.y + 36} width={w - 32} height={h - 60}>
              <div
                className={`w-full h-full text-xs font-medium leading-relaxed select-none overflow-hidden ${
                  isDark ? 'text-slate-200' : 'text-slate-900'
                }`}
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {el.text || 'Double-click to write note...'}
              </div>
            </foreignObject>

            {/* Interactive Emoji Reaction Bar on Hover */}
            <foreignObject x={el.x + 12} y={el.y + h - 28} width={w - 24} height={24}>
              <div className="flex items-center gap-1 opacity-80 hover:opacity-100 transition-opacity">
                {EMOJI_OPTIONS.slice(0, 5).map((em) => (
                  <button
                    key={em}
                    onClick={(e) => toggleStickyEmoji(el.id, em, e)}
                    className="w-5 h-5 text-[11px] rounded-md hover:bg-black/10 flex items-center justify-center cursor-pointer transition-transform hover:scale-125"
                  >
                    {em}
                  </button>
                ))}
              </div>
            </foreignObject>
          </g>
        );
      }

      case 'text': {
        return (
          <text
            key={el.id}
            x={el.x}
            y={el.y}
            fill={el.fill ?? '#ffffff'}
            fontSize={el.fontSize ?? 20}
            fontWeight={700}
            fontFamily={el.fontFamily === 'mono' ? 'monospace' : 'sans-serif'}
            onMouseDown={(e) => handleElementMouseDown(el, e)}
            onDoubleClick={(e) => handleElementDoubleClick(el, e)}
            className={`${selectionGlow} ${activeTool === 'select' ? 'cursor-move' : ''}`}
          >
            {el.text ?? 'Double click to edit text'}
          </text>
        );
      }

      default:
        return null;
    }
  };

  const getCursorStyle = () => {
    if (activeTool === 'pan' || isPanning || isSpacePressed) return 'cursor-grab active:cursor-grabbing';
    if (activeTool === 'laser') return 'cursor-crosshair';
    if (activeTool === 'text') return 'cursor-text';
    if (activeTool === 'select') return 'cursor-default';
    return 'cursor-crosshair';
  };

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden select-none ${
        gridStyle === 'dots'
          ? 'canvas-grid-dots'
          : gridStyle === 'grid'
          ? 'canvas-grid-lines'
          : gridStyle === 'blueprint'
          ? 'canvas-grid-blueprint'
          : 'bg-[#060911]'
      } ${getCursorStyle()}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <svg
        ref={svgRef}
        className="w-full h-full"
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
          transformOrigin: '0 0',
        }}
      >
        {/* Defs for gradients and glow filters */}
        <defs>
          <filter id="laser-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Render Saved Elements */}
        {elements.map((el) => renderElement(el))}

        {/* Render Preview Element while Drawing */}
        {currentEl && renderElement(currentEl, true)}

        {/* Marquee Selection Box */}
        {marquee && (
          <rect
            x={Math.min(marquee.x1, marquee.x2)}
            y={Math.min(marquee.y1, marquee.y2)}
            width={Math.abs(marquee.x2 - marquee.x1)}
            height={Math.abs(marquee.y2 - marquee.y1)}
            fill="rgba(56,189,248,0.12)"
            stroke="#38bdf8"
            strokeWidth={1.5}
            strokeDasharray="4 4"
          />
        )}

        {/* Laser Pointer Trail */}
        {laserPoints.length > 1 && (
          <g filter="url(#laser-glow)">
            {laserPoints.map((p, i) => {
              if (i === 0) return null;
              const prev = laserPoints[i - 1];
              const age = Date.now() - p.timestamp;
              const opacity = Math.max(0, 1 - age / 1000);
              return (
                <line
                  key={i}
                  x1={prev.x}
                  y1={prev.y}
                  x2={p.x}
                  y2={p.y}
                  stroke="#ef4444"
                  strokeWidth={6 * opacity}
                  strokeLinecap="round"
                  opacity={opacity}
                />
              );
            })}
          </g>
        )}

        {/* Live Collaborators Cursor Overlay */}
        {showCollaborators &&
          collaborators.map((c) => (
            <g
              key={c.id}
              transform={`translate(${c.cursor.x}, ${c.cursor.y})`}
              className="pointer-events-none transition-transform duration-75 ease-out"
            >
              {/* Cursor SVG */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5.5 3.2L18.8 12.5L12.5 13.8L9.2 20.2L5.5 3.2Z"
                  fill={c.color}
                  stroke="#080c14"
                  strokeWidth="1.5"
                />
              </svg>
              {/* Name Tag & Activity Tooltip */}
              <g transform="translate(18, 16)">
                <rect
                  x="0"
                  y="0"
                  width={c.name.length * 8 + 24}
                  height="22"
                  rx="6"
                  fill={c.color}
                  className="shadow-lg"
                />
                <text x="8" y="15" fill="#ffffff" fontSize="11" fontWeight="800" fontFamily="sans-serif">
                  {c.name}
                </text>
              </g>
            </g>
          ))}
      </svg>

      {/* Floating In-Place Text Editor Modal */}
      {editingId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={commitTextEdit}
        >
          <div
            className="w-full max-w-md p-6 rounded-3xl bg-[#0f172a] border border-cyan-500/40 shadow-2xl shadow-cyan-500/10 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-white text-sm font-sans flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                Edit Element Content
              </h4>
              <span className="text-[10px] text-slate-400 font-mono">Press Enter or click outside</span>
            </div>
            <textarea
              autoFocus
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                  commitTextEdit();
                }
              }}
              rows={4}
              className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-400 transition-all font-sans leading-relaxed"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={commitTextEdit}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-bold text-xs hover:scale-105 transition-transform cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
