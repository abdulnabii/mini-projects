'use client';

import { useState } from 'react';
import { JournalEntry } from '@/types';
import { X, Download, FileText, Printer, Trash2, ShieldCheck, Check, AlertTriangle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  entries: JournalEntry[];
  onWipeAllData: () => void;
}

export default function ExportDataModal({ isOpen, onClose, entries, onWipeAllData }: Props) {
  const [copiedMd, setCopiedMd] = useState(false);
  const [confirmWipe, setConfirmWipe] = useState(false);

  if (!isOpen) return null;

  const generateMarkdownArchive = () => {
    return `# MindSanctuary.AI — Private Journal Archive
Exported on: ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
Total Entries: ${entries.length}

---

${entries
  .map(
    (e, idx) => `## Entry #${idx + 1}: ${e.title || 'Untitled Reflection'}
- **Date**: ${e.date}
- **Mood Tag**: ${e.moodTag}
- **Word Count**: ${e.wordCount} words

### 📝 Journal Content
${e.content}

${
  e.analysis
    ? `### 🧠 AI Emotional Intelligence Reflection
- **Primary Emotion**: ${e.analysis.primaryEmotion}
- **Empathy Reflection**: "${e.analysis.empathyReflection}"
- **Gentle Question**: "${e.analysis.gentlePromptQuestion}"
- **Daily Affirmation**: "${e.analysis.dailyAffirmation}"`
    : ''
}

---
`
  )
  .join('\n')}`;
  };

  const handleDownloadMarkdown = () => {
    const text = generateMarkdownArchive();
    const blob = new Blob([text], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mindsanctuary-journal-archive-${new Date().toISOString().split('T')[0]}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadJSON = () => {
    const json = JSON.stringify(entries, null, 2);
    const blob = new Blob([json], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mindsanctuary-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 font-mono text-xs text-slate-300">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0b1220] border-2 border-emerald-500/40 p-6 sm:p-8 space-y-6 shadow-2xl shadow-emerald-500/20">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base font-outfit">Private Data Export &amp; Portability</h3>
              <p className="text-[11px] text-slate-400">Your journal data belongs exclusively to you. Export or delete anytime.</p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Export Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={handleDownloadMarkdown}
            className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-emerald-500 text-center space-y-1 transition-all cursor-pointer shadow-sm group"
          >
            <FileText className="w-5 h-5 text-emerald-400 mx-auto group-hover:scale-110 transition-transform" />
            <span className="block font-bold text-white text-xs font-outfit">Download Markdown</span>
            <span className="text-[9px] text-slate-500">.md archive with reflections</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadJSON}
            className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-cyan-500 text-center space-y-1 transition-all cursor-pointer shadow-sm group"
          >
            <Download className="w-5 h-5 text-cyan-400 mx-auto group-hover:scale-110 transition-transform" />
            <span className="block font-bold text-white text-xs font-outfit">Download JSON</span>
            <span className="text-[9px] text-slate-500">Raw JSON data backup</span>
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-indigo-500 text-center space-y-1 transition-all cursor-pointer shadow-sm group"
          >
            <Printer className="w-5 h-5 text-indigo-400 mx-auto group-hover:scale-110 transition-transform" />
            <span className="block font-bold text-white text-xs font-outfit">Print to PDF</span>
            <span className="text-[9px] text-slate-500">Physical / PDF printout</span>
          </button>
        </div>

        {/* Danger Zone: Wipe All Data */}
        <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-3">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-xs font-outfit">
            <AlertTriangle className="w-4 h-4" />
            <span>Danger Zone: Permanent Local Deletion</span>
          </div>
          <p className="text-[11px] text-rose-200/80 font-sans leading-relaxed">
            Permanently erases all stored journal entries from this browser. This action cannot be undone.
          </p>

          {!confirmWipe ? (
            <button
              type="button"
              onClick={() => setConfirmWipe(true)}
              className="px-4 py-2 rounded-xl bg-rose-500/10 border border-rose-500/40 text-rose-300 hover:bg-rose-500 hover:text-white font-bold text-xs transition-all cursor-pointer"
            >
              Wipe All Journal History
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  onWipeAllData();
                  onClose();
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs shadow-lg hover:bg-rose-500 transition-all cursor-pointer"
              >
                Yes, Permanently Delete All
              </button>
              <button
                type="button"
                onClick={() => setConfirmWipe(false)}
                className="px-3 py-2 rounded-xl bg-slate-900 text-slate-400 text-xs font-bold"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end pt-1">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-bold hover:text-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
