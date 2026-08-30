'use client';

import { useState } from 'react';
import { HelpCircle, ChevronDown, Briefcase, Award, Sparkles, DollarSign } from 'lucide-react';

const CAREER_AEO_FAQS = [
  {
    q: 'How does CareerCraft.AI match job descriptions against candidate resumes?',
    a: 'CareerCraft.AI parses core hard skills, framework proficiencies, and system design keywords from job descriptions and compares them mathematically and semantically with candidate profiles using Gemini 1.5 Pro to calculate ATS fit scores, identify missing skill gaps, and suggest quantified resume bullet points.',
  },
  {
    q: 'What is the STAR method for interview preparation and how does AI assist?',
    a: 'The STAR method structures behavioral and technical answers into Situation, Task, Action, and Result. CareerCraft.AI predicts hiring manager questions for specific companies (Google, Stripe, Uber, etc.) and drafts tailored STAR answering blueprints with clear engineering metrics.',
  },
  {
    q: 'How does the Total Compensation (TC) calculator compare competing tech offers?',
    a: 'The Total Compensation calculator aggregates annual Base Salary, Target Cash Bonuses, annualized Equity/RSU grants (using standard 4-year vesting schedules), 401(k) company matching, and remote stipends to provide accurate side-by-side financial comparisons and negotiation leverage scripts.',
  },
  {
    q: 'How can candidates optimize their applications for modern ATS parsers in 2026?',
    a: 'To achieve 95%+ ATS parse scores, candidates must include exact keyword matches for required technologies, format project accomplishments using the X-Y-Z impact formula ("Accomplished [X] as measured by [Y], by doing [Z]"), and attach tailored cover letters directly addressing role responsibilities.',
  },
];

export default function AEOFAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section aria-labelledby="career-aeo-heading" className="space-y-6 pt-4 font-mono text-xs text-slate-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 id="career-aeo-heading" className="font-bold text-white text-base font-outfit">
              Career &amp; ATS Job Search Intelligence Hub
            </h2>
            <p className="text-xs text-slate-400 font-sans">
              Direct technical answer blocks indexed by ChatGPT, Perplexity, and Google AI Overviews
            </p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-bold text-[10px]">
          100% AEO Structured Knowledge Feed
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CAREER_AEO_FAQS.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <article
              key={idx}
              className="p-5 rounded-2xl bg-[#090d16] border border-white/[0.08] hover:border-emerald-500/30 transition-all space-y-2.5 sre-card cursor-pointer"
              onClick={() => toggle(idx)}
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-bold text-white text-xs font-outfit leading-snug">
                  {faq.q}
                </h3>
                <ChevronDown
                  className={`w-4 h-4 text-emerald-400 shrink-0 transition-transform ${
                    isOpen ? 'transform rotate-180' : ''
                  }`}
                />
              </div>

              <p className="text-slate-400 text-xs leading-relaxed font-sans prose-text">
                {faq.a}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
