'use client';

import { useState } from 'react';
import { ShieldAlert, CheckCircle2, AlertTriangle, X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onAccept: () => void;
}

export default function DisclaimerModal({ isOpen, onAccept }: Props) {
  const [checked1, setChecked1] = useState(false);
  const [checked2, setChecked2] = useState(false);

  if (!isOpen) return null;

  const canProceed = checked1 && checked2;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md font-mono text-xs">
      <div className="w-full max-w-2xl bg-[#090d16] border-2 border-amber-500/50 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl shadow-amber-500/20">
        {/* Warning Icon Banner */}
        <div className="flex items-center gap-3 border-b border-slate-800 pb-5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 shadow-lg shadow-amber-500/10">
            <ShieldAlert className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white font-outfit uppercase tracking-wider">
              Mandatory Clinical Research Disclaimer
            </h2>
            <p className="text-amber-400 font-bold text-xs mt-0.5">
              Educational Diagnostic Demonstration &amp; GradCAM Visualizer
            </p>
          </div>
        </div>

        {/* Disclaimer Text */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 leading-relaxed text-slate-300">
          <p className="font-bold text-slate-100">
            ⚠️ NOTICE: MedVision.AI is strictly an educational tool and computer vision explainability demonstration.
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-[11px] text-slate-400">
            <li>
              This software is <strong>NOT a certified medical device</strong> (FDA, CE, or equivalent) and must <strong>NEVER be used for clinical diagnosis, patient triage, or treatment decisions</strong>.
            </li>
            <li>
              Classification output and GradCAM activation heatmaps reflect neural network feature correlations, not definitive medical pathology.
            </li>
            <li>
              Patient data privacy: All image processing runs client-side in the browser. No medical images are transmitted or stored on remote servers.
            </li>
          </ul>
        </div>

        {/* Checkboxes */}
        <div className="space-y-3 pt-1">
          <label className="flex items-start gap-3 cursor-pointer p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700">
            <input
              type="checkbox"
              checked={checked1}
              onChange={(e) => setChecked1(e.target.checked)}
              className="mt-0.5 accent-amber-400 w-4 h-4 rounded cursor-pointer"
            />
            <span className="text-[11px] text-slate-200">
              I understand MedVision.AI is strictly for educational, research, and technical demonstration purposes.
            </span>
          </label>

          <label className="flex items-start gap-3 cursor-pointer p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700">
            <input
              type="checkbox"
              checked={checked2}
              onChange={(e) => setChecked2(e.target.checked)}
              className="mt-0.5 accent-amber-400 w-4 h-4 rounded cursor-pointer"
            />
            <span className="text-[11px] text-slate-200">
              I agree never to use this tool for clinical medical diagnosis or patient healthcare decisions.
            </span>
          </label>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={onAccept}
          disabled={!canProceed}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-teal-500 to-cyan-500 text-black font-extrabold text-xs font-outfit uppercase tracking-wider hover:opacity-95 transition-all shadow-xl shadow-amber-500/20 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>I Acknowledge &amp; Enter Educational Simulator</span>
        </button>
      </div>
    </div>
  );
}
