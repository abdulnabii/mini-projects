'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { LegalAnalysis } from '@/types';
import { getAnalysisById } from '@/lib/storage';
import { SAMPLE_CONTRACTS } from '@/lib/sampleContracts';
import RiskMeter from '@/components/RiskMeter';
import DangerousClauseList from '@/components/DangerousClauseList';
import MissingClausesList from '@/components/MissingClausesList';
import SectionBreakdown from '@/components/SectionBreakdown';
import DocumentChat from '@/components/DocumentChat';
import ExportReportModal from '@/components/ExportReportModal';
import {
  ArrowLeft,
  FileText,
  RotateCcw,
  Sparkles,
  Scale,
  Flame,
  ShieldAlert,
  Layers,
  MessageSquare,
  FileCheck,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
} from 'lucide-react';

export default function AnalysisResultPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [analysis, setAnalysis] = useState<LegalAnalysis | null>(null);
  const [activeTab, setActiveTab] = useState<'clauses' | 'missing' | 'sections' | 'chat' | 'raw'>('clauses');
  const [isExportOpen, setIsExportOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    const stored = getAnalysisById(id);
    if (stored) {
      setAnalysis(stored);
    } else {
      const preset = SAMPLE_CONTRACTS.find((p) => p.analysis.id === id);
      if (preset) {
        setAnalysis({ ...preset.analysis, rawText: preset.rawText });
      } else {
        setAnalysis(SAMPLE_CONTRACTS[0].analysis);
      }
    }
  }, [id]);

  if (!analysis) {
    return (
      <div className="p-16 text-center space-y-4 font-mono">
        <div className="w-8 h-8 rounded-full border-2 border-amber-400 border-t-transparent animate-spin mx-auto" />
        <p className="text-sm text-slate-300">Retrieving contract risk analysis...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-mono w-full min-w-0">
      {/* Top Navigation & Action Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Upload Another Contract</span>
        </Link>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setIsExportOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-amber-500/40 text-xs font-bold text-white transition-all cursor-pointer shadow-sm"
          >
            <FileText className="w-4 h-4 text-amber-400" />
            <span>Export Negotiation Brief</span>
          </button>

          <Link
            href="/"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 hover:from-amber-300 hover:to-orange-400 text-black font-extrabold text-xs shadow-lg shadow-amber-500/20 hover:scale-105 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Analyze New Contract</span>
          </Link>
        </div>
      </div>

      {/* Main Results Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0d1117] border border-amber-500/30 shadow-2xl space-y-4 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30 uppercase">
                {analysis.docType}
              </span>
              <span className="text-xs text-slate-400">
                Language: {analysis.language} • {new Date(analysis.createdAt).toLocaleDateString()}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-outfit">
              {analysis.docTitle}
            </h2>
            <p className="text-xs text-slate-300 font-sans max-w-2xl leading-relaxed">
              {analysis.executiveSummary}
            </p>
          </div>

          {/* Quick Counter Stats */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="p-3.5 px-5 rounded-2xl bg-slate-950 border border-slate-800 text-center">
              <span className="text-2xl sm:text-3xl font-black text-rose-400 leading-none">
                {analysis.dangerousClauses.length}
              </span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mt-1">
                Red Flags
              </span>
            </div>

            <div className="p-3.5 px-5 rounded-2xl bg-slate-950 border border-slate-800 text-center">
              <span className="text-2xl sm:text-3xl font-black text-amber-400 leading-none">
                {analysis.missingClauses.length}
              </span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mt-1">
                Missing Clauses
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Overview Grid: RiskMeter + Balanced Pros/Cons */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Risk Meter Gauge */}
        <div className="lg:col-span-1">
          <RiskMeter score={analysis.riskScore} verdict={analysis.riskVerdict} />
        </div>

        {/* Right: Balanced Pros & Red Flag Cons */}
        <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-[#0d1117] border border-slate-800 space-y-5 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white font-outfit flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Contract Balance Assessment</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
              {/* Pros */}
              <div className="p-4 rounded-2xl bg-[#06140e] border border-emerald-500/20 space-y-2">
                <span className="text-emerald-400 font-bold uppercase text-[10px] font-mono flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Balanced / Standard Provisions
                </span>
                <ul className="space-y-1.5 text-slate-200 list-disc list-inside leading-relaxed">
                  {analysis.overallPros.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>

              {/* Cons */}
              <div className="p-4 rounded-2xl bg-[#140608] border border-rose-500/20 space-y-2">
                <span className="text-rose-400 font-bold uppercase text-[10px] font-mono flex items-center gap-1.5">
                  <XCircle className="w-3.5 h-3.5" />
                  One-Sided Risks &amp; Traps
                </span>
                <ul className="space-y-1.5 text-slate-200 list-disc list-inside leading-relaxed">
                  {analysis.overallCons.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#161b22] border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Overall Diagnostic: {analysis.sections.length} sections analyzed</span>
            <span className="text-amber-400 font-bold">Grade 8 Plain English</span>
          </div>
        </div>
      </div>

      {/* Segmented View Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#0d1117] border border-slate-800 text-xs w-fit flex-wrap">
        <button
          onClick={() => setActiveTab('clauses')}
          className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'clauses'
              ? 'bg-amber-500 text-black shadow-md'
              : 'text-slate-300 hover:text-white'
          }`}
        >
          <Flame className="w-3.5 h-3.5 text-rose-500" />
          <span>Dangerous Clauses ({analysis.dangerousClauses.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('missing')}
          className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'missing'
              ? 'bg-amber-500 text-black shadow-md'
              : 'text-slate-300 hover:text-white'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
          <span>Missing Protections ({analysis.missingClauses.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('sections')}
          className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'sections'
              ? 'bg-amber-500 text-black shadow-md'
              : 'text-slate-300 hover:text-white'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span>Section Breakdown ({analysis.sections.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('chat')}
          className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'chat'
              ? 'bg-amber-500 text-black shadow-md'
              : 'text-slate-300 hover:text-white'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Ask Document Q&amp;A</span>
        </button>

        <button
          onClick={() => setActiveTab('raw')}
          className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'raw'
              ? 'bg-amber-500 text-black shadow-md'
              : 'text-slate-300 hover:text-white'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Raw Text</span>
        </button>
      </div>

      {/* Tab 1: Dangerous Clauses */}
      {activeTab === 'clauses' && (
        <div className="animate-in fade-in duration-200">
          <DangerousClauseList clauses={analysis.dangerousClauses} />
        </div>
      )}

      {/* Tab 2: Missing Clauses */}
      {activeTab === 'missing' && (
        <div className="animate-in fade-in duration-200">
          <MissingClausesList missing={analysis.missingClauses} />
        </div>
      )}

      {/* Tab 3: Section Breakdown */}
      {activeTab === 'sections' && (
        <div className="animate-in fade-in duration-200">
          <SectionBreakdown sections={analysis.sections} />
        </div>
      )}

      {/* Tab 4: Document Chat */}
      {activeTab === 'chat' && (
        <div className="animate-in fade-in duration-200">
          <DocumentChat docText={analysis.rawText} docTitle={analysis.docTitle} />
        </div>
      )}

      {/* Tab 5: Raw Text View */}
      {activeTab === 'raw' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0d1117] border border-slate-800 space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="font-bold text-slate-300">Original Document Content</span>
            <span className="text-slate-500">{analysis.rawText.length} characters</span>
          </div>
          <pre className="p-4 rounded-2xl bg-[#161b22] border border-slate-800 text-slate-300 whitespace-pre-wrap leading-relaxed max-h-[600px] overflow-y-auto">
            {analysis.rawText || 'No raw document text available for this preset.'}
          </pre>
        </div>
      )}

      {/* Export Report Modal */}
      <ExportReportModal
        analysis={analysis}
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />
    </div>
  );
}
