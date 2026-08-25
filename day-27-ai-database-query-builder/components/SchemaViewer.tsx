'use client';

import { useState } from 'react';
import { DatabaseSchema, TableDefinition } from '@/types';
import {
  Database,
  Table as TableIcon,
  Key,
  Link as LinkIcon,
  Search,
  Filter,
  RefreshCw,
  Hash,
  Calendar,
  FileText,
  Copy,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';

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
  const [copiedTable, setCopiedTable] = useState<string | null>(null);

  const filteredTables = activeSchema.tables.filter((t) =>
    t.name.toLowerCase().includes(tableSearch.toLowerCase()) ||
    t.description.toLowerCase().includes(tableSearch.toLowerCase()) ||
    t.columns.some((c) => c.name.toLowerCase().includes(tableSearch.toLowerCase()))
  );

  const copyTableDDL = (table: TableDefinition) => {
    const colDefs = table.columns
      .map(
        (c) =>
          `  ${c.name} ${c.type}${c.isPrimary ? ' PRIMARY KEY' : ''}${
            c.isForeignKey ? ` REFERENCES ${c.references}` : ''
          }`
      )
      .join(',\n');
    const ddl = `CREATE TABLE ${table.name} (\n${colDefs}\n);`;
    navigator.clipboard.writeText(ddl);
    setCopiedTable(table.name);
    setTimeout(() => setCopiedTable(null), 2000);
  };

  const getColTypeIcon = (type: string) => {
    if (type.includes('INT') || type.includes('DECIMAL') || type.includes('BIGINT')) {
      return <Hash className="w-3 h-3 text-cyan-400 shrink-0" />;
    }
    if (type.includes('TIME') || type.includes('DATE')) {
      return <Calendar className="w-3 h-3 text-purple-400 shrink-0" />;
    }
    return <FileText className="w-3 h-3 text-slate-400 shrink-0" />;
  };

  return (
    <div className="space-y-6 font-mono">
      {/* Schema Control Panel */}
      <div className="p-6 rounded-2xl bg-[#0d1117] border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <Database className="w-4 h-4 text-emerald-400" />
            <div>
              <h3 className="font-bold text-white text-sm font-mono">
                Database Schema Architecture Explorer
              </h3>
              <p className="text-xs text-slate-400 prose-text">
                Inspect relational tables, primary keys, and foreign key relationships
              </p>
            </div>
          </div>

          <span className="text-[10px] text-emerald-400 font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 font-mono">
            {activeSchema.tables.length} TABLES REGISTERED
          </span>
        </div>

        {/* Unified Schema Switcher Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {schemas.map((s) => {
            const isSelected = activeSchema.id === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => onSelectSchema(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-500 text-black font-bold shadow-sm'
                    : 'bg-[#161b22] border border-slate-800 text-slate-300 hover:text-white hover:border-emerald-500/40'
                }`}
              >
                <span>{s.name}</span>
              </button>
            );
          })}
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={tableSearch}
              onChange={(e) => setTableSearch(e.target.value)}
              placeholder="Search tables or columns..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#161b22] border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 font-mono"
            />
          </div>

          {/* Standardized Pills for Filters */}
          <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-900 border border-slate-800 text-[10px] overflow-x-auto">
            <Filter className="w-3 h-3 text-slate-400 ml-1" />
            {(['all', 'pk', 'fk', 'number', 'date'] as const).map((ft) => (
              <button
                key={ft}
                type="button"
                onClick={() => setTypeFilter(ft)}
                className={`px-2 py-0.5 rounded-md uppercase font-mono font-bold transition-all cursor-pointer ${
                  typeFilter === ft
                    ? 'bg-emerald-500 text-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {ft === 'all' ? 'ALL' : ft === 'pk' ? 'PK' : ft === 'fk' ? 'FK' : ft === 'number' ? 'NUMERIC' : 'DATES'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* EMPTY SEARCH STATE */}
      {filteredTables.length === 0 ? (
        <div className="p-12 rounded-2xl bg-[#0d1117] border border-dashed border-slate-800 text-center space-y-3 font-mono">
          <Database className="w-8 h-8 text-slate-600 mx-auto" />
          <div className="space-y-1">
            <h4 className="font-bold text-white text-sm">No Matching Tables or Columns</h4>
            <p className="text-xs text-slate-400 prose-text">
              No schema objects match your filter query "{tableSearch}".
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setTableSearch('');
              setTypeFilter('all');
            }}
            className="px-3.5 py-1.5 rounded-lg bg-emerald-500 text-black font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        </div>
      ) : (
        /* Literal Database Tables Grid (pgAdmin / DataGrip Style) */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredTables.map((table) => {
            const visibleColumns = table.columns.filter((c) => {
              if (typeFilter === 'pk') return c.isPrimary;
              if (typeFilter === 'fk') return c.isForeignKey;
              if (typeFilter === 'number') return c.type.includes('INT') || c.type.includes('DECIMAL') || c.type.includes('BIGINT');
              if (typeFilter === 'date') return c.type.includes('TIME') || c.type.includes('DATE');
              return true;
            });

            return (
              <div
                key={table.name}
                className="rounded-xl bg-[#0d1117] border border-slate-800 shadow-xl overflow-hidden flex flex-col justify-between hover:border-emerald-500/40 transition-all group"
              >
                <div>
                  {/* Literal DBMS Table Header Bar */}
                  <div className="px-4 py-2.5 bg-[#161b22] border-b border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TableIcon className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="font-bold text-white text-xs font-mono">
                        public.{table.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400 font-mono">
                        ~{table.rowCountEstimate.toLocaleString()} rows
                      </span>
                      <button
                        type="button"
                        onClick={() => copyTableDDL(table)}
                        className="p-1 rounded-md bg-slate-900 border border-slate-800 text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer"
                        title="Copy CREATE TABLE DDL"
                      >
                        {copiedTable === table.name ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  </div>

                  <p className="px-4 py-2 text-[11px] text-slate-400 prose-text border-b border-slate-800/60 bg-[#080d13]">
                    {table.description}
                  </p>

                  {/* Columns List with Alternating Row Shading */}
                  <div className="text-xs">
                    {visibleColumns.map((col, idx) => (
                      <button
                        key={col.name}
                        type="button"
                        onClick={() => onColumnClick && onColumnClick(table.name, col.name)}
                        className={`w-full text-left px-4 py-2 flex items-center justify-between gap-2 border-b border-slate-800/40 transition-colors cursor-pointer hover:bg-emerald-950/20 ${
                          idx % 2 === 0 ? 'bg-[#0d1117]' : 'bg-[#090e15]'
                        }`}
                        title="Click to reference column in query prompt"
                      >
                        <div className="flex items-center gap-2 truncate">
                          {col.isPrimary ? (
                            <span className="px-1.5 py-0.2 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[9px] font-bold font-mono">
                              PK
                            </span>
                          ) : col.isForeignKey ? (
                            <span className="px-1.5 py-0.2 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[9px] font-bold font-mono">
                              FK
                            </span>
                          ) : (
                            <span className="p-0.5">{getColTypeIcon(col.type)}</span>
                          )}
                          <span className="font-mono font-medium text-slate-200 text-xs truncate group-hover:text-emerald-300 transition-colors">
                            {col.name}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0 text-[10px] font-mono">
                          <span className="text-cyan-400 font-bold">
                            {col.type}
                          </span>
                          {col.references && (
                            <span className="px-1.5 py-0.2 rounded-md bg-slate-900 border border-slate-800 text-slate-400 text-[9px]">
                              → {col.references}
                            </span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
