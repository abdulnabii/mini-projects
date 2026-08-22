'use client';

import { useEffect, useRef, useState } from 'react';
import { CanvasElement, DrawStyle, ToolType, DiagramSpec } from '@/types';
import { createShape, getSmoothStrokePoints, createId } from '@/lib/shapes';

interface Props {
  elements: CanvasElement[];
  onAddElement: (el: CanvasElement) => void;
  onUpdateElement: (id: string, updates: Partial<CanvasElement>) => void;
  onDeleteElement: (id: string) => void;
  activeTool: ToolType;
  style: DrawStyle;
  onCursorMove?: (x: number, y: number) => void;
}

export default function Canvas({
  elements, onAddElement, onUpdateElement, onDeleteElement,
  activeTool, style, onCursorMove,
}: Props) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [drawing, setDrawing] = useState(false);
  const [currentEl, setCurrentEl] = useState<CanvasElement | null>(null);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [pencilPoints, setPencilPoints] = useState<number[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, elX: 0, elY: 0 });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const stickyColorRef = useRef(0);

  const getCanvasPos = (clientX: number, clientY: number) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return {
      x: (clientX - rect.left - offset.x) / scale,
      y: (clientY - rect.top - offset.y) / scale,
    };
  };

  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setScale((s) => Math.min(Math.max(s * delta, 0.1), 8));
  };

  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedId && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
          onDeleteElement(selectedId);
          setSelectedId(null);
        }
      }
      if (e.key === 'Escape') {
        setSelectedId(null);
        setEditingId(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, onDeleteElement]);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.target !== svgRef.current && !(e.target as Element).closest('svg') === false) return;
    const pos = getCanvasPos(e.clientX, e.clientY);
    onCursorMove?.(pos.x, pos.y);

    if (activeTool === 'pan' || (e.button === 1)) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
      return;
    }

    if (activeTool === 'select') {
      setSelectedId(null);
      return;
    }

    setDrawing(true);
    setStartPos(pos);

    if (activeTool === 'pencil') {
      const newEl = createShape('pencil', pos.x, pos.y, style);
      setCurrentEl(newEl);
      setPencilPoints([pos.x, pos.y]);
    } else if (activeTool === 'sticky') {
      const newEl = createShape('sticky', pos.x - 100, pos.y - 80, style, stickyColorRef.current++);
      onAddElement(newEl);
      setDrawing(false);
    } else if (activeTool !== 'text') {
      const newEl = createShape(activeTool, pos.x, pos.y, style);
      setCurrentEl(newEl);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const pos = getCanvasPos(e.clientX, e.clientY);
    onCursorMove?.(pos.x, pos.y);

    if (isPanning) {
      setOffset({ x: e.clientX - panStart.x, y: e.clientY - panStart.y });
      return;
    }

    if (draggingId) {
      const dx = pos.x - dragStart.x;
      const dy = pos.y - dragStart.y;
      onUpdateElement(draggingId, { x: dragStart.elX + dx, y: dragStart.elY + dy });
      return;
    }

    if (!drawing || !currentEl) return;

    if (activeTool === 'pencil') {
      const newPts = [...pencilPoints, pos.x, pos.y];
      setPencilPoints(newPts);
      setCurrentEl({ ...currentEl, points: newPts });
    } else if (activeTool === 'rectangle' || activeTool === 'ellipse') {
      setCurrentEl({
        ...currentEl,
        width: pos.x - startPos.x,
        height: pos.y - startPos.y,
      });
    } else if (activeTool === 'arrow') {
      setCurrentEl({
        ...currentEl,
        points: [0, 0, pos.x - currentEl.x, pos.y - currentEl.y],
      });
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsPanning(false);
    setDraggingId(null);

    if (!drawing) return;
    setDrawing(false);

    if (activeTool === 'text') {
      const pos = getCanvasPos(e.clientX, e.clientY);
      const newEl = createShape('text', pos.x, pos.y, style);
      onAddElement(newEl);
      setEditingId(newEl.id);
      setEditText('');
      return;
    }

    if (currentEl) {
      // Minimum size guard
      if (activeTool === 'pencil' && pencilPoints.length < 4) {
        setCurrentEl(null);
        return;
      }
      if ((activeTool === 'rectangle' || activeTool === 'ellipse') &&
          (Math.abs(currentEl.width ?? 0) < 5 || Math.abs(currentEl.height ?? 0) < 5)) {
        setCurrentEl(null);
        return;
      }
      onAddElement(currentEl);
      setCurrentEl(null);
      setPencilPoints([]);
    }
  };

  const handleElementClick = (el: CanvasElement, e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeTool === 'select') {
      setSelectedId(el.id);
    }
  };

  const handleElementDoubleClick = (el: CanvasElement, e: React.MouseEvent) => {
    e.stopPropagation();
    if (el.type === 'text' || el.type === 'sticky') {
      setEditingId(el.id);
      setEditText(el.text ?? '');
    }
  };

  const handleElementMouseDown = (el: CanvasElement, e: React.MouseEvent) => {
    if (activeTool !== 'select') return;
    e.stopPropagation();
    const pos = getCanvasPos(e.clientX, e.clientY);
    setDraggingId(el.id);
    setDragStart({ x: pos.x, y: pos.y, elX: el.x, elY: el.y });
  };

  const commitTextEdit = () => {
    if (editingId) {
      onUpdateElement(editingId, { text: editText });
      setEditingId(null);
    }
  };

  const renderElement = (el: CanvasElement, preview = false) => {
    const isSelected = !preview && selectedId === el.id;
    const selectionStyle = isSelected ? { outline: '2px solid rgba(99,102,241,0.8)', outlineOffset: '4px' } : {};

    switch (el.type) {
      case 'pencil': {
        const path = getSmoothStrokePoints(el.points ?? []);
        return (
          <path
            key={el.id}
            d={path}
            fill={el.stroke ?? '#fff'}
            stroke="none"
            transform={`translate(${el.x}, ${el.y})`}
            style={selectionStyle}
            onClick={(e) => handleElementClick(el, e)}
            onMouseDown={(e) => handleElementMouseDown(el, e)}
            className={activeTool === 'select' ? 'cursor-move' : ''}
          />
        );
      }
      case 'rectangle': {
        const w = el.width ?? 100;
        const h = el.height ?? 80;
        const [rx, ry] = w < 0 ? [el.x + w, el.y] : [el.x, el.y];
        const [rw, rh] = [Math.abs(w), Math.abs(h)];
        return (
          <g key={el.id}>
            <rect
              x={rx} y={ry} width={rw} height={rh}
              fill={el.fill ?? 'transparent'}
              stroke={el.stroke ?? '#6366f1'}
              strokeWidth={el.strokeWidth ?? 2}
              rx={4}
              onClick={(e) => handleElementClick(el, e)}
              onMouseDown={(e) => handleElementMouseDown(el, e)}
              className={activeTool === 'select' ? 'cursor-move' : ''}
              style={selectionStyle}
            />
          </g>
        );
      }
      case 'ellipse': {
        const w = el.width ?? 100;
        const h = el.height ?? 80;
        const cx = el.x + w / 2;
        const cy = el.y + h / 2;
        const rx2 = Math.abs(w / 2);
        const ry2 = Math.abs(h / 2);
        return (
          <ellipse
            key={el.id}
            cx={cx} cy={cy} rx={rx2} ry={ry2}
            fill={el.fill ?? 'transparent'}
            stroke={el.stroke ?? '#6366f1'}
            strokeWidth={el.strokeWidth ?? 2}
            onClick={(e) => handleElementClick(el, e)}
            onMouseDown={(e) => handleElementMouseDown(el, e)}
            className={activeTool === 'select' ? 'cursor-move' : ''}
            style={selectionStyle}
          />
        );
      }
      case 'arrow': {
        const pts = el.points ?? [0, 0, 100, 0];
        const x2 = el.x + pts[2];
        const y2 = el.y + pts[3];
        const ang = Math.atan2(pts[3], pts[2]);
        const arrowLen = 12;
        const arrowAng = 0.4;
        const ax1 = x2 - arrowLen * Math.cos(ang - arrowAng);
        const ay1 = y2 - arrowLen * Math.sin(ang - arrowAng);
        const ax2 = x2 - arrowLen * Math.cos(ang + arrowAng);
        const ay2 = y2 - arrowLen * Math.sin(ang + arrowAng);
        return (
          <g key={el.id} onClick={(e) => handleElementClick(el, e)} onMouseDown={(e) => handleElementMouseDown(el, e)}>
            <line
              x1={el.x} y1={el.y} x2={x2} y2={y2}
              stroke={el.stroke ?? '#6366f1'}
              strokeWidth={el.strokeWidth ?? 2}
            />
            <polygon
              points={`${x2},${y2} ${ax1},${ay1} ${ax2},${ay2}`}
              fill={el.stroke ?? '#6366f1'}
            />
          </g>
        );
      }
      case 'diagram_shape': {
        const w = el.width ?? 130;
        const h = el.height ?? 60;
        return (
          <g key={el.id}
            onClick={(e) => handleElementClick(el, e)}
            onMouseDown={(e) => handleElementMouseDown(el, e)}
            className={activeTool === 'select' ? 'cursor-move' : ''}
          >
            <rect
              x={el.x} y={el.y} width={w} height={h}
              fill={el.fill ?? 'rgba(99,102,241,0.15)'}
              stroke={el.stroke ?? '#6366f1'}
              strokeWidth={2}
              rx={8}
            />
            {el.text && (
              <text
                x={el.x + w / 2} y={el.y + h / 2}
                textAnchor="middle" dominantBaseline="middle"
                fill="white" fontSize={13} fontWeight={700}
                fontFamily="Inter, sans-serif"
              >
                {el.text}
              </text>
            )}
          </g>
        );
      }
      case 'text': {
        if (editingId === el.id) {
          return (
            <foreignObject key={el.id} x={el.x} y={el.y} width="300" height="80">
              <textarea
                autoFocus
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onBlur={commitTextEdit}
                onKeyDown={(e) => e.key === 'Escape' && commitTextEdit()}
                className="bg-transparent border-none outline-none text-white resize-none w-full"
                style={{ fontSize: el.fontSize ?? 18, fontFamily: 'Inter, sans-serif', color: el.fill ?? '#fff' }}
              />
            </foreignObject>
          );
        }
        return (
          <text
            key={el.id}
            x={el.x} y={el.y}
            fill={el.fill ?? '#fff'}
            fontSize={el.fontSize ?? 18}
            fontFamily="Inter, sans-serif"
            onClick={(e) => handleElementClick(el, e)}
            onDoubleClick={(e) => handleElementDoubleClick(el, e)}
            onMouseDown={(e) => handleElementMouseDown(el, e)}
            className={activeTool === 'select' ? 'cursor-move' : ''}
            style={selectionStyle}
          >
            {el.text ?? 'Type here...'}
          </text>
        );
      }
      case 'sticky': {
        const w = el.width ?? 200;
        const h = el.height ?? 160;
        const color = el.stickyColor ?? '#fef08a';
        if (editingId === el.id) {
          return (
            <g key={el.id}>
              <rect x={el.x} y={el.y} width={w} height={h} fill={color} rx={12} />
              <foreignObject x={el.x + 8} y={el.y + 8} width={w - 16} height={h - 16}>
                <textarea
                  autoFocus
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onBlur={commitTextEdit}
                  className="sticky-input text-gray-800"
                  style={{ fontSize: 13 }}
                />
              </foreignObject>
            </g>
          );
        }
        return (
          <g key={el.id}
            onClick={(e) => handleElementClick(el, e)}
            onDoubleClick={(e) => handleElementDoubleClick(el, e)}
            onMouseDown={(e) => handleElementMouseDown(el, e)}
            className={activeTool === 'select' ? 'cursor-move' : ''}
          >
            <rect x={el.x} y={el.y} width={w} height={h} fill={color} rx={12} />
            <text x={el.x + 12} y={el.y + 24} fill="rgba(0,0,0,0.7)" fontSize={13} fontFamily="Inter, sans-serif">
              {(el.text ?? '').slice(0, 120)}
            </text>
          </g>
        );
      }
      default:
        return null;
    }
  };

  // Calculate viewport rect
  const getCursorClass = () => {
    if (activeTool === 'pan' || isPanning) return 'cursor-grab';
    if (activeTool === 'text') return 'cursor-text';
    if (activeTool === 'select') return 'cursor-default';
    return 'cursor-crosshair';
  };

  return (
    <div
      ref={canvasRef}
      className={`absolute inset-0 overflow-hidden dot-grid ${getCursorClass()}`}
      style={{ background: '#080c14' }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onClick={() => setSelectedId(null)}
    >
      <svg
        ref={svgRef}
        className="w-full h-full"
        style={{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`, transformOrigin: '0 0' }}
      >
        {/* Render committed elements */}
        {elements.map((el) => renderElement(el))}

        {/* Render current preview element */}
        {currentEl && renderElement(currentEl, true)}
      </svg>
    </div>
  );
}
