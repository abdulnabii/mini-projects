'use client';

import { useState } from 'react';
import { ArchitectureDesignResult } from '@/types';
import { Code, Copy, Check, Download, Terminal, Layers, Box, Cpu } from 'lucide-react';

interface Props {
  architecture: ArchitectureDesignResult;
}

export default function IaCCodeStudio({ architecture }: Props) {
  const [activeTab, setActiveTab] = useState<'terraform' | 'docker' | 'k8s'>('terraform');
  const [copied, setCopied] = useState(false);

  let currentCode = architecture.terraformCode;
  let currentFileName = 'main.tf';

  if (activeTab === 'docker') {
    currentCode = architecture.dockerComposeCode;
    currentFileName = 'docker-compose.yml';
  } else if (activeTab === 'k8s') {
    currentCode = architecture.kubernetesCode || `# k8s-deployment.yaml\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: app-deployment\nspec:\n  replicas: 4\n`;
    currentFileName = 'k8s-deployment.yaml';
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([currentCode], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = currentFileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-[#090d16] border border-white/[0.08] space-y-6 font-mono text-xs text-slate-300 shadow-2xl sre-card">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/30 font-mono">
              INFRASTRUCTURE AS CODE (IaC)
            </span>
            <span className="text-[10px] text-slate-500">• Production Ready Blueprints</span>
          </div>
          <h3 className="font-bold text-white text-base font-outfit">
            Automated Terraform (HCL), Docker &amp; Kubernetes Studio
          </h3>
          <p className="text-xs text-slate-400 font-sans">
            Spin up this entire multi-tier architecture locally or deploy directly to {architecture.targetProvider}
          </p>
        </div>

        {/* Tab Switcher & Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center p-1 rounded-xl bg-[#04080e] border border-white/[0.08]">
            <button
              type="button"
              onClick={() => setActiveTab('terraform')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all text-xs cursor-pointer ${
                activeTab === 'terraform' ? 'bg-cyan-500 text-black shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Terraform (main.tf)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('docker')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all text-xs cursor-pointer ${
                activeTab === 'docker' ? 'bg-cyan-500 text-black shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Docker Compose
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('k8s')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all text-xs cursor-pointer ${
                activeTab === 'k8s' ? 'bg-cyan-500 text-black shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Kubernetes (K8s)
            </button>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="px-3.5 py-1.5 rounded-xl bg-[#0e1424] border border-white/[0.08] hover:border-cyan-500 text-cyan-300 font-bold flex items-center gap-1.5 transition-all cursor-pointer text-xs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-bold flex items-center gap-1.5 transition-all shadow-md shadow-cyan-500/20 cursor-pointer text-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* Code Viewer */}
      <pre className="p-4 sm:p-6 rounded-2xl bg-[#04080e] border border-white/[0.06] text-[11px] text-cyan-200/90 font-mono overflow-x-auto max-h-96 leading-relaxed shadow-inner select-all">
        {currentCode}
      </pre>
    </div>
  );
}
