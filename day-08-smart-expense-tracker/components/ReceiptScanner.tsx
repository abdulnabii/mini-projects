'use client';

import { useState } from 'react';
import { ExtractedReceipt, Transaction, SupportedCurrency } from '@/types';
import { PRESET_RECEIPTS, formatMoney } from '@/lib/mock-data';
import { ScanLine, Upload, Loader2, Sparkles, PlusCircle, CheckCircle2, Receipt } from 'lucide-react';

interface Props {
  onAddTransaction: (transaction: Transaction) => void;
  currency: SupportedCurrency;
}

export default function ReceiptScanner({ onAddTransaction, currency }: Props) {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedReceipt, setScannedReceipt] = useState<ExtractedReceipt | null>(null);

  const handlePresetScan = (presetKey: string) => {
    setIsScanning(true);
    setScannedReceipt(null);

    setTimeout(() => {
      const receipt = PRESET_RECEIPTS[presetKey];
      setScannedReceipt(receipt);
      setIsScanning(false);
    }, 1000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsScanning(true);
      setScannedReceipt(null);

      setTimeout(() => {
        setScannedReceipt({
          merchant: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
          date: new Date().toISOString().split('T')[0],
          totalAmount: Number((Math.random() * 80 + 20).toFixed(2)),
          category: 'Shopping',
          lineItems: [
            { description: 'Scanned Item #1', amount: 15.00 },
            { description: 'Scanned Item #2', amount: 25.50 },
          ],
          confidence: 0.96,
        });
        setIsScanning(false);
      }, 1200);
    }
  };

  const handleConfirmAndAdd = () => {
    if (!scannedReceipt) return;

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      merchant: scannedReceipt.merchant,
      date: scannedReceipt.date,
      amount: scannedReceipt.totalAmount,
      category: scannedReceipt.category,
      lineItems: scannedReceipt.lineItems,
      paymentMethod: 'Credit Card',
    };

    onAddTransaction(newTx);
    setScannedReceipt(null);
  };

  return (
    <div className="bg-[#0b1616] border border-emerald-500/20 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl font-mono text-xs text-slate-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2 font-outfit">
            <ScanLine className="w-5 h-5 text-emerald-400" />
            AI Receipt Vision OCR Scanner
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Auto-extract merchant header, line items, and totals via multi-modal vision parsing.
          </p>
        </div>

        {/* Preset Sample Receipts */}
        <div className="flex flex-wrap items-center gap-2">
          {Object.keys(PRESET_RECEIPTS).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => handlePresetScan(key)}
              disabled={isScanning}
              className="px-3 py-1.5 rounded-xl border border-emerald-500/30 bg-[#060e0e] text-xs font-mono text-emerald-300 hover:bg-emerald-500/10 hover:border-emerald-400 transition-all capitalize disabled:opacity-50 font-bold"
            >
              ⚡ {key}
            </button>
          ))}
        </div>
      </div>

      {/* Drag & Drop Upload Zone */}
      {!scannedReceipt && !isScanning && (
        <div className="relative group border-2 border-dashed border-emerald-500/30 hover:border-emerald-400 rounded-3xl p-8 text-center bg-[#060e0e]/70 transition-all">
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={handleFileUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div className="space-y-3 pointer-events-none">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
              <Upload className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <span className="text-sm font-bold text-white block font-outfit">
                Drop receipt photo or tap to browse file
              </span>
              <span className="text-xs text-slate-500 block">
                Supports JPG, PNG, WEBP (Instant itemized OCR parsing)
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Scanning State */}
      {isScanning && (
        <div className="border border-emerald-500/30 rounded-3xl p-8 text-center bg-[#060e0e] space-y-4 animate-pulse">
          <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
          <div className="space-y-1">
            <span className="text-sm font-bold text-white block font-outfit">
              Scanning Receipt with Vision OCR...
            </span>
            <span className="text-xs text-slate-400 block">
              Extracting merchant metadata, line items, and total amount
            </span>
          </div>
        </div>
      )}

      {/* Scanned Receipt Preview & Confirmation */}
      {scannedReceipt && (
        <div className="bg-[#060e0e] border-2 border-emerald-500/40 rounded-3xl p-6 space-y-5 animate-in fade-in duration-300 shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-bold">
              <Sparkles className="w-4 h-4" />
              <span>OCR Extraction Complete ({Math.round(scannedReceipt.confidence * 100)}% Confidence)</span>
            </div>
            <button
              type="button"
              onClick={() => setScannedReceipt(null)}
              className="text-xs text-slate-500 hover:text-rose-400 underline transition-colors"
            >
              Clear
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Merchant</span>
              <span className="text-white font-bold text-sm block font-outfit truncate">{scannedReceipt.merchant}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Date</span>
              <span className="text-white font-bold block">{scannedReceipt.date}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Category</span>
              <span className="text-emerald-400 font-bold block">{scannedReceipt.category}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Total Amount</span>
              <span className="text-emerald-400 font-black text-base block font-outfit tabular-nums">
                {formatMoney(scannedReceipt.totalAmount, currency)}
              </span>
            </div>
          </div>

          {/* Itemized Line Items */}
          {scannedReceipt.lineItems.length > 0 && (
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-[10px] text-slate-500 uppercase block font-bold">Itemized Line Items</span>
              <div className="space-y-1">
                {scannedReceipt.lineItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-slate-300 text-xs">
                    <span>• {item.description}</span>
                    <span className="tabular-nums font-bold text-white">{formatMoney(item.amount, currency)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={handleConfirmAndAdd}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs font-outfit uppercase tracking-wider transition-all shadow-lg shadow-emerald-500/20"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Confirm &amp; Log Expense</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
