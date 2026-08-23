'use client';

import { useState } from 'react';
import { ScheduledDraft, ReviewComment } from '@/types';
import {
  Users,
  X,
  MessageSquare,
  CheckCircle2,
  Share2,
  Copy,
  Check,
  Send,
  ShieldCheck,
  Clock,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  draft: ScheduledDraft | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateDraft: (updated: ScheduledDraft) => void;
}

export default function CollaborationModal({
  draft,
  isOpen,
  onClose,
  onUpdateDraft,
}: Props) {
  const [commentText, setCommentText] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen || !draft) return null;

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment: ReviewComment = {
      id: 'comm_' + Date.now(),
      author: 'Lead Marketing Reviewer',
      role: 'Content Lead',
      text: commentText.trim(),
      createdAt: new Date().toISOString(),
    };

    const currentComments = draft.reviewComments || [];
    const updatedDraft: ScheduledDraft = {
      ...draft,
      reviewComments: [...currentComments, newComment],
    };

    onUpdateDraft(updatedDraft);
    setCommentText('');
  };

  const handleStatusChange = (newStatus: 'draft' | 'review_requested' | 'approved') => {
    const updatedDraft: ScheduledDraft = {
      ...draft,
      approvalStatus: newStatus,
    };
    onUpdateDraft(updatedDraft);

    if (newStatus === 'approved') {
      confetti({
        particleCount: 30,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#10b981', '#06b6d4'],
      });
    }
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(
      `https://day-25-ai-content-studio.vercel.app/preview?draftId=${draft.id}`
    );
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150 font-mono">
      <div className="relative w-full max-w-xl rounded-3xl bg-[#0d1117] border-2 border-purple-500/40 p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base font-outfit">
                Team Collaboration &amp; Review Workflow
              </h3>
              <p className="text-xs text-slate-400 truncate max-w-xs sm:max-w-md">
                {draft.title}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Shareable Link Box */}
        <div className="p-4 rounded-2xl bg-[#161b22] border border-slate-800 space-y-2 text-xs">
          <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1.5">
            <Share2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Shareable Review Link (Read-Only Preview):</span>
          </span>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={`https://day-25-ai-content-studio.vercel.app/preview?draftId=${draft.id}`}
              className="flex-1 p-2.5 rounded-xl bg-[#0d1117] border border-slate-800 text-slate-300 text-xs font-mono"
            />
            <button
              type="button"
              onClick={copyShareLink}
              className="px-3.5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs transition-colors flex items-center gap-1 cursor-pointer"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Approval Status Switcher */}
        <div className="space-y-2">
          <span className="text-[10px] text-slate-400 font-bold uppercase">
            Workflow Approval Stage:
          </span>
          <div className="grid grid-cols-3 gap-2 text-xs">
            {(['draft', 'review_requested', 'approved'] as const).map((st) => {
              const isSelected = (draft.approvalStatus || 'draft') === st;
              return (
                <button
                  key={st}
                  type="button"
                  onClick={() => handleStatusChange(st)}
                  className={`py-2 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer ${
                    isSelected
                      ? st === 'approved'
                        ? 'bg-emerald-500 text-black font-black shadow-md'
                        : st === 'review_requested'
                        ? 'bg-amber-500 text-black font-black shadow-md'
                        : 'bg-slate-700 text-white font-bold'
                      : 'bg-[#161b22] border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {st.replace('_', ' ')}
                </button>
              );
            })}
          </div>
        </div>

        {/* Review Comments Thread */}
        <div className="space-y-3">
          <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
            <span>Team Review Comments ({draft.reviewComments?.length || 0}):</span>
          </span>

          {(!draft.reviewComments || draft.reviewComments.length === 0) && (
            <p className="text-xs text-slate-500 py-3 text-center">
              No review comments yet. Leave feedback for the writer below.
            </p>
          )}

          <div className="space-y-2 max-h-48 overflow-y-auto">
            {draft.reviewComments?.map((c) => (
              <div
                key={c.id}
                className="p-3.5 rounded-xl bg-[#161b22] border border-slate-800 space-y-1 text-xs"
              >
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-bold text-cyan-400">{c.author} ({c.role})</span>
                  <span className="text-slate-500">
                    {new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-slate-200 font-sans">{c.text}</p>
              </div>
            ))}
          </div>

          {/* Add Comment Form */}
          <form onSubmit={handleAddComment} className="flex items-center gap-2 pt-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="e.g. Looks great, let's strengthen the CTA on Tweet #7..."
              className="flex-1 p-3 rounded-xl bg-[#161b22] border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500/50"
            />
            <button
              type="submit"
              disabled={!commentText.trim()}
              className="px-4 py-3 rounded-xl bg-purple-500 hover:bg-purple-400 text-black font-extrabold text-xs transition-all disabled:opacity-40 cursor-pointer flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Comment</span>
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end pt-2 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white cursor-pointer"
          >
            Close Collaboration Panel
          </button>
        </div>
      </div>
    </div>
  );
}
