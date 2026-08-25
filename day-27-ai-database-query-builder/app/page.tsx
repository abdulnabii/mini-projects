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
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function QueryStudioPage() {
  const [schemas, setSchemas] = useState<DatabaseSchema[]>(SAMPLE_SCHEMAS);
  const [activeSchema, setActiveSchema] = useState<DatabaseSchema>(SAMPLE_SCHEMAS[0]);
  const [dialect, setDialect] = useState<DatabaseDialect>('postgres');
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<'editor' | 'plan' | 'chart' | 'schema'>('editor');

  const [isLoading, setIsLoading] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);

  const [generatedQuery, setGeneratedQuery] = useState<GeneratedQuery | null>(null);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);

  // Generate initial query on mount for demo
  useEffect(() => {
    handleGenerate(activeSchema.sampleQuestions[0]);
  }, [activeSchema, dialect]);

  const handleGenerate = async (questionText: string) => {
    if (!questionText.trim()) return;

    setIsLoading(true);
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
      if (data.generatedQuery) {
        setGeneratedQuery(data.generatedQuery);
        // Auto execute mock result on generation
        handleExecute(data.generatedQuery.query);
      }
    } catch (e) {
      console.error('Failed to generate query:', e);
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
    // Append clicked column name to prompt
    handleGenerate(`Show me records from ${tableName} with column ${columnName} and calculate aggregates`);
    setActiveWorkspaceTab('editor');
  };

  return (
    <div className="space-y-10 font-mono w-full min-w-0">
      {/* Centered Hero Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs">
          <Database className="w-3.5 h-3.5" />
          <span>NATURAL LANGUAGE DATABASE QUERY BUILDER &amp; ORM TRANSLATOR</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight font-outfit">
          Ask in Plain English.{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400">
            Get Production SQL &amp; ORM
          </span>
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm font-mono max-w-2xl mx-auto leading-relaxed">
          Translate plain text questions into PostgreSQL, MySQL, MongoDB, SQLite, Prisma, and Drizzle ORM queries with index optimization tips and auto-visualized data charts.
        </p>
      </div>

      {/* 4 Quick Metric Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 max-w-5xl mx-auto font-mono text-left">
        <div className="p-4 rounded-2xl bg-[#0d1117] border border-emerald-500/20 space-y-1 shadow-lg">
          <span className="text-[10px] text-emerald-400 font-bold uppercase flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5" /> Multi-Dialect
          </span>
          <div className="text-lg font-black text-white">6 DB Engines</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0d1117] border border-cyan-500/20 space-y-1 shadow-lg">
          <span className="text-[10px] text-cyan-400 font-bold uppercase flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5" /> Active Schema
          </span>
          <div className="text-lg font-black text-cyan-300 truncate">
            {activeSchema.name.split('&')[0]}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0d1117] border border-purple-500/20 space-y-1 shadow-lg">
          <span className="text-[10px] text-purple-400 font-bold uppercase flex items-center gap-1.5">
            <Play className="w-3.5 h-3.5" /> Live Sandbox
          </span>
          <div className="text-lg font-black text-purple-300">
            {executionResult ? `${executionResult.executionTimeMs}ms Latency` : 'Instant Exec'}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0d1117] border border-amber-500/20 space-y-1 shadow-lg">
          <span className="text-[10px] text-amber-400 font-bold uppercase flex items-center gap-1.5">
            <BarChart2 className="w-3.5 h-3.5" /> Auto-Charts
          </span>
          <div className="text-lg font-black text-amber-300">Instant Viz Engine</div>
        </div>
      </div>

      {/* Schema Quick Switcher Dropdown */}
      <div className="p-4 rounded-2xl bg-[#0d1117] border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-emerald-400" />
          <span className="text-slate-400 font-bold uppercase text-[10px]">Select Database Domain:</span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {schemas.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setActiveSchema(s)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                activeSchema.id === s.id
                  ? 'bg-emerald-500 text-black font-black shadow-md'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <span>{s.category}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Natural Language Query Input Form */}
      <QueryInput
        schema={activeSchema}
        dialect={dialect}
        onDialectChange={setDialect}
        onGenerate={handleGenerate}
        isLoading={isLoading}
      />

      {/* Studio View Navigation Tabs */}
      <div className="flex items-center justify-center">
        <div className="p-1.5 rounded-2xl bg-[#0d1117] border border-slate-800 flex items-center gap-1.5 max-w-full overflow-x-auto shadow-xl">
          <button
            type="button"
            onClick={() => setActiveWorkspaceTab('editor')}
            className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeWorkspaceTab === 'editor'
                ? 'bg-emerald-500 text-black font-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>Generated Query &amp; Table</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveWorkspaceTab('plan')}
            className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeWorkspaceTab === 'plan'
                ? 'bg-cyan-500 text-black font-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Execution Plan (EXPLAIN)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveWorkspaceTab('chart')}
            className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeWorkspaceTab === 'chart'
                ? 'bg-purple-500 text-black font-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BarChart2 className="w-4 h-4" />
            <span>Data Visualization Studio</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveWorkspaceTab('schema')}
            className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeWorkspaceTab === 'schema'
                ? 'bg-amber-500 text-black font-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Schema Explorer</span>
          </button>
        </div>
      </div>

      {/* TAB 1: CODE EDITOR & RESULT TABLE */}
      {activeWorkspaceTab === 'editor' && (
        <div className="space-y-8 animate-in fade-in duration-200">
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
            <p className="text-center text-slate-500 py-12">Please generate a query first.</p>
          )}
        </div>
      )}

      {/* TAB 3: AUTO CHARTS & DATA STUDIO */}
      {activeWorkspaceTab === 'chart' && (
        <div className="animate-in fade-in duration-200">
          {executionResult ? (
            <AutoChart result={executionResult} />
          ) : (
            <p className="text-center text-slate-500 py-12">Execute a query to visualize data.</p>
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
