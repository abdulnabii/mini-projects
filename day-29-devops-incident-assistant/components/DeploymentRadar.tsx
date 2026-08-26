'use client';

import { Deployment } from '@/types';
import { GitBranch, GitCommit, User, Clock, AlertTriangle, ExternalLink } from 'lucide-react';

interface Props {
  deployments: Deployment[];
}

export default function DeploymentRadar({ deployments }: Props) {
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'HIGH':
        return 'text-orange-400 border-orange-500/30 bg-orange-500/10';
      case 'MEDIUM':
        return 'text-amber-300 border-amber-500/30 bg-amber-500/10';
      default:
        return 'text-cyan-300 border-cyan-500/30 bg-cyan-500/10';
    }
  };

  return (
    <div className="bg-[#090d16] border border-white/[0.08] rounded-xl p-4 space-y-3 shadow-2xl font-mono text-xs text-slate-300 sre-card">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <GitBranch className="w-3.5 h-3.5" />
          </div>
          <h3 className="font-bold text-white text-xs font-mono uppercase tracking-wider">
            Deployment Correlation Radar (Pre-Incident 4h)
          </h3>
        </div>
        <span className="text-slate-400 text-[10px] font-mono">
          {deployments.length} Release{deployments.length === 1 ? '' : 's'} Detected
        </span>
      </div>

      {deployments.length === 0 ? (
        <div className="py-6 text-center text-slate-500 font-mono">
          No code deployments registered in the 4-hour pre-incident window.
        </div>
      ) : (
        <div className="space-y-2">
          {deployments.map((dep) => (
            <div
              key={dep.id}
              className="p-3 rounded-lg bg-[#0f1422] border border-white/[0.06] hover:border-cyan-500/40 transition-colors space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-bold text-[10px] font-mono">
                    {dep.version}
                  </span>
                  <span className="font-bold text-white text-xs font-mono">{dep.service}</span>
                </div>

                <span className={`px-2 py-0.5 rounded text-[9px] font-bold border font-mono ${getRiskColor(dep.riskScore)}`}>
                  {dep.riskScore} RISK SCORE
                </span>
              </div>

              <p className="text-slate-200 text-xs font-mono select-all">
                "{dep.commitMessage}"
              </p>

              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-white/[0.04] font-mono">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <GitCommit className="w-3 h-3 text-slate-500" />
                    <code className="text-slate-300">{dep.commitHash}</code>
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3 text-slate-500" />
                    <span>{dep.deployedBy}</span>
                  </span>
                </div>

                <span className="text-slate-500">
                  {new Date(dep.deployedAt).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
