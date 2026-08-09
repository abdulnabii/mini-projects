'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ReviewSession } from '@/types';
import { getSavedReviews, deleteReview, clearAllReviews } from '@/lib/storage';
import ScoreGauge from '@/components/ScoreGauge';
import ReviewPanel from '@/components/ReviewPanel';
import DiffViewer from '@/components/DiffViewer';
import {
  History,
  Trash2,
  Calendar,
  Terminal,
  Search,
  Filter,
  X,
  ChevronRight,
} from 'lucide-react';

export default function HistoryPage() {
  const [sessions, setSessions] = useState<ReviewSession[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedScoreFilter, setSelectedScoreFilter] = useState<string>('ALL');
  const [activeSessionModal, setActiveSessionModal] = useState<ReviewSession | null>(null);

  useEffect(() => {
    setSessions(getSavedReviews());
  }, []);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteReview(id);
    setSessions(getSavedReviews());
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear all code review session history?')) {
      clearAllReviews();
      setSessions([]);
    }
  };

  const filteredSessions = sessions.filter((session) => {
    const matchesSearch =
      session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.language.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.reviewResult.summary.toLowerCase().includes(searchTerm.toLowerCase());

    const score = session.reviewResult.score;
    let matchesScore = true;
    if (selectedScoreFilter === 'CRITICAL') matchesScore = score < 45;
    if (selectedScoreFilter === 'NEEDS_WORK') matchesScore = score >= 45 && score < 70;
    if (selectedScoreFilter === 'GOOD') matchesScore = score >= 70;

    return matchesSearch && matchesScore;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-500/20 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
            <History className="w-7 h-7 text-emerald-400" />
            <span>Code Review Session History</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1 font-sans">
            Review past static analysis reports and refactored code preserved in your browser.
          </p>
        </div>

        {sessions.length > 0 && (
          <button
            onClick={handleClearAll}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-950/60 hover:bg-red-900 text-red-300 text-xs font-semibold border border-red-800/60 transition-colors self-start sm:self-auto font-mono"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear All History</span>
          </button>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-[#0d1117] p-4 rounded-2xl border border-zinc-800 backdrop-blur-xl">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search language, summary, or vulnerability keywords..."
            className="w-full bg-[#080c14] border border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-500 placeholder:text-zinc-600"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-emerald-400 shrink-0" />
          <select
            value={selectedScoreFilter}
            onChange={(e) => setSelectedScoreFilter(e.target.value)}
            className="bg-[#080c14] border border-zinc-800 rounded-xl px-3 py-2 text-xs font-mono font-medium text-white focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">All Quality Scores</option>
            <option value="GOOD">Good Quality (≥ 70)</option>
            <option value="NEEDS_WORK">Needs Work (45 - 69)</option>
            <option value="CRITICAL">Vulnerable (&lt; 45)</option>
          </select>
        </div>
      </div>

      {/* Grid List */}
      {filteredSessions.length === 0 ? (
        <div className="text-center py-16 bg-[#0d1117]/60 rounded-3xl border border-zinc-800 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-[#080c14] border border-zinc-800 mx-auto flex items-center justify-center text-zinc-600">
            <History className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-white">No Review Sessions Found</h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto font-sans">
            {searchTerm || selectedScoreFilter !== 'ALL'
              ? 'No review history matches your search or score filter.'
              : 'You have not run any code review assessments yet.'}
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-zinc-950 font-mono font-bold text-xs shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all"
          >
            <Terminal className="w-4 h-4" />
            <span>Start New Code Review</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSessions.map((session) => (
            <div
              key={session.id}
              onClick={() => setActiveSessionModal(session)}
              className="group bg-[#0d1117] hover:bg-[#0f141d] border border-zinc-800 hover:border-emerald-500/40 rounded-2xl p-5 shadow-xl transition-all cursor-pointer flex flex-col justify-between space-y-4 relative overflow-hidden"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-mono uppercase font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800/40">
                    {session.language}
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${
                        session.reviewResult.score >= 70
                          ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                          : session.reviewResult.score >= 45
                          ? 'bg-amber-950 text-amber-400 border-amber-800'
                          : 'bg-red-950 text-red-400 border-red-800'
                      }`}
                    >
                      Score: {session.reviewResult.score}/100
                    </span>
                    <button
                      onClick={(e) => handleDelete(session.id, e)}
                      className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-950/40 transition-colors"
                      title="Delete Session"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="font-bold text-white text-base group-hover:text-emerald-300 transition-colors line-clamp-1">
                  {session.title}
                </h3>

                <p className="text-xs text-zinc-400 mt-2 line-clamp-2 leading-relaxed font-sans">
                  {session.reviewResult.summary}
                </p>
              </div>

              <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-500 font-mono">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(session.createdAt).toLocaleDateString()}
                </span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Inspect Review</span>
                  <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review Inspector Modal */}
      {activeSessionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#090d16]/90 backdrop-blur-md">
          <div className="bg-[#0d1117] border border-zinc-800 rounded-3xl max-w-4xl w-full p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto font-mono">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-emerald-400" />
                  <span>Review Inspection — {activeSessionModal.title}</span>
                </h3>
                <p className="text-xs text-zinc-400 font-mono mt-0.5">
                  Saved on {new Date(activeSessionModal.createdAt).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setActiveSessionModal(null)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <ScoreGauge score={activeSessionModal.reviewResult.score} />

            <ReviewPanel result={activeSessionModal.reviewResult} />

            <DiffViewer
              originalCode={activeSessionModal.originalCode}
              fixedCode={activeSessionModal.reviewResult.fixedCode}
              language={activeSessionModal.language}
            />
          </div>
        </div>
      )}
    </div>
  );
}
