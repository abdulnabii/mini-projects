'use client';

import React, { useState } from 'react';
import { PatientContext } from '@/types';
import { User, Calendar, Clock, Gauge, FileText, Check } from 'lucide-react';

interface PatientIntakeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (context: PatientContext) => void;
  initialData?: PatientContext;
}

export default function PatientIntakeModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: PatientIntakeModalProps) {
  const [age, setAge] = useState<number | ''>(initialData?.age || 28);
  const [gender, setGender] = useState<string>(initialData?.gender || 'Prefer not to say');
  const [duration, setDuration] = useState<string>(initialData?.duration || '2-3 days');
  const [severity, setSeverity] = useState<number>(initialData?.severity || 5);
  const [preExistingConditions, setPreExistingConditions] = useState<string>(
    initialData?.preExistingConditions || ''
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      age: typeof age === 'number' ? age : undefined,
      gender,
      duration,
      severity,
      preExistingConditions,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-6 relative overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <User className="w-5 h-5 text-cyan-400" />
              <span>Patient Profile & Symptom Context</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Providing details helps the AI give more accurate clinical triage suggestions.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" /> Age
              </label>
              <input
                type="number"
                min={1}
                max={120}
                value={age}
                onChange={(e) => setAge(e.target.value ? parseInt(e.target.value) : '')}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                placeholder="e.g. 35"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-cyan-400" /> Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Non-binary">Non-binary</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-cyan-400" /> Symptom Duration
            </label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="Less than 24 hours">Less than 24 hours</option>
              <option value="1-3 days">1-3 days</option>
              <option value="4-7 days">4-7 days</option>
              <option value="2+ weeks">2+ weeks</option>
              <option value="Chronic / Ongoing">Chronic / Ongoing</option>
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1">
                <Gauge className="w-3.5 h-3.5 text-cyan-400" /> Self-Rated Severity (1 - 10)
              </label>
              <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800/40">
                {severity} / 10
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              value={severity}
              onChange={(e) => setSeverity(parseInt(e.target.value))}
              className="w-full accent-cyan-400 bg-slate-950 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
              <span>1 (Mild Discomfort)</span>
              <span>5 (Moderate)</span>
              <span>10 (Severe Pain)</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-cyan-400" /> Medical History / Pre-existing Conditions
            </label>
            <textarea
              rows={2}
              value={preExistingConditions}
              onChange={(e) => setPreExistingConditions(e.target.value)}
              placeholder="e.g. Asthma, High Blood Pressure, Diabetes, Allergies..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 placeholder:text-slate-600"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors"
            >
              Skip / Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 hover:from-cyan-400 hover:to-teal-400 transition-all flex items-center gap-1.5 shadow-lg shadow-cyan-500/25"
            >
              <Check className="w-4 h-4" />
              <span>Save & Continue</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
