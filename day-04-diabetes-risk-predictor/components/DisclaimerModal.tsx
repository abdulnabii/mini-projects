'use client';

import React from 'react';
import { ShieldAlert, Check } from 'lucide-react';

interface DisclaimerModalProps {
  isOpen: boolean;
  onAccept: () => void;
}

export default function DisclaimerModal({ isOpen, onAccept }: DisclaimerModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#050b12]/90 backdrop-blur-md">
      <div className="bg-[#0b1724] border border-teal-500/30 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 font-mono animate-in fade-in zoom-in duration-300">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-2xl bg-amber-950/80 border border-amber-800 flex items-center justify-center text-amber-400 shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Clinical AI Risk Disclaimer</h3>
            <p className="text-xs text-amber-400 font-mono">Mandatory Medical Notice</p>
          </div>
        </div>

        <div className="space-y-3 text-xs text-slate-300 leading-relaxed font-sans bg-[#07101a] p-4 rounded-2xl border border-slate-800/80">
          <p>
            <strong className="text-white">This Diabetes Risk Predictor is an educational machine learning assessment tool, not a diagnostic medical device.</strong>
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-slate-300">
            <li>Statistical predictions are derived from the UCI Pima Indians Clinical Dataset.</li>
            <li>Results do NOT constitute formal medical advice, diagnosis, or treatment plans.</li>
            <li>Always consult a licensed physician or endocrinologist for clinical laboratory testing (e.g. Fasting Glucose, HbA1c).</li>
          </ul>
        </div>

        <button
          onClick={onAccept}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-teal-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <Check className="w-4 h-4 stroke-[3]" />
          <span>I Understand & Agree to Clinical Terms</span>
        </button>
      </div>
    </div>
  );
}
