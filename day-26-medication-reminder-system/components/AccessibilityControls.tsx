'use client';

import { useState } from 'react';
import {
  Volume2,
  Globe,
  Sun,
  Eye,
  Type,
  ShieldCheck,
  Lock,
  HeartPulse,
} from 'lucide-react';

export type LanguageCode = 'en' | 'ur' | 'es' | 'ar';

export interface AccessibilitySettings {
  lang: LanguageCode;
  textSize: 'normal' | 'large' | 'xlarge';
  highContrast: boolean;
}

interface Props {
  settings: AccessibilitySettings;
  onUpdateSettings: (newSettings: AccessibilitySettings) => void;
  onReadEntireSchedule: () => void;
  isSpeaking: boolean;
}

export const TRANSLATIONS: Record<
  LanguageCode,
  {
    heroPill: string;
    heroTitle: string;
    heroSub: string;
    timelineTab: string;
    radarTab: string;
    scannerTab: string;
    adherenceTab: string;
    morningDoses: string;
    afternoonDoses: string;
    eveningDoses: string;
    bedtimeDoses: string;
    markTaken: string;
    taken: string;
    missedAdvisor: string;
    privacyBadge: string;
    readSchedule: string;
  }
> = {
  en: {
    heroPill: 'AI PATIENT MEDICATION SAFETY & ADHERENCE INTELLIGENCE',
    heroTitle: 'Smart Medication Schedule & Clinical Safety Guardian',
    heroSub: 'Manage complex chronic disease regimens with real-time dosing reminders, Gemini-powered drug interaction detection, adherence telemetry, and prescription OCR scanning.',
    timelineTab: "Today's Dosing Timeline",
    radarTab: 'Drug Interaction Radar',
    scannerTab: 'Prescription OCR',
    adherenceTab: 'Compliance Analytics',
    morningDoses: 'Morning Doses (08:00 AM)',
    afternoonDoses: 'Afternoon Doses (01:00 PM)',
    eveningDoses: 'Evening Doses (08:00 PM)',
    bedtimeDoses: 'Bedtime Doses (10:00 PM)',
    markTaken: 'Mark as Taken',
    taken: 'Taken Today',
    missedAdvisor: 'Missed this dose?',
    privacyBadge: '🔒 HIPAA & GDPR Compliant • 100% On-Device Encrypted Storage',
    readSchedule: '🔊 Read Schedule Aloud',
  },
  ur: {
    heroPill: 'مصنوعی ذہانت برائے ادویات کی حفاظت اور بروقت خوراک',
    heroTitle: 'اسمارٹ میڈیسن شیڈول اور کلینیکل سیفٹی گارڈین',
    heroSub: 'شوگر، بلڈ پریشر اور دل کی ادویات کا بروقت استعمال، مضرِ صحت ادویاتی ملاپ سے بچاؤ اور آسان اردو رہنمائی۔',
    timelineTab: 'آج کی ادویات کا شیڈول',
    radarTab: 'ادویاتی ملاپ کا خطرہ (سیفٹی)',
    scannerTab: 'نسخہ اسکینر (OCR)',
    adherenceTab: 'پابندی اور کارکردگی',
    morningDoses: 'صبح کی خوراک (08:00 بجے)',
    afternoonDoses: 'دوپہر کی خوراک (01:00 بجے)',
    eveningDoses: 'شام کی خوراک (08:00 بجے)',
    bedtimeDoses: 'رات سوتے وقت (10:00 بجے)',
    markTaken: 'دوائی کھا لی ✅',
    taken: 'آج کھا لی گئی',
    missedAdvisor: 'خوراک چھوٹ گئی؟',
    privacyBadge: '🔒 مکمل رازداری اور محفوظ ڈیٹا • آپ کی معلومات صرف آپ کے پاس ہے',
    readSchedule: '🔊 شیڈول سنیں (آواز)',
  },
  es: {
    heroPill: 'SEGURIDAD Y CUMPLIMIENTO DE MEDICACIÓN CON IA',
    heroTitle: 'Horario Inteligente de Medicamentos y Guardián Clínico',
    heroSub: 'Controle regímenes crónicos complejos con recordatorios en tiempo real, detección de interacciones farmacológicas y escaneo OCR.',
    timelineTab: 'Horario de Hoy',
    radarTab: 'Radar de Interacciones',
    scannerTab: 'Escáner de Recetas',
    adherenceTab: 'Análisis de Cumplimiento',
    morningDoses: 'Dosis de la Mañana (08:00)',
    afternoonDoses: 'Dosis de la Tarde (13:00)',
    eveningDoses: 'Dosis de la Noche (20:00)',
    bedtimeDoses: 'Dosis al Acostarse (22:00)',
    markTaken: 'Marcar como Tomado',
    taken: 'Tomado Hoy',
    missedAdvisor: '¿Olvidó esta dosis?',
    privacyBadge: '🔒 Cumplimiento HIPAA y GDPR • Almacenamiento local cifrado',
    readSchedule: '🔊 Leer Horario en Voz Alta',
  },
  ar: {
    heroPill: 'ذكاء اصطناعي لسلامة الأدوية والامتثال للجرعات',
    heroTitle: 'جدول الأدوية الذكي والحارس الطبي السريري',
    heroSub: 'إدارة جداول الأدوية للأمراض المزمنة مع تذكيرات بالجرعات وفحص التفاعلات الدوائية الخطيرة.',
    timelineTab: 'جدول جرعات اليوم',
    radarTab: 'رادار التفاعلات الدوائية',
    scannerTab: 'ماسح الوصفات الطبية',
    adherenceTab: 'تحليلات الالتزام',
    morningDoses: 'جرعات الصباح (08:00)',
    afternoonDoses: 'جرعات الظهيرة (13:00)',
    eveningDoses: 'جرعات المساء (20:00)',
    bedtimeDoses: 'جرعات قبل النوم (22:00)',
    markTaken: 'تم تناول الجرعة ✅',
    taken: 'تم التناول اليوم',
    missedAdvisor: 'هل فاتتك الجرعة؟',
    privacyBadge: '🔒 متوافق مع معايير الخصوصية • بياناتك مشفرة ومحفوظة على جهازك',
    readSchedule: '🔊 قراءة الجدول بالصوت',
  },
};

