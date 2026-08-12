'use client';

import { LanguageStat } from '@/types';
import { Code2, Dna } from 'lucide-react';

interface Props {
  languages: LanguageStat[];
}

export default function LanguageRadar({ languages }: Props) {
  return (
    <div className="bg-[#161b22] border border-emerald-500/20 rounded-3xl p-6 space-y-5 font-mono">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Dna className="w-4 h-4 text-emerald-400" />
          Language DNA Distribution
        </h3>
        <span className="text-xs text-slate-400">{languages.length} Primary Languages</span>
      </div>

      <div className="space-y-4">
        {languages.map((lang) => (
          <div key={lang.language} className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: lang.color }} />
                <span className="font-bold text-white">{lang.language}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-slate-400 text-[10px] tabular-nums">{(lang.bytes / 1000).toFixed(0)} KB</span>
                <span className="font-bold text-emerald-400 tabular-nums">{lang.percentage}%</span>
              </div>
            </div>

            <div className="w-full h-2.5 bg-[#0d1117] rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${lang.percentage}%`, backgroundColor: lang.color }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
