import { Holding, PriceAlert } from '@/types';

const HOLDINGS_KEY = 'stockpulse_holdings_v1';
const ALERTS_KEY = 'stockpulse_alerts_v1';
const WATCHLIST_KEY = 'stockpulse_watchlist_v1';

export function getHoldings(): Holding[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(HOLDINGS_KEY) || '[]'); } catch { return []; }
}

export function saveHolding(h: Holding) {
  if (typeof window === 'undefined') return;
  const all = getHoldings();
  localStorage.setItem(HOLDINGS_KEY, JSON.stringify([...all.filter((x) => x.id !== h.id), h]));
}

export function deleteHolding(id: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(HOLDINGS_KEY, JSON.stringify(getHoldings().filter((h) => h.id !== id)));
}

export function getAlerts(): PriceAlert[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(ALERTS_KEY) || '[]'); } catch { return []; }
}

export function saveAlert(a: PriceAlert) {
  if (typeof window === 'undefined') return;
  const all = getAlerts();
  localStorage.setItem(ALERTS_KEY, JSON.stringify([...all.filter((x) => x.id !== a.id), a]));
}

export function markAlertTriggered(id: string) {
  if (typeof window === 'undefined') return;
  const all = getAlerts().map((a) => a.id === id ? { ...a, triggered: true } : a);
  localStorage.setItem(ALERTS_KEY, JSON.stringify(all));
}

export function deleteAlert(id: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ALERTS_KEY, JSON.stringify(getAlerts().filter((a) => a.id !== id)));
}

export function getWatchlist(): string[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(WATCHLIST_KEY) || '["AAPL","NVDA","MSFT","GOOGL","META","TSLA","AMZN"]'); } catch { return []; }
}

export function saveWatchlist(tickers: string[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(WATCHLIST_KEY, JSON.stringify(tickers));
}
