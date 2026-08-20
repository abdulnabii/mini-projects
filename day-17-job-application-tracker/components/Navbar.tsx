'use client';

import Link from 'next/link';
import { Briefcase, BarChart3, FileUser, Plus, Sparkles } from 'lucide-react';

interface Props {
  onOpenAddModal: () => void;
  onOpenResumeModal: () => void;
  totalJobsCount: number;
}

export default function Navbar({ onOpenAddModal, onOpenResumeModal, totalJobsCount }: Props) {
  return (
    <header className="sticky top-0 z-50 border-b border-emerald-500/20 bg-[#060a12]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6">
        {/* Brand Identity */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 via-teal-500 to-indigo-600 text-black shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-all">
            <Briefcase className="h-5.5 w-5.5 text-black font-bold" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight text-white font-outfit">
                CareerFlow<span className="text-emerald-400">.AI</span>
              </span>
              <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30 font-mono">
                AI JOB PIPELINE &amp; MATCH STUDIO
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Smart Kanban Pipeline, AI Resume Fit Scoring &amp; Interview Intelligence
            </p>
          </div>
        </Link>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 font-mono text-xs">
          <button
            type="button"
            onClick={onOpenResumeModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-emerald-500/40 transition-all font-bold cursor-pointer"
          >
            <FileUser className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">My Resume Profile</span>
          </button>

          <Link
            href="/analytics"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-emerald-500/40 transition-all font-bold"
          >
            <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Funnel Analytics</span>
          </Link>

          <button
            type="button"
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 text-black font-bold text-xs shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all cursor-pointer font-outfit"
          >
            <Plus className="w-4 h-4" />
            <span>Add Job</span>
          </button>
        </div>
      </div>
    </header>
  );
}
