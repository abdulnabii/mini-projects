'use client';

import { useState } from 'react';
import { ExecutionResult } from '@/types';
import {
  Table as TableIcon,
  Download,
  Search,
  CheckCircle2,
  Clock,
  Layers,
  Database,
} from 'lucide-react';

interface Props {
  result: ExecutionResult;
}

export default function ResultTable({ result }: Props) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRows = result.rows.filter((row) => {
    if (!searchTerm) return true;
    return Object.values(row).some((val) =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const exportCSV = () => {
    if (result.rows.length === 0) return;
    const header = result.columns.join(',');
    const rows = result.rows.map((r) =>
      result.columns.map((c) => JSON.stringify(r[c] ?? '')).join(',')
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [header, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `queryforge_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const exportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(result.rows, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `queryforge_export_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="p-6 sm:p-8 rounded-2xl bg-[#0d1117] border border-slate-800 shadow-xl space-y-4 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <TableIcon className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-white text-sm font-mono">
                Query Execution Results Grid
              </h3>
              <span className="px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold font-mono">
                {result.totalRows} ROWS RETURNED
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 pt-0.5 font-mono">
              <Clock className="w-3 h-3 text-cyan-400" />
              <span>Sandbox Latency: <strong className="text-cyan-300">{result.executionTimeMs}ms</strong></span>
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter returned rows..."
              className="pl-8 pr-3 py-1.5 rounded-lg bg-[#161b22] border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 font-mono"
            />
          </div>

          <button
            type="button"
            onClick={exportCSV}
            className="px-3 py-1.5 rounded-lg bg-[#161b22] border border-slate-800 text-xs text-slate-300 hover:text-white font-bold transition-all flex items-center gap-1.5 cursor-pointer font-mono"
          >
            <Download className="w-3 h-3 text-cyan-400" />
            <span>CSV</span>
          </button>

          <button
            type="button"
            onClick={exportJSON}
            className="px-3 py-1.5 rounded-lg bg-[#161b22] border border-slate-800 text-xs text-slate-300 hover:text-white font-bold transition-all flex items-center gap-1.5 cursor-pointer font-mono"
          >
            <Download className="w-3 h-3 text-cyan-400" />
            <span>JSON</span>
          </button>
        </div>
      </div>

      {/* Table Element */}
      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-[#04080e]">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-[#161b22] text-slate-400 font-bold border-b border-slate-800 uppercase text-[10px]">
            <tr>
              <th className="py-2.5 px-4 text-slate-500">#</th>
              {result.columns.map((col) => (
                <th key={col} className="py-2.5 px-4 text-cyan-400">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredRows.map((row, idx) => (
              <tr
                key={idx}
                className={`transition-colors text-slate-200 hover:bg-cyan-950/20 ${
                  idx % 2 === 0 ? 'bg-[#0d1117]' : 'bg-[#090e15]'
                }`}
              >
                <td className="py-2.5 px-4 text-slate-500 text-[11px]">
                  {idx + 1}
                </td>
                {result.columns.map((col) => (
                  <td key={col} className="py-2.5 px-4 text-xs font-mono">
                    {typeof row[col] === 'number'
                      ? col.includes('amount') || col.includes('revenue') || col.includes('mrr')
                        ? `$${Number(row[col]).toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                        : Number(row[col]).toLocaleString()
                      : String(row[col] ?? '-')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
