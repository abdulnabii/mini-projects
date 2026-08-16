"use client";

import { useEffect, useState } from "react";
import { MeetingSession } from "@/types";
import { getSessions, deleteSession } from "@/lib/storage";
import MeetingResults from "@/components/MeetingResults";
import { Trash2, Search, ArrowLeft, Clock, Calendar } from "lucide-react";
import Link from "next/link";

export default function HistoryPage() {
  const [sessions, setSessions] = useState<MeetingSession[]>([]);
  const [search, setSearch] = useState("");
  const [selectedSession, setSelectedSession] = useState<MeetingSession | null>(null);

  useEffect(() => {
    setSessions(getSessions());
  }, []);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteSession(id);
    setSessions(getSessions());
    if (selectedSession?.id === id) setSelectedSession(null);
  };

  const filtered = sessions.filter(s => 
    s.title.toLowerCase().includes(search.toLowerCase()) || 
    s.transcriptSnippet.toLowerCase().includes(search.toLowerCase())
  );

  if (selectedSession) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 font-mono text-xs">
        <button
          onClick={() => setSelectedSession(null)}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-purple-500/40 transition-all font-bold"
        >
          <ArrowLeft className="w-4 h-4 text-purple-400" />
          <span>Back to Meeting History</span>
        </button>

        <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-2">
          <h2 className="text-xl sm:text-2xl font-black text-white font-outfit">{selectedSession.title}</h2>
          <p className="text-slate-400 text-xs flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-purple-400" />
            <span>{new Date(selectedSession.createdAt).toLocaleString()}</span>
          </p>
        </div>

        <MeetingResults data={selectedSession.intelligence} transcript={selectedSession.transcriptSnippet} />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-8 font-mono text-xs text-slate-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-white font-outfit">Meeting Intelligence Archive</h2>
          <p className="text-slate-400 mt-1">Search and review previously analyzed meeting dossiers.</p>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
          <input 
            type="text" 
            placeholder="Search meetings by title or keywords..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-80 pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>
      </div>

      {!sessions.length ? (
        <div className="text-center py-20 text-slate-500 space-y-3 bg-slate-950 rounded-3xl border border-slate-800 p-8">
          <Clock className="w-8 h-8 text-purple-400/50 mx-auto" />
          <p className="font-bold text-slate-400">No meeting history records saved yet.</p>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs font-outfit uppercase transition-all shadow-lg shadow-purple-500/20"
          >
            Analyze your first transcript
          </Link>
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map(session => (
            <div 
              key={session.id} 
              onClick={() => setSelectedSession(session)}
              className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-purple-500/40 cursor-pointer transition-all flex items-center justify-between group shadow-lg"
            >
              <div className="space-y-1 overflow-hidden pr-4">
                <h3 className="font-bold text-white group-hover:text-purple-300 transition-colors font-outfit text-sm truncate">
                  {session.title}
                </h3>
                <p className="text-[10px] text-slate-500">{new Date(session.createdAt).toLocaleDateString()}</p>
                <p className="text-xs text-slate-400 line-clamp-1">{session.transcriptSnippet}</p>
              </div>
              <button 
                onClick={(e) => handleDelete(session.id, e)}
                className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors opacity-0 group-hover:opacity-100 shrink-0"
                title="Delete Session"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
