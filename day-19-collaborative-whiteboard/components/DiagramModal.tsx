'use client';

import { useState } from 'react';
import { DiagramSpec } from '@/types';
import {
  Sparkles,
  X,
  Loader2,
  Wand2,
  Check,
  ChevronRight,
  Cloud,
  Shield,
  GitBranch,
  Cpu,
  Database,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onPlaceDiagram: (spec: DiagramSpec) => void;
}

const CATEGORIES = [
  { id: 'all', label: 'All Architectures', icon: Sparkles },
  { id: 'cloud', label: 'Cloud & Microservices', icon: Cloud },
  { id: 'auth', label: 'Auth & Security', icon: Shield },
  { id: 'ai', label: 'GenAI & RAG', icon: Cpu },
  { id: 'devops', label: 'DevOps & CI/CD', icon: GitBranch },
  { id: 'db', label: 'Database & ERD', icon: Database },
];

const PRESET_PROMPTS = [
  {
    category: 'cloud',
    title: 'High-Availability Microservices with API Gateway',
    prompt:
      'Cloud native architecture with Cloudflare CDN, Traefik API Gateway, Auth Service, Order Service, Stripe Payments, Redis Session Cache, and PostgreSQL replica cluster',
  },
  {
    category: 'auth',
    title: 'OAuth 2.0 PKCE & JWT Authorization Flow',
    prompt:
      'Secure OAuth 2.0 authentication flow with Next.js Client, Identity Provider Auth0, JWT Token Exchange, Protected Resource API, and Role-Based Access Control',
  },
  {
    category: 'ai',
    title: 'Enterprise LLM RAG Knowledge Retrieval Pipeline',
    prompt:
      'Retrieval Augmented Generation pipeline with User Query, Text Embeddings 768-dim, Pinecone Vector Index, Cross-Encoder Reranker, and Gemini 1.5 Pro synthesis',
  },
  {
    category: 'devops',
    title: 'GitOps CI/CD Pipeline to Kubernetes Cluster',
    prompt:
      'Modern DevOps pipeline: GitHub push trigger, GitHub Actions CI matrix, SonarQube quality gate, Docker container build, ECR Registry, and ArgoCD sync to production Kubernetes cluster',
  },
  {
    category: 'db',
    title: 'E-Commerce Database Schema & Relationships',
    prompt:
      'Entity relationship schema for modern store: Users table, Orders table, OrderItems junction, Products catalog, Inventory stock, and Stripe payment transactions',
  },
  {
    category: 'cloud',
    title: 'Event-Driven Kafka Stream Processing',
    prompt:
      'Event-driven streaming system with IoT Telemetry Ingestion, Apache Kafka broker topic, Flink real-time analytics, ClickHouse time-series storage, and Grafana Live Dashboard',
  },
];

export default function DiagramModal({ isOpen, onClose, onPlaceDiagram }: Props) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState<DiagramSpec | null>(null);

  if (!isOpen) return null;

  const filteredPresets =
    activeCategory === 'all'
      ? PRESET_PROMPTS
      : PRESET_PROMPTS.filter((p) => p.category === activeCategory);

  const generate = async (customPrompt?: string) => {
    const desc = customPrompt || prompt;
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
      setError('Failed to generate diagram with AI. Please try another prompt.');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150 font-sans">
      <div className="w-full max-w-3xl bg-[#090e1c] border-2 border-cyan-500/30 rounded-3xl shadow-2xl shadow-cyan-500/10 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800/80 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 text-white">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg flex items-center gap-2">
                AI Architecture &amp; Diagram Studio
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-[10px]">
                  Gemini 1.5 Flash
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Describe any technical system in plain English — generated &amp; laid out automatically
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeCategory === cat.id
                      ? 'bg-cyan-500 text-black shadow-md'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Prompt Input */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block font-mono">
              Natural Language Diagram Description
            </label>
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    generate();
                  }
                }}
                placeholder="e.g. Microservices architecture with API Gateway, Auth Service, Stripe, Redis, and PostgreSQL replica cluster..."
                rows={3}
                className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 focus:border-cyan-400 text-white text-xs leading-relaxed focus:outline-none transition-all resize-none font-sans"
              />
              <button
                onClick={() => generate()}
                disabled={isLoading || !prompt.trim()}
                className="absolute right-3 bottom-3 px-4 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-xs shadow-md disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1.5 cursor-pointer"
              >
                {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Wand2 className="w-3.5 h-3.5" />}
                <span>{isLoading ? 'Synthesizing...' : 'Generate'}</span>
              </button>
            </div>
          </div>

          {/* Quick-Pick Presets */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block font-mono">
              Suggested Architecture Presets
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {filteredPresets.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setPrompt(preset.prompt);
                    generate(preset.prompt);
                  }}
                  className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/40 text-left transition-all group cursor-pointer flex flex-col justify-between space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs group-hover:text-cyan-300 transition-colors">
                      {preset.title}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                  <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">
                    {preset.prompt}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              {error}
            </div>
          )}

          {/* Generated Result Preview */}
          {preview && (
            <div className="p-5 rounded-2xl bg-slate-950 border-2 border-emerald-500/40 space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <Check className="w-4 h-4" />
                  <span>Synthesized Diagram: "{preview.title}"</span>
                </div>
                <span className="text-xs font-mono text-slate-400">
                  {preview.elements.length} Nodes • {preview.connections.length} Connectors
                </span>
              </div>

              {/* Node Chips */}
              <div className="flex flex-wrap gap-2 pt-1">
                {preview.elements.map((el) => (
                  <span
                    key={el.id}
                    className="px-2.5 py-1 rounded-lg text-xs font-bold text-white border"
                    style={{
                      backgroundColor: el.color + '25',
                      borderColor: el.color + '60',
                      color: el.color,
                    }}
                  >
                    {el.label}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between p-5 border-t border-slate-800/80 bg-slate-950/60">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-bold transition-all cursor-pointer"
          >
            Close
          </button>

          {preview && (
            <button
              onClick={handlePlace}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-500 text-black font-extrabold text-xs shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Place on Canvas</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
