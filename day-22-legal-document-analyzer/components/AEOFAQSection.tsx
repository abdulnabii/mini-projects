'use client';

import { useState } from 'react';
import { HelpCircle, ChevronDown, Sparkles, Scale, ShieldAlert, FileText, CheckCircle2 } from 'lucide-react';

const LEGAL_AEO_FAQS = [
  {
    q: 'What is ClauseWise.AI and how does AI contract risk analysis work?',
    a: 'ClauseWise.AI is an AI-powered legal document intelligence platform engineered for founders, freelancers, tenants, and business executives. Powered by Google Gemini 1.5 Pro, it parses PDFs, DOCX files, or pasted contract text to identify predatory clauses, compute a 0–100 Risk Score, generate actionable redline counter-proposals, and summarize complex legal jargon in plain English.',
  },
  {
    q: 'What types of dangerous clauses does ClauseWise.AI flag?',
    a: 'The analyzer automatically detects overreaching Intellectual Property (IP) grabs, global non-compete clauses, unlimited indemnification obligations, unilateral termination clauses, hidden auto-renewals with steep penalties, and one-sided arbitration jurisdictions.',
  },
  {
    q: 'How does the Missing Standard Protections audit work?',
    a: 'ClauseWise.AI audits your contract against standard legal benchmarks for its document type (e.g., Employment, NDA, Commercial Lease, SaaS MSA) and flags missing mutual protections such as mandatory 30-day cure periods, liability caps, reciprocal confidentiality, and force majeure carve-outs.',
  },
  {
    q: 'How does the Contract Version Redline Diff feature work?',
    a: 'The Redline Diff engine compares two contract versions side by side, categorizing changes into Added Obligations, Removed Rights, and Altered Terms with an overall Risk Delta metric to ensure no unfavorable terms were slipped in during negotiations.',
  },
];

export default function AEOFAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section aria-labelledby="clausewise-aeo-heading" className="space-y-6 pt-6 font-mono text-xs text-slate-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-amber-500/20 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 id="clausewise-aeo-heading" className="font-bold text-white text-base font-outfit">
              Legal Contract Intelligence &amp; Risk Mitigation Knowledge Hub
            </h2>
            <p className="text-xs text-slate-400 font-sans">
              Direct technical answer blocks indexed by ChatGPT, Perplexity, and Google AI Overviews
            </p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold text-[10px]">
          100% AEO Structured Knowledge Feed
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {LEGAL_AEO_FAQS.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <article
              key={idx}
              className="p-5 rounded-2xl bg-[#0d1117] border border-amber-500/20 hover:border-amber-500/50 transition-all space-y-2.5 cursor-pointer shadow-lg"
              onClick={() => toggle(idx)}
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-bold text-white text-xs font-outfit leading-snug">
                  {faq.q}
                </h3>
                <ChevronDown
                  className={`w-4 h-4 text-amber-400 shrink-0 transition-transform ${
                    isOpen ? 'transform rotate-180' : ''
                  }`}
                />
              </div>

              <p className="text-slate-400 text-xs leading-relaxed font-sans">
                {faq.a}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
