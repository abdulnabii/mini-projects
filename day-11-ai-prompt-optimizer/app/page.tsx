'use client';

import { useState, useEffect } from 'react';
import { OptimizationResult, PresetPrompt, TargetModel } from '@/types';
import { getPromptHistory, saveOptimizationToHistory, deleteOptimizationFromHistory } from '@/lib/storage';
import PromptInputForm from '@/components/PromptInputForm';
import OptimizationDashboard from '@/components/OptimizationDashboard';
import PresetLibrary from '@/components/PresetLibrary';
import { Terminal, Sparkles, History, Trash2, Clock, Wand2, ShieldCheck, Zap } from 'lucide-react';

export default function HomePage() {
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const [history, setHistory] = useState<OptimizationResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activePromptInput, setActivePromptInput] = useState('');

  useEffect(() => {
    setHistory(getPromptHistory());
  }, []);

  const handleOptimize = async (rawPrompt: string, targetModel: TargetModel) => {
    setIsLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawPrompt, targetModel }),
      });

      if (!res.ok) {
        throw new Error('Failed to optimize prompt');
      }

      const data: OptimizationResult = await res.json();
      setResult(data);
      const updatedHistory = saveOptimizationToHistory(data);
      setHistory(updatedHistory);
    } catch (err) {
      console.error('Optimization error:', err);
      alert('Error optimizing prompt. Please check your network connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPreset = (preset: PresetPrompt) => {
    setActivePromptInput(preset.rawPrompt);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteHistory = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = deleteOptimizationFromHistory(id);
    setHistory(updated);
    if (result?.id === id) {
      setResult(null);
    }
  };

  return (
    <div className="flex-1 space-y-12 py-8 px-4 sm:px-6 max-w-7xl mx-auto w-full">
      {/* Hero Header */}
      <section className="text-center space-y-4 max-w-3xl mx-auto pt-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>PRODUCTION-READY PROMPT OPTIMIZATION</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-outfit">
          Architect High-Precision <br />
          <span className="bg-gradient-to-r from-amber-400 via-amber-500 to-emerald-400 bg-clip-text text-transparent">
            AI System Instructions &amp; Prompts
          </span>
        </h1>
        <p className="text-sm sm:text-base text-slate-400 font-mono max-w-2xl mx-auto leading-relaxed">
          Transform raw ideas into model-tuned prompt architectures with quality scorecards, dynamic variables, and live sandbox execution.
        </p>
      </section>

      {/* Main Input Workbench */}
      <section className="rounded-3xl bg-[#0f172a] border border-amber-500/20 p-6 sm:p-8 shadow-2xl shadow-amber-500/5">
        <PromptInputForm
          onOptimize={handleOptimize}
          isLoading={isLoading}
          initialPrompt={activePromptInput}
        />
      </section>

      {/* Preset Library */}
      <section className="pt-2">
        <PresetLibrary onSelectPreset={handleSelectPreset} />
      </section>

      {/* Optimization Results Dashboard */}
      {result && (
        <section id="results-dashboard" className="pt-4 scroll-mt-20">
          <OptimizationDashboard result={result} />
        </section>
      )}

      {/* Local History Section */}
      {history.length > 0 && (
        <section className="space-y-4 pt-6 font-mono border-t border-slate-800">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white font-outfit flex items-center gap-2">
              <History className="w-4 h-4 text-amber-400" />
              Optimization History &amp; Archives
            </h3>
            <span className="text-[11px] text-slate-500">{history.length} saved prompts</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {history.map((item) => (
              <div
                key={item.id}
                onClick={() => setResult(item)}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer group flex flex-col justify-between gap-3 ${
                  result?.id === item.id
                    ? 'bg-amber-500/10 border-amber-500 text-white'
                    : 'bg-[#0f172a] border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold text-amber-400 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                      {item.targetModel}
                    </span>
                    <button
                      onClick={(e) => handleDeleteHistory(item.id, e)}
                      className="text-slate-600 hover:text-rose-400 transition-colors p-1"
                      title="Delete from history"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-xs text-slate-200 font-mono font-bold line-clamp-2">{item.rawPrompt}</p>
                </div>

                <div className="text-[10px] text-slate-500 flex items-center justify-between border-t border-slate-800/80 pt-2">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-600" />
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                  <span className="text-emerald-400 font-bold">
                    Score: {item.scorecard.totalScore}/100
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
