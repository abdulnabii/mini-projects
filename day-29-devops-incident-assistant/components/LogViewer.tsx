'use client';

import { useState } from 'react';
import { LogEntry } from '@/types';
import {
  Terminal,
  Filter,
  Search,
  PlusCircle,
  AlertCircle,
  Copy,
  Check,
  Maximize2,
  Minimize2,
} from 'lucide-react';

interface Props {
  logs: LogEntry[];
  onAddCustomLogs: (rawText: string) => void;
}

export default function LogViewer({ logs, onAddCustomLogs }: Props) {
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showPasteModal, setShowPasteModal] = useState(false);
  const [customText, setCustomText] = useState('');
  const [copiedLogId, setCopiedLogId] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const filteredLogs = logs.filter((log) => {
    const matchesLevel = selectedLevel === 'ALL' || log.level === selectedLevel;
    const matchesQuery =
      searchQuery === '' ||
      log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.pod && log.pod.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesLevel && matchesQuery;
  });

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'FATAL':
        return 'bg-rose-500 text-black font-extrabold';
      case 'ERROR':
        return 'bg-rose-500/15 text-rose-400 border border-rose-500/30 font-bold';
      case 'WARN':
        return 'bg-amber-500/15 text-amber-400 border border-amber-500/30 font-bold';
      case 'INFO':
        return 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 font-bold';
      default:
        return 'bg-slate-800 text-slate-400';
    }
  };

  const handleCopyLog = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLogId(id);
    setTimeout(() => setCopiedLogId(null), 2000);
  };

  const handlePasteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customText.trim()) return;
    onAddCustomLogs(customText);
    setCustomText('');
    setShowPasteModal(false);
  };

  return (
    <div className="bg-[#090d16] border border-white/[0.08] rounded-xl p-4 space-y-3.5 shadow-2xl font-mono text-xs text-slate-300 flex flex-col sre-card">
      {/* Header with Level Filters & Custom Log Ingestion */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <Terminal className="w-3.5 h-3.5" />
          </div>
          <h3 className="font-bold text-white text-xs font-mono uppercase tracking-wider">
            Live Log Ingestion Stream ({filteredLogs.length})
          </h3>
        </div>

        <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
          {/* Level Filter Chips */}
          <div className="flex items-center gap-1 p-0.5 rounded-lg bg-[#04080e] border border-white/[0.08] text-[10px]">
            {['ALL', 'FATAL', 'ERROR', 'WARN', 'INFO'].map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setSelectedLevel(lvl)}
                className={`px-2 py-0.5 rounded transition-all cursor-pointer font-bold ${
                  selectedLevel === lvl
                    ? 'bg-rose-500 text-black shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          {/* Paste Custom Logs Button */}
          <button
            type="button"
            onClick={() => setShowPasteModal(true)}
            className="px-2.5 py-1 rounded-lg bg-[#0f1422] border border-white/[0.08] hover:border-rose-500/40 text-rose-400 text-xs transition-all flex items-center gap-1 cursor-pointer font-bold font-mono"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Ingest Logs</span>
          </button>
        </div>
      </div>

      {/* Search Filter Bar */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search logs by error, pod name, or exception stack trace..."
          className="w-full pl-9 pr-4 py-2 rounded-lg bg-[#04080e] border border-white/[0.08] text-xs text-white placeholder-slate-600 focus:outline-none focus:border-rose-500/50 font-mono"
        />
      </div>

      {/* Terminal Viewport */}
      <div
        className={`bg-[#04060a] rounded-lg border border-white/[0.06] p-3 space-y-1.5 overflow-y-auto font-mono text-[11px] transition-all ${
          isExpanded ? 'max-h-[500px]' : 'max-h-[290px]'
        }`}
      >
        {filteredLogs.length === 0 ? (
          <div className="py-8 text-center text-slate-500 font-mono">
            No log entries match the current filter query.
          </div>
        ) : (
          filteredLogs.map((log, idx) => (
            <div
              key={log.id}
              className="p-2 rounded bg-[#090d15]/80 border border-white/[0.04] hover:border-white/[0.1] flex items-start justify-between gap-3 group transition-colors"
            >
              <div className="space-y-0.5 overflow-hidden">
                <div className="flex items-center gap-2 text-[10px] flex-wrap">
                  <span className="text-slate-500 font-mono">{log.timestamp}</span>
                  <span className={`px-1.5 py-0.2 rounded text-[9px] ${getLevelBadge(log.level)}`}>
                    {log.level}
                  </span>
                  <span className="text-cyan-400 font-bold font-mono">{log.service}</span>
                  {log.pod && <span className="text-slate-500">[{log.pod}]</span>}
                </div>
                <p className="text-slate-200 break-words leading-relaxed font-mono select-all text-[11px]">
                  {log.message}
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleCopyLog(log.message, log.id)}
                className="opacity-0 group-hover:opacity-100 p-1 rounded bg-[#0f1422] text-slate-400 hover:text-white transition-opacity shrink-0 cursor-pointer"
                title="Copy log entry"
              >
                {copiedLogId === log.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          ))
        )}
      </div>

      {/* Custom Log Paste Modal */}
      {showPasteModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#090d16] border border-rose-500/40 rounded-xl p-6 max-w-xl w-full space-y-4 shadow-2xl font-mono">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <h4 className="font-bold text-white text-sm font-mono flex items-center gap-2">
                <Terminal className="w-4 h-4 text-rose-500" />
                Paste Custom Server Error Logs
              </h4>
              <button
                type="button"
                onClick={() => setShowPasteModal(false)}
                className="text-slate-500 hover:text-white text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePasteSubmit} className="space-y-3">
              <textarea
                rows={6}
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="Paste raw error logs, Datadog stack traces, or kubectl stdout output here..."
                className="w-full p-3 rounded-lg bg-[#04080e] border border-white/[0.08] text-xs text-white placeholder-slate-600 focus:outline-none focus:border-rose-500 font-mono"
              />

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPasteModal(false)}
                  className="px-3.5 py-1.5 rounded-lg bg-[#0f1422] text-slate-400 text-xs font-mono cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!customText.trim()}
                  className="px-4 py-1.5 rounded-lg bg-rose-500 text-black font-extrabold text-xs font-mono hover:bg-rose-400 transition-all disabled:opacity-50 cursor-pointer"
                >
                  Analyze Logs with Gemini SRE
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
