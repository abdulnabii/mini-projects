'use client';

import { useState } from 'react';
import { JobApplication, InterviewQuestion } from '@/types';
import { generateClientFallbackInterviewPrep } from '@/lib/matchEngine';
import { X, MessageSquare, Sparkles, CheckCircle2, RotateCcw, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  job: JobApplication;
  onSaveInterviewPrep: (jobId: string, questions: InterviewQuestion[]) => void;
}

export default function InterviewPrepModal({ isOpen, onClose, job, onSaveInterviewPrep }: Props) {
  const [questions, setQuestions] = useState<InterviewQuestion[]>(
    job.interviewPrep ||
      generateClientFallbackInterviewPrep(
        job.companyName,
        job.roleTitle,
        job.jobDescription
      )
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [expandedId, setExpandedId] = useState<string>('q1');

  if (!isOpen) return null;

  const handleGenerateQuestions = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/interview-prep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: job.companyName,
          roleTitle: job.roleTitle,
          jobDescription: job.jobDescription,
        }),
      });

      const data = await res.json();
      if (data.questions && data.questions.length > 0) {
        setQuestions(data.questions);
        onSaveInterviewPrep(job.id, data.questions);
      }
    } catch (e) {
      console.error('Interview prep generation failed:', e);
      const fallback = generateClientFallbackInterviewPrep(
        job.companyName,
        job.roleTitle,
        job.jobDescription
      );
      setQuestions(fallback);
      onSaveInterviewPrep(job.id, fallback);
    } finally {
      setIsGenerating(false);
    }
  };

  const getTypeBadge = (type: InterviewQuestion['type']) => {
    switch (type) {
      case 'Technical':
        return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';
      case 'System Design':
        return 'text-purple-400 bg-purple-500/10 border-purple-500/30';
      case 'Behavioral':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'Company Specific':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      default:
        return 'text-slate-400 bg-slate-800';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 font-mono text-xs text-slate-300">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0b1220] border-2 border-purple-500/40 p-6 sm:p-8 space-y-5 shadow-2xl shadow-purple-500/20">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base font-outfit">
                AI Interview Question Predictor &amp; STAR Coach
              </h3>
              <p className="text-[11px] text-slate-400">
                Customized for <strong className="text-white">{job.roleTitle}</strong> @ <strong className="text-purple-300">{job.companyName}</strong>
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Header Banner */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950 border border-slate-800 flex-wrap gap-3">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase">
              Hiring Manager Question Forecast
            </span>
            <p className="text-[11px] text-slate-300 font-sans">
              4 predicted high-probability questions structured with Situation-Task-Action-Result outlines.
            </p>
          </div>

          <button
            type="button"
            onClick={handleGenerateQuestions}
            disabled={isGenerating}
            className="px-4 py-2 rounded-xl bg-purple-500/10 border border-purple-500/40 text-purple-300 hover:bg-purple-500 hover:text-black font-bold flex items-center gap-1.5 transition-all cursor-pointer font-outfit"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Analyzing JD...' : 'Generate New Questions'}</span>
          </button>
        </div>

        {/* Questions Accordion List */}
        <div className="space-y-3">
          {questions.map((q) => {
            const isExpanded = expandedId === q.id;

            return (
              <div
                key={q.id}
                className="rounded-2xl bg-slate-950/90 border border-slate-800/90 overflow-hidden transition-all shadow-md"
              >
                <button
                  type="button"
                  onClick={() => setExpandedId(isExpanded ? '' : q.id)}
                  className="w-full p-4 flex items-center justify-between gap-3 text-left hover:bg-slate-900/40 transition-colors cursor-pointer"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${getTypeBadge(q.type)}`}>
                        {q.type}
                      </span>
                    </div>
                    <h4 className="font-bold text-white text-xs font-outfit">{q.question}</h4>
                  </div>

                  <div className="shrink-0 text-slate-500">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="p-4 border-t border-slate-900 space-y-3 bg-[#070c14] text-[11px] animate-in fade-in duration-150">
                    <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/30 text-purple-200 space-y-1">
                      <span className="font-bold text-[10px] text-purple-400 uppercase">
                        🎯 Why the Interviewer Asks This:
                      </span>
                      <p className="font-sans leading-relaxed">{q.whyTheyAsk}</p>
                    </div>

                    <div className="space-y-2">
                      <span className="font-bold text-[10px] text-slate-400 uppercase">
                        ⭐ Recommended STAR Answering Blueprint:
                      </span>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] font-sans">
                        <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 space-y-0.5">
                          <strong className="text-cyan-400 uppercase font-mono">Situation:</strong>
                          <p className="text-slate-300">{q.starOutline.situation}</p>
                        </div>

                        <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 space-y-0.5">
                          <strong className="text-amber-400 uppercase font-mono">Task:</strong>
                          <p className="text-slate-300">{q.starOutline.task}</p>
                        </div>

                        <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 space-y-0.5">
                          <strong className="text-purple-400 uppercase font-mono">Action:</strong>
                          <p className="text-slate-300">{q.starOutline.action}</p>
                        </div>

                        <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 space-y-0.5">
                          <strong className="text-emerald-400 uppercase font-mono">Result:</strong>
                          <p className="text-slate-300">{q.starOutline.result}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-bold hover:text-white"
          >
            Done Preparing
          </button>
        </div>
      </div>
    </div>
  );
}
