'use client';

import { useState } from 'react';
import { MetaAuditMetric } from '@/types';
import { Globe, Monitor, Smartphone, CheckCircle2, AlertTriangle } from 'lucide-react';

interface Props {
  meta: MetaAuditMetric;
}

export default function SERPPreviewCard({ meta }: Props) {
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');

  return (
    <div className="bg-[#0e1424] border border-emerald-500/30 rounded-3xl p-6 sm:p-8 space-y-6 font-mono text-xs text-slate-300 shadow-xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base font-outfit">Google Search Snippet (SERP) Preview</h3>
            <p className="text-xs text-slate-400">Pixel-accurate simulator for Google organic search results</p>
          </div>
        </div>

        {/* Device View Toggle */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => setDevice('desktop')}
            className={`px-3 py-1 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              device === 'desktop' ? 'bg-emerald-500 text-black shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Desktop</span>
          </button>
          <button
            type="button"
            onClick={() => setDevice('mobile')}
            className={`px-3 py-1 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              device === 'mobile' ? 'bg-emerald-500 text-black shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile</span>
          </button>
        </div>
      </div>

      {/* Google Snippet Simulator Box */}
      <div
        className={`p-5 rounded-2xl bg-[#202124] border border-slate-800 text-left transition-all ${
          device === 'mobile' ? 'max-w-md mx-auto shadow-2xl' : 'w-full'
        }`}
      >
        {/* URL Path */}
        <div className="flex items-center gap-2 mb-1.5 font-sans">
          <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-[10px] text-black font-bold">
            G
          </div>
          <span className="text-[12px] text-[#bdc1c6] truncate">
            https://yourwebsite.com &gt; blog &gt; article
          </span>
        </div>

        {/* Title */}
        <h4 className="text-[#8ab4f8] hover:underline text-base sm:text-lg font-sans font-medium cursor-pointer line-clamp-1">
          {meta.title}
        </h4>

        {/* Meta Description */}
        <p className="text-[#bdc1c6] text-xs sm:text-sm font-sans mt-1 line-clamp-2 leading-relaxed">
          {meta.description || 'No meta description provided. Google will auto-generate a snippet from body content.'}
        </p>
      </div>

      {/* Length & Keyword Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-slate-400 text-[10px] font-bold uppercase">Title Length</span>
            <p className="font-bold text-white text-xs mt-0.5">{meta.titleLength} / 60 chars</p>
          </div>
          <span
            className={`text-[10px] font-bold ${
              meta.hasKeywordInTitle ? 'text-emerald-400' : 'text-amber-400'
            }`}
          >
            {meta.hasKeywordInTitle ? 'Keyword Present' : 'Keyword Missing'}
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-slate-400 text-[10px] font-bold uppercase">Meta Description Length</span>
            <p className="font-bold text-white text-xs mt-0.5">{meta.descriptionLength} / 160 chars</p>
          </div>
          <span
            className={`text-[10px] font-bold ${
              meta.hasKeywordInDescription ? 'text-emerald-400' : 'text-amber-400'
            }`}
          >
            {meta.hasKeywordInDescription ? 'Keyword Present' : 'Keyword Missing'}
          </span>
        </div>
      </div>
    </div>
  );
}
