'use client';

import { ClassificationResult } from '@/types';
import { Activity, ShieldAlert, Sparkles, CheckCircle2, Clock, BookOpen, AlertTriangle, FileText, Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface Props {
  result: ClassificationResult;
  isLoadingAnnotation: boolean;
}

export default function ClassifierView({ result, isLoadingAnnotation }: Props) {
  const [copied, setCopied] = useState(false);
  const isPositive = result.predictedClass.includes('Pneumonia') || result.predictedClass.includes('Malignant');

  const handleCopyReport = () => {
    const reportText = `MEDVISION CLINICAL AI FINDINGS REPORT
Modality: ${result.modelType === 'xray' ? 'Chest Radiography (DenseNet-121)' : 'Dermatology Dermoscopy (EfficientNet-B0)'}
Primary Prediction: ${result.predictedClass} (${(result.confidence * 100).toFixed(1)}% confidence)
Inference Latency: ${result.inferenceTimeMs}ms
Anatomical Zone: ${result.educationalAnnotation?.anatomicalRegion || 'Target focus area'}
Radiological Notes: ${result.educationalAnnotation?.radiologyExplanation || 'N/A'}
Clinical Relevance: ${result.educationalAnnotation?.clinicalRelevance || 'N/A'}
Disclaimer: Educational & Research Simulator Only.`;

    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 font-mono text-xs text-slate-300">
      {/* Primary Prediction Banner */}
      <div
        className={`p-6 sm:p-8 rounded-3xl border-2 space-y-4 shadow-2xl ${
          isPositive
            ? 'bg-rose-500/10 border-rose-500 text-rose-100 shadow-rose-500/10'
            : 'bg-emerald-500/10 border-emerald-500 text-emerald-100 shadow-emerald-500/10'
        }`}
      >
        {/* DICOM Header Simulator */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-[10px] text-slate-400 border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-3">
            <span>
              PATIENT ID: <strong className="text-white font-mono">PX-84920-DX</strong>
            </span>
            <span>•</span>
            <span>MODALITY: <strong className="text-cyan-400">DX DIGITAL RADIOGRAPHY</strong></span>
            <span>•</span>
            <span>EXPOSURE: <strong className="text-slate-200">120 kVp / 2.5 mAs</strong></span>
          </div>

          <button
            type="button"
            onClick={handleCopyReport}
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white transition-all text-[10px] font-bold"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied Findings' : 'Export Report'}</span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold ${
                isPositive ? 'bg-rose-500 text-white' : 'bg-emerald-500 text-black'
              }`}
            >
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Primary Model Classification
              </span>
              <h2 className="text-xl sm:text-2xl font-black font-outfit text-white">
                {result.predictedClass}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-5 py-2.5 rounded-2xl bg-slate-950/90 border border-slate-800 flex items-center gap-2">
              <span className="text-2xl font-black font-outfit text-cyan-400">
                {(result.confidence * 100).toFixed(1)}%
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Confidence</span>
            </div>
          </div>
        </div>

        {/* Low Confidence Uncertainty Warning Banner */}
        {result.uncertaintyFlag && (
          <div className="p-3.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-200 text-[11px] flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>Model Uncertainty Warning:</strong> Top class probability is below 70%. High model uncertainty detected.
            </span>
          </div>
        )}

        {/* Softmax Probability Bars */}
        <div className="space-y-3 pt-2">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Softmax Class Distribution
          </label>
          <div className="space-y-2">
            {Object.entries(result.probabilities).map(([cls, prob], idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-slate-200 font-outfit text-xs">{cls}</span>
                  <span className="text-cyan-400">{(prob * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      cls.includes('Pneumonia') || cls.includes('Malignant')
                        ? 'bg-rose-500'
                        : 'bg-emerald-400'
                    }`}
                    style={{ width: `${prob * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Inference Latency Metric */}
        <div className="flex items-center justify-between text-[10px] text-slate-500 border-t border-slate-800/80 pt-3">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            Inference Forward Pass Latency: <strong className="text-slate-300">{result.inferenceTimeMs}ms</strong>
          </span>
          <span>WebGL Acceleration Active</span>
        </div>
      </div>

      {/* Educational Annotation Box */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#090d16] border border-cyan-500/30 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="font-bold text-white text-base font-outfit flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            Educational Radiology &amp; Dermatology Teaching Notes
          </h3>
          <span className="text-cyan-400 text-[10px] font-bold">Gemini AI Teaching Assistant</span>
        </div>

        {isLoadingAnnotation ? (
          <div className="flex items-center gap-3 text-slate-400 py-4">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
            <span>Generating educational radiological breakdown of GradCAM heatmap...</span>
          </div>
        ) : result.educationalAnnotation ? (
          <div className="space-y-4 leading-relaxed font-sans text-xs">
            <div>
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block font-mono">
                Highlighted Anatomical Zone:
              </span>
              <p className="font-bold text-white text-sm font-outfit mt-0.5">
                {result.educationalAnnotation.anatomicalRegion}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-300">
              {result.educationalAnnotation.radiologyExplanation}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
              <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-200">
                <strong className="block text-[10px] text-cyan-400 uppercase font-mono">Clinical Relevance:</strong>
                <p className="mt-0.5">{result.educationalAnnotation.clinicalRelevance}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200">
                <strong className="block text-[10px] text-amber-400 uppercase font-mono">AI Explainability Note:</strong>
                <p className="mt-0.5">{result.educationalAnnotation.aiLimitationNote}</p>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
