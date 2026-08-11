'use client';

import { Transaction, ExpenseCategory } from '@/types';
import { CATEGORIES } from '@/lib/mock-data';
import { Search, Download, Trash2, Plus, Calendar, DollarSign, Tag } from 'lucide-react';
import { useState } from 'react';

interface Props {
  transactions: Transaction[];
  onAddTransaction: (t: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
}

export default function TransactionTable({
  transactions,
  onAddTransaction,
  onDeleteTransaction,
}: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [merchant, setMerchant] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('Food & Dining');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const filtered = transactions.filter((t) => {
    const matchesSearch =
      t.merchant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCat === 'ALL' || t.category === selectedCat;
    return matchesSearch && matchesCat;
  });

  const handleManualAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!merchant.trim() || !amount || isNaN(Number(amount))) return;

    const newTx: Transaction = {
      id: `tx-manual-${Date.now()}`,
      merchant: merchant.trim(),
      amount: Number(amount),
      category,
      date,
      paymentMethod: 'Credit Card',
    };

    onAddTransaction(newTx);
    setMerchant('');
    setAmount('');
    setShowAddModal(false);
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Date', 'Merchant', 'Category', 'Amount ($)', 'Payment Method'];
    const rows = filtered.map((t) => [
      t.id,
      t.date,
      `"${t.merchant}"`,
      `"${t.category}"`,
      t.amount.toFixed(2),
      t.paymentMethod,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `expensemind_transactions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-[#0b1616] border border-emerald-500/20 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl font-mono">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <h3 className="text-xl font-bold text-white">Expense Ledger &amp; History</h3>
          <p className="text-xs text-slate-400 mt-1">{filtered.length} Logged Transactions</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs transition-all shadow-lg shadow-emerald-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add Expense</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-emerald-400 hover:text-white hover:border-emerald-500/50 text-xs transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search merchant or category..."
            className="w-full bg-[#060e0e] border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/60"
          />
        </div>

        <select
          value={selectedCat}
          onChange={(e) => setSelectedCat(e.target.value)}
          className="bg-[#060e0e] border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500/60"
        >
          <option value="ALL">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Manual Entry Modal */}
      {showAddModal && (
        <form onSubmit={handleManualAdd} className="bg-[#060e0e] border border-emerald-500/30 rounded-2xl p-5 space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-emerald-400" /> Manual Expense Input
            </span>
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="text-slate-500 hover:text-slate-300"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block text-[10px] text-slate-500 uppercase mb-1">Merchant</label>
              <input
                type="text"
                required
                value={merchant}
                onChange={(e) => setMerchant(e.target.value)}
                placeholder="e.g. Starbucks"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50"
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-500 uppercase mb-1">Amount ($)</label>
              <input
                type="number"
                step="0.01"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50"
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-500 uppercase mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500/50"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] text-slate-500 uppercase mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500/50"
              />
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-500 text-black font-bold text-xs hover:bg-emerald-400 transition-all"
            >
              Save Entry
            </button>
          </div>
        </form>
      )}

      {/* Table */}
      <div className="overflow-x-auto border border-slate-800 rounded-2xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#060e0e] text-slate-400 text-[10px] uppercase border-b border-slate-800">
            <tr>
              <th className="p-3">Date</th>
              <th className="p-3">Merchant</th>
              <th className="p-3">Category</th>
              <th className="p-3 text-right">Amount</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 bg-[#0b1616]">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-slate-500 text-xs">
                  No matching transactions found.
                </td>
              </tr>
            ) : (
              filtered.map((t) => (
                <tr key={t.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="p-3 text-slate-400 tabular-nums">{t.date}</td>
                  <td className="p-3 font-bold text-white">{t.merchant}</td>
                  <td className="p-3">
                    <span className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-emerald-400 text-[10px]">
                      {t.category}
                    </span>
                  </td>
                  <td className="p-3 text-right font-bold text-white tabular-nums">${t.amount.toFixed(2)}</td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => onDeleteTransaction(t.id)}
                      className="text-slate-600 hover:text-rose-400 transition-colors"
                      title="Delete Transaction"
                    >
                      <Trash2 className="w-4 h-4 mx-auto" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
