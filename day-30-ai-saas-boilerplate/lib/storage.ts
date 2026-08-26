import { AIUsageLog, Invoice, Organization, PlanTier } from '@/types';
import { INITIAL_INVOICES, INITIAL_ORGS } from './sampleData';

const ORG_STORAGE_KEY = 'saasforge_orgs_v1';
const ACTIVE_ORG_KEY = 'saasforge_active_org_id_v1';
const USAGE_LOGS_KEY = 'saasforge_usage_logs_v1';
const INVOICES_KEY = 'saasforge_invoices_v1';

export function getStoredOrganizations(): Organization[] {
  if (typeof window === 'undefined') return INITIAL_ORGS;
  try {
    const raw = localStorage.getItem(ORG_STORAGE_KEY);
    return raw ? JSON.parse(raw) : INITIAL_ORGS;
  } catch {
    return INITIAL_ORGS;
  }
}

export function saveOrganizations(orgs: Organization[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ORG_STORAGE_KEY, JSON.stringify(orgs));
  } catch (e) {
    console.error('Failed to save organizations:', e);
  }
}

export function getStoredActiveOrgId(): string {
  if (typeof window === 'undefined') return INITIAL_ORGS[0].id;
  try {
    return localStorage.getItem(ACTIVE_ORG_KEY) || INITIAL_ORGS[0].id;
  } catch {
    return INITIAL_ORGS[0].id;
  }
}

export function saveActiveOrgId(id: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ACTIVE_ORG_KEY, id);
  } catch (e) {
    console.error('Failed to save active org ID:', e);
  }
}

export function getStoredUsageLogs(): AIUsageLog[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(USAGE_LOGS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveUsageLogs(logs: AIUsageLog[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(USAGE_LOGS_KEY, JSON.stringify(logs.slice(0, 50)));
  } catch (e) {
    console.error('Failed to save usage logs:', e);
  }
}

export function getStoredInvoices(): Invoice[] {
  if (typeof window === 'undefined') return INITIAL_INVOICES;
  try {
    const raw = localStorage.getItem(INVOICES_KEY);
    return raw ? JSON.parse(raw) : INITIAL_INVOICES;
  } catch {
    return INITIAL_INVOICES;
  }
}

export function saveInvoices(invoices: Invoice[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(INVOICES_KEY, JSON.stringify(invoices));
  } catch (e) {
    console.error('Failed to save invoices:', e);
  }
}
