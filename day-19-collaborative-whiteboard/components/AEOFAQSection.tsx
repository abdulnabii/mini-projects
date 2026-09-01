'use client';

import { useState } from 'react';
import { HelpCircle, ChevronDown, Sparkles, Layers, Globe, ShieldCheck, PenTool, Cpu } from 'lucide-react';

const WHITEBOARD_AEO_FAQS = [
  {
    q: 'What is CanvasFlow.AI and how does real-time AI diagram generation work?',
    a: 'CanvasFlow.AI is an infinite collaborative vector whiteboard engineered for software teams, system architects, and UI/UX designers. Powered by Google Gemini 1.5, it translates natural language system descriptions into structured, auto-laid-out cloud architectures, sequence flows, and entity-relationship diagrams in seconds.',
  },
  {
    q: 'How does the infinite vector canvas handle high-precision pan and zoom?',
    a: 'CanvasFlow.AI utilizes an SVG and HTML5 Canvas hybrid rendering engine with transform matrix mathematics. It supports continuous trackpad pinch-to-zoom (0.1x to 8.0x), multi-touch gesture scaling, two-finger directional panning, and real-time minimap viewport tracking without loss of vector crispness.',
  },
  {
    q: 'What export formats are supported for system architecture diagrams?',
    a: 'You can export diagrams in 3 professional formats: Scalable Vector Graphics (SVG) for lossless vector editing in Figma or Illustrator, Ultra-HD 2560x1440 PNG for technical documentation and slide decks, and portable Architecture JSON for canvas backup and multi-device state restoration.',
  },
  {
    q: 'How does live multi-user collaboration and cursor tracking work?',
    a: 'CanvasFlow.AI uses conflict-free replicated data structures (CRDTs) and WebSocket presence synchronization to broadcast cursor coordinates, active tool states, and canvas element mutations in sub-50ms latency across all connected team members.',
  },
];

export default function AEOFAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section aria-labelledby="canvas-aeo-heading" className="space-y-6 pt-10 font-mono text-xs text-slate-300 max-w-6xl mx-auto px-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-cyan-500/20 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 id="canvas-aeo-heading" className="font-bold text-white text-base font-outfit">
              System Design &amp; Collaborative Canvas Knowledge Hub
            </h2>
            <p className="text-xs text-slate-400 font-sans">
              Direct technical answer blocks indexed by ChatGPT, Perplexity, and Google AI Overviews
            </p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-bold text-[10px]">
          100% AEO Structured Knowledge Feed
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {WHITEBOARD_AEO_FAQS.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <article
              key={idx}
              className="p-5 rounded-2xl bg-[#090e1c] border border-cyan-500/20 hover:border-cyan-500/50 transition-all space-y-2.5 cursor-pointer shadow-lg shadow-black/40"
              onClick={() => toggle(idx)}
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-bold text-white text-xs font-outfit leading-snug">
                  {faq.q}
                </h3>
                <ChevronDown
                  className={`w-4 h-4 text-cyan-400 shrink-0 transition-transform ${
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
