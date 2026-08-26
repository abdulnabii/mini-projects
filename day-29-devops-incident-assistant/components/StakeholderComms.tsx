'use client';

import { useState } from 'react';
import { StakeholderComms } from '@/types';
import { MessageSquare, Briefcase, Globe, Copy, Check, Sparkles, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  comms: StakeholderComms;
  onRegenerateComms: () => void;
  isGenerating: boolean;
}

export default function StakeholderCommsPanel({
  comms,
  onRegenerateComms,
  isGenerating,
}: Props) {
  const [activeTab, setActiveTab] = useState<'slack' | 'executive' | 'statuspage'>('slack');
  const [copiedTab, setCopiedTab] = useState<string | null>(null);

  const getActiveText = () => {
    switch (activeTab) {
      case 'slack':
        return comms.slackMessage;
      case 'executive':
        return comms.executiveBrief;
      default:
        return comms.statusPageUpdate;
    }
  };

  const handleCopy = () => {
    const text = getActiveText();
    navigator.clipboard.writeText(text);
    setCopiedTab(activeTab);
    setTimeout(() => setCopiedTab(null), 2000);
    confetti({
      particleCount: 20,
      spread: 50,
      origin: { y: 0.7 },
      colors: ['#ef4444', '#f59e0b'],
    });
  };

  return (
    <div className="bg-[#0d1117] border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl font-mono text-xs text-slate-300 flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-amber-400" />
          <h3 className="font-bold text-white text-sm font-mono">
            Multi-Audience Stakeholder Comms Generator
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onRegenerateComms}
            disabled={isGenerating}
            className="px-2.5 py-1 rounded-lg bg-[#161b22] border border-slate-800 hover:border-amber-500/40 text-amber-400 text-xs transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50 font-bold font-mono"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Drafting...' : 'Re-Draft Comms'}</span>
          </button>
        </div>
      </div>

      {/* Audience Selector Tabs */}
      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#161b22] border border-slate-800 max-w-full overflow-x-auto text-xs font-mono">
        <button
          type="button"
          onClick={() => setActiveTab('slack')}
          className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeTab === 'slack'
              ? 'bg-amber-400 text-black font-extrabold shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Internal Slack / Teams</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('executive')}
          className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeTab === 'executive'
              ? 'bg-amber-400 text-black font-extrabold shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>Executive Leadership Brief</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('statuspage')}
          className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeTab === 'statuspage'
              ? 'bg-amber-400 text-black font-extrabold shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Public StatusPage.io</span>
        </button>
      </div>

      {/* Comms Preview Container */}
      <div className="p-4 rounded-xl bg-[#04080e] border border-slate-800 relative group space-y-3 font-mono">
        <div className="flex items-center justify-between text-[10px] text-slate-500 border-b border-slate-800/80 pb-2">
          <span>
            {activeTab === 'slack' && 'Target: #incidents-war-room (Markdown)'}
            {activeTab === 'executive' && 'Target: VP Engineering / C-Suite Memo'}
            {activeTab === 'statuspage' && 'Target: Public Incident Update (HTML / Plain)'}
          </span>

          <button
            type="button"
            onClick={handleCopy}
            className="px-2.5 py-1 rounded bg-[#161b22] hover:bg-slate-800 text-amber-400 hover:text-amber-300 font-bold transition-all flex items-center gap-1 cursor-pointer font-mono text-[10px]"
          >
            {copiedTab === activeTab ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copiedTab === activeTab ? 'Copied to Clipboard!' : 'Copy Draft'}</span>
          </button>
        </div>

        <p className="text-slate-200 whitespace-pre-wrap leading-relaxed select-all text-xs font-mono">
          {getActiveText()}
        </p>
      </div>
    </div>
  );
}
