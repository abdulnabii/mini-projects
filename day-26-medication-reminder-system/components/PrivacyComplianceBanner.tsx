'use client';

import { ShieldCheck, Lock, CheckCircle2, PhoneCall, ExternalLink, Heart } from 'lucide-react';

export default function PrivacyComplianceBanner() {
  return (
    <div className="p-6 rounded-3xl bg-[#0d1117] border border-emerald-500/30 shadow-xl space-y-4 font-mono text-xs">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-white text-sm font-outfit">
              Privacy &amp; Clinical Health Compliance Trust Center
            </h4>
            <p className="text-[11px] text-slate-400">
              HIPAA &amp; GDPR On-Device Privacy Architecture • Zero Cloud PHI Leakage
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
            🔒 100% On-Device LocalStorage
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold">
            🩺 Gemini 1.5 Clinical AI
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-slate-300 text-[11px] font-sans">
        <div className="p-3.5 rounded-2xl bg-[#161b22] border border-slate-800 space-y-1">
          <div className="font-bold text-white flex items-center gap-1.5 font-mono">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Zero Third-Party Tracking</span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            Your patient names, prescription dosages, and medical conditions never leave your browser memory. No ads, tracking cookies, or data harvesting.
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#161b22] border border-slate-800 space-y-1">
          <div className="font-bold text-white flex items-center gap-1.5 font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Pharmacology Cross-Checks</span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            Drug interactions are verified against standard clinical pharmacology mechanisms (CYP450 metabolism, renal hemodynamics, platelet inhibition).
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#161b22] border border-slate-800 space-y-1">
          <div className="font-bold text-white flex items-center gap-1.5 font-mono">
            <PhoneCall className="w-3.5 h-3.5 text-rose-400" />
            <span>Emergency Guidance</span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            For acute overdoses, severe adverse reactions, or chest pain, immediately dial 911 (or local emergency) or Poison Control at <strong>1-800-222-1222</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}
