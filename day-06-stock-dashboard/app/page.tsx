'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { StockQuote, PriceTick, SentimentResult, PriceAlert } from '@/types';
import {
  initializePriceHistory,
  tickPrices,
  getPriceHistory,
  buildQuote,
  DEFAULT_TICKERS,
  STOCK_NEWS,
} from '@/lib/mock-prices';
import { getAlerts, saveAlert, markAlertTriggered } from '@/lib/storage';
import WatchlistPanel from '@/components/WatchlistPanel';
import PriceChart from '@/components/PriceChart';
import SentimentPanel from '@/components/SentimentPanel';
import MarketOverview from '@/components/MarketOverview';
import AlertManager from '@/components/AlertManager';

export default function DashboardPage() {
  const [initialized, setInitialized] = useState(false);
  const [quotes, setQuotes] = useState<StockQuote[]>([]);
  const [selectedTicker, setSelectedTicker] = useState('NVDA');
  const [chartTicks, setChartTicks] = useState<PriceTick[]>([]);
  const [sentiment, setSentiment] = useState<SentimentResult | null>(null);
  const [sentimentLoading, setSentimentLoading] = useState(false);
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Initialize simulation
  useEffect(() => {
    initializePriceHistory();
    const allQuotes = DEFAULT_TICKERS.map(buildQuote);
    setQuotes(allQuotes);
    setChartTicks(getPriceHistory(selectedTicker));
    setAlerts(getAlerts());
    setInitialized(true);
  }, []);

  // Tick every 2s
  useEffect(() => {
    if (!initialized) return;
    intervalRef.current = setInterval(() => {
      tickPrices();
      const allQuotes = DEFAULT_TICKERS.map(buildQuote);
      setQuotes(allQuotes);
      setChartTicks([...getPriceHistory(selectedTicker)]);

      // Check alerts
      const currentAlerts = getAlerts();
      const prices = Object.fromEntries(allQuotes.map((q) => [q.ticker, q.price]));
      currentAlerts.forEach((alert) => {
        if (alert.triggered) return;
        const price = prices[alert.ticker];
        if (!price) return;
        const triggered = alert.condition === 'above' ? price >= alert.threshold : price <= alert.threshold;
        if (triggered) {
          markAlertTriggered(alert.id);
          if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
            new Notification(`StockPulse Alert: ${alert.ticker}`, {
              body: `${alert.ticker} is now ${alert.condition} $${alert.threshold.toFixed(2)} (Current: $${price.toFixed(2)})`,
            });
          }
          setAlerts(getAlerts());
        }
      });
    }, 2000);

    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [initialized, selectedTicker]);

  // Update chart when ticker changes
  useEffect(() => {
    if (initialized) {
      setChartTicks([...getPriceHistory(selectedTicker)]);
      setSentiment(null);
    }
  }, [selectedTicker, initialized]);

  const handleAnalyzeSentiment = useCallback(async () => {
    setSentimentLoading(true);
    try {
      const headlines = STOCK_NEWS[selectedTicker] || [];
      const res = await fetch('/api/sentiment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticker: selectedTicker, headlines }),
      });
      const data = await res.json();
      setSentiment(data);
    } catch (err) {
      console.error('Sentiment error:', err);
    } finally {
      setSentimentLoading(false);
    }
  }, [selectedTicker]);

  const selectedQuote = quotes.find((q) => q.ticker === selectedTicker);

  const handleAlertsChange = () => setAlerts(getAlerts());

  const currentPriceMap = Object.fromEntries(quotes.map((q) => [q.ticker, q.price]));

  return (
    <div className="flex-1 p-4 max-w-screen-2xl mx-auto w-full space-y-4">
      {/* Market Overview */}
      <div>
        <MarketOverview />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-4">
        {/* Watchlist — left */}
        <div className="col-span-12 lg:col-span-3 space-y-4">
          <WatchlistPanel quotes={quotes} selectedTicker={selectedTicker} onSelect={setSelectedTicker} />
          <AlertManager
            alerts={alerts}
            currentPrices={currentPriceMap}
            watchlistTickers={DEFAULT_TICKERS}
            onAlertsChange={handleAlertsChange}
          />
        </div>

        {/* Chart + Detail — center */}
        <div className="col-span-12 lg:col-span-6 space-y-4">
          {/* Stock Header */}
          {selectedQuote && (
            <div className="bg-[#0d1117] border border-green-500/15 rounded-2xl px-5 py-4">
              <div className="flex items-start justify-between flex-wrap gap-2">
                <div>
                  <div className="text-2xl font-bold text-white font-mono">{selectedQuote.ticker}</div>
                  <div className="text-sm text-slate-400">{selectedQuote.name}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-500 font-mono">Vol: {(selectedQuote.volume / 1_000_000).toFixed(1)}M</div>
                  <div className="text-xs text-slate-500 font-mono">Mkt Cap: {selectedQuote.marketCap}</div>
                  <div className="text-xs text-slate-500 font-mono">H: ${selectedQuote.high.toFixed(2)} / L: ${selectedQuote.low.toFixed(2)}</div>
                </div>
              </div>
            </div>
          )}

          {/* Price Chart */}
          <PriceChart
            ticks={chartTicks}
            ticker={selectedTicker}
            currentPrice={selectedQuote?.price || 0}
            change={selectedQuote?.change || 0}
          />

          {/* All Tickers Quick Row */}
          <div className="bg-[#0d1117] border border-green-500/15 rounded-2xl p-4 overflow-x-auto">
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="text-slate-500 text-[10px] uppercase border-b border-slate-800">
                  <th className="pb-2 text-left">Ticker</th>
                  <th className="pb-2 text-right">Price</th>
                  <th className="pb-2 text-right">Change</th>
                  <th className="pb-2 text-right">% Chg</th>
                  <th className="pb-2 text-right">Volume</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {quotes.map((q) => {
                  const isUp = q.change >= 0;
                  return (
                    <tr key={q.ticker}
                      className={`cursor-pointer hover:bg-slate-900/50 transition-colors ${q.ticker === selectedTicker ? 'bg-green-500/5' : ''}`}
                      onClick={() => setSelectedTicker(q.ticker)}>
                      <td className="py-2 text-left font-bold text-white">{q.ticker}</td>
                      <td className="py-2 text-right text-white tabular-nums">${q.price.toFixed(2)}</td>
                      <td className={`py-2 text-right tabular-nums ${isUp ? 'text-green-400' : 'text-red-400'}`}>{isUp ? '+' : ''}{q.change.toFixed(2)}</td>
                      <td className={`py-2 text-right tabular-nums ${isUp ? 'text-green-400' : 'text-red-400'}`}>{isUp ? '+' : ''}{q.changePercent.toFixed(2)}%</td>
                      <td className="py-2 text-right text-slate-400">{(q.volume / 1_000_000).toFixed(1)}M</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sentiment — right */}
        <div className="col-span-12 lg:col-span-3">
          <SentimentPanel
            ticker={selectedTicker}
            sentiment={sentiment}
            headlines={STOCK_NEWS[selectedTicker] || []}
            loading={sentimentLoading}
            onAnalyze={handleAnalyzeSentiment}
          />
        </div>
      </div>
    </div>
  );
}
