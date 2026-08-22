'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { LegalAnalysis } from '@/types';
import { getStoredAnalyses, deleteAnalysisFromStorage } from '@/lib/storage';
import {
  Scale,
  History,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Flame,
  Search,
  FileText,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';

export default function HistoryPage() {
  const [analyses, setAnalyses] = useState<LegalAnalysis[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setAnalyses(getStoredAnalyses());
  }, []);

  const handleDelete = (id: string) => {
    const updated = deleteAnalysisFromStorage(id);
    setAnalyses(updated);
  };

  const filtered = analyses.filter(
    (a) =>
      a.docTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.docType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 font-mono w-full min-w-0">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0d1117] border border-amber-500/30 shadow-2xl space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs">
          <History className="w-3.5 h-3.5" />
          <span>CONTRACT RISK ARCHIVE</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-outfit">
              Analyzed Documents History
            </h2>
            <p className="text-xs text-slate-400">
              Audit trail of previous contract reviews, risk ratings, and counter-proposals
            </p>
          </div>

          <Link
            href="/"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-black font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 w-fit"
          >
            <FileText className="w-4 h-4" />
            <span>Upload New Contract</span>
          </Link>
        </div>
      </div>

      {/* Search Filter */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search contracts by title or type..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0d1117] border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
        />
      </div>

      {/* Contract List */}
      {filtered.length === 0 ? (
        <div className="p-12 rounded-3xl bg-[#0d1117] border border-slate-800 text-center space-y-3">
          <Scale className="w-8 h-8 text-slate-600 mx-auto" />
          <h4 className="font-bold text-white text-base">No Contract Analyses Found</h4>
          <p className="text-xs text-slate-400">
            {searchTerm ? 'No results matched your search term.' : 'Upload and analyze a contract to start building your history.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-[#0d1117] border border-slate-800 hover:border-amber-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg"
            >
              <div className="space-y-1.5 min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 text-[10px] font-bold border border-amber-500/20">
                    {item.docType}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <h4 className="font-bold text-white text-base font-outfit truncate">{item.docTitle}</h4>
                <p className="text-xs text-slate-400 line-clamp-1">{item.executiveSummary}</p>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                {/* Risk Badge */}
                <div className="text-right">
                  <div
                    className={`text-lg font-black ${
                      item.riskScore > 65
                        ? 'text-rose-400'
                        : item.riskScore > 35
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    {item.riskScore} <span className="text-[10px] font-normal text-slate-500">/100</span>
                  </div>
                  <span className="text-[10px] text-slate-400 block">{item.dangerousClauses.length} red flags</span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Link
                    href={`/analyze/${item.id}`}
                    className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-amber-300 text-xs font-bold transition-all flex items-center gap-1"
                  >
                    <span>View</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-500 hover:text-rose-400 transition-all cursor-pointer"
                    title="Delete record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
