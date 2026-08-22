import { TestConfig, TestResult } from '@/types';
import { BENCHMARK_PRESETS } from './sampleBenchmarks';

const STORAGE_KEYS = {
  SAVED_CONFIGS: 'loadpulse_saved_configs',
  TEST_HISTORY: 'loadpulse_test_history',
};

// Safe LocalStorage Get
function getItem<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.warn(`Error reading ${key} from localStorage:`, e);
    return defaultValue;
  }
}

// Safe LocalStorage Set
function setItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`Error writing ${key} to localStorage:`, e);
  }
}

// Test Results History
export function getStoredTestHistory(): TestResult[] {
  return getItem<TestResult[]>(STORAGE_KEYS.TEST_HISTORY, [
    BENCHMARK_PRESETS[0].mockResult,
    BENCHMARK_PRESETS[1].mockResult,
  ]);
}

export function saveTestResult(result: TestResult): TestResult[] {
  const current = getStoredTestHistory();
  const updated = [result, ...current.filter((r) => r.id !== result.id)].slice(0, 20);
  setItem(STORAGE_KEYS.TEST_HISTORY, updated);
  return updated;
}

export function deleteTestResult(id: string): TestResult[] {
  const current = getStoredTestHistory();
  const updated = current.filter((r) => r.id !== id);
  setItem(STORAGE_KEYS.TEST_HISTORY, updated);
  return updated;
}

export function getTestResultById(id: string): TestResult | null {
  const history = getStoredTestHistory();
  return history.find((r) => r.id === id) || null;
}
