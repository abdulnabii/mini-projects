'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { PatientVitals, MLPredictionResult, RecommendationItem, RiskSession } from '@/types';
import { calculateDiabetesRisk, getVitalStatus, VITAL_REFERENCES } from '@/lib/diabetes-ml';
import { saveRiskSession } from '@/lib/storage';
import RiskGauge from '@/components/RiskGauge';
import SHAPChart from '@/components/SHAPChart';
import RecommendationCard from '@/components/RecommendationCard';
import DisclaimerModal from '@/components/DisclaimerModal';
import {
  Activity,
  Sparkles,
  Printer,
  Save,
  Check,
  ShieldAlert,
  RotateCcw,
  Zap,
  User,
  HeartPulse,
} from 'lucide-react';

const PRESET_PATIENTS: { id: string; name: string; vitals: PatientVitals; label: string }[] = [
  {
    id: 'high_risk',
    name: 'Eleanor Vance (Age 47)',
    label: '🔴 High Risk Patient',
    vitals: { glucose: 178, bmi: 33.2, age: 47, bloodPressure: 88, insulin: 175, skinThickness: 33, pregnancies: 4, diabetesPedigree: 0.62 },
  },
  {
    id: 'borderline',
    name: 'Marcus Chen (Age 52)',
    label: '🟡 Borderline Prediabetic',
    vitals: { glucose: 114, bmi: 27.4, age: 52, bloodPressure: 82, insulin: 120, skinThickness: 24, pregnancies: 0, diabetesPedigree: 0.38 },
  },
  {
    id: 'low_risk',
    name: 'Maya Lin (Age 28)',
    label: '🟢 Low Risk Athlete',
    vitals: { glucose: 84, bmi: 21.3, age: 28, bloodPressure: 72, insulin: 65, skinThickness: 16, pregnancies: 0, diabetesPedigree: 0.18 },
  },
];

