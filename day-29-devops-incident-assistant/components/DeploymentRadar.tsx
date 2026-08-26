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
        return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
      case 'MEDIUM':
        return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
      default:
        return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    }
  };

  return (
    <div className="bg-[#0d1117] border border-slate-800 rounded-2xl p-5 space-y-3.5 shadow-xl font-mono text-xs text-slate-300">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-cyan-400" />
          <h3 className="font-bold text-white text-sm font-mono">
            Deployment Correlation Radar (Pre-Incident 4h Window)
          </h3>
        </div>
        <span className="text-slate-400 text-[10px] font-mono">
          {deployments.length} Recent Release{deployments.length === 1 ? '' : 's'}
        </span>
      </div>

      {deployments.length === 0 ? (
        <div className="py-6 text-center text-slate-500 font-mono">
          No code deployments registered in the 4-hour pre-incident window.
        </div>
      ) : (
        <div className="space-y-2.5">
          {deployments.map((dep) => (
            <div
              key={dep.id}
              className="p-3.5 rounded-xl bg-[#161b22] border border-slate-800 hover:border-cyan-500/40 transition-colors space-y-2"
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

              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/80 font-mono">
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
                  Deployed at {new Date(dep.deployedAt).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
