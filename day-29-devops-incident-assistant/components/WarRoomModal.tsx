'use client';

import { useState, useEffect } from 'react';
import { Radio, Mic, MicOff, Monitor, PhoneOff, Users, MessageSquare, ShieldAlert, CheckCircle2, Sparkles } from 'lucide-react';
import { Severity } from '@/types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  serviceName: string;
  severity: Severity;
  incidentId: string;
  isResolved: boolean;
}

export default function WarRoomModal({
  isOpen,
  onClose,
  serviceName,
  severity,
  incidentId,
  isResolved,
}: Props) {
  const [isMuted, setIsMuted] = useState(false);
  const [audioLevel, setAudioLevel] = useState(40);

  useEffect(() => {
    if (!isOpen || isMuted) return;
    const interval = setInterval(() => {
      setAudioLevel(Math.floor(25 + Math.random() * 55));
    }, 150);
    return () => clearInterval(interval);
  }, [isOpen, isMuted]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto font-mono text-xs text-slate-300">
      <div className="bg-[#090d16] border border-amber-500/40 rounded-2xl p-5 max-w-2xl w-full space-y-4 shadow-2xl my-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3.5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Radio className="w-4 h-4 text-amber-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-sm font-mono">
                  SRE Incident Bridge: #{incidentId}
                </h3>
                <span className="px-2 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px] font-bold">
                  {severity} WAR ROOM
                </span>
              </div>
              <p className="text-[10px] text-slate-400">
                Live Audio Channel • Target Service: <strong className="text-white">{serviceName}</strong>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md bg-[#0f1422] text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Safety Disclaimer Banner */}
        <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5 text-[11px]">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="text-amber-300 font-bold">Incident Bridge Safety Notice (Demo Environment):</p>
            <p className="text-slate-300 prose-text text-[10px] leading-relaxed">
              This interactive simulator demonstrates real-time incident war-room telemetry. In enterprise production, this opens a dedicated PagerDuty video bridge &amp; Slack #incidents-war-room channel.
            </p>
          </div>
        </div>

        {/* Active Responders Grid */}
        <div className="space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Connected SRE Responders (3 Active):
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* Responder 1 */}
            <div className="p-3 rounded-xl bg-[#04060a] border border-emerald-500/30 space-y-1.5 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-xs">Abdul Nabi</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              </div>
              <p className="text-[10px] text-emerald-400 font-bold">Incident Commander</p>
              <div className="flex items-center gap-1 text-[9px] text-slate-400 pt-1">
                <span>Microphone: </span>
                <strong className={isMuted ? 'text-rose-400' : 'text-emerald-400'}>
                  {isMuted ? 'MUTED' : 'LIVE'}
                </strong>
              </div>
            </div>

            {/* Responder 2 */}
            <div className="p-3 rounded-xl bg-[#04060a] border border-white/[0.06] space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-xs">Sarah Chen</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              </div>
              <p className="text-[10px] text-cyan-400 font-bold">Staff SRE Engineer</p>
              <div className="flex items-center gap-1 text-[9px] text-slate-400 pt-1">
                <span>Microphone: <strong className="text-slate-500">Muted</strong></span>
              </div>
            </div>

            {/* Responder 3 */}
            <div className="p-3 rounded-xl bg-[#04060a] border border-white/[0.06] space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-xs">Alex Vance</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              </div>
              <p className="text-[10px] text-purple-400 font-bold">Database Reliability DBA</p>
              <div className="flex items-center gap-1 text-[9px] text-slate-400 pt-1">
                <span>Microphone: <strong className="text-slate-500">Muted</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Audio Visualizer Waveform */}
        <div className="p-3 rounded-xl bg-[#04060a] border border-white/[0.06] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-rose-400" />
            <span className="text-[10px] font-bold text-slate-400 uppercase">
              Bridge Audio Stream:
            </span>
          </div>

          <div className="flex items-center gap-1 h-5">
            {Array.from({ length: 18 }).map((_, i) => {
              const height = isMuted ? 4 : Math.max(4, Math.sin(i + audioLevel) * 16 + 8);
              return (
                <div
                  key={i}
                  className="w-1 bg-gradient-to-t from-emerald-500 to-amber-400 rounded-full transition-all duration-75"
                  style={{ height: `${height}px` }}
                />
              );
            })}
          </div>

          <span className="text-[10px] font-bold text-slate-400">
            {isMuted ? 'Mic Muted' : 'Audio Streaming'}
          </span>
        </div>

        {/* Bridge Control Bar */}
        <div className="flex items-center justify-between pt-2 border-t border-white/[0.08]">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsMuted(!isMuted)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                isMuted
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  : 'bg-[#0f1422] text-slate-200 border-white/[0.08] hover:text-white'
              }`}
            >
              {isMuted ? <MicOff className="w-3.5 h-3.5 text-rose-400" /> : <Mic className="w-3.5 h-3.5 text-emerald-400" />}
              <span>{isMuted ? 'Unmute Mic' : 'Mute Mic'}</span>
            </button>

            <button
              type="button"
              onClick={() => alert('Screen sharing stream initialized for #incidents-war-room.')}
              className="px-3 py-1.5 rounded-lg bg-[#0f1422] border border-white/[0.08] text-slate-300 hover:text-white text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Monitor className="w-3.5 h-3.5 text-indigo-400" />
              <span>Share Telemetry</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-400 text-black font-extrabold text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <PhoneOff className="w-3.5 h-3.5" />
            <span>Leave Bridge</span>
          </button>
        </div>
      </div>
    </div>
  );
}
