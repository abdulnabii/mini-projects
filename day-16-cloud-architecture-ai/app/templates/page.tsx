'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ARCHITECTURE_PRESETS } from '@/lib/sampleArchitectures';
import Link from 'next/link';
import { Cloud, ArrowLeft, ArrowRight, Layers, ShieldCheck, Zap } from 'lucide-react';

export default function TemplatesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#060a12] text-slate-200 selection:bg-cyan-500/30 selection:text-white">
      <Navbar />

      <main className="flex-1 space-y-8 py-8 px-4 sm:px-6 max-w-7xl mx-auto w-full font-mono text-xs">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white hover:border-cyan-500/40 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Architecture Workbench</span>
          </Link>
        </div>

        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold">
            <Layers className="w-3.5 h-3.5" />
            <span>CLOUD DESIGN PATTERNS &amp; BLUEPRINTS</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white font-outfit">
            Production System Design Architecture Library
          </h1>
          <p className="text-sm text-slate-400 font-sans max-w-2xl">
            Battle-tested enterprise system design patterns with pre-calculated RPS limits, cloud topologies, and cost profiles.
          </p>
        </div>

        {/* Blueprint Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          {ARCHITECTURE_PRESETS.map((preset) => (
            <div
              key={preset.id}
              className="p-6 sm:p-8 rounded-3xl bg-[#0b1220] border border-slate-800 hover:border-cyan-500/50 transition-all space-y-4 shadow-xl flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{preset.icon}</span>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/30">
                      {preset.targetProvider}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30">
                      {preset.targetScale}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-500">{preset.category}</span>
                  <h3 className="text-xl font-bold text-white font-outfit">{preset.title}</h3>
                  <p className="text-xs text-slate-300 font-sans leading-relaxed">{preset.tagline}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-900 text-[11px] text-slate-400 font-sans leading-relaxed">
                  <p className="font-bold text-slate-300 mb-1">Architecture Overview:</p>
                  {preset.requirements}
                </div>
              </div>

              <Link
                href="/"
                className="w-full py-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500 text-cyan-400 font-bold flex items-center justify-center gap-2 transition-all group mt-2"
              >
                <span>Launch &amp; Customize in Workbench</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
