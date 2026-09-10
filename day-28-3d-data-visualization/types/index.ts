export type VisualizationType =
  | 'GLOBE_3D'
  | 'NETWORK_GRAPH'
  | 'BAR_3D'
  | 'SCATTER_3D';

export type WorkspaceTab = '3D_STUDIO' | '2D_ANALYTICS' | 'TABLE' | 'METHODOLOGY';

export type ColorScheme = 'EMERALD' | 'CYBERPUNK' | 'HEAT' | 'OCEAN';

export type ColumnDataType = 'numeric' | 'categorical' | 'temporal' | 'geographic' | 'text';

export interface ColumnProfile {
  name: string;
  dataType: ColumnDataType;
  totalCount: number;
  nullCount: number;
  uniqueCount: number;
  completeness: number; // 0 - 100%
  min?: number;
  max?: number;
  mean?: number;
  median?: number;
  stdDev?: number;
  q1?: number;
  q3?: number;
  iqr?: number;
  outlierCount?: number;
  sampleValues: (string | number)[];
}

export interface DetectedAnomaly {
  rowIndex: number;
  column: string;
  value: number;
  lowerFence: number;
  upperFence: number;
  severity: 'CRITICAL' | 'MODERATE' | 'MINOR';
  rowIdentifier: string;
}

export interface CorrelationResult {
  columnA: string;
  columnB: string;
  correlation: number; // -1 to 1
  sampleSize: number;
  interpretation: 'STRONG_POSITIVE' | 'MODERATE_POSITIVE' | 'WEAK' | 'MODERATE_NEGATIVE' | 'STRONG_NEGATIVE';
}

export interface DataQualityReport {
  score: number; // 0 - 100
  completenessScore: number;
  consistencyScore: number;
  validityScore: number;
  uniquenessScore: number;
  duplicateRowCount: number;
  totalMissingCells: number;
  totalCells: number;
  missingPercentage: number;
}

export interface DimensionMapping {
  // Common
  categoryField?: string;
  colorField?: string;
  filterField?: string;
  // Globe
  geoField?: string;
  latField?: string;
  lngField?: string;
  heightField?: string;
  secondaryValueField?: string;
  // Network
  sourceField?: string;
  targetField?: string;
  weightField?: string;
  // 3D & 2D Bars
  xCategoryField?: string;
  zCategoryField?: string;
  barHeightField?: string;
  // Scatter
  xField?: string;
  yField?: string;
  zField?: string;
  sizeField?: string;
}

export interface FilterRule {
  column: string;
  type: ColumnDataType;
  // Numeric
  operator?: 'gt' | 'lt' | 'between' | 'eq';
  numMin?: number;
  numMax?: number;
  numValue?: number;
  // Categorical
  selectedCategories?: string[];
  // Global search
  searchTerm?: string;
}

export interface GroupedAggregation {
  groupValue: string;
  count: number;
  sum: number;
  mean: number;
  min: number;
  max: number;
  percentageOfTotal: number;
}

export interface StructuredAIResponse {
  finding: string;
  evidence: string;
  context: string;
  suggestedAction: string;
  referencedMetrics?: Record<string, number | string>;
  isFallback?: boolean;
}

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
  isSynthetic: boolean;
  sourceType: 'preset' | 'uploaded' | 'synthetic';
  rowCount: number;
  rawRows?: Record<string, any>[];
  headers?: string[];
  columnProfiles?: ColumnProfile[];
  dataQuality?: DataQualityReport;
  chartType: VisualizationType;
  axisMapping: Record<string, string>;
  dimensionMapping?: DimensionMapping;
  colorScheme: ColorScheme;
  patterns: string[];
  anomalies: string[];
  detailedAnomalies?: DetectedAnomaly[];
  correlations?: CorrelationResult[];
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
