'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ScheduledDraft } from '@/types';
import { getSavedDrafts, deleteDraft, saveDraft } from '@/lib/storage';
import { TwitterIcon, LinkedInIcon } from '@/components/PlatformIcons';
import {
  Calendar,
  Layers,
  Trash2,
  ExternalLink,
  Download,
  ArrowLeft,
  Clock,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function HistoryPage() {
  const [drafts, setDrafts] = useState<ScheduledDraft[]>([]);

  useEffect(() => {
    setDrafts(getSavedDrafts());
  }, []);

  const handleDelete = (id: string) => {
    const updated = deleteDraft(id);
    setDrafts(updated);
  };

  const handleStatusChange = (id: string, newStatus: ScheduledDraft['status']) => {
    const draft = drafts.find((d) => d.id === id);
    if (!draft) return;
    const updatedDraft: ScheduledDraft = { ...draft, status: newStatus };
    const updated = saveDraft(updatedDraft);
    setDrafts(updated);

    if (newStatus === 'published') {
      confetti({
        particleCount: 25,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#10b981', '#38bdf8'],
      });
    }
  };

  const exportQueueJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(drafts, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `threadgenius_content_queue_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-8 font-mono w-full min-w-0">
      {/* Back to Studio link */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Content Studio</span>
      </Link>

      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0d1117] border border-emerald-500/30 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs">
              <Calendar className="w-3.5 h-3.5" />
              <span>CONTENT CALENDAR &amp; DRAFTS QUEUE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-outfit">
              Scheduled Posts &amp; Draft Pipeline
            </h2>
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              Manage your upcoming Twitter threads, LinkedIn thought leadership posts, and slide carousels.
            </p>
          </div>

          {drafts.length > 0 && (
            <button
              type="button"
              onClick={exportQueueJson}
              className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-200 hover:text-white flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export Queue JSON</span>
            </button>
          )}
        </div>
      </div>

      {/* Drafts List */}
      {drafts.length === 0 ? (
        <div className="p-12 rounded-3xl bg-[#0d1117] border border-dashed border-slate-800 text-center space-y-3">
          <p className="text-sm text-slate-400">
            No saved drafts or scheduled posts yet.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 text-black font-extrabold text-xs shadow-md"
          >
            <Sparkles className="w-4 h-4" />
            <span>Create Your First Post</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {drafts.map((d) => {
            const badgeColor =
              d.platform === 'twitter'
                ? 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10'
                : d.platform === 'linkedin'
                ? 'text-blue-400 border-blue-500/30 bg-blue-500/10'
                : 'text-purple-400 border-purple-500/30 bg-purple-500/10';

            return (
              <div
                key={d.id}
                className="p-6 rounded-3xl bg-[#0d1117] border border-slate-800 space-y-4 shadow-xl flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold uppercase flex items-center gap-1.5 ${badgeColor}`}
                    >
                      {d.platform === 'twitter' ? (
                        <TwitterIcon className="w-3 h-3 fill-cyan-400" />
                      ) : d.platform === 'linkedin' ? (
                        <LinkedInIcon className="w-3 h-3 fill-blue-400" />
                      ) : (
                        <Layers className="w-3 h-3" />
                      )}
                      <span>{d.platform}</span>
                    </span>

                    <button
                      type="button"
                      onClick={() => handleDelete(d.id)}
                      className="text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                      title="Delete draft"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h3 className="font-bold text-white text-sm font-outfit line-clamp-2">
                    {d.title}
                  </h3>

                  <div className="p-2.5 rounded-xl bg-[#161b22] border border-slate-800 text-[11px] text-slate-300">
                    {d.contentSummary}
                  </div>
                </div>

                {/* Status Switcher & Date */}
                <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Status:</span>
                    <select
                      value={d.status}
                      onChange={(e) =>
                        handleStatusChange(d.id, e.target.value as ScheduledDraft['status'])
                      }
                      className="p-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-none cursor-pointer"
                    >
                      <option value="draft">Draft</option>
                      <option value="scheduled">Scheduled 📅</option>
                      <option value="published">Published 🎉</option>
                    </select>
                  </div>

                  <div className="text-[10px] text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-cyan-400" />
                    <span>Created: {new Date(d.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
