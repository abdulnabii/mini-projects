'use client';

import { useState } from 'react';
import { DatabaseSchema } from '@/types';
import { SAMPLE_SCHEMAS } from '@/lib/sampleSchemas';
import SchemaViewer from '@/components/SchemaViewer';
import { Database, ArrowLeft, Terminal } from 'lucide-react';
import Link from 'next/link';

export default function SchemaPage() {
  const [schemas] = useState<DatabaseSchema[]>(SAMPLE_SCHEMAS);
  const [activeSchema, setActiveSchema] = useState<DatabaseSchema>(SAMPLE_SCHEMAS[0]);

  return (
    <div className="space-y-8 font-mono w-full min-w-0">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#0d1117] border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white font-outfit">
              Database Schema Architecture Explorer
            </h1>
            <p className="text-xs text-slate-400">
              Inspect database tables, column data types, and foreign key relations
            </p>
          </div>
        </div>

        <Link
          href="/"
          className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white font-bold transition-all flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Query Builder</span>
        </Link>
      </div>

      {/* Schema Viewer */}
      <SchemaViewer
        schemas={schemas}
        activeSchema={activeSchema}
        onSelectSchema={setActiveSchema}
      />
    </div>
  );
}
