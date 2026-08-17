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
import { getAlerts, markAlertTriggered } from '@/lib/storage';
import WatchlistPanel from '@/components/WatchlistPanel';
import PriceChart from '@/components/PriceChart';
import SentimentPanel from '@/components/SentimentPanel';
import MarketOverview from '@/components/MarketOverview';
import AlertManager from '@/components/AlertManager';
import PortfolioSummary from '@/components/PortfolioSummary';
import { Sparkles, Activity, Layers } from 'lucide-react';

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

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
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
    <div className="flex-1 p-4 sm:p-6 max-w-screen-2xl mx-auto w-full space-y-6 font-mono text-xs text-slate-300">
      {/* Global Marquee Bar */}
      <MarketOverview />

      {/* Main Terminal Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Watchlist & Alerts — Left Column */}
        <div className="col-span-12 lg:col-span-3 space-y-6">
          <WatchlistPanel
            quotes={quotes}
            selectedTicker={selectedTicker}
            onSelect={setSelectedTicker}
          />
          <AlertManager
            alerts={alerts}
            currentPrices={currentPriceMap}
            watchlistTickers={DEFAULT_TICKERS}
            onAlertsChange={handleAlertsChange}
          />
        </div>

        {/* Center: Candlestick/Line Chart & Paper Trading */}
        <div className="col-span-12 lg:col-span-6 space-y-6">
          {/* Active Asset Header Card */}
          {selectedQuote && (
            <div className="bg-[#0b0f19] border border-green-500/20 rounded-3xl p-5 sm:p-6 shadow-2xl shadow-green-500/5">
              <div className="flex items-start justify-between flex-wrap gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl sm:text-3xl font-black text-white font-outfit">
                      {selectedQuote.ticker}
                    </span>
                    {selectedQuote.sector && (
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/30 font-bold">
                        {selectedQuote.sector}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400">{selectedQuote.name}</p>
                </div>

                <div className="text-right space-y-0.5">
                  <div className="text-xs text-slate-400">
                    Mkt Cap: <strong className="text-white">{selectedQuote.marketCap}</strong>
                  </div>
                  <div className="text-xs text-slate-400">
                    24h Range: <strong className="text-white">${selectedQuote.low.toFixed(2)}</strong> - <strong className="text-white">${selectedQuote.high.toFixed(2)}</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Interactive Chart */}
          <PriceChart
            ticks={chartTicks}
            ticker={selectedTicker}
            currentPrice={selectedQuote?.price || 0}
            change={selectedQuote?.change || 0}
          />

          {/* Paper Trading & Portfolio Terminal */}
          <PortfolioSummary quotes={quotes} selectedTicker={selectedTicker} />
        </div>

        {/* Right: AI Quant Sentiment & Catalyst Engine */}
        <div className="col-span-12 lg:col-span-3 space-y-6">
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
