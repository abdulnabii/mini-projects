export type VisualizationType =
  | 'GLOBE_3D'
  | 'NETWORK_GRAPH'
  | 'BAR_3D'
  | 'SCATTER_3D';

export type ColorScheme = 'EMERALD' | 'CYBERPUNK' | 'HEAT' | 'OCEAN';

export interface GeoDataPoint {
  id: string;
  label: string;
  lat: number;
  lng: number;
  value: number;
  secondaryValue?: number;
  category?: string;
}

export interface GeoArcConnection {
  fromLat: number;
  fromLng: number;
  toLat: number;
  toLng: number;
  label: string;
  value: number;
}

export interface GraphNode {
  id: string;
  label: string;
  group: string;
  val: number;
  x?: number;
  y?: number;
  z?: number;
}

export interface GraphLink {
  source: string;
  target: string;
  value: number;
}

export interface Bar3DPoint {
  id: string;
  xLabel: string;
  zLabel: string;
  value: number;
  category?: string;
}

export interface Scatter3DPoint {
  id: string;
  label: string;
  x: number;
  y: number;
  z: number;
  size: number;
  category: string;
}

export interface DatasetAnalysis {
  id: string;
  title: string;
  category: string;
  rowCount: number;
  chartType: VisualizationType;
  axisMapping: Record<string, string>;
  colorScheme: ColorScheme;
  patterns: string[];
  anomalies: string[];
  narrative: string;
  animationRecommendation: string;
  data: {
    globePoints?: GeoDataPoint[];
    globeArcs?: GeoArcConnection[];
    nodes?: GraphNode[];
    links?: GraphLink[];
    bars?: Bar3DPoint[];
    scatter?: Scatter3DPoint[];
  };
}

export interface SavedVisualization {
  id: string;
  title: string;
  datasetName: string;
  chartType: VisualizationType;
  narrative: string;
  createdAt: string;
}
