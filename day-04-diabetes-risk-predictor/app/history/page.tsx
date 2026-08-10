'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { RiskSession } from '@/types';
import { getSavedRiskSessions, deleteRiskSession, clearAllRiskSessions } from '@/lib/storage';
import RiskGauge from '@/components/RiskGauge';
import SHAPChart from '@/components/SHAPChart';
import RecommendationCard from '@/components/RecommendationCard';
import {
  History,
  Trash2,
  Calendar,
  Activity,
  Search,
  Printer,
  X,
  ChevronRight,
} from 'lucide-react';

export default function HistoryPage() {
  const [sessions, setSessions] = useState<RiskSession[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSessionModal, setActiveSessionModal] = useState<RiskSession | null>(null);

  useEffect(() => {
    setSessions(getSavedRiskSessions());
  }, []);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteRiskSession(id);
    setSessions(getSavedRiskSessions());
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear all saved risk assessment logs?')) {
      clearAllRiskSessions();
      setSessions([]);
    }
  };

  const filteredSessions = sessions.filter(
    (s) =>
      s.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.prediction.classification.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-teal-500/20 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
            <History className="w-7 h-7 text-teal-400" />
            <span>Saved Risk Assessment Logs</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            Review past patient vitals assessments, SHAP factor contributions, and AI clinical advice.
          </p>
        </div>

        {sessions.length > 0 && (
          <button
            onClick={handleClearAll}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-950/60 hover:bg-red-900 text-red-300 text-xs font-semibold border border-red-800/60 transition-colors self-start sm:self-auto font-mono"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear All Logs</span>
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="bg-[#0b1724] p-4 rounded-2xl border border-slate-800 backdrop-blur-xl">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search patient name or risk status..."
            className="w-full bg-[#07101a] border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs font-mono text-white focus:outline-none focus:border-teal-500 placeholder:text-slate-600"
          />
        </div>
      </div>

      {/* Grid List */}
      {filteredSessions.length === 0 ? (
        <div className="text-center py-16 bg-[#0b1724]/60 rounded-3xl border border-slate-800 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-[#07101a] border border-slate-800 mx-auto flex items-center justify-center text-slate-600">
            <History className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-white">No Risk Sessions Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto font-sans">
            {searchTerm ? 'No logs match your search query.' : 'You have not saved any risk assessments yet.'}
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500 text-slate-950 font-mono font-bold text-xs shadow-lg shadow-teal-500/20 hover:scale-105 transition-all"
          >
            <Activity className="w-4 h-4" />
            <span>Start New Risk Assessment</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSessions.map((session) => (
            <div
              key={session.id}
              onClick={() => setActiveSessionModal(session)}
              className="group bg-[#0b1724] hover:bg-[#0f1d2c] border border-slate-800 hover:border-teal-500/40 rounded-2xl p-5 shadow-xl transition-all cursor-pointer flex flex-col justify-between space-y-4 relative overflow-hidden"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-mono uppercase font-bold text-teal-400 bg-teal-950 px-2 py-0.5 rounded border border-teal-800/40">
                    {session.patientName}
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${
                        session.prediction.riskPercent >= 65
                          ? 'bg-rose-950 text-rose-400 border-rose-800'
                          : session.prediction.riskPercent >= 35
                          ? 'bg-amber-950 text-amber-400 border-amber-800'
                          : 'bg-emerald-950 text-emerald-400 border-emerald-800'
                      }`}
                    >
                      Risk: {session.prediction.riskPercent}%
                    </span>
                    <button
                      onClick={(e) => handleDelete(session.id, e)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 transition-colors"
                      title="Delete Session"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="font-bold text-white text-base group-hover:text-teal-300 transition-colors line-clamp-1">
                  Glucose: {session.vitals.glucose} mg/dL • BMI: {session.vitals.bmi}
                </h3>

                <p className="text-xs text-slate-400 mt-1 line-clamp-1 font-sans">
                  Flagged factors: {session.prediction.flaggedCount} of 8 vitals
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500 font-mono">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(session.createdAt).toLocaleDateString()}
                </span>
                <span className="text-teal-400 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Inspect Assessment</span>
                  <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Inspector */}
      {activeSessionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#050b12]/90 backdrop-blur-md">
          <div className="bg-[#0b1724] border border-slate-800 rounded-3xl max-w-4xl w-full p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto font-mono">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-teal-400" />
                  <span>Clinical Report — {activeSessionModal.patientName}</span>
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Saved on {new Date(activeSessionModal.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-slate-950 rounded-xl text-xs font-bold"
                >
                  <Printer className="w-3.5 h-3.5" /> Print Report
                </button>
                <button
                  onClick={() => setActiveSessionModal(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <RiskGauge prediction={activeSessionModal.prediction} />
            <SHAPChart factors={activeSessionModal.prediction.shapFactors} />
            <RecommendationCard recommendations={activeSessionModal.recommendations} />
          </div>
        </div>
      )}
    </div>
  );
}
