'use client';

import { useState } from 'react';
import { PrescriptionScanResult, Medication } from '@/types';
import {
  Camera,
  Upload,
  Sparkles,
  Loader2,
  CheckCircle2,
  FileText,
  Plus,
  ArrowRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  onAddMedications: (newMeds: Medication[]) => void;
}

const SAMPLE_PRESCRIPTIONS = [
  {
    title: 'Dr. Malik (Cardiology Clinic Rx)',
    text: `Rx:
1. Metformin 500mg - 1 tab BID with meals #60
2. Amlodipine 5mg - 1 tab QD morning #30
3. Atorvastatin 20mg - 1 tab QHS bedtime #30
Doctor: Dr. Ayesha Malik (Cardiologist)
Date: 2026-08-20`,
  },
  {
    title: 'Dr. Tariq (Diabetic Care Rx)',
    text: `Rx:
1. Glimepiride 2mg - 1 tab QD before breakfast #30
2. Empagliflozin 10mg - 1 tab QD morning #30
3. Januvia (Sitagliptin) 100mg - 1 tab QD with food #30
Doctor: Dr. Tariq Mahmood (Endocrinologist)
Date: 2026-08-18`,
  },
];

export default function PrescriptionScanner({ onAddMedications }: Props) {
  const [inputText, setInputText] = useState('');
  const [scanResult, setScanResult] = useState<PrescriptionScanResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleScan = async (textToScan: string = inputText) => {
    if (!textToScan.trim()) return;

    setIsLoading(true);
    try {
      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prescriptionText: textToScan }),
      });
      const data = await res.json();
      if (data.result) {
        setScanResult(data.result);
        confetti({
          particleCount: 25,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#10b981', '#06b6d4'],
        });
      }
    } catch (e) {
      console.error('Prescription scan failed:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyExtractedMeds = () => {
    if (!scanResult) return;

    const newMeds: Medication[] = scanResult.extractedMedications.map((item, idx) => ({
      id: `med_rx_${Date.now()}_${idx}`,
      name: item.name,
      genericName: item.name,
      dosage: item.dosage || '10mg',
      form: 'tablet',
      frequency: item.frequency || 'once_daily',
      scheduledTimes: item.frequency === 'twice_daily' ? ['08:00', '20:00'] : ['08:00'],
      instructions: item.instructions || 'Take as prescribed by doctor',
      purpose: item.purpose || 'Prescribed Therapy',
      stockCount: 30,
      refillThreshold: 7,
      prescribingDoctor: scanResult.doctorName || 'Prescription Doctor',
      colorTag: 'cyan',
    }));

    onAddMedications(newMeds);
    setScanResult(null);
    setInputText('');
  };

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-[#0d1117] border border-cyan-500/30 shadow-2xl space-y-6 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base font-outfit">
              AI Prescription OCR &amp; Regimen Importer
            </h3>
            <p className="text-xs text-slate-400">
              Scan doctor prescriptions or paste Rx text to auto-populate dosing schedules
            </p>
          </div>
        </div>

        <span className="text-[10px] text-cyan-300 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 font-bold flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          <span>Gemini 1.5 Flash Medical OCR</span>
        </span>
      </div>

      {/* Input Area */}
      <div className="space-y-4">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              <span>Paste Prescription OCR Text or Handwritten Note:</span>
            </label>
            <span className="text-[10px] text-slate-500">{inputText.length} chars</span>
          </div>

          <textarea
            rows={4}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="e.g. Rx: Metformin 500mg 1 tab BID with meals #60, Amlodipine 5mg QD morning #30 - Dr. Tariq"
            className="w-full p-4 rounded-2xl bg-[#161b22] border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 font-sans leading-relaxed"
          />
        </div>

        {/* Sample Prescriptions */}
        <div className="space-y-1.5">
          <span className="text-[10px] text-slate-500 uppercase font-bold">
            Demo Prescription Templates:
          </span>
          <div className="flex items-center gap-2 flex-wrap">
            {SAMPLE_PRESCRIPTIONS.map((sample, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setInputText(sample.text);
                  handleScan(sample.text);
                }}
                className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-white text-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>{sample.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Scan Trigger Button */}
        <div className="flex items-center justify-end pt-2">
          <button
            type="button"
            disabled={isLoading || !inputText.trim()}
            onClick={() => handleScan()}
            className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-400 to-teal-500 hover:from-cyan-300 text-black font-extrabold text-xs transition-all shadow-md shadow-cyan-500/20 disabled:opacity-40 cursor-pointer flex items-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            <span>Parse Prescription with Gemini</span>
          </button>
        </div>
      </div>

      {/* Extracted Result Preview */}
      {scanResult && (
        <div className="p-5 rounded-2xl bg-[#04080e] border border-cyan-500/40 space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="space-y-0.5">
              <span className="text-[10px] text-emerald-400 font-bold uppercase flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Extraction Complete ({scanResult.confidenceScore}% Confidence)
              </span>
              <h4 className="font-bold text-white text-sm font-outfit">
                {scanResult.doctorName || 'Prescribing Physician'} — {scanResult.extractedMedications.length} Prescriptions Found
              </h4>
            </div>

            <button
              type="button"
              onClick={handleApplyExtractedMeds}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 text-black font-extrabold text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              <span>Add to Active Regimen</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {scanResult.extractedMedications.map((m, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-[#161b22] border border-slate-800 space-y-1.5 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm font-outfit">{m.name}</span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-900 text-cyan-400 font-bold text-[10px]">
                    {m.dosage}
                  </span>
                </div>
                <p className="text-slate-400 text-[11px] font-sans">
                  🕒 Frequency: <strong className="text-white">{m.frequency.replace('_', ' ')}</strong>
                </p>
                <p className="text-slate-400 text-[11px] font-sans">
                  💡 {m.instructions}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
