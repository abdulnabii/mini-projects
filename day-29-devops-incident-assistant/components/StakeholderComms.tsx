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
    <div className="bg-[#090d16] border border-white/[0.08] rounded-xl p-4 space-y-3.5 shadow-2xl font-mono text-xs text-slate-300 flex flex-col sre-card">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <MessageSquare className="w-3.5 h-3.5" />
          </div>
          <h3 className="font-bold text-white text-xs font-mono uppercase tracking-wider">
            Stakeholder Communications Hub
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onRegenerateComms}
            disabled={isGenerating}
            className="px-2.5 py-1 rounded-lg bg-[#0f1422] border border-white/[0.08] hover:border-amber-500/40 text-amber-400 text-xs transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50 font-bold font-mono"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Drafting...' : 'Re-Draft Comms'}</span>
          </button>
        </div>
      </div>

      {/* Audience Selector Tabs */}
      <div className="flex items-center gap-1 p-0.5 rounded-lg bg-[#04080e] border border-white/[0.08] max-w-full overflow-x-auto text-xs font-mono">
        <button
          type="button"
          onClick={() => setActiveTab('slack')}
          className={`px-3 py-1 rounded-md transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap text-xs ${
            activeTab === 'slack'
              ? 'bg-amber-400 text-black font-extrabold shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <MessageSquare className="w-3 h-3" />
          <span>Internal Slack / Teams</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('executive')}
          className={`px-3 py-1 rounded-md transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap text-xs ${
            activeTab === 'executive'
              ? 'bg-amber-400 text-black font-extrabold shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Briefcase className="w-3 h-3" />
          <span>Executive Memo</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('statuspage')}
          className={`px-3 py-1 rounded-md transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap text-xs ${
            activeTab === 'statuspage'
              ? 'bg-amber-400 text-black font-extrabold shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Globe className="w-3 h-3" />
          <span>Public StatusPage.io</span>
        </button>
      </div>

      {/* Comms Preview Container */}
      <div className="p-3.5 rounded-lg bg-[#04060a] border border-white/[0.06] relative group space-y-2.5 font-mono">
        <div className="flex items-center justify-between text-[10px] text-slate-500 border-b border-white/[0.06] pb-2">
          <span>
            {activeTab === 'slack' && 'Target: #incidents-war-room (Markdown)'}
            {activeTab === 'executive' && 'Target: VP Engineering / C-Suite Memo'}
            {activeTab === 'statuspage' && 'Target: Public StatusPage Notice (HTML)'}
          </span>

          <button
            type="button"
            onClick={handleCopy}
            className="px-2 py-0.5 rounded bg-[#0f1422] hover:bg-slate-800 text-amber-400 hover:text-amber-300 font-bold transition-all flex items-center gap-1 cursor-pointer font-mono text-[10px]"
          >
            {copiedTab === activeTab ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copiedTab === activeTab ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>

        <p className="text-slate-200 whitespace-pre-wrap leading-relaxed select-all text-xs font-mono">
          {getActiveText()}
        </p>
      </div>
    </div>
  );
}
