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
  ShieldAlert,
} from 'lucide-react';

interface Props {
  incident: Incident;
  allIncidents: Incident[];
  onSelectIncident: (inc: Incident) => void;
  onRediagnose: () => void;
  isAnalyzing: boolean;
  onOpenPostMortem: () => void;
  onOpenWarRoom: () => void;
  isResolved?: boolean;
}

export const SEVERITY_TAXONOMY: Record<
  Severity,
  { label: string; bg: string; text: string; border: string; dot: string }
> = {
  P1: {
    label: 'Critical',
    bg: 'bg-rose-500 text-black border-rose-400 font-extrabold shadow-lg shadow-rose-500/20',
    text: 'text-rose-400',
    border: 'border-rose-500/40',
    dot: 'bg-rose-500',
  },
  P2: {
    label: 'High',
    bg: 'bg-orange-500 text-black border-orange-400 font-extrabold shadow-lg shadow-orange-500/20',
    text: 'text-orange-400',
    border: 'border-orange-500/40',
    dot: 'bg-orange-500',
  },
  P3: {
    label: 'Medium',
    bg: 'bg-amber-400 text-black border-amber-300 font-bold',
    text: 'text-amber-300',
    border: 'border-amber-500/40',
    dot: 'bg-amber-400',
  },
  P4: {
    label: 'Low',
    bg: 'bg-cyan-500 text-black border-cyan-400 font-bold',
    text: 'text-cyan-300',
    border: 'border-cyan-500/40',
    dot: 'bg-cyan-400',
  },
};

export default function IncidentHeader({
  incident,
  allIncidents,
  onSelectIncident,
  onRediagnose,
  isAnalyzing,
  onOpenPostMortem,
  onOpenWarRoom,
  isResolved = false,
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

  const currentSev = SEVERITY_TAXONOMY[incident.severity];

  return (
    <div className="space-y-3.5 font-mono text-xs text-slate-300">
      {/* 1. Incident Scenario Switcher Toolbar & Primary Actions */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 p-3.5 rounded-xl bg-[#090d16] border border-white/[0.08] shadow-2xl">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Simulate Outages:
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {allIncidents.map((inc) => {
              const incConfig = SEVERITY_TAXONOMY[inc.severity];
              const isSelected = incident.id === inc.id;

              return (
                <button
                  key={inc.id}
                  type="button"
                  onClick={() => onSelectIncident(inc)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-2 cursor-pointer border ${
                    isSelected
                      ? 'bg-rose-500/15 border-rose-500 text-white font-bold shadow-sm'
                      : 'bg-[#0f1422] text-slate-400 hover:text-white border-white/[0.05] hover:border-white/[0.15]'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${incConfig.dot} ${
                      inc.severity === 'P1' ? 'animate-pulse' : ''
                    }`}
                  />
                  <span className="font-bold">{inc.severity} {incConfig.label}</span>
                  <span className="text-slate-400 font-normal truncate max-w-[120px]">{inc.service}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Controls with clear Visual Hierarchy */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {/* Secondary Action: War Room Simulator (Subtle / Ghost Style) */}
          <button
            type="button"
            onClick={onOpenWarRoom}
            className="px-3 py-1.5 rounded-lg bg-[#0b101b] border border-white/[0.08] hover:border-amber-500/40 text-slate-400 hover:text-amber-300 text-xs font-mono font-medium transition-all flex items-center gap-1.5 cursor-pointer"
            title="Open simulated incident voice bridge"
          >
            <Radio className="w-3.5 h-3.5 text-amber-400" />
            <span>War Room Bridge</span>
          </button>

          {/* Primary Action 1: Re-Diagnose (Prominent Border & Weight) */}
          <button
            type="button"
            onClick={onRediagnose}
            disabled={isAnalyzing}
            className="px-4 py-1.5 rounded-lg bg-[#141b2b] border border-rose-500/50 hover:border-rose-400 text-white hover:text-rose-200 text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-md shadow-rose-500/10"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-rose-400 ${isAnalyzing ? 'animate-spin' : ''}`} />
            <span>{isAnalyzing ? 'Triage Running...' : 'Re-Diagnose SRE'}</span>
          </button>

          {/* Primary Action 2: Post-Mortem Studio (High Priority Solid CTA) */}
          <button
            type="button"
            onClick={onOpenPostMortem}
            className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-rose-500 to-amber-500 text-black font-extrabold text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer hover:brightness-110 shadow-lg shadow-rose-500/20"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Post-Mortem Studio</span>
          </button>
        </div>
      </div>

      {/* 2. Telemetry Grid with Refined Visual Hierarchy */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Severity Banner (Primary Stat Card) */}
        <div className="p-4 rounded-xl bg-[#090d16] border border-white/[0.08] space-y-1.5 relative overflow-hidden sre-card">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase font-mono tracking-wider">
              Severity Level
            </span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] ${
                isResolved
                  ? 'bg-emerald-500 text-black border-emerald-400 font-extrabold shadow-lg shadow-emerald-500/20'
                  : currentSev.bg
              }`}
            >
              {isResolved ? 'RESOLVED' : `${incident.severity} ${currentSev.label.toUpperCase()}`}
            </span>
          </div>
          <p className="text-xl font-bold text-white font-mono truncate">{incident.service}</p>
          <div className="flex items-center gap-1.5 text-[10px] pt-1 border-t border-white/[0.06]">
            {isResolved ? (
              <div className="flex items-center gap-1 text-emerald-400 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Active Incident State: RESOLVED / MITIGATED</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-rose-400 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping shrink-0" />
                <span>Active Incident State: INVESTIGATING</span>
              </div>
            )}
          </div>
        </div>

        {/* Live MTTR Timer (Primary Stat Card) */}
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

        {/* Impacted Users (De-emphasized Secondary Stat Card) */}
        <div className="p-4 rounded-xl bg-[#070b13] border border-white/[0.04] space-y-1.5 opacity-90 hover:opacity-100 transition-opacity">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-medium text-slate-400 uppercase font-mono tracking-wider">
              Impacted Sessions
            </span>
            <Users className="w-3.5 h-3.5 text-slate-500" />
          </div>
          <p className="text-2xl font-semibold text-slate-200 font-mono tracking-tight">
            {incident.affectedUsers.toLocaleString()}
          </p>
          <p className="text-[10px] text-slate-500 pt-1 border-t border-white/[0.04]">
            Global Active Connections
          </p>
        </div>

        {/* Revenue Burn Rate (De-emphasized Secondary Stat Card) */}
        <div className="p-4 rounded-xl bg-[#070b13] border border-white/[0.04] space-y-1.5 opacity-90 hover:opacity-100 transition-opacity">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-medium text-slate-400 uppercase font-mono tracking-wider">
              Est. Revenue Burn
            </span>
            <DollarSign className="w-3.5 h-3.5 text-slate-500" />
          </div>
          <p className="text-2xl font-semibold text-slate-200 font-mono tracking-tight">
            ${incident.revenueBurnRate.toLocaleString()}
            <span className="text-xs text-slate-500 font-normal"> /min</span>
          </p>
          <p className="text-[10px] text-slate-500 pt-1 border-t border-white/[0.04]">
            Total: ${(incident.revenueBurnRate * Math.max(1, Math.floor(secondsElapsed / 60))).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
