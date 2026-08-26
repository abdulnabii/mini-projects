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
  Radio,
  ExternalLink,
  ShieldAlert,
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
    const hours = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const getSeverityStyle = (sev: Severity) => {
    switch (sev) {
      case 'P1':
        return 'bg-rose-500 text-black border-rose-400 font-extrabold shadow-lg shadow-rose-500/20';
      case 'P2':
        return 'bg-amber-500 text-black border-amber-400 font-extrabold';
      case 'P3':
        return 'bg-yellow-500 text-black border-yellow-400 font-bold';
      default:
        return 'bg-emerald-500 text-black border-emerald-400 font-bold';
    }
  };

  return (
    <div className="space-y-3.5 font-mono text-xs text-slate-300">
      {/* 1. Incident Scenario Switcher Toolbar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 p-3 rounded-xl bg-[#090d16] border border-white/[0.08] shadow-2xl">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Simulate Production Outages:
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {allIncidents.map((inc) => (
              <button
                key={inc.id}
                type="button"
                onClick={() => onSelectIncident(inc)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-2 cursor-pointer border ${
                  incident.id === inc.id
                    ? 'bg-rose-500/15 border-rose-500 text-rose-300 font-bold shadow-sm'
                    : 'bg-[#0f1422] text-slate-400 hover:text-white border-white/[0.05] hover:border-white/[0.15]'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    inc.severity === 'P1'
                      ? 'bg-rose-500 animate-pulse'
                      : inc.severity === 'P2'
                      ? 'bg-amber-500'
                      : inc.severity === 'P3'
                      ? 'bg-yellow-400'
                      : 'bg-emerald-400'
                  }`}
                />
                <span className="font-bold">{inc.severity}</span>
                <span className="text-slate-300 font-medium">{inc.service}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={onRediagnose}
            disabled={isAnalyzing}
            className="px-3.5 py-1.5 rounded-lg bg-[#0f1422] border border-white/[0.08] hover:border-rose-500/50 text-slate-200 hover:text-white text-xs font-mono font-medium transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-rose-400 ${isAnalyzing ? 'animate-spin' : ''}`} />
            <span>{isAnalyzing ? 'Triage in Progress...' : 'Re-Diagnose'}</span>
          </button>

          <a
            href="https://meet.google.com/sre-incident-bridge"
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-1.5 rounded-lg bg-[#0f1422] border border-white/[0.08] hover:border-amber-500/50 text-amber-300 text-xs font-mono font-medium transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Radio className="w-3.5 h-3.5 text-rose-500 animate-ping" />
            <span>War Room</span>
          </a>

          <button
            type="button"
            onClick={onOpenPostMortem}
            className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-rose-500 to-amber-500 text-black font-extrabold text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer hover:brightness-110 shadow-lg shadow-rose-500/10"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Post-Mortem Studio</span>
          </button>
        </div>
      </div>

      {/* 2. Enterprise Telemetry Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Severity Banner */}
        <div className="p-4 rounded-xl bg-[#090d16] border border-white/[0.08] space-y-1.5 relative overflow-hidden sre-card">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase font-mono tracking-wider">
              Severity Level
            </span>
            <span className={`px-2 py-0.5 rounded text-[10px] ${getSeverityStyle(incident.severity)}`}>
              {incident.severity} CRITICAL
            </span>
          </div>
          <p className="text-xl font-bold text-white font-mono truncate">{incident.service}</p>
          <div className="flex items-center gap-1.5 text-[10px] text-rose-400 pt-1 border-t border-white/[0.06]">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping shrink-0" />
            <span>Active Incident State: INVESTIGATING</span>
          </div>
        </div>

        {/* Live MTTR Timer */}
        <div className="p-4 rounded-xl bg-[#090d16] border border-white/[0.08] space-y-1.5 sre-card">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase font-mono tracking-wider">
              Outage Stopwatch (MTTR)
            </span>
            <Clock className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-amber-400 font-mono tracking-tight">
            {formatTimer(secondsElapsed)}
          </p>
          <p className="text-[10px] text-slate-500 pt-1 border-t border-white/[0.06]">
            Incident Trigger: {new Date(incident.startedAt).toLocaleTimeString()}
          </p>
        </div>

        {/* Affected Users */}
        <div className="p-4 rounded-xl bg-[#090d16] border border-white/[0.08] space-y-1.5 sre-card">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase font-mono tracking-wider">
              Impacted User Sessions
            </span>
            <Users className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <p className="text-2xl font-bold text-cyan-400 font-mono tracking-tight">
            {incident.affectedUsers.toLocaleString()}
          </p>
          <p className="text-[10px] text-slate-500 pt-1 border-t border-white/[0.06]">
            Total Global Active Connections
          </p>
        </div>

        {/* Revenue Burn Rate */}
        <div className="p-4 rounded-xl bg-[#090d16] border border-white/[0.08] space-y-1.5 sre-card">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase font-mono tracking-wider">
              Revenue Burn Rate
            </span>
            <DollarSign className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <p className="text-2xl font-bold text-rose-400 font-mono tracking-tight">
            ${incident.revenueBurnRate.toLocaleString()}
            <span className="text-xs text-slate-500 font-normal"> /min</span>
          </p>
          <p className="text-[10px] text-slate-500 pt-1 border-t border-white/[0.06]">
            Accumulated Loss: ${(incident.revenueBurnRate * Math.max(1, Math.floor(secondsElapsed / 60))).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
