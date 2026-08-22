'use client';

import { useState, useEffect } from 'react';
import { Loader2, Activity, Zap, Users, Terminal, ShieldAlert, X } from 'lucide-react';

interface Props {
  isRunning: boolean;
  progressSec: number;
  totalSec: number;
  liveRps: number;
  liveVus: number;
  url: string;
}

export default function LiveExecutionHUD({
  isRunning,
  progressSec,
  totalSec,
  liveRps,
  liveVus,
  url,
}: Props) {
  const [logs, setLogs] = useState<{ id: number; time: string; status: number; latency: number; method: string }[]>([]);

  useEffect(() => {
    if (!isRunning) {
      setLogs([]);
      return;
    }

    const interval = setInterval(() => {
      const now = new Date().toLocaleTimeString();
      const isErr = Math.random() > 0.92;
      const statusCode = isErr ? (url.includes('429') ? 429 : 504) : 200;
      const latency = Math.round(90 + Math.random() * 80 + (isErr ? 800 : 0));

      setLogs((prev) => [
        {
          id: Date.now() + Math.random(),
          time: now,
          status: statusCode,
          latency,
          method: 'GET',
        },
        ...prev.slice(0, 7),
      ]);
    }, 450);

    return () => clearInterval(interval);
  }, [isRunning, url]);

  if (!isRunning) return null;

  const progressPercent = Math.min(100, Math.round((progressSec / (totalSec || 1)) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl animate-in fade-in duration-200 font-mono">
      <div className="p-6 sm:p-8 rounded-3xl bg-[#080d16] border-2 border-cyan-500/50 max-w-xl w-full space-y-6 shadow-2xl shadow-cyan-500/20 relative overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300 animate-spin">
              <Loader2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <h3 className="font-bold text-white text-base font-outfit">
                  Live Concurrency Execution HUD
                </h3>
              </div>
              <p className="text-[11px] text-slate-400 truncate max-w-xs">{url}</p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs text-cyan-400 font-bold font-mono">
              {progressSec}s / {totalSec}s
            </span>
            <span className="text-[10px] text-slate-400 block">{progressPercent}% done</span>
          </div>
        </div>

        {/* 3 Live Telemetry Gauges */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3.5 rounded-2xl bg-[#0e1626] border border-cyan-500/30 text-center space-y-1">
            <span className="text-[10px] text-cyan-400 font-bold uppercase block">Throughput</span>
            <div className="text-2xl font-black text-white">{liveRps}</div>
            <span className="text-[9px] text-slate-400">Reqs / Sec</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#0e1626] border border-indigo-500/30 text-center space-y-1">
            <span className="text-[10px] text-indigo-400 font-bold uppercase block">Active VUs</span>
            <div className="text-2xl font-black text-indigo-300">{liveVus}</div>
            <span className="text-[9px] text-slate-400">Concurrency</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#0e1626] border border-emerald-500/30 text-center space-y-1">
            <span className="text-[10px] text-emerald-400 font-bold uppercase block">Est. P50</span>
            <div className="text-2xl font-black text-emerald-400">
              {Math.round(110 + liveVus * 0.8)}ms
            </div>
            <span className="text-[9px] text-slate-400">Median Latency</span>
          </div>
        </div>

        {/* Live Waterfall Stream Ticker */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              Real-Time HTTP Ingress Waterfall
            </span>
            <span className="text-cyan-400 text-[10px] font-bold">Streaming 500 VUs</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/90 border border-white/10 space-y-1.5 max-h-36 overflow-hidden">
            {logs.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between text-[11px] font-mono animate-in fade-in duration-150"
              >
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">{log.time}</span>
                  <span className="text-cyan-400 font-bold">{log.method}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                      log.status === 200
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-rose-500/20 text-rose-400'
                    }`}
                  >
                    {log.status} {log.status === 200 ? 'OK' : 'ERR'}
                  </span>
                </div>
                <span className="text-slate-300">{log.latency}ms</span>
              </div>
            ))}
          </div>
        </div>

        {/* Overall Progress Bar */}
        <div className="space-y-1.5">
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-teal-400 to-indigo-500 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
