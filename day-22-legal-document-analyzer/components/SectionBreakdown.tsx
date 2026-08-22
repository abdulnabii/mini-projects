'use client';

import { useState } from 'react';
import { SectionAnalysis } from '@/types';
import { ChevronDown, ChevronUp, Layers, CheckCircle2, AlertTriangle, AlertOctagon } from 'lucide-react';

interface Props {
  sections: SectionAnalysis[];
}

export default function SectionBreakdown({ sections }: Props) {
  const [openIds, setOpenIds] = useState<string[]>(sections.map((s) => s.id));

  const toggleSection = (id: string) => {
    if (openIds.includes(id)) {
      setOpenIds(openIds.filter((i) => i !== id));
    } else {
      setOpenIds([...openIds, id]);
    }
  };

  const getRiskBadge = (level: 'LOW' | 'MEDIUM' | 'HIGH') => {
    if (level === 'LOW') {
      return {
        bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
        icon: CheckCircle2,
      };
    }
    if (level === 'MEDIUM') {
      return {
        bg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        icon: AlertTriangle,
      };
    }
    return {
      bg: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      icon: AlertOctagon,
    };
  };

  return (
    <div className="space-y-4 font-mono">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-white font-outfit flex items-center gap-2">
          <Layers className="w-5 h-5 text-cyan-400" />
          <span>Section-by-Section Plain English ({sections.length})</span>
        </h3>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setOpenIds(sections.map((s) => s.id))}
            className="text-slate-400 hover:text-white underline cursor-pointer"
          >
            Expand All
          </button>
          <span className="text-slate-600">|</span>
          <button
            onClick={() => setOpenIds([])}
            className="text-slate-400 hover:text-white underline cursor-pointer"
          >
            Collapse All
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {sections.map((sec, idx) => {
          const isOpen = openIds.includes(sec.id);
          const badge = getRiskBadge(sec.riskLevel);
          const Icon = badge.icon;

          return (
            <div
              key={sec.id || idx}
              className="rounded-2xl bg-[#0d1117] border border-slate-800 overflow-hidden transition-all shadow-md"
            >
              <button
                type="button"
                onClick={() => toggleSection(sec.id)}
                className="w-full p-4.5 flex items-center justify-between gap-4 text-left hover:bg-white/5 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase border flex items-center gap-1 ${badge.bg}`}>
                    <Icon className="w-3 h-3" />
                    <span>{sec.riskLevel}</span>
                  </span>
                  <h4 className="font-bold text-white text-sm font-outfit">{sec.title}</h4>
                </div>

                <div className="text-slate-400">
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {isOpen && (
                <div className="p-5 pt-0 space-y-3 border-t border-slate-800/60 font-sans text-xs">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                      Plain-English Explanation:
                    </span>
                    <p className="text-slate-200 leading-relaxed text-sm">{sec.plainEnglish}</p>
                  </div>

                  {sec.keyTakeaway && (
                    <div className="p-3 rounded-xl bg-[#161b22] border border-slate-800 text-xs font-mono text-cyan-300">
                      <strong className="text-white">Takeaway:</strong> {sec.keyTakeaway}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
