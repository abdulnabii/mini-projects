'use client';

import { useState } from 'react';
import { ArchitectureDesignResult, ArchitectureNode, NodeType } from '@/types';
import { getNodeTypeColor } from '@/lib/architectEngine';
import {
  Layers,
  Server,
  Activity,
  ArrowRight,
  ShieldCheck,
  Zap,
  Maximize2,
  Minimize2,
  Info,
  Radio,
  Cpu,
  Database,
  Globe,
  Lock,
} from 'lucide-react';

interface Props {
  architecture: ArchitectureDesignResult;
}

export default function VisualDiagramCanvas({ architecture }: Props) {
  const [selectedNode, setSelectedNode] = useState<ArchitectureNode | null>(architecture.nodes[0] || null);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // Group nodes by tier (1 to 5)
  const tiers = [1, 2, 3, 4, 5];
  const tierLabels: Record<number, { title: string; subtitle: string }> = {
    1: { title: 'Tier 1: Global Edge & Perimeter Ingress', subtitle: 'Clients, CloudFront CDN, Anycast & Layer 7 WAF' },
    2: { title: 'Tier 2: Traffic Gateway & Load Balancing', subtitle: 'Application Load Balancers & mTLS Proxy' },
    3: { title: 'Tier 3: Core Compute & Microservices Layer', subtitle: 'Auto-scaling Container Clusters & gRPC Services' },
    4: { title: 'Tier 4: Distributed Caching & Event Backbone', subtitle: 'Redis In-Memory Cluster & Kafka/SQS Streams' },
    5: { title: 'Tier 5: Data Persistence & High-Durability Storage', subtitle: 'Multi-AZ Relational DB & S3 Encrypted Object Store' },
  };

  return (
    <div
      className={`rounded-3xl bg-[#090d16] border-2 border-cyan-500/40 p-6 sm:p-8 space-y-6 shadow-2xl shadow-cyan-500/10 transition-all font-mono text-xs text-slate-300 sre-card ${
        isExpanded ? 'fixed inset-4 z-50 overflow-y-auto bg-[#070c14]' : 'relative'
      }`}
    >
      {/* Canvas Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/30 font-mono">
              {architecture.targetProvider} ARCHITECTURE TOPOLOGY
            </span>
            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 font-mono">
              ⚡ P99 Latency: ~{architecture.estimatedP99Latency}
            </span>
            <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20 font-mono">
              🎯 {architecture.projectedRPS.toLocaleString()} Peak RPS
            </span>
            <span className="text-[10px] text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20 font-mono">
              🌐 {architecture.nodes.length} Managed Nodes
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-white font-outfit tracking-tight">
            {architecture.title}
          </h3>
          <p className="text-xs text-slate-400 font-sans leading-relaxed">{architecture.requirementsSummary}</p>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2.5 rounded-xl bg-[#04080e] border border-white/[0.08] hover:border-cyan-500 text-slate-300 hover:text-white transition-all flex items-center gap-1.5 self-end sm:self-auto cursor-pointer"
        >
          {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          <span>{isExpanded ? 'Collapse' : 'Full Screen'}</span>
        </button>
      </div>

      {/* Multi-Tier Interactive Diagram Pipeline */}
      <div className="space-y-6">
        {tiers.map((tierNum) => {
          const tierNodes = architecture.nodes.filter((n) => n.tier === tierNum);
          if (tierNodes.length === 0) return null;
          const tierInfo = tierLabels[tierNum];

          return (
            <div key={tierNum} className="space-y-2.5">
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold uppercase tracking-wider px-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  <span className="text-white font-mono">{tierInfo.title}</span>
                </div>
                <span className="text-slate-500 text-[10px] hidden sm:inline">{tierInfo.subtitle}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {tierNodes.map((node) => {
                  const colors = getNodeTypeColor(node.type);
                  const isSelected = selectedNode?.id === node.id;

                  return (
                    <div
                      key={node.id}
                      onClick={() => setSelectedNode(node)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-3 shadow-md ${
                        isSelected
                          ? 'bg-cyan-950/40 border-cyan-400 shadow-cyan-500/20 ring-1 ring-cyan-400'
                          : 'bg-[#04080e] border-white/[0.06] hover:border-white/[0.15]'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${colors.bg} ${colors.text} border ${colors.border}`}
                          >
                            {node.type}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">{node.providerService}</span>
                        </div>

                        <h4 className="font-bold text-white text-xs font-outfit">{node.name}</h4>
                        <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed font-sans prose-text">
                          {node.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between border-t border-white/[0.04] pt-2 text-[10px] text-slate-400">
                        <span className="truncate max-w-[200px] font-mono text-cyan-300/80">⚙️ {node.specs}</span>
                        <span className="text-cyan-400 font-bold">Inspect &rarr;</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Component Deep Inspection Drawer */}
      {selectedNode && (
        <div className="p-5 rounded-2xl bg-[#04080e] border-2 border-cyan-500/40 space-y-3 shadow-xl animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-2">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-cyan-400" />
              <span className="font-bold text-white text-xs font-outfit">
                Live Component Telemetry: {selectedNode.name}
              </span>
            </div>
            <span className="text-[10px] text-cyan-400 font-bold bg-cyan-500/10 px-2 py-0.5 rounded-lg border border-cyan-500/30">
              {selectedNode.providerService}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-[11px]">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 uppercase font-bold">Role &amp; Architectural Function:</span>
              <p className="text-slate-200 font-sans leading-relaxed">{selectedNode.description}</p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 uppercase font-bold">Sizing &amp; Capacity Specifications:</span>
              <p className="text-emerald-300 font-mono font-bold">{selectedNode.specs}</p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 uppercase font-bold">Connected Network Pipelines:</span>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {architecture.edges
                  .filter((e) => e.from === selectedNode.id || e.to === selectedNode.id)
                  .map((e, idx) => (
                    <span
                      key={idx}
                      className="block text-[10px] px-2 py-1 rounded bg-[#0e1424] border border-white/[0.06] text-slate-300"
                    >
                      {e.from === selectedNode.id ? '➔ Uplink to' : '⬅ Downlink from'}{' '}
                      <strong className="text-white">{e.from === selectedNode.id ? e.to.replace('node_', '') : e.from.replace('node_', '')}</strong>{' '}
                      ({e.protocol} • <span className="text-emerald-400">{e.latencyMs}ms</span>)
                    </span>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
