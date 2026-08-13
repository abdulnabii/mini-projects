export type ModelType = 'xray' | 'dermatology';

export interface ProbabilityMap {
  [className: string]: number; // e.g. { "Pneumonia": 0.913, "Normal": 0.087 }
}

export interface ClassificationResult {
  id: string;
  modelType: ModelType;
  predictedClass: string;
  confidence: number; // e.g. 0.913
  probabilities: ProbabilityMap;
  uncertaintyFlag: boolean; // true if top prob < 0.70
  inferenceTimeMs: number;
  gradcamLayerName: string;
  heatmapGrid: number[][]; fontGridSize?: number; // 14x14 grid of activation intensities (0.0 to 1.0)
  educationalAnnotation?: EducationalAnnotation;
}

export interface EducationalAnnotation {
  anatomicalRegion: string;
  radiologyExplanation: string;
  clinicalRelevance: string;
  aiLimitationNote: string;
}

export interface SampleMedicalImage {
  id: string;
  title: string;
  modelType: ModelType;
  groundTruth: string;
  description: string;
  imageUrl: string; // SVG or Canvas data URL
}
