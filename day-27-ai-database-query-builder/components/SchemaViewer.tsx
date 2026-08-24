'use client';

import { DatabaseSchema, TableDefinition } from '@/types';
import {
  Database,
  Table as TableIcon,
  Key,
  Link as LinkIcon,
  Layers,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface Props {
  schemas: DatabaseSchema[];
  activeSchema: DatabaseSchema;
  onSelectSchema: (schema: DatabaseSchema) => void;
}

export default function SchemaViewer({
  schemas,
  activeSchema,
  onSelectSchema,
}: Props) {
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
                Select a database domain to inspect relational foreign keys &amp; columns
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
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {activeSchema.tables.map((table) => (
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
                  {table.columns.map((col) => (
                    <div
                      key={col.name}
                      className="p-2.5 flex items-center justify-between gap-2 hover:bg-slate-900/40 transition-colors"
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
                        <span className="font-bold text-slate-200 text-xs truncate">
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
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
