'use client';

import { useState } from 'react';
import { DatabaseSchema, TableDefinition } from '@/types';
import {
  Database,
  Table as TableIcon,
  Key,
  Link as LinkIcon,
  Layers,
  ArrowRight,
  Sparkles,
  Search,
  Filter,
} from 'lucide-react';

interface Props {
  schemas: DatabaseSchema[];
  activeSchema: DatabaseSchema;
  onSelectSchema: (schema: DatabaseSchema) => void;
  onColumnClick?: (tableName: string, columnName: string) => void;
}

export default function SchemaViewer({
  schemas,
  activeSchema,
  onSelectSchema,
  onColumnClick,
}: Props) {
  const [tableSearch, setTableSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'pk' | 'fk' | 'number' | 'date'>('all');

  const filteredTables = activeSchema.tables.filter((t) =>
    t.name.toLowerCase().includes(tableSearch.toLowerCase()) ||
    t.description.toLowerCase().includes(tableSearch.toLowerCase()) ||
    t.columns.some((c) => c.name.toLowerCase().includes(tableSearch.toLowerCase()))
  );

  return (
    <div className="space-y-6 font-mono">
      {/* Schema Selector Bar */}
      <div className="p-6 rounded-3xl bg-[#0d1117] border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <Database className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="font-bold text-white text-base font-outfit">
                Database Schema Explorer &amp; Architecture Map
              </h3>
              <p className="text-xs text-slate-400">
                Click any column to reference it in your natural language query
              </p>
            </div>
          </div>

          <span className="text-[10px] text-emerald-400 font-bold px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30">
            {activeSchema.tables.length} Tables Registered
          </span>
        </div>

        {/* Schema Switcher Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {schemas.map((s) => {
            const isSelected = activeSchema.id === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => onSelectSchema(s)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-500 text-black font-black shadow-md'
                    : 'bg-[#161b22] border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span>{s.name}</span>
              </button>
            );
          })}
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={tableSearch}
              onChange={(e) => setTableSearch(e.target.value)}
              placeholder="Search tables and columns..."
              className="w-full pl-8 pr-3 py-2 rounded-xl bg-[#161b22] border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50"
            />
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 text-[10px] overflow-x-auto">
            <Filter className="w-3 h-3 text-slate-400 ml-1.5" />
            {(['all', 'pk', 'fk', 'number', 'date'] as const).map((ft) => (
              <button
                key={ft}
                type="button"
                onClick={() => setTypeFilter(ft)}
                className={`px-2.5 py-1 rounded-lg uppercase font-bold transition-all cursor-pointer ${
                  typeFilter === ft
                    ? 'bg-emerald-500 text-black font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {ft === 'all' ? 'All Cols' : ft === 'pk' ? 'PKs' : ft === 'fk' ? 'FKs' : ft === 'number' ? 'Numeric' : 'Dates'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTables.map((table) => {
          const visibleColumns = table.columns.filter((c) => {
            if (typeFilter === 'pk') return c.isPrimary;
            if (typeFilter === 'fk') return c.isForeignKey;
            if (typeFilter === 'number') return c.type.includes('INT') || c.type.includes('DECIMAL');
            if (typeFilter === 'date') return c.type.includes('TIME') || c.type.includes('DATE');
            return true;
          });

          return (
            <div
              key={table.name}
              className="p-6 rounded-3xl bg-[#0d1117] border border-slate-800 space-y-4 shadow-xl flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Table Header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <TableIcon className="w-4 h-4 text-cyan-400" />
                    <h4 className="font-bold text-white text-sm font-outfit">
                      {table.name}
                    </h4>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">
                    ~{table.rowCountEstimate.toLocaleString()} rows
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 font-sans">
                  {table.description}
                </p>

                {/* Columns Table */}
                <div className="rounded-2xl border border-slate-800/80 bg-[#04080e] overflow-hidden text-xs">
                  <div className="divide-y divide-slate-800/80">
                    {visibleColumns.map((col) => (
                      <button
                        key={col.name}
                        type="button"
                        onClick={() => onColumnClick && onColumnClick(table.name, col.name)}
                        className="w-full text-left p-2.5 flex items-center justify-between gap-2 hover:bg-slate-900/60 transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center gap-1.5 truncate">
                          {col.isPrimary ? (
                            <span title="Primary Key">
                              <Key className="w-3 h-3 text-amber-400 shrink-0" />
                            </span>
                          ) : col.isForeignKey ? (
                            <span title="Foreign Key">
                              <LinkIcon className="w-3 h-3 text-cyan-400 shrink-0" />
                            </span>
                          ) : (
                            <span className="w-3 h-3 text-slate-600 text-center font-bold shrink-0">•</span>
                          )}
                          <span className="font-bold text-slate-200 text-xs truncate group-hover:text-emerald-300 transition-colors">
                            {col.name}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0 text-[10px]">
                          <span className="text-cyan-400 font-mono font-bold">
                            {col.type}
                          </span>
                          {col.references && (
                            <span className="px-1.5 py-0.2 rounded bg-slate-900 border border-slate-800 text-slate-400 text-[9px]">
                              → {col.references}
                            </span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
