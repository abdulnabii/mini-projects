export type ToolType =
  | 'select'
  | 'pan'
  | 'pencil'
  | 'rectangle'
  | 'ellipse'
  | 'arrow'
  | 'text'
  | 'sticky';

export type ElementType =
  | 'pencil'
  | 'rectangle'
  | 'ellipse'
  | 'arrow'
  | 'text'
  | 'sticky'
  | 'diagram_shape';

export interface CanvasElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width?: number;
  height?: number;
  points?: number[]; // flat array [x1,y1,x2,y2,...] for pencil/arrow
  text?: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  fontSize?: number;
  rotation?: number;
  stickyColor?: string;
  opacity?: number;
}

export interface UserPresence {
  cursor: { x: number; y: number } | null;
  name: string;
  color: string;
  activeTool: ToolType;
}

export interface DiagramSpec {
  title: string;
  elements: DiagramElement[];
  connections: DiagramConnection[];
}

export interface DiagramElement {
  id: string;
  type: 'rectangle' | 'ellipse' | 'cylinder' | 'diamond';
  label: string;
  x: number;
  y: number;
  color: string;
  width?: number;
  height?: number;
}

export interface DiagramConnection {
  from: string;
  to: string;
  label?: string;
  style?: 'arrow' | 'dashed';
}

export interface DrawStyle {
  fill: string;
  stroke: string;
  strokeWidth: number;
  opacity: number;
  fontSize?: number;
}
