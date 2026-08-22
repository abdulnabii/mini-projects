'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ContributionTarget, ContributionStatus } from '@/types';
import ContributionPipeline from '@/components/ContributionPipeline';
import { BookmarkCheck, ArrowLeft, Plus } from 'lucide-react';

const STORAGE_BOOKMARKS_KEY = 'gitmatch_bookmarked_targets';

export default function BookmarksPage() {
  const [targets, setTargets] = useState<ContributionTarget[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_BOOKMARKS_KEY);
      if (raw) {
        setTargets(JSON.parse(raw));
      } else {
        // Initial sample targets if empty
        const initialSamples: ContributionTarget[] = [
          {
            id: 'target_1',
            projectFullName: 'shadcn-ui/ui',
            projectUrl: 'https://github.com/shadcn-ui/ui',
            status: 'forked',
            issueTitle: 'docs: Carousel RTL orientation preview',
            addedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: 'target_2',
            projectFullName: 'vercel/ai',
            projectUrl: 'https://github.com/vercel/ai',
            status: 'targeted',
            addedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: 'target_3',
            projectFullName: 'calcom/cal.com',
            projectUrl: 'https://github.com/calcom/cal.com',
            status: 'merged',
            issueTitle: 'i18n: Add missing translation strings',
            addedAt: new Date(Date.now() - 86400000 * 10).toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ];
        setTargets(initialSamples);
        localStorage.setItem(STORAGE_BOOKMARKS_KEY, JSON.stringify(initialSamples));
      }
    } catch (e) {
      console.error('Failed to load targets:', e);
    }
  }, []);

  const handleUpdateStatus = (id: string, newStatus: ContributionStatus) => {
    const updated = targets.map((t) =>
      t.id === id ? { ...t, status: newStatus, updatedAt: new Date().toISOString() } : t
    );
    setTargets(updated);
    try {
      localStorage.setItem(STORAGE_BOOKMARKS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save targets:', e);
    }
  };

  const handleRemoveTarget = (id: string) => {
    const updated = targets.filter((t) => t.id !== id);
    setTargets(updated);
    try {
      localStorage.setItem(STORAGE_BOOKMARKS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to remove target:', e);
    }
  };

  return (
    <div className="space-y-8 font-mono w-full min-w-0">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0d1117] border border-emerald-500/30 shadow-2xl space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs">
          <BookmarkCheck className="w-3.5 h-3.5" />
          <span>PERSONAL CONTRIBUTION ROADMAP</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white font-outfit">
          My Open Source Contribution Pipeline
        </h2>
        <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
          Track your active Pull Request milestones from initial repository discovery to code fork, PR review submission, and final merge celebrations.
        </p>
      </div>

      {/* Kanban Pipeline Component */}
      <ContributionPipeline
        targets={targets}
        onUpdateStatus={handleUpdateStatus}
        onRemoveTarget={handleRemoveTarget}
      />
    </div>
  );
}
