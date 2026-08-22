'use client';

import { useState } from 'react';
import { DiagramSpec } from '@/types';
import { Sparkles, X, Loader2, Wand2, Check, ChevronRight } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onPlaceDiagram: (spec: DiagramSpec) => void;
}

const EXAMPLE_PROMPTS = [
  'Microservices architecture with API gateway, auth service, user service, and PostgreSQL',
  'React component tree: App → Header, Sidebar, Main → Card, Table, Form',
  'CI/CD pipeline: Code push → GitHub Actions → Docker Build → Registry → Kubernetes Deploy',
  'OAuth 2.0 flow: User → App → Auth Server → Token → Resource Server',
  'Entity relationship diagram for an e-commerce app: Users, Products, Orders, Cart, Reviews',
  'Three-tier web architecture: Load Balancer → App Servers → Database Cluster',
];

export default function DiagramModal({ isOpen, onClose, onPlaceDiagram }: Props) {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState<DiagramSpec | null>(null);

  if (!isOpen) return null;

  const generate = async (text?: string) => {
    const desc = text ?? prompt;
    if (!desc.trim()) return;

    setIsLoading(true);
    setError('');
    setPreview(null);

    try {
      const res = await fetch('/api/diagram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: desc }),
      });

      if (!res.ok) throw new Error('Generation failed');

      const spec: DiagramSpec = await res.json();
      setPreview(spec);
    } catch (e) {
      setError('Failed to generate diagram. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlace = () => {
    if (!preview) return;
    onPlaceDiagram(preview);
    setPreview(null);
    setPrompt('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 modal-backdrop">
      <div className="w-full max-w-2xl bg-[#0d1424] border border-white/10 rounded-3xl shadow-2xl shadow-indigo-500/10 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-black text-white text-lg">AI Diagram Generator</h2>
              <p className="text-slate-400 text-xs">Describe your diagram in plain English → placed on canvas</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Prompt Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Describe your diagram</label>
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), generate())}
                placeholder="e.g. Microservices architecture with API gateway, auth service, and PostgreSQL database..."
                rows={3}
                className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-violet-500/60 resize-none transition-all"
              />
            </div>
          </div>

          {/* Example Prompts */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Quick examples</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {EXAMPLE_PROMPTS.map((ex, i) => (
                <button
                  key={i}
                  onClick={() => { setPrompt(ex); generate(ex); }}
                  className="text-left px-3 py-2.5 rounded-xl bg-white/4 border border-white/8 text-slate-300 text-xs hover:border-violet-500/40 hover:bg-violet-500/8 transition-all cursor-pointer leading-relaxed flex items-start gap-1.5"
                >
                  <ChevronRight className="w-3 h-3 shrink-0 mt-0.5 text-violet-400" />
                  <span>{ex}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm">
              {error}
            </div>
          )}

          {/* Preview */}
          {preview && (
            <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <Check className="w-4 h-4" />
                <span>Diagram ready: "{preview.title}"</span>
              </div>
              <div className="text-xs text-slate-400">
                {preview.elements.length} nodes · {preview.connections.length} connections
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {preview.elements.map((el) => (
                  <span key={el.id} className="px-2.5 py-1 rounded-lg text-[10px] font-bold text-white" style={{ background: el.color + '33', border: `1px solid ${el.color}55` }}>
                    {el.label}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white text-sm font-medium transition-all cursor-pointer"
            >
              Cancel
            </button>
            {preview ? (
              <button
                onClick={handlePlace}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-all cursor-pointer flex items-center gap-2 shadow-lg shadow-emerald-500/20"
              >
                <Check className="w-4 h-4" />
                Place on Canvas
              </button>
            ) : (
              <button
                onClick={() => generate()}
                disabled={isLoading || !prompt.trim()}
                className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-sm transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-violet-500/20"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                {isLoading ? 'Generating...' : 'Generate Diagram'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
