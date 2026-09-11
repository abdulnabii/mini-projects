'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Radio,
  Mic,
  MicOff,
  Monitor,
  PhoneOff,
  Users,
  MessageSquare,
  ShieldAlert,
  CheckCircle2,
  Sparkles,
  Send,
  Clock,
  Check,
  Share2,
} from 'lucide-react';
import { Severity, WarRoomEvent } from '@/types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  serviceName: string;
  severity: Severity;
  incidentId: string;
  isResolved: boolean;
  initialEvents?: WarRoomEvent[];
}

export default function WarRoomModal({
  isOpen,
  onClose,
  serviceName,
  severity,
  incidentId,
  isResolved,
  initialEvents,
}: Props) {
  const [isMuted, setIsMuted] = useState(false);
  const [audioLevel, setAudioLevel] = useState(40);
  const [newNote, setNewNote] = useState('');
  const [shareToast, setShareToast] = useState(false);

  const defaultEvents: WarRoomEvent[] = [
    {
      id: 'e1',
      timestamp: '08:31:02 UTC',
      author: 'PagerDuty',
      role: 'Monitoring Bot',
      type: 'alert',
      message: `P1 trigger: ${serviceName} error rate breached 5% SLA threshold (currently 98.4%).`,
    },
    {
      id: 'e2',
      timestamp: '08:31:40 UTC',
      author: 'Abdul Nabi',
      role: 'Incident Commander',
      type: 'action',
      message: `Declared SRE bridge. Paging database on-call and staging rollback protocol.`,
    },
    {
      id: 'e3',
      timestamp: '08:32:15 UTC',
      author: 'OpsPulse Gemini AI',
      role: 'AI Diagnostic Engine',
      type: 'ai',
      message: `Root cause identified with 94% confidence: HikariCP connection pool exhaustion in newly deployed container image.`,
    },
    {
      id: 'e4',
      timestamp: '08:34:00 UTC',
      author: 'Sarah Chen',
      role: 'Staff SRE',
      type: 'action',
      message: `Checked staging cluster: processRefundBatch lacks finally { client.release() }. Rolling back immediately.`,
    },
  ];

  const [events, setEvents] = useState<WarRoomEvent[]>(initialEvents || defaultEvents);
  const eventsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen || isMuted) return;
    const interval = setInterval(() => {
      setAudioLevel(Math.floor(25 + Math.random() * 55));
    }, 150);
    return () => clearInterval(interval);
  }, [isOpen, isMuted]);

  useEffect(() => {
    if (isResolved) {
      setEvents((prev) => {
        if (prev.some((e) => e.type === 'resolution')) return prev;
        return [
          ...prev,
          {
            id: `res-${Date.now()}`,
            timestamp: new Date().toLocaleTimeString() + ' UTC',
            author: 'Abdul Nabi',
            role: 'Incident Commander',
            type: 'resolution',
            message: `Incident resolved: Rollback verified. Pod health check returned HTTP 200 OK across all replicas.`,
          },
        ];
      });
    }
  }, [isResolved]);

  useEffect(() => {
    eventsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [events]);

  if (!isOpen) return null;

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    const event: WarRoomEvent = {
      id: `note-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString() + ' UTC',
      author: 'Abdul Nabi',
      role: 'Incident Commander',
      type: 'note',
      message: newNote.trim(),
    };

    setEvents((prev) => [...prev, event]);
    setNewNote('');
  };

  const handleShareTelemetry = () => {
    setShareToast(true);
    setTimeout(() => setShareToast(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto font-mono text-xs text-slate-300">
      <div className="bg-[#090d16] border border-amber-500/40 rounded-2xl p-5 max-w-3xl w-full space-y-4 shadow-2xl my-8 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3.5 shrink-0">
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
                {isResolved && (
                  <span className="px-2 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px] font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>RESOLVED</span>
                  </span>
                )}
              </div>
              <p className="text-[10px] text-slate-400 font-sans">
                Live Incident Response Bridge • Target Service: <strong className="text-white font-mono">{serviceName}</strong>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md bg-[#0f1422] text-slate-400 hover:text-white transition-colors cursor-pointer border border-white/[0.08]"
          >
            ✕
          </button>
        </div>

        {/* Responders Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 shrink-0">
          {/* Responder 1 */}
          <div className="p-2.5 rounded-xl bg-[#04060a] border border-emerald-500/30 space-y-1 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-xs">Abdul Nabi</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <p className="text-[10px] text-emerald-400 font-bold">Incident Commander</p>
            <div className="flex items-center gap-1 text-[9px] text-slate-400">
              <span>Mic: </span>
              <strong className={isMuted ? 'text-rose-400' : 'text-emerald-400'}>
                {isMuted ? 'MUTED' : 'LIVE'}
              </strong>
            </div>
          </div>

          {/* Responder 2 */}
          <div className="p-2.5 rounded-xl bg-[#04060a] border border-white/[0.06] space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-xs">Sarah Chen</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </div>
            <p className="text-[10px] text-cyan-400 font-bold">Staff SRE</p>
            <div className="flex items-center gap-1 text-[9px] text-slate-400">
              <span>Mic: <strong className="text-slate-500">Listening</strong></span>
            </div>
          </div>

          {/* Responder 3 */}
          <div className="p-2.5 rounded-xl bg-[#04060a] border border-white/[0.06] space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-xs">Alex Vance</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </div>
            <p className="text-[10px] text-purple-400 font-bold">Database Reliability DBA</p>
            <div className="flex items-center gap-1 text-[9px] text-slate-400">
              <span>Mic: <strong className="text-slate-500">Listening</strong></span>
            </div>
          </div>
        </div>

        {/* Live War Room Chronological Activity Feed */}
        <div className="flex-1 overflow-y-auto space-y-2 p-3.5 rounded-xl bg-[#03050a] border border-white/[0.06] min-h-[220px] max-h-[340px]">
          <div className="flex items-center justify-between text-[10px] text-slate-500 border-b border-white/[0.06] pb-2">
            <span className="font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Incident Operational Timeline ({events.length} entries)</span>
            </span>
            <span>Channel: #incidents-war-room</span>
          </div>

          <div className="space-y-2 pt-1">
            {events.map((ev) => {
              const isAi = ev.type === 'ai';
              const isAlert = ev.type === 'alert';
              const isRes = ev.type === 'resolution';

              return (
                <div
                  key={ev.id}
                  className={`p-2.5 rounded-lg border text-[11px] leading-relaxed transition-colors ${
                    isRes
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-200'
                      : isAi
                      ? 'bg-purple-500/10 border-purple-500/30 text-purple-200'
                      : isAlert
                      ? 'bg-rose-500/10 border-rose-500/30 text-rose-200'
                      : 'bg-[#080d16] border-white/[0.04] text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] mb-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-white">{ev.author}</span>
                      <span className="text-slate-500">({ev.role})</span>
                    </div>
                    <span className="text-slate-500 font-mono">{ev.timestamp}</span>
                  </div>
                  <p className="font-sans text-xs break-words">{ev.message}</p>
                </div>
              );
            })}
            <div ref={eventsEndRef} />
          </div>
        </div>

        {/* Operator Note Logger Input Form */}
        <form onSubmit={handleAddNote} className="flex items-center gap-2 shrink-0">
          <input
            type="text"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Post live incident note to war room (e.g. 'Verified secondary queue draining, latency dropping')..."
            className="flex-1 px-3 py-2 rounded-xl bg-[#04060a] border border-white/[0.08] text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/50 font-mono"
          />
          <button
            type="submit"
            className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs transition-all flex items-center gap-1 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Post Note</span>
          </button>
        </form>

        {/* Audio Visualizer & Control Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-white/[0.08] shrink-0">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Audio Waveform */}
            <div className="flex items-center gap-1 h-5">
              {Array.from({ length: 14 }).map((_, i) => {
                const height = isMuted ? 4 : Math.max(4, Math.sin(i + audioLevel) * 14 + 6);
                return (
                  <div
                    key={i}
                    className="w-1 bg-gradient-to-t from-emerald-500 to-amber-400 rounded-full transition-all duration-75"
                    style={{ height: `${height}px` }}
                  />
                );
              })}
            </div>

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
              <span>{isMuted ? 'Unmute' : 'Mute'}</span>
            </button>

            <button
              type="button"
              onClick={handleShareTelemetry}
              className="px-3 py-1.5 rounded-lg bg-[#0f1422] border border-white/[0.08] text-slate-300 hover:text-white text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>{shareToast ? 'Link Broadcasted!' : 'Broadcast Telemetry'}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-400 text-black font-extrabold text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer w-full sm:w-auto justify-center"
          >
            <PhoneOff className="w-3.5 h-3.5" />
            <span>Leave Bridge</span>
          </button>
        </div>
      </div>
    </div>
  );
}
