'use client';

import { TypographyPairing } from '@/types';
import { Type, Sparkles } from 'lucide-react';

interface Props {
  typography: TypographyPairing;
  companyName: string;
}

export default function TypographyPreview({ typography, companyName }: Props) {
  return (
    <div className="bg-[#111827] border border-amber-500/20 rounded-3xl p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold font-outfit text-white flex items-center gap-2">
            <Type className="w-5 h-5 text-amber-400" />
            Curated Typography Pairings
          </h3>
          <p className="text-xs text-slate-400 font-mono mt-1">{typography.rationale}</p>
        </div>
        <div className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono">
          Google Fonts API
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Heading Font Card */}
        <div className="bg-[#0a0d14] border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between text-xs font-mono border-b border-slate-800 pb-3">
            <span className="text-amber-400 font-bold uppercase tracking-wider">Heading Display Font</span>
            <span className="text-slate-400">{typography.headingCategory}</span>
          </div>

          <div>
            <span className="text-sm font-bold text-white font-mono block">{typography.headingFont}</span>
            <span className="text-[11px] text-slate-500 font-mono">Recommended Weights: 600, 700 Bold</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
            <span className="text-3xl font-bold text-white tracking-tight block">
              {companyName}
            </span>
            <span className="text-sm text-slate-300 block">
              Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm Nn Oo Pp Qq Rr Ss Tt Uu Vv Ww Xx Yy Zz
            </span>
          </div>
        </div>

        {/* Body Font Card */}
        <div className="bg-[#0a0d14] border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between text-xs font-mono border-b border-slate-800 pb-3">
            <span className="text-amber-400 font-bold uppercase tracking-wider">Body Copy Font</span>
            <span className="text-slate-400">{typography.bodyCategory}</span>
          </div>

          <div>
            <span className="text-sm font-bold text-white font-mono block">{typography.bodyFont}</span>
            <span className="text-[11px] text-slate-500 font-mono">Recommended Weights: 400 Regular, 500 Medium</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2 text-xs text-slate-300 leading-relaxed">
            <p className="font-medium text-white">
              Building memorable digital experiences with precision typography.
            </p>
            <p className="text-slate-400 text-[11px]">
              0123456789 • !@#$%^&*()_+-=[]{}|;:&apos;&quot;,&lt;.&gt;?/
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
