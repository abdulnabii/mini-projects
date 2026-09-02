'use client';

import { useState } from 'react';
import { HelpCircle, ChevronDown, Sparkles, Zap, Gauge, Terminal, ShieldCheck, Activity } from 'lucide-react';

const LOADTEST_AEO_FAQS = [
  {
    q: 'What is LoadPulse.AI and how does browser-based API load testing work?',
    a: 'LoadPulse.AI is a performance engineering and SRE diagnostics dashboard built for software engineers, QA teams, and DevOps architects. It simulates concurrent virtual users (VUs) against target HTTP endpoints to measure response times, throughput (RPS), error rates, and percentile latency distributions (P50, P95, P99) in real time.',
  },
  {
    q: 'Why are P95 and P99 latency percentiles more important than average response time?',
    a: 'Average response times mask extreme latency spikes and tail-end degradations. P95 and P99 metrics show the exact experience of the slowest 5% and 1% of users, which reveals database connection pool contention, garbage collection pauses, and upstream microservice bottlenecks before they impact production.',
  },
  {
    q: 'How does the Gemini AI Bottleneck Diagnostic identify root causes?',
    a: 'LoadPulse.AI feeds time-series telemetry (VU ramp-up, latency shifts, status code distributions, error spikes) into Google Gemini 1.5 SRE models. The AI evaluates concurrency-to-latency ratios to detect specific architectural flaws such as unindexed database queries, missing Redis caching layers, connection pool starvation, and API gateway rate-limiting.',
  },
  {
    q: 'Can I export load test configurations as native k6 or cURL scripts?',
    a: 'Yes. LoadPulse.AI automatically compiles your test configuration into production-ready k6.js load testing scripts and modular cURL commands for seamless integration into GitHub Actions CI/CD deployment pipelines.',
  },
];

export default function AEOFAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section aria-labelledby="loadpulse-aeo-heading" className="space-y-6 pt-6 font-mono text-xs text-slate-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-cyan-500/20 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 id="loadpulse-aeo-heading" className="font-bold text-white text-base font-outfit">
              API Load Testing &amp; SRE Performance Knowledge Hub
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
        {LOADTEST_AEO_FAQS.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <article
              key={idx}
              className="p-5 rounded-2xl bg-[#0d1117] border border-cyan-500/20 hover:border-cyan-500/50 transition-all space-y-2.5 cursor-pointer shadow-lg"
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
