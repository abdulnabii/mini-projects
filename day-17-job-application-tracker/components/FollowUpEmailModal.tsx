'use client';

import { useState } from 'react';
import { JobApplication } from '@/types';
import { X, Mail, Sparkles, Copy, Check, ExternalLink, RotateCcw } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  job: JobApplication;
}

export default function FollowUpEmailModal({ isOpen, onClose, job }: Props) {
  const [emailType, setEmailType] = useState<'thank-you' | 'check-in' | 'competing-offer'>('thank-you');
  const [interviewerName, setInterviewerName] = useState('Hiring Manager');
  const [result, setResult] = useState<{ subject: string; body: string } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = async (type = emailType) => {
    setIsGenerating(true);
    setEmailType(type);
    try {
      const res = await fetch('/api/follow-up', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: job.companyName,
          roleTitle: job.roleTitle,
          type,
          interviewerName,
        }),
      });

      const data = await res.json();
      setResult(data);
    } catch (e) {
      console.error('Follow up generation error:', e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(`Subject: ${result.subject}\n\n${result.body}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenMailClient = () => {
    if (!result) return;
    const mailto = `mailto:?subject=${encodeURIComponent(result.subject)}&body=${encodeURIComponent(result.body)}`;
    window.open(mailto, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 font-mono text-xs text-slate-300">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0b1220] border-2 border-sky-500/40 p-6 sm:p-8 space-y-5 shadow-2xl shadow-sky-500/20">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base font-outfit">
                AI Follow-Up Email &amp; Recruiter Nudge Studio
              </h3>
              <p className="text-[11px] text-slate-400">
                Generate timely check-in emails for <strong className="text-white">{job.companyName}</strong>
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Inputs */}
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-300">Interviewer / Recruiter Name</label>
            <input
              type="text"
              value={interviewerName}
              onChange={(e) => setInterviewerName(e.target.value)}
              placeholder="e.g. Sarah, Alex, or Hiring Team"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Select Follow-Up Objective:</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { id: 'thank-you', label: '✉️ Post-Interview Thank You', desc: 'Send within 24h after round' },
                { id: 'check-in', label: '⏳ 5-Day Status Check-In', desc: 'Polite status update inquiry' },
                { id: 'competing-offer', label: '🔥 Competing Offer Nudge', desc: 'Accelerate decision timeline' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => handleGenerate(t.id as any)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    emailType === t.id
                      ? 'bg-sky-500/10 border-sky-400 text-white shadow-md shadow-sky-500/20'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="block font-bold text-xs font-outfit">{t.label}</span>
                  <span className="text-[9px] text-slate-500">{t.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Generate / Show Result */}
        {result ? (
          <div className="space-y-3 pt-2 border-t border-slate-800 animate-in fade-in duration-200">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-sky-400 uppercase">
                  Subject: {result.subject}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="text-[10px] text-sky-300 hover:text-white font-bold flex items-center gap-1 cursor-pointer"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#070c14] border border-slate-900 text-[11px] text-slate-200 font-sans whitespace-pre-wrap leading-relaxed">
                {result.body}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => handleGenerate(emailType)}
                disabled={isGenerating}
                className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-bold hover:text-white flex items-center gap-1.5"
              >
                <RotateCcw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                <span>Regenerate</span>
              </button>

              <button
                type="button"
                onClick={handleOpenMailClient}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-sky-400 to-blue-500 text-black font-bold flex items-center gap-1.5 shadow-md shadow-sky-500/20 hover:scale-105 transition-all cursor-pointer font-outfit"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open in Email App</span>
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => handleGenerate(emailType)}
            disabled={isGenerating}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-400 to-blue-500 text-black font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20 hover:scale-[1.01] transition-all cursor-pointer font-outfit"
          >
            <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Drafting Email with Gemini...' : 'Generate Follow-Up Email'}</span>
          </button>
        )}
      </div>
    </div>
  );
}
