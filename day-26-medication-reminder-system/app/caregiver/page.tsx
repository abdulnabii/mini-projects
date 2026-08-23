'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CaregiverAlert, Medication, DoseLog } from '@/types';
import {
  getCaregiverAlerts,
  getStoredMedications,
  getDoseLogs,
} from '@/lib/storage';
import {
  ArrowLeft,
  Users,
  AlertTriangle,
  CheckCircle2,
  PhoneCall,
  MessageSquare,
  Clock,
  ShieldAlert,
  HeartPulse,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CaregiverPage() {
  const [alerts, setAlerts] = useState<CaregiverAlert[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [doseLogs, setDoseLogs] = useState<DoseLog[]>([]);

  useEffect(() => {
    setAlerts(getCaregiverAlerts());
    setMedications(getStoredMedications());
    setDoseLogs(getDoseLogs());
  }, []);

  const resolveAlert = (id: string) => {
    const updated = alerts.map((a) => (a.id === id ? { ...a, isResolved: true } : a));
    setAlerts(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('mediguard_caregiver_alerts', JSON.stringify(updated));
    }
  };

  const sendWhatsAppReminder = () => {
    const text = encodeURIComponent(
      'Assalam-o-Alaikum! Friendly reminder from MediGuard.AI to take your afternoon blood pressure & diabetes medications.'
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-8 font-mono w-full min-w-0">
      {/* Back Link */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Regimen Dashboard</span>
      </Link>

      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0d1117] border border-cyan-500/30 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs">
              <Users className="w-3.5 h-3.5" />
              <span>CAREGIVER &amp; FAMILY COMPLIANCE MONITOR</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-outfit">
              Remote Patient Oversight &amp; Alerts
            </h2>
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              Monitor senior family members' medication adherence, receive automatic alerts for missed doses, and dispatch WhatsApp reminders.
            </p>
          </div>

          <button
            type="button"
            onClick={sendWhatsAppReminder}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-extrabold text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Send WhatsApp Reminder</span>
          </button>
        </div>
      </div>

      {/* Patient Overview Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0d1117] border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-black font-black text-xs font-mono">
              AN
            </div>
            <div>
              <h3 className="font-bold text-white text-sm font-outfit">
                Abdul Nabi (Elderly Patient Care)
              </h3>
              <span className="text-[10px] text-slate-400">
                Primary Conditions: Type 2 Diabetes, Hypertension, CVD Prevention
              </span>
            </div>
          </div>

          <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold">
            🟢 Active &amp; Adherent (94%)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-2xl bg-[#161b22] border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Morning Doses:</span>
            <div className="text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Taken at 08:03 AM
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#161b22] border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Next Dose Window:</span>
            <div className="text-cyan-400 font-bold flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> 01:00 PM (Aspirin 81mg)
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#161b22] border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Emergency Doctor:</span>
            <div className="text-white font-bold flex items-center gap-1">
              <PhoneCall className="w-3.5 h-3.5 text-rose-400" /> Dr. Tariq (Cardiology)
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Caregiver Alerts Feed */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0d1117] border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="font-bold text-white text-sm font-outfit">
            Caregiver Telemetry Alerts Feed ({alerts.length})
          </h3>
          <span className="text-[10px] text-slate-500 uppercase font-bold">
            Live Stream
          </span>
        </div>

        <div className="space-y-3">
          {alerts.map((a) => {
            const isSevere = a.alertType === 'severe_interaction';
            const isStreak = a.alertType === 'streak_milestone';

            return (
              <div
                key={a.id}
                className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs ${
                  a.isResolved
                    ? 'bg-[#161b22]/50 border-slate-800/80 opacity-60'
                    : isSevere
                    ? 'bg-rose-950/20 border-rose-500/40 text-rose-200'
                    : isStreak
                    ? 'bg-amber-950/20 border-amber-500/40 text-amber-200'
                    : 'bg-[#161b22] border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  {isSevere ? (
                    <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />
                  ) : (
                    <HeartPulse className="w-5 h-5 text-amber-400 shrink-0" />
                  )}
                  <div>
                    <div className="font-bold text-white font-outfit text-sm">
                      {a.message}
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {new Date(a.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>

                {!a.isResolved && (
                  <button
                    type="button"
                    onClick={() => resolveAlert(a.id)}
                    className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 text-[11px] font-bold text-slate-300 hover:text-emerald-300 transition-colors cursor-pointer shrink-0"
                  >
                    Mark as Acknowledged
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