export default function AccessibilityControls({
  settings,
  onUpdateSettings,
  onReadEntireSchedule,
  isSpeaking,
}: Props) {
  const t = TRANSLATIONS[settings.lang];

  return (
    <div className="p-4 rounded-2xl bg-[#0d1117] border border-emerald-500/20 shadow-lg flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
      {/* Voice Reader & Screen Reader Trigger */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onReadEntireSchedule}
          className={`px-3.5 py-1.5 rounded-xl font-bold transition-all flex items-center gap-2 cursor-pointer ${
            isSpeaking
              ? 'bg-emerald-500 text-black animate-pulse shadow-md'
              : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20'
          }`}
        >
          <Volume2 className="w-4 h-4" />
          <span>{isSpeaking ? 'Reading Aloud...' : t.readSchedule}</span>
        </button>

        {/* High Contrast Toggle */}
        <button
          type="button"
          onClick={() =>
            onUpdateSettings({
              ...settings,
              highContrast: !settings.highContrast,
            })
          }
          className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            settings.highContrast
              ? 'bg-yellow-400 text-black border-yellow-300 font-black shadow-md'
              : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
          }`}
          title="Toggle High-Contrast Mode for Visibility"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>High Contrast</span>
        </button>

        {/* Text Size Scaler */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900 border border-slate-800">
          <Type className="w-3 h-3 text-slate-400 ml-1" />
          {(['normal', 'large', 'xlarge'] as const).map((sz) => (
            <button
              key={sz}
              type="button"
              onClick={() => onUpdateSettings({ ...settings, textSize: sz })}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer ${
                settings.textSize === sz
                  ? 'bg-emerald-500 text-black font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {sz === 'normal' ? '1x' : sz === 'large' ? '1.25x' : '1.5x'}
            </button>
          ))}
        </div>
      </div>

      {/* Language Switcher */}
      <div className="flex items-center gap-1.5">
        <Globe className="w-3.5 h-3.5 text-cyan-400" />
        <span className="text-[10px] text-slate-400 font-bold uppercase">Language:</span>
        {(['en', 'ur', 'es', 'ar'] as const).map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => onUpdateSettings({ ...settings, lang: l })}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
              settings.lang === l
                ? 'bg-cyan-500 text-black font-black shadow-sm'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {l === 'en'
              ? 'EN'
              : l === 'ur'
              ? 'اردو'
              : l === 'es'
              ? 'ES'
              : 'العربية'}
          </button>
        ))}
      </div>
    </div>
  );
}
