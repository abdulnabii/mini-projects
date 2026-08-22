'use client';

import { useState } from 'react';
import { TestConfig } from '@/types';
import { generateK6Script, generateCurlCommand } from '@/lib/loadEngine';
import { FileCode2, Copy, Check, Terminal, Download } from 'lucide-react';

interface Props {
  config: TestConfig;
}

export default function K6ScriptExporter({ config }: Props) {
  const [activeTab, setActiveTab] = useState<'k6' | 'curl'>('k6');
  const [copied, setCopied] = useState(false);

  const k6Script = generateK6Script(config);
  const curlCmd = generateCurlCommand(config);

  const activeContent = activeTab === 'k6' ? k6Script : curlCmd;

  const handleCopy = () => {
    navigator.clipboard.writeText(activeContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const filename = activeTab === 'k6' ? 'loadtest.js' : 'benchmark.sh';
    const blob = new Blob([activeContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 sm:p-8 rounded-3xl glass-card space-y-4 font-sans">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <FileCode2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-black text-white text-base font-outfit">
              Export Load Script (k6 / cURL)
            </h3>
            <p className="text-xs text-slate-400">Run this benchmark natively in your CI/CD pipeline</p>
          </div>
        </div>

        {/* Switcher & Actions */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-950 border border-white/10 text-xs">
            <button
              onClick={() => setActiveTab('k6')}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                activeTab === 'k6' ? 'bg-cyan-500 text-black shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              k6 Script (.js)
            </button>
            <button
              onClick={() => setActiveTab('curl')}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                activeTab === 'curl' ? 'bg-cyan-500 text-black shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              cURL Command
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="p-2 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Copy script"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>

          <button
            onClick={handleDownload}
            className="p-2 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Download script"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Code Viewer */}
      <pre className="p-4 rounded-2xl bg-[#050811] border border-white/5 text-slate-300 font-mono text-xs overflow-x-auto max-h-72 leading-relaxed selection:bg-cyan-500 selection:text-black">
        <code>{activeContent}</code>
      </pre>
    </div>
  );
}
