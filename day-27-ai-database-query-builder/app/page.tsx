'use client';

import { useState, useEffect } from 'react';
import {
  DatabaseSchema,
  DatabaseDialect,
  GeneratedQuery,
  ExecutionResult,
  SavedQuery,
} from '@/types';
import { SAMPLE_SCHEMAS } from '@/lib/sampleSchemas';
import { saveQuery } from '@/lib/storage';
import QueryInput from '@/components/QueryInput';
import QueryOutput from '@/components/QueryOutput';
import ResultTable from '@/components/ResultTable';
import AutoChart from '@/components/AutoChart';
import SchemaViewer from '@/components/SchemaViewer';
import QueryExecutionPlan from '@/components/QueryExecutionPlan';
import {
  Database,
  Terminal,
  Layers,
  Sparkles,
  Zap,
  Play,
  BarChart2,
  Table as TableIcon,
  CheckCircle2,
  Code2,
  Activity,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  AlertCircle,
  Info,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function QueryStudioPage() {
  const [schemas, setSchemas] = useState<DatabaseSchema[]>(SAMPLE_SCHEMAS);
  const [activeSchema, setActiveSchema] = useState<DatabaseSchema>(SAMPLE_SCHEMAS[0]);
  const [dialect, setDialect] = useState<DatabaseDialect>('postgres');
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<'editor' | 'plan' | 'chart' | 'schema'>('editor');

  // Auto-collapse hero density state
  const [isHeroCollapsed, setIsHeroCollapsed] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [queryError, setQueryError] = useState<string | null>(null);

  const [generatedQuery, setGeneratedQuery] = useState<GeneratedQuery | null>(null);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);

  // Generate initial query on mount for demo
  useEffect(() => {
    handleGenerate(activeSchema.sampleQuestions[0]);
  }, [activeSchema, dialect]);

  const handleGenerate = async (questionText: string) => {
    if (!questionText.trim()) return;

    setIsLoading(true);
    setQueryError(null);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: questionText,
          schema: activeSchema,
          dialect,
        }),
      });

      const data = await res.json();
      if (data.error) {
        setQueryError(data.error);
        return;
      }

      if (data.generatedQuery) {
        setGeneratedQuery(data.generatedQuery);
        // Auto-collapse hero overview after generation to maximize focus on results
        setIsHeroCollapsed(true);
        // Auto execute mock result on generation
        handleExecute(data.generatedQuery.query);
      }
    } catch (e: any) {
      console.error('Failed to generate query:', e);
      setQueryError('Failed to generate query. Please verify your query syntax and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExecute = async (queryText?: string) => {
    const q = queryText || generatedQuery?.query;
    if (!q) return;

    setIsExecuting(true);
    try {
      const res = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: q,
          dialect,
          schemaName: activeSchema.name,
        }),
      });

      const data = await res.json();
      if (data.result) {
        setExecutionResult(data.result);
      }
    } catch (e) {
      console.error('Failed to execute query:', e);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleSaveQuery = () => {
    if (!generatedQuery) return;
    const newSaved: SavedQuery = {
      id: 'saved_' + Date.now(),
      title: generatedQuery.question.slice(0, 60),
      question: generatedQuery.question,
      dialect: generatedQuery.dialect,
      schemaName: activeSchema.name,
      query: generatedQuery.query,
      explanation: generatedQuery.explanation,
      createdAt: new Date().toISOString(),
    };
    saveQuery(newSaved);
  };

  const handleColumnClick = (tableName: string, columnName: string) => {
    handleGenerate(`Show me records from ${tableName} with column ${columnName} and calculate aggregates`);
    setActiveWorkspaceTab('editor');
  };

  return (
    <div className="space-y-6 font-mono w-full min-w-0">
      {/* COLLAPSIBLE HERO SECTION */}
      {!isHeroCollapsed ? (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Centered Hero Header */}
          <div className="text-center space-y-2.5 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
              <Database className="w-3.5 h-3.5" />
              <span>AI DATABASE QUERY ENGINE &amp; ORM TRANSLATOR</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight font-mono">
              Ask in Plain English.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500">
                Get Production SQL &amp; ORM
              </span>
            </h1>
            <p className="text-slate-400 text-xs font-mono max-w-2xl mx-auto leading-relaxed prose-text">
              Translate plain text questions into PostgreSQL, MySQL, MongoDB, SQLite, Prisma, and Drizzle ORM queries with index optimization tips and auto-visualized data charts.
            </p>
          </div>

          {/* 4 Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-5xl mx-auto font-mono text-left">
            <div className="p-3.5 rounded-xl bg-[#0d1117] border border-slate-800 space-y-1 hover:border-emerald-500/30 transition-colors">
              <span className="text-[10px] text-emerald-400 font-bold uppercase flex items-center gap-1.5 font-mono">
                <Terminal className="w-3.5 h-3.5" /> Multi-Dialect
              </span>
              <div className="text-base font-bold text-white font-mono">6 DB Engines</div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0d1117] border border-slate-800 space-y-1 hover:border-cyan-500/30 transition-colors">
              <span className="text-[10px] text-cyan-400 font-bold uppercase flex items-center gap-1.5 font-mono">
                <Database className="w-3.5 h-3.5" /> Active Schema
              </span>
              <div className="text-base font-bold text-cyan-300 truncate font-mono">
                {activeSchema.name.split('&')[0]}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0d1117] border border-slate-800 space-y-1 hover:border-purple-500/30 transition-colors">
              <span className="text-[10px] text-purple-400 font-bold uppercase flex items-center gap-1.5 font-mono">
                <Play className="w-3.5 h-3.5" /> Sandbox Latency
              </span>
              <div className="text-base font-bold text-purple-300 font-mono">
                {executionResult ? `${executionResult.executionTimeMs}ms Latency` : 'Instant Exec'}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0d1117] border border-slate-800 space-y-1 hover:border-amber-500/30 transition-colors">
              <span className="text-[10px] text-amber-400 font-bold uppercase flex items-center gap-1.5 font-mono">
                <BarChart2 className="w-3.5 h-3.5" /> Auto-Charts
              </span>
              <div className="text-base font-bold text-amber-300 font-mono">Instant Viz Engine</div>
            </div>
          </div>

          {/* Schema Selector */}
          <div className="p-3.5 rounded-xl bg-[#0d1117] border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2">
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-slate-400 font-bold uppercase text-[10px]">Database Domain:</span>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              {schemas.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setActiveSchema(s)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                    activeSchema.id === s.id
                      ? 'bg-emerald-500 text-black font-bold shadow-sm'
                      : 'bg-[#161b22] border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span>{s.category}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* COMPACT COLLAPSED HERO TOOLBAR */
        <div className="p-3 rounded-xl bg-[#0d1117] border border-slate-800 flex items-center justify-between gap-3 text-xs font-mono shadow-md animate-in fade-in duration-150">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
              SCHEMA: {activeSchema.name.toUpperCase()}
            </span>
            <span className="text-slate-400 text-[11px] hidden sm:inline">
              ({activeSchema.tables.length} Tables Registered • Dialect: {dialect.toUpperCase()})
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsHeroCollapsed(false)}
            className="px-2.5 py-1 rounded-lg bg-[#161b22] border border-slate-800 hover:border-emerald-500/40 text-slate-300 hover:text-white text-xs font-mono font-medium flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>Expand Overview</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Natural Language Query Input Form */}
      <QueryInput
        schema={activeSchema}
        dialect={dialect}
        onDialectChange={setDialect}
        onGenerate={handleGenerate}
        isLoading={isLoading}
      />

      {/* ERROR STATE BANNER IF APPLICABLE */}
      {queryError && (
        <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/50 flex items-start gap-3 text-xs font-mono text-rose-200 shadow-md">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-white">Query Generation Notice</h4>
            <p>{queryError}</p>
          </div>
        </div>
      )}

      {/* Studio View Navigation Tabs with Visible Scroll Affordance */}
      <div className="relative">
        <div className="flex items-center justify-center overflow-x-auto pb-1 scrollbar-none">
          <div className="p-1 rounded-xl bg-[#0d1117] border border-slate-800 flex items-center gap-1 max-w-full shadow-lg font-mono text-xs">
            <button
              type="button"
              onClick={() => setActiveWorkspaceTab('editor')}
              className={`px-3.5 py-2 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeWorkspaceTab === 'editor'
                  ? 'bg-emerald-500 text-black font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Generated Query &amp; Table</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveWorkspaceTab('plan')}
              className={`px-3.5 py-2 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeWorkspaceTab === 'plan'
                  ? 'bg-emerald-500 text-black font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Execution Plan (EXPLAIN)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveWorkspaceTab('chart')}
              className={`px-3.5 py-2 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeWorkspaceTab === 'chart'
                  ? 'bg-emerald-500 text-black font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span>Data Visualization Studio</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveWorkspaceTab('schema')}
              className={`px-3.5 py-2 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeWorkspaceTab === 'schema'
                  ? 'bg-emerald-500 text-black font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>Schema Explorer</span>
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: CODE EDITOR & RESULT TABLE */}
      {activeWorkspaceTab === 'editor' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {generatedQuery && (
            <QueryOutput
              queryData={generatedQuery}
              onExecute={() => handleExecute()}
              onSave={handleSaveQuery}
              isExecuting={isExecuting}
            />
          )}

          {executionResult && <ResultTable result={executionResult} />}
        </div>
      )}

      {/* TAB 2: EXECUTION PLAN & EXPLAIN ANALYZE */}
      {activeWorkspaceTab === 'plan' && (
        <div className="animate-in fade-in duration-200">
          {generatedQuery ? (
            <QueryExecutionPlan queryData={generatedQuery} />
          ) : (
            <div className="p-12 rounded-2xl bg-[#0d1117] border border-slate-800 text-center text-slate-500 font-mono text-xs">
              Please generate a query to view its relational execution plan.
            </div>
          )}
        </div>
      )}

      {/* TAB 3: AUTO CHARTS & DATA STUDIO */}
      {activeWorkspaceTab === 'chart' && (
        <div className="animate-in fade-in duration-200">
          {executionResult ? (
            <AutoChart result={executionResult} />
          ) : (
            <div className="p-12 rounded-2xl bg-[#0d1117] border border-slate-800 text-center text-slate-500 font-mono text-xs">
              Execute a query to visualize data.
            </div>
          )}
        </div>
      )}

      {/* TAB 4: SCHEMA EXPLORER & CLICK-TO-PROMPT */}
      {activeWorkspaceTab === 'schema' && (
        <div className="animate-in fade-in duration-200">
          <SchemaViewer
            schemas={schemas}
            activeSchema={activeSchema}
            onSelectSchema={setActiveSchema}
            onColumnClick={handleColumnClick}
          />
        </div>
      )}
    </div>
  );
}
