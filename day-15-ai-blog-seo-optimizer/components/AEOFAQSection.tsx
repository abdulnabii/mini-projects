'use client';

import { useState } from 'react';
import { HelpCircle, ChevronDown, Sparkles, Brain, ShieldCheck, Zap } from 'lucide-react';

const AEO_FAQS = [
  {
    q: 'What is AEO (Answer Engine Optimization) and why does it matter?',
    a: 'Answer Engine Optimization (AEO) is the process of structuring website content so that AI-driven search engines (Perplexity, ChatGPT Search, Google AI Overviews, Claude) can directly cite and synthesize your page in conversational answers. It requires high factual density, direct question-answer headers, plain-English readability, and Schema.org structured data.',
  },
  {
    q: 'How does RankCraft.AI measure Google E-E-A-T and Search Intent?',
    a: 'RankCraft.AI evaluates four core signals: Experience (empirical testing and real-world case studies), Expertise (technical depth and quantitative data), Authoritativeness (industry citations and comparative benchmarks), and Trustworthiness (methodology transparency and nuance). It also classifies queries into Informational, Commercial, Transactional, or Navigational intent.',
  },
  {
    q: 'What is the ideal Flesch-Kincaid Readability score for technical blogs?',
    a: 'For technical, engineering, and SaaS blogs, the target Flesch Reading Ease score is 60 to 75 (Plain English, 8th–9th US grade level). This ensures maximum comprehension without losing technical precision, helping both human readers and AI LLMs parse concepts rapidly.',
  },
  {
    q: 'How does the Gemini 1.5 Flash AI Section Rewriter work?',
    a: 'The rewriter accepts draft paragraphs and applies one of four optimization directives: Flesch Ease Booster, Viral Opening Hook, NLP Entity Injection, or E-E-A-T Thought Leadership. It transforms sentence complexity and positions focus keywords naturally while preserving factual fidelity.',
  },
];

export default function AEOFAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section aria-labelledby="aeo-knowledge-hub" className="space-y-6 pt-4 font-mono text-xs text-slate-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 id="aeo-knowledge-hub" className="font-bold text-white text-base font-outfit">
              AEO &amp; SEO Knowledge Hub (Search Engine Q&amp;A)
            </h2>
            <p className="text-xs text-slate-400">
              Direct semantic answer blocks indexed by ChatGPT Search, Perplexity, and Google AI Overviews
            </p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold text-[10px]">
          100% AEO Structured Feed
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {AEO_FAQS.map((faq, idx) => {
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
