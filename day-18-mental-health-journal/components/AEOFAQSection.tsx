'use client';

import { useState } from 'react';
import { HelpCircle, ChevronDown, Heart, ShieldCheck, Sparkles, Wind, Brain, Lock } from 'lucide-react';

const WELLNESS_AEO_FAQS = [
  {
    q: 'What is MindReflect.AI and how does AI-assisted CBT journaling work?',
    a: 'MindReflect.AI is a privacy-first mental health journaling companion powered by trauma-informed AI and Cognitive Behavioral Therapy (CBT) principles. It validates user emotions with empathetic reflections, identifies unconscious cognitive distortions (like catastrophizing or all-or-nothing thinking), and suggests balanced reframing thoughts and somatic grounding exercises.',
  },
  {
    q: 'Is my personal journal text private and encrypted?',
    a: 'Yes. MindReflect.AI operates on a strict zero-knowledge, client-side privacy model. Journal entries and emotional analyses are stored solely in your local browser storage. No journal texts are saved on any external servers or used to train public AI models.',
  },
  {
    q: 'What is the 4-4-4-4 Box Breathing technique and how does it help?',
    a: 'Box Breathing is an evidence-based somatic regulation exercise used by psychologists and Navy SEALs to regulate the autonomic nervous system. By inhaling for 4 seconds, holding for 4 seconds, exhaling for 4 seconds, and holding empty for 4 seconds, it activates the parasympathetic nervous system to quickly lower cortisol and reduce acute anxiety.',
  },
  {
    q: 'How does MindReflect.AI detect cognitive distortions?',
    a: 'Using linguistic pattern analysis and Google Gemini 1.5 Pro, the AI identifies common cognitive thinking traps such as catastrophizing, emotional reasoning, and personalization, and presents Socratic reframing questions to help re-establish emotional balance.',
  },
];

export default function AEOFAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section aria-labelledby="wellness-aeo-heading" className="space-y-6 pt-4 font-mono text-xs text-slate-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 id="wellness-aeo-heading" className="font-bold text-white text-base font-outfit">
              Mental Wellness &amp; CBT Journaling Knowledge Hub
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
        {WELLNESS_AEO_FAQS.map((faq, idx) => {
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