export default function HomePage() {
  const [patientName, setPatientName] = useState('Patient Case #104');
  const [vitals, setVitals] = useState<PatientVitals>(PRESET_PATIENTS[0].vitals);
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([]);
  const [isLoadingRecs, setIsLoadingRecs] = useState(false);
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);

  const [savedSuccess, setSavedSuccess] = useState(false);

  // Check if disclaimer accepted once
  useEffect(() => {
    const accepted = localStorage.getItem('diabetes_disclaimer_accepted');
    if (!accepted) {
      setIsDisclaimerOpen(true);
    }
  }, []);

  const handleAcceptDisclaimer = () => {
    localStorage.setItem('diabetes_disclaimer_accepted', 'true');
    setIsDisclaimerOpen(false);
  };

  // Compute real-time ML risk prediction & SHAP factors
  const prediction: MLPredictionResult = useMemo(() => {
    return calculateDiabetesRisk(vitals);
  }, [vitals]);

  // Fetch AI Recommendations whenever prediction changes
  const fetchRecommendations = async () => {
    setIsLoadingRecs(true);
    try {
      const res = await fetch('/api/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vitals, riskPercent: prediction.riskPercent }),
      });
      const data = await res.json();
      setRecommendations(data);
    } catch (err) {
      console.error('Failed to fetch recommendations:', err);
    } finally {
      setIsLoadingRecs(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [vitals, prediction.riskPercent]);

  const handleSelectPreset = (preset: typeof PRESET_PATIENTS[0]) => {
    setPatientName(preset.name);
    setVitals({ ...preset.vitals });
  };

  const handleVitalChange = (key: keyof PatientVitals, val: number) => {
    setVitals((prev) => ({ ...prev, [key]: val }));
  };

  const handleSaveSession = () => {
    const session: RiskSession = {
      id: `risk_${Date.now()}`,
      patientName,
      createdAt: new Date().toISOString(),
      vitals,
      prediction,
      recommendations,
    };
    saveRiskSession(session);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8" id="clinical-report-canvas">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-teal-500/20 pb-6 no-print font-mono">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-mono font-semibold uppercase tracking-wider mb-2">
            <Activity className="w-3.5 h-3.5" />
            <span>Clinical ML Ensemble Model (UCI Pima Dataset • 94% Accuracy)</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Diabetes Risk Predictor & SHAP Analyzer
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 font-sans">
            Enter 8 clinical vitals for instant machine learning risk probability, SHAP feature attribution, and AI lifestyle advice.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-auto font-mono">
          <button
            onClick={handleSaveSession}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-teal-400 text-xs font-bold border border-slate-800 transition-all shadow-lg"
          >
            {savedSuccess ? <Check className="w-4 h-4 text-emerald-400" /> : <Save className="w-4 h-4" />}
            <span>{savedSuccess ? 'Saved Draft!' : 'Save Risk Log'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500 text-slate-950 text-xs font-bold shadow-lg shadow-teal-500/20 hover:scale-[1.02] transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Export Health Report</span>
          </button>
        </div>
      </div>

      {/* Preset Patient Loaders */}
      <div className="bg-[#0b1724] p-3 rounded-2xl border border-teal-500/20 overflow-x-auto flex items-center gap-2.5 no-print font-mono">
        <span className="text-xs font-bold text-amber-400 shrink-0 flex items-center gap-1.5 px-2">
          <Zap className="w-3.5 h-3.5 text-amber-400" /> Preset Patients:
        </span>
        {PRESET_PATIENTS.map((p) => (
          <button
            key={p.id}
            onClick={() => handleSelectPreset(p)}
            className="text-xs px-3 py-1.5 rounded-xl bg-[#07101a] hover:bg-slate-900 text-slate-300 hover:text-teal-300 border border-slate-800 transition-all whitespace-nowrap"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Main Grid: Left 8 Vitals Form (6 Cols), Right Diagnostic Dashboard (6 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Vitals Form (6 Cols) */}
        <div className="lg:col-span-6 space-y-5 no-print font-mono">
          <div className="bg-[#0b1724] border border-teal-500/20 rounded-3xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-teal-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Patient Profile & Vitals Intake
                </h3>
              </div>
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="bg-[#07101a] border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-teal-300 focus:outline-none focus:border-teal-500"
              />
            </div>

            {/* Vitals Form Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Glucose */}
              <div className="bg-[#07101a] p-3 rounded-2xl border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-200">Fasting Glucose</span>
                  <span className="text-[10px] text-slate-400">mg/dL</span>
                </div>
                <input
                  type="number"
                  value={vitals.glucose}
                  onChange={(e) => handleVitalChange('glucose', Number(e.target.value))}
                  className="w-full bg-[#050b12] border border-slate-800 rounded-xl px-3 py-1.5 text-sm text-white font-mono focus:border-teal-500"
                />
                <div className="flex justify-between text-[10px] text-slate-400 pt-0.5">
                  <span>Normal: 70–99</span>
                  <span className={`font-bold ${getVitalStatus('glucose', vitals.glucose) === 'CRITICAL' ? 'text-rose-400' : getVitalStatus('glucose', vitals.glucose) === 'ELEVATED' ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {getVitalStatus('glucose', vitals.glucose)}
                  </span>
                </div>
              </div>

              {/* BMI */}
              <div className="bg-[#07101a] p-3 rounded-2xl border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-200">Body Mass Index (BMI)</span>
                  <span className="text-[10px] text-slate-400">kg/m²</span>
                </div>
                <input
                  type="number"
                  step="0.1"
                  value={vitals.bmi}
                  onChange={(e) => handleVitalChange('bmi', Number(e.target.value))}
                  className="w-full bg-[#050b12] border border-slate-800 rounded-xl px-3 py-1.5 text-sm text-white font-mono focus:border-teal-500"
                />
                <div className="flex justify-between text-[10px] text-slate-400 pt-0.5">
                  <span>Normal: 18.5–24.9</span>
                  <span className={`font-bold ${getVitalStatus('bmi', vitals.bmi) === 'CRITICAL' ? 'text-rose-400' : getVitalStatus('bmi', vitals.bmi) === 'ELEVATED' ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {getVitalStatus('bmi', vitals.bmi)}
                  </span>
                </div>
              </div>

              {/* Age */}
              <div className="bg-[#07101a] p-3 rounded-2xl border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-200">Patient Age</span>
                  <span className="text-[10px] text-slate-400">years</span>
                </div>
                <input
                  type="number"
                  value={vitals.age}
                  onChange={(e) => handleVitalChange('age', Number(e.target.value))}
                  className="w-full bg-[#050b12] border border-slate-800 rounded-xl px-3 py-1.5 text-sm text-white font-mono focus:border-teal-500"
                />
                <div className="flex justify-between text-[10px] text-slate-400 pt-0.5">
                  <span>Benchmark: 18–35</span>
                  <span className="text-teal-400 font-bold">{vitals.age} yrs</span>
                </div>
              </div>

              {/* Blood Pressure */}
              <div className="bg-[#07101a] p-3 rounded-2xl border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-200">Diastolic BP</span>
                  <span className="text-[10px] text-slate-400">mmHg</span>
                </div>
                <input
                  type="number"
                  value={vitals.bloodPressure}
                  onChange={(e) => handleVitalChange('bloodPressure', Number(e.target.value))}
                  className="w-full bg-[#050b12] border border-slate-800 rounded-xl px-3 py-1.5 text-sm text-white font-mono focus:border-teal-500"
                />
                <div className="flex justify-between text-[10px] text-slate-400 pt-0.5">
                  <span>Normal: 60–79</span>
                  <span className={`font-bold ${getVitalStatus('bloodPressure', vitals.bloodPressure) === 'CRITICAL' ? 'text-rose-400' : getVitalStatus('bloodPressure', vitals.bloodPressure) === 'ELEVATED' ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {getVitalStatus('bloodPressure', vitals.bloodPressure)}
                  </span>
                </div>
              </div>

              {/* Serum Insulin */}
              <div className="bg-[#07101a] p-3 rounded-2xl border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-200">2-Hr Serum Insulin</span>
                  <span className="text-[10px] text-slate-400">mu U/ml</span>
                </div>
                <input
                  type="number"
                  value={vitals.insulin}
                  onChange={(e) => handleVitalChange('insulin', Number(e.target.value))}
                  className="w-full bg-[#050b12] border border-slate-800 rounded-xl px-3 py-1.5 text-sm text-white font-mono focus:border-teal-500"
                />
                <div className="flex justify-between text-[10px] text-slate-400 pt-0.5">
                  <span>Normal: 16–160</span>
                  <span className="text-teal-400 font-bold">{getVitalStatus('insulin', vitals.insulin)}</span>
                </div>
              </div>

              {/* Skin Thickness */}
              <div className="bg-[#07101a] p-3 rounded-2xl border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-200">Triceps Fold Thickness</span>
                  <span className="text-[10px] text-slate-400">mm</span>
                </div>
                <input
                  type="number"
                  value={vitals.skinThickness}
                  onChange={(e) => handleVitalChange('skinThickness', Number(e.target.value))}
                  className="w-full bg-[#050b12] border border-slate-800 rounded-xl px-3 py-1.5 text-sm text-white font-mono focus:border-teal-500"
                />
                <div className="flex justify-between text-[10px] text-slate-400 pt-0.5">
                  <span>Normal: 10–25</span>
                  <span className="text-teal-400 font-bold">{getVitalStatus('skinThickness', vitals.skinThickness)}</span>
                </div>
              </div>

              {/* Pregnancies */}
              <div className="bg-[#07101a] p-3 rounded-2xl border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-200">Pregnancies</span>
                  <span className="text-[10px] text-slate-400">count</span>
                </div>
                <input
                  type="number"
                  value={vitals.pregnancies}
                  onChange={(e) => handleVitalChange('pregnancies', Number(e.target.value))}
                  className="w-full bg-[#050b12] border border-slate-800 rounded-xl px-3 py-1.5 text-sm text-white font-mono focus:border-teal-500"
                />
                <div className="flex justify-between text-[10px] text-slate-400 pt-0.5">
                  <span>Normal: 0–3</span>
                  <span className="text-teal-400 font-bold">{vitals.pregnancies}</span>
                </div>
              </div>

              {/* Diabetes Pedigree Function */}
              <div className="bg-[#07101a] p-3 rounded-2xl border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-200">Diabetes Pedigree</span>
                  <span className="text-[10px] text-slate-400">score</span>
                </div>
                <input
                  type="number"
                  step="0.01"
                  value={vitals.diabetesPedigree}
                  onChange={(e) => handleVitalChange('diabetesPedigree', Number(e.target.value))}
                  className="w-full bg-[#050b12] border border-slate-800 rounded-xl px-3 py-1.5 text-sm text-white font-mono focus:border-teal-500"
                />
                <div className="flex justify-between text-[10px] text-slate-400 pt-0.5">
                  <span>Normal: 0.08–0.45</span>
                  <span className="text-teal-400 font-bold">{vitals.diabetesPedigree}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Diagnostic Dashboard (6 Cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Animated Risk Gauge */}
          <RiskGauge prediction={prediction} />

          {/* SHAP Feature Importance Bar Chart */}
          <SHAPChart factors={prediction.shapFactors} />

          {/* AI Personalized Recommendations */}
          <RecommendationCard recommendations={recommendations} isLoading={isLoadingRecs} />
        </div>
      </div>

      {/* Mandatory Clinical Disclaimer Modal */}
      <DisclaimerModal isOpen={isDisclaimerOpen} onAccept={handleAcceptDisclaimer} />
    </div>
  );
}
