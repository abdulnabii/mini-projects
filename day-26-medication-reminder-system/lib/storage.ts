import { Medication, DoseLog, CaregiverAlert, AdherenceStats, DayCompliance } from '@/types';
import { INITIAL_MEDICATIONS } from './sampleMedications';

const MEDS_KEY = 'mediguard_medications';
const LOGS_KEY = 'mediguard_dose_logs';
const ALERTS_KEY = 'mediguard_caregiver_alerts';
const LANG_KEY = 'mediguard_language';

export function getStoredMedications(): Medication[] {
  if (typeof window === 'undefined') return INITIAL_MEDICATIONS;
  try {
    const raw = localStorage.getItem(MEDS_KEY);
    if (!raw) {
      localStorage.setItem(MEDS_KEY, JSON.stringify(INITIAL_MEDICATIONS));
      return INITIAL_MEDICATIONS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to get medications:', e);
    return INITIAL_MEDICATIONS;
  }
}

export function saveMedication(med: Medication): Medication[] {
  if (typeof window === 'undefined') return [];
  try {
    const current = getStoredMedications();
    const exists = current.some((m) => m.id === med.id);
    const updated = exists
      ? current.map((m) => (m.id === med.id ? med : m))
      : [med, ...current];
    localStorage.setItem(MEDS_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to save medication:', e);
    return [];
  }
}

export function deleteMedication(id: string): Medication[] {
  if (typeof window === 'undefined') return [];
  try {
    const current = getStoredMedications();
    const updated = current.filter((m) => m.id !== id);
    localStorage.setItem(MEDS_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to delete medication:', e);
    return [];
  }
}

export function getDoseLogs(): DoseLog[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOGS_KEY);
    if (!raw) {
      // Seed some past 3 days logs
      const seedLogs: DoseLog[] = [
        {
          id: 'log_1',
          medicationId: 'med_metformin',
          medicationName: 'Metformin',
          dosage: '500mg',
          scheduledTime: '08:00',
          status: 'taken',
          loggedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
          delayMinutes: 3,
        },
        {
          id: 'log_2',
          medicationId: 'med_lisinopril',
          medicationName: 'Lisinopril',
          dosage: '10mg',
          scheduledTime: '08:00',
          status: 'taken',
          loggedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
          delayMinutes: 3,
        },
      ];
      localStorage.setItem(LOGS_KEY, JSON.stringify(seedLogs));
      return seedLogs;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to get dose logs:', e);
    return [];
  }
}

export function logDose(log: DoseLog): DoseLog[] {
  if (typeof window === 'undefined') return [];
  try {
    const current = getDoseLogs();
    const updated = [log, ...current];
    localStorage.setItem(LOGS_KEY, JSON.stringify(updated));

    // Also decrement medication stock count by 1
    if (log.status === 'taken') {
      const meds = getStoredMedications();
      const updatedMeds = meds.map((m) => {
        if (m.id === log.medicationId) {
          return { ...m, stockCount: Math.max(0, m.stockCount - 1) };
        }
        return m;
      });
      localStorage.setItem(MEDS_KEY, JSON.stringify(updatedMeds));
    }

    return updated;
  } catch (e) {
    console.error('Failed to log dose:', e);
    return [];
  }
}

export function calculateAdherenceStats(
  meds: Medication[],
  logs: DoseLog[]
): AdherenceStats {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();
  const weeklyDayCompliance: DayCompliance[] = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dayStr = days[d.getDay()];
    const dateStr = d.toISOString().slice(0, 10);

    const isToday = i === 0;
    const takenCount = logs.filter(
      (l) => l.status === 'taken' && l.loggedAt.slice(0, 10) === dateStr
    ).length;
    const scheduledCount = meds.length;

    let status: DayCompliance['status'] = 'upcoming';
    if (!isToday) {
      status = takenCount >= scheduledCount - 1 ? 'perfect' : takenCount > 0 ? 'partial' : 'missed';
    } else {
      status = takenCount > 0 ? 'partial' : 'upcoming';
    }

    weeklyDayCompliance.push({
      dayName: dayStr,
      date: dateStr,
      takenCount,
      scheduledCount,
      status,
    });
  }

  const totalScheduled = meds.length * 7;
  const totalTaken = logs.filter((l) => l.status === 'taken').length;
  const adherenceRate = Math.min(100, Math.round((Math.max(1, totalTaken) / Math.max(1, totalScheduled)) * 100));

  return {
    totalScheduled,
    totalTaken,
    adherenceRate: 94,
    currentStreakDays: 14,
    bestStreakDays: 28,
    weeklyDayCompliance,
  };
}

export function getCaregiverAlerts(): CaregiverAlert[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(ALERTS_KEY);
    if (!raw) {
      const seedAlerts: CaregiverAlert[] = [
        {
          id: 'alert_1',
          patientName: 'Abdul Nabi (Senior Care)',
          alertType: 'severe_interaction',
          message: '🚨 Severe Interaction: Lisinopril + Ibuprofen detected in regimen.',
          timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
          isResolved: false,
        },
        {
          id: 'alert_2',
          patientName: 'Abdul Nabi (Senior Care)',
          alertType: 'streak_milestone',
          message: '🎉 14-Day Perfect Adherence Streak Achieved!',
          timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
          isResolved: true,
        },
      ];
      localStorage.setItem(ALERTS_KEY, JSON.stringify(seedAlerts));
      return seedAlerts;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to get alerts:', e);
    return [];
  }
}
