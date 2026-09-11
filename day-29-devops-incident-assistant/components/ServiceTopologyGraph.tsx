'use client';

import { useState } from 'react';
import { ServiceTopology, ServiceNode, ServiceHealthStatus } from '@/types';
import {
  Server,
  Database,
  Layers,
  Activity,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Globe,
  Radio,
  Cpu,
  ArrowRight,
  Info,
  Zap,
} from 'lucide-react';

interface Props {
  topology: ServiceTopology;
  serviceName: string;
  isResolved?: boolean;
}

export default function ServiceTopologyGraph({
  topology,
  serviceName,
  isResolved = false,
}: Props) {
  const [selectedNode, setSelectedNode] = useState<ServiceNode | null>(
    topology.nodes.find((n) => n.name === serviceName) || topology.nodes[0] || null
  );

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'edge':
        return <Globe className="w-3.5 h-3.5" />;
      case 'gateway':
        return <Radio className="w-3.5 h-3.5" />;
      case 'database':
        return <Database className="w-3.5 h-3.5" />;
      case 'cache':
        return <Zap className="w-3.5 h-3.5" />;
      case 'queue':
        return <Layers className="w-3.5 h-3.5" />;
      default:
        return <Server className="w-3.5 h-3.5" />;
    }
  };

  const getEffectiveStatus = (node: ServiceNode): ServiceHealthStatus => {
    if (isResolved) return 'healthy';
    return node.status;
  };

  const getStatusColor = (status: ServiceHealthStatus) => {
    switch (status) {
      case 'critical':
        return {
          bg: 'bg-rose-500/10 border-rose-500/60 text-rose-400',
          dot: 'bg-rose-500 shadow-rose-500/50',
          badge: 'bg-rose-500 text-black font-extrabold',
          borderHover: 'hover:border-rose-400',
          ping: 'bg-rose-500',
        };
      case 'degraded':
        return {
          bg: 'bg-amber-500/10 border-amber-500/50 text-amber-300',
          dot: 'bg-amber-400 shadow-amber-400/50',
          badge: 'bg-amber-400 text-black font-bold',
          borderHover: 'hover:border-amber-400',
          ping: 'bg-amber-400',
        };
      default:
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400',
          dot: 'bg-emerald-400 shadow-emerald-400/50',
          badge: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
          borderHover: 'hover:border-emerald-400',
          ping: 'bg-emerald-400',
        };
    }
  };

  // Group nodes logically by layer: ingress/edge -> services -> datastores/backing
  const ingressNodes = topology.nodes.filter((n) => n.type === 'edge' || n.type === 'gateway');
  const serviceNodes = topology.nodes.filter((n) => n.type === 'service');
  const datastoreNodes = topology.nodes.filter(
    (n) => n.type === 'database' || n.type === 'cache' || n.type === 'queue'
  );

  return (
    <div className="bg-[#090d16] border border-white/[0.08] rounded-xl p-4 space-y-4 shadow-2xl font-mono text-xs text-slate-300 flex flex-col sre-card">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-white/[0.06] pb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <Activity className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-xs font-mono uppercase tracking-wider">
              Service Dependency Topology &amp; Blast Radius
            </h3>
            <p className="text-[10px] text-slate-400 font-sans">
              Live request flow graph with distributed telemetry &amp; fault tracing
            </p>
          </div>
        </div>

        {/* Status Legend */}
        <div className="flex items-center gap-2 text-[10px] font-mono">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-slate-400">Critical</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="text-slate-400">Degraded</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-slate-400">Healthy</span>
          </span>
        </div>
      </div>

      {/* Main Architecture Map Canvas */}
      <div className="p-4 rounded-xl bg-[#04060a] border border-white/[0.06] relative overflow-hidden space-y-6">
        {/* Visual Request Flow Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          {/* Tier 1: Ingress & Edge Layer */}
          <div className="space-y-3">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
              <Globe className="w-3 h-3 text-cyan-400" />
              <span>1. Ingress &amp; Edge</span>
            </div>
            <div className="space-y-2.5">
              {ingressNodes.map((node) => {
                const effStatus = getEffectiveStatus(node);
                const colors = getStatusColor(effStatus);
                const isSelected = selectedNode?.id === node.id;

                return (
                  <button
                    key={node.id}
                    type="button"
                    onClick={() => setSelectedNode(node)}
                    className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer relative overflow-hidden ${
                      colors.bg
                    } ${colors.borderHover} ${
                      isSelected
                        ? 'ring-2 ring-cyan-400/50 shadow-lg shadow-cyan-500/10'
                        : 'shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getNodeIcon(node.type)}
                        <span className="font-bold text-white text-xs">{node.name}</span>
                      </div>
                      <span className={`w-2 h-2 rounded-full ${colors.dot}`} />
                    </div>

                    <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 pt-1.5 border-t border-white/[0.06]">
                      <span>Latency: {isResolved ? '24ms' : `${node.latencyMs}ms`}</span>
                      <span>RPS: {node.throughputRps}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tier 2: Microservices Layer (Target & Callers) */}
          <div className="space-y-3">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
              <Server className="w-3 h-3 text-rose-400" />
              <span>2. Application Pods</span>
            </div>
            <div className="space-y-2.5">
              {serviceNodes.map((node) => {
                const effStatus = getEffectiveStatus(node);
                const colors = getStatusColor(effStatus);
                const isSelected = selectedNode?.id === node.id;
                const isTarget = node.name === serviceName;

                return (
                  <button
                    key={node.id}
                    type="button"
                    onClick={() => setSelectedNode(node)}
                    className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer relative overflow-hidden ${
                      colors.bg
                    } ${colors.borderHover} ${
                      isSelected
                        ? 'ring-2 ring-rose-500/60 shadow-lg shadow-rose-500/15'
                        : 'shadow-sm'
                    } ${isTarget && !isResolved ? 'animate-pulse-slow' : ''}`}
                  >
                    {isTarget && (
                      <span className="absolute -right-8 -top-8 w-16 h-16 bg-rose-500/20 rounded-full blur-md" />
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getNodeIcon(node.type)}
                        <span className="font-bold text-white text-xs">{node.name}</span>
                      </div>
                      <span className={`px-1.5 py-0.5 rounded text-[9px] ${colors.badge}`}>
                        {effStatus.toUpperCase()}
                      </span>
                    </div>

                    <div className="mt-2 grid grid-cols-2 gap-1 text-[10px] text-slate-400 pt-1.5 border-t border-white/[0.06]">
                      <div>
                        <span className="text-slate-500">p95: </span>
                        <strong className="text-slate-200">
                          {isResolved ? '48ms' : `${node.latencyMs}ms`}
                        </strong>
                      </div>
                      <div>
                        <span className="text-slate-500">Err: </span>
                        <strong className={effStatus === 'critical' ? 'text-rose-400' : 'text-slate-200'}>
                          {isResolved ? '0.00%' : `${node.errorRatePercent}%`}
                        </strong>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tier 3: Storage & Backing Services */}
          <div className="space-y-3">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
              <Database className="w-3 h-3 text-emerald-400" />
              <span>3. Data Tier &amp; Queues</span>
            </div>
            <div className="space-y-2.5">
              {datastoreNodes.map((node) => {
                const effStatus = getEffectiveStatus(node);
                const colors = getStatusColor(effStatus);
                const isSelected = selectedNode?.id === node.id;

                return (
                  <button
                    key={node.id}
                    type="button"
                    onClick={() => setSelectedNode(node)}
                    className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer relative overflow-hidden ${
                      colors.bg
                    } ${colors.borderHover} ${
                      isSelected
                        ? 'ring-2 ring-emerald-400/50 shadow-lg shadow-emerald-500/10'
                        : 'shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getNodeIcon(node.type)}
                        <span className="font-bold text-white text-xs">{node.name}</span>
                      </div>
                      <span className={`w-2 h-2 rounded-full ${colors.dot}`} />
                    </div>

                    <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 pt-1.5 border-t border-white/[0.06]">
                      <span>{node.technology || 'Datastore'}</span>
                      <span className={effStatus === 'critical' ? 'text-rose-400 font-bold' : 'text-slate-300'}>
                        {isResolved ? 'Healthy' : `${node.errorRatePercent > 0 ? `${node.errorRatePercent}% Saturated` : 'Healthy'}`}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Selected Node Telemetry Inspector Drawer */}
        {selectedNode && (
          <div className="p-3.5 rounded-lg bg-[#080d17] border border-white/[0.1] text-xs font-mono space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.06] pb-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold text-slate-400">Inspecting Node:</span>
                <span className="font-bold text-white text-sm">{selectedNode.name}</span>
                <span className="px-2 py-0.2 rounded bg-white/[0.06] text-[10px] text-slate-400 uppercase">
                  {selectedNode.type}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[10px]">
                <span className="text-slate-500">Pod Replicas:</span>
                <span className="font-bold text-slate-200">{selectedNode.podCount || '3/3 Running'}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-500">Current Health</span>
                <p className={`font-bold ${isResolved ? 'text-emerald-400' : selectedNode.status === 'critical' ? 'text-rose-400' : 'text-slate-200'}`}>
                  {isResolved ? 'HEALTHY / OPERATIONAL' : selectedNode.status.toUpperCase()}
                </p>
              </div>

              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-500">p95 / p99 Latency</span>
                <p className="font-bold text-slate-200">
                  {isResolved ? '28ms / 42ms' : `${selectedNode.latencyMs}ms / ${(selectedNode.latencyMs * 1.35).toFixed(0)}ms`}
                </p>
              </div>

              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-500">Traffic Throughput</span>
                <p className="font-bold text-slate-200">
                  {selectedNode.throughputRps.toLocaleString()} req/sec
                </p>
              </div>

              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-500">HTTP 5xx Error Rate</span>
                <p className={`font-bold ${isResolved ? 'text-emerald-400' : selectedNode.errorRatePercent > 10 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {isResolved ? '0.00%' : `${selectedNode.errorRatePercent}%`}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
