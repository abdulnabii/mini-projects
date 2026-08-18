'use client';

import { EmailVariant, EmailConfig } from '@/types';
import { Copy, Check, ExternalLink, Bookmark, Sparkles, Clock, FileText, Send, Mail, Smartphone, Monitor } from 'lucide-react';
import { useState } from 'react';

interface Props {
  variants: EmailVariant[];
  selectedSubject: string;
  config: EmailConfig;
  onSaveHistory: (variant: EmailVariant) => void;
}

export default function VariantDisplay({ variants, selectedSubject, config, onSaveHistory }: Props) {
  const [activeTabId, setActiveTabId] = useState<string>(variants[0]?.id || 'var-bold');
  const [clientView, setClientView] = useState<'gmail' | 'apple' | 'mobile'>('gmail');
  const [copiedBody, setCopiedBody] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const activeVariant = variants.find((v) => v.id === activeTabId) || variants[0];
  const displaySubject = selectedSubject || activeVariant.subject;

  const handleCopy = () => {
    let fullText = `Subject: ${displaySubject}\n\n${activeVariant.body}`;
    if (activeVariant.followUpDay3) {
      fullText += `\n\n--- 3-DAY FOLLOW UP ---\n${activeVariant.followUpDay3}`;
    }
    if (activeVariant.followUpDay7) {
      fullText += `\n\n--- 7-DAY FOLLOW UP ---\n${activeVariant.followUpDay7}`;
    }
    navigator.clipboard.writeText(fullText);
    setCopiedBody(true);
    setTimeout(() => setCopiedBody(false), 2000);
  };

  const handleOpenInGmail = () => {
    const recipient = config.recipientName
      ? `${config.recipientName} <contact@${(config.recipientCompany || 'company').toLowerCase().replace(/\s+/g, '')}.com>`
      : '';
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent(displaySubject)}&body=${encodeURIComponent(
      activeVariant.body
    )}${recipient ? `&to=${encodeURIComponent(recipient)}` : ''}`;
    window.open(gmailUrl, '_blank');
  };

  const handleSave = () => {
    onSaveHistory(activeVariant);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="bg-[#131b2e] border border-indigo-500/20 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl font-mono text-xs text-slate-300">
      {/* Header & Variant Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2 font-outfit">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            Generated A/B/C Email Variants &amp; Sequences
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            4 stylistically targeted drafts with multi-client rendering simulation.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap gap-1 bg-[#0b0f19] p-1 rounded-2xl border border-slate-800 text-xs">
          {variants.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => setActiveTabId(v.id)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all text-xs ${
                activeTabId === v.id
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>

      {/* Client Preview Bar */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-slate-500 font-bold uppercase">Client Simulation Preview</span>
        <div className="flex items-center gap-1 bg-[#0b0f19] p-1 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => setClientView('gmail')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
              clientView === 'gmail' ? 'bg-indigo-500 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Mail className="w-3 h-3" /> Gmail
          </button>
          <button
            type="button"
            onClick={() => setClientView('apple')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
              clientView === 'apple' ? 'bg-indigo-500 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Monitor className="w-3 h-3" /> Apple Mail
          </button>
          <button
            type="button"
            onClick={() => setClientView('mobile')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
              clientView === 'mobile' ? 'bg-indigo-500 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3 h-3" /> Mobile Push
          </button>
        </div>
      </div>

      {/* Main Email Preview Window */}
      {clientView === 'mobile' ? (
        <div className="max-w-sm mx-auto p-5 rounded-3xl bg-slate-950 border-2 border-slate-800 space-y-3 shadow-2xl">
          <div className="flex items-center justify-between text-[10px] text-slate-500 pb-2 border-b border-slate-900">
            <span className="font-bold uppercase flex items-center gap-1">
              <Mail className="w-3 h-3 text-indigo-400" /> Mail • now
            </span>
            <span>9:41 AM</span>
          </div>
          <div className="space-y-1">
            <span className="font-black text-white text-xs block font-outfit truncate">{config.senderName || 'Abdul Nabi'}</span>
            <span className="font-bold text-indigo-300 text-xs block font-outfit truncate">{displaySubject}</span>
            <p className="text-slate-400 text-[11px] line-clamp-3 leading-relaxed">{activeVariant.body}</p>
          </div>
        </div>
      ) : (
        <div className="bg-[#0b0f19] border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
          {/* Header Bar */}
          <div className="space-y-2 border-b border-slate-800 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center font-bold text-white text-xs">
                  {(config.senderName || 'AN').slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <span className="font-bold text-white block font-outfit text-xs">
                    {config.senderName || 'Abdul Nabi'}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    To: {config.recipientName || 'Recipient'} ({config.recipientCompany || 'Company'})
                  </span>
                </div>
              </div>
              <span className="text-[10px] text-slate-500">Today, 10:30 AM</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-indigo-400 uppercase font-bold tracking-wider block">Subject</span>
              <span className="text-white font-bold text-sm block font-outfit">{displaySubject}</span>
            </div>
          </div>

          {/* Body */}
          <div className="text-xs text-slate-200 whitespace-pre-wrap leading-relaxed min-h-[140px] font-sans">
            {activeVariant.body}
          </div>

          {/* Follow-up Sequence Addendum if present */}
          {activeVariant.followUpDay3 && (
            <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-3">
              <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 space-y-1">
                <span className="text-[10px] text-indigo-400 font-bold uppercase block">
                  Step 2: 3-Day Bump Message
                </span>
                <p className="text-slate-300 text-xs font-sans leading-relaxed">{activeVariant.followUpDay3}</p>
              </div>

              {activeVariant.followUpDay7 && (
                <div className="p-3.5 rounded-2xl bg-violet-500/10 border border-violet-500/30 space-y-1">
                  <span className="text-[10px] text-violet-400 font-bold uppercase block">
                    Step 3: 7-Day Breakup Email
                  </span>
                  <p className="text-slate-300 text-xs font-sans leading-relaxed">{activeVariant.followUpDay7}</p>
                </div>
              )}
            </div>
          )}

          {/* Stats Bar */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-3 border-t border-slate-800/80">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-indigo-400" />
                {activeVariant.wordCount} words
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-violet-400" />
                ~{activeVariant.readingTimeSeconds}s read
              </span>
            </div>

            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 text-[10px] font-bold">
              {activeVariant.label}
            </span>
          </div>
        </div>
      )}

      {/* Action Bar */}
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleCopy}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-400 hover:to-violet-400 text-white font-extrabold text-xs font-outfit uppercase tracking-wider transition-all shadow-lg shadow-indigo-500/20"
        >
          {copiedBody ? (
            <>
              <Check className="w-4 h-4 text-emerald-300" />
              <span>Copied to Clipboard!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copy Full Email Draft</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleOpenInGmail}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 text-xs font-bold transition-all"
        >
          <ExternalLink className="w-4 h-4" />
          <span>Open in Gmail</span>
        </button>

        <button
          type="button"
          onClick={handleSave}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-indigo-500/50 text-xs font-bold transition-all"
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
