'use client';

import { useState, useEffect } from 'react';
import { SavedQuery } from '@/types';
import { getSavedQueries, deleteSavedQuery } from '@/lib/storage';
import {
  Bookmark,
  Copy,
  Check,
  Trash2,
  Terminal,
  Code2,
  ArrowLeft,
  Search,
} from 'lucide-react';
import Link from 'next/link';

export default function HistoryPage() {
  const [savedQueries, setSavedQueries] = useState<SavedQuery[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setSavedQueries(getSavedQueries());
  }, []);

  const handleCopy = (q: SavedQuery) => {
    navigator.clipboard.writeText(q.query);
    setCopiedId(q.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = (id: string) => {
    const updated = deleteSavedQuery(id);
    setSavedQueries(updated);
  };

  const filtered = savedQueries.filter(
    (q) =>
      q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.query.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 font-mono w-full min-w-0">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#0d1117] border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Bookmark className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white font-outfit">
              Saved Query Library &amp; Bookmarks ({savedQueries.length})
            </h1>
            <p className="text-xs text-slate-400">
              Revisit and copy frequently used SQL and ORM queries
            </p>
          </div>
        </div>

        <Link
          href="/"
          className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white font-bold transition-all flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Query Builder</span>
        </Link>
      </div>

      {/* Search Filter */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search saved queries by keyword, dialect, or table..."
          className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#0d1117] border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50"
        />
      </div>

      {/* Saved Queries List */}
      {filtered.length === 0 ? (
        <div className="p-12 rounded-3xl bg-[#0d1117] border border-dashed border-slate-800 text-center space-y-3">
          <p className="text-sm text-slate-400">No saved queries found.</p>
          <Link
            href="/"
            className="inline-block px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 text-black font-extrabold text-xs shadow-md"
          >
            Generate and Bookmark a Query
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((q) => (
            <div
              key={q.id}
              className="p-6 rounded-3xl bg-[#0d1117] border border-slate-800 space-y-4 shadow-xl flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-[10px] font-bold uppercase">
                    {q.dialect.toUpperCase()}
                  </span>
                  <span className="text-[10px] text-slate-500">{q.schemaName}</span>
                </div>

                <h3 className="text-sm font-bold text-white font-outfit">
                  {q.title}
                </h3>
                <p className="text-xs text-slate-400 font-sans">
                  "{q.question}"
                </p>

                {/* Code preview snippet */}
                <div className="p-3 rounded-xl bg-[#04080e] border border-slate-800 overflow-x-auto max-h-36">
                  <pre className="text-[11px] text-emerald-300 font-mono leading-relaxed whitespace-pre-wrap">
                    {q.query}
                  </pre>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
                <button
                  type="button"
                  onClick={() => handleCopy(q)}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedId === q.id ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>{copiedId === q.id ? 'Copied' : 'Copy Query'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(q.id)}
                  className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 transition-colors cursor-pointer"
                  title="Delete query"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
