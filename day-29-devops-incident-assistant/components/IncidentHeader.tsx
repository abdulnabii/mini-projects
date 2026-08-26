'use client';

import { useState, useEffect } from 'react';
import { Incident, Severity } from '@/types';
import {
  AlertTriangle,
  Clock,
  Users,
  DollarSign,
  Flame,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  Server,
} from 'lucide-react';

interface Props {
  incident: Incident;
  allIncidents: Incident[];
  onSelectIncident: (inc: Incident) => void;
  onRediagnose: () => void;
  isAnalyzing: boolean;
  onOpenPostMortem: () => void;
}

export default function IncidentHeader({
  incident,
  allIncidents,
  onSelectIncident,
  onRediagnose,
  isAnalyzing,
  onOpenPostMortem,
}: Props) {
  const [secondsElapsed, setSecondsElapsed] = useState(incident.durationMinutes * 60);

  useEffect(() => {
    setSecondsElapsed(incident.durationMinutes * 60);
    const interval = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [incident]);

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const getSeverityStyle = (sev: Severity) => {
    switch (sev) {
      case 'P1':
        return 'bg-rose-500 text-black border-rose-400 font-extrabold';
      case 'P2':
        return 'bg-amber-500 text-black border-amber-400 font-extrabold';
      case 'P3':
        return 'bg-yellow-500 text-black border-yellow-400 font-bold';
      default:
        return 'bg-emerald-500 text-black border-emerald-400 font-bold';
    }
  };

  return (
    <div className="space-y-4 font-mono text-xs text-slate-300">
      {/* 1. Incident Preset Switcher Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#0d1117] border border-slate-800 shadow-xl">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-bold text-slate-400 uppercase">
            Active Outage Scenarios:
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {allIncidents.map((inc) => (
              <button
                key={inc.id}
                type="button"
                onClick={() => onSelectIncident(inc)}
                className={`px-3 py-1 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer ${
                  incident.id === inc.id
                    ? 'bg-rose-500 text-black font-extrabold shadow-sm'
                    : 'bg-[#161b22] text-slate-300 hover:text-white border border-slate-800'
                }`}
              >
                <span className="text-[9px] px-1 py-0.2 rounded bg-black/20 font-bold">
                  {inc.severity}
                </span>
                <span>{inc.service}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onRediagnose}
            disabled={isAnalyzing}
            className="px-3.5 py-1.5 rounded-lg bg-[#161b22] border border-slate-800 hover:border-rose-500/40 text-slate-300 hover:text-white text-xs font-mono font-medium transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-rose-400 ${isAnalyzing ? 'animate-spin' : ''}`} />
            <span>{isAnalyzing ? 'Diagnosing...' : 'Re-Triage Incident'}</span>
          </button>

          <button
            type="button"
            onClick={onOpenPostMortem}
            className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-rose-500 to-amber-500 text-black font-extrabold text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer hover:brightness-110 shadow-md"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generate Post-Mortem</span>
          </button>
        </div>
      </div>

      {/* 2. Critical Telemetry HUD (4 Metric Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Severity Banner */}
        <div className="p-4 rounded-2xl bg-[#0d1117] border border-rose-500/30 space-y-1.5 shadow-xl hover:border-rose-500/60 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">
              Severity Level
            </span>
            <span className={`px-2 py-0.5 rounded text-[10px] ${getSeverityStyle(incident.severity)}`}>
              {incident.severity} CRITICAL
            </span>
          </div>
          <p className="text-xl font-bold text-white font-mono truncate">{incident.service}</p>
          <div className="flex items-center gap-1.5 text-[10px] text-rose-400 pt-1 border-t border-slate-800">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping shrink-0" />
            <span>SLA Response Window Active</span>
          </div>
        </div>

        {/* Live MTTR Timer */}
        <div className="p-4 rounded-2xl bg-[#0d1117] border border-slate-800 space-y-1.5 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">
              Outage Duration (MTTR)
            </span>
            <Clock className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-amber-400 font-mono">
            {formatTimer(secondsElapsed)}
          </p>
          <p className="text-[10px] text-slate-500 pt-1 border-t border-slate-800">
            Started at {new Date(incident.startedAt).toLocaleTimeString()}
          </p>
        </div>

        {/* Affected Users */}
        <div className="p-4 rounded-2xl bg-[#0d1117] border border-slate-800 space-y-1.5 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">
              Estimated Users Affected
            </span>
            <Users className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <p className="text-2xl font-bold text-cyan-400 font-mono">
            {incident.affectedUsers.toLocaleString()}
          </p>
          <p className="text-[10px] text-slate-500 pt-1 border-t border-slate-800">
            Across global client sessions
          </p>
        </div>

        {/* Revenue Burn Rate */}
        <div className="p-4 rounded-2xl bg-[#0d1117] border border-slate-800 space-y-1.5 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">
              Revenue Burn Rate
            </span>
            <DollarSign className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <p className="text-2xl font-bold text-rose-400 font-mono">
            ${incident.revenueBurnRate.toLocaleString()}
            <span className="text-xs text-slate-500">/min</span>
          </p>
          <p className="text-[10px] text-slate-500 pt-1 border-t border-slate-800">
            Total Impact: ${(incident.revenueBurnRate * Math.floor(secondsElapsed / 60)).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
