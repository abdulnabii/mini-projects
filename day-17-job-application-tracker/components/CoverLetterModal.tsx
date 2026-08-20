'use client';

import { useState } from 'react';
import { JobApplication, CoverLetterTone, ResumeProfile } from '@/types';
import { generateClientFallbackCoverLetter } from '@/lib/matchEngine';
import { X, FileText, Copy, Check, Download, Sparkles, RotateCcw } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  job: JobApplication;
  resume: ResumeProfile;
  onSaveCoverLetter: (jobId: string, letter: string) => void;
}

export default function CoverLetterModal({ isOpen, onClose, job, resume, onSaveCoverLetter }: Props) {
  const [tone, setTone] = useState<CoverLetterTone>('executive');
  const [coverLetter, setCoverLetter] = useState<string>(
    job.coverLetter ||
      generateClientFallbackCoverLetter(
        job.companyName,
        job.roleTitle,
        resume.name,
        job.jobDescription,
        'executive'
      )
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = async (selectedTone: CoverLetterTone) => {
    setIsGenerating(true);
    setTone(selectedTone);
    try {
      const res = await fetch('/api/cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: job.companyName,
          roleTitle: job.roleTitle,
          candidateName: resume.name,
          jobDescription: job.jobDescription,
          resumeText: resume.resumeText,
          tone: selectedTone,
        }),
      });

      const data = await res.json();
      if (data.coverLetter) {
        setCoverLetter(data.coverLetter);
        onSaveCoverLetter(job.id, data.coverLetter);
      }
    } catch (e) {
      console.error('Cover letter generation error:', e);
      const fallback = generateClientFallbackCoverLetter(
        job.companyName,
        job.roleTitle,
        resume.name,
        job.jobDescription,
        selectedTone
      );
      setCoverLetter(fallback);
      onSaveCoverLetter(job.id, fallback);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(coverLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([coverLetter], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${job.companyName.toLowerCase()}-${job.roleTitle.toLowerCase().replace(/\s+/g, '-')}-cover-letter.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 font-mono text-xs text-slate-300">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0b1220] border-2 border-cyan-500/40 p-6 sm:p-8 space-y-5 shadow-2xl shadow-cyan-500/20">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base font-outfit">
                AI Tailored Cover Letter Generator
              </h3>
              <p className="text-[11px] text-slate-400">
                Application for <strong className="text-white">{job.roleTitle}</strong> at <strong className="text-cyan-300">{job.companyName}</strong>
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tone Selector */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-400 uppercase">Select Cover Letter Tone:</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'executive', label: 'Executive & Polished', desc: 'Authoritative & clean' },
              { id: 'enthusiastic', label: 'High Energy Startup', desc: 'Mission-driven & bold' },
              { id: 'metric', label: 'Metric & Impact', desc: 'Data & performance focus' },
              { id: 'creative', label: 'Storyteller Angle', desc: 'Engaging narrative hook' },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => handleGenerate(t.id as CoverLetterTone)}
                disabled={isGenerating}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  tone === t.id
                    ? 'bg-cyan-500/10 border-cyan-400 text-white shadow-lg shadow-cyan-500/20'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span className="block font-bold text-xs font-outfit">{t.label}</span>
                <span className="text-[9px] text-slate-500">{t.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Letter Text Area */}
        <div className="relative">
          <textarea
            rows={14}
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            className="w-full p-5 rounded-2xl bg-slate-950 border border-slate-800 text-[11px] text-slate-200 font-mono leading-relaxed focus:outline-none focus:border-cyan-500 shadow-inner"
          />
          {isGenerating && (
            <div className="absolute inset-0 rounded-2xl bg-black/60 backdrop-blur-sm flex items-center justify-center gap-2 text-cyan-300 font-bold">
              <RotateCcw className="w-5 h-5 animate-spin" />
              <span>Drafting Tailored Cover Letter with Gemini...</span>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between flex-wrap gap-3 pt-2">
          <button
            type="button"
            onClick={() => handleGenerate(tone)}
            disabled={isGenerating}
            className="px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500 text-cyan-300 font-bold flex items-center gap-2 transition-all cursor-pointer"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>Regenerate Draft</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-500 text-white font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied Letter!' : 'Copy to Clipboard'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-bold flex items-center gap-1.5 transition-all shadow-md shadow-cyan-500/20 hover:scale-105 cursor-pointer font-outfit"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .txt</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
