'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DocType, SupportedLanguage, LegalAnalysis } from '@/types';
import DocumentUpload from '@/components/DocumentUpload';
import AEOFAQSection from '@/components/AEOFAQSection';
import { saveAnalysisToStorage } from '@/lib/storage';
import {
  Scale,
  Sparkles,
  ShieldAlert,
  Flame,
  MessageSquare,
  GitCompare,
  FileCheck,
  Award,
} from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = async (
    text: string,
    docType: DocType,
    title: string,
    language: SupportedLanguage,
    sampleId?: string
  ) => {
    setIsLoading(true);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          docType,
          docTitle: title,
          language,
          sampleId,
        }),
      });

      const analysis: LegalAnalysis = await res.json();
      saveAnalysisToStorage(analysis);
      router.push(`/analyze/${analysis.id}`);
    } catch (e) {
      console.error('Analysis failed:', e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-10 font-mono w-full min-w-0">
      {/* Header Title (Project 9/10 Style) */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI LEGAL INTELLIGENCE &amp; RISK MITIGATION</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight font-outfit">
          Analyze Any Contract &amp;{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-rose-400">
            Uncover Hidden Risks
          </span>
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm font-mono max-w-2xl mx-auto leading-relaxed">
          Upload NDAs, employment contracts, leases, or vendor agreements. Instantly calculate a 0–100 Risk Score, flag predatory clauses with counter-proposals, and chat with your document in plain English.
        </p>
      </div>

      {/* 4 Feature Metric Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 max-w-5xl mx-auto font-mono text-left">
        <div className="p-4 rounded-2xl bg-[#0d1117] border border-amber-500/20 space-y-1 shadow-lg">
          <span className="text-[10px] text-amber-400 font-bold uppercase flex items-center gap-1.5">
            <Scale className="w-3.5 h-3.5" /> 0–100 Risk Meter
          </span>
          <div className="text-lg font-black text-white font-outfit">Severity Index</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0d1117] border border-rose-500/20 space-y-1 shadow-lg">
          <span className="text-[10px] text-rose-400 font-bold uppercase flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5" /> Dangerous Clauses
          </span>
          <div className="text-lg font-black text-rose-300 font-outfit">Counter-Proposals</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0d1117] border border-cyan-500/20 space-y-1 shadow-lg">
          <span className="text-[10px] text-cyan-400 font-bold uppercase flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5" /> Document Q&amp;A
          </span>
          <div className="text-lg font-black text-cyan-300 font-outfit">Gemini 1.5 Pro</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0d1117] border border-emerald-500/20 space-y-1 shadow-lg">
          <span className="text-[10px] text-emerald-400 font-bold uppercase flex items-center gap-1.5">
            <GitCompare className="w-3.5 h-3.5" /> Redline Diff
          </span>
          <div className="text-lg font-black text-emerald-300 font-outfit">Version Compare</div>
        </div>
      </div>

      {/* Main Document Upload Studio */}
      <DocumentUpload onAnalyze={handleAnalyze} isLoading={isLoading} />

      {/* Crawlable AEO & SEO Knowledge Hub Section */}
      <AEOFAQSection />
    </div>
  );
}
