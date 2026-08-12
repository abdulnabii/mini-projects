'use client';

import { EmailVariant, EmailConfig } from '@/types';
import { Copy, Check, ExternalLink, Bookmark, Sparkles, Clock, FileText } from 'lucide-react';
import { useState } from 'react';

interface Props {
  variants: EmailVariant[];
  selectedSubject: string;
  config: EmailConfig;
  onSaveHistory: (variant: EmailVariant) => void;
}

export default function VariantDisplay({ variants, selectedSubject, config, onSaveHistory }: Props) {
  const [activeTabId, setActiveTabId] = useState<string>(variants[0]?.id || 'var-bold');
  const [copiedBody, setCopiedBody] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const activeVariant = variants.find(v => v.id === activeTabId) || variants[0];
  const displaySubject = selectedSubject || activeVariant.subject;

  const handleCopy = () => {
    const fullText = `Subject: ${displaySubject}\n\n${activeVariant.body}`;
    navigator.clipboard.writeText(fullText);
    setCopiedBody(true);
    setTimeout(() => setCopiedBody(false), 2000);
  };

  const handleOpenInGmail = () => {
    const recipient = config.recipientName ? `${config.recipientName} <contact@${(config.recipientCompany || 'company').toLowerCase().replace(/\s+/g, '')}.com>` : '';
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent(displaySubject)}&body=${encodeURIComponent(activeVariant.body)}${recipient ? `&to=${encodeURIComponent(recipient)}` : ''}`;
    window.open(gmailUrl, '_blank');
  };

  const handleSave = () => {
    onSaveHistory(activeVariant);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="bg-[#131b2e] border border-indigo-500/20 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl font-mono">
      {/* Header & Variant Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            Generated A/B/C Email Variants
          </h3>
          <p className="text-xs text-slate-400 mt-1">3 stylistically distinct drafts matching your bullet points.</p>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap gap-1 bg-[#0b0f19] p-1 rounded-xl border border-slate-800 text-xs">
          {variants.map((v) => (
            <button
              key={v.id}
              onClick={() => setActiveTabId(v.id)}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${
                activeTabId === v.id
                  ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Email Preview Box */}
      <div className="bg-[#0b0f19] border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
        {/* Subject Header */}
        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1">
          <span className="text-[10px] text-indigo-400 uppercase font-bold tracking-wider block">Subject Line</span>
          <span className="text-white font-bold text-sm block">{displaySubject}</span>
        </div>

        {/* Body Text */}
        <div className="p-4 rounded-xl bg-[#131b2e]/40 border border-slate-800/60 text-xs text-slate-200 whitespace-pre-wrap leading-relaxed min-h-[160px]">
          {activeVariant.body}
        </div>

        {/* Metadata */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/60">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-indigo-400" />
              {activeVariant.wordCount} words
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-violet-400" />
              {activeVariant.readingTimeSeconds}s read time
            </span>
          </div>

          <span className="px-2.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 text-[10px]">
            {activeVariant.label}
          </span>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleCopy}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-xs transition-all shadow-lg shadow-indigo-500/20"
        >
          {copiedBody ? (
            <>
              <Check className="w-4 h-4 text-emerald-300" />
              <span>Copied to Clipboard!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copy Full Email</span>
            </>
          )}
        </button>

        <button
          onClick={handleOpenInGmail}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 text-xs font-bold transition-all"
        >
          <ExternalLink className="w-4 h-4" />
          <span>Open in Gmail</span>
        </button>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-indigo-500/50 text-xs font-bold transition-all"
        >
          {savedSuccess ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400">Saved!</span>
            </>
          ) : (
            <>
              <Bookmark className="w-4 h-4 text-indigo-400" />
              <span>Save Draft</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
