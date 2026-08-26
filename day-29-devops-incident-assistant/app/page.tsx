'use client';

import { useState, useEffect } from 'react';
import { Incident, LogEntry, PostMortem, RootCauseDiagnosis, StakeholderComms } from '@/types';
import { SAMPLE_INCIDENTS } from '@/lib/sampleIncidents';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import IncidentHeader from '@/components/IncidentHeader';
import LogViewer from '@/components/LogViewer';
import RootCausePanel from '@/components/RootCausePanel';
import RunbookChecklist from '@/components/RunbookChecklist';
import DeploymentRadar from '@/components/DeploymentRadar';
import StakeholderCommsPanel from '@/components/StakeholderComms';
import PostMortemModal from '@/components/PostMortemModal';
import { Activity, ShieldAlert, Sparkles, Terminal, FileText, CheckCircle2 } from 'lucide-react';

export default function HomePage() {
  const [incidents, setIncidents] = useState<Incident[]>(SAMPLE_INCIDENTS);
  const [activeIncident, setActiveIncident] = useState<Incident>(SAMPLE_INCIDENTS[0]);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingComms, setIsGeneratingComms] = useState(false);
  const [isGeneratingPostMortem, setIsGeneratingPostMortem] = useState(false);

  const [postMortem, setPostMortem] = useState<PostMortem | null>(null);
  const [showPostMortemModal, setShowPostMortemModal] = useState(false);

  // Trigger Gemini Root Cause Diagnosis
  const handleRediagnose = async () => {
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceName: activeIncident.service,
          logs: activeIncident.logs,
          recentDeployments: activeIncident.recentDeployments,
        }),
      });

      const data = await res.json();
      if (data.diagnosis) {
        const updated = { ...activeIncident, diagnosis: data.diagnosis };
        setActiveIncident(updated);
        setIncidents((prev) => prev.map((inc) => (inc.id === updated.id ? updated : inc)));
      }
    } catch (err) {
      console.error('Diagnosis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Regenerate Stakeholder Comms
  const handleRegenerateComms = async () => {
    setIsGeneratingComms(true);
    try {
      const res = await fetch('/api/comms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceName: activeIncident.service,
          severity: activeIncident.severity,
          diagnosis: activeIncident.diagnosis,
        }),
      });

      const data = await res.json();
      if (data.comms) {
        const updated = { ...activeIncident, comms: data.comms };
        setActiveIncident(updated);
        setIncidents((prev) => prev.map((inc) => (inc.id === updated.id ? updated : inc)));
      }
    } catch (err) {
      console.error('Comms error:', err);
    } finally {
      setIsGeneratingComms(false);
    }
  };

  // Open Post-Mortem Generator Modal
  const handleOpenPostMortem = async () => {
    setIsGeneratingPostMortem(true);
    try {
      const res = await fetch('/api/postmortem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          incidentId: activeIncident.id,
          title: activeIncident.title,
          service: activeIncident.service,
          severity: activeIncident.severity,
          diagnosis: activeIncident.diagnosis,
        }),
      });

      const data = await res.json();
      if (data.postMortem) {
        setPostMortem(data.postMortem);
        setShowPostMortemModal(true);
      }
    } catch (err) {
      console.error('Post-mortem error:', err);
    } finally {
      setIsGeneratingPostMortem(false);
    }
  };

  // Ingest custom logs
  const handleAddCustomLogs = (rawText: string) => {
    const lines = rawText.split('\n').filter((l) => l.trim().length > 0);
    const newLogs: LogEntry[] = lines.map((line, idx) => {
      const isFatal = line.includes('FATAL') || line.includes('503') || line.includes('OOM');
      const isError = line.includes('ERROR') || line.includes('Exception') || line.includes('fail');
      const isWarn = line.includes('WARN') || line.includes('latency');

      return {
        id: `custom-log-${Date.now()}-${idx}`,
        timestamp: new Date().toLocaleTimeString(),
        level: isFatal ? 'FATAL' : isError ? 'ERROR' : isWarn ? 'WARN' : 'INFO',
        service: activeIncident.service,
        message: line,
      };
    });

    const updated = { ...activeIncident, logs: [...newLogs, ...activeIncident.logs] };
    setActiveIncident(updated);
    setIncidents((prev) => prev.map((inc) => (inc.id === updated.id ? updated : inc)));
    handleRediagnose();
  };

  return (
    <div className="flex flex-col min-h-screen font-mono">
      <Navbar
        activeSeverity={activeIncident.severity}
        serviceName={activeIncident.service}
        incidentId={activeIncident.id}
      />

      <main className="flex-1 space-y-6 py-6 px-3 sm:px-6 max-w-7xl mx-auto w-full">
        {/* Centered Hero Header */}
        <section className="text-center space-y-2.5 max-w-3xl mx-auto pt-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono font-bold">
            <Activity className="w-3.5 h-3.5" />
            <span>AI SITE RELIABILITY &amp; INCIDENT TRIAGE TERMINAL</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight font-mono">
            Autonomous SRE Incident{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-amber-400 to-emerald-400">
              Response Command Center
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-400 font-mono max-w-2xl mx-auto leading-relaxed prose-text">
            Ingest live error logs, correlate failures with recent Git releases, diagnose root cause in seconds with Gemini 1.5 Flash, execute automated runbooks, and generate 5-Whys post-mortems.
          </p>
        </section>

        {/* Live Incident Telemetry & Preset Switcher */}
        <IncidentHeader
          incident={activeIncident}
          allIncidents={incidents}
          onSelectIncident={setActiveIncident}
          onRediagnose={handleRediagnose}
          isAnalyzing={isAnalyzing}
          onOpenPostMortem={handleOpenPostMortem}
        />

        {/* 2-Column SRE War-Room Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left Column: Log Stream & Deployment Correlation Radar (6 cols) */}
          <div className="lg:col-span-6 space-y-5">
            <LogViewer logs={activeIncident.logs} onAddCustomLogs={handleAddCustomLogs} />
            <DeploymentRadar deployments={activeIncident.recentDeployments} />
          </div>

          {/* Right Column: AI Diagnosis, Remediation Runbook & Stakeholder Comms (6 cols) */}
          <div className="lg:col-span-6 space-y-5">
            <RootCausePanel diagnosis={activeIncident.diagnosis} isAnalyzing={isAnalyzing} />
            <RunbookChecklist
              steps={activeIncident.diagnosis.remediationSteps}
              serviceName={activeIncident.service}
            />
            <StakeholderCommsPanel
              comms={activeIncident.comms}
              onRegenerateComms={handleRegenerateComms}
              isGenerating={isGeneratingComms}
            />
          </div>
        </div>
      </main>

      <Footer />

      {/* Post-Mortem Generator Modal */}
      {postMortem && (
        <PostMortemModal
          postMortem={postMortem}
          isOpen={showPostMortemModal}
          onClose={() => setShowPostMortemModal(false)}
        />
      )}
    </div>
  );
}
