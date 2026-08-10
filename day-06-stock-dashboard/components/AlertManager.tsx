'use client';

import { useState } from 'react';
import { Bell, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { PriceAlert } from '@/types';
import { saveAlert, deleteAlert } from '@/lib/storage';

interface AlertManagerProps {
  alerts: PriceAlert[];
  currentPrices: Record<string, number>;
  watchlistTickers: string[];
  onAlertsChange: () => void;
}

export default function AlertManager({ alerts, currentPrices, watchlistTickers, onAlertsChange }: AlertManagerProps) {
  const [showForm, setShowForm] = useState(false);
  const [ticker, setTicker] = useState('AAPL');
  const [condition, setCondition] = useState<'above' | 'below'>('above');
  const [threshold, setThreshold] = useState('');

  const handleAdd = () => {
    if (!threshold || isNaN(Number(threshold))) return;
    const alert: PriceAlert = {
      id: crypto.randomUUID(),
      ticker,
      condition,
      threshold: Number(threshold),
      triggered: false,
      createdAt: new Date().toISOString(),
    };
    saveAlert(alert);
    setShowForm(false);
    setThreshold('');
    onAlertsChange();
  };

  return (
    <div className="bg-[#0d1117] border border-green-500/15 rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">Price Alerts</span>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 transition-all">
          <Plus className="w-3 h-3" /> Add
        </button>
      </div>

      {showForm && (
        <div className="bg-slate-900/60 rounded-xl p-3 space-y-2 border border-slate-800">
          <div className="flex gap-2">
            <select value={ticker} onChange={(e) => setTicker(e.target.value)}
              className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-xs font-mono text-white">
              {watchlistTickers.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <select value={condition} onChange={(e) => setCondition(e.target.value as 'above' | 'below')}
              className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-xs font-mono text-white">
              <option value="above">Price Above</option>
              <option value="below">Price Below</option>
            </select>
          </div>
          <div className="flex gap-2">
            <input type="number" value={threshold} onChange={(e) => setThreshold(e.target.value)}
              placeholder={`Current: $${currentPrices[ticker]?.toFixed(2) || '—'}`}
              className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/50" />
            <button onClick={handleAdd}
              className="px-3 py-1.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-mono hover:bg-amber-500/25 transition-all">
              Set
            </button>
          </div>
        </div>
      )}

      <div className="space-y-1.5">
        {alerts.length === 0 && <p className="text-xs text-slate-600 font-mono text-center py-3">No active alerts</p>}
        {alerts.map((a) => {
          const price = currentPrices[a.ticker];
          return (
            <div key={a.id}
              className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-mono ${a.triggered ? 'bg-green-500/5 border-green-500/30' : 'bg-slate-900/40 border-slate-800'}`}>
              <div>
                <span className={`font-bold ${a.triggered ? 'text-green-400' : 'text-white'}`}>{a.ticker}</span>
                <span className="text-slate-500 mx-1">{a.condition}</span>
                <span className="text-amber-400">${a.threshold.toFixed(2)}</span>
                {a.triggered && <CheckCircle2 className="inline ml-1.5 w-3 h-3 text-green-400" />}
              </div>
              <button onClick={() => { deleteAlert(a.id); onAlertsChange(); }}
                className="text-slate-600 hover:text-red-400 transition-colors">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
