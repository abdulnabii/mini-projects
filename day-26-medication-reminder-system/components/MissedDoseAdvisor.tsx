'use client';

import { useState, useEffect } from 'react';
import { Medication, MissedDoseGuidance } from '@/types';
import {
  HelpCircle,
  X,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';

interface Props {
  medication: Medication | null;
  scheduledTime: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function MissedDoseAdvisor({
  medication,
  scheduledTime,
  isOpen,
  onClose,
}: Props) {
  const [hoursLate, setHoursLate] = useState<number>(3);
  const [guidance, setGuidance] = useState<MissedDoseGuidance | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && medication) {
      fetchGuidance(hoursLate);
    }
  }, [isOpen, medication]);

  const fetchGuidance = async (hours: number) => {
    if (!medication) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/guidance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          medicationName: medication.name,
          dosage: medication.dosage,
          hoursMissed: hours,
        }),
      });
      const data = await res.json();
      if (data.guidance) {
        setGuidance(data.guidance);
      }
    } catch (e) {
      console.error('Failed to fetch missed dose guidance:', e);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !medication) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150 font-mono">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#0d1117] border-2 border-cyan-500/40 p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base font-outfit">
                AI Missed-Dose Clinical Advisor
              </h3>
              <p className="text-xs text-slate-400">
                {medication.name} {medication.dosage} (Scheduled: {scheduledTime})
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

        {/* Hours Selector Slider/Buttons */}
        <div className="space-y-2">
          <label className="text-[10px] text-slate-400 font-bold uppercase flex items-center justify-between">
            <span>How many hours late is this dose?</span>
            <span className="text-cyan-400 font-bold">{hoursLate} hours delayed</span>
          </label>

          <div className="flex items-center gap-2">
            {[1, 2, 4, 6, 8, 12].map((h) => (
              <button
                key={h}
                type="button"
                onClick={() => {
                  setHoursLate(h);
                  fetchGuidance(h);
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  hoursLate === h
                    ? 'bg-cyan-500 text-black font-black shadow-md'
                    : 'bg-[#161b22] border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {h}h
              </button>
            ))}
          </div>
        </div>

        {/* Guidance Result Box */}
        {isLoading ? (
          <div className="py-8 text-center space-y-2">
            <Loader2 className="w-6 h-6 text-cyan-400 animate-spin mx-auto" />
            <p className="text-xs text-slate-400">
              Evaluating half-life and therapeutic window...
            </p>
          </div>
        ) : guidance ? (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Recommendation Banner */}
            <div
              className={`p-4 rounded-2xl border space-y-1.5 ${
                guidance.recommendation === 'take_now'
                  ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
                  : 'bg-amber-950/20 border-amber-500/40 text-amber-200'
              }`}
            >
              <div className="flex items-center gap-2">
                {guidance.recommendation === 'take_now' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                )}
                <span className="font-bold text-sm font-outfit">
                  {guidance.headline}
                </span>
              </div>
              <p className="text-xs font-sans text-slate-300 leading-relaxed">
                {guidance.rationale}
              </p>
            </div>

            {/* Warnings */}
            <div className="space-y-1.5 text-xs text-slate-300 font-sans">
              <span className="text-[10px] text-slate-400 font-bold uppercase font-mono">
                Safety Instructions:
              </span>
              <ul className="list-disc pl-5 space-y-1 text-slate-300">
                {guidance.safetyWarnings.map((w, idx) => (
                  <li key={idx}>{w}</li>
                ))}
              </ul>
            </div>

            {/* Next Dose */}
            <div className="p-3 rounded-xl bg-[#04080e] border border-slate-800 text-xs text-cyan-300">
              <strong>Next Dose:</strong> {guidance.nextDoseInstructions}
            </div>
          </div>
        ) : null}

        {/* Footer */}
        <div className="flex items-center justify-end pt-2 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-200 hover:text-white transition-all cursor-pointer"
          >
            Close Advisor
          </button>
        </div>
      </div>
    </div>
  );
}
