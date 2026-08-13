'use client';

import { useState } from 'react';
import { ModelType, SampleMedicalImage } from '@/types';
import { SAMPLE_MEDICAL_IMAGES } from '@/lib/sampleImages';
import { UploadCloud, Activity, Stethoscope, Sparkles, FileImage, Image as ImageIcon, Layers } from 'lucide-react';

interface Props {
  modelType: ModelType;
  onSelectModelType: (m: ModelType) => void;
  onSelectImage: (imageSrc: string, sampleInfo?: SampleMedicalImage) => void;
  isLoading: boolean;
}

export default function ImageUploader({
  modelType,
  onSelectModelType,
  onSelectImage,
  isLoading,
}: Props) {
  const [dragActive, setDragActive] = useState(false);
  const [customImageName, setCustomImageName] = useState<string | null>(null);

  const filteredSamples = SAMPLE_MEDICAL_IMAGES.filter((s) => s.modelType === modelType);

  const handleFile = (file: File) => {
    setCustomImageName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        onSelectImage(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6 font-mono text-xs text-slate-300">
      {/* 1. Model Selection Toggle */}
      <div className="space-y-3">
        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          1. Select Medical Neural Classifier Model Mode
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => onSelectModelType('xray')}
            className={`p-5 rounded-2xl border text-left transition-all flex items-start gap-4 ${
              modelType === 'xray'
                ? 'bg-cyan-500/10 border-cyan-500 text-white shadow-xl shadow-cyan-500/10 ring-1 ring-cyan-500'
                : 'bg-[#090d16] border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-slate-100 text-sm font-outfit">Chest X-Ray Radiography Mode</h4>
                <span className="text-[9px] font-bold text-cyan-400 px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30">
                  DenseNet-121
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Classifies Chest X-Rays: Pneumonia vs. Normal. Trained on Kaggle Chest X-Ray Dataset (5,856 AP/PA scans).
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onSelectModelType('dermatology')}
            className={`p-5 rounded-2xl border text-left transition-all flex items-start gap-4 ${
              modelType === 'dermatology'
                ? 'bg-teal-500/10 border-teal-500 text-white shadow-xl shadow-teal-500/10 ring-1 ring-teal-500'
                : 'bg-[#090d16] border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 shrink-0">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-slate-100 text-sm font-outfit">Dermatology Skin Lesion Mode</h4>
                <span className="text-[9px] font-bold text-teal-400 px-2 py-0.5 rounded-full bg-teal-500/10 border border-teal-500/30">
                  EfficientNet-B0
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Classifies Cutaneous Lesions: Malignant Melanoma vs. Benign Nevus. Trained on ISIC 2020 Dermoscopy Dataset.
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* 2. Drag & Drop Upload */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
        }}
        className={`p-8 rounded-3xl border-2 border-dashed text-center transition-all flex flex-col items-center justify-center gap-3 ${
          dragActive ? 'border-cyan-400 bg-cyan-500/10' : 'border-slate-800 bg-[#090d16] hover:border-slate-700'
        }`}
      >
        <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/10">
          <UploadCloud className="w-6 h-6" />
        </div>

        <div>
          <h3 className="font-bold text-white text-sm font-outfit">Upload Medical Scan (DICOM, JPEG, PNG)</h3>
          <p className="text-slate-400 text-xs mt-1">
            Drag &amp; drop medical image or click to browse. Processing runs 100% client-side.
          </p>
        </div>

        <label className="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400 hover:text-cyan-300 hover:border-cyan-500/40 font-bold transition-all cursor-pointer">
          Browse Image File
          <input
            type="file"
            accept="image/*,.dcm"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            className="hidden"
          />
        </label>

        {customImageName && (
          <p className="text-emerald-400 font-bold text-[11px]">Loaded: {customImageName}</p>
        )}
      </div>

      {/* 3. Sample Image Library */}
      <div className="space-y-3">
        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Or Select Pre-Loaded Benchmark Medical Scans
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filteredSamples.map((sample) => (
            <button
              key={sample.id}
              type="button"
              onClick={() => onSelectImage(sample.imageUrl, sample)}
              disabled={isLoading}
              className="p-4 rounded-2xl bg-[#090d16] border border-slate-800 hover:border-cyan-500/50 text-left transition-all group flex items-start gap-3 disabled:opacity-50"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400 shrink-0 group-hover:scale-105 transition-transform">
                <ImageIcon className="w-5 h-5" />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-100 text-xs font-outfit">{sample.title}</h4>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{sample.description}</p>
                <span className="inline-block text-[9px] font-bold text-cyan-400 mt-1">
                  Ground Truth: {sample.groundTruth}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
