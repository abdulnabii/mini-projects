export type ModelType = 'xray' | 'dermatology';

export interface PathologyFinding {
  condition: string;
  probability: number; // 0.0 to 1.0
  riskLevel: 'NORMAL' | 'LOW_RISK' | 'MODERATE_RISK' | 'CRITICAL';
  anatomicalLocation: string;
  clinicalSignificance: string;
}

export interface ProbabilityMap {
  [className: string]: number; // e.g. { "Pneumonia": 0.913, "Normal": 0.087 }
}

export interface EducationalAnnotation {
  anatomicalRegion: string;
  radiologyExplanation: string;
  clinicalRelevance: string;
  aiLimitationNote: string;
  recommendedWorkup?: string[];
}

export interface ClassificationResult {
  id: string;
  modelType: ModelType;
  predictedClass: string;
  confidence: number; // e.g. 0.913
  probabilities: ProbabilityMap;
  differentialFindings: PathologyFinding[];
  uncertaintyFlag: boolean; // true if top prob < 0.70
  inferenceTimeMs: number;
  gradcamLayerName: string;
  heatmapGrid: number[][]; // 16x16 grid of activation intensities (0.0 to 1.0)
  educationalAnnotation?: EducationalAnnotation;
  patientId?: string;
  studyDate?: string;
  modalityCode?: string;
}

export interface SampleMedicalImage {
  id: string;
  title: string;
  modelType: ModelType;
  groundTruth: string;
  description: string;
  imageUrl: string;
  keyFindings: string;
}
