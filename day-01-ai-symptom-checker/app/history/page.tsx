'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { TriageSession, RiskLevel } from '@/types';
import { getSavedSessions, deleteSession, clearAllSessions } from '@/lib/storage';
import RiskBadge from '@/components/RiskBadge';
import ExportModal from '@/components/ExportModal';
import {
  History,
  Trash2,
  Calendar,
  Clock,
  ChevronRight,
  Search,
  Filter,
  FileText,
  AlertCircle,
  Stethoscope,
} from 'lucide-react';

export default function HistoryPage() {
  const [sessions, setSessions] = useState<TriageSession[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<string>('ALL');
  const [selectedSessionForExport, setSelectedSessionForExport] = useState<TriageSession | null>(
    null
  );

  useEffect(() => {
    setSessions(getSavedSessions());
  }, []);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteSession(id);
    setSessions(getSavedSessions());
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear all triage session history?')) {
      clearAllSessions();
      setSessions([]);
    }
  };

  const filteredSessions = sessions.filter((session) => {
    const matchesSearch =
      session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.messages.some((m) => m.content.toLowerCase().includes(searchTerm.toLowerCase()));

    const sessionRisk = session.finalAssessment?.riskLevel || 'LOW';
    const matchesRisk = selectedRiskFilter === 'ALL' || sessionRisk === selectedRiskFilter;

    return matchesSearch && matchesRisk;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
            <History className="w-7 h-7 text-cyan-400" />
            <span>Symptom Triage History</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Review past symptom assessments saved locally in your browser.
          </p>
        </div>

        {sessions.length > 0 && (
          <button
            onClick={handleClearAll}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-950/60 hover:bg-red-900 text-red-300 text-xs font-semibold border border-red-800/60 transition-colors self-start sm:self-auto"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800 backdrop-blur-xl">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search symptoms or condition keywords..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 placeholder:text-slate-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-cyan-400 shrink-0" />
          <select
            value={selectedRiskFilter}
            onChange={(e) => setSelectedRiskFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-medium text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Risk Levels</option>
            <option value="LOW">Low Risk</option>
            <option value="MEDIUM">Medium Risk</option>
            <option value="HIGH">High Risk</option>
            <option value="EMERGENCY">Emergency</option>
          </select>
        </div>
      </div>

      {/* Sessions Grid */}
      {filteredSessions.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-slate-800/80 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-950 border border-slate-800 mx-auto flex items-center justify-center text-slate-500">
            <History className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white">No Triage Sessions Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {searchTerm || selectedRiskFilter !== 'ALL'
              ? 'No sessions match your search or risk filter criteria.'
              : 'You have not conducted any symptom triage assessments yet.'}
          </p>
          <Link
            href="/chat"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/25 hover:scale-105 transition-all"
          >
            <Stethoscope className="w-4 h-4" />
            <span>Start New Assessment</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSessions.map((session) => (
            <div
              key={session.id}
              onClick={() => setSelectedSessionForExport(session)}
              className="group bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/40 rounded-2xl p-5 shadow-xl transition-all cursor-pointer flex flex-col justify-between space-y-4 relative overflow-hidden"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  {session.finalAssessment?.riskLevel ? (
                    <RiskBadge level={session.finalAssessment.riskLevel} size="sm" />
                  ) : (
                    <span className="text-xs text-slate-500 font-mono">In Progress</span>
                  )}
                  <button
                    onClick={(e) => handleDelete(session.id, e)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-950/40 transition-colors"
                    title="Delete Session"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="font-bold text-white text-base group-hover:text-cyan-300 transition-colors line-clamp-2">
                  {session.title}
                </h3>

                <p className="text-xs text-slate-400 mt-2 flex items-center gap-2 font-mono">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{new Date(session.createdAt).toLocaleDateString()}</span>
                  <span>•</span>
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{new Date(session.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </p>
              </div>

              {session.finalAssessment && (
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">
                    {session.finalAssessment.possibleConditions.length} Conditions Evaluated
                  </span>
                  <span className="text-cyan-400 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>View Report</span>
                    <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Export / Report Inspection Modal */}
      {selectedSessionForExport && (
        <ExportModal
          session={selectedSessionForExport}
          isOpen={!!selectedSessionForExport}
          onClose={() => setSelectedSessionForExport(null)}
        />
      )}
    </div>
  );
}
