'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Activity,
  ShieldCheck,
  Stethoscope,
  Sparkles,
  Zap,
  Clock,
  CheckCircle2,
  ChevronRight,
  Brain,
  Thermometer,
  HeartPulse,
  Flame,
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();

  const commonSymptoms = [
    { label: 'Severe Headache & Neck Tension', query: "I've had a severe headache for 2 days with neck tension and sensitivity to light.", risk: 'HIGH' },
    { label: 'Chest Tightness & Breathlessness', query: "I feel a sharp chest tightness that spreads to my arm when I breathe deeply.", risk: 'EMERGENCY' },
    { label: 'Fever, Sore Throat & Fatigue', query: "I have a 101°F fever, sore throat, and body ache since yesterday.", risk: 'MEDIUM' },
    { label: 'Mild Stomach Cramps & Nausea', query: "I am feeling mild stomach cramps after eating and slight nausea.", risk: 'LOW' },
  ];

  const handleQuickStart = (query: string) => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('initial_symptom_query', query);
    }
    router.push('/chat');
  };

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>WHO & ESI Clinical Protocol Triage AI</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Instant AI Triage & <br />
              <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
                Symptom Intelligence
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              Describe your symptoms in natural language. MediTriage AI analyzes clinical risk patterns, asks clarifying follow-up questions, and delivers structured urgency guidelines.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/chat"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 text-slate-950 font-bold text-base shadow-xl shadow-cyan-500/25 hover:scale-[1.03] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <Stethoscope className="w-5 h-5" />
                <span>Start Free Symptom Check</span>
                <ChevronRight className="w-5 h-5" />
              </Link>
              <Link
                href="/history"
                className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-slate-900 border border-slate-800 text-slate-200 font-semibold text-base hover:bg-slate-800 hover:text-white transition-all flex items-center justify-center gap-2"
              >
                <Activity className="w-5 h-5 text-cyan-400" />
                <span>View Past Sessions</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Interactive Symptom Chips */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 sm:p-8 backdrop-blur-xl">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-white">Try a Quick Clinical Scenario:</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {commonSymptoms.map((symptom, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickStart(symptom.query)}
                className="group text-left p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-900 transition-all flex flex-col justify-between gap-3 shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-slate-400">Scenario {idx + 1}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        symptom.risk === 'EMERGENCY'
                          ? 'bg-red-950 text-red-400 border-red-800'
                          : symptom.risk === 'HIGH'
                          ? 'bg-orange-950 text-orange-400 border-orange-800'
                          : symptom.risk === 'MEDIUM'
                          ? 'bg-amber-950 text-amber-400 border-amber-800'
                          : 'bg-emerald-950 text-emerald-400 border-emerald-800'
                      }`}
                    >
                      {symptom.risk}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors">
                    {symptom.label}
                  </h3>
                </div>
                <div className="flex items-center gap-1 text-xs text-cyan-400 font-medium pt-2 border-t border-slate-800/60">
                  <span>Analyze this symptom</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Clinical Triage Protocol Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Designed for Clinical Safety & Speed
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Engineered with WHO emergency triage metrics and multi-modal risk classification.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-800/60 flex items-center justify-center text-cyan-400">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-white">Dynamic AI Clarification</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Asks precise follow-up questions one step at a time to narrow down symptom timelines, severity, and associated red-flag indicators.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-teal-950/80 border border-teal-800/60 flex items-center justify-center text-teal-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-white">4-Level Urgency Engine</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Categorizes risk into Low (Self care), Medium (GP visit), High (Urgent care), and Emergency (Immediate ER / 911 dispatch).
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-950/80 border border-emerald-800/60 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-white">Exportable Clinical Reports</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Save your session history locally and generate clean, formatted text & PDF clinical summary reports to share with your healthcare provider.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
