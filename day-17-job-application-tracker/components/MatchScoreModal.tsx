'use client';

import { useState } from 'react';
import { JobApplication, JobMatchResult, ResumeProfile } from '@/types';
import { calculateClientFallbackMatch } from '@/lib/matchEngine';
import { X, Sparkles, CheckCircle2, AlertOctagon, ArrowRight, RotateCcw, Copy, Check } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  job: JobApplication;
  resume: ResumeProfile;
  onSaveMatchResult: (jobId: string, result: JobMatchResult) => void;
}

export default function MatchScoreModal({ isOpen, onClose, job, resume, onSaveMatchResult }: Props) {
  const [matchResult, setMatchResult] = useState<JobMatchResult | null>(
    job.matchResult || null
  );
  const [isCalculating, setIsCalculating] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);

  if (!isOpen) return null;

  const handleRunMatch = async () => {
    setIsCalculating(true);
    try {
      const res = await fetch('/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobDescription: job.jobDescription || `${job.roleTitle} at ${job.companyName}`,
          resumeText: resume.resumeText,
          skills: resume.skills,
          roleTitle: job.roleTitle,
          companyName: job.companyName,
        }),
      });

      const data: JobMatchResult = await res.json();
      setMatchResult(data);
      onSaveMatchResult(job.id, data);
    } catch (e) {
      console.error('Match failed, using fallback:', e);
      const fallback = calculateClientFallbackMatch(
        job.jobDescription || job.roleTitle,
        resume.resumeText,
        resume.skills
      );
      setMatchResult(fallback);
      onSaveMatchResult(job.id, fallback);
    } finally {
      setIsCalculating(false);
    }
  };

  const result = matchResult || calculateClientFallbackMatch(
    job.jobDescription || job.roleTitle,
    resume.resumeText,
    resume.skills
  );

  const score = result.matchScore;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 font-mono text-xs text-slate-300">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0b1220] border-2 border-emerald-500/40 p-6 sm:p-8 space-y-6 shadow-2xl shadow-emerald-500/20">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base font-outfit">
                AI Resume Fit &amp; Skill Gap Analysis
              </h3>
              <p className="text-[11px] text-slate-400">
                {job.roleTitle} @ <strong className="text-white">{job.companyName}</strong>
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Score Overview Card */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Overall Match Verdict</span>
            <h4 className="text-lg font-bold text-white font-outfit">{result.verdict}</h4>
            <p className="text-[11px] text-slate-400 font-sans">
              Matched against candidate profile: <strong className="text-emerald-300">{resume.name}</strong> ({resume.targetRole})
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-4 rounded-2xl bg-[#070c14] border-2 border-emerald-500/40 text-center min-w-[120px] shadow-lg">
              <span className="text-3xl font-black text-emerald-400 font-outfit leading-none">
                {score}%
              </span>
              <span className="block text-[8px] font-bold uppercase tracking-wider text-slate-400 mt-1">
                Match Index
              </span>
            </div>

            <button
              type="button"
              onClick={handleRunMatch}
              disabled={isCalculating}
              className="p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500 text-emerald-400 hover:text-white transition-all flex items-center justify-center cursor-pointer"
              title="Re-run AI Matching with Gemini"
            >
              <RotateCcw className={`w-4 h-4 ${isCalculating ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Matched vs Missing Skills Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Matched Skills */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/20 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-emerald-400 uppercase flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Matched Skills ({result.matchedSkills.length})
              </span>
              <span className="text-[9px] text-slate-500">Verified on profile</span>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {result.matchedSkills.map((s, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold"
                >
                  ✓ {s}
                </span>
              ))}
            </div>
          </div>

          {/* Missing Skills */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-rose-500/20 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-rose-400 uppercase flex items-center gap-1">
                <AlertOctagon className="w-3.5 h-3.5" /> Missing / Gap Skills ({result.missingSkills.length})
              </span>
              <span className="text-[9px] text-slate-500">Add to resume</span>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {result.missingSkills.length > 0 ? (
                result.missingSkills.map((s, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-[10px] font-bold"
                  >
                    + {s}
                  </span>
                ))
              ) : (
                <span className="text-[10px] text-emerald-400 font-bold">
                  Zero critical skill gaps detected!
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Actionable Recommendations */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
          <span className="text-[10px] font-bold text-amber-400 uppercase">
            💡 Quick Wins to Boost Match to 95%+
          </span>
          <ul className="space-y-1.5 text-[11px] text-slate-300 font-sans">
            {result.gapRecommendations.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Tailored Resume Hook */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-950 to-slate-950 border border-emerald-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-emerald-400 uppercase">
              ✨ Tailored 2-Sentence Resume Hook for this Role
            </span>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(result.tailoredSummary);
                setCopiedSummary(true);
                setTimeout(() => setCopiedSummary(false), 2000);
              }}
              className="text-[10px] text-emerald-300 hover:text-white font-bold flex items-center gap-1 cursor-pointer"
            >
              {copiedSummary ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedSummary ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <p className="text-xs text-emerald-100/90 font-sans leading-relaxed italic">
            &quot;{result.tailoredSummary}&quot;
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-bold hover:text-white"
          >
            Close Analysis
          </button>
        </div>
      </div>
    </div>
  );
}
