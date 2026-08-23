'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Medication, DoseLog, AdherenceStats } from '@/types';
import {
  getStoredMedications,
  getDoseLogs,
  calculateAdherenceStats,
} from '@/lib/storage';
import AdherenceDashboard from '@/components/AdherenceDashboard';
import {
  ArrowLeft,
  Activity,
  Calendar,
  Download,
  CheckCircle2,
  Clock,
  Sparkles,
  Award,
} from 'lucide-react';

export default function AdherencePage() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [doseLogs, setDoseLogs] = useState<DoseLog[]>([]);

  useEffect(() => {
    setMedications(getStoredMedications());
    setDoseLogs(getDoseLogs());
  }, []);

  const stats: AdherenceStats = calculateAdherenceStats(medications, doseLogs);

  const exportComplianceReport = () => {
    const reportData = {
      patient: 'Abdul Nabi (Active Regimen)',
      generatedDate: new Date().toISOString(),
      adherenceRate: `${stats.adherenceRate}%`,
      streakDays: stats.currentStreakDays,
      totalScheduledDoses: stats.totalScheduled,
      totalLoggedDoses: stats.totalTaken,
      doseLogs,
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(reportData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `mediguard_adherence_report_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
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
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0d1117] border border-emerald-500/30 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs">
              <Activity className="w-3.5 h-3.5" />
              <span>CLINICAL ADHERENCE &amp; COMPLIANCE TELEMETRY</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-outfit">
              Patient Medication Adherence Scorecard
            </h2>
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              Real-time compliance tracking, 14-day adherence streak analytics, and doctor-ready audit logs.
            </p>
          </div>

          <button
            type="button"
            onClick={exportComplianceReport}
            className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-200 hover:text-white flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export Audit JSON</span>
          </button>
        </div>
      </div>

      {/* Main Charts Component */}
      <AdherenceDashboard stats={stats} />

      {/* Dose Log Table */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0d1117] border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="font-bold text-white text-sm font-outfit">
            Recent Dosing Audit Log ({doseLogs.length} entries)
          </h3>
          <span className="text-[10px] text-slate-500 uppercase font-bold">
            Audit Trail
          </span>
        </div>

        {doseLogs.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-6">
            No dose logs recorded yet. Mark your first dose on the timeline!
          </p>
        ) : (
          <div className="divide-y divide-slate-800/80 max-h-96 overflow-y-auto">
            {doseLogs.map((log) => (
              <div
                key={log.id}
                className="py-3 flex items-center justify-between gap-4 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-white font-outfit">
                      {log.medicationName}{' '}
                      <span className="text-cyan-400 text-[10px]">
                        ({log.dosage})
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400">
                      Scheduled: {log.scheduledTime}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                    TAKEN
                  </span>
                  <div className="text-[10px] text-slate-500 pt-0.5">
                    {new Date(log.loggedAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
