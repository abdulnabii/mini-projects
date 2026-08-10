export interface PatientVitals {
  glucose: number; // Fasting Glucose (mg/dL) - normal <100
  bmi: number; // Body Mass Index (kg/m²) - normal 18.5 - 24.9
  age: number; // Age (years)
  bloodPressure: number; // Diastolic Blood Pressure (mmHg) - normal <80
  insulin: number; // 2-Hour Serum Insulin (mu U/ml) - normal <160
  skinThickness: number; // Triceps Skin Fold Thickness (mm) - normal <25
  pregnancies: number; // Number of Pregnancies
  diabetesPedigree: number; // Diabetes Pedigree Function (family history ratio) - normal <0.5
}

export type VitalStatus = 'NORMAL' | 'ELEVATED' | 'CRITICAL';

export interface SHAPFactor {
  name: string;
  key: keyof PatientVitals;
  value: number;
  shapScore: number; // signed contribution score
  impactPercent: number; // 0 to 100
  status: VitalStatus;
  normalRange: string;
}

export interface MLPredictionResult {
  probability: number; // 0.0 to 1.0 (e.g. 0.82)
  riskPercent: number; // 0 to 100
  classification: 'LOW_RISK' | 'MODERATE_RISK' | 'HIGH_RISK';
  confidence: number; // 0 to 100
  modelName: string;
  shapFactors: SHAPFactor[];
  flaggedCount: number;
}

export interface RecommendationItem {
  id: string;
  category: 'Diet' | 'Physical Activity' | 'Weight Management' | 'Medical Follow-Up';
  advice: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  icon: string;
}

export interface RiskSession {
  id: string;
  patientName: string;
  createdAt: string;
  vitals: PatientVitals;
  prediction: MLPredictionResult;
  recommendations: RecommendationItem[];
}
