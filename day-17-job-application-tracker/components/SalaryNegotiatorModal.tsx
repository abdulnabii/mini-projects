'use client';

import { useState } from 'react';
import { JobApplication } from '@/types';
import { X, DollarSign, Sparkles, Copy, Check, TrendingUp, Phone, ShieldCheck, RotateCcw } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  job: JobApplication;
}

export default function SalaryNegotiatorModal({ isOpen, onClose, job }: Props) {
  const [initialOffer, setInitialOffer] = useState(job.salaryRange.split('-')[0]?.trim() || '$160,000');
  const [targetComp, setTargetComp] = useState('$190,000');
  const [strategy, setStrategy] = useState<'polite' | 'leverage' | 'equity'>('polite');
  const [result, setResult] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/salary-negotiator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: job.companyName,
          roleTitle: job.roleTitle,
          initialOffer,
          targetCompensation: targetComp,
          strategy,
        }),
      });

      const data = await res.json();
      setResult(data);
    } catch (e) {
      console.error('Salary negotiation error:', e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 font-mono text-xs text-slate-300">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0b1220] border-2 border-emerald-500/40 p-6 sm:p-8 space-y-6 shadow-2xl shadow-emerald-500/20">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base font-outfit">
                AI Salary Negotiation &amp; Counter-Offer Studio
              </h3>
              <p className="text-[11px] text-slate-400">
                Craft high-leverage compensation counter-proposals for <strong className="text-white">{job.companyName}</strong>
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-300">Initial Offer Base ($)</label>
            <input
              type="text"
              value={initialOffer}
              onChange={(e) => setInitialOffer(e.target.value)}
              placeholder="$160,000"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-300">Target Desired Package ($)</label>
            <input
              type="text"
              value={targetComp}
              onChange={(e) => setTargetComp(e.target.value)}
              placeholder="$190,000"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:border-emerald-500 text-emerald-300 font-bold"
            />
          </div>
        </div>

        {/* Strategy Selector */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-400 uppercase">Negotiation Strategy Angle:</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              { id: 'polite', label: 'Polite & Grateful Counter', desc: 'Standard respectful market justification' },
              { id: 'leverage', label: 'Competitive Offer Leverage', desc: 'Accelerate decision with competing timelines' },
              { id: 'equity', label: 'Equity & Sign-on Pivot', desc: 'Focus on stock & bonus if base is capped' },
            ].map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setStrategy(s.id as any)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  strategy === s.id
                    ? 'bg-emerald-500/10 border-emerald-400 text-white shadow-md shadow-emerald-500/20'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span className="block font-bold text-xs font-outfit">{s.label}</span>
                <span className="text-[9px] text-slate-500">{s.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <button
          type="button"
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 text-black font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 hover:scale-[1.01] transition-all cursor-pointer font-outfit"
        >
          <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
          <span>{isGenerating ? 'Synthesizing Negotiation Strategy...' : 'Generate Counter-Offer Script & Email'}</span>
        </button>

        {/* Result Area */}
        {result && (
          <div className="space-y-4 pt-2 border-t border-slate-800 animate-in fade-in duration-300">
            {/* Email Counter Offer */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-emerald-400 uppercase">
                  ✉️ Written Counter-Offer Email:
                </span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(`${result.emailSubject}\n\n${result.emailBody}`);
                    setCopiedEmail(true);
                    setTimeout(() => setCopiedEmail(false), 2000);
                  }}
                  className="text-[10px] text-emerald-300 hover:text-white font-bold flex items-center gap-1 cursor-pointer"
                >
                  {copiedEmail ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedEmail ? 'Copied Email' : 'Copy Email'}</span>
                </button>
              </div>

              <div className="p-3 rounded-xl bg-[#070c14] border border-slate-900 text-[11px] text-slate-200 font-sans whitespace-pre-wrap leading-relaxed">
                <p className="font-bold text-cyan-300 font-mono text-[10px] mb-2">
                  Subject: {result.emailSubject}
                </p>
                {result.emailBody}
              </div>
            </div>

            {/* Phone Talking Points */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-[10px] font-bold text-amber-400 uppercase flex items-center gap-1.5">
                <Phone className="w-3 h-3" /> Verbal Phone Script &amp; Talking Points for Recruiter Call:
              </span>
              <ul className="space-y-1.5 text-[11px] text-slate-300 font-sans">
                {result.phoneTalkingPoints?.map((tp: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{tp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div className="flex items-center justify-end pt-1">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-bold hover:text-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
