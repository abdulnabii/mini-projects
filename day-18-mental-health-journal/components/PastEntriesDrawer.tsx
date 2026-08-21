'use client';

import { JournalEntry } from '@/types';
import { getMoodBadgeProps } from '@/lib/journalEngine';
import { BookOpen, Calendar, Trash2, Heart, Sparkles, ChevronRight } from 'lucide-react';

interface Props {
  entries: JournalEntry[];
  onSelectEntry: (entry: JournalEntry) => void;
  onDeleteEntry: (id: string) => void;
  selectedEntryId?: string;
}

export default function PastEntriesDrawer({
  entries,
  onSelectEntry,
  onDeleteEntry,
  selectedEntryId,
}: Props) {
  return (
    <div className="space-y-4 font-mono text-xs text-slate-300">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-white text-sm font-outfit flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-emerald-400" />
          My Private Journal History ({entries.length} Entries)
        </h3>
        <span className="text-[10px] text-slate-500">Stored locally in your browser</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {entries.map((entry) => {
          const badge = getMoodBadgeProps(entry.moodTag);
          const isSelected = selectedEntryId === entry.id;

          return (
            <div
              key={entry.id}
              onClick={() => onSelectEntry(entry)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-3 shadow-md ${
                isSelected
                  ? 'bg-emerald-950/30 border-emerald-400 shadow-emerald-500/10'
                  : 'bg-slate-950/90 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[9px] font-bold border flex items-center gap-1 ${badge.bg} ${badge.border} ${badge.color}`}
                  >
                    <span>{badge.emoji}</span>
                    <span>{entry.moodTag}</span>
                  </span>

                  <span className="text-[9px] text-slate-500 flex items-center gap-1">
                    <Calendar className="w-2.5 h-2.5" />
                    {entry.date}
                  </span>
                </div>

                <h4 className="font-bold text-white text-xs font-outfit line-clamp-1">
                  {entry.title || 'Quiet Reflection'}
                </h4>

                <p className="text-[11px] text-slate-400 line-clamp-3 font-sans leading-relaxed">
                  {entry.content}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-slate-900 pt-2 text-[10px]">
                <span className="text-slate-500">{entry.wordCount} words</span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteEntry(entry.id);
                    }}
                    className="p-1 text-slate-600 hover:text-rose-400 transition-colors"
                    title="Delete entry"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>

                  <span className="text-emerald-400 font-bold flex items-center gap-0.5">
                    <span>View AI Reflection</span>
                    <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
