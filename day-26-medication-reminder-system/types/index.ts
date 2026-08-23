export type MedicationForm =
  | 'tablet'
  | 'capsule'
  | 'injection'
  | 'syrup'
  | 'inhaler'
  | 'drops';

export type MedicationFrequency =
  | 'once_daily'
  | 'twice_daily'
  | 'thrice_daily'
  | 'four_times_daily'
  | 'as_needed';

export interface Medication {
  id: string;
  name: string;
  genericName: string;
  dosage: string;
  form: MedicationForm;
  frequency: MedicationFrequency;
  scheduledTimes: string[]; // e.g. ["08:00", "20:00"]
  instructions: string; // e.g. "Take with food"
  purpose: string; // e.g. "Blood pressure control"
  stockCount: number;
  refillThreshold: number;
  prescribingDoctor: string;
  colorTag: string; // e.g. "emerald", "cyan", "purple", "amber"
}

export type DoseStatus = 'taken' | 'skipped' | 'missed' | 'snoozed';

export interface DoseLog {
  id: string;
  medicationId: string;
  medicationName: string;
  dosage: string;
  scheduledTime: string;
  status: DoseStatus;
  loggedAt: string;
  delayMinutes?: number;
  notes?: string;
}

export interface DrugInteraction {
  id: string;
  severity: 'SEVERE' | 'MODERATE' | 'MILD';
  drugs: string[];
  mechanism: string;
  clinicalRisk: string;
  action: string;
  monitoring: string;
  substituteSuggestion?: string;
}

export interface InteractionReport {
  interactions: DrugInteraction[];
  overallSafetyRating: 'HIGH_RISK' | 'MODERATE_RISK' | 'LOW_RISK' | 'SAFE';
  recommendedAction: string;
  totalChecked: number;
}

export interface PrescriptionScanResult {
  patientName?: string;
  doctorName?: string;
  date?: string;
  extractedMedications: {
    name: string;
    dosage: string;
    frequency: MedicationFrequency;
    instructions: string;
    purpose: string;
  }[];
  rawOcrSnippet: string;
  confidenceScore: number;
}

export interface MissedDoseGuidance {
  medicationName: string;
  hoursMissed: number;
  recommendation: 'take_now' | 'skip_to_next' | 'contact_doctor';
  headline: string;
  rationale: string;
  safetyWarnings: string[];
  nextDoseInstructions: string;
}

export interface DayCompliance {
  dayName: string;
  date: string;
  takenCount: number;
  scheduledCount: number;
  status: 'perfect' | 'partial' | 'missed' | 'upcoming';
}

export interface AdherenceStats {
  totalScheduled: number;
  totalTaken: number;
  adherenceRate: number; // 0 - 100
  currentStreakDays: number;
  bestStreakDays: number;
  weeklyDayCompliance: DayCompliance[];
}

export interface CaregiverAlert {
  id: string;
  patientName: string;
  alertType: 'missed_dose' | 'low_stock' | 'severe_interaction' | 'streak_milestone';
  message: string;
  timestamp: string;
  isResolved: boolean;
}
