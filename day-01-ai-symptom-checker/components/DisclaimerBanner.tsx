'use client';

import React from 'react';
import { AlertTriangle, ShieldAlert } from 'lucide-react';

export default function DisclaimerBanner() {
  return (
    <div className="bg-amber-950/40 border-b border-amber-500/30 text-amber-200 px-4 py-2.5 text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong>Medical Disclaimer:</strong> MediTriage AI is an automated triage decision-support tool. It does <em>not</em> provide medical diagnosis or replace a qualified doctor.
          </span>
        </div>
        <div className="hidden md:flex items-center gap-1.5 text-red-400 font-semibold bg-red-950/60 px-2.5 py-1 rounded-full border border-red-500/40 text-xs shrink-0">
          <AlertTriangle className="w-3.5 h-3.5 animate-pulse" />
          <span>Emergency? Call 911 / 112</span>
        </div>
      </div>
    </div>
  );
}
