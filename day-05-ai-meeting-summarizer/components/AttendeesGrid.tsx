'use client';

import { Attendee } from "@/types";

export default function AttendeesGrid({ attendees }: { attendees: Attendee[] }) {
  if (!attendees.length) return <p className="text-slate-500 text-xs">No attendees identified.</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 font-mono text-xs">
      {attendees.map((a, i) => (
        <div
          key={i}
          className="flex items-center gap-3 p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-purple-500/30 transition-all"
        >
          <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-300 flex items-center justify-center text-xs font-black shrink-0 font-outfit shadow-md">
            {a.name.slice(0, 2).toUpperCase()}
          </div>
          <div className="overflow-hidden space-y-0.5">
            <p className="text-xs text-white font-bold truncate font-outfit">{a.name}</p>
            <p className="text-[10px] text-slate-400 truncate">{a.role || 'Participant'}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
