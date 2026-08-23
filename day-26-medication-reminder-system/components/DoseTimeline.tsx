'use client';

import { useState } from 'react';
import { Medication, DoseLog } from '@/types';
import {
  CheckCircle2,
  Clock,
  Volume2,
  AlertCircle,
  HelpCircle,
  Pill,
  Sparkles,
  ChevronRight,
  Sun,
  Sunrise,
  Sunset,
  Moon,
} from 'lucide-react';
import { AccessibilitySettings, TRANSLATIONS } from './AccessibilityControls';
import confetti from 'canvas-confetti';

interface Props {
  medications: Medication[];
  doseLogs: DoseLog[];
  accessibility: AccessibilitySettings;
  onTakeDose: (med: Medication, scheduledTime: string) => void;
  onOpenMissedAdvisor: (med: Medication, scheduledTime: string) => void;
}

const TIME_SLOTS = [
  { labelKey: 'morningDoses', time: '08:00', icon: Sunrise, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' },
  { labelKey: 'afternoonDoses', time: '13:00', icon: Sun, color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/30' },
  { labelKey: 'eveningDoses', time: '20:00', icon: Sunset, color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/30' },
  { labelKey: 'bedtimeDoses', time: '22:00', icon: Moon, color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/30' },
];

export default function DoseTimeline({
  medications,
  doseLogs,
  accessibility,
  onTakeDose,
  onOpenMissedAdvisor,
}: Props) {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const t = TRANSLATIONS[accessibility.lang];

  // Play audio chime & speech synthesis reminder
  const playVoiceReminder = (med: Medication, time: string) => {
    setPlayingId(`${med.id}_${time}`);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      let text = `Medication Reminder. It is time to take ${med.name} ${med.dosage}. ${med.instructions}.`;
      if (accessibility.lang === 'ur') {
        text = `دوائی کا وقت ہو گیا ہے۔ براہ کرم ${med.name} ${med.dosage} لیں۔ ${med.instructions}۔`;
      } else if (accessibility.lang === 'es') {
        text = `Recordatorio de medicación. Es hora de tomar ${med.name} ${med.dosage}. ${med.instructions}.`;
      } else if (accessibility.lang === 'ar') {
        text = `تذكير بموعد الدواء. حان وقت تناول ${med.name} ${med.dosage}. ${med.instructions}.`;
      }
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.92;
      utterance.pitch = 1.0;
      utterance.onend = () => setPlayingId(null);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setPlayingId(null), 2000);
    }
  };

  const isDoseTakenToday = (medId: string, time: string) => {
    const todayStr = new Date().toISOString().slice(0, 10);
    return doseLogs.some(
      (l) =>
        l.medicationId === medId &&
        l.scheduledTime === time &&
        l.status === 'taken' &&
        l.loggedAt.slice(0, 10) === todayStr
    );
  };

  const textSizeClass =
    accessibility.textSize === 'xlarge'
      ? 'text-base sm:text-lg'
      : accessibility.textSize === 'large'
      ? 'text-sm sm:text-base'
      : 'text-xs sm:text-sm';

  const headingSizeClass =
    accessibility.textSize === 'xlarge'
      ? 'text-lg sm:text-xl'
      : accessibility.textSize === 'large'
      ? 'text-base sm:text-lg'
      : 'text-sm sm:text-base';

  return (
    <div className={`space-y-6 font-mono ${accessibility.highContrast ? 'contrast-125' : ''}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h3 className={`font-bold text-white font-outfit ${headingSizeClass}`}>
              {t.timelineTab}
            </h3>
            <span className="text-xs text-slate-400">
              {new Date().toLocaleDateString(
                accessibility.lang === 'ur'
                  ? 'ur-PK'
                  : accessibility.lang === 'es'
                  ? 'es-ES'
                  : accessibility.lang === 'ar'
                  ? 'ar-SA'
                  : 'en-US',
                {
                  weekday: 'long',
                  month: 'short',
                  day: 'numeric',
                }
              )}
            </span>
          </div>
        </div>

        <span className="text-[10px] text-emerald-400 font-bold px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30">
          Smart Dosage Tracking Active
        </span>
      </div>

      {/* Time-Slotted List */}
      <div className="space-y-6">
        {TIME_SLOTS.map((slot) => {
          const SlotIcon = slot.icon;
          const medsInSlot = medications.filter((m) =>
            m.scheduledTimes.includes(slot.time)
          );

          if (medsInSlot.length === 0) return null;

          const slotTitle =
            slot.labelKey === 'morningDoses'
              ? t.morningDoses
              : slot.labelKey === 'afternoonDoses'
              ? t.afternoonDoses
              : slot.labelKey === 'eveningDoses'
              ? t.eveningDoses
              : t.bedtimeDoses;

          return (
            <div
              key={slot.time}
              className={`p-6 rounded-3xl bg-[#0d1117] shadow-xl space-y-4 ${
                accessibility.highContrast
                  ? 'border-2 border-yellow-400/80 bg-black'
                  : 'border border-slate-800'
              }`}
            >
              {/* Slot Header */}
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-xl border ${slot.bg} ${slot.color}`}>
                    <SlotIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className={`font-bold text-white font-outfit ${headingSizeClass}`}>
                      {slotTitle}
                    </h4>
                    <span className="text-[10px] text-slate-400">
                      {medsInSlot.length} medication{medsInSlot.length > 1 ? 's' : ''} due
                    </span>
                  </div>
                </div>

                <span className="text-[10px] text-slate-500 font-mono uppercase font-bold">
                  Slot #{slot.time}
                </span>
              </div>

              {/* Medication Cards in this Slot */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {medsInSlot.map((med) => {
                  const taken = isDoseTakenToday(med.id, slot.time);
                  const isLowStock = med.stockCount <= med.refillThreshold;

                  return (
                    <div
                      key={`${med.id}_${slot.time}`}
                      className={`p-5 rounded-2xl border transition-all space-y-3 flex flex-col justify-between ${
                        taken
                          ? 'bg-emerald-950/20 border-emerald-500/40'
                          : accessibility.highContrast
                          ? 'bg-[#111827] border-2 border-slate-500'
                          : 'bg-[#161b22] border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="space-y-2">
                        {/* Title & Badge */}
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <h5 className={`font-bold text-white font-outfit ${headingSizeClass}`}>
                                {med.name}
                              </h5>
                              <span
                                className={`px-2.5 py-0.5 rounded-md font-black text-xs ${
                                  accessibility.highContrast
                                    ? 'bg-yellow-400 text-black'
                                    : 'bg-slate-900 border border-slate-800 text-cyan-400'
                                }`}
                              >
                                {med.dosage}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400">
                              {med.genericName}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => playVoiceReminder(med, slot.time)}
                            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-emerald-400 transition-colors cursor-pointer"
                            title="Listen to audio reminder"
                          >
                            <Volume2
                              className={`w-4 h-4 ${
                                playingId === `${med.id}_${slot.time}`
                                  ? 'text-emerald-400 animate-pulse'
                                  : ''
                              }`}
                            />
                          </button>
                        </div>

                        {/* Instructions */}
                        <div
                          className={`p-3 rounded-xl bg-[#0d1117] border border-slate-800 text-slate-200 font-sans leading-relaxed ${textSizeClass}`}
                        >
                          💡 {med.instructions}
                        </div>

                        {/* Purpose & Stock */}
                        <div className="flex items-center justify-between text-[11px] pt-1">
                          <span className="text-slate-400 truncate max-w-[200px]">
                            🎯 {med.purpose}
                          </span>
                          <span
                            className={`font-bold ${
                              isLowStock ? 'text-amber-400' : 'text-slate-400'
                            }`}
                          >
                            Stock: {med.stockCount} pills {isLowStock && '⚠️ (Refill)'}
                          </span>
                        </div>
                      </div>

                      {/* Action Bar */}
                      <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                        <button
                          type="button"
                          onClick={() => onOpenMissedAdvisor(med, slot.time)}
                          className="text-xs text-slate-400 hover:text-cyan-400 flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <HelpCircle className="w-3.5 h-3.5" />
                          <span>{t.missedAdvisor}</span>
                        </button>

                        {taken ? (
                          <div className="px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            <span>{t.taken}</span>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              onTakeDose(med, slot.time);
                              confetti({
                                particleCount: 25,
                                spread: 60,
                                origin: { y: 0.7 },
                                colors: ['#10b981', '#06b6d4'],
                              });
                            }}
                            className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 text-black font-extrabold text-xs transition-all shadow-md shadow-emerald-500/20 flex items-center gap-1.5 cursor-pointer hover:scale-105"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>{t.markTaken}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
