'use client';

import { useState } from 'react';
import { Medication, MedicationFrequency, MedicationForm } from '@/types';
import { Plus, X, Pill, Clock, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (med: Medication) => void;
}

export default function AddMedicationModal({ isOpen, onClose, onSave }: Props) {
  const [name, setName] = useState('');
  const [genericName, setGenericName] = useState('');
  const [dosage, setDosage] = useState('10mg');
  const [form, setForm] = useState<MedicationForm>('tablet');
  const [frequency, setFrequency] = useState<MedicationFrequency>('once_daily');
  const [time, setTime] = useState('08:00');
  const [instructions, setInstructions] = useState('Take with a full glass of water');
  const [purpose, setPurpose] = useState('Cardiovascular support');
  const [stockCount, setStockCount] = useState<number>(30);
  const [doctor, setDoctor] = useState('Dr. Fatima Khan');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newMed: Medication = {
      id: `med_${Date.now()}`,
      name: name.trim(),
      genericName: genericName.trim() || name.trim(),
      dosage: dosage.trim(),
      form,
      frequency,
      scheduledTimes: frequency === 'twice_daily' ? [time, '20:00'] : [time],
      instructions: instructions.trim(),
      purpose: purpose.trim(),
      stockCount: Number(stockCount) || 30,
      refillThreshold: 7,
      prescribingDoctor: doctor.trim() || 'Prescribing Physician',
      colorTag: 'emerald',
    };

    onSave(newMed);
    confetti({
      particleCount: 25,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#10b981', '#06b6d4'],
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150 font-mono">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#0d1117] border-2 border-emerald-500/40 p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base font-outfit">
                Add New Prescription to Regimen
              </h3>
              <p className="text-xs text-slate-400">
                Setup custom dose, schedule &amp; refill alert threshold
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Name & Dosage */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-slate-400 font-bold uppercase text-[10px]">
                Brand Name:
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Lipitor, Metformin"
                className="w-full p-3 rounded-xl bg-[#161b22] border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-400 font-bold uppercase text-[10px]">
                Dosage / Strength:
              </label>
              <input
                type="text"
                required
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                placeholder="e.g. 500mg, 10mg"
                className="w-full p-3 rounded-xl bg-[#161b22] border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50"
              />
            </div>
          </div>

          {/* Generic Name */}
          <div className="space-y-1.5">
            <label className="text-slate-400 font-bold uppercase text-[10px]">
              Generic Drug Name (Used for Drug Interaction Checks):
            </label>
            <input
              type="text"
              value={genericName}
              onChange={(e) => setGenericName(e.target.value)}
              placeholder="e.g. Atorvastatin Calcium"
              className="w-full p-3 rounded-xl bg-[#161b22] border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50"
            />
          </div>

          {/* Frequency & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-slate-400 font-bold uppercase text-[10px]">
                Frequency:
              </label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as MedicationFrequency)}
                className="w-full p-3 rounded-xl bg-[#161b22] border border-slate-800 text-white focus:outline-none focus:border-emerald-500/50 cursor-pointer"
              >
                <option value="once_daily">Once Daily</option>
                <option value="twice_daily">Twice Daily</option>
                <option value="thrice_daily">Three Times Daily</option>
                <option value="as_needed">As Needed (PRN)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-400 font-bold uppercase text-[10px]">
                Primary Time:
              </label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="08:00"
                className="w-full p-3 rounded-xl bg-[#161b22] border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50"
              />
            </div>
          </div>

          {/* Instructions */}
          <div className="space-y-1.5">
            <label className="text-slate-400 font-bold uppercase text-[10px]">
              Meal &amp; Dosing Instructions:
            </label>
            <input
              type="text"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. Take immediately after breakfast"
              className="w-full p-3 rounded-xl bg-[#161b22] border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50"
            />
          </div>

          {/* Purpose & Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-slate-400 font-bold uppercase text-[10px]">
                Condition Treated / Purpose:
              </label>
              <input
                type="text"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="e.g. Hypertension control"
                className="w-full p-3 rounded-xl bg-[#161b22] border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-400 font-bold uppercase text-[10px]">
                Starting Stock Count (Pills):
              </label>
              <input
                type="number"
                value={stockCount}
                onChange={(e) => setStockCount(Number(e.target.value))}
                className="w-full p-3 rounded-xl bg-[#161b22] border border-slate-800 text-white focus:outline-none focus:border-emerald-500/50"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 text-black font-extrabold text-xs transition-all shadow-md cursor-pointer"
            >
              Save Medication
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
