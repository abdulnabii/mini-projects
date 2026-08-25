'use client';

import { useState } from 'react';
import { GeneratedQuery } from '@/types';
import {
  Activity,
  Layers,
  Zap,
  Clock,
  Database,
  ArrowDown,
  CheckCircle2,
  Copy,
  Check,
  Cpu,
  TrendingDown,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  queryData: GeneratedQuery;
}

export default function QueryExecutionPlan({ queryData }: Props) {
  const [copiedMigration, setCopiedMigration] = useState(false);

  const migrationScript = queryData.optimizationTips
    ?.filter((t) => t.includes('CREATE INDEX'))
    ?.map((t) => {
      const match = t.match(/CREATE INDEX[^\—\-\n]+/i);
      return match ? match[0].trim() + ';' : t;
    })
    ?.join('\n') || `CREATE INDEX idx_queryforge_lookup ON orders(customer_id, status, created_at);\nANALYZE orders;`;

  const copyMigration = () => {
    navigator.clipboard.writeText(migrationScript);
    setCopiedMigration(true);
    setTimeout(() => setCopiedMigration(false), 2000);
    confetti({
      particleCount: 20,
      spread: 50,
      origin: { y: 0.7 },
      colors: ['#10b981', '#06b6d4'],
    });
  };

  const steps = [
    {
      stage: '1. Index Scan & Predicate Filter',
      operation: 'Bitmap Index Scan on idx_country_date',
      cost: 'Cost: 0.42..8.45',
      time: '~4ms',
      color: 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300',
      badge: 'Index Scan',
      details: 'Filters matching records from disk buffer using index without table scan.',
    },
    {
      stage: '2. Relational Hash Join',
      operation: 'Hash Join (customers.id = orders.customer_id)',
      cost: 'Cost: 8.45..142.20',
      time: '~12ms',
      color: 'border-cyan-500/40 bg-cyan-950/20 text-cyan-300',
      badge: 'Hash Join',
      details: 'Builds in-memory hash table of customer foreign keys to join matching order rows.',
    },
    {
      stage: '3. Group Aggregate Accumulator',
      operation: 'HashAggregate: SUM(total_amount), COUNT(id)',
      cost: 'Cost: 142.20..156.40',
      time: '~8ms',
      color: 'border-purple-500/40 bg-purple-950/20 text-purple-300',
      badge: 'Aggregate',
      details: 'Computes group totals and order counts grouped by customer identity.',
    },
    {
      stage: '4. Top-N Heapsort & Limit',
      operation: 'Top-N Sort (ORDER BY revenue DESC LIMIT 10)',
      cost: 'Cost: 156.40..156.42',
      time: '~2ms',
      color: 'border-amber-500/40 bg-amber-950/20 text-amber-300',
      badge: 'Limit Top-10',
      details: 'Keeps top 10 rows in bounded memory heap and discards lower rank items.',
    },
  ];

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-[#0d1117] border border-cyan-500/30 shadow-2xl space-y-6 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-white text-base font-outfit">
                AI Query Execution Plan &amp; Cost Waterfall
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold">
                EXPLAIN ANALYZE Sim
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Estimated relational optimizer tree, cost distribution, and buffer metrics
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={copyMigration}
          className="px-3.5 py-2 rounded-xl bg-slate-900 border border-emerald-500/30 hover:bg-emerald-500/10 text-emerald-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
        >
          {copiedMigration ? (
            <Check className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <Copy className="w-3.5 h-3.5 text-emerald-400" />
          )}
          <span>{copiedMigration ? 'DDL Copied!' : 'Copy Index Migration DDL'}</span>
        </button>
      </div>

      {/* 3 Metric Telemetry Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
        <div className="p-3.5 rounded-2xl bg-[#161b22] border border-slate-800 space-y-1">
          <span className="text-[10px] text-emerald-400 font-bold uppercase flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Buffer Cache Hit Ratio
          </span>
          <div className="text-lg font-black text-white">99.4% (Hot Cache)</div>
          <p className="text-[10px] text-slate-400">Zero disk thrashing detected</p>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#161b22] border border-slate-800 space-y-1">
          <span className="text-[10px] text-cyan-400 font-bold uppercase flex items-center gap-1">
            <TrendingDown className="w-3 h-3" /> Total Planner Cost
          </span>
          <div className="text-lg font-black text-cyan-300">156.42 Cost Units</div>
          <p className="text-[10px] text-slate-400">Optimized index scan priority</p>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#161b22] border border-slate-800 space-y-1">
          <span className="text-[10px] text-purple-400 font-bold uppercase flex items-center gap-1">
            <Cpu className="w-3 h-3" /> Memory Footprint
          </span>
          <div className="text-lg font-black text-purple-300">&lt; 24 KB (WorkMem)</div>
          <p className="text-[10px] text-slate-400">In-memory hash table bounds</p>
        </div>
      </div>

      {/* Step-by-Step Waterfall Pipeline */}
      <div className="space-y-3 pt-2">
        <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1">
          <Layers className="w-3.5 h-3.5 text-amber-400" />
          <span>Execution Pipeline Stages:</span>
        </span>

        <div className="space-y-3">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${step.color}`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-black/40 text-[9px] font-bold uppercase font-mono">
                    {step.badge}
                  </span>
                  <h4 className="font-bold text-white text-xs font-outfit">
                    {step.stage}
                  </h4>
                </div>
                <p className="text-[11px] text-slate-300 font-mono">
                  {step.operation}
                </p>
                <p className="text-[10px] text-slate-400 font-sans">
                  {step.details}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0 text-right sm:text-right">
                <div>
                  <div className="text-[11px] font-bold text-white">{step.time}</div>
                  <div className="text-[9px] text-slate-400 font-mono">{step.cost}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Migration Script DDL Box */}
      <div className="p-4 rounded-2xl bg-[#04080e] border border-slate-800 space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-emerald-400 font-bold uppercase flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Instant DDL Migration Script:</span>
          </span>
          <span className="text-[9px] text-slate-500">PostgreSQL / MySQL DDL</span>
        </div>

        <pre className="p-3 rounded-xl bg-[#0d1117] border border-slate-800 text-[11px] text-emerald-300 font-mono leading-relaxed overflow-x-auto">
          {migrationScript}
        </pre>
      </div>
    </div>
  );
}
