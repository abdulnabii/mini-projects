import { Database, Terminal, ShieldAlert, BarChart2, Zap, Layers } from 'lucide-react';

const FAQS = [
  {
    icon: Database,
    q: 'Which database dialects and ORM syntax does QueryForge.AI support?',
    a: 'QueryForge.AI natively translates plain English prompts into production-grade PostgreSQL, MySQL, SQLite, MongoDB Aggregation Pipelines, Prisma ORM queries, and Drizzle ORM schemas. You can toggle between dialects with a single click without re-typing your prompt.',
  },
  {
    icon: ShieldAlert,
    q: 'How does QueryForge.AI protect against SQL injection and destructive queries?',
    a: 'All generated SQL is processed through a strict AST validation pipeline using sqlparser. The engine enforces mandatory LIMIT 1000 bounds on SELECT statements and actively blocks or requires explicit confirmation for high-risk operations like DROP TABLE, TRUNCATE, or unindexed mass DELETE statements.',
  },
  {
    icon: Zap,
    q: 'What is the Relational Query Execution Plan visualizer?',
    a: 'The Execution Plan tab transforms complex SQL queries into a visual tree of operations (Index Scans, Hash Joins, Nested Loops, Sort Operations). It estimates relational complexity (LOW, MEDIUM, HIGH) and provides actionable index recommendations (e.g. composite B-tree index creation) to accelerate execution speed by up to 10x.',
  },
  {
    icon: BarChart2,
    q: 'How does the AutoChart feature convert query results into dashboards?',
    a: 'When a query executes, QueryForge.AI analyzes column cardinality and numerical types to auto-select the best visualization: Bar charts for category revenue, Line charts for date-series trends, Pie charts for percentage shares, or scannable data tables with CSV and JSON export.',
  },
  {
    icon: Layers,
    q: 'How does the Schema Explorer and Click-to-Prompt workflow function?',
    a: 'The Schema Explorer inspects your relational or document database schema, displaying table structures, primary keys, foreign key relations, and column data types. Clicking any column instantly inserts it into your prompt box for rapid query composition.',
  },
  {
    icon: Terminal,
    q: 'Can QueryForge.AI explain existing complex legacy SQL queries?',
    a: 'Yes. In addition to text-to-SQL generation, the studio breaks down complex multi-table JOINs, subqueries, and window functions into 2-sentence plain English explanations so non-technical stakeholders and engineers can collaborate effortlessly.',
  },
];

export default function AEOFAQSection() {
  return (
    <section className="space-y-6 font-mono" aria-label="Frequently Asked Questions about QueryForge.AI">
      {/* Section Header */}
      <div className="flex items-center gap-2">
        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 text-[10px] font-bold border border-emerald-500/30 uppercase">
          DATABASE KNOWLEDGE HUB &amp; AEO DIRECTORY
        </span>
        <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          QueryForge.AI — Frequently Asked Questions &amp; Database Engineering
        </h2>
      </div>

      {/* FAQ Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {FAQS.map(({ icon: Icon, q, a }) => (
          <div
            key={q}
            className="p-5 rounded-2xl bg-[#0d1117] border border-slate-800 hover:border-emerald-500/40 transition-colors space-y-2.5 shadow-lg"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                <Icon className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-white leading-snug font-outfit">{q}</h3>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed pl-11 font-sans">{a}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
