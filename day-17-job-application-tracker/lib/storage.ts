import { JobApplication, ResumeProfile } from '@/types';
import { DEFAULT_JOB_APPLICATIONS, DEFAULT_RESUME_PROFILE } from './defaultJobs';

const JOBS_STORAGE_KEY = 'careerflow_jobs_v1';
const RESUME_STORAGE_KEY = 'careerflow_resume_v1';

export function getStoredJobs(): JobApplication[] {
  if (typeof window === 'undefined') return DEFAULT_JOB_APPLICATIONS;
  try {
    const raw = localStorage.getItem(JOBS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_JOB_APPLICATIONS;
  } catch (e) {
    return DEFAULT_JOB_APPLICATIONS;
  }
}

export function saveJobsToStorage(jobs: JobApplication[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(jobs));
  } catch (e) {
    console.error('Failed to save jobs to storage:', e);
  }
}

export function getStoredResume(): ResumeProfile {
  if (typeof window === 'undefined') return DEFAULT_RESUME_PROFILE;
  try {
    const raw = localStorage.getItem(RESUME_STORAGE_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_RESUME_PROFILE;
  } catch (e) {
    return DEFAULT_RESUME_PROFILE;
  }
}

export function saveResumeToStorage(resume: ResumeProfile): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(RESUME_STORAGE_KEY, JSON.stringify(resume));
  } catch (e) {
    console.error('Failed to save resume to storage:', e);
  }
}
