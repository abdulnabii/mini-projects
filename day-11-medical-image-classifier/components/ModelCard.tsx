'use client';

import { ModelType } from '@/types';
import { Cpu, Database, Award, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface Props {
  modelType: ModelType;
}

export default function ModelCard({ modelType }: Props) {
  const isXray = modelType === 'xray';

  return (
    <div className="bg-[#090d16] border border-cyan-500/30 rounded-3xl p-6 sm:p-8 space-y-5 font-mono text-xs text-slate-300 shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base font-outfit">
              {isXray ? 'CheXNet DenseNet-121 Model Card' : 'DermNet EfficientNet-B0 Model Card'}
            </h3>
            <p className="text-xs text-slate-400">Convolutional Neural Network Architecture Specifications</p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] font-bold">
          TensorFlow.js WebGL
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
          <span className="text-slate-400 text-[10px] font-bold uppercase">Training Dataset</span>
          <p className="font-bold text-white text-sm font-outfit">
            {isXray ? 'Kaggle Chest X-Ray (5,856 images)' : 'ISIC 2020 Dermoscopy (33,126 images)'}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
          <span className="text-slate-400 text-[10px] font-bold uppercase">Test Accuracy</span>
          <p className="font-bold text-emerald-400 text-sm font-outfit">{isXray ? '94.2%' : '92.8%'}</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
          <span className="text-slate-400 text-[10px] font-bold uppercase">AUC-ROC Metric</span>
          <p className="font-bold text-cyan-400 text-sm font-outfit">{isXray ? '0.978' : '0.965'}</p>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 space-y-2 leading-relaxed">
        <strong className="text-slate-200 font-bold block">Known Model Limitations:</strong>
        <p>
          {isXray
            ? 'Model performance is optimized for pediatric and adult anterior-posterior (AP/PA) view chest radiographs. High false-positive rates may occur with severe motion artifacts or patient hardware.'
            : 'Model performance is calibrated for polarized dermoscopic skin lesion images. Non-dermoscopic smartphone camera photos may yield reduced accuracy.'}
        </p>
      </div>
    </div>
  );
}
