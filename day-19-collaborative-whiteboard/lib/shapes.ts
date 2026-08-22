import { CanvasElement, DrawStyle, ToolType } from '@/types';
import getStroke from 'perfect-freehand';

export function createId(): string {
  return Math.random().toString(36).slice(2, 11) + Date.now().toString(36);
}

const STICKY_COLORS = ['#fef08a', '#f9a8d4', '#93c5fd', '#86efac', '#c4b5fd', '#fdba74'];

export function createShape(
  tool: ToolType,
  x: number,
  y: number,
  style: DrawStyle,
  stickyColorIndex?: number
): CanvasElement {
  const id = createId();

  switch (tool) {
    case 'rectangle':
      return { id, type: 'rectangle', x, y, width: 0, height: 0, ...style };
    case 'ellipse':
      return { id, type: 'ellipse', x, y, width: 0, height: 0, ...style };
    case 'arrow':
      return { id, type: 'arrow', x, y, points: [0, 0, 0, 0], ...style };
    case 'pencil':
      return { id, type: 'pencil', x, y, points: [0, 0], ...style };
    case 'text':
      return { id, type: 'text', x, y, text: 'Type here...', fontSize: 18, fill: style.stroke, stroke: 'transparent', strokeWidth: 0 };
    case 'sticky':
      return {
        id,
        type: 'sticky',
        x,
        y,
        width: 200,
        height: 160,
        text: 'Click to edit...',
        stickyColor: STICKY_COLORS[(stickyColorIndex ?? 0) % STICKY_COLORS.length],
        fill: STICKY_COLORS[(stickyColorIndex ?? 0) % STICKY_COLORS.length],
        stroke: 'rgba(0,0,0,0.1)',
        strokeWidth: 1,
        fontSize: 14,
      };
    default:
      return { id, type: 'rectangle', x, y, width: 100, height: 80, ...style };
  }
}

export function getSmoothStrokePoints(points: number[]): string {
  const pts: [number, number, number][] = [];
  for (let i = 0; i < points.length; i += 2) {
    pts.push([points[i], points[i + 1], 0.5]);
  }
  const stroke = getStroke(pts, {
    size: 4,
    thinning: 0.5,
    smoothing: 0.5,
    streamline: 0.5,
  });

  if (!stroke.length) return '';

  const d = stroke.reduce(
    (acc, [x0, y0], i, arr) => {
      const [x1, y1] = arr[(i + 1) % arr.length];
      acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
      return acc;
    },
    ['M', ...stroke[0], 'Q'] as (string | number)[]
  );

  return d.join(' ');
}

export function recognizeShape(points: number[]): 'rectangle' | 'ellipse' | null {
  if (points.length < 6) return null;

  const xs = points.filter((_, i) => i % 2 === 0);
  const ys = points.filter((_, i) => i % 2 === 1);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  const width = maxX - minX;
  const height = maxY - minY;
  if (width < 20 || height < 20) return null;

  const aspectRatio = width / height;
  if (aspectRatio > 0.7 && aspectRatio < 1.4) return 'ellipse';
  return 'rectangle';
}
