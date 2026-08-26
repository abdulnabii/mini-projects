'use client';

import { useState } from 'react';
import { LogEntry } from '@/types';
import { Terminal, Filter, Search, PlusCircle, AlertCircle, Copy, Check } from 'lucide-react';

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
        return 'bg-rose-500/20 text-rose-400 border border-rose-500/30';
      case 'WARN':
        return 'bg-amber-500/20 text-amber-400 border border-amber-500/30';
      case 'INFO':
        return 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30';
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
    <div className="bg-[#0d1117] border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl font-mono text-xs text-slate-300 flex flex-col">
      {/* Header with Filter Chips & Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-rose-500" />
          <h3 className="font-bold text-white text-sm font-mono">
            Real-Time Ingestion Log Stream ({filteredLogs.length} entries)
          </h3>
        </div>

        <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
          {/* Level Filter */}
          <div className="flex items-center gap-1 p-0.5 rounded-lg bg-[#161b22] border border-slate-800 text-[10px]">
            {['ALL', 'FATAL', 'ERROR', 'WARN', 'INFO'].map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setSelectedLevel(lvl)}
                className={`px-2 py-0.5 rounded transition-all cursor-pointer font-bold ${
                  selectedLevel === lvl
                    ? 'bg-rose-500 text-black'
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
            className="px-2.5 py-1 rounded-lg bg-[#161b22] border border-slate-800 hover:border-rose-500/40 text-rose-400 text-xs transition-all flex items-center gap-1 cursor-pointer font-bold"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Paste Custom Logs</span>
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
          placeholder="Filter log messages by service, pod, or error keyword..."
          className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#161b22] border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-rose-500 font-mono"
        />
      </div>

      {/* Terminal Viewport */}
      <div className="bg-[#04080e] rounded-xl border border-slate-800/80 p-3.5 space-y-2 max-h-[320px] overflow-y-auto font-mono text-[11px]">
        {filteredLogs.length === 0 ? (
          <div className="py-8 text-center text-slate-500">
            No log lines match current filter criteria.
          </div>
        ) : (
          filteredLogs.map((log) => (
            <div
              key={log.id}
              className="p-2 rounded-lg bg-[#0a0f16] border border-slate-800/60 hover:border-slate-700 flex items-start justify-between gap-3 group transition-colors"
            >
              <div className="space-y-1 overflow-hidden">
                <div className="flex items-center gap-2 text-[10px] flex-wrap">
                  <span className="text-slate-500">{log.timestamp}</span>
                  <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${getLevelBadge(log.level)}`}>
                    {log.level}
                  </span>
                  <span className="text-cyan-400 font-bold">{log.service}</span>
                  {log.pod && <span className="text-slate-500">[{log.pod}]</span>}
                </div>
                <p className="text-slate-200 break-words leading-relaxed font-mono select-all">
                  {log.message}
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleCopyLog(log.message, log.id)}
                className="opacity-0 group-hover:opacity-100 p-1 rounded bg-[#161b22] text-slate-400 hover:text-white transition-opacity shrink-0 cursor-pointer"
                title="Copy log line"
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
          <div className="bg-[#0d1117] border border-rose-500/40 rounded-2xl p-6 max-w-xl w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
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
                placeholder="Paste raw log lines or stack traces here (e.g. from Datadog, CloudWatch, or kubectl logs)..."
                className="w-full p-3 rounded-xl bg-[#04080e] border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-rose-500 font-mono"
              />

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPasteModal(false)}
                  className="px-3.5 py-1.5 rounded-lg bg-[#161b22] text-slate-400 text-xs font-mono"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!customText.trim()}
                  className="px-4 py-1.5 rounded-lg bg-rose-500 text-black font-extrabold text-xs font-mono hover:bg-rose-400 transition-all disabled:opacity-50 cursor-pointer"
                >
                  Ingest &amp; Analyze Logs
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
