export type ToolType =
  | 'select'
  | 'pan'
  | 'pencil'
  | 'highlighter'
  | 'laser'
  | 'rectangle'
  | 'rounded_rect'
  | 'ellipse'
  | 'diamond'
  | 'cylinder'
  | 'cloud'
  | 'arrow'
  | 'step_arrow'
  | 'line'
  | 'text'
  | 'sticky'
  | 'frame';

export type ElementType =
  | 'pencil'
  | 'highlighter'
  | 'rectangle'
  | 'rounded_rect'
  | 'ellipse'
  | 'diamond'
  | 'cylinder'
  | 'cloud'
  | 'arrow'
  | 'step_arrow'
  | 'line'
  | 'text'
  | 'sticky'
  | 'frame'
  | 'diagram_shape';

export type GridStyle = 'dots' | 'grid' | 'blueprint' | 'blank';

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
  fontFamily?: 'sans' | 'mono' | 'serif';
  textAlign?: 'left' | 'center' | 'right';
  rotation?: number;
  stickyColor?: string;
  stickyEmoji?: string;
  stickyAuthor?: string;
  frameTitle?: string;
  opacity?: number;
  label?: string;
  zIndex?: number;
}

export interface UserPresence {
  id: string;
  name: string;
  color: string;
  cursor: { x: number; y: number };
  activeTool: string;
  activity: string;
  lastActive: number;
}

export interface DiagramSpec {
  title: string;
  category?: string;
  elements: DiagramElement[];
  connections: DiagramConnection[];
}

export interface DiagramElement {
  id: string;
  type: 'rectangle' | 'rounded_rect' | 'ellipse' | 'cylinder' | 'diamond' | 'cloud';
  label: string;
  subLabel?: string;
  x: number;
  y: number;
  color: string;
  width?: number;
  height?: number;
  iconName?: string;
}

export interface DiagramConnection {
  from: string;
  to: string;
  label?: string;
  style?: 'arrow' | 'dashed' | 'step';
}

export interface DrawStyle {
  fill: string;
  stroke: string;
  strokeWidth: number;
  opacity: number;
  fontSize: number;
  fontFamily?: 'sans' | 'mono' | 'serif';
}

export interface LaserPoint {
  x: number;
  y: number;
  timestamp: number;
}
