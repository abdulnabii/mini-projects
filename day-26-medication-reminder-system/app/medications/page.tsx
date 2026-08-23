'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Medication } from '@/types';
import {
  getStoredMedications,
  saveMedication,
  deleteMedication,
} from '@/lib/storage';
import AddMedicationModal from '@/components/AddMedicationModal';
import {
  ArrowLeft,
  Pill,
  Plus,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function MedicationsPage() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    setMedications(getStoredMedications());
  }, []);

  const handleDelete = (id: string) => {
    const updated = deleteMedication(id);
    setMedications(updated);
  };

  const handleRefillStock = (med: Medication) => {
    const updatedMed: Medication = {
      ...med,
      stockCount: med.stockCount + 30,
    };
    const updated = saveMedication(updatedMed);
    setMedications(updated);
    confetti({
      particleCount: 20,
      spread: 50,
      origin: { y: 0.6 },
      colors: ['#10b981', '#06b6d4'],
    });
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
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>MEDICATION CABINET &amp; INVENTORY CONTROL</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-outfit">
              Active Prescriptions &amp; Supply Levels
            </h2>
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              Track remaining pill supply, auto-refill thresholds, doctor prescriptions, and custom dosage instructions.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 text-black font-extrabold text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Prescription</span>
          </button>
        </div>
      </div>

      {/* Medication Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {medications.map((med) => {
          const isLowStock = med.stockCount <= med.refillThreshold;

          return (
            <div
              key={med.id}
              className="p-6 rounded-3xl bg-[#0d1117] border border-slate-800 space-y-4 shadow-xl flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-[10px] font-bold uppercase">
                    {med.form} • {med.frequency.replace('_', ' ')}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleDelete(med.id)}
                    className="text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                    title="Delete medication"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div>
                  <h3 className="font-bold text-white text-base font-outfit">
                    {med.name} <span className="text-cyan-400 text-xs">({med.dosage})</span>
                  </h3>
                  <p className="text-xs text-slate-400">{med.genericName}</p>
                </div>

                <div className="p-3 rounded-xl bg-[#161b22] border border-slate-800 text-xs text-slate-300 font-sans space-y-1">
                  <div>💡 {med.instructions}</div>
                  <div className="text-slate-400 text-[11px]">🎯 {med.purpose}</div>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Prescribing Doctor:</span>
                    <span className="text-white font-bold">{med.prescribingDoctor}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Scheduled Times:</span>
                    <span className="text-cyan-400 font-bold">{med.scheduledTimes.join(', ')}</span>
                  </div>
                </div>
              </div>

              {/* Stock Bar & Refill Button */}
              <div className="space-y-2 pt-3 border-t border-slate-800">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Pills Remaining:</span>
                  <span
                    className={`font-bold ${
                      isLowStock ? 'text-amber-400' : 'text-emerald-400'
                    }`}
                  >
                    {med.stockCount} pills {isLowStock && '⚠️ (Low)'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleRefillStock(med)}
                  className="w-full py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 text-xs text-slate-300 hover:text-emerald-300 font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Refill Stock (+30 Pills)</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Modal */}
      <AddMedicationModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={(newMed) => {
          const updated = saveMedication(newMed);
          setMedications(updated);
        }}
      />
    </div>
  );
}
