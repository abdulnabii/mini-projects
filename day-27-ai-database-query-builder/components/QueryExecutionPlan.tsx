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
      badge: 'INDEX SCAN',
      details: 'Filters matching records from disk buffer using index without table scan.',
    },
    {
      stage: '2. Relational Hash Join',
      operation: 'Hash Join (customers.id = orders.customer_id)',
      cost: 'Cost: 8.45..142.20',
      time: '~12ms',
      badge: 'HASH JOIN',
      details: 'Builds in-memory hash table of customer foreign keys to join matching order rows.',
    },
    {
      stage: '3. Group Aggregate Accumulator',
      operation: 'HashAggregate: SUM(total_amount), COUNT(id)',
      cost: 'Cost: 142.20..156.40',
      time: '~8ms',
      badge: 'AGGREGATE',
      details: 'Computes group totals and order counts grouped by customer identity.',
    },
    {
      stage: '4. Top-N Heapsort & Limit',
      operation: 'Top-N Sort (ORDER BY revenue DESC LIMIT 10)',
      cost: 'Cost: 156.40..156.42',
      time: '~2ms',
      badge: 'TOP-N LIMIT',
      details: 'Keeps top 10 rows in bounded memory heap and discards lower rank items.',
    },
  ];

  return (
    <div className="p-6 sm:p-8 rounded-2xl bg-[#0d1117] border border-slate-800 shadow-xl space-y-6 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-white text-sm font-mono">
                AI Query Execution Plan &amp; Cost Waterfall
              </h3>
              <span className="px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold font-mono">
                EXPLAIN ANALYZE SIM
              </span>
            </div>
            <p className="text-xs text-slate-400 prose-text">
              Relational query tree planner, cost distribution, and buffer metrics
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={copyMigration}
          className="px-3 py-1.5 rounded-lg bg-[#161b22] border border-emerald-500/30 hover:bg-emerald-500/10 text-emerald-300 text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer"
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="p-3.5 rounded-xl bg-[#161b22] border border-slate-800 space-y-1">
          <span className="text-[10px] text-emerald-400 font-bold uppercase font-mono flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Cache Hit Ratio
          </span>
          <div className="text-base font-bold text-white font-mono">99.4% (Hot Cache)</div>
          <p className="text-[10px] text-slate-400 prose-text">Zero disk thrashing detected</p>
        </div>

        <div className="p-3.5 rounded-xl bg-[#161b22] border border-slate-800 space-y-1">
          <span className="text-[10px] text-amber-400 font-bold uppercase font-mono flex items-center gap-1">
            <TrendingDown className="w-3 h-3" /> Planner Cost
          </span>
          <div className="text-base font-bold text-amber-300 font-mono">156.42 Cost Units</div>
          <p className="text-[10px] text-slate-400 prose-text">Index scan priority applied</p>
        </div>

        <div className="p-3.5 rounded-xl bg-[#161b22] border border-slate-800 space-y-1">
          <span className="text-[10px] text-cyan-400 font-bold uppercase font-mono flex items-center gap-1">
            <Cpu className="w-3 h-3" /> Memory Footprint
          </span>
          <div className="text-base font-bold text-cyan-300 font-mono">&lt; 24 KB (WorkMem)</div>
          <p className="text-[10px] text-slate-400 prose-text">In-memory hash table bounds</p>
        </div>
      </div>

      {/* Step-by-Step Waterfall Pipeline */}
      <div className="space-y-2.5 pt-1">
        <span className="text-[10px] text-slate-400 font-bold uppercase font-mono flex items-center gap-1">
          <Layers className="w-3.5 h-3.5 text-emerald-400" />
          <span>Execution Pipeline Stages:</span>
        </span>

        <div className="space-y-2.5">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl border border-slate-800 bg-[#161b22] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-emerald-500/40 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-700 text-cyan-300 text-[9px] font-bold font-mono">
                    {step.badge}
                  </span>
                  <h4 className="font-bold text-white text-xs font-mono">
                    {step.stage}
                  </h4>
                </div>
                <p className="text-[11px] text-emerald-300 font-mono">
                  {step.operation}
                </p>
                <p className="text-[10px] text-slate-400 prose-text">
                  {step.details}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0 text-right sm:text-right font-mono">
                <div>
                  <div className="text-[11px] font-bold text-white">{step.time}</div>
                  <div className="text-[9px] text-amber-400">{step.cost}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Migration Script DDL Box */}
      <div className="p-4 rounded-xl bg-[#04080e] border border-slate-800 space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-emerald-400 font-bold uppercase font-mono flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Instant DDL Migration Script:</span>
          </span>
          <span className="text-[9px] text-slate-500 font-mono">PostgreSQL / MySQL DDL</span>
        </div>

        <pre className="p-3 rounded-lg bg-[#0d1117] border border-slate-800 text-[11px] text-emerald-300 font-mono leading-relaxed overflow-x-auto">
          {migrationScript}
        </pre>
      </div>
    </div>
  );
}
