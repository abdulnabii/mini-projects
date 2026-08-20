'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getStoredJobs, getStoredResume } from '@/lib/storage';
import { JobApplication, ResumeProfile } from '@/types';
import Link from 'next/link';
import {
  BarChart3,
  ArrowLeft,
  Briefcase,
  TrendingUp,
  Award,
  DollarSign,
  Download,
  CheckCircle2,
  PieChart,
  Calendar,
} from 'lucide-react';

export default function AnalyticsPage() {
  const [jobs, setJobs] = useState<JobApplication[]>([]);
  const [resume, setResume] = useState<ResumeProfile>(getStoredResume());

  useEffect(() => {
    setJobs(getStoredJobs());
  }, []);

  const total = jobs.length || 1;
  const appliedCount = jobs.filter((j) => j.stage !== 'wishlist' && j.stage !== 'archived').length;
  const screeningCount = jobs.filter((j) => ['screening', 'technical', 'final', 'offer'].includes(j.stage)).length;
  const techCount = jobs.filter((j) => ['technical', 'final', 'offer'].includes(j.stage)).length;
  const finalCount = jobs.filter((j) => ['final', 'offer'].includes(j.stage)).length;
  const offerCount = jobs.filter((j) => j.stage === 'offer').length;

  const screenRate = appliedCount > 0 ? Math.round((screeningCount / appliedCount) * 100) : 0;
  const techRate = screeningCount > 0 ? Math.round((techCount / screeningCount) * 100) : 0;
  const offerRate = appliedCount > 0 ? Math.round((offerCount / appliedCount) * 100) : 0;

  // Average Match Score
  const scoredJobs = jobs.filter((j) => j.matchResult?.matchScore);
  const avgMatchScore =
    scoredJobs.length > 0
      ? Math.round(scoredJobs.reduce((acc, j) => acc + (j.matchResult?.matchScore || 0), 0) / scoredJobs.length)
      : 88;

  const handleExportCSV = () => {
    const headers = ['Company', 'Role', 'Location', 'Workplace', 'Salary', 'Stage', 'Priority', 'Match %', 'Applied Date'];
    const rows = jobs.map((j) => [
      `"${j.companyName}"`,
      `"${j.roleTitle}"`,
      `"${j.location}"`,
      `"${j.workplaceType}"`,
      `"${j.salaryRange}"`,
      `"${j.stage}"`,
      `"${j.priority}"`,
      `"${j.matchResult?.matchScore || 'N/A'}"`,
      `"${j.appliedDate}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `careerflow-applications-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#060a12] text-slate-200 selection:bg-emerald-500/30 selection:text-white">
      <Navbar onOpenAddModal={() => {}} onOpenResumeModal={() => {}} totalJobsCount={jobs.length} />

      <main className="flex-1 space-y-8 py-8 px-4 sm:px-6 max-w-7xl mx-auto w-full font-mono text-xs">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white hover:border-emerald-500/40 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Kanban Pipeline</span>
          </Link>

          <button
            type="button"
            onClick={handleExportCSV}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 text-black font-bold flex items-center gap-2 shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all cursor-pointer font-outfit"
          >
            <Download className="w-4 h-4" />
            <span>Export Pipeline to CSV</span>
          </button>
        </div>

        {/* Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>CAREER INTELLIGENCE &amp; PIPELINE METRICS</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white font-outfit">
            Application Funnel &amp; Response Analytics
          </h1>
          <p className="text-sm text-slate-400 font-sans max-w-2xl">
            Real-time conversion metrics tracking your interview progression, resume fit accuracy, and salary benchmarks.
          </p>
        </div>

        {/* Top KPIs Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-[#0b1220] border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Active Applications</span>
            <p className="text-3xl font-black text-white font-outfit">{jobs.length}</p>
            <span className="text-[10px] text-emerald-400 font-bold">Across 7 pipeline stages</span>
          </div>

          <div className="p-5 rounded-3xl bg-[#0b1220] border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Screening Pass Rate</span>
            <p className="text-3xl font-black text-cyan-400 font-outfit">{screenRate}%</p>
            <span className="text-[10px] text-slate-400 font-sans">Applied &rarr; Screen conversion</span>
          </div>

          <div className="p-5 rounded-3xl bg-[#0b1220] border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Tech Round Advance</span>
            <p className="text-3xl font-black text-purple-400 font-outfit">{techRate}%</p>
            <span className="text-[10px] text-slate-400 font-sans">Screen &rarr; Technical round</span>
          </div>

          <div className="p-5 rounded-3xl bg-[#0b1220] border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Avg Resume Fit Score</span>
            <p className="text-3xl font-black text-emerald-400 font-outfit">{avgMatchScore}%</p>
            <span className="text-[10px] text-emerald-400/80 font-sans">Strong technical alignment</span>
          </div>
        </div>

        {/* Visual Conversion Funnel Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0b1220] border border-slate-800 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-white text-base font-outfit flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              Stage-by-Stage Application Conversion Funnel
            </h3>
            <span className="text-[10px] text-slate-500">Pipeline Velocity</span>
          </div>

          <div className="space-y-4">
            {[
              { label: 'Total Submitted Applications', count: appliedCount, color: 'bg-sky-500', width: '100%' },
              {
                label: 'Passed Initial Recruiter Screen',
                count: screeningCount,
                color: 'bg-cyan-500',
                width: `${Math.max(25, screenRate)}%`,
              },
              {
                label: 'Invited to Technical Coding / System Design',
                count: techCount,
                color: 'bg-purple-500',
                width: `${Math.max(20, Math.round((techCount / appliedCount) * 100))}%`,
              },
              {
                label: 'Advanced to Final Leadership Rounds',
                count: finalCount,
                color: 'bg-amber-500',
                width: `${Math.max(15, Math.round((finalCount / appliedCount) * 100))}%`,
              },
              {
                label: 'Offers Extended & Negotiated',
                count: offerCount,
                color: 'bg-emerald-500',
                width: `${Math.max(10, Math.round((offerCount / appliedCount) * 100))}%`,
              },
            ].map((stage, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">{stage.label}</span>
                  <span className="font-bold font-mono text-emerald-400">
                    {stage.count} ({Math.round((stage.count / (appliedCount || 1)) * 100)}%)
                  </span>
                </div>

                <div className="w-full h-3 rounded-full bg-slate-950 border border-slate-800 overflow-hidden">
                  <div
                    className={`h-full ${stage.color} rounded-full transition-all duration-500`}
                    style={{ width: stage.width }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
