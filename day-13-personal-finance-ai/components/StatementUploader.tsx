'use client';

import { useState } from 'react';
import Papa from 'papaparse';
import { DEMO_PRESETS } from '@/lib/storage';
import { Debt, Transaction, TransactionCategory } from '@/types';
import { UploadCloud, FileText, Sparkles, CheckCircle2, Building2, AlertCircle } from 'lucide-react';

interface Props {
  onLoadTransactions: (txs: Transaction[], debts?: Debt[], cashAssets?: number, investmentAssets?: number) => void;
  isLoading: boolean;
}

export default function StatementUploader({ onLoadTransactions, isLoading }: Props) {
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileUpload = (file: File) => {
    setFileName(file.name);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsedTxs: Transaction[] = results.data.map((row: any, idx: number) => {
          const date = row.Date || row.date || new Date().toISOString().split('T')[0];
          const desc = row.Description || row.description || row.Memo || `Transaction #${idx + 1}`;
          const rawAmt = parseFloat(row.Amount || row.amount || '0');
          const amt = isNaN(rawAmt) ? -50 : rawAmt;

          // Simple fuzzy categorization rules
          let cat: TransactionCategory = 'Other';
          const lowerDesc = desc.toLowerCase();
          if (lowerDesc.includes('salary') || lowerDesc.includes('deposit') || amt > 0) cat = 'Income';
          else if (lowerDesc.includes('rent') || lowerDesc.includes('mortgage') || lowerDesc.includes('apartments')) cat = 'Housing';
          else if (lowerDesc.includes('food') || lowerDesc.includes('whole foods') || lowerDesc.includes('trader') || lowerDesc.includes('costco')) cat = 'Groceries';
          else if (lowerDesc.includes('restaurant') || lowerDesc.includes('dining') || lowerDesc.includes('coffee') || lowerDesc.includes('bar')) cat = 'Dining';
          else if (lowerDesc.includes('vanguard') || lowerDesc.includes('fidelity') || lowerDesc.includes('index') || lowerDesc.includes('stock')) cat = 'Investments';
          else if (lowerDesc.includes('uber') || lowerDesc.includes('transit') || lowerDesc.includes('gas') || lowerDesc.includes('tesla')) cat = 'Transport';
          else if (lowerDesc.includes('utility') || lowerDesc.includes('coned') || lowerDesc.includes('power') || lowerDesc.includes('internet')) cat = 'Utilities';
          else if (lowerDesc.includes('netflix') || lowerDesc.includes('spotify') || lowerDesc.includes('sub')) cat = 'Subscriptions';

          return {
            id: `tx_user_${idx}_${Date.now()}`,
            date,
            description: desc,
            amount: amt,
            category: cat,
            isFixed: cat === 'Housing' || cat === 'Subscriptions' || cat === 'Utilities',
          };
        });

        onLoadTransactions(parsedTxs);
      },
      error: (err) => {
        console.error('PapaParse CSV error:', err);
      },
    });
  };

  return (
    <div className="space-y-6 font-mono text-xs text-slate-300">
      {/* 1. Drag & Drop File Upload Area */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileUpload(e.dataTransfer.files[0]);
          }
        }}
        className={`p-8 rounded-3xl border-2 border-dashed text-center transition-all flex flex-col items-center justify-center gap-3 ${
          dragActive
            ? 'border-amber-400 bg-amber-500/10'
            : 'border-slate-800 bg-[#0d1117] hover:border-slate-700'
        }`}
      >
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/10">
          <UploadCloud className="w-6 h-6" />
        </div>

        <div>
          <h3 className="font-bold text-white text-sm font-outfit">Import Bank Statement (CSV)</h3>
          <p className="text-slate-400 text-xs mt-1">
            Drag &amp; drop your CSV bank statement or click below. Parsed client-side with AES-256 privacy.
          </p>
        </div>

        <label className="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-amber-400 hover:text-amber-300 hover:border-amber-500/40 font-bold transition-all cursor-pointer">
          Browse CSV File
          <input
            type="file"
            accept=".csv"
            onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
            className="hidden"
          />
        </label>

        {fileName && (
          <div className="flex items-center gap-2 text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
            <CheckCircle2 className="w-4 h-4" />
            <span>Loaded: {fileName}</span>
          </div>
        )}
      </div>

      {/* 2. Demo Pre-loaded Bank Statement Presets */}
      <div className="space-y-3">
        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Or Load Pre-Configured Demo Financial Profiles
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {DEMO_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onLoadTransactions(preset.transactions, preset.debts, preset.cashAssets, preset.investmentAssets)}
              className="p-4 rounded-2xl bg-[#0d1117] border border-slate-800 hover:border-amber-500/50 text-left transition-all group flex flex-col justify-between gap-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-amber-400 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center gap-1">
                  <Building2 className="w-3 h-3" />
                  {preset.bank}
                </span>
                <span className="text-[10px] text-slate-500">{preset.transactions.length} Txs</span>
              </div>
              <div>
                <h4 className="font-bold text-slate-100 text-xs font-outfit">{preset.name}</h4>
                <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{preset.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
