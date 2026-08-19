'use client';

import { useState } from 'react';
import { ArchitectureDesignResult } from '@/types';
import { Code, Copy, Check, Download, Terminal, Layers } from 'lucide-react';

interface Props {
  architecture: ArchitectureDesignResult;
}

export default function IaCCodeStudio({ architecture }: Props) {
  const [activeTab, setActiveTab] = useState<'terraform' | 'docker'>('terraform');
  const [copied, setCopied] = useState(false);

  const currentCode =
    activeTab === 'terraform' ? architecture.terraformCode : architecture.dockerComposeCode;
  const currentFileName = activeTab === 'terraform' ? 'main.tf' : 'docker-compose.yml';

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
    <div className="p-6 sm:p-8 rounded-3xl bg-[#0b1220] border border-slate-800 space-y-6 font-mono text-xs text-slate-300 shadow-xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/30">
              INFRASTRUCTURE AS CODE (IaC)
            </span>
            <span className="text-[10px] text-slate-500">• Production Ready Blueprint</span>
          </div>
          <h3 className="font-bold text-white text-base font-outfit">
            Automated Terraform &amp; Docker Infrastructure Generator
          </h3>
          <p className="text-xs text-slate-400">
            Spin up this entire multi-tier architecture locally or deploy directly to {architecture.targetProvider}
          </p>
        </div>

        {/* Tab Switcher & Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center p-1 rounded-xl bg-slate-950 border border-slate-800">
            <button
              type="button"
              onClick={() => setActiveTab('terraform')}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all ${
                activeTab === 'terraform' ? 'bg-cyan-500 text-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              Terraform (main.tf)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('docker')}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all ${
                activeTab === 'docker' ? 'bg-cyan-500 text-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              Docker Compose
            </button>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-500 text-cyan-300 font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy Code'}</span>
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-bold flex items-center gap-1.5 transition-all shadow-md shadow-cyan-500/20 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download {currentFileName}</span>
          </button>
        </div>
      </div>

      {/* Code Viewer */}
      <pre className="p-4 sm:p-6 rounded-2xl bg-slate-950 border border-slate-800/80 text-[11px] text-cyan-200/90 font-mono overflow-x-auto max-h-96 leading-relaxed shadow-inner">
        {currentCode}
      </pre>
    </div>
  );
}
