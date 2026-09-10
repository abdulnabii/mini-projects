'use client';

import { useState } from 'react';
import {
  Search,
  ArrowUpDown,
  Download,
  ChevronLeft,
  ChevronRight,
  Eye,
  Check,
} from 'lucide-react';

interface Props {
  headers: string[];
  rows: Record<string, any>[];
  selectedRowIndex?: number | null;
  onSelectRow?: (row: Record<string, any>, idx: number) => void;
  datasetTitle: string;
}

export default function DataTable2D({
  headers,
  rows,
  selectedRowIndex,
  onSelectRow,
  datasetTitle,
}: Props) {
  const [sortCol, setSortCol] = useState<string>(headers[0] || '');
  const [sortAsc, setSortAsc] = useState(true);
  const [search, setSearch] = useState('');
  const [pageSize, setPageSize] = useState<number>(25);
  const [page, setPage] = useState<number>(1);
  const [exported, setExported] = useState(false);

  // Filter rows by table search
  const filtered = rows.filter((r) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return Object.values(r).some((v) => String(v).toLowerCase().includes(q));
  });

  // Sort rows
  const sorted = [...filtered].sort((a, b) => {
    if (!sortCol) return 0;
    const valA = a[sortCol];
    const valB = b[sortCol];
    const numA = parseFloat(valA);
    const numB = parseFloat(valB);

    if (!isNaN(numA) && !isNaN(numB)) {
      return sortAsc ? numA - numB : numB - numA;
    }
    return sortAsc
      ? String(valA || '').localeCompare(String(valB || ''))
      : String(valB || '').localeCompare(String(valA || ''));
  });

  // Pagination slice
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const startIndex = (page - 1) * pageSize;
  const paginatedRows = sorted.slice(startIndex, startIndex + pageSize);

  const handleSort = (col: string) => {
    if (sortCol === col) {
      setSortAsc(!sortAsc);
    } else {
      setSortCol(col);
      setSortAsc(true);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    if (rows.length === 0) return;
    const headerRow = headers.join(',');
    const dataRows = rows.map((r) =>
      headers.map((h) => {
        const val = r[h] !== undefined ? String(r[h]) : '';
        return val.includes(',') ? `"${val}"` : val;
      }).join(',')
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headerRow, ...dataRows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${datasetTitle.toLowerCase().replace(/\s+/g, '_')}_export.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();

    setExported(true);
    setTimeout(() => setExported(false), 2000);
  };

  return (
    <div className="p-4 sm:p-6 rounded-2xl bg-[#0d1527] border border-[#1e293b] shadow-xl space-y-4 font-mono">
      {/* Table Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#1e293b] pb-4">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search table rows..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-8 pr-3 py-1.5 rounded-lg bg-[#111827] border border-[#1e293b] text-white text-xs w-56 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
            />
          </div>

          <span className="text-xs text-slate-400">
            Showing {paginatedRows.length} of {sorted.length} rows
          </span>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            className="px-2.5 py-1.5 rounded-lg bg-[#111827] border border-[#1e293b] text-slate-300 text-xs focus:outline-none"
          >
            <option value={10}>10 rows</option>
            <option value={25}>25 rows</option>
            <option value={50}>50 rows</option>
            <option value={100}>100 rows</option>
          </select>

          <button
            type="button"
            onClick={handleExportCSV}
            className="px-3 py-1.5 rounded-lg bg-[#111827] border border-[#1e293b] hover:border-emerald-500/40 text-slate-300 hover:text-white text-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            {exported ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Download className="w-3.5 h-3.5 text-slate-400" />}
            <span>{exported ? 'Exported!' : 'Export CSV'}</span>
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-xl border border-[#1e293b]">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#111827] border-b border-[#1e293b] text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              <th className="p-3 w-12 text-center">#</th>
              {headers.map((h) => (
                <th
                  key={h}
                  onClick={() => handleSort(h)}
                  className="p-3 cursor-pointer hover:text-white transition-colors select-none"
                >
                  <div className="flex items-center gap-1.5">
                    <span>{h}</span>
                    <ArrowUpDown className={`w-3 h-3 ${sortCol === h ? 'text-cyan-400' : 'text-slate-600'}`} />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e293b]">
            {paginatedRows.length === 0 ? (
              <tr>
                <td colSpan={headers.length + 1} className="p-6 text-center text-slate-500 text-xs">
                  No records match the current filter or search criteria.
                </td>
              </tr>
            ) : (
              paginatedRows.map((row, idx) => {
                const actualIndex = startIndex + idx;
                const isSelected = selectedRowIndex === actualIndex;

                return (
                  <tr
                    key={idx}
                    onClick={() => onSelectRow && onSelectRow(row, actualIndex)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-emerald-500/10 text-white font-bold'
                        : 'hover:bg-[#111827]/60 text-slate-300'
                    }`}
                  >
                    <td className="p-3 text-center text-slate-500 text-[10px] font-mono">
                      {actualIndex + 1}
                    </td>
                    {headers.map((h) => (
                      <td key={h} className="p-3 truncate max-w-[200px]">
                        {row[h] !== undefined ? String(row[h]) : '—'}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between text-xs text-slate-400 pt-2">
        <span>
          Page {page} of {totalPages}
        </span>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="p-1.5 rounded-lg bg-[#111827] border border-[#1e293b] disabled:opacity-30 hover:text-white cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="p-1.5 rounded-lg bg-[#111827] border border-[#1e293b] disabled:opacity-30 hover:text-white cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
