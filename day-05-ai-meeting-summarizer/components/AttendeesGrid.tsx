import { Attendee } from "@/types";

export default function AttendeesGrid({ attendees }: { attendees: Attendee[] }) {
  if (!attendees.length) return <p className="text-slate-500 text-sm">No attendees listed.</p>;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {attendees.map((a, i) => (
        <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-slate-900/50 border border-slate-800">
          <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-xs font-bold shrink-0">
            {a.name.slice(0, 2).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm text-white font-medium truncate">{a.name}</p>
            <p className="text-xs text-slate-500 truncate">{a.role || 'Attendee'}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
