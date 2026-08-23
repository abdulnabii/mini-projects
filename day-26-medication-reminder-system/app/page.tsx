'use client';

import { useState, useEffect } from 'react';
import {
  Medication,
  DoseLog,
  InteractionReport,
  AdherenceStats,
} from '@/types';
import {
  getStoredMedications,
  saveMedication,
  getDoseLogs,
  logDose,
  calculateAdherenceStats,
} from '@/lib/storage';
import DoseTimeline from '@/components/DoseTimeline';
import InteractionRadar from '@/components/InteractionRadar';
import PrescriptionScanner from '@/components/PrescriptionScanner';
import AdherenceDashboard from '@/components/AdherenceDashboard';
import MissedDoseAdvisor from '@/components/MissedDoseAdvisor';
import AddMedicationModal from '@/components/AddMedicationModal';
import {
  Pill,
  ShieldCheck,
  Activity,
  Camera,
  Plus,
  AlertTriangle,
  HeartPulse,
  Sparkles,
  Clock,
  CheckCircle2,
  Users,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'timeline' | 'interactions' | 'scanner' | 'adherence'>('timeline');
  const [medications, setMedications] = useState<Medication[]>([]);
  const [doseLogs, setDoseLogs] = useState<DoseLog[]>([]);
  const [interactionReport, setInteractionReport] = useState<InteractionReport | null>(null);
  const [isCheckingInteractions, setIsCheckingInteractions] = useState(false);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [missedAdvisorData, setMissedAdvisorData] = useState<{
    med: Medication | null;
    time: string;
    isOpen: boolean;
  }>({ med: null, time: '', isOpen: false });

  // Load data on mount
  useEffect(() => {
    const meds = getStoredMedications();
    const logs = getDoseLogs();
    setMedications(meds);
    setDoseLogs(logs);

    if (meds.length > 0) {
      checkInteractions(meds);
    }
  }, []);

  const checkInteractions = async (medsList: Medication[]) => {
    setIsCheckingInteractions(true);
    try {
      const res = await fetch('/api/interactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ medications: medsList }),
      });
      const data = await res.json();
      if (data.report) {
        setInteractionReport(data.report);
      }
    } catch (e) {
      console.error('Failed to check interactions:', e);
    } finally {
      setIsCheckingInteractions(false);
    }
  };

  const handleTakeDose = (med: Medication, scheduledTime: string) => {
    const newLog: DoseLog = {
      id: `log_${Date.now()}`,
      medicationId: med.id,
      medicationName: med.name,
      dosage: med.dosage,
      scheduledTime,
      status: 'taken',
      loggedAt: new Date().toISOString(),
      delayMinutes: 0,
    };

    const updatedLogs = logDose(newLog);
    setDoseLogs(updatedLogs);
    setMedications(getStoredMedications());
  };

  const handleAddMedication = (newMed: Medication) => {
    const updated = saveMedication(newMed);
    setMedications(updated);
    checkInteractions(updated);
  };

  const handleBatchAddMeds = (newMeds: Medication[]) => {
    let current = [...medications];
    for (const m of newMeds) {
      current = saveMedication(m);
    }
    setMedications(current);
    checkInteractions(current);
    setActiveTab('timeline');
  };

  const adherenceStats = calculateAdherenceStats(medications, doseLogs);

  return (
    <div className="space-y-10 font-mono w-full min-w-0">
      {/* Centered Hero Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs">
          <HeartPulse className="w-3.5 h-3.5" />
          <span>AI PATIENT MEDICATION SAFETY &amp; ADHERENCE INTELLIGENCE</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight font-outfit">
          Smart Medication Schedule &amp;{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400">
            Clinical Safety Guardian
          </span>
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm font-mono max-w-2xl mx-auto leading-relaxed">
          Manage complex chronic disease regimens with real-time dosing reminders, Gemini-powered drug interaction detection, adherence telemetry, and prescription OCR scanning.
        </p>
      </div>

      {/* 4 Quick Stat Metric Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 max-w-5xl mx-auto font-mono text-left">
        <div className="p-4 rounded-2xl bg-[#0d1117] border border-emerald-500/20 space-y-1 shadow-lg">
          <span className="text-[10px] text-emerald-400 font-bold uppercase flex items-center gap-1.5">
            <Pill className="w-3.5 h-3.5" /> Active Prescriptions
          </span>
          <div className="text-lg font-black text-white">{medications.length} Medications</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0d1117] border border-cyan-500/20 space-y-1 shadow-lg">
          <span className="text-[10px] text-cyan-400 font-bold uppercase flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5" /> 7-Day Adherence
          </span>
          <div className="text-lg font-black text-cyan-300">
            {adherenceStats.adherenceRate}% Compliance
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0d1117] border border-rose-500/20 space-y-1 shadow-lg">
          <span className="text-[10px] text-rose-400 font-bold uppercase flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" /> Clinical Safety
          </span>
          <div className="text-lg font-black text-rose-300">
            {interactionReport?.overallSafetyRating === 'HIGH_RISK'
              ? '🚨 High Risk Alert'
              : '✅ Safe Regimen'}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0d1117] border border-amber-500/20 space-y-1 shadow-lg">
          <span className="text-[10px] text-amber-400 font-bold uppercase flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" /> Adherence Streak
          </span>
          <div className="text-lg font-black text-amber-300">
            {adherenceStats.currentStreakDays} Days 🔥
          </div>
        </div>
      </div>

      {/* Top Workspace Tab Switcher & Quick Add Trigger */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="p-1.5 rounded-2xl bg-[#0d1117] border border-slate-800 flex items-center gap-1.5 max-w-full overflow-x-auto shadow-xl">
          <button
            type="button"
            onClick={() => setActiveTab('timeline')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'timeline'
                ? 'bg-emerald-500 text-black font-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Pill className="w-4 h-4" />
            <span>Today's Dosing Timeline</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('interactions')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'interactions'
                ? 'bg-rose-500 text-white font-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Drug Interaction Radar</span>
            {interactionReport && interactionReport.interactions.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-rose-950 border border-rose-500/40 text-rose-300 text-[9px]">
                {interactionReport.interactions.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('scanner')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'scanner'
                ? 'bg-cyan-500 text-black font-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Prescription OCR</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('adherence')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'adherence'
                ? 'bg-amber-500 text-black font-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Compliance Analytics</span>
          </button>
        </div>

        {/* Quick Add Prescription Modal Trigger */}
        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-500 hover:from-emerald-300 text-black font-extrabold text-xs transition-all shadow-md shadow-emerald-500/20 hover:scale-105 cursor-pointer flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Medication</span>
        </button>
      </div>

      {/* ACTIVE WORKSPACE VIEWS */}
      <div className="space-y-8">
        {/* TAB 1: TODAY'S DOSE TIMELINE */}
        {activeTab === 'timeline' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Urgent Interaction Warning Banner if High Risk */}
            {interactionReport?.overallSafetyRating === 'HIGH_RISK' && (
              <div className="p-4 sm:p-5 rounded-2xl bg-rose-950/30 border-2 border-rose-500/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-xs sm:text-sm font-outfit">
                      🚨 Severe Clinical Interaction Detected in Current Regimen!
                    </h4>
                    <p className="text-[11px] text-rose-200 font-sans">
                      Lisinopril + Ibuprofen combination risks acute kidney injury and blood pressure spikes.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab('interactions')}
                  className="px-3.5 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs transition-colors cursor-pointer shrink-0"
                >
                  View Safety Warnings
                </button>
              </div>
            )}

            <DoseTimeline
              medications={medications}
              doseLogs={doseLogs}
              onTakeDose={handleTakeDose}
              onOpenMissedAdvisor={(med, time) => {
                setMissedAdvisorData({ med, time, isOpen: true });
              }}
            />
          </div>
        )}

        {/* TAB 2: DRUG INTERACTION RADAR */}
        {activeTab === 'interactions' && (
          <div className="animate-in fade-in duration-200">
            <InteractionRadar
              report={interactionReport}
              isLoading={isCheckingInteractions}
              onRecheck={() => checkInteractions(medications)}
            />
          </div>
        )}

        {/* TAB 3: PRESCRIPTION OCR SCANNER */}
        {activeTab === 'scanner' && (
          <div className="animate-in fade-in duration-200">
            <PrescriptionScanner onAddMedications={handleBatchAddMeds} />
          </div>
        )}

        {/* TAB 4: ADHERENCE DASHBOARD */}
        {activeTab === 'adherence' && (
          <div className="animate-in fade-in duration-200">
            <AdherenceDashboard stats={adherenceStats} />
          </div>
        )}
      </div>

      {/* Missed Dose Advisor Modal */}
      <MissedDoseAdvisor
        medication={missedAdvisorData.med}
        scheduledTime={missedAdvisorData.time}
        isOpen={missedAdvisorData.isOpen}
        onClose={() => setMissedAdvisorData((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* Add Medication Modal */}
      <AddMedicationModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddMedication}
      />
    </div>
  );
}
