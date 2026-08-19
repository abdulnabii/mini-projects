'use client';

import { useState, useEffect } from 'react';
import { ArchitectureDesignResult, CloudProvider, ArchitectureScale } from '@/types';
import { INITIAL_SAMPLE_RESULT } from '@/lib/sampleArchitectures';
import { generateClientFallbackArchitecture } from '@/lib/architectEngine';
import { getStoredArchitectures, saveArchitectureToStorage } from '@/lib/storage';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ArchitectureInput from '@/components/ArchitectureInput';
import VisualDiagramCanvas from '@/components/VisualDiagramCanvas';
import CostEstimatorCard from '@/components/CostEstimatorCard';
import SPOFAuditCard from '@/components/SPOFAuditCard';
import IaCCodeStudio from '@/components/IaCCodeStudio';
import SpecExportModal from '@/components/SpecExportModal';
import confetti from 'canvas-confetti';
import { Cloud, Sparkles, Server, FileText, Download, ShieldCheck, Activity } from 'lucide-react';

export default function HomePage() {
  const [architecture, setArchitecture] = useState<ArchitectureDesignResult | null>(INITIAL_SAMPLE_RESULT);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const history = getStoredArchitectures();
    if (history.length > 0) {
      setArchitecture(history[0]);
    }
  }, []);

  const handleGenerate = async (
    requirements: string,
    provider: CloudProvider,
    scale: ArchitectureScale
  ) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/architect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requirements, provider, scale }),
      });

      const data: ArchitectureDesignResult = await res.json();
      setArchitecture(data);
      saveArchitectureToStorage(data);

      if (data.spofAudit?.overallReliabilityScore >= 90) {
        try {
          confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
        } catch (e) {}
      }

      // Smooth scroll to architecture results
      setTimeout(() => {
        document.getElementById('architecture-results-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      console.error('Architecture generation failed, using fallback engine:', err);
      const fallback = generateClientFallbackArchitecture(requirements, provider, scale);
      setArchitecture(fallback);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#060a12] text-slate-200 selection:bg-cyan-500/30 selection:text-white">
      <Navbar />

      <main className="flex-1 space-y-10 py-8 px-4 sm:px-6 max-w-7xl mx-auto w-full">
        {/* Hero Section */}
        <section className="text-center space-y-4 max-w-3xl mx-auto pt-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold">
            <Cloud className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>AI CLOUD ARCHITECT &amp; SYSTEM DESIGN STUDIO</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-outfit">
            Transform Product Requirements into <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-400 bg-clip-text text-transparent">
              Production Cloud Architecture &amp; IaC
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-400 font-mono max-w-2xl mx-auto leading-relaxed">
            Generate visual cloud diagrams, monthly AWS/GCP cost estimations, Single Point of Failure (SPOF) reliability audits, and copy-ready Terraform infrastructure code in seconds.
          </p>
        </section>

        {/* Input Workbench */}
        <section className="rounded-3xl bg-[#0b1220] border border-cyan-500/30 p-6 sm:p-8 shadow-2xl shadow-cyan-500/10">
          <ArchitectureInput onGenerate={handleGenerate} isLoading={isLoading} />
        </section>

        {/* Results Section */}
        {architecture && (
          <section id="architecture-results-section" className="space-y-8 animate-in fade-in duration-500">
            {/* Quick Export & Action Bar */}
            <div className="flex items-center justify-between flex-wrap gap-4 p-4 rounded-2xl bg-[#0b1220] border border-slate-800 font-mono text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-bold">Active System:</span>
                <span className="text-white font-bold font-outfit text-sm">{architecture.title}</span>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-bold border border-cyan-500/30">
                  {architecture.targetProvider} • {architecture.targetScale}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsExportModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 text-black font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-cyan-500/20 hover:scale-105 cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span>Export System Spec Report</span>
                </button>
              </div>
            </div>

            {/* 1. Visual Multi-Tier Diagram Canvas */}
            <VisualDiagramCanvas architecture={architecture} />

            {/* 2. Grid: Cost Estimator & Reliability Matrix */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              <CostEstimatorCard
                costBreakdown={architecture.costBreakdown}
                provider={architecture.targetProvider}
              />
              <SPOFAuditCard spofAudit={architecture.spofAudit} />
            </div>

            {/* 3. Infrastructure as Code (IaC) Studio */}
            <IaCCodeStudio architecture={architecture} />
          </section>
        )}
      </main>

      {/* System Design Spec Export Modal */}
      {architecture && (
        <SpecExportModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          architecture={architecture}
        />
      )}

      <Footer />
    </div>
  );
}
