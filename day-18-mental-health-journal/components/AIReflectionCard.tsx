'use client';

import { AIJournalAnalysis } from '@/types';
import { Sparkles, Heart, Compass, ShieldAlert, CheckCircle2, Wind, Lightbulb, AlertTriangle, ArrowRight } from 'lucide-react';

interface Props {
  analysis: AIJournalAnalysis;
  onOpenBreathing: () => void;
  onOpenCoping: () => void;
}

export default function AIReflectionCard({ analysis, onOpenBreathing, onOpenCoping }: Props) {
  const isPositive = analysis.sentimentScore > 0.2;
  const isNegative = analysis.sentimentScore < -0.2;

  return (
    <div className="rounded-3xl bg-[#0b1220] border-2 border-emerald-500/40 p-6 sm:p-8 space-y-6 shadow-2xl shadow-emerald-500/10 font-mono text-xs text-slate-300">
      {/* Crisis Warning Guardrail */}
      {analysis.crisisFlag && (
        <div className="p-4 rounded-2xl bg-rose-950/40 border-2 border-rose-500 text-rose-200 space-y-2">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-sm font-outfit">
            <AlertTriangle className="w-5 h-5" />
            <span>24/7 Compassionate Crisis Support is Available</span>
          </div>
          <p className="text-[11px] font-sans leading-relaxed text-rose-100">
            If you are in distress or experiencing thoughts of self-harm, please reach out to dedicated professionals immediately:
          </p>
          <div className="flex flex-wrap gap-3 pt-1 text-[10px] font-bold">
            <span className="px-3 py-1 rounded-lg bg-rose-900/60 border border-rose-500/40">
              📞 US/Canada: Dial or Text 988 (Suicide &amp; Crisis Lifeline)
            </span>
            <span className="px-3 py-1 rounded-lg bg-rose-900/60 border border-rose-500/40">
              📞 UK: Dial 111 or Text SHOUT to 85258
            </span>
            <span className="px-3 py-1 rounded-lg bg-rose-900/60 border border-rose-500/40">
              🌍 International: findahelpline.com
            </span>
          </div>
        </div>
      )}

      {/* Header Emotion Spectrum */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
              EMOTIONAL INTELLIGENCE TELEMETRY
            </span>
            <span className="text-[10px] text-slate-500">
              Valence: {analysis.sentimentScore > 0 ? `+${analysis.sentimentScore}` : analysis.sentimentScore}
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white font-outfit">
            {analysis.primaryEmotion}
          </h3>
        </div>

        {/* Secondary Emotions Pills */}
        <div className="flex flex-wrap gap-1.5 self-start sm:self-auto">
          {analysis.secondaryEmotions.map((emo, idx) => (
            <span
              key={idx}
              className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-teal-300 text-[10px] font-bold"
            >
              #{emo}
            </span>
          ))}
        </div>
      </div>

      {/* Empathetic Reflection Box */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-950 border border-emerald-500/20 space-y-3 shadow-md">
        <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs font-outfit">
          <Heart className="w-4 h-4 fill-emerald-400" />
          <span>MindSanctuary Empathetic Reflection:</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-200 font-sans leading-relaxed">
          &quot;{analysis.empathyReflection}&quot;
        </p>
      </div>

      {/* Gentle Inquiry Question */}
      {analysis.gentlePromptQuestion && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/30 via-slate-950 to-slate-950 border border-indigo-500/30 space-y-1.5">
          <span className="text-[10px] font-bold text-indigo-400 uppercase flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5" /> A Gentle Question for Deeper Stillness:
          </span>
          <p className="text-xs text-indigo-100 font-sans leading-relaxed italic">
            &quot;{analysis.gentlePromptQuestion}&quot;
          </p>
        </div>
      )}

      {/* Cognitive Distortion Reframing (if detected) */}
      {analysis.detectedPatterns && analysis.detectedPatterns.length > 0 && (
        <div className="space-y-3">
          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            CBT Pattern Recognition &amp; Cognitive Reframing:
          </span>

          <div className="grid grid-cols-1 gap-3">
            {analysis.detectedPatterns.map((pat, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-amber-500/20 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs font-outfit">
                    Pattern: {pat.name}
                  </span>
                  <span className="text-[9px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    CBT Cognitive Pattern
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-sans">{pat.description}</p>

                <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-emerald-200 text-[11px] space-y-0.5">
                  <span className="font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Balanced Reframing Thought:
                  </span>
                  <p className="font-sans italic">&quot;{pat.reframingThought}&quot;</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Daily Affirmation Callout */}
      {analysis.dailyAffirmation && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-center font-sans italic text-xs">
          ✨ &quot;{analysis.dailyAffirmation}&quot;
        </div>
      )}

      {/* Coping Tools Trigger Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800">
        <span className="text-[10px] text-slate-500">Ready to ground your mind?</span>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenBreathing}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-400 to-emerald-400 text-black font-bold flex items-center gap-2 transition-all shadow-md shadow-teal-500/20 hover:scale-105 cursor-pointer font-outfit"
          >
            <Wind className="w-4 h-4" />
            <span>Launch Box Breathing (4-4-4-4)</span>
          </button>

          <button
            type="button"
            onClick={onOpenCoping}
            className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 text-slate-200 font-bold flex items-center gap-1.5 transition-all cursor-pointer font-outfit"
          >
            <span>Explore CBT Exercises</span>
            <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
          </button>
        </div>
      </div>
    </div>
  );
}
