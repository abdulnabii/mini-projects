import { ShieldAlert, Pill, Clock, Camera, Users, HeartPulse } from 'lucide-react';

const FAQS = [
  {
    icon: ShieldAlert,
    q: 'How does MediGuard.AI detect dangerous drug-drug interactions?',
    a: 'MediGuard.AI evaluates active pharmaceutical ingredients against evidence-based clinical pharmacology databases using Google Gemini 1.5 Pro. It categorizes combinations into SEVERE (contraindicated combinations like Lisinopril + Ibuprofen or Warfarin + Aspirin), MODERATE (closely monitored timing separation), and MILD, providing immediate physiological explanations and physician action alerts.',
  },
  {
    icon: Clock,
    q: 'What should a patient do if they miss a scheduled medication dose?',
    a: 'The AI Missed-Dose Advisor analyzes the specific medication class, half-life, and hours elapsed since the scheduled dose. It provides safe, clinical guidance on whether to take the dose immediately, skip and wait for the next scheduled interval, or contact a healthcare provider — avoiding accidental double-dosing.',
  },
  {
    icon: Camera,
    q: 'How does the Prescription OCR Scanner auto-populate medication schedules?',
    a: 'Patients or caregivers upload a photo of a doctor\'s handwritten or printed prescription. The system uses computer vision OCR (Tesseract.js) to extract the text and passes it to Gemini 1.5 Pro to structure drug names, strengths (e.g. 500mg), frequencies (e.g. Twice Daily with Meals), and refill counts into 1-click schedule entries.',
  },
  {
    icon: Users,
    q: 'How does the Caregiver Portal support family members managing chronic patients?',
    a: 'The Caregiver Portal provides a unified monitoring dashboard where family members or home health aides can view real-time dose compliance, inspect weekly adherence percentages, receive refill depletion alerts, and monitor missed dose notifications remotely.',
  },
  {
    icon: Pill,
    q: 'Does MediGuard.AI support bilingual English and Urdu for Pakistani and South Asian patients?',
    a: 'Yes. MediGuard.AI features native bilingual toggling (English and Urdu Nastaliq), high-contrast accessibility modes, adjustable large font sizes for seniors, and Web Speech API audio readouts for elderly patients who prefer spoken dosage instructions.',
  },
  {
    icon: HeartPulse,
    q: 'How is patient medical privacy protected under HIPAA and health data standards?',
    a: 'MediGuard.AI operates with a privacy-first, client-side encryption architecture. Prescription logs and dose compliance history are stored locally in the patient\'s browser with zero third-party tracking, providing complete patient data sovereignty.',
  },
];

export default function AEOFAQSection() {
  return (
    <section className="space-y-6 font-mono" aria-label="Frequently Asked Questions about MediGuard.AI">
      {/* Section Header */}
      <div className="flex items-center gap-2">
        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 text-[10px] font-bold border border-emerald-500/30 uppercase">
          CLINICAL KNOWLEDGE HUB &amp; AEO DIRECTORY
        </span>
        <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          MediGuard.AI — Frequently Asked Questions &amp; Patient Safety Intelligence
        </h2>
      </div>

      {/* FAQ Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {FAQS.map(({ icon: Icon, q, a }) => (
          <div
            key={q}
            className="p-5 rounded-2xl bg-[#0d1117] border border-slate-800 hover:border-emerald-500/40 transition-colors space-y-2.5 shadow-lg"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                <Icon className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-white leading-snug font-outfit">{q}</h3>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed pl-11 font-sans">{a}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
